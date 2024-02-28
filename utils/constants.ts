import { arbitrumSepolia } from '@alchemy/aa-core';
import { DEPLOYED_COLD_STORAGE_PLUGIN_ADDRESS, DEPLOYED_NFT1_ADDRESS, DEPLOYED_NFT2_ADDRESS } from './deployed';

export const IMAGE_SIZE = 294;
export const IMAGES_PER_PAGE_COUNT = 12;

export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY!;
export const ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL!;

export const COLD_STORAGE_PLUGIN_ADDRESS = DEPLOYED_COLD_STORAGE_PLUGIN_ADDRESS;
export const NFT1_ADDRESS = DEPLOYED_NFT1_ADDRESS;
export const NFT2_ADDRESS = DEPLOYED_NFT2_ADDRESS;

export const ALCHEMY_GAS_MANAGER_POLICY_ID = process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID!;
export const ALCHEMY_ACCESS_KEY = process.env.NEXT_PUBLIC_ALCHEMY_ACCESS_KEY!;

export const chain = arbitrumSepolia;
