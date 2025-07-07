import { v } from 'convex/values';
import { internalQuery, mutation } from './_generated/server';
import { requireUserIsProjectMember } from './projects/projects.utils';

export const list = internalQuery({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const photos = await ctx.db
      .query('photos')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    return Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      })),
    );
  },
});

export const generateUploadUrl = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    await requireUserIsProjectMember(ctx, projectId);

    return await ctx.storage.generateUploadUrl();
  },
});

export const insert = mutation({
  args: {
    projectId: v.id('projects'),
    uploaderId: v.id('users'),
    storageId: v.id('_storage'),
    contentType: v.string(),
    fileSize: v.number(),
    caption: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
  },
  handler: async (ctx, { projectId, uploaderId, ...insertValues }) => {
    await requireUserIsProjectMember(ctx, projectId);

    await ctx.db.insert('photos', {
      projectId,
      uploaderId,
      ...insertValues,
    });
  },
});

// export const insert = internalMutation({
//   args: {
//     projectId: v.id('projects'),
//     uploaderId: v.id('users'),
//     storageId: v.id('_storage'),
//     contentType: v.string(),
//     fileSize: v.number(),
//     caption: v.optional(v.string()),
//     width: v.optional(v.number()),
//     height: v.optional(v.number()),
//   },
//   handler: async (ctx, { projectId, uploaderId, ...insertValues }) => {
//     await ctx.db.insert('photos', {
//       projectId,
//       uploaderId,
//       ...insertValues,
//     });
//   },
// });
