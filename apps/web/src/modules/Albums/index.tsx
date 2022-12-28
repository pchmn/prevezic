import { RouteObject } from 'react-router-dom';

import { albumListRoutes } from './AlbumList';
import { AlbumsModule } from './AlbumsModule';

const albumsRoutes: RouteObject[] = [
  {
    path: 'albums',
    element: <AlbumsModule />,
    children: [...albumListRoutes],
  },
];

export default albumsRoutes;
