import { margeUsersValidation, MergeUsersParams } from './mergeUsers';
import { SendMagicLinkParams, sendMagicLinkValidation } from './sendMagicLink';

export type FunctionParams = {
  sendMagicLink: SendMagicLinkParams;
  mergeUsers: MergeUsersParams;
};

export const FunctionValidation = {
  sendMagicLink: sendMagicLinkValidation,
  mergeUsers: margeUsersValidation,
};

export type CallableFunctionName = keyof FunctionParams;
export type FunctionName = CallableFunctionName | 'processSignUp';
