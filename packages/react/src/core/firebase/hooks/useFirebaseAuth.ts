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
import { useCallback } from 'react';

import { callFunction } from '../functions';
import { useFirestoreData } from './useFirestoreData';

export function useFirebaseAuthUser() {
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
      const result = await signInWithEmailLink(auth, email, window.location.href);
      return { user: result.user, priorTokenId };
    },
    onSuccess: ({ user, priorTokenId }: { user: User; priorTokenId: string }) => {
      queryClient.setQueryData<User | null>(['firebaseAuth'], user);
      return callFunction('mergeUsers', { priorTokenId });
    },
  });
}

export function useSignInWithGoogle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error('No current user');
      }
      const priorTokenId = await auth.currentUser.getIdToken(true);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      return { user: result.user, priorTokenId };
    },
    onSuccess: ({ user, priorTokenId }: { user: User; priorTokenId: string }) => {
      queryClient.setQueryData<User | null>(['firebaseAuth'], user);
      return callFunction('mergeUsers', { priorTokenId });
    },
  });
}

export function useSignOut() {
  return useMutation({ mutationFn: () => getAuth().signOut() });
}
