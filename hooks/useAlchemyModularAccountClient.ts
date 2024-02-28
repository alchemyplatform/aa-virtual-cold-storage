import { ALCHEMY_API_KEY, ALCHEMY_GAS_MANAGER_POLICY_ID, chain } from '@/utils/constants';
import {
  AccountLoupeActions,
  MultiOwnerModularAccount,
  MultiOwnerPluginActions,
  PluginManagerActions
} from '@alchemy/aa-accounts';
import {
  AlchemySigner,
  AlchemySmartAccountClient,
  BaseAlchemyActions,
  createModularAccountAlchemyClient
} from '@alchemy/aa-alchemy';
import { useCallback, useState } from 'react';
import { Address, Chain, CustomTransport } from 'viem';

export type AlchemyModularAccountClient = AlchemySmartAccountClient<
  CustomTransport,
  Chain | undefined,
  MultiOwnerModularAccount<AlchemySigner>,
  BaseAlchemyActions<Chain | undefined, MultiOwnerModularAccount<AlchemySigner>> &
    MultiOwnerPluginActions<MultiOwnerModularAccount<AlchemySigner>> &
    PluginManagerActions<MultiOwnerModularAccount<AlchemySigner>> &
    AccountLoupeActions<MultiOwnerModularAccount<AlchemySigner>>
>;

export const useAlchemyModularAccountClient = (): {
  client: AlchemyModularAccountClient | undefined;
  connect: (signer: AlchemySigner, account?: Address) => Promise<AlchemyModularAccountClient>;
} => {
  const [client, setClient] = useState<AlchemyModularAccountClient>();

  const connect = useCallback(async (signer: AlchemySigner, account?: Address) => {
    const client = await createModularAccountAlchemyClient({
      apiKey: ALCHEMY_API_KEY,
      chain,
      signer,
      gasManagerConfig: {
        policyId: ALCHEMY_GAS_MANAGER_POLICY_ID
      },
      accountAddress: account
    });
    setClient(client);
    return client;
  }, []);

  return {
    client,
    connect
  };
};
