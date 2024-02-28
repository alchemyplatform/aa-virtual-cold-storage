import { createAlchemySigner } from '@/signer/alchemy';
import { AlchemySigner, User } from '@alchemy/aa-alchemy';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { usePromise } from './usePromise';

export const useAlchemySigner = () => {
  const signerIframeId = 'turnkey-iframe-container';

  const [alchemySigner] = useState<Promise<AlchemySigner | null>>(() => createAlchemySigner(signerIframeId));
  // The usePromise hook is a helpful utility that makes it easier to resolve user's input after
  // a request has already been initiated
  const { promise: bundle, resolve } = usePromise<string>();
  const [email, setEmail] = useState<string>('');
  const [bundleInput, setBundleInput] = useState<string>('');
  const [user, setUser] = useState<User>();

  const {
    mutate: authenticate,
    isPending: authenticatePending,
    isError: authenticateError,
    isSuccess: authenticateSuccess
  } = useMutation({
    mutationFn: async (email: string) => {
      const signer = await alchemySigner;
      if (!signer) {
        return;
      }
      return signer.authenticate({ type: 'email', email, bundle }).then((_user) => setUser(_user));
    }
  });

  const {
    mutate: disconnect,
    isError: disconnectError,
    isSuccess: disconnectSuccess
  } = useMutation({
    mutationFn: async () => {
      const signer = await alchemySigner;
      if (!signer) {
        return;
      }
      return signer.disconnect().then((_user) => setUser(undefined));
    }
  });

  const onBundle = useCallback(async (bundleInput: string) => resolve(bundleInput), [resolve]);

  useEffect(() => {
    async function init() {
      const signer = await alchemySigner;
      if (!signer) {
        return;
      }

      const _user = await signer.getAuthDetails().catch(() => undefined);
      if (!_user) {
        return;
      }

      setUser(_user);
      return _user;
    }

    if (user) {
      return;
    }

    init()
      .then((_user) => console.log('[Alchemy Signer] logged in', _user))
      .catch((e) => console.error('[Alchemy Signer] error', e));
  }, [alchemySigner, user]);

  return {
    signerIframeId,
    alchemySigner,

    user,

    authenticate,
    authenticatePending,
    authenticateError,
    authenticateSuccess,

    disconnect,
    disconnectError,
    disconnectSuccess,

    email,
    setEmail,

    bundleInput,
    setBundleInput,

    bundle,
    onBundle
  };
};
