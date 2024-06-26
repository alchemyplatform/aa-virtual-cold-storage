'use client';

import { useSignerContext } from '@/context/account/signer';
import { ModalType, useGlobalModalContext } from '@/context/app/modal';
import { Link } from '@chakra-ui/next-js';
import { Flex, Icon, IconButton, Text, Tooltip, useColorMode } from '@chakra-ui/react';
import { WeatherMoon20Filled, WeatherSunny20Filled } from '@fluentui/react-icons';
import NextLink from 'next/link';
import { FC } from 'react';
import { HiOutlineUser } from 'react-icons/hi';
import { AppIcon } from '../icons/appIcon';
import { DiscordIcon } from '../icons/discord';
import { GitHubIcon } from '../icons/github';
import { TwitterIcon } from '../icons/twitter';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { account } = useSignerContext();
  const { showModal } = useGlobalModalContext();

  const isDark = colorMode === 'dark';

  return (
    <Flex flexDir="column" px={8} py={2} maxW={1200} minH="100vh" mx={{ base: 4, lg: 'auto' }}>
      <Flex justifyContent="space-between">
        <Flex gap={4} alignItems="center">
          <NextLink href="/">
            <AppIcon />
          </NextLink>
          <Link
            fontSize="0.9rem"
            target="_blank"
            rel="noopener noreferrer"
            href="https://accountkit.alchemy.com/getting-started/setup.html"
          >
            Docs
          </Link>
          <Link fontSize="0.9rem" target="_blank" rel="noopener noreferrer" href="https://accountkit.alchemy.com/">
            Account Kit
          </Link>
        </Flex>
        <Flex gap={4} alignItems="center">
          <Tooltip label="Your Account" openDelay={500}>
            <IconButton
              aria-label="Your Account"
              variant="ghost"
              colorScheme="info"
              icon={<Icon as={HiOutlineUser} boxSize={6} />}
              onClick={() => showModal(ModalType.USER_CARD)}
              isDisabled={!account}
            />
          </Tooltip>
          <Tooltip label={`Change theme to ${isDark ? 'light' : 'dark'}`} openDelay={500}>
            <IconButton
              aria-label="Change theme"
              variant="ghost"
              colorScheme="info"
              icon={<Icon as={isDark ? WeatherSunny20Filled : WeatherMoon20Filled} boxSize={5} />}
              onClick={toggleColorMode}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Flex flexDir="column" flex={1}>
        {children}
      </Flex>
      <Flex as="footer" pt={8} pb={2} gap={3} alignItems="center" justifyContent="space-between">
        <Text color="textSubdued" fontSize="xs" ms={4}>
          {new Date().getFullYear()}
          <Link href="https://www.alchemy.com/" target="_blank" rel="noopener noreferrer">
            {' '}
            Alchemy Insights, Inc.
          </Link>
        </Text>

        <Flex alignItems="center" gap={6}>
          <IconButton
            variant="ghost"
            aria-label="aa-sdk on Github"
            as={Link}
            icon={<GitHubIcon boxSize={6} />}
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/alchemyplatform/aa-sdk"
          />
          <IconButton
            variant="ghost"
            aria-label="Alchemy Discord"
            as={Link}
            icon={<DiscordIcon boxSize={6} />}
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/alchemyplatform"
          />
          <IconButton
            variant="ghost"
            aria-label="Alchemy Twitter"
            as={Link}
            icon={<TwitterIcon boxSize={6} />}
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/AlchemyPlatform"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
