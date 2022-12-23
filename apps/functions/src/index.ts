import { FunctionName } from '@prevezic/core';
import { user } from 'firebase-functions/v1/auth';
import { onCall } from 'firebase-functions/v1/https';

const functions: Record<FunctionName, unknown> = {
  sendMagicLink: onCall(async (data, context) => {
    await (await import('./sendMagicLink')).default(data, context);
  }),
  processSignUp: user().onCreate(async (user) => {
    await (await import('./processSignUp')).default(user);
  }),
  mergeUsers: onCall(async (data, context) => {
    await (await import('./mergeUsers')).default(data, context);
  }),
};

const { sendMagicLink, processSignUp, mergeUsers } = functions;

export { mergeUsers, processSignUp, sendMagicLink };
