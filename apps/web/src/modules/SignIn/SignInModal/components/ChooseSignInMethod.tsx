import { Button, Flex } from '@mantine/core';
import { useNotification, useSignInWithGoogle } from '@prevezic/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon, MagicIcon } from 'src/shared/components';

import { useSignInRouteParams } from '../useSignInRouteParams';
import { useSignInContext } from './SignInContext';

export function ChooseSignInMethod() {
  const { setLoading: setLoadingContext } = useSignInContext();
  const { t } = useTranslation();

  const { mutate: signInWithGoogle, isLoading } = useSignInWithGoogle();

  const { from } = useSignInRouteParams();
  const navigate = useNavigate();

  const { showError } = useNotification();

  useEffect(() => {
    setLoadingContext(isLoading);
  }, [isLoading, setLoadingContext]);

  const googleSignIn = () => {
    signInWithGoogle(undefined, {
      onSuccess: () => navigate(from),
      onError: () =>
        showError({ title: t('signIn.googleSignInError.title'), message: t('signIn.googleSignInError.description') }),
    });
  };

  return (
    <Flex direction="column" gap="md" justify="center" h="100%">
      <Button leftIcon={<GoogleIcon />} onClick={googleSignIn} loading={isLoading}>
        {t('signIn.signInWithGoogle')}
      </Button>
      <Button leftIcon={<MagicIcon />} onClick={() => navigate('magic-link', { state: { from } })} disabled={isLoading}>
        {t('signIn.signInWithMagicLink')}
      </Button>
    </Flex>
  );
}
