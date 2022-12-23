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
        validationUrl: encodeURI(`${window.location.origin}/validate-email-link`),
        from: from ? encodeURI(from) : undefined,
      });
      return setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, []);

  const signInWithMagicLink = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(undefined);

      try {
        if (!auth.currentUser) {
          throw new Error('No current user');
        }

        const priorTokenId = await auth.currentUser?.getIdToken(true);

        const result = await signInWithEmailLink(auth, email, window.location.href);
        queryClient.setQueryData<User | null>(['firebaseAuth'], result.user);

        await callFunction('mergeUsers', { priorTokenId });
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
        throw error;
      }
    },
    [auth, queryClient]
  );

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      if (!auth.currentUser) {
        throw new Error('No current user');
      }

      const priorTokenId = await auth.currentUser?.getIdToken(true);

      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      queryClient.setQueryData<User | null>(['firebaseAuth'], result.user);

      await callFunction('mergeUsers', { priorTokenId });
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, [auth, queryClient]);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      await firebaseSignOut(auth);
      console.log('firebaseSignOut', auth.currentUser);
      setLoading(false);
    } catch (error) {
      console.log('error', error);
      setError(error as Error);
      setLoading(false);
      throw error;
    }
  }, [auth]);

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
