import { getAlchemySettings } from '@/utils/alchemy';
import { AlchemySmartAccountClient, alchemyEnhancedApiActions } from '@alchemy/aa-alchemy';
import { useQuery } from '@tanstack/react-query';
import { Alchemy } from 'alchemy-sdk';
import { remove } from 'lodash';
import { useMemo } from 'react';
import { Address } from 'viem';

const alchemy = new Alchemy(getAlchemySettings());

// TODO replace with react-query infinite query for pagination
const useNftsForOwner = ({ client, address }: { client: AlchemySmartAccountClient; address: Address }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['nfts-for-owner', address],
    queryFn: async () =>
      client
        .extend(alchemyEnhancedApiActions(alchemy))
        .nft.getNftsForOwner(address)
        .catch(() => {
          return null;
        })
  });

  const { items, count } = useMemo(
    () => (data != null ? { items: data.ownedNfts, count: data.totalCount } : { items: [], count: 0 }),
    [data]
  );

  return {
    items,
    count,
    isLoading,
    refetch,
    remove
  };
};

export default useNftsForOwner;
