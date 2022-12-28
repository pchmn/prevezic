import { RouteObject } from 'react-router-dom';

import { AlbumList } from './components';

export const albumListRoutes: RouteObject[] = [{ path: '', element: <AlbumList /> }];
