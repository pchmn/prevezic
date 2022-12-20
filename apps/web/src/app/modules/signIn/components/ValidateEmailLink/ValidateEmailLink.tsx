import { InvalidLinkIcon, UserCheckIcon } from '@app/shared/components';
import { Button, Flex, Loader, Text } from '@mantine/core';
import { useLocalStorage, useTimeout } from '@mantine/hooks';
import { useFirebaseAuth } from '@prevezic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ConfirmEmailForm } from './ConfirmEmailForm';

export function ValidateEmailLink() {
  const [email, setEmail, remove] = useLocalStorage({ key: 'emailForSignInn' });
  const { signInWithMagicLink } = useFirebaseAuth();
  const [validatedLink, setValidatedLink] = useState<boolean | undefined>();

  const { t } = useTranslation();

  useEffect(() => {
    if (email) {
      signInWithMagicLink(email)
        .then(() => {
          remove();
          setValidatedLink(true);
        })
        .catch(() => {
          setValidatedLink(false);
        });
    }
  }, [email, remove, signInWithMagicLink]);

  return (
    <Flex direction="column" justify="center" align="center" h="100%" gap="md" p="md">
      {email ? (
        <>
          {validatedLink === undefined ? (
            <>
              <Loader size="xl" />
              <Text>{t('signIn.validatingLink')}</Text>
            </>
          ) : validatedLink ? (
            <ValidLink />
          ) : (
            <InvalidLink />
          )}
        </>
      ) : (
        <ConfirmEmailForm onSubmit={(values) => setEmail(values.email)} />
      )}
    </Flex>
  );
}

function ValidLink() {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { start, clear } = useTimeout(() => navigate(searchParams.get('from') || '/home'), 1000);

  useEffect(() => {
    start();
    return clear;
  }, [clear, start]);

  return (
    <Flex direction="column" justify="center" align="center" h="100%" gap="md" p="md">
      <UserCheckIcon size="xl" />
      <Text>{t('signIn.successFullSignIn')}</Text>
    </Flex>
  );
}

function InvalidLink() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <Flex direction="column" justify="center" align="center" h="100%" gap="md" p="md">
      <InvalidLinkIcon size="xl" />
      <Text>{t('signIn.invalidLink')}</Text>
      <Button onClick={() => navigate('/home')}>{t('common.gotToHome')}</Button>
    </Flex>
  );
}