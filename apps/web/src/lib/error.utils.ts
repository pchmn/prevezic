import type { PrevezicError } from '@prevezic/backend/error/error.utils';

export function isPrevezicError(error: unknown): error is PrevezicError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'data' in error &&
    error.data !== null &&
    typeof error.data === 'object' &&
    'code' in error.data
  );
}
