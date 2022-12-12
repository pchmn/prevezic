import { RouteObject } from 'react-router-dom';

import { SignInModal, ValidateEmailLink } from './components';
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

export { SignInModal };

export default signInRoutes;
