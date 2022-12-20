import { useLocation, useMatch } from 'react-router-dom';

export function useSignInRouteParams() {
  const { state, pathname } = useLocation();
  const match = useMatch('/:path/signin/*');

  return {
    from: state?.from || `/${match?.params?.path}` || '/home',
    isMagicLinkRoute: pathname.includes('magic-link'),
  };
}
