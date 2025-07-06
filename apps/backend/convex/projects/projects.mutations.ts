import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAuth } from '../auth/auth.utils';

export const insert = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { name, description }) => {
    const userId = await requireAuth(ctx);

    const projectId = await ctx.db.insert('projects', {
      name,
      description,
      creatorId: userId,
      invitationToken: crypto.randomUUID(),
      isActive: true,
    });

    return projectId;
  },
});
