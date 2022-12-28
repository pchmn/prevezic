import { Outlet } from 'react-router-dom';

import { Account } from './components';

export function AccountModule() {
  return (
    <>
      <Account />
      <Outlet />
    </>
  );
}
