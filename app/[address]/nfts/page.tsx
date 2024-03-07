import { Nfts, Page } from '@/components/nfts';
import { getAlchemySettings } from '@/utils/alchemy';
import { PAGE_SIZE } from '@/utils/constants';
import { Flex } from '@chakra-ui/react';
import { Alchemy, NftOrdering, OwnedNftsResponse } from 'alchemy-sdk';
import Link from 'next/link';
import { Address } from 'viem';

const alchemy = new Alchemy(getAlchemySettings(true));

export default async function Page({
  params: { address },
  searchParams: { pageKey, pageSize = PAGE_SIZE }
}: {
  params: { address: Address };
  searchParams: { pageKey?: string; pageSize?: number | undefined };
}) {
  const {
    ownedNfts: items,
    pageKey: nextPageKey,
    totalCount
  }: OwnedNftsResponse = await alchemy.nft.getNftsForOwner(address, {
    pageKey,
    pageSize,
    excludeFilters: [
      /*NftFilters.SPAM*/
    ],
    orderBy: NftOrdering.TRANSFERTIME
  });
  const totalNumberOfPages = Math.ceil(totalCount / pageSize);

  const page: Page = {
    pageSize,
    prevPageKey: pageKey,
    nextPageKey,
    totalNumberOfPages
  };

  return (
    <>
      <Nfts address={address} items={items} page={page} />
      {page.totalNumberOfPages > 1 && (
        <Flex justifyContent="center" mt={8}>
          <Flex gap={4} alignItems="center">
            {!!page.prevPageKey && <Link href={`/${address}/nfts?pageKey=${page.prevPageKey}`}>Previous</Link>}
            {page.nextPageKey && <Link href={`/${address}/nfts?pageKey=${page.prevPageKey}`}>Next</Link>}
          </Flex>
        </Flex>
      )}
    </>
  );
}
