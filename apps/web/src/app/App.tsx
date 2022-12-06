import dashboardRoutes from '@app/modules/dashboard';
import prevezicRoutes from '@app/modules/prevezic';
import signInRoutes from '@app/modules/signIn';
import { ThemeEditor, useFirebaseUser } from '@prevezic/react';
import { useState } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

const routes: RouteObject = {
  path: '/',
  element: <App />,
  children: [...dashboardRoutes, ...prevezicRoutes, ...signInRoutes],
};

export function App() {
  const [open, setOpen] = useState(false);
  const { currentUser, idToken } = useFirebaseUser();

  console.log('currentUser', currentUser, idToken);

  return (
    <>
      <Outlet />
      {/* <Button onClick={() => setOpen(true)}>Hello</Button> */}
      {currentUser && <>{currentUser.email}</>}
      <ThemeEditor opened={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default routes;
