import { Flex } from '@prevezic/ui/flex';
import { Spinner } from '@prevezic/ui/spinner';
import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import type { ConvexReactClient } from 'convex/react';
import { SESSION_QUERY_KEY } from '~/hooks/useSession';
import type { authClient } from '~/lib/auth.client';

export const Route = createRootRouteWithContext<{
  authClient: typeof authClient;
  queryClient: QueryClient;
  convex: ConvexReactClient;
}>()({
  beforeLoad: async ({ context: { authClient, queryClient } }) => {
    let error: Record<string, unknown> | null = null;

    const { data: session, error: sessionError } =
      await authClient.getSession();

    if (!session) {
      const { data, error: signInError } = await authClient.signIn.anonymous();
      error = sessionError || signInError;
      queryClient.setQueryData(SESSION_QUERY_KEY, data);
    } else {
      queryClient.setQueryData(SESSION_QUERY_KEY, session);
    }

    if (error) {
      throw error;
    }
  },
  pendingComponent: () => (
    <Flex align='center' justify='center' className='h-screen'>
      <Spinner className='w-8 h-8' />
    </Flex>
  ),
  errorComponent: () => (
    <Flex align='center' justify='center' className='h-screen p-4 text-center'>
      <div className='text-red-300'>
        Impossible de se connecter, veuillez recharger la page
      </div>
    </Flex>
  ),
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
