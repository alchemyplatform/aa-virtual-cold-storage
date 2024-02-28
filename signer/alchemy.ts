'use client';

'use client';

import { ALCHEMY_ACCESS_KEY } from '@/utils/constants';
import { AlchemySigner } from '@alchemy/aa-alchemy';

export const createAlchemySigner = async (iframeContainerId: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const signer = new AlchemySigner({
    client: {
      // This is created in your dashboard under `https://dashboard.alchemy.com/settings/access-keys`
      // NOTE: it is not recommended to expose your API key on the client, instead proxy requests to your backend and set the `rpcUrl`
      // here to point to your backend.
      connection: { apiKey: ALCHEMY_ACCESS_KEY },
      iframeConfig: {
        iframeContainerId
      }
    }
  });

  return signer;
};
