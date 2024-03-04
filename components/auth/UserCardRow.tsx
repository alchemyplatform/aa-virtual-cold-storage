'use client';

import { Button, Flex, HStack, Spacer, Text, VStack, useClipboard, useToast } from '@chakra-ui/react';
import { ReactNode, useCallback, useMemo } from 'react';

interface UserCardRowProps {
  action?: ReactNode | undefined;
  copyable?: boolean;
  title: string;
  value: string | ReactNode;
}

export const UserCardRow = ({ action, title, value, copyable = false }: UserCardRowProps) => {
  const { onCopy } = useClipboard('');
  const toast = useToast();

  const _copyable = useMemo(() => copyable && action === undefined, [copyable, action]);
  const _onCopy = useCallback(() => {
    onCopy();
    toast({
      description: `${title} copied to clipboard`,
      status: 'success'
    });
  }, [onCopy, title, toast]);

  const inner = (
    <>
      <VStack align="start">
        <Text as="b" fontSize="sm">
          {title}
        </Text>
        {typeof value === 'string' ? <Text fontSize="sm">{value}</Text> : value}
      </VStack>
      {action && (
        <>
          <Spacer />
          {action}
        </>
      )}
    </>
  );

  return (
    <Flex>
      {_copyable ? (
        <Button bg="white" p="0" flex={1} h="40px" flexDirection="row" onClick={_onCopy}>
          {inner}
        </Button>
      ) : (
        <HStack flex={1} p="0" h="40px" flexDirection="row">
          {inner}
        </HStack>
      )}
    </Flex>
  );
};
