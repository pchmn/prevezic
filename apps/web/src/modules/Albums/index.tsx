import { RouteObject } from 'react-router-dom';

import { AlbumList } from './AlbumList';
import { AlbumsModule } from './AlbumsModule';

const albumsRoutes: RouteObject[] = [
  {
    path: 'albums',
    element: <AlbumsModule />,
    children: [{ path: '', element: <AlbumList /> }],
  },
];

export default albumsRoutes;
