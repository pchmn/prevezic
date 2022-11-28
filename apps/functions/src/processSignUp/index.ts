import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { UserRecord } from 'firebase-functions/v1/auth';

const db = getFirestore(initializeApp());

export default async function (user: UserRecord) {
  if (user.email || user.phoneNumber || user.providerData.length > 0) {
    try {
      // Editor user can access dahsboard
      await getAuth().setCustomUserClaims(user.uid, { ...user.customClaims, isAccount: true });

      await db.collection('users').doc(user.uid).set({ isAccount: true }, { merge: true });
    } catch (error) {
      console.error(error);
    }
  }
}
