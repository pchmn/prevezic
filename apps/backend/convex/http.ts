import { httpRouter } from 'convex/server';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { httpAction } from './_generated/server';
import { betterAuthComponent, createAuth } from './auth';
import { requireUserIsProjectMember } from './projects/projects.utils';

const http = httpRouter();

betterAuthComponent.registerRoutes(http, createAuth, { cors: true });

http.route({
  path: '/add-photo',
  method: 'OPTIONS',
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get('Origin') !== null &&
      headers.get('Access-Control-Request-Method') !== null &&
      headers.get('Access-Control-Request-Headers') !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          'Access-Control-Allow-Origin': `${process.env.SITE_URL}`,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Digest',
          'Access-Control-Max-Age': '86400',
        }),
      });
    }

    return new Response();
  }),
});

http.route({
  path: '/add-photo',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const projectId = new URL(request.url).searchParams.get(
      'projectId',
    ) as Id<'projects'>;
    const userId = await requireUserIsProjectMember(ctx, projectId);

    // Step 1: Store the file
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    await ctx.runMutation(internal.photo.insert, {
      storageId,
      projectId,
      uploaderId: userId,
      contentType: blob.type,
      fileSize: blob.size,
    });

    // Step 3: Return a response with the correct CORS headers
    return new Response(null, {
      status: 200,
      // CORS headers
      headers: new Headers({
        'Access-Control-Allow-Origin': `${process.env.SITE_URL}`,
        Vary: 'origin',
      }),
    });
  }),
});

export default http;
