import { GoogleIcon, MagicIcon } from '@app/shared/components';
import { Button, Flex } from '@mantine/core';
import { useFirebaseAuth } from '@prevezic/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export function ChooseSignInMethod() {
  const { t } = useTranslation();

  const { signInWithGoogle } = useFirebaseAuth();

  const {
    state: { from },
  } = useLocation();
  const navigate = useNavigate();

  const googleSignIn = async () => {
    await signInWithGoogle();
    navigate(from);
  };

  return (
    <Flex direction="column" gap="md" justify="center" h="100%">
      <Button leftIcon={<GoogleIcon />} onClick={googleSignIn}>
        {t('signIn.signInWithGoogle')}
      </Button>
      <Button leftIcon={<MagicIcon />} onClick={() => navigate('magic-link')}>
        {t('signIn.signInWithMagicLink')}
      </Button>
    </Flex>
  );
}
