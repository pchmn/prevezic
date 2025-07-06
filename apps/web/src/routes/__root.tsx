import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { authClient } from '~/lib/auth.client';

export const Route = createRootRouteWithContext<{
  authClient: typeof authClient;
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
