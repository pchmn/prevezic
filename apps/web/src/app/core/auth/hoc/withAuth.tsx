import { useIsAuthenticated } from '@app/core/auth';
import { AppShell, Flex, Loader } from '@mantine/core';
import { useFirebaseAuth, useFirebaseUser } from '@prevezic/react';
import { useEffect } from 'react';

export function withAuth(Component: React.ElementType) {
  return function Render() {
    const [isAuthenticated, setIsAuthenticated] = useIsAuthenticated();
    const { currentUser } = useFirebaseUser();
    const { signInAnonymously, loading } = useFirebaseAuth();

    useEffect(() => {
      if (currentUser !== undefined) {
        setIsAuthenticated(currentUser !== null);
      }
    }, [currentUser, setIsAuthenticated]);

    useEffect(() => {
      if (isAuthenticated === false) {
        signInAnonymously();
      }
    }, [isAuthenticated, signInAnonymously]);

    if (loading || !isAuthenticated) {
      return (
        <AppShell>
          <Flex justify="center" align="center" h="100%">
            <Loader size="xl" />
          </Flex>
        </AppShell>
      );
    }

    return <Component />;
  };
}
