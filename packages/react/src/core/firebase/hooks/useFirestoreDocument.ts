import { QueryKey } from '@tanstack/react-query';
import { DocumentReference, getDoc, onSnapshot } from 'firebase/firestore';
import { useCallback } from 'react';

import { DataWithId, UseFirestoreOptions } from './types';
import { useFirestoreData } from './useFirestoreData';
import { getDataFromSnapshot } from './utils';

export function useFirestoreDocument<T>(
  queryKey: QueryKey,
  ref: DocumentReference<T>,
  options?: UseFirestoreOptions<DataWithId<T>>
) {
  const subscribeFn = useCallback(
    (onData: (data: DataWithId<T> | null) => void, onError: (error: Error) => void) => {
      return onSnapshot(
        ref,
        (snapshot) => {
          onData(getDataFromSnapshot({ snapshot }));
        },
        (error) => onError(error)
      );
    },
    [ref]
  );

  const fetchFn = useCallback(async () => {
    const snapshot = await getDoc(ref);
    return getDataFromSnapshot({ snapshot });
  }, [ref]);

  return useFirestoreData<DataWithId<T> | null>(queryKey, fetchFn, subscribeFn, options);
}
