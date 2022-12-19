import { useQueryClient } from '@tanstack/react-query';
import {
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithEmailLink,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
  UserCredential,
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
        validationUrl: encodeURI(`${window.location.origin}/signin/validate-link`),
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
        let result: UserCredential;
        if (auth.currentUser) {
          const credential = EmailAuthProvider.credentialWithLink(email, window.location.href);
          result = await linkWithCredential(auth.currentUser, credential);
        } else {
          result = await signInWithEmailLink(auth, email, window.location.href);
        }
        queryClient.setQueryData<User | null>(['firebaseAuth'], result.user);
        setLoading(false);
        return result;
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
      let result: UserCredential;
      if (auth.currentUser) {
        result = await linkWithPopup(auth.currentUser, new GoogleAuthProvider());
      } else {
        result = await signInWithPopup(auth, new GoogleAuthProvider());
      }
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
