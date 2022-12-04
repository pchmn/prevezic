import { useStorage } from '@prevezic/react';

export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useStorage('isAuthenticated', { defaultValue: false });

  return [isAuthenticated || false, setIsAuthenticated];
}
