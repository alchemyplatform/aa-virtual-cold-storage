import { chain } from '@/utils/constants';
import { createBundlerClient } from '@alchemy/aa-core';
import { http } from 'viem';
import { getRpcUrl } from './alchemy';

export const publicClient = createBundlerClient({
  chain,
  transport: http(getRpcUrl())
});
