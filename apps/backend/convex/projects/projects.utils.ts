import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';
import { requireAuth } from '../auth/auth.utils';
import { PrevezicError } from '../error/error.utils';

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
    throw new PrevezicError({
      code: 'not_project_member',
      message: "Vous n'êtes pas membre de ce projet",
    });
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
    throw new PrevezicError({
      code: 'not_found',
      message: 'Projet non trouvé',
    });
  }

  if (project.creatorId !== userId) {
    throw new PrevezicError({
      code: 'not_project_creator',
      message: "Vous n'êtes pas le créateur de ce projet",
    });
  }

  return project;
}
