import { GoogleIcon, MagicIcon } from '@app/shared/components';
import { Button, Flex } from '@mantine/core';
import { useFirebaseAuth, useNotification } from '@prevezic/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSignInContext } from './SignInContext';
import { useSignInRouteParams } from './useSignInRouteParams';

export function ChooseSignInMethod() {
  const { setLoading } = useSignInContext();
  const { t } = useTranslation();

  const { signInWithGoogle, loading } = useFirebaseAuth();

  const { from } = useSignInRouteParams();
  const navigate = useNavigate();

  const { showError } = useNotification();

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  const googleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from);
    } catch (error) {
      showError({ title: t('signIn.googleSignInError.title'), message: t('signIn.googleSignInError.description') });
    }
  };

  return (
    <Flex direction="column" gap="md" justify="center" h="100%">
      <Button leftIcon={<GoogleIcon />} onClick={googleSignIn} loading={loading}>
        {t('signIn.signInWithGoogle')}
      </Button>
      <Button leftIcon={<MagicIcon />} onClick={() => navigate('magic-link', { state: { from } })} disabled={loading}>
        {t('signIn.signInWithMagicLink')}
      </Button>
    </Flex>
  );
}
