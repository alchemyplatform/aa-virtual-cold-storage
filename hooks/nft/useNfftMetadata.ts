'use client';

import { getAlchemySettings } from '@/utils/alchemy';
import { AlchemySmartAccountClient, alchemyEnhancedApiActions } from '@alchemy/aa-alchemy';
import { RefetchOptions, useQuery } from '@tanstack/react-query';
import { Alchemy, Nft } from 'alchemy-sdk';
import { Address } from 'viem';

const alchemy = new Alchemy(getAlchemySettings(true));

export type NftMetadataResponse = {
  data: Nft | undefined;
  refetch: (options?: RefetchOptions | undefined) => Promise<any>;
  isLoading: boolean;
  error?: Error | null;
};

const useNftMetadata = ({
  client,
  address,
  tokenId
}: {
  client: AlchemySmartAccountClient;
  address: Address;
  tokenId: string;
}): NftMetadataResponse => {
  /*
   * isLoading or status === 'loading' - The query has no data yet
   * isError or status === 'error' - The query encountered an error
   * isSuccess or status === 'success' - The query was successful and data is available
   * isFetching - the query is fetching at any time (including background refetching)
   *
   * The status gives information about the data: Do we have any or not
   * The fetchStatus gives information about the query: Is it running or not
   */
  const { data, isFetching, refetch, error } = useQuery<Nft, Error, Nft, Array<string>>({
    queryKey: ['nft-metadata', address, tokenId],
    queryFn: async () => client.extend(alchemyEnhancedApiActions(alchemy)).nft.getNftMetadata(address, tokenId)
  });

  return {
    data,
    isLoading: isFetching,
    refetch,
    error
  };
};

export default useNftMetadata;
