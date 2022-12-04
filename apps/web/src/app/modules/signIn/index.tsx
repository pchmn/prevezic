import { RouteObject } from 'react-router-dom';

import { SignIn } from './components/SignIn';
import { ValidateEmailLink } from './components/ValidateEmailLink';
import { SignInModule } from './SignInModule';

const signInRoutes: RouteObject[] = [
  {
    path: 'signin',
    element: <SignInModule />,
    children: [
      {
        path: '',
        element: <SignIn />,
      },
      {
        path: 'validate-link',
        element: <ValidateEmailLink />,
      },
    ],
  },
];

export default signInRoutes;
