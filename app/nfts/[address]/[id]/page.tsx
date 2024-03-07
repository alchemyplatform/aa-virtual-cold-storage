'use client';

import { useAccountContext } from '@/context/account';
import { useSignerContext } from '@/context/account/signer';
import useStorageKeyAccount from '@/hooks/account/useStorageKeyAccount';
import useNftMetadata from '@/hooks/nft/useNfftMetadata';
import { ColdStoragePlugin } from '@/plugin';
import { waitForUserOp } from '@/utils/userOps';
import { freelyMintableNftAbi } from '@/utils/wagmi';
import { Box, Button, Image, Input, Skeleton, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { Address, encodeFunctionData } from 'viem';

const LOCK_DURATION = 600; // Ten minutes

export default function Page({ params: { address, id } }: { params: { address: Address; id: string } }) {
  const { account } = useSignerContext();
  const { client } = useAccountContext();

  const { data: nftData, isLoading, error: nftError } = useNftMetadata({ client, address, tokenId: id });
  const [transferAddress, setTransferAddress] = useState('');
  const handleTransferAddressChange = (event: ChangeEvent<HTMLInputElement>) => setTransferAddress(event.target.value);

  const locks = useQuery({
    queryKey: ['all-locks'],
    queryFn: async () => {
      if (!account) {
        throw new Error('Account is null');
      }
      const plugin = ColdStoragePlugin.getContract(client);
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

  const { requestStorageKeyAccount, modal: privateKeyModal } = useStorageKeyAccount(account?.address ?? '0x');

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

  const { image, name, contract, tokenId } = nftData ?? {};
  const { isCollectionLocked, isTokenLocked } = locks.data;

  return (
    <Box maxW={500} mx="auto">
      <Skeleton isLoaded={!isLoading}>
        <Image
          src={image?.cachedUrl ?? image?.pngUrl ?? image?.originalUrl}
          alt={name ?? `${contract.address}.${tokenId}`}
        />
      </Skeleton>
      <Skeleton isLoaded={!isLoading}>
        <Text>{name}</Text>
      </Skeleton>

      <Input placeholder="Enter address…" value={transferAddress} onChange={handleTransferAddressChange} />
      <Box mt={1}>
        <Button
          isDisabled={isLoading || (transfer.isPending && !transferAddress.match(/^0x[0-9a-fA-F]{40}$/))}
          onClick={() => transfer.mutate()}
        >
          {transfer.isPending ? 'Transferring…' : 'Transfer'}
        </Button>
        <Button
          ml={1}
          isDisabled={isLoading || (transferWithStorageKey.isPending && !transferAddress.match(/^0x[0-9a-fA-F]{40}$/))}
          onClick={() => transferWithStorageKey.mutate()}
        >
          {transferWithStorageKey.isPending ? 'Transferring…' : 'Transfer with storage key'}
        </Button>
      </Box>
      <Box mt={4}>
        <Button isDisabled={isLoading || lockNft.isPending || isTokenLocked} onClick={() => lockNft.mutate()}>
          {lockNft.isPending ? 'Locking…' : 'Lock'}
        </Button>
        <Button
          ml={1}
          isDisabled={isLoading || unlockNft.isPending || !isTokenLocked}
          onClick={() => unlockNft.mutate()}
        >
          {unlockNft.isPending ? 'Unlocking…' : 'Unlock'}
        </Button>
      </Box>
      <Box mt={4}>
        <Button
          isDisabled={isLoading || lockCollection.isPending || isCollectionLocked}
          onClick={() => lockCollection.mutate()}
        >
          {lockCollection.isPending ? 'Locking…' : 'Lock collection'}
        </Button>
        <Button
          ml={1}
          isDisabled={isLoading || unlockCollection.isPending || !isCollectionLocked}
          onClick={() => unlockCollection.mutate()}
        >
          {unlockCollection.isPending ? 'Unlocking…' : 'Unlock collection'}
        </Button>
      </Box>
      {privateKeyModal}
    </Box>
  );
}
