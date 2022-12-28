import { DocumentSnapshot } from 'firebase/firestore';

import { DataWithId } from './types';

type Data<T, Nullable> = Nullable extends true ? T | null : T;

export function getDataFromSnapshot<T, Nullable extends boolean = true>({
  snapshot,
  nullable,
}: {
  snapshot: DocumentSnapshot<T>;
  nullable?: Nullable;
}) {
  const data = snapshot.data() || null;

  if (!nullable && !data) {
    throw new Error('Document does not exist');
  }

  return (data ? { ...data, id: snapshot.id } : data) as Data<DataWithId<T>, Nullable>;
}
