import { getFunctions, httpsCallable } from 'firebase/functions';
import { useMemo } from 'react';

export function useCallFunction<P, R>(functionName: string) {
  return useMemo(() => httpsCallable<P, R>(getFunctions(), functionName), [functionName]);
}
