import { CallableFunctionName, FunctionParams } from '@prevezic/core';
import { useMutation } from '@tanstack/react-query';

import { callFunction } from '../functions';

export function useFunctionsCall<N extends CallableFunctionName, R>(functionName: N) {
  return useMutation({ mutationFn: (params: FunctionParams[N]) => callFunction<N, R>(functionName, params) });
}
