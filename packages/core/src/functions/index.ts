// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Params {}

interface SendMagicLinkParams extends Params {
  email: string;
  validatingUrl: string;
  from?: string;
}

export type FunctionParams = {
  sendMagicLink: SendMagicLinkParams;
};

export type CallableFunctionName = keyof FunctionParams;
export type FunctionName = CallableFunctionName | 'processSignUp';
