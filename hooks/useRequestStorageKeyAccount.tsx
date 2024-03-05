import { publicClient } from '@/utils/client';
import { MultiOwnerModularAccount, createMultiOwnerModularAccount } from '@alchemy/aa-accounts';
import { LocalAccountSigner, SmartAccountSigner } from '@alchemy/aa-core';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Address, Hex, custom } from 'viem';

export default function useRequestStorageKeyAccount(accountAddress: Address) {
  const [privateKey, setPrivateKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const callbackRefs = useRef<{
    resolve: (account: PromiseLike<MultiOwnerModularAccount<SmartAccountSigner>>) => void;
    reject: (error: unknown) => void;
  }>();

  const requestStorageKeyAccount = useCallback(() => {
    return new Promise<MultiOwnerModularAccount<SmartAccountSigner>>((resolve, reject) => {
      callbackRefs.current = { resolve, reject };
      setIsOpen(true);
    });
  }, []);

  const onClose = useCallback(() => {
    callbackRefs.current?.reject(new Error('Private key not entered'));
    callbackRefs.current = undefined;
    setPrivateKey('');
    setIsOpen(false);
  }, []);

  const onEnter = useCallback(() => {
    callbackRefs.current?.resolve(getStorageKeyAccount(accountAddress, privateKey as Hex));
    callbackRefs.current = undefined;
    setPrivateKey('');
    setIsOpen(false);
  }, [accountAddress, privateKey]);

  useEffect(
    () => () => {
      callbackRefs.current?.reject(new Error('Component unmounted before resolving private key modal'));
    },
    []
  );

  const isValidPrivateKey = !!privateKey.match(/^0x[0-9a-fA-F]{64}$/);

  const modal = (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter cold storage private key</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text sx={{ fontSize: 16 }}>Enter your private storage key.</Text>
          <Input placeholder="0xf0437bad5…" value={privateKey} onChange={(e) => setPrivateKey(e.currentTarget.value)} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onEnter} isDisabled={!isValidPrivateKey}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return { requestStorageKeyAccount, modal };
}

async function getStorageKeyAccount(accountAddress: Address, privateKey: Hex) {
  const signer = LocalAccountSigner.privateKeyToAccountSigner(privateKey);
  return createMultiOwnerModularAccount({
    accountAddress,
    transport: custom(publicClient),
    chain: publicClient.chain,
    signer
  });
}
