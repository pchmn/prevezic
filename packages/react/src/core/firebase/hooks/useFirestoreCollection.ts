import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CollectionReference, getDocs, onSnapshot, Query, Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';

import { UseFirestoreOptions } from './types';

export function useFirestoreCollection<T>(
  query: Query<T> | CollectionReference<T>,
  { listen = true, defaultValue, enabled = true }: UseFirestoreOptions<T[]>
) {
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => {
      unsubscribe.current?.();
    };
  }, []);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<T[], Error>(
    [query],
    async () => {
      if (listen) {
        let resolved = false;

        return new Promise<T[]>((resolve, reject) => {
          unsubscribe.current = onSnapshot(
            query,
            (querySnapshot) => {
              const value: T[] = [];
              if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                  value.push(doc.data());
                });
              }
              if (!resolved) {
                resolved = true;
                return resolve(value);
              }
              queryClient.setQueryData<T[]>([query], value);
            },
            reject
          );
        });
      }

      const querySnapshot = await getDocs(query);
      const value: T[] = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          value.push(doc.data());
        });
      }
      return value;
    },
    { staleTime: Infinity, enabled, initialData: defaultValue }
  );

  return { data: data || [], loading, error };
}
