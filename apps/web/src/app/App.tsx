import { withAuth } from '@app/core/auth';
import { AppLayout } from '@app/core/layout';
import accountRoutes from '@app/modules/account';
import albumsRoutes from '@app/modules/albums';
import homeRoutes from '@app/modules/home';
import signInRoutes from '@app/modules/signIn';
import { Button } from '@mantine/core';
import { ThemeEditor, useFirebaseUser } from '@prevezic/react';
import { useState } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';

export function App() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useFirebaseUser();

  // console.log('currentUser', currentUser, idToken);

  return (
    <AppLayout showNavbar={window.location.pathname !== '/signin/validate-link'}>
      <Outlet />
      <Button onClick={() => setOpen(true)}>Hello</Button>
      {currentUser && <>{currentUser.email}</>}
      <ThemeEditor opened={open} onClose={() => setOpen(false)} />
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
    ...signInRoutes,
    ...accountRoutes,
    { path: '*', element: <Navigate to="home" /> },
  ],
};

export default routes;
