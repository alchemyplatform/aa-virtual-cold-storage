import { SmartAccountSigner } from '@alchemy/aa-core';
import {
  Box,
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
import { Hex } from 'viem';

export default function useRequestPrivateKey() {
  const [privateKey, setPrivateKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const callbackRefs = useRef<{ resolve: (privateKey: Hex) => void; reject: (error: unknown) => void }>();

  const requestPrivateKey = useCallback(() => {
    return new Promise<Hex>((resolve, reject) => {
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
    callbackRefs.current?.resolve(privateKey as Hex);
    callbackRefs.current = undefined;
    setPrivateKey('');
    setIsOpen(false);
  }, [privateKey]);

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

  return { requestPrivateKey, modal };
}

// export default function useStorageKeySigner() {
//   createAccount
// }

// class LocalAccountSigner implements SmartAccountSigner<>
// {
//   inner: T;
//   signerType: string;

//   constructor(inner: T) {
//     this.inner = inner;
//     this.signerType = inner.type; //  type: "local"
//   }

//   readonly signMessage: (message: SignableMessage) => Promise<`0x${string}`> = (
//     message
//   ) => {
//     return this.inner.signMessage({ message });
//   };

//   readonly signTypedData = async <
//     const TTypedData extends TypedData | { [key: string]: unknown },
//     TPrimaryType extends string = string
//   >(
//     params: TypedDataDefinition<TTypedData, TPrimaryType>
//   ): Promise<Hex> => {
//     return this.inner.signTypedData(params);
//   };

//   readonly getAddress: () => Promise<`0x${string}`> = async () => {
//     return this.inner.address;
//   };

//   static mnemonicToAccountSigner(key: string): LocalAccountSigner<HDAccount> {
//     const owner = mnemonicToAccount(key);
//     return new LocalAccountSigner(owner);
//   }

//   static privateKeyToAccountSigner(
//     key: Hex
//   ): LocalAccountSigner<PrivateKeyAccount> {
//     const owner = privateKeyToAccount(key);
//     return new LocalAccountSigner(owner);
//   }
// }
