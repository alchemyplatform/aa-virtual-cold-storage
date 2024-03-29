import { Box, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';
import { OwnedNft } from 'alchemy-sdk';
import Image from 'next/image';
import NextLink from 'next/link';
import { Address } from 'viem';

export type Page = {
  pageSize: number;
  nextPageKey: string | undefined;
  prevPageKey: string | undefined;
  totalNumberOfPages: number;
};

type NftsProps = {
  address: Address;
  items: OwnedNft[];
  page: Page;
  isLoading?: boolean;
  size?: number;
};

export const Nfts = ({ items, page, isLoading, size = 256 }: NftsProps) => {
  return !isLoading && items.length === 0 ? (
    <Text>
      {!page.prevPageKey
        ? "This account doesn't have any NFTs yet - install the cold storage plugin under 'Your Account' and you will receive some!"
        : 'No more NFTs to show'}
    </Text>
  ) : (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
      {items.map(({ name, contract, tokenId, image }: OwnedNft) => {
        const imageUrl = image.thumbnailUrl ?? image.cachedUrl ?? image.pngUrl ?? image.originalUrl;
        return (
          <Box borderRadius="md" overflow="hidden" key={`${contract.address}.${tokenId}`}>
            <NextLink href={`/nfts/${contract.address}/${tokenId}`}>
              <Skeleton isLoaded={!isLoading}>
                <Image src={imageUrl || ''} width={size} height={size} alt={name ?? `${contract.address}.${tokenId}`} />
              </Skeleton>
            </NextLink>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};
