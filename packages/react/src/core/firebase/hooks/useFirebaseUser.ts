import { UserDocument } from '@prevezic/core';
import { User } from 'firebase/auth';
import { doc, getFirestore } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from './useAuth';
import { useFirestoreDoc } from './useFirestoreDoc';

export function useFirebaseUser() {
  const { data: firebaseUser, isLoading: authLoading, error: authError } = useAuth();
  const userRef = useMemo(() => doc(getFirestore(), 'users', firebaseUser?.uid || 'unknown'), [firebaseUser]);
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useFirestoreDoc<UserDocument>(['users', firebaseUser?.uid], userRef, { enabled: !!firebaseUser });

  const [currentUser, setCurrentUser] = useState<(User & UserDocument) | null | undefined>();

  useEffect(() => {
    if (firebaseUser) {
      setCurrentUser({ ...firebaseUser, ...user });
    } else {
      setCurrentUser(firebaseUser);
    }
  }, [firebaseUser, user]);

  return {
    currentUser,
    isLoading: authLoading || userLoading,
    error: authError || userError,
  };

  // const queryClient = useQueryClient();

  // const db = useMemo(() => getFirestore(), []);
  // const auth = useMemo(() => getAuth(), []);
  // const unsubscribe = useRef<Unsubscribe>();

  // const [firebaseUsercurrentUser, setCurrentUser] = useState<(User & UserDocument) | null | undefined>();

  // useEffect(() => {
  //   return () => unsubscribe.current?.();
  // }, []);

  // const {
  //   data: currentAuthUser,
  //   isLoading,
  //   isFetching,
  //   error,
  // } = useQuery<User | null, Error>(
  //   ['firebaseAuth'],
  //   async () => {
  //     let resolved = false;

  //     return new Promise<User | null>((resolve, reject) => {
  //       unsubscribe.current = onAuthStateChanged(
  //         auth,
  //         (firebaseUser) => {
  //           if (!resolved) {
  //             resolved = true;
  //             return resolve(firebaseUser);
  //           }
  //           queryClient.setQueryData<User | null>(['firebaseAuth'], firebaseUser);
  //         },
  //         reject
  //       );
  //     });
  //   },
  //   { staleTime: Infinity }
  // );

  // const userRef = useMemo(() => doc(db, 'users', currentUser?.uid || 'unknown'), [db, currentUser]);
  // const { data: user } = useFirestoreDocument<UserDocument>(userRef, { enabled: !!currentUser });

  // useEffect(() => {
  //   if (currentAuthUser) {
  //     setCurrentUser({ ...currentAuthUser, ...user });
  //   } else {
  //     setCurrentUser(currentAuthUser);
  //   }
  // }, [currentAuthUser, user]);

  // return {
  //   currentUser,
  //   isLoading,
  //   isFetching,
  //   error,
  // };
}
