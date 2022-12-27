import { GoogleIcon, MagicIcon } from '@app/shared/components';
import { Button, Flex } from '@mantine/core';
import { useFirebaseAuth, useNotification, useSignInWithGoogle } from '@prevezic/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSignInContext } from './SignInContext';
import { useSignInRouteParams } from './useSignInRouteParams';

export function ChooseSignInMethod() {
  const { setLoading: setLoadingContext } = useSignInContext();
  const { t } = useTranslation();

  const { mutate: signInWithGoogle, isLoading } = useSignInWithGoogle();
  const { signInWithGoogle: signInWithGoogle2 } = useFirebaseAuth();
  console.log('isLoading', { isLoading });

  const { from } = useSignInRouteParams();
  const navigate = useNavigate();

  const { showError } = useNotification();

  useEffect(() => {
    setLoadingContext(isLoading);
  }, [isLoading, setLoadingContext]);

  const googleSignIn = async () => {
    try {
      signInWithGoogle({
        onSuccess: () => navigate(from),
        onError: () =>
          showError({ title: t('signIn.googleSignInError.title'), message: t('signIn.googleSignInError.description') }),
      });
      await signInWithGoogle2();
    } catch (err) {
      console.log('err', err);
    }
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
