import { FunctionName } from '@prevezic/core';
import { document } from 'firebase-functions/v1/firestore';
import { onCall } from 'firebase-functions/v1/https';

const functions: Record<FunctionName, unknown> = {
  sendMagicLink: onCall(async (data, context) => {
    await (await import('./sendMagicLink')).default(data, context);
  }),
  mergeUsers: onCall(async (data, context) => {
    await (await import('./mergeUsers')).default(data, context);
  }),
  processAlbumCreation: document('albums/{albumId}').onCreate(async (snapshot, context) => {
    await (await import('./processAlbumCreation')).default(snapshot, context);
  }),
};

const { sendMagicLink, mergeUsers, processAlbumCreation } = functions;

export { mergeUsers, processAlbumCreation, sendMagicLink };
