import { FunctionParams, FunctionValidation, UserDocument, UserRole } from '@prevezic/core';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { CallableContext, HttpsError } from 'firebase-functions/v1/https';

const db = getFirestore(initializeApp());

export default async (data: FunctionParams['mergeUsers'], context: CallableContext) => {
  try {
    FunctionValidation['mergeUsers'].parse(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpsError('invalid-argument', 'Invalid data', error.issues);
  }

  const priorToken = await getAuth().verifyIdToken(data.priorTokenId);
  const currentToken = context.auth?.token;

  if (!currentToken) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  if (priorToken.firebase.sign_in_provider !== 'anonymous') {
    throw new HttpsError('internal', 'Prior user to merge must be anonymous');
  }
  if (currentToken.firebase.sign_in_provider === 'anonymous') {
    throw new HttpsError('internal', 'Current user to merge cannot be anonymous');
  }

  const previousUser = (await db.collection('users').doc(priorToken.uid).get()).data() as UserDocument;
  // Don't merge if prior user has no rights
  if (previousUser && previousUser.rights) {
    const currentUser = (await db.collection('users').doc(currentToken.uid).get()).data() as UserDocument;

    const mergedRights = getMergedUserRights(previousUser, currentUser);

    // Merge only if there are changes
    if (mergedRights) {
      await db.collection('users').doc(currentToken.uid).set({ rights: mergedRights }, { merge: true });
    }
  }

  await getAuth().deleteUser(priorToken.uid);
  await db.collection('users').doc(priorToken.uid).delete();

  return { success: true };
};

function getMergedUserRights(previousUserDoc: UserDocument, currentUserDoc: UserDocument) {
  const previousUserRights = previousUserDoc.rights || {};
  const currentUserRights = currentUserDoc.rights || {};

  const mergedRights = { ...currentUserRights };

  Object.keys(previousUserRights).forEach((key) => {
    if (mergedRights[key]) {
      const higherRole = getHigherRole(mergedRights[key], previousUserRights[key]);
      if (higherRole === 'none') {
        delete mergedRights[key];
      } else {
        mergedRights[key] = higherRole;
      }
    } else if (['owner', 'editor', 'member'].includes(previousUserRights[key])) {
      mergedRights[key] = previousUserRights[key];
    }
  });

  let hasChanges = false;
  Object.keys(mergedRights).forEach((key) => {
    if (mergedRights[key] !== currentUserRights[key]) {
      hasChanges = true;
    }
  });

  return hasChanges ? mergedRights : undefined;
}

function getHigherRole(role1: UserRole, role2: UserRole) {
  if (role1 === 'owner' || role2 === 'owner') {
    return 'owner';
  }
  if (role1 === 'editor' || role2 === 'editor') {
    return 'editor';
  }
  if (role1 === 'member' || role2 === 'member') {
    return 'member';
  }
  return 'none';
}
