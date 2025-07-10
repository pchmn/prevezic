import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { mutation } from '../_generated/server';
import { requireAuth } from '../auth/auth.utils';
import { PrevezicError } from '../error/error.utils';
import { requireUserIsProjectCreator } from './projects.utils';

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

    await ctx.runMutation(internal.member.insert, {
      projectId,
      userId,
      role: 'creator',
      joinedViaInvitation: false,
    });

    return projectId;
  },
});

export const update = mutation({
  args: {
    projectId: v.id('projects'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, name, description }) => {
    await requireUserIsProjectCreator(ctx, projectId);

    await ctx.db.patch(projectId, {
      name,
      description,
    });
  },
});

export const join = mutation({
  args: {
    invitationToken: v.string(),
  },
  handler: async (ctx, { invitationToken }) => {
    const userId = await requireAuth(ctx);

    const project = await ctx.db
      .query('projects')
      .withIndex('by_invitation_token', (q) =>
        q.eq('invitationToken', invitationToken),
      )
      .first();

    if (!project) {
      throw new PrevezicError({
        code: 'not_found',
        message: 'Projet non trouvé',
      });
    }

    if (project.creatorId === userId) {
      throw new PrevezicError({
        code: 'already_project_member',
        message: 'Vous êtes déjà membre de ce projet',
        metadata: {
          projectId: project._id,
        },
      });
    }

    const isMember = await ctx.runQuery(internal.member.isMember, {
      projectId: project._id,
      userId,
    });

    if (isMember) {
      throw new PrevezicError({
        code: 'already_project_member',
        message: 'Vous êtes déjà membre de ce projet',
      });
    }

    await ctx.runMutation(internal.member.insert, {
      projectId: project._id,
      userId,
      role: 'member',
      joinedViaInvitation: true,
    });

    return {
      projectId: project._id,
    };
  },
});
