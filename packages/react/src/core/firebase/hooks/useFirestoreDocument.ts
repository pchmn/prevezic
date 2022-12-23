import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DocumentReference, DocumentSnapshot, getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { useEffect, useRef } from 'react';

import { UseFirestoreOptions } from './types';

export function useFirestoreDocument<T>(
  ref: DocumentReference<T>,
  { listen = true, defaultValue, enabled = true }: UseFirestoreOptions<T>
) {
  const queryClient = useQueryClient();
  const unsubscribe = useRef<Unsubscribe>();

  useEffect(() => {
    return () => {
      unsubscribe.current?.();
    };
  }, []);

  const { data, isLoading, isFetching, error } = useQuery<T | undefined | null, Error>(
    [ref.path],
    async () => {
      if (listen) {
        let resolved = false;

        return new Promise<T | undefined | null>((resolve, reject) => {
          unsubscribe.current = onSnapshot(
            ref,
            (doc) => {
              if (!resolved) {
                resolved = true;
                return resolve(getDataFromSnapshot(doc, defaultValue));
              }
              queryClient.setQueryData<T | undefined | null>([ref.path], getDataFromSnapshot(doc, defaultValue));
            },
            reject
          );
        });
      }

      const doc = await getDoc(ref);
      return getDataFromSnapshot(doc, defaultValue);
    },
    { staleTime: Infinity, enabled: enabled, initialData: defaultValue }
  );

  return { data: data, isLoading, isFetching, error };
}

function getDataFromSnapshot<T>(snapshot: DocumentSnapshot<T>, defaultValue?: T) {
  return snapshot.data() || defaultValue || null;
}
