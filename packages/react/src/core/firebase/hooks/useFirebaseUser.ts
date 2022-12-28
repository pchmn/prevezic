import { UserDocument } from '@prevezic/core';
import { doc, getFirestore } from 'firebase/firestore';
import { useMemo } from 'react';

import { useFirebaseAuthUser } from './useFirebaseAuth';
import { useFirestoreDocument } from './useFirestoreDocument';

export function useFirebaseUser() {
  const { data: firebaseUser, isLoading: authLoading, error: authError } = useFirebaseAuthUser();
  const userRef = useMemo(() => doc(getFirestore(), 'users', firebaseUser?.uid || 'unknown'), [firebaseUser]);
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useFirestoreDocument<UserDocument>(['users', firebaseUser?.uid], userRef, {
    enabled: !!firebaseUser,
  });

  return {
    currentUser: firebaseUser ? { ...firebaseUser, ...user } : firebaseUser,
    isLoading: authLoading || userLoading,
    error: authError || userError,
  };
}
