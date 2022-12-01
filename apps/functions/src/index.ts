import { user } from 'firebase-functions/v1/auth';
import { onCall } from 'firebase-functions/v1/https';

export const sendMagicLink = onCall(async (data, context) => {
  await (await import('./sendMagicLink')).default(data, context);
});

export const processSignUp = user().onCreate(async (user) => {
  await (await import('./processSignUp')).default(user);
});
