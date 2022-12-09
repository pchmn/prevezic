import { RouteObject } from 'react-router-dom';

import { SignIn, ValidateEmailLink } from './components';
import { SignInModule } from './SignInModule';

const signInRoutes: RouteObject[] = [
  {
    path: 'signin',
    element: <SignInModule />,
    children: [
      {
        path: 'validate-link',
        element: <ValidateEmailLink />,
      },
    ],
  },
];

export { SignIn };

export default signInRoutes;
