'use client';

import { Box, Image, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Alchemy, Network } from 'alchemy-sdk';
import { Address } from 'viem';

const alchemy = new Alchemy({ network: Network.ARB_SEPOLIA, apiKey: '6-7bbRdhqAvOKomY2JhAladgpGf7AQzR' });

export default function Page({ params: { address, id } }: { params: { address: Address; id: string } }) {
  const { data, error } = useQuery({
    queryKey: ['nft-page', address, id],
    queryFn: async () => {
      const { image, name } = await alchemy.nft.getNftMetadata(address, id, {});
      return { imageSrc: image.cachedUrl, name };
    }
  });

  if (error) {
    return <Text>Nft load failed</Text>;
  }

  if (!data) {
    return undefined;
  }

  const { imageSrc, name } = data;

  return (
    <Box>
      <Image src={imageSrc} />
      <Text>{name}</Text>
    </Box>
  );
}
