import { RouteObject } from 'react-router-dom';

import { AlbumsModule } from './AlbumsModule';
import { AlbumList } from './components';

const albumsRoutes: RouteObject[] = [
  {
    path: 'albums',
    element: <AlbumsModule />,
    children: [{ path: '', element: <AlbumList /> }],
  },
];

export default albumsRoutes;
