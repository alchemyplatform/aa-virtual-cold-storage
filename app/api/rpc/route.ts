import { ALCHEMY_RPC_URL } from '@/utils/constants';
import { NextResponse } from 'next/server';

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
