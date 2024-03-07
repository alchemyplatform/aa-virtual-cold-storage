'use client';

import { SignerContextProvider } from '@/context/account/signer';
import { GlobalModalProvider } from '@/context/app/modal';
import { GlobalStyle } from '@/theme/globalstyles';
import { default as theme } from '@/theme/theme';
import { getRpcUrl } from '@/utils/alchemy';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const customTheme = extendTheme(theme);

const iframeContainerId = 'alchemy-iframe-container-id';
const iframeElementId = 'alchemy-iframe-element-id';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [clientConfig] = useState({
    connection: {
      rpcUrl: getRpcUrl()
    },
    iframeConfig: {
      iframeContainerId,
      iframeElementId
    }
  });

  return (
    <CacheProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider
        theme={customTheme}
        toastOptions={{ defaultOptions: { position: 'top-right', isClosable: true } }}
      >
        <Global styles={GlobalStyle} />
        <QueryClientProvider client={queryClient}>
          <SignerContextProvider client={clientConfig}>
            <GlobalModalProvider>{children}</GlobalModalProvider>
          </SignerContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
