import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { ConvexReactClient } from 'convex/react';
import { SESSION_QUERY_KEY } from '~/hooks/useSession';
import type { authClient } from '~/lib/auth.client';

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
  },
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
