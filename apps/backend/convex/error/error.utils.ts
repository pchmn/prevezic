import { ConvexError, type Value } from 'convex/values';

export const PREVEZIC_ERROR_CODES = {
  not_project_member: 'not_project_member',
  not_project_creator: 'not_project_creator',
  already_project_member: 'already_project_member',
  not_authenticated: 'not_authenticated',
  not_authorized: 'not_authorized',
  not_found: 'not_found',
} as const;

export type PrevezicErrorCode =
  (typeof PREVEZIC_ERROR_CODES)[keyof typeof PREVEZIC_ERROR_CODES];

export class PrevezicError extends ConvexError<{
  code: PrevezicErrorCode;
  message: string;
  metadata?: Record<string, Value>;
}> {}

export function isPrevezicError(error: unknown): error is PrevezicError {
  return error instanceof PrevezicError;
}
