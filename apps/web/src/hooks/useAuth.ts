import isNetworkError from 'is-network-error';
import { useCallback } from 'react';
import { authClient } from '~/lib/auth.client';

const verbose = false;

export function useAuth() {
  const { data: session, isPending: isLoading } = authClient.useSession();

  const logVerbose = useCallback((message: string) => {
    if (verbose) {
      console.debug(`${new Date().toISOString()} ${message}`);
    }
  }, []);

  const fetchToken = useCallback(async () => {
    const initialBackoff = 100;
    const maxBackoff = 1000;
    let retries = 0;

    const nextBackoff = () => {
      const baseBackoff = initialBackoff * 2 ** retries;
      retries += 1;
      const actualBackoff = Math.min(baseBackoff, maxBackoff);
      const jitter = actualBackoff * (Math.random() - 0.5);
      return actualBackoff + jitter;
    };

    const fetchWithRetry = async () => {
      try {
        const { data } = await authClient.convex.token();
        return data?.token || null;
      } catch (e) {
        if (!isNetworkError(e)) {
          throw e;
        }
        if (retries > 10) {
          logVerbose('fetchToken failed with network error, giving up');
          throw e;
        }
        const backoff = nextBackoff();
        logVerbose(
          `fetchToken failed with network error, attempting retrying in ${backoff}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoff));
        return fetchWithRetry();
      }
    };

    return fetchWithRetry();
  }, [logVerbose]);

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (forceRefreshToken) {
        const token = await fetchToken();
        logVerbose('returning retrieved token');
        return token;
      }
      return null;
    },
    [fetchToken, logVerbose],
  );

  return {
    isLoading,
    isAuthenticated: !!session,
    fetchAccessToken,
  };
}
