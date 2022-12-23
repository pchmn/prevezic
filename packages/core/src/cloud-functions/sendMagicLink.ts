import { z } from 'zod';

import { Params } from './types';

export interface SendMagicLinkParams extends Params {
  email: string;
  validationUrl: string;
  from?: string;
}

export const sendMagicLinkValidation = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  validationUrl: z.string().url({ message: 'Invalid URL' }),
  from: z.string().optional(),
});
