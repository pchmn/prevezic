import { onRequest } from 'firebase-functions/v1/https';

export const signInWithEmailLink = onRequest(async (req, res) => {
  await (await import('./signInWithEmailLink/index')).default(req, res);
});
