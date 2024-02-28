'use client';

import { AppIcon } from '@/components/icons/appIcon';
import { AlchemySigner } from '@alchemy/aa-alchemy';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
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
  useDisclosure
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
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
        <AppIcon m={4} />
        <Heading size="md">Login or Sign Up</Heading>
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
              <Center h="36vh">
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
                    <AlertDescription maxWidth="sm">
                      We sent an email to you at {email}. It has a magic link that&apos;ll log you in.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <EmailForm
                    onSubmit={(email) => {
                      _onClose();
                      return setEmail(email);
                    }}
                    buttonDisabled={authType !== 'email'}
                  />
                )}
              </Center>
            </TabPanel>

            <TabPanel>
              <Center h="18vh">
                <Button
                  padding={4}
                  colorScheme="primary"
                  isLoading={authType === 'passkey' && isPending}
                  isDisabled={authType !== 'email'}
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
              </Center>

              <Center h="18vh">
                <Button
                  padding={4}
                  colorScheme="primary"
                  isLoading={isPending}
                  isDisabled={isPending}
                  onClick={() => {
                    _onClose();
                    return mutate({ type: 'passkey', createNew: false });
                  }}
                >
                  Use Existing Passkey
                </Button>
              </Center>
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
