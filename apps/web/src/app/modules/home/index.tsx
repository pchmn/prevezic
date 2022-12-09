import { RouteObject } from 'react-router-dom';

import { HomeModule } from './HomeModule';

const homeRoutes: RouteObject[] = [
  {
    path: 'home',
    element: <HomeModule />,
  },
];

export default homeRoutes;
