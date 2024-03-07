import { chain } from '@/utils/constants';
import { Plugin, UninstallPluginParams } from '@/utils/types';
import { accountLoupeActions, pluginManagerActions } from '@alchemy/aa-accounts';
import { AlchemySmartAccountClient } from '@alchemy/aa-alchemy';
import { UserOperationOverrides } from '@alchemy/aa-core';
import { useCallback, useMemo } from 'react';
import { Abi } from 'viem';

export const usePlugin = <TAbi extends Abi>(client: AlchemySmartAccountClient, plugin: Plugin<TAbi>) => {
  const {
    getContract,
    meta: { addresses }
  } = plugin;

  const address = useMemo(() => addresses[chain.id], [addresses]);
  const contract = useMemo(() => getContract(client, address), [address, client, getContract]);

  const uninstallPlugin = useCallback(
    async (params: Partial<UninstallPluginParams>, overrides?: UserOperationOverrides) => {
      if (!client.account) return false;
      return client
        .extend(pluginManagerActions)
        .uninstallPlugin({ ...params, pluginAddress: address, overrides, account: client.account });
    },
    [address, client]
  );

  const isPluginInstalled = useCallback(async () => {
    if (!client.account) return false;
    if (!(await client.account.isAccountDeployed())) return false;
    const plugins = await client.extend(accountLoupeActions).getInstalledPlugins({ account: client.account });
    return plugins.some((p) => p === address);
  }, [address, client]);

  return {
    address,
    contract,
    uninstallPlugin,
    isPluginInstalled
  };
};
