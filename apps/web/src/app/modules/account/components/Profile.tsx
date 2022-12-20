import { Button, Flex } from '@mantine/core';
import { useFirebaseUser } from '@prevezic/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export function Profile() {
  const { t } = useTranslation();

  const { currentUser } = useFirebaseUser();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (currentUser?.isAnonymous) {
    return (
      <>
        <Button variant="filled" onClick={() => navigate('signin', { state: { from: pathname } })}>
          {t('account.signIn')}
        </Button>
      </>
    );
  }
  return <Flex>Profile</Flex>;
}
