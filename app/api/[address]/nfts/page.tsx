import { Nfts, Page } from '@/components/nfts';
import { getAlchemy } from '@/utils/alchemy';
import { PAGE_SIZE } from '@/utils/constants';
import { NftFilters, NftOrdering, OwnedNftsResponse } from 'alchemy-sdk';
import { Address } from 'viem';

const alchemy = getAlchemy();

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
  }: OwnedNftsResponse = await alchemy!.nft.getNftsForOwner(address, {
    pageKey,
    pageSize,
    excludeFilters: [NftFilters.SPAM],
    orderBy: NftOrdering.TRANSFERTIME
  });
  const totalNumberOfPages = Math.ceil(totalCount / pageSize);

  const page: Page = {
    address,
    pageSize,
    prevPageKey: pageKey,
    nextPageKey,
    totalNumberOfPages
  };

  return <Nfts items={items} page={page} />;
}
