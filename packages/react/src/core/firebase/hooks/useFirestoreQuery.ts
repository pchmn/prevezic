import { QueryKey } from '@tanstack/react-query';
import { getDocs, onSnapshot, Query } from 'firebase/firestore';
import { useCallback } from 'react';

import { DataWithId, UseFirestoreOptions } from './types';
import { useFirestoreData } from './useFirestoreData';
import { getDataFromSnapshot } from './utils';

export function useFirestoreQuery<T>(
  queryKey: QueryKey,
  query: Query<T>,
  options?: UseFirestoreOptions<DataWithId<T>[]>
) {
  const subscribeFn = useCallback(
    (onData: (data: DataWithId<T>[]) => void, onError: (error: Error) => void) => {
      return onSnapshot(
        query,
        (querySnapshot) => {
          const value: DataWithId<T>[] = [];
          if (!querySnapshot.empty) {
            querySnapshot.forEach((snapshot) => {
              value.push(getDataFromSnapshot({ snapshot, nullable: false }));
            });
          }
          onData(value);
        },
        (error) => onError(error)
      );
    },
    [query]
  );

  const fetchFn = useCallback(async () => {
    const querySnapshot = await getDocs(query);
    const value: DataWithId<T>[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((snapshot) => {
        value.push(getDataFromSnapshot({ snapshot, nullable: false }));
      });
    }
    return value;
  }, [query]);

  return useFirestoreData<DataWithId<T>[]>(queryKey, fetchFn, subscribeFn, {
    ...options,
    initialData: [],
  });
}
