import { z } from 'zod';

import { Params } from './types';

export interface MergeUsersParams extends Params {
  previousTokenId: string;
}

export const margeUsersValidation = z.object({
  previousTokenId: z.string(),
});
