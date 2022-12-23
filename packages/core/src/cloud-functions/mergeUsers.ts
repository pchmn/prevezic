import { z } from 'zod';

import { Params } from './types';

export interface MergeUsersParams extends Params {
  priorTokenId: string;
}

export const margeUsersValidation = z.object({
  priorTokenId: z.string(),
});
