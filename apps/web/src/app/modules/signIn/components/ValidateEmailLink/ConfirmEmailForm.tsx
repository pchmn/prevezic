import { Button, Flex, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export function ConfirmEmailForm({ onSubmit }: { onSubmit: (values: { email: string }) => void }) {
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
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Flex direction="column" gap="md" maw={450}>
        <Text mb="md">{t('signIn.differentDevice')}</Text>
        <TextInput placeholder={t('signIn.emailPlaceholder') || ''} {...form.getInputProps('email')} />
        <Button type="submit" disabled={!form.values.email}>
          {t('common.confirm')}
        </Button>
      </Flex>
    </form>
  );
}
