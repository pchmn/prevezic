import { AppShell, Flex, Loader } from '@mantine/core';
import { useFirebaseAuthUser } from '@prevezic/react';
import { useSignInAnonymously } from '@prevezic/react';
import { useEffect } from 'react';

export function withAuth(Component: React.ElementType) {
  return function Render() {
    const { data: currentUser } = useFirebaseAuthUser();
    const { mutate, isLoading } = useSignInAnonymously();

    useEffect(() => {
      if (currentUser === null && !isLoading) {
        mutate();
      }
    }, [currentUser, isLoading, mutate]);

    if (isLoading || !currentUser) {
      return (
        <AppShell>
          <Flex justify="center" align="center" h="100%">
            <Loader size="xl" variant="dots" />
          </Flex>
        </AppShell>
      );
    }

    return <Component />;
  };
}
