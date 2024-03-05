import { env } from '@/env.mjs';
import { NextResponse } from 'next/server';

// Next.js edge runtime
// https://nextjs.org/docs/pages/api-reference/edge
// export const runtime = 'edge';
// export const preferredRegion = 'iad1';

export async function POST(req: Request, { params }: { params: { routes: string[] } }) {
  const body = await req.json().catch(console.error);

  const res = await fetch(env.ALCHEMY_API_URL + `/${params.routes.join('/')}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.ALCHEMY_API_KEY}`,
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
