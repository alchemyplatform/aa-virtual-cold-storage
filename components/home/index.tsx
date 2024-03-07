'use client';

import { useAccountContext } from '@/context/account';
import { useSignerContext } from '@/context/account/signer';
import useNftsForOwner, { NftsForOwnerResponse } from '@/hooks/nft/useNftsForOwner';
import { Flex } from '@chakra-ui/react';
import { ArrowButton } from '../base/ArrowButton';
import { Nfts, Page } from '../nfts';

export const Home = () => {
  const { client } = useAccountContext();
  const { account } = useSignerContext();

  const {
    pageItems,
    prevPageKey,
    nextPageKey,
    totalNumberOfPages,
    pageSize,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    isLoading
  }: NftsForOwnerResponse = useNftsForOwner({ client: client!, address: account!.address });

  const page: Page = {
    pageSize,
    prevPageKey,
    nextPageKey,
    totalNumberOfPages
  };

  return (
    <>
      <Nfts address={account!.address} items={pageItems} page={page} isLoading={isLoading} size={256} />
      <Flex gap={4} justifyContent="center" mt={8} alignItems="center">
        {hasPreviousPage && fetchPreviousPage && (
          <ArrowButton onClick={() => fetchPreviousPage()} size="sm" direction="left" />
        )}
        {hasNextPage && fetchNextPage && <ArrowButton onClick={() => fetchNextPage()} size="sm" direction="right" />}
      </Flex>
    </>
  );
};
