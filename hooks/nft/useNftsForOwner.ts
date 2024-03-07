'use client';

import { getAlchemySettings } from '@/utils/alchemy';
import { PAGE_SIZE } from '@/utils/constants';
import { AlchemySmartAccountClient, alchemyEnhancedApiActions } from '@alchemy/aa-alchemy';
import {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  RefetchOptions,
  useInfiniteQuery
} from '@tanstack/react-query';
import { Alchemy, NftOrdering, OwnedNft, OwnedNftsResponse } from 'alchemy-sdk';
import { flatten, last } from 'lodash';
import { useMemo } from 'react';
import { Address } from 'viem';

const alchemy = new Alchemy(getAlchemySettings(true));

export type NftsForOwnerResponse = {
  pageSize: number;
  pageItems: Array<OwnedNft>;
  totalItems: Array<OwnedNft>;
  totalNumberOfPages: number;
  fetchNextPage?: (options?: FetchPreviousPageOptions | undefined) => Promise<any>;
  hasNextPage: boolean;
  nextPageKey?: string | undefined;
  fetchPreviousPage?: (options?: FetchNextPageOptions | undefined) => Promise<any>;
  hasPreviousPage: boolean;
  prevPageKey?: string | undefined;
  refetch: (options?: RefetchOptions | undefined) => Promise<any>;
  isLoading: boolean;
  error?: Error | null;
};

const useNftsForOwner = ({
  client,
  address,
  pageSize = PAGE_SIZE
}: {
  client: AlchemySmartAccountClient;
  address: Address;
  pageSize?: number;
}): NftsForOwnerResponse => {
  /*
   * isLoading or status === 'loading' - The query has no data yet
   * isError or status === 'error' - The query encountered an error
   * isSuccess or status === 'success' - The query was successful and data is available
   * isFetching - the query is fetching at any time (including background refetching)
   *
   * The status gives information about the data: Do we have any or not
   * The fetchStatus gives information about the query: Is it running or not
   */
  const {
    data = { pages: [], pageParams: [] },
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    refetch,
    error
  } = useInfiniteQuery<
    OwnedNftsResponse & { prevPageKey?: string },
    Error,
    InfiniteData<OwnedNftsResponse & { prevPageKey?: string }, string | undefined>,
    Array<string>,
    string | undefined
  >({
    queryKey: ['nfts-for-owner', address],
    queryFn: async ({ pageParam }) => {
      return await client
        .extend(alchemyEnhancedApiActions(alchemy))
        .nft.getNftsForOwner(address, {
          pageKey: pageParam,
          pageSize,
          excludeFilters: [
            /*NftFilters.SPAM*/
          ],
          orderBy: NftOrdering.TRANSFERTIME
        })
        .then((res) => ({ ...res, prevPageKey: pageParam }));
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pageKey,
    getPreviousPageParam: (firstPage) => firstPage.prevPageKey
  });

  const { pageItems, prevPageKey, nextPageKey, totalItems, totalNumberOfPages } = useMemo(
    () => ({
      pageItems: last(data.pages)?.ownedNfts ?? [],
      prevPageKey: last(data.pages)?.prevPageKey,
      nextPageKey: last(data.pages)?.pageKey,
      totalItems: flatten(data.pages.map((x) => x.ownedNfts)),
      totalNumberOfPages: Math.ceil((last(data.pages)?.totalCount ?? 0) / pageSize)
    }),
    [data.pages, pageSize]
  );

  const isLoading = useMemo(
    () => isFetching || isFetchingNextPage || isFetchingPreviousPage,
    [isFetching, isFetchingNextPage, isFetchingPreviousPage]
  );

  return {
    pageSize,
    pageItems,
    totalItems,
    totalNumberOfPages,
    fetchNextPage,
    hasNextPage,
    prevPageKey,
    nextPageKey,
    fetchPreviousPage,
    hasPreviousPage,
    refetch,
    isLoading,
    error
  };
};

export default useNftsForOwner;
