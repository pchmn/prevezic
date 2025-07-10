import type { Id } from '../_generated/dataModel';
import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';
import { PrevezicError } from '../error/error.utils';

export async function requireAuth(ctx: ActionCtx | QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new PrevezicError({
      code: 'not_authenticated',
      message: "Vous n'êtes pas connecté",
    });
  }

  return identity.subject as Id<'users'>;
}
