import { query } from '../_generated/server';
import { requireAuth } from '../auth/auth.utils';

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
