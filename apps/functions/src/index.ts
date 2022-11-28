import { user } from 'firebase-functions/v1/auth';
import { onCall } from 'firebase-functions/v1/https';

export const sendSignInWithEmailLink = onCall(async (data, context) => {
  await (await import('./sendSignInWithEmailLink')).default(data, context);
});

export const processSignUp = user().onCreate(async (user) => {
  await (await import('./processSignUp')).default(user);
});
