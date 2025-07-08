import { v } from 'convex/values';
import { internalMutation, internalQuery, query } from './_generated/server';
import { requireUserIsProjectMember } from './projects/projects.utils';

export const list = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    await requireUserIsProjectMember(ctx, projectId);
    return await ctx.db
      .query('members')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();
  },
});

export const insert = internalMutation({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
    role: v.union(v.literal('creator'), v.literal('member')),
    joinedViaInvitation: v.boolean(),
  },
  handler: async (ctx, { projectId, userId, role, joinedViaInvitation }) => {
    await ctx.db.insert('members', {
      projectId,
      userId,
      role,
      joinedViaInvitation,
    });
  },
});

export const isMember = internalQuery({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
  },
  handler: async (ctx, { projectId, userId }) => {
    const member = await ctx.db
      .query('members')
      .withIndex('by_project_and_user', (q) =>
        q.eq('projectId', projectId).eq('userId', userId),
      )
      .first();

    return !!member;
  },
});
