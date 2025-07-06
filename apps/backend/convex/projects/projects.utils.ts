import { ConvexError } from 'convex/values';
import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';
import { requireAuth } from '../auth/auth.utils';

export async function requireUserIsProjectMember(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  projectId: Id<'projects'>,
) {
  const userId = await requireAuth(ctx);

  const isMember = await ctx.runQuery(internal.member.isMember, {
    projectId,
    userId,
  });

  if (!isMember) {
    throw new ConvexError('You are not a member of this project');
  }

  return userId;
}

export async function requireUserIsProjectCreator(
  ctx: QueryCtx | MutationCtx,
  projectId: Id<'projects'>,
) {
  const userId = await requireAuth(ctx);

  const project = await ctx.db.get(projectId);
  if (!project) {
    throw new ConvexError('Project not found');
  }

  if (project.creatorId !== userId) {
    throw new ConvexError('You are not the creator of this project');
  }

  return project;
}
