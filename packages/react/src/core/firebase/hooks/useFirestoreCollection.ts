import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocs, onSnapshot, Query, Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';

import { UseFirestoreOptions } from './types';

export function useFirestoreCollection<T>(
  query: Query,
  { listen = true, defaultValue, enabled = true }: UseFirestoreOptions<T>
) {
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => {
      unsubscribe.current?.();
    };
  }, []);

  const { data, isLoading, isFetching, error } = useQuery<T[], Error>(
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
                  value.push(doc.data() as T);
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
          value.push(doc.data() as T);
        });
      }
      return value;
    },
    { staleTime: Infinity, enabled: enabled }
  );

  return { data: data || defaultValue || [], isLoading, isFetching, error };
}
