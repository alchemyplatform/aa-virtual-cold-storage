import { getAlchemySettings } from '@/utils/alchemy';
import { NextResponse } from 'next/server';

// Next.js edge runtime
// https://nextjs.org/docs/pages/api-reference/edge
// export const runtime = 'edge';
// export const preferredRegion = 'iad1';

const config = getAlchemySettings();
const baseUrl = `https://${config.network}.g.alchemy.com/v2/${config.apiKey}`;

export async function GET(req: Request) {
  const { pathname, searchParams } = new URL(req.url);
  const method = pathname.substring(pathname.lastIndexOf('/') + 1);
  const res = await fetch(`${baseUrl}/${method}?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      ...req.headers
    }
  });

  if (!res.ok) {
    return NextResponse.json(await res.json().catch(console.error), {
      status: res.status
    });
  }

  return NextResponse.json(await res.json(), {
    status: 200,
    headers: { 'Cache-Control': 'max-age=1, stale-while-revalidate=300' }
  });
}

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
