import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAuth } from '../auth/auth.utils';
import { requireUserIsProjectMember } from './projects.utils';

export const list = query({
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    const projects = [];

    const memberships = await ctx.db
      .query('members')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const projectIds = memberships.map((m) => m.projectId);

    for (const projectId of projectIds) {
      const project = await ctx.db.get(projectId);
      if (project) {
        projects.push(project);
      } else {
        console.error(`Project ${projectId} not found`);
      }
    }

    return projects;
  },
});

export const get = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    await requireUserIsProjectMember(ctx, projectId);

    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    const photos = await ctx.db
      .query('photos')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    const photosWithUrl = await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      })),
    );

    const members = await ctx.db
      .query('members')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    return {
      ...project,
      photos: photosWithUrl,
      members,
    };
  },
});
