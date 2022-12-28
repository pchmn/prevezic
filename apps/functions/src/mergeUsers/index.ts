import { FunctionParams, FunctionValidation, UserDocument, UserRole } from '@prevezic/core';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { CallableContext, HttpsError } from 'firebase-functions/v1/https';

const db = getFirestore(initializeApp());

export default async (data: FunctionParams['mergeUsers'], context: CallableContext) => {
  try {
    FunctionValidation['mergeUsers'].parse(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new HttpsError('invalid-argument', 'Invalid data', error.issues);
  }

  const previousToken = await getAuth().verifyIdToken(data.previousTokenId);
  const currentToken = context.auth?.token;

  if (!currentToken) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  if (previousToken.firebase.sign_in_provider !== 'anonymous') {
    throw new HttpsError('internal', 'Prior user to merge must be anonymous');
  }
  if (currentToken.firebase.sign_in_provider === 'anonymous') {
    throw new HttpsError('internal', 'Current user to merge cannot be anonymous');
  }

  const previousUser = (await db.collection('users').doc(previousToken.uid).get()).data() as UserDocument;
  // Don't merge if prior user has no rights
  if (previousUser && previousUser.rights) {
    const currentUser = (await db.collection('users').doc(currentToken.uid).get()).data() as UserDocument;

    const { rightsToUpdate, rightsToDelete } = getRightsToUpdate(
      { ...previousUser, uid: previousToken.uid },
      { ...currentUser, uid: currentToken.uid }
    );

    // Merge only if there are changes
    if (Object.keys(rightsToUpdate).length > 0) {
      await db.collection('users').doc(currentToken.uid).set({ rights: rightsToUpdate }, { merge: true });

      const batch = db.batch();
      for (const key of Object.keys(rightsToUpdate)) {
        const albumRef = db.collection('albums').doc(key);
        batch.update(albumRef, { [`${rightsToUpdate[key]}s`]: FieldValue.arrayUnion(currentToken.uid) });
      }
      for (const key of Object.keys(rightsToDelete)) {
        const albumRef = db.collection('albums').doc(key);
        batch.update(albumRef, { [`${rightsToUpdate[key]}s`]: FieldValue.arrayRemove(rightsToDelete[key]) });
      }
      await batch.commit();
    }
  }

  await getAuth().deleteUser(previousToken.uid);
  await db.collection('users').doc(previousToken.uid).delete();

  return { success: true };
};

function getRightsToUpdate(previousUser: UserDocument & { uid: string }, currentUser: UserDocument & { uid: string }) {
  const previousUserRights = previousUser.rights || {};
  const currentUserRights = currentUser.rights || {};

  const rightsToUpdate: Record<string, UserRole> = {};
  const rightsToDelete: Record<string, string[]> = {};

  Object.keys(previousUserRights).forEach((key) => {
    if (currentUserRights[key]) {
      if (isRoleHigher(previousUserRights[key], currentUserRights[key])) {
        rightsToUpdate[key] = previousUserRights[key];
        rightsToDelete[key] = rightsToDelete[key] ? [...rightsToDelete[key], currentUser.uid] : [currentUser.uid];
      }
    } else if (['owner', 'editor', 'member'].includes(previousUserRights[key])) {
      rightsToUpdate[key] = previousUserRights[key];
    }
    rightsToDelete[key] = rightsToDelete[key] ? [...rightsToDelete[key], previousUser.uid] : [previousUser.uid];
  });

  return { rightsToUpdate, rightsToDelete };
}

function isRoleHigher(role1: UserRole, role2: UserRole) {
  if (role1 === 'owner' && role2 !== 'owner') {
    return true;
  }
  if (role1 === 'editor' && !['owner', 'editor'].includes(role2)) {
    return true;
  }
  if (role1 === 'member' && !['owner', 'editor', 'member'].includes(role2)) {
    return true;
  }
  return false;
}

// function getMergedUserRights(previousUserDoc: UserDocument, currentUserDoc: UserDocument) {
//   const previousUserRights = previousUserDoc.rights || {};
//   const currentUserRights = currentUserDoc.rights || {};

//   const mergedRights = { ...currentUserRights };

//   Object.keys(previousUserRights).forEach((key) => {
//     if (mergedRights[key]) {
//       const higherRole = getHigherRole(mergedRights[key], previousUserRights[key]);
//       if (higherRole === 'none') {
//         delete mergedRights[key];
//       } else {
//         mergedRights[key] = higherRole;
//       }
//     } else if (['owner', 'editor', 'member'].includes(previousUserRights[key])) {
//       mergedRights[key] = previousUserRights[key];
//     }
//   });

//   let hasChanges = false;
//   Object.keys(mergedRights).forEach((key) => {
//     if (mergedRights[key] !== currentUserRights[key]) {
//       hasChanges = true;
//     }
//   });

//   return hasChanges ? mergedRights : undefined;
// }

// function getHigherRole(role1: UserRole, role2: UserRole) {
//   if (role1 === 'owner' || role2 === 'owner') {
//     return 'owner';
//   }
//   if (role1 === 'editor' || role2 === 'editor') {
//     return 'editor';
//   }
//   if (role1 === 'member' || role2 === 'member') {
//     return 'member';
//   }
//   return 'none';
// }
