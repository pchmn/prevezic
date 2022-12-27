import { QueryKey } from '@tanstack/react-query';
import { getDocs, onSnapshot, Query } from 'firebase/firestore';
import { useCallback } from 'react';

import { UseFirestoreOptions } from './types';
import { useFirestoreData } from './useFirestoreData';

export function useFirestoreQuery<T>(queryKey: QueryKey, query: Query<T>, options?: UseFirestoreOptions<T[]>) {
  const subscribeFn = useCallback(
    (onData: (data: T[]) => void, onError: (error: Error) => void) => {
      return onSnapshot(
        query,
        (querySnapshot) => {
          const value: T[] = [];
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              value.push(doc.data());
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
    console.log('fetchFn');
    const querySnapshot = await getDocs(query);
    const value: T[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        value.push(doc.data());
      });
    }
    return value;
  }, [query]);

  return useFirestoreData<T[]>(queryKey, fetchFn, subscribeFn, options);

  // return useQuery<T[], Error>(
  //   queryKey,
  //   async () => {
  //     if (listen) {
  //       let resolved = false;

  //       return new Promise<T[]>((resolve, reject) => {
  //         unsubscribes[queryKeyHash] = onSnapshot(
  //           query,
  //           (querySnapshot) => {
  //             const value: T[] = [];
  //             if (!querySnapshot.empty) {
  //               querySnapshot.forEach((doc) => {
  //                 value.push(doc.data());
  //               });
  //             }
  //             if (!resolved) {
  //               resolved = true;
  //               return resolve(value);
  //             }
  //             queryClient.setQueryData<T[]>([queryKey], value);
  //           },
  //           reject
  //         );
  //       });
  //     }

  //     const querySnapshot = await getDocs(query);
  //     const value: T[] = [];
  //     if (!querySnapshot.empty) {
  //       querySnapshot.forEach((doc) => {
  //         value.push(doc.data());
  //       });
  //     }
  //     return value;
  //   },
  //   {
  //     enabled,
  //     initialData,
  //     staleTime: Infinity,
  //     retry: false,
  //     refetchInterval: undefined,
  //     refetchOnMount: true,
  //     refetchOnReconnect: false,
  //     refetchOnWindowFocus: false,
  //   }
  // );
}
