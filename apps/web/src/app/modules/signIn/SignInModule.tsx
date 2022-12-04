import { Button } from '@mantine/core';
import { useFirebaseAuth } from '@prevezic/react';
import { Outlet } from 'react-router-dom';

export function SignInModule() {
  const { signOut } = useFirebaseAuth(false);

  return (
    <>
      <Outlet />
      <Button onClick={signOut}>Sign out</Button>
    </>
  );
}
