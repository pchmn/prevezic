import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAuth, onAuthStateChanged, Unsubscribe, User } from 'firebase/auth';
import { doc, getFirestore } from 'firebase/firestore';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useFirestoreDocument } from './useFirestoreDocument';

export function useFirebaseUser() {
  const queryClient = useQueryClient();

  const db = useMemo(() => getFirestore(), []);
  const auth = useMemo(() => getAuth(), []);
  const unsubscribe = useRef<Unsubscribe>();

  const [idToken, setIdToken] = useState<string | undefined>();

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  const {
    data: currentUser,
    isLoading,
    isFetching,
    error,
  } = useQuery<User | null, Error>(
    ['firebaseAuth'],
    async () => {
      let resolved = false;

      return new Promise<User | null>((resolve, reject) => {
        unsubscribe.current = onAuthStateChanged(
          auth,
          (firebaseUser) => {
            if (!resolved) {
              resolved = true;
              return resolve(firebaseUser);
            }
            queryClient.setQueryData<User | null>(['firebaseAuth'], firebaseUser);
          },
          reject
        );
      });
    },
    { staleTime: Infinity }
  );

  const userRef = useMemo(() => doc(db, 'users', currentUser?.uid || 'unknown'), [db, currentUser]);
  const { data: user } = useFirestoreDocument(userRef, { enabled: !!currentUser });

  useEffect(() => {
    currentUser?.getIdToken().then(setIdToken);
  }, [currentUser, user]);

  return {
    currentUser,
    idToken,
    isLoading,
    isFetching,
    error,
  };
}
