import { useStorage } from '@prevezic/react';

export function useIsAuthenticated() {
  return useStorage('isAuthenticated', { defaultValue: false });
}
