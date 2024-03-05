'use client';

import { AccountContextProvider, useAccountContext } from '@/context/account';
import { useSignerContext } from '@/context/signer';
import { waitForUserOp } from '@/utils/userOps';
import { Box, Button, Image, Input, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alchemy, Network } from 'alchemy-sdk';
import { Address } from 'viem';

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
  const { signer, user, account } = useSignerContext();
  const { client } = useAccountContext();

  const { data: nftData, error: nftError } = useQuery({
    queryKey: ['nft-page', address, id],
    queryFn: async () => {
      const { image, name } = await alchemy.nft.getNftMetadata(address, id, {});
      return { imageSrc: image.cachedUrl, name };
    }
  });

  // const lockExpiry = useQuery({
  //   queryKey: ['']
  // });

  const { mutate: lockNft } = useMutation({
    mutationFn: async () => {
      const { hash } = await client.lockErc721Token({
        args: [[{ token: { contractAddress: address, tokenId: BigInt(id) }, duration: LOCK_DURATION }]]
      });
      await waitForUserOp(client, hash);
    }
  });

  const unlockNft = null!;
  const lockCollection = null!;
  const unlockCollection = null!;
  const transfer = null!;
  const transferWithStorageKey = null!;

  if (nftError) {
    return <Text>Nft load failed</Text>;
  }

  if (!nftData) {
    return undefined;
  }

  const { imageSrc, name } = nftData;

  return (
    <Box maxW={500} mx="auto">
      <Image src={imageSrc} />
      <Text>{name}</Text>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Input placeholder="Enter address…" />
        <Button>Transfer</Button>
      </Box>
      <Button>Lock</Button>
      <Button>Unlock</Button>
    </Box>
  );
}
