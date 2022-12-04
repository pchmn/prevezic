import { useQueryClient } from '@tanstack/react-query';
import {
  getAuth,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { useCallback, useMemo, useState } from 'react';

import { useCallFunction } from './useCallFunction';

export function useFirebaseAuth() {
  const queryClient = useQueryClient();

  const auth = useMemo(() => getAuth(), []);

  const sendMagicLinkFunction = useCallFunction('sendMagicLink');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const signInAnonymously = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      await firebaseSignInAnonymously(auth);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  }, [auth]);

  const sendMagicLink = useCallback(
    async (email: string, redirectTo?: string) => {
      setLoading(true);
      setError(undefined);
      try {
        await sendMagicLinkFunction({ email, redirectTo });
        return setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    },
    [sendMagicLinkFunction]
  );

  const signInWithMagicLink = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(undefined);
      try {
        await signInWithEmailLink(auth, email, window.location.href);
        queryClient.setQueryData<User | null>(['firebaseAuth'], auth.currentUser);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    },
    [auth, queryClient]
  );

  const signOut = useCallback(() => firebaseSignOut(auth), [auth]);

  return {
    signInAnonymously,
    signOut,
    sendMagicLink,
    signInWithMagicLink,
    loading,
    error,
  };
}
