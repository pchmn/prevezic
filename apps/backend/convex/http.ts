import { httpRouter } from 'convex/server';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { httpAction } from './_generated/server';
import { betterAuthComponent, createAuth } from './auth';
import { requireUserIsProjectMember } from './projects/projects.utils';

const http = httpRouter();

betterAuthComponent.registerRoutes(http, createAuth, { cors: true });

const siteUrl = process.env.SITE_URL || 'http://localhost:3500';

http.route({
  path: '/add-photo',
  method: 'OPTIONS',
  handler: httpAction(async (_, request) => {
    console.log('OPTIONS', request.headers.get('Origin'));
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
          'Access-Control-Allow-Origin': siteUrl,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Digest, Authorization',
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(
      (formData.get('metadata') as string) ?? '{}',
    ) as {
      date?: number;
      location?: { lat: number; lng: number };
    };
    const storageId = await ctx.storage.store(file);

    await ctx.runMutation(internal.media.insert, {
      storageId,
      projectId,
      uploaderId: userId,
      contentType: file.type,
      fileSize: file.size,
      date: metadata.date ?? Date.now(),
      location: metadata.location,
    });

    // Step 3: Return a response with the correct CORS headers
    return new Response(null, {
      status: 200,
      // CORS headers
      headers: new Headers({
        'Access-Control-Allow-Origin': siteUrl,
        Vary: 'origin',
      }),
    });
  }),
});

export default http;
