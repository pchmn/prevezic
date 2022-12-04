import dashboardRoutes from '@app/modules/dashboard';
import prevezicRoutes from '@app/modules/prevezic';
import signInRoutes from '@app/modules/signIn';
import { AppShell, Header, Navbar } from '@mantine/core';
import { ThemeEditor, useFirebaseUser } from '@prevezic/react';
import { useState } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

const routes: RouteObject = {
  path: '/',
  element: <App />,
  children: [...dashboardRoutes, ...prevezicRoutes, ...signInRoutes],
};

function App() {
  const [open, setOpen] = useState(false);
  const { currentUser, idToken } = useFirebaseUser();

  console.log('currentUser', currentUser, idToken);

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="sx">
          {/* Navbar content */}
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          {/* Header content */}
        </Header>
      }
    >
      <Outlet />
      {/* <Button onClick={() => setOpen(true)}>Hello</Button> */}
      {currentUser && <>{currentUser.email}</>}
      <ThemeEditor opened={open} onClose={() => setOpen(false)} />
    </AppShell>
  );
}

export default routes;
