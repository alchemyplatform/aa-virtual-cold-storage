'use client';

import { useAccountContext } from '@/context/account';
import { Link } from '@chakra-ui/next-js';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { OwnedNft } from 'alchemy-sdk';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Address } from 'viem';

export type Page = {
  address: Address;
  pageSize: number;
  nextPageKey: string | undefined;
  prevPageKey: string | undefined;
  totalNumberOfPages: number;
};

type NftsProps = {
  items: OwnedNft[];
  page: Page;
};

export const Nfts: FC<NftsProps> = ({ items, page }) => {
  const { account } = useAccountContext();
  const router = useRouter();

  return (
    <>
      {items.length === 0 && <Text>Your account doesn&apos;t have any NFTs yet</Text>}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
        {items
          .map(({ name, contract, tokenId, image }: OwnedNft) => {
            const imageUrl = image.thumbnailUrl ?? image.cachedUrl ?? image.pngUrl ?? image.originalUrl;
            return (
              <Box borderRadius="md" overflow="hidden" key={`${contract.address}.${tokenId}`}>
                <NextLink href={`/nfts/${contract.address}/${tokenId}`}>
                  <Image
                    src={imageUrl ?? '/logo.png'}
                    width={256}
                    height={256}
                    objectFit="contain"
                    alt={name ?? `${contract.address}.${tokenId}`}
                  />
                </NextLink>
              </Box>
            );
          })
          .filter((x) => !!x)}
      </SimpleGrid>

      {page.totalNumberOfPages > 1 && (
        <Flex justifyContent="center" mt={8}>
          <Flex gap={4} alignItems="center">
            {!!page.prevPageKey && (
              <Link href={`?pageKey=${page.prevPageKey}&pageNum=${page.pageNum - 1}`}>Previous</Link>
            )}
            {page.nextPageKey && <Link href={`?pageKey=${page.prevPageKey}&pageNum=${page.pageNum - 1}`}>Next</Link>}
          </Flex>
        </Flex>
      )}
    </>
  );
};
