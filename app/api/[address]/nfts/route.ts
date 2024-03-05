import { Page } from '@/components/nfts';
import { getAlchemySettings } from '@/utils/alchemy';
import { PAGE_SIZE } from '@/utils/constants';
import { Alchemy, NftFilters, NftOrdering, OwnedNftsResponse } from 'alchemy-sdk';

// Next.js edge runtime
// https://nextjs.org/docs/pages/api-reference/edge
export const runtime = 'edge';
export const preferredRegion = 'iad1';

const alchemy = new Alchemy(getAlchemySettings());

export async function GET(req: Request) {
  const { pathname, searchParams } = new URL(req.url);
  const address = pathname.split('/')[0];
  const pageKey = searchParams.get('pageKey') || undefined;
  const _pageSize = searchParams.get('pageSize');
  const pageSize = _pageSize != null ? parseInt(_pageSize) : PAGE_SIZE;

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
    pageSize,
    prevPageKey: pageKey,
    nextPageKey,
    totalNumberOfPages
  };

  return new Response(JSON.stringify({ address, items, page }), {
    headers: { 'Cache-Control': 'max-age=1, stale-while-revalidate=300' }
  });
}
