import { FunctionParams } from '@prevezic/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailLink,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { useCallback, useState } from 'react';

import { callFunction } from '../functions';
import { useFirestoreData } from './useFirestoreData';

export function useAuth() {
  const subscribeFn = useCallback((onData: (data: User | null) => void, onError: (error: Error) => void) => {
    return onAuthStateChanged(
      getAuth(),
      (firebaseUser) => {
        onData(firebaseUser);
      },
      (error) => onError(error)
    );
  }, []);

  const fetchFn = useCallback(async () => {
    return getAuth().currentUser;
  }, []);

  return useFirestoreData<User | null>(['firebaseAuth'], fetchFn, subscribeFn);
}

export function useSignInAnonymously() {
  return useMutation({ mutationFn: () => signInAnonymously(getAuth()) });
}

export function useSendMagicLink() {
  return useMutation({
    mutationFn: ({ email, from }: Omit<FunctionParams['sendMagicLink'], 'validationUrl'>) =>
      callFunction('sendMagicLink', {
        email,
        validationUrl: encodeURI(`${window.location.origin}/validate-email-link`),
        from: from ? encodeURI(from) : undefined,
      }),
  });
}

export function useSignInWithMagicLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error('No current user');
      }
      const priorTokenId = await auth.currentUser.getIdToken(true);
      console.log('priorTokenId', priorTokenId);
      const result = await signInWithEmailLink(auth, email, window.location.href);
      queryClient.setQueryData<User | null>(['firebaseAuth'], result.user);

      return callFunction('mergeUsers', { priorTokenId });
    },
    retry: false,
    onError: (error) => console.log('error', error),
  });
}

export function useSignInWithGoogle() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const mutate = useCallback(
    async ({ onSuccess, onError }: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      setIsLoading(true);
      setError(undefined);

      const auth = getAuth();
      try {
        if (!auth.currentUser) {
          throw new Error('No current user');
        }

        const priorTokenId = await auth.currentUser?.getIdToken(true);

        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        queryClient.setQueryData<User | null>(['firebaseAuth'], result.user);

        await callFunction('mergeUsers', { priorTokenId });
        setIsLoading(false);
        onSuccess?.();
      } catch (error) {
        setError(error as Error);
        onError?.(error as Error);
        setIsLoading(false);
        throw error;
      }
    },
    [queryClient]
  );

  return { mutate, isLoading, error };

  // return useMutation({
  //   mutationFn: async () => {
  //     let error: Error | undefined;
  //     const auth = getAuth();
  //     const provider = new GoogleAuthProvider();
  //     // console.log('isfocused', focusManager.isFocused());
  //     try {
  //       return await signInWithPopup(auth, provider);
  //     } catch (err) {
  //       console.log('signinerr', err);
  //       error = err as Error;
  //       throw error;
  //     }
  //     // console.log('isfocused', focusManager.isFocused());
  //     // return new Promise((resolve, reject) => {
  //     //   setTimeout(() => reject('Not implemented'), 500);
  //     // });
  //     // throw new Error('Not implemented');
  //   },
  //   onError: (error) => console.log('error', error),
  // });
}

export function useSignOut() {
  return useMutation({ mutationFn: () => getAuth().signOut() });
}
