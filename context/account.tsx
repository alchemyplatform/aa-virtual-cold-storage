'use client';

import { AlchemyModularAccountClient, useAlchemyModularAccountClient } from '@/hooks/useAlchemyModularAccountClient';
import { useAlchemySigner } from '@/hooks/useAlchemySigner';
import { MultiOwnerModularAccount } from '@alchemy/aa-accounts';
import { AlchemySigner, User } from '@alchemy/aa-alchemy';
import { ReactNode, createContext, useContext, useEffect } from 'react';

type AlchemyAccountContextProps = {
  // Functions

  // Properties
  client: AlchemyModularAccountClient | undefined;
  account: MultiOwnerModularAccount<AlchemySigner> | undefined;
  user: User | undefined;
};

const defaultUnset: any = null;
const AlchemyAccountContext = createContext<AlchemyAccountContextProps>({
  // Default Values
  client: defaultUnset,
  account: defaultUnset,
  user: defaultUnset
});

export const useAlchemyAccountContext = () => useContext(AlchemyAccountContext);

export const AlchemyAccountProvider = ({ children }: { children: ReactNode }) => {
  const { user, alchemySigner } = useAlchemySigner();
  const { client, connect } = useAlchemyModularAccountClient();

  useEffect(() => {
    if (!user || !client || client.account) return;

    async function init(signer: AlchemySigner) {
      return connect(signer);
    }

    alchemySigner
      .then((signer) => {
        if (!signer) {
          return;
        }
        return init(signer).then((_client) => console.log('[Alchemy Account] active', _client.account.address));
      })
      .catch((e) => console.error('[Alchemy Account] error', e));
  }, [alchemySigner, client, client?.account, connect, user]);

  return (
    <AlchemyAccountContext.Provider
      value={{
        user,
        account: client?.account,
        client
      }}
    >
      {children}
    </AlchemyAccountContext.Provider>
  );
};
