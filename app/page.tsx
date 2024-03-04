'use client';

import { LoginSignupCard } from '@/components/auth/LoginSignupCard';
import { UserCard } from '@/components/auth/UserCard';
import { AccountContextProvider } from '@/context/account';
import { useSignerContext } from '@/context/signer';
import { Center, Spinner } from '@chakra-ui/react';

export default function Home() {
  const { signer, account, isLoadingUser, refetchUserDetails } = useSignerContext();

  return (
    <Center flex={1}>
      {isLoadingUser ? (
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="primary.500" size="3xl" />
      ) : account == null ? (
        <LoginSignupCard signer={signer} onLogin={refetchUserDetails} />
      ) : (
        <AccountContextProvider account={account}>
          <UserCard />
        </AccountContextProvider>
      )}
    </Center>
  );
}
