import { type QueryKey, useQuery } from '@tanstack/react-query';
import { authClient } from '~/lib/auth.client';

export const SESSION_QUERY_KEY: QueryKey = ['session'];

export function useSession() {
  const { data: session, ...rest } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => {
      const { data: session } = await authClient.getSession();
      return session;
    },
  });

  return {
    session,
    ...rest,
  };
}
