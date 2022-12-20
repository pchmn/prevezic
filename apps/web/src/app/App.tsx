import { withAuth } from '@app/core/auth';
import { AppLayout } from '@app/core/layout';
import accountRoutes from '@app/modules/account';
import albumsRoutes from '@app/modules/albums';
import homeRoutes from '@app/modules/home';
import { validateLinkRoutes } from '@app/modules/signIn';
import { Navigate, Outlet, RouteObject, useLocation } from 'react-router-dom';

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
