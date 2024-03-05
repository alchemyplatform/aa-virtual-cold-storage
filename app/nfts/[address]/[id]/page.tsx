'use client';

import { AccountContextProvider, useAccountContext } from '@/context/account';
import { useSignerContext } from '@/context/signer';
import useRequestStorageKeyAccount from '@/hooks/useRequestStorageKeyAccount';
import { ColdStoragePluginAbi } from '@/plugin';
import { COLD_STORAGE_PLUGIN_ADDRESS } from '@/utils/constants';
import { waitForUserOp } from '@/utils/userOps';
import { freelyMintableNftAbi } from '@/utils/wagmi';
import { Box, Button, Image, Input, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alchemy, Network } from 'alchemy-sdk';
import { ChangeEvent, useState } from 'react';
import { Address, encodeFunctionData, getContract } from 'viem';

const alchemy = new Alchemy({ network: Network.ARB_SEPOLIA, apiKey: '6-7bbRdhqAvOKomY2JhAladgpGf7AQzR' });
const LOCK_DURATION = 600; // Ten minutes

export default function WrappedPage({ params }: { params: { address: Address; id: string } }) {
  const { account, isLoadingUser } = useSignerContext();

  if (isLoadingUser) {
    return undefined;
  }
  if (!account) {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return undefined;
  }
  return (
    <AccountContextProvider account={account}>
      <Page params={params} />
    </AccountContextProvider>
  );
}

function Page({ params: { address, id } }: { params: { address: Address; id: string } }) {
  const { account } = useSignerContext();
  const { client } = useAccountContext();

  const { data: nftData, error: nftError } = useQuery({
    queryKey: ['nft-page', address, id],
    queryFn: async () => {
      const { image, name } = await alchemy.nft.getNftMetadata(address, id, {});
      return { imageSrc: image.cachedUrl, name };
    }
  });
  const [transferAddress, setTransferAddress] = useState('');
  const handleTransferAddressChange = (event: ChangeEvent<HTMLInputElement>) => setTransferAddress(event.target.value);

  const locks = useQuery({
    queryKey: ['all-locks'],
    queryFn: async () => {
      if (!account) {
        throw new Error('Account is null');
      }
      const plugin = getContract({ abi: ColdStoragePluginAbi, address: COLD_STORAGE_PLUGIN_ADDRESS, client });
      const [allDuration, collectionLocks, tokenLocks] = await plugin.read.getERC721Locks([account.address]);
      const isAllLocked = allDuration > 0;
      const isCollectionLocked = collectionLocks.some((lock) => lock.contractAddress === address && lock.duration > 0);
      const isTokenLocked = tokenLocks.some(
        (lock) => lock.token.contractAddress === address && lock.token.tokenId === BigInt(id) && lock.duration > 0
      );
      return { isAllLocked, isCollectionLocked, isTokenLocked };
    }
  });

  const lockNft = useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error('Account is null');
      }
      const { hash } = await client.lockErc721Token({
        account,
        args: [[{ token: { contractAddress: address, tokenId: BigInt(id) }, duration: LOCK_DURATION }]]
      });
      await waitForUserOp(client, hash);
      void locks.refetch();
    }
  });

  const { requestStorageKeyAccount, modal: privateKeyModal } = useRequestStorageKeyAccount(account?.address ?? '0x');

  const unlockNft = useMutation({
    mutationFn: async () => {
      const account = await requestStorageKeyAccount();
      const { hash } = await client.unlockErc721Token({
        account,
        args: [[{ contractAddress: address, tokenId: BigInt(id) }]]
      });
      await waitForUserOp(client, hash);
      void locks.refetch();
    }
  });

  const lockCollection = useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error('Account is null');
      }
      const { hash } = await client.lockErc721Collection({
        account,
        args: [[{ contractAddress: address, duration: LOCK_DURATION }]]
      });
      await waitForUserOp(client, hash);
      void locks.refetch();
    }
  });

  const unlockCollection = useMutation({
    mutationFn: async () => {
      const account = await requestStorageKeyAccount();
      const { hash } = await client.unlockErc721Collection({
        account,
        args: [[address]]
      });
      await waitForUserOp(client, hash);
      void locks.refetch();
    }
  });

  const transfer = useMutation({
    mutationFn: async () => {
      if (account == null) {
        throw new Error('Account is null');
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(transferAddress)) {
        throw new Error('Invalid transferAddress');
      }
      const { hash } = await client.sendUserOperation({
        account,
        uo: [
          {
            target: address,
            data: encodeFunctionData({
              abi: freelyMintableNftAbi,
              functionName: 'safeTransferFrom',
              args: [account.address, transferAddress as Address, BigInt(id)]
            })
          }
        ]
      });
      await waitForUserOp(client, hash);
    }
  });

  const transferWithStorageKey = useMutation({
    mutationFn: async () => {
      const account = await requestStorageKeyAccount();
      const { hash } = await client.executeWithStorageKey({
        account,
        args: [
          [
            {
              target: address,
              value: BigInt(0),
              data: encodeFunctionData({
                abi: freelyMintableNftAbi,
                functionName: 'safeTransferFrom',
                args: [account.address, transferAddress as Address, BigInt(id)]
              })
            }
          ]
        ]
      });
      await waitForUserOp(client, hash);
    }
  });

  if (nftError) {
    return <Text>Nft load failed</Text>;
  }
  if (locks.error) {
    return <Text>Locks load failed</Text>;
  }

  if (!nftData || !locks.data) {
    return undefined;
  }

  const { imageSrc, name } = nftData;
  const { isCollectionLocked, isTokenLocked } = locks.data;

  return (
    <Box maxW={500} mx="auto">
      <Image src={imageSrc} />
      <Text>{name}</Text>
      <Input placeholder="Enter address…" value={transferAddress} onChange={handleTransferAddressChange} />
      <Box mt={1}>
        <Button
          isDisabled={transfer.isPending && !transferAddress.match(/^0x[0-9a-fA-F]{40}$/)}
          onClick={() => transfer.mutate()}
        >
          {transfer.isPending ? 'Transferring…' : 'Transfer'}
        </Button>
        <Button
          ml={1}
          isDisabled={transferWithStorageKey.isPending && !transferAddress.match(/^0x[0-9a-fA-F]{40}$/)}
          onClick={() => transferWithStorageKey.mutate()}
        >
          {transferWithStorageKey.isPending ? 'Transferring…' : 'Transfer with storage key'}
        </Button>
      </Box>
      <Box mt={4}>
        <Button isDisabled={lockNft.isPending || isTokenLocked} onClick={() => lockNft.mutate()}>
          {lockNft.isPending ? 'Locking…' : 'Lock'}
        </Button>
        <Button ml={1} isDisabled={unlockNft.isPending || !isTokenLocked} onClick={() => unlockNft.mutate()}>
          {unlockNft.isPending ? 'Unlocking…' : 'Unlock'}
        </Button>
      </Box>
      <Box mt={4}>
        <Button isDisabled={lockCollection.isPending || isCollectionLocked} onClick={() => lockCollection.mutate()}>
          {lockCollection.isPending ? 'Locking…' : 'Lock collection'}
        </Button>
        <Button
          ml={1}
          isDisabled={unlockCollection.isPending || !isCollectionLocked}
          onClick={() => unlockCollection.mutate()}
        >
          {unlockCollection.isPending ? 'Unlocking…' : 'Unlock collection'}
        </Button>
      </Box>
      {privateKeyModal}
    </Box>
  );
}
