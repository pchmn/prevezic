import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useCallback } from 'react';

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
