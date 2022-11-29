import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DocumentReference, getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';

import { UseFirestoreOptions } from './types';

export function useFirestoreDocument<T>(
  ref: DocumentReference,
  { listen = true, defaultValue, enabled = true }: UseFirestoreOptions<T>
) {
  console.log('listen', listen);
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => {
      unsubscribe.current?.();
    };
  }, []);

  const { data, isLoading, isFetching, error } = useQuery<T | undefined, Error>(
    [ref.path],
    async () => {
      if (listen) {
        let resolved = false;

        return new Promise<T | undefined>((resolve, reject) => {
          unsubscribe.current = onSnapshot(
            ref,
            (doc) => {
              if (!resolved) {
                resolved = true;
                return resolve(doc.data() as T);
              }
              queryClient.setQueryData<T | undefined>([ref.path], doc.data() as T);
            },
            reject
          );
        });
      }

      const doc = await getDoc(ref);
      return doc.data() as T;
    },
    { staleTime: Infinity, enabled: enabled, initialData: defaultValue }
  );

  return { data: data || defaultValue, isLoading, isFetching, error };
}
