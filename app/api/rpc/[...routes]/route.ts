// Next.js edge runtime
// https://nextjs.org/docs/pages/api-reference/edge
// export const runtime = 'edge';
// export const preferredRegion = 'iad1';

import { NextResponse } from 'next/server';
import { env } from 'process';

export async function POST(req: Request, { params }: { params: { routes: string[] } }) {
  const body = await req.json().catch(console.error);

  const res = await fetch(`https://api.g.alchemy.com/${params.routes.join('/')}`, {
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
