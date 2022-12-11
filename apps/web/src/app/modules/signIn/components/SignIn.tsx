import { Button, Flex, Image, Paper, Space, Text, TextInput, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useLocalStorage } from '@mantine/hooks';
import { useFirebaseAuth } from '@prevezic/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export function SignIn() {
  const { t } = useTranslation();

  const [, setEmail] = useLocalStorage({ key: 'emailForSignIn' });

  const { sendMagicLink, loading } = useFirebaseAuth();
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = ({ email }: { email: string }) => {
    if (loading) {
      return;
    }
    setEmail(email);
    sendMagicLink(email, `${window.location.origin}/signin/validate-link`)
      .then(() => setEmailSent(true))
      .catch((err) => console.log('err', err));
  };

  return (
    <Flex direction="column">
      <Flex
        justify="center"
        sx={(theme) => ({
          paddingBottom: 50,
          paddingTop: 50 - theme.spacing.xl,
          [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            paddingTop: 0,
            paddingBottom: theme.spacing.xl,
          },
        })}
      >
        <Image src="favicon.svg" height={50} width={50} />
      </Flex>
      <Flex justify="center" align="center">
        <Paper shadow="xs" p={30} maw={450}>
          <Title order={3}>{t('signIn.title')}</Title>
          <Space h={10} />
          <Text>{t('signIn.description')}</Text>
          <Space h={30} />
          {!emailSent ? <SignInForm loading={loading} onSubmit={handleSubmit} /> : <Text>{t('signIn.emailSent')}</Text>}
        </Paper>
      </Flex>
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
          size="lg"
          placeholder={t('signIn.emailPlaceholder') || ''}
          {...form.getInputProps('email')}
          disabled={loading}
        />
        <Button size="lg" type="submit" disabled={!form.values.email} loading={loading}>
          {t('signIn.sendMagicLink')}
        </Button>
      </Flex>
    </form>
  );
}
