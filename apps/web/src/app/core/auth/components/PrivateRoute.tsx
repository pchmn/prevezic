import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useIsAuthenticated } from '../hooks/useIsAuthenticated';

export function PrivateRoute({ children }: PropsWithChildren) {
  const [isAuthenticated] = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
}
