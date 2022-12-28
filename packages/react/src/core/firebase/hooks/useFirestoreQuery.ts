import { QueryKey } from '@tanstack/react-query';
import { getDocs, onSnapshot, Query } from 'firebase/firestore';
import { useCallback } from 'react';

import { UseFirestoreOptions } from './types';
import { useFirestoreData } from './useFirestoreData';
import { getDataFromSnapshot } from './utils';

export function useFirestoreQuery<T>(
  queryKey: QueryKey,
  query: Query<T>,
  options?: UseFirestoreOptions<T[]> & { withId?: boolean }
) {
  const { withId = true } = options || {};

  const subscribeFn = useCallback(
    (onData: (data: T[]) => void, onError: (error: Error) => void) => {
      return onSnapshot(
        query,
        (querySnapshot) => {
          const value: T[] = [];
          if (!querySnapshot.empty) {
            querySnapshot.forEach((snapshot) => {
              value.push(getDataFromSnapshot({ snapshot, withId, nullable: false }) as T);
            });
          }
          onData(value);
        },
        (error) => onError(error)
      );
    },
    [query, withId]
  );

  const fetchFn = useCallback(async () => {
    const querySnapshot = await getDocs(query);
    const value: T[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((snapshot) => {
        value.push(getDataFromSnapshot({ snapshot, withId, nullable: false }) as T);
      });
    }
    return value;
  }, [query, withId]);

  return useFirestoreData<T[]>(queryKey, fetchFn, subscribeFn, options);
}
