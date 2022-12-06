import { Outlet } from 'react-router-dom';

import { SignInLayout } from './layout';

export function SignInModule() {
  return (
    <SignInLayout>
      <Outlet />
      {/* <Button onClick={signOut}>Sign out</Button> */}
    </SignInLayout>
  );
}
