'use client';

import { useSignerContext } from '@/context/signer';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Heading,
  IconButton,
  Spacer,
  Tooltip
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { HiOutlineFingerPrint, HiOutlineLogout } from 'react-icons/hi';
import { UserCardRow } from './UserCardRow';

const exportWalletContainerId = 'alchemy-export-wallet-container-id';
const exportWalletElementId = 'alchemy-export-wallet-element-id';

const iframeCss = `
  iframe {
    box-sizing: border-box;
    width: 100%;
    height: 120px;
    border-radius: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(216, 219, 227, 1);
    padding: 8px;
  }
`;

export const UserCard = () => {
  const { signer, user, account } = useSignerContext();

  const { mutate, isPending, data } = useMutation({
    mutationFn: async () =>
      signer.exportWallet({
        iframeContainerId: exportWalletContainerId,
        iframeElementId: exportWalletElementId
      })
  });

  const { mutate: addPasskey } = useMutation({
    mutationFn: async () => signer.addPasskey({}),
    onSuccess: (data) => {
      console.log(data);
    }
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => signer.disconnect(),
    onSuccess: () => {
      window.location.reload();
    }
  });

  return (
    <Card minW="500px">
      <CardHeader>
        <HStack>
          <Heading size="md">Welcome back!</Heading>
          <Spacer />
          <Tooltip hasArrow label="Logout" bg="gray.200" color="black" fontSize="md">
            <IconButton
              variant="outline"
              colorScheme="warning"
              aria-label="logout"
              size="md"
              onClick={() => logout()}
              icon={<HiOutlineLogout />}
            />
          </Tooltip>
        </HStack>
      </CardHeader>

      <CardBody gap="5">
        <UserCardRow
          title="Email"
          value={user!.email ?? 'No email'}
          action={
            <Tooltip hasArrow label="Add a New Passkey" bg="gray.200" color="black" fontSize="md">
              <IconButton
                variant="outline"
                colorScheme="ink"
                aria-label="passkey"
                onClick={() => addPasskey()}
                icon={<HiOutlineFingerPrint />}
              />
            </Tooltip>
          }
        />

        <UserCardRow title="Account Address" value={account!.address} />

        <UserCardRow title="Signer Address" value={user!.address} />

        <Flex>
          <Button
            bg="white"
            flex={1}
            h="40px"
            flexDirection="row"
            onClick={() => mutate()}
            isLoading={isPending}
            spinnerPlacement="end"
            isDisabled={!!data}
          >
            Export Wallet
          </Button>
        </Flex>
        {data && (
          <Flex id={exportWalletContainerId}>
            <style>{iframeCss}</style>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};
