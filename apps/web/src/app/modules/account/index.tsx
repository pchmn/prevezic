import { RouteObject } from 'react-router-dom';

import { signInRoutes } from '../signIn';
import { AccountModule } from './AccountModule';

const accountRoutes: RouteObject[] = [
  {
    path: 'account',
    element: <AccountModule />,
    children: [...signInRoutes],
  },
];

export default accountRoutes;
