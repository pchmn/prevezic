import { Button, Flex, Text } from '@mantine/core';
import { useFirebaseUser, useSignOut } from '@prevezic/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export function Profile() {
  const { t } = useTranslation();

  const { currentUser } = useFirebaseUser();

  const { mutate: signOut, isLoading } = useSignOut();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!currentUser || currentUser.isAnonymous) {
    return (
      <>
        <Button variant="filled" onClick={() => navigate('signin', { state: { from: pathname } })}>
          {t('account.signIn')}
        </Button>
      </>
    );
  }
  return (
    <Flex direction="column" align="center" gap="sm">
      <Text weight={300} size="xs">
        {t('account.signedInAs')}
      </Text>
      <Text>{currentUser?.email}</Text>
      <Button size="xs" variant="outline" sx={{ marginTop: 10 }} onClick={() => signOut()} loading={isLoading}>
        {t('account.signOut')}
      </Button>
    </Flex>
  );
}
