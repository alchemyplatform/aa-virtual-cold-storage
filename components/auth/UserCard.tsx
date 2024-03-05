'use client';

import { useAccountContext } from '@/context/account';
import { useSignerContext } from '@/context/signer';
import { usePlugin } from '@/hooks/usePlugin';
import { ColdStoragePlugin, ColdStoragePluginAbi } from '@/plugin';
import { NFT1_ADDRESS, NFT2_ADDRESS } from '@/utils/constants';
import { randomBytes32 } from '@/utils/random';
import { waitForUserOp } from '@/utils/userOps';
import { freelyMintableNftAbi } from '@/utils/wagmi';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { HiOutlineFingerPrint, HiOutlineLogout } from 'react-icons/hi';
import { encodeFunctionData } from 'viem';
import { privateKeyToAddress } from 'viem/accounts';
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
  const { client } = useAccountContext();
  const router = useRouter();

  const [hasClosedPrivateKeyModal, setHasClosedPrivateKeyModal] = useState(false);
  const closePrivateKeyModal = useCallback(() => setHasClosedPrivateKeyModal(true), []);

  const { isPluginInstalled: getIsPluginInstalled } = usePlugin<typeof ColdStoragePluginAbi>(client, ColdStoragePlugin);

  const { data: isPluginInstalled } = useQuery({ queryKey: ['is-plugin-installed'], queryFn: getIsPluginInstalled });

  const {
    mutate: mutateInstallColdStorage,
    isPending: isInstallingColdStorage,
    data: storagePrivateKey
  } = useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error('Should not install cold storage without an account');
      }
      const storagePrivateKey = randomBytes32();
      const storageKey = privateKeyToAddress(storagePrivateKey);
      const { hash: installHash } = await client.installColdStoragePlugin({ account, args: [storageKey] });
      await waitForUserOp(client, installHash);
      const { hash: mintHash } = await client.sendUserOperation({
        account,
        uo: [
          {
            target: NFT1_ADDRESS,
            data: encodeFunctionData({
              abi: freelyMintableNftAbi,
              functionName: 'mint',
              args: [account.address, BigInt(3)]
            })
          },
          {
            target: NFT2_ADDRESS,
            data: encodeFunctionData({
              abi: freelyMintableNftAbi,
              functionName: 'mint',
              args: [account.address, BigInt(3)]
            })
          }
        ]
      });
      await waitForUserOp(client, mintHash);
      return storagePrivateKey;
    }
  });

  const installColdStorage = useCallback(() => mutateInstallColdStorage(), [mutateInstallColdStorage]);

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

  const goHome = () => {
    if (!account) return;
    return router.push(`/${account.address}/nfts`);
  };

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
          <Button
            onClick={installColdStorage}
            isDisabled={!account || isInstallingColdStorage || isPluginInstalled || hasClosedPrivateKeyModal}
          >
            {isInstallingColdStorage
              ? 'Installing cold storage plugin'
              : isPluginInstalled || hasClosedPrivateKeyModal
                ? 'Cold storage plugin installed'
                : 'Install cold storage plugin'}
          </Button>
        </Flex>
        {data && (
          <Flex id={exportWalletContainerId}>
            <style>{iframeCss}</style>
          </Flex>
        )}
      </CardBody>
      <CardFooter>
        <Flex>
          <Button bg="primary" flex={1} h="40px" flexDirection="row" onClick={goHome} spinnerPlacement="end">
            Go Home
          </Button>
        </Flex>
      </CardFooter>
      <Modal
        isOpen={!!storagePrivateKey && !hasClosedPrivateKeyModal}
        closeOnOverlayClick={false}
        onClose={closePrivateKeyModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your cold storage private key</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text sx={{ fontSize: 16 }}>
              Save your private key in a secure location. You&apos;ll need this to access your locked assets! After
              closing this dialog, your private key will not be shown again.
            </Text>
            <Box p={2} mt={2} sx={{ borderWidth: 1, borderColor: 'gray.500', borderRadius: 4 }}>
              {storagePrivateKey}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={closePrivateKeyModal}>
              I have saved my private key
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};
