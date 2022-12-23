import { UserType } from '@prevezic/core';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { UserRecord } from 'firebase-functions/v1/auth';

const db = getFirestore(initializeApp());

export default async function (user: UserRecord) {
  let type: UserType;
  if (user.email || user.phoneNumber || user.providerData.length > 0) {
    type = 'account';
  } else {
    type = 'anonymous';
  }

  try {
    await getAuth().setCustomUserClaims(user.uid, { ...user.customClaims, type });

    await db.collection('users').doc(user.uid).set({ type }, { merge: true });
  } catch (error) {
    console.error(error);
  }
}
