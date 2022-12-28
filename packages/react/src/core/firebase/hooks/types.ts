export interface UseFirestoreOptions<T> {
  listen?: boolean;
  defaultValue?: T;
  initialData?: T;
  enabled?: boolean;
}

export type DocumentWithId<T> = T & { id: string };
