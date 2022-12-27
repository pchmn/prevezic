export interface UseFirestoreOptions<T> {
  listen?: boolean;
  defaultValue?: T;
  initialData?: T;
  enabled?: boolean;
}
