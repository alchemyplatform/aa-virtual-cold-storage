'use client';

import { env } from '@/env.mjs';
import { ColdStoragePluginActions, coldStoragePluginActions } from '@/plugin';
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
  createAlchemySmartAccountClient
} from '@alchemy/aa-alchemy';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import type { Chain, Transport } from 'viem';
import { useGlobalModalContext } from '../app/modal';

type AccountContextType = {
  client: AlchemySmartAccountClient<
    Transport,
    Chain | undefined,
    MultiOwnerModularAccount<AlchemySigner> | undefined,
    BaseAlchemyActions<Chain | undefined, MultiOwnerModularAccount<AlchemySigner> | undefined> &
      MultiOwnerPluginActions<MultiOwnerModularAccount<AlchemySigner> | undefined> &
      ColdStoragePluginActions<MultiOwnerModularAccount<AlchemySigner> | undefined> &
      PluginManagerActions<MultiOwnerModularAccount<AlchemySigner> | undefined> &
      AccountLoupeActions<MultiOwnerModularAccount<AlchemySigner> | undefined>
  >;
};

const defaultClient = createAlchemySmartAccountClient({
  chain: publicClient.chain,
  rpcUrl: '/api/rpc',
  account: undefined,
  gasManagerConfig: {
    policyId: env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID
  }
})
  .extend(multiOwnerPluginActions)
  .extend(coldStoragePluginActions)
  .extend(pluginManagerActions)
  .extend(accountLoupeActions);
const AccountContext = createContext<AccountContextType>({ client: defaultClient });

export const useAccountContext = () => {
  const context = useContext(AccountContext);
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
      .extend(accountLoupeActions);
  });

  const { store, setClient } = useGlobalModalContext();

  useEffect(() => {
    if (!store.client) setClient(client);
  }, [client, setClient, store.client]);

  return <AccountContext.Provider value={{ client: client! }}>{children}</AccountContext.Provider>;
};
