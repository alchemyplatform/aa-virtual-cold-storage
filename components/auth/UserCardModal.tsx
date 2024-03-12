'use client';

import { useAccountContext } from '@/context/account';
import { useSignerContext } from '@/context/account/signer';
import { ModalType, useGlobalModalContext } from '@/context/app/modal';
import { usePlugin } from '@/hooks/common/usePlugin';
import { ColdStoragePlugin, ColdStoragePluginAbi } from '@/plugin';
import { NFT1_ADDRESS, NFT2_ADDRESS } from '@/utils/constants';
import { randomBytes32 } from '@/utils/random';
import { waitForUserOp } from '@/utils/userOps';
import { freelyMintableNftAbi } from '@/utils/wagmi';
import {
  Box,
  Button,
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
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
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

export const UserCardModal = () => {
  const { signer, user, account } = useSignerContext();
  const { client } = useAccountContext();

  const toast = useToast();
  const {
    hideModal,
    store: { modalType }
  } = useGlobalModalContext();
  const isOpen = useMemo(() => modalType === ModalType.USER_CARD, [modalType]);

  const [hasClosedPrivateKeyModal, setHasClosedPrivateKeyModal] = useState(false);
  const closePrivateKeyModal = useCallback(() => setHasClosedPrivateKeyModal(true), []);

  const [hasClosedExportedKeyModal, setHasClosedExportedKeyModal] = useState(false);
  const closeExportedKeyModal = useCallback(() => setHasClosedExportedKeyModal(true), []);

  const { setIsPluginInstalled, isPluginInstalled } = usePlugin<typeof ColdStoragePluginAbi>(client, ColdStoragePlugin);

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
      setIsPluginInstalled(true);
      return storagePrivateKey;
    }
  });

  const installColdStorage = useCallback(() => mutateInstallColdStorage(), [mutateInstallColdStorage]);

  const {
    mutate: exportWallet,
    isPending: isExportingWallet,
    data: exportedWalletKey
  } = useMutation({
    mutationFn: () => {
      return signer.exportWallet({
        iframeContainerId: exportWalletContainerId,
        iframeElementId: exportWalletElementId
      });
    }
  });

  const { mutate: addPasskey } = useMutation({
    mutationFn: async () => signer.addPasskey({}),
    onSuccess: (_data) => {
      toast({
        title: `Passkey added`,
        description: `You can now use your passkey to login to your account.`,
        status: 'success'
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: `Error adding passkey`,
        description: `There was an error adding your passkey. Please try again.`,
        status: 'error'
      });
    }
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => signer.disconnect(),
    onSuccess: () => {
      window.location.reload();
    }
  });

  return (
    <Modal onClose={hideModal} isOpen={isOpen} scrollBehavior="outside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack pt={10}>
            <Heading size="md">Welcome back!</Heading>
            <Spacer />
            <Tooltip hasArrow label="Logout" bg="gray.200" color="black" fontSize="sm">
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
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UserCardRow
            title="Email"
            value={user!.email ?? 'No email'}
            action={
              <Tooltip hasArrow label="Add a New Passkey" bg="gray.200" color="black" fontSize="sm">
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

          <Flex gap={4}>
            <Button
              flex={1}
              h="40px"
              flexDirection="row"
              onClick={() => exportWallet()}
              isLoading={isExportingWallet}
              spinnerPlacement="end"
              isDisabled={!!exportedWalletKey}
            >
              Export Wallet
            </Button>
            <Button
              h="40px"
              onClick={installColdStorage}
              isDisabled={!account || isPluginInstalled}
              spinnerPlacement="end"
              isLoading={isInstallingColdStorage}
            >
              {isInstallingColdStorage
                ? 'Installing cold storage plugin'
                : isPluginInstalled
                  ? 'Cold storage plugin installed'
                  : 'Install cold storage plugin'}
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button onClick={hideModal}>Close</Button>
        </ModalFooter>

        <Modal
          isOpen={!!exportedWalletKey && !hasClosedExportedKeyModal}
          closeOnOverlayClick={false}
          onClose={closeExportedKeyModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Your Alchemy Signer private key</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize={16}>
                Save your private key in a secure location. You&apos;ll need this to access your locked assets! After
                closing this dialog, your private key will not be shown again.
              </Text>
              <Box p={2} mt={2} borderWidth="1" borderColor="gray.500" borderRadius={4}>
                {exportedWalletKey && (
                  <Flex id={exportWalletContainerId}>
                    <style>{iframeCss}</style>
                  </Flex>
                )}
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="accent" onClick={closeExportedKeyModal}>
                I have saved my private key
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
              <Text fontSize={16}>
                Save your private key in a secure location. You&apos;ll need this to access your locked assets! After
                closing this dialog, your private key will not be shown again.
              </Text>
              <Box p={2} mt={2} borderWidth="1" borderColor="gray.500" borderRadius={4}>
                {storagePrivateKey}
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="accent" onClick={closePrivateKeyModal}>
                I have saved my private key
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ModalContent>
    </Modal>
  );
};
