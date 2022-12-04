import { RouteObject } from 'react-router-dom';

import { PrevezicModule } from './PrevezicModule';

const prevezicRoutes: RouteObject[] = [
  {
    path: 'app',
    element: <PrevezicModule />,
  },
];

export default prevezicRoutes;
