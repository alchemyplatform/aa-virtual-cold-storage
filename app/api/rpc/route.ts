import { ALCHEMY_RPC_URL } from '@/utils/constants';
import { NextResponse } from 'next/server';

// Next.js edge runtime
// https://nextjs.org/docs/pages/api-reference/edge
export const runtime = 'edge';
export const preferredRegion = 'iad1';

export async function POST(req: Request) {
  const res = await fetch(ALCHEMY_RPC_URL, {
    method: 'POST',
    headers: {
      ...req.headers
    },
    body: JSON.stringify(await req.json())
  });

  return NextResponse.json(await res.json());
}
