'use client';

import { publicClient } from '@/client';
import { MultiOwnerModularAccount, createMultiOwnerModularAccount } from '@alchemy/aa-accounts';
import { AlchemySigner, AlchemySignerClient, AlchemySignerParams, User } from '@alchemy/aa-alchemy';
import { useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { custom } from 'viem';

type SignerContextType = {
  signer: AlchemySigner;
  account?: MultiOwnerModularAccount<AlchemySigner> | null;
  user?: User | null;
  isLoadingUser: boolean;
  refetchUserDetails: () => void;
};

const SignerContext = createContext<SignerContextType | undefined>(undefined);

export const useSignerContext = (): SignerContextType => {
  const context = useContext(SignerContext);

  if (context === undefined) {
    throw new Error('useSignerContext must be used within a SignerContext');
  }

  return context;
};

export const SignerContextProvider = ({
  children,
  ...signerConfig
}: PropsWithChildren<{
  client: Exclude<AlchemySignerParams['client'], AlchemySignerClient>;
  sessionConfig?: AlchemySignerParams['sessionConfig'];
}>) => {
  const [_signer] = useState<AlchemySigner | undefined>(() => {
    if (typeof window === 'undefined') return undefined;

    const iframeContainer = document.createElement('div');
    iframeContainer.id = signerConfig.client.iframeConfig.iframeContainerId;
    iframeContainer.style.display = 'none';
    document.body.appendChild(iframeContainer);

    return new AlchemySigner(signerConfig);
  });

  // this only ever runs on the client, so we can assume the signer is defined
  const signer = _signer!;

  const params = useSearchParams();

  const toast = useToast();

  // TODO: the refetch logic should be moved into the context here
  const {
    data = { user: null, account: null },
    isLoading: isLoadingUser,
    refetch: refetchUserDetails
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (params.get('bundle') != null) {
        await signer.authenticate({
          type: 'email',
          bundle: params.get('bundle')!
        });
      }

      const user = await signer.getAuthDetails().catch(() => {
        return null;
      });

      const account = user
        ? await createMultiOwnerModularAccount({
            transport: custom(publicClient),
            chain: publicClient.chain,
            signer
          })
        : null;

      if (params.get('bundle') != null) {
        if (account != null) {
          console.log(`Login success - user: ${JSON.stringify(user)}, account address: ${account.address}`);
          toast({
            title: `Login success`,
            description: `Welcome ${user?.email}!`,
            status: 'success'
          });
        } else {
          console.error(`Login error - OTP bundle ${params.get('bundle')}`);
          toast({
            title: `Login failed`,
            description: `Invalid OTP bundle ${params.get('bundle')}`,
            status: 'error'
          });
        }
      }

      return {
        account,
        user
      };
    }
  });

  return (
    <SignerContext.Provider
      value={{
        signer,
        ...data,
        isLoadingUser,
        refetchUserDetails
      }}
    >
      {children}
    </SignerContext.Provider>
  );
};
