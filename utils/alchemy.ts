import { Alchemy, Network } from 'alchemy-sdk';

export function getRpcUrl() {
  // This should run in the browser only. Without this check, the build fails.
  if (typeof window === 'undefined') {
    return '';
  }

  return `/api/rpc`;
}

export const alchemy = new Alchemy({
  network: Network.ARB_SEPOLIA,
  url: getRpcUrl()
});
