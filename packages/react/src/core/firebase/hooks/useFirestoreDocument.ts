import { QueryKey } from '@tanstack/react-query';
import { DocumentReference, getDoc, onSnapshot } from 'firebase/firestore';
import { useCallback } from 'react';

import { UseFirestoreOptions } from './types';
import { useFirestoreData } from './useFirestoreData';
import { getDataFromSnapshot } from './utils';

export function useFirestoreDocument<T>(
  queryKey: QueryKey,
  ref: DocumentReference<T>,
  options?: UseFirestoreOptions<T> & { withId?: boolean }
) {
  const { withId = true } = options || {};

  const subscribeFn = useCallback(
    (onData: (data: T | null) => void, onError: (error: Error) => void) => {
      return onSnapshot(
        ref,
        (snapshot) => {
          onData(getDataFromSnapshot({ snapshot, withId }));
        },
        (error) => onError(error)
      );
    },
    [withId, ref]
  );

  const fetchFn = useCallback(async () => {
    const snapshot = await getDoc(ref);
    return getDataFromSnapshot({ snapshot, withId });
  }, [ref, withId]);

  return useFirestoreData<T | null>(queryKey, fetchFn, subscribeFn, options);
}
