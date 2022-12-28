import { RouteObject } from 'react-router-dom';

import { ValidateEmailLink } from './components';

export const validateLinkRoutes: RouteObject[] = [
  {
    path: 'validate-email-link',
    element: <ValidateEmailLink />,
  },
];
