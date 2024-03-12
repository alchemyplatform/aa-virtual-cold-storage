import { chain } from '@/utils/constants';
import { Plugin, UninstallPluginParams } from '@/utils/types';
import { accountLoupeActions, pluginManagerActions } from '@alchemy/aa-accounts';
import { AlchemySmartAccountClient } from '@alchemy/aa-alchemy';
import { UserOperationOverrides } from '@alchemy/aa-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const getIsPluginInstalled = useCallback(async () => {
    if (!client.account) return false;
    if (!(await client.account.isAccountDeployed())) return false;
    const plugins = await client.extend(accountLoupeActions).getInstalledPlugins({ account: client.account });
    return plugins.some((p) => p === address);
  }, [address, client]);

  const [isPluginInstalled, setIsPluginInstalled] = useState(false);

  useEffect(() => {
    async function fn() {
      if (!client.account) return false;
      if (!(await client.account.isAccountDeployed())) return false;
      const plugins = await client.extend(accountLoupeActions).getInstalledPlugins({ account: client.account });
      const res = plugins.some((p) => p === address);
      console.log('!!!!!!!!!!', res);
      setIsPluginInstalled(res);
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fn();
  }, [address, client]);

  return {
    address,
    contract,
    uninstallPlugin,
    isPluginInstalled,
    setIsPluginInstalled,
    getIsPluginInstalled
  };
};
