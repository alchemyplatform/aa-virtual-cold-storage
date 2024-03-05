'use client';

import { env } from '@/env.mjs';
import { ColdStoragePluginActions, coldStoragePluginActions } from '@/plugin';
import { getAlchemySettings } from '@/utils/alchemy';
import { publicClient } from '@/utils/client';
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
  alchemyEnhancedApiActions,
  createAlchemySmartAccountClient
} from '@alchemy/aa-alchemy';
import { Alchemy } from 'alchemy-sdk';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import type { Chain, Transport } from 'viem';

type AccountContextType = {
  client: AlchemySmartAccountClient<
    Transport,
    Chain | undefined,
    MultiOwnerModularAccount<AlchemySigner>,
    BaseAlchemyActions<Chain | undefined, MultiOwnerModularAccount<AlchemySigner>> &
      MultiOwnerPluginActions<MultiOwnerModularAccount<AlchemySigner>> &
      ColdStoragePluginActions<MultiOwnerModularAccount<AlchemySigner>> &
      PluginManagerActions<MultiOwnerModularAccount<AlchemySigner>> &
      AccountLoupeActions<MultiOwnerModularAccount<AlchemySigner>>
  >;
};

const alchemy = new Alchemy(getAlchemySettings());

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
      .extend(coldStoragePluginActions)
      .extend(pluginManagerActions)
      .extend(accountLoupeActions)
      .extend(alchemyEnhancedApiActions(alchemy));
  });

  return <AccountContext.Provider value={{ client: client! }}>{children}</AccountContext.Provider>;
};
