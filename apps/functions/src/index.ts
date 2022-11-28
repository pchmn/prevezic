import { user } from 'firebase-functions/v1/auth';
import { onRequest } from 'firebase-functions/v1/https';

export const signInWithEmailLink = onRequest(async (req, res) => {
  await (await import('./signInWithEmailLink')).default(req, res);
});

export const processSignUp = user().onCreate(async (user) => {
  await (await import('./processSignUp')).default(user);
});
