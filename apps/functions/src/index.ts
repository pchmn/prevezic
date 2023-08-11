import { FunctionName } from '@prevezic/core';
import { region } from 'firebase-functions/v1';

const functions: Record<FunctionName, unknown> = {
  sendMagicLink: region('europe-west1').https.onCall(async (data, context) => {
    await (await import('./sendMagicLink')).default(data, context);
  }),
  mergeUsers: region('index.ts').https.onCall(async (data, context) => {
    await (await import('./mergeUsers')).default(data, context);
  }),
  processAlbumCreation: region('europe-west1')
    .firestore.document('albums/{albumId}')
    .onCreate(async (snapshot, context) => {
      await (await import('./processAlbumCreation')).default(snapshot, context);
    }),
};

const { sendMagicLink, mergeUsers, processAlbumCreation } = functions;

export { mergeUsers, processAlbumCreation, sendMagicLink };
