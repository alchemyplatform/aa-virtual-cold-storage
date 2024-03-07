import { AlchemySettings, Network } from 'alchemy-sdk';

export function getRpcUrl() {
  // This should run in the client only. Without this check, the build fails.
  if (typeof window === 'undefined') {
    return '';
  }

  return `/api/rpc`;
}

export function getApiUrl(nft?: boolean) {
  // This should run in the client only. Without this check, the build fails.
  if (typeof window === 'undefined') {
    return '';
  }

  return `/api${nft ? '/nfts' : ''}`;
}

export const getAlchemySettings = (nft?: boolean): AlchemySettings => {
  if (typeof window !== 'undefined') {
    return {
      network: Network.ARB_SEPOLIA,
      url: getApiUrl(nft)
    };
  }

  return { network: Network.ARB_SEPOLIA, apiKey: '6-7bbRdhqAvOKomY2JhAladgpGf7AQzR' /*env.ALCHEMY_API_KEY*/ };
};
