import { useQueryClient } from '@tanstack/react-query';
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithEmailLink,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { useCallback, useMemo, useState } from 'react';

import { callFunction } from '../functions';

export function useFirebaseAuth() {
  const queryClient = useQueryClient();

  const auth = useMemo(() => getAuth(), []);

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

  const sendMagicLink = useCallback(async (email: string, from?: string) => {
    setLoading(true);
    setError(undefined);
    try {
      await callFunction('sendMagicLink', {
        email,
        validationUrl: `${window.location.origin}/signin/validate-link`,
        from,
      });
      return setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  }, []);

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

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      queryClient.setQueryData<User | null>(['firebaseAuth'], result.user);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  }, [auth, queryClient]);

  const signOut = useCallback(() => firebaseSignOut(auth), [auth]);

  return {
    signInAnonymously,
    signOut,
    sendMagicLink,
    signInWithMagicLink,
    signInWithGoogle,
    loading,
    error,
  };
}
