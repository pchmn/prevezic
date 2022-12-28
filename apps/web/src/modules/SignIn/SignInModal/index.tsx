import { RouteObject } from 'react-router-dom';

import { ChooseSignInMethod, MagicLinkSignIn, SignInModal } from './components';

export const signInRoutes: RouteObject[] = [
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
