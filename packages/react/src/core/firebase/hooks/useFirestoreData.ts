import { hashQueryKey, QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { Unsubscribe as UnsubscribeAuth } from 'firebase/auth';
import { Unsubscribe as UnsubscribeFirestore } from 'firebase/firestore';
import { useEffect, useRef } from 'react';

import { UseFirestoreOptions } from './types';

const unsubscribes: Record<string, UnsubscribeFirestore | UnsubscribeAuth> = {};
const observersCount: Record<string, number> = {};

export function useFirestoreData<T>(
  queryKey: QueryKey,
  fetchFn: () => Promise<T>,
  subscribeFn: (onData: (data: T) => void, onError: (error: Error) => void) => UnsubscribeFirestore | UnsubscribeAuth,
  options?: UseFirestoreOptions<T>
) {
  const { listen = true, initialData, enabled = true } = options || {};
  const queryKeyHash = hashQueryKey(queryKey);
  const previousQueryKeyHash = useRef<string>(queryKeyHash);
  const previousData = useRef<T>();

  const queryClient = useQueryClient();

  const unsubscribe = (key: string) => {
    if (observersCount[key] === 1) {
      unsubscribes[key]?.();
      delete unsubscribes[key];
    }
    observersCount[key] += -1;
  };

  useEffect(() => {
    if (listen) {
      observersCount[queryKeyHash] = observersCount[queryKeyHash] ? observersCount[queryKeyHash] + 1 : 1;
    }

    if (previousQueryKeyHash.current && previousQueryKeyHash.current !== queryKeyHash) {
      unsubscribe(previousQueryKeyHash.current);
      previousQueryKeyHash.current = queryKeyHash;
    }

    return () => unsubscribe(queryKeyHash);
  }, [listen, queryKeyHash]);

  return useQuery<T, Error>(
    queryKey,
    async () => {
      if (listen) {
        let resolved = false;

        return new Promise<T>((resolve, reject) => {
          unsubscribes[queryKeyHash] = subscribeFn((data) => {
            previousData.current = data;
            if (!resolved) {
              resolved = true;
              return resolve(data);
            }
            queryClient.setQueryData<T>(queryKey, data);
          }, reject);
        });
      }
      return fetchFn();
    },
    {
      enabled,
      initialData,
      staleTime: Infinity,
      retry: false,
      refetchInterval: undefined,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
}
