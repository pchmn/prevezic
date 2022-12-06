import { Button, Flex, Input, Space, Text, Title } from '@mantine/core';
import { useInputState, useLocalStorage } from '@mantine/hooks';
import { useFirebaseAuth } from '@prevezic/react';
import i18next from 'i18next';

export function SignIn() {
  const [emailValue, setEmailValue] = useInputState('');
  const [, setEmail] = useLocalStorage({ key: 'emailForSignIn' });

  const { sendMagicLink, loading } = useFirebaseAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmail(emailValue);
    sendMagicLink(emailValue, `${window.location.origin}/signin/validate-link`)
      .then((res) => console.log('res', res))
      .catch((err) => console.log('err', err));
  };

  return (
    <Flex h="100%" align="center" direction="column" gap="xl">
      <Title order={2}>{i18next.t('signIn.title')}</Title>
      <Text>{i18next.t('signIn.description')}</Text>
      <Space h={30} />
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="md" w={{ xs: '100%', sm: 300 }}>
          <Input placeholder={i18next.t('signIn.emailPlaceholder')} value={emailValue} onChange={setEmailValue} />
          <Button type="submit" disabled={!emailValue || loading} loading={loading}>
            {i18next.t('signIn.sendMagicLink')}
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}
