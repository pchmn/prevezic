import { PrivateRoute } from '@app/core/auth';
import { RouteObject } from 'react-router-dom';

import { DashboardModule } from './DashboardModule';

const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: (
      <PrivateRoute>
        <DashboardModule />
      </PrivateRoute>
    ),
  },
];

export default dashboardRoutes;
