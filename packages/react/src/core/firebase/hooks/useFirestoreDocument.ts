import { QueryKey } from '@tanstack/react-query';
import { DocumentReference, getDoc, onSnapshot } from 'firebase/firestore';
import { useCallback } from 'react';

import { UseFirestoreOptions } from './types';
import { useFirestoreData } from './useFirestoreData';

export function useFirestoreDocument<T>(
  queryKey: QueryKey,
  ref: DocumentReference<T>,
  options?: UseFirestoreOptions<T>
) {
  const subscribeFn = useCallback(
    (onData: (data: T | null) => void, onError: (error: Error) => void) => {
      return onSnapshot(
        ref,
        (querySnapshot) => {
          onData(querySnapshot.data() || null);
        },
        (error) => onError(error)
      );
    },
    [ref]
  );

  const fetchFn = useCallback(async () => {
    const snapshot = await getDoc(ref);
    return snapshot.data() || null;
  }, [ref]);

  return useFirestoreData<T | null>(queryKey, fetchFn, subscribeFn, options);
}
