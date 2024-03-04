'use client';

import { AlchemySigner } from '@alchemy/aa-alchemy';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { AppIcon } from '../icons/appIcon';
import EmailForm from './EmailForm';

type Props = {
  signer?: AlchemySigner;
  onLogin: () => void;
};

export const LoginSignupCard = ({ signer, onLogin }: Props) => {
  const { isOpen: alertVisible, onClose, onOpen } = useDisclosure({ defaultIsOpen: false });
  const [error, setError] = useState<string | undefined>(undefined);
  const _onClose = () => {
    onClose();
    setError(undefined);
  };

  const [email, setEmail] = useState<string | undefined>(undefined);

  const { mutate, isPending } = useMutation({
    mutationFn: signer?.authenticate,
    onSuccess: onLogin,
    onError: (e) => {
      console.error('Failed to login', e);
      setError(e.message);
      onOpen();
    }
  });

  const [authType, setAuthType] = useState<'email' | 'passkey'>('email');
  const handleTabsChange = (index: number) => {
    setAuthType(index ? 'passkey' : 'email');
  };

  return (
    <Card align="center" w="lg" h="lg">
      <CardHeader>
        <Center flex="1" flexDirection="column">
          <AppIcon />
          <Heading size="md">Login or Sign Up</Heading>
        </Center>
      </CardHeader>

      <CardBody w="full">
        <Tabs align="center" isFitted index={authType === 'email' ? 0 : 1} onChange={handleTabsChange}>
          <TabList>
            <Tab>Email</Tab>
            <Tab>Passkey</Tab>
          </TabList>

          <TabIndicator mt="-1.5px" height="2px" bg="primary.500" borderRadius="1px" />

          <TabPanels>
            <TabPanel>
              <Box h="36vh" alignContent="center" py="6vh">
                {email && isPending ? (
                  <Alert
                    status="success"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="200px"
                  >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                      Check your email
                    </AlertTitle>
                    <AlertDescription maxWidth="xs">
                      We sent an email to you at {email}. It has a magic link that&apos;ll log you in.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <EmailForm
                    onSubmit={(email) => {
                      _onClose();
                      setEmail(email);
                      return mutate({
                        type: 'email',
                        email
                      });
                    }}
                    buttonDisabled={authType !== 'email'}
                  />
                )}
              </Box>
            </TabPanel>

            <TabPanel>
              <VStack h="18vh" w="50%" align="stretch">
                <Button
                  padding={4}
                  mt={20}
                  colorScheme="primary"
                  isLoading={authType === 'passkey' && isPending}
                  isDisabled={authType !== 'passkey' || isPending}
                  onClick={() => {
                    _onClose();
                    return mutate({
                      type: 'passkey',
                      createNew: true,
                      username: ''
                    });
                  }}
                >
                  Add New Passkey
                </Button>
                <Button
                  padding={4}
                  my={8}
                  colorScheme="primary"
                  isLoading={authType === 'passkey' && isPending}
                  isDisabled={authType !== 'passkey' || isPending}
                  onClick={() => {
                    _onClose();
                    return mutate({ type: 'passkey', createNew: false });
                  }}
                >
                  Use Existing Passkey
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>

      {alertVisible && (
        <CardFooter>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
};
