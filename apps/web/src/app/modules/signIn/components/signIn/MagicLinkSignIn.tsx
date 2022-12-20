import { MailCheckIcon } from '@app/shared/components';
import { Button, Flex, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useLocalStorage } from '@mantine/hooks';
import { useFirebaseAuth, useMediaQuery, useNotification } from '@prevezic/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export function MagicLinkSignIn() {
  const { t } = useTranslation();

  const [, setEmail] = useLocalStorage({ key: 'emailForSignIn' });

  const { sendMagicLink, loading } = useFirebaseAuth();
  const [emailSent, setEmailSent] = useState(false);

  const isMobile = useMediaQuery({ smallerThan: 'sm' });

  const { showError } = useNotification();

  const handleSubmit = async ({ email }: { email: string }) => {
    if (loading) {
      return;
    }
    setEmail(email);
    try {
      await sendMagicLink(email, window.location.pathname);
      setEmailSent(true);
    } catch (error) {
      showError({ title: t('signIn.emailSentError.title'), message: t('signIn.emailSentError.description') });
    }
  };

  return (
    <Flex direction="column" justify="center" h="100%" gap="xl" sx={{ position: 'relative' }}>
      {!emailSent ? (
        <>
          <Text sx={{ position: isMobile ? 'absolute' : undefined, top: isMobile ? 0 : undefined }}>
            {t('signIn.description')}
          </Text>
          <SignInForm loading={loading} onSubmit={handleSubmit} />{' '}
        </>
      ) : (
        <Flex direction="column" align="center" gap="md">
          <MailCheckIcon size={60} color="#73DAA4" />
          <Text align="center">{t('signIn.emailSent')}</Text>
        </Flex>
      )}
    </Flex>
  );
}

function SignInForm({ loading, onSubmit }: { loading: boolean; onSubmit: (values: { email: string }) => void }) {
  const { t } = useTranslation();

  const formSchema = useMemo(
    () =>
      z.object({
        email: z.string().email({ message: t('signIn.invalidEmail') }),
      }),
    [t]
  );
  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      email: '',
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))} style={{ width: '100%' }}>
      <Flex direction="column" gap="md" w="100%">
        <TextInput
          placeholder={t('signIn.emailPlaceholder') || ''}
          {...form.getInputProps('email')}
          disabled={loading}
        />
        <Button type="submit" disabled={!form.values.email} loading={loading}>
          {t('signIn.sendMagicLink')}
        </Button>
      </Flex>
    </form>
  );
}
