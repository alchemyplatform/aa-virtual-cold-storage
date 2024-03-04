'use client';

import { publicClient } from '@/client';
import { env } from '@/env.mjs';
import {
  AccountLoupeActions,
  MultiOwnerPluginActions,
  PluginManagerActions,
  accountLoupeActions,
  multiOwnerPluginActions,
  pluginManagerActions,
  type MultiOwnerModularAccount
} from '@alchemy/aa-accounts';
import {
  AlchemySigner,
  AlchemySmartAccountClient,
  BaseAlchemyActions,
  createAlchemySmartAccountClient
} from '@alchemy/aa-alchemy';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import type { Chain, Transport } from 'viem';

type AccountContextType = {
  client: AlchemySmartAccountClient<
    Transport,
    Chain | undefined,
    MultiOwnerModularAccount<AlchemySigner>,
    BaseAlchemyActions<Chain | undefined, MultiOwnerModularAccount<AlchemySigner>> &
      MultiOwnerPluginActions<MultiOwnerModularAccount<AlchemySigner>> &
      PluginManagerActions<MultiOwnerModularAccount<AlchemySigner>> &
      AccountLoupeActions<MultiOwnerModularAccount<AlchemySigner>>
  >;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccountContext = () => {
  const context = useContext(AccountContext);

  if (context === undefined) {
    throw new Error('useAccountContext must be used within the AccountProvider');
  }

  return context;
};

type CreateContextProviderProps = {
  account: MultiOwnerModularAccount<AlchemySigner>;
};

export const AccountContextProvider = ({ children, account }: PropsWithChildren<CreateContextProviderProps>) => {
  const [client] = useState(() => {
    if (typeof document === 'undefined') return undefined;

    return createAlchemySmartAccountClient({
      chain: publicClient.chain,
      rpcUrl: '/api/rpc',
      account,
      gasManagerConfig: {
        policyId: env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID
      }
    })
      .extend(multiOwnerPluginActions)
      .extend(pluginManagerActions)
      .extend(accountLoupeActions);
  });

  return <AccountContext.Provider value={{ client: client! }}>{children}</AccountContext.Provider>;
};
