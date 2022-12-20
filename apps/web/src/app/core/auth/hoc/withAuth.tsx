import { AppShell, Flex, Loader } from '@mantine/core';
import { useFirebaseAuth, useFirebaseUser } from '@prevezic/react';
import { useEffect } from 'react';

export function withAuth(Component: React.ElementType) {
  return function Render() {
    const { currentUser } = useFirebaseUser();
    const { signInAnonymously, loading } = useFirebaseAuth();

    useEffect(() => {
      if (currentUser === null) {
        signInAnonymously();
      }
    }, [currentUser, signInAnonymously]);

    if (loading || !currentUser) {
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
