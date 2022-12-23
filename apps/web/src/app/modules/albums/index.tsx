import { PrivateRoute } from '@app/core/auth';
import { RouteObject } from 'react-router-dom';

import { AlbumsModule } from './AlbumsModule';

const albumsRoutes: RouteObject[] = [
  {
    path: 'albums',
    element: (
      <PrivateRoute>
        <AlbumsModule />
      </PrivateRoute>
    ),
  },
];

export default albumsRoutes;
