import { Navigate, Outlet, RouteObject, useLocation } from 'react-router-dom';

import { withAuth } from '@/core/auth';
import { AppLayout } from '@/core/layout';
import accountRoutes from '@/modules/Account';
import albumsRoutes from '@/modules/Albums';
import homeRoutes from '@/modules/Home';
import { validateLinkRoutes } from '@/modules/SignIn';

export function App() {
  const location = useLocation();

  return (
    <AppLayout showNavbar={location.pathname !== '/validate-email-link'}>
      <Outlet />
    </AppLayout>
  );
}

const AppWithAuth = withAuth(App);

const routes: RouteObject = {
  path: '/',
  element: <AppWithAuth />,
  children: [
    ...albumsRoutes,
    ...homeRoutes,
    ...validateLinkRoutes,
    ...accountRoutes,
    { path: '*', element: <Navigate to="home" /> },
  ],
};

export default routes;
