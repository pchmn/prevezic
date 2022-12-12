import { SignInModal } from '@app/modules/signIn';
import { Button, Flex } from '@mantine/core';
import { useFirebaseUser } from '@prevezic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Profile() {
  const { currentUser } = useFirebaseUser();

  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  if (currentUser?.isAnonymous) {
    return (
      <>
        <Button variant="filled" onClick={() => setOpen(true)}>
          {t('account.signIn')}
        </Button>
        <SignInModal opened={open} onClose={() => setOpen(false)} />
      </>
    );
  }
  return <Flex>Profile</Flex>;
}
