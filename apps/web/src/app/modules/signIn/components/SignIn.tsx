import { Button, Flex, Input } from '@mantine/core';
import { useInputState, useLocalStorage } from '@mantine/hooks';
import { useFirebaseAuth } from '@prevezic/react';

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
    <form onSubmit={handleSubmit}>
      <Flex direction="column">
        <Input placeholder="Enter your email" value={emailValue} onChange={setEmailValue} />
        <Button type="submit" disabled={!emailValue || loading} loading={loading}>
          Send Magic Link
        </Button>
      </Flex>
    </form>
  );
}
