import { env } from '@/env.mjs';
import { Alchemy, Network } from 'alchemy-sdk';

export function getRpcUrl() {
  // This should run in the client only. Without this check, the build fails.
  if (typeof window === 'undefined') {
    return '';
  }

  return `/api/rpc`;
}

export const alchemy = new Alchemy({
  network: Network.ARB_SEPOLIA,
  url: getRpcUrl()
});

let instance: Alchemy | undefined = undefined;

// This should run in the server only.
export const getAlchemy = () => {
  if (typeof window !== 'undefined') {
    return undefined;
  }

  if (instance) return instance;

  instance = new Alchemy({ network: Network.ARB_SEPOLIA, apiKey: env.ALCHEMY_API_KEY });
  return instance;
};
