import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import type { ConvexReactClient } from 'convex/react';
import { SESSION_QUERY_KEY } from '~/hooks/useSession';
import type { authClient } from '~/lib/auth.client';
import { getToken, isPwa } from '~/lib/cache-storage/cache-storage';

let token: string | null = null;
getToken().then((t) => {
  token = t;
});
if (isPwa()) {
  console.log('PWA is installed', token);
} else {
  console.log('PWA is not installed', token);
}

export const Route = createRootRouteWithContext<{
  authClient: typeof authClient;
  queryClient: QueryClient;
  convex: ConvexReactClient;
}>()({
  beforeLoad: async ({ context: { authClient, queryClient } }) => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      const { data } = await authClient.signIn.anonymous();
      queryClient.setQueryData(SESSION_QUERY_KEY, data);
    } else {
      queryClient.setQueryData(SESSION_QUERY_KEY, session);
    }

    return { token };
  },
  component: () => (
    <>
      <div>Token: {token}</div>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
