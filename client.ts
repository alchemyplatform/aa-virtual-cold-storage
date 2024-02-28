import { chain } from '@/utils/constants';
import { createBundlerClient } from '@alchemy/aa-core';
import { http } from 'viem';

export const publicClient = createBundlerClient({
  chain,
  transport: http('/api/rpc')
});
