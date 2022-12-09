import { PrivateRoute } from '@app/core/auth';
import { RouteObject } from 'react-router-dom';

import { AccountModule } from './AccountModule';

const accountRoutes: RouteObject[] = [
  {
    path: 'account',
    element: (
      <PrivateRoute>
        <AccountModule />
      </PrivateRoute>
    ),
  },
];

export default accountRoutes;
