import { DocumentSnapshot } from 'firebase/firestore';

export function getDataFromSnapshot<T>({
  snapshot,
  nullable = true,
  withId = true,
}: {
  snapshot: DocumentSnapshot<T>;
  nullable?: boolean;
  withId?: boolean;
}) {
  const data = snapshot.data() || null;

  if (!nullable && !data) {
    throw new Error('Document does not exist');
  }

  return withId && data ? { ...data, id: snapshot.id } : data;
}
