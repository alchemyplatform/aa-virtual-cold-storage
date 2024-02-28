'use client';

import { Link } from '@chakra-ui/next-js';
import { Flex, Icon, IconButton, Text, Tooltip, useColorMode } from '@chakra-ui/react';
import { WeatherMoon20Filled, WeatherSunny20Filled } from '@fluentui/react-icons';
import NextLink from 'next/link';
import { FC } from 'react';
import { AppIcon } from '../icons/appIcon';
import { DiscordIcon } from '../icons/discord';
import { GitHubIcon } from '../icons/github';
import { TwitterIcon } from '../icons/twitter';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  const { toggleColorMode, colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  return (
    <Flex flexDir="column" padding={12} maxW={1200} minH="100vh" mx={{ base: 4, lg: 'auto' }}>
      <Flex justifyContent="space-between" py={8}>
        <NextLink href="/">
          <AppIcon />
        </NextLink>
        <Flex gap={4} alignItems="center">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://accountkit.alchemy.com/getting-started/setup.html"
          >
            Docs
          </Link>
          <Link target="_blank" rel="noopener noreferrer" href="https://accountkit.alchemy.com/">
            Account Kit
          </Link>
          <Tooltip label={`Change theme to ${isDark ? 'light' : 'dark'}`} openDelay={500}>
            <IconButton
              aria-label="Change theme"
              variant="ghost"
              icon={<Icon as={isDark ? WeatherSunny20Filled : WeatherMoon20Filled} boxSize={5} />}
              onClick={toggleColorMode}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Flex flexDir="column" flex={1}>
        {children}
      </Flex>
      <Flex as="footer" py={8} gap={3} alignItems="center" justifyContent="space-between">
        <Text color="textSubdued">
          {new Date().getFullYear()}
          <Link href="https://www.alchemy.com/" target="_blank" rel="noopener noreferrer">
            {' '}
            Alchemy Insights, Inc.
          </Link>
        </Text>

        <Flex alignItems="center" gap={3}>
          <IconButton
            variant="ghost"
            aria-label="aa-sdk on Github"
            as={Link}
            icon={<GitHubIcon boxSize={5} />}
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/alchemyplatform/aa-sdk"
          />
          <IconButton
            variant="ghost"
            aria-label="Alchemy Discord"
            as={Link}
            icon={<DiscordIcon boxSize={5} />}
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/alchemyplatform"
          />
          <IconButton
            variant="ghost"
            aria-label="Alchemy Twitter"
            as={Link}
            icon={<TwitterIcon boxSize={5} />}
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/AlchemyPlatform"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
