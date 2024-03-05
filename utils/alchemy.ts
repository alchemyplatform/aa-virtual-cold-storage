import { env } from '@/env.mjs';
import { AlchemySettings, Network } from 'alchemy-sdk';

export function getRpcUrl() {
  // This should run in the client only. Without this check, the build fails.
  if (typeof window === 'undefined') {
    return '';
  }

  return `/api/rpc`;
}

export const getAlchemySettings = (): AlchemySettings => {
  if (typeof window !== 'undefined') {
    return {
      network: Network.ARB_SEPOLIA,
      url: getRpcUrl()
    };
  }

  return { network: Network.ARB_SEPOLIA, apiKey: env.ALCHEMY_API_KEY };
};
