import { SendMagicLinkParams, sendMagicLinkValidation } from './sendMagicLink';

export type FunctionParams = {
  sendMagicLink: SendMagicLinkParams;
};

export const FunctionValidation = {
  sendMagicLink: sendMagicLinkValidation,
};

export type CallableFunctionName = keyof FunctionParams;
export type FunctionName = CallableFunctionName | 'processSignUp';
