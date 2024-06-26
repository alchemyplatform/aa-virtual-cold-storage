import { getAlchemySettings } from '@/utils/alchemy';
import { NextResponse } from 'next/server';

// Next.js edge runtime
// https://nextjs.org/docs/pages/api-reference/edge
// export const runtime = 'edge';
// export const preferredRegion = 'iad1';

const config = getAlchemySettings(false);
const baseUrl = `https://${config.network}.g.alchemy.com/v2/${config.apiKey}`;

export async function POST(req: Request) {
  const body = await req.json().catch(console.error);

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      ...req.headers
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    return NextResponse.json(await res.json().catch(console.error), {
      status: res.status
    });
  }

  return NextResponse.json(await res.json());
}
