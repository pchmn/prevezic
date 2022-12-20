import { RouteObject } from 'react-router-dom';

import { ChooseSignInMethod, MagicLinkSignIn, SignInModal, ValidateEmailLink } from './components';

const signInRoutes: RouteObject[] = [
  {
    path: 'signin',
    element: <SignInModal />,
    children: [
      {
        path: '',
        element: <ChooseSignInMethod />,
      },
      {
        path: 'magic-link',
        element: <MagicLinkSignIn />,
      },
    ],
  },
];

const validateLinkRoutes: RouteObject[] = [
  {
    path: 'validate-email-link',
    element: <ValidateEmailLink />,
  },
];

export { SignInModal, signInRoutes, validateLinkRoutes };
