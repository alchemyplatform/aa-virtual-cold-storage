'use client';

import { ANVIL_NFT2_ADDRESS } from '@/utils/anvil';
import { freelyMintableNftAbi } from '@/utils/wagmi';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { createWalletClient, getContract, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';
import { GlobalStyle } from '../theme/globalstyles';
import { default as theme } from '../theme/theme';

const customTheme = extendTheme(theme);

void (async () => {
  const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
  const client = createWalletClient({ account, transport: http('http://localhost:8545'), chain: foundry }).extend(
    publicActions
  );
  const nftContract = getContract({ abi: freelyMintableNftAbi, address: ANVIL_NFT2_ADDRESS, client });
  const txHash = await nftContract.write.mint([account.address, 5]);
  await client.waitForTransactionReceipt({ hash: txHash });
  const tokenUri = await nftContract.read.tokenURI([BigInt(0)]);
  console.log({ tokenUri });
})();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={customTheme}>
        <Global styles={GlobalStyle} />
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
