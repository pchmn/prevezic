import { initializeApp } from 'firebase-admin/app';
import { DocumentSnapshot, FieldValue, getFirestore } from 'firebase-admin/firestore';
import { EventContext } from 'firebase-functions/v1';

const db = getFirestore(initializeApp());

export default async function (snapshot: DocumentSnapshot, context: EventContext) {
  const data = snapshot.data();

  if (!data || !data.createdBy) {
    throw new Error('Album must have a createdBy field');
  }

  const { albumId } = context.params;

  try {
    await db
      .collection('users')
      .doc(data.createdBy)
      .set({ rights: { [albumId]: 'owner' } }, { merge: true });

    await snapshot.ref.update({ owners: FieldValue.arrayUnion(data.createdBy) });
  } catch (error) {
    console.error(error);
  }
}
