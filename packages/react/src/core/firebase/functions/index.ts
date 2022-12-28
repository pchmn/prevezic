import { CallableFunctionName, FunctionParams } from '@prevezic/core';
import { getFunctions, httpsCallable } from 'firebase/functions';

export function callFunction<P extends CallableFunctionName, R>(functionName: P, params: FunctionParams[P]) {
  return httpsCallable<FunctionParams[P], R>(getFunctions(undefined, 'europe-west1'), functionName)(params);
}
