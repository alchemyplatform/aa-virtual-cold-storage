'use client';

import { LoginSignupCard } from '@/components/auth/LoginSignupCard';
import { Home } from '@/components/home';
import { AccountContextProvider } from '@/context/account';
import { useSignerContext } from '@/context/account/signer';
import { Center, Spinner } from '@chakra-ui/react';

export default function Page() {
  const { signer, account, isLoadingUser, refetchUserDetails } = useSignerContext();

  return (
    <Center flex={1}>
      {isLoadingUser ? (
        <Spinner thickness="4px" speed="0.75s" emptyColor="white" color="primary.500" size="xl" />
      ) : account == null ? (
        <LoginSignupCard signer={signer} onLogin={refetchUserDetails} />
      ) : (
        <AccountContextProvider account={account}>
          <Home />
        </AccountContextProvider>
      )}
    </Center>
  );
}
