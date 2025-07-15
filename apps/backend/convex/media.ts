import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';
import { requireAuth } from './auth/auth.utils';
import { PrevezicError } from './error/error.utils';
import { requireUserIsProjectMember } from './projects/projects.utils';

export const list = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    await requireUserIsProjectMember(ctx, projectId);

    const medias = await ctx.db
      .query('medias')
      .withIndex('by_project_and_date', (q) => q.eq('projectId', projectId))
      .order('desc')
      .collect();

    return Promise.all(
      medias.map(async (media) => ({
        ...media,
        url: (await ctx.storage.getUrl(media.storageId)) ?? '',
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

export const insert = internalMutation({
  args: {
    projectId: v.id('projects'),
    uploaderId: v.id('users'),
    storageId: v.id('_storage'),
    contentType: v.string(),
    fileSize: v.number(),
    caption: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    date: v.optional(v.number()),
    location: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ),
  },
  handler: async (ctx, { projectId, uploaderId, ...insertValues }) => {
    // await requireUserIsProjectMember(ctx, projectId);

    await ctx.db.insert('medias', {
      projectId,
      uploaderId,
      ...insertValues,
    });
  },
});

export const remove = mutation({
  args: {
    mediaId: v.id('medias'),
  },
  handler: async (ctx, { mediaId }) => {
    const userId = await requireAuth(ctx);

    const media = await ctx.db.get(mediaId);

    if (!media) {
      throw new PrevezicError({
        code: 'not_found',
        message: 'Photo introuvable',
      });
    }

    const project = await ctx.db.get(media.projectId);

    if (media.uploaderId !== userId && project?.creatorId !== userId) {
      throw new PrevezicError({
        code: 'unauthorized',
        message: 'Action non autorisée',
      });
    }

    await ctx.db.delete(mediaId);
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
