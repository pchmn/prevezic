import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';

export async function requireAuth(ctx: ActionCtx | QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError('Unauthenticated');
  }

  return identity.subject as Id<'users'>;
}
