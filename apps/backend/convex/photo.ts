import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

// export const generateUploadUrl = mutation({
//   args: {
//     projectId: v.id('projects'),
//   },
//   handler: async (ctx, { projectId }) => {
//     await requireUserIsProjectMember(ctx, projectId);

//     return await ctx.storage.generateUploadUrl();
//   },
// });

// export const insert = mutation({
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
//     await requireUserIsProjectMember(ctx, projectId);

//     await ctx.db.insert('photos', {
//       projectId,
//       uploaderId,
//       ...insertValues,
//     });
//   },
// });

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
  },
  handler: async (ctx, { projectId, uploaderId, ...insertValues }) => {
    await ctx.db.insert('photos', {
      projectId,
      uploaderId,
      ...insertValues,
    });
  },
});
