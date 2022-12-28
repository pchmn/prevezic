export interface UseFirestoreOptions<T> {
  listen?: boolean;
  defaultValue?: T;
  initialData?: T;
  enabled?: boolean;
}

export type DataWithId<T> = T & { id: string };
