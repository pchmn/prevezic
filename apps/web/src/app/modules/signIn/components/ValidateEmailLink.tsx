import { useLocalStorage } from '@mantine/hooks';
import { useFirebaseAuth } from '@prevezic/react';
import { useEffect } from 'react';

export function ValidateEmailLink() {
  const [email] = useLocalStorage({ key: 'emailForSignIn' });
  const { signInWithMagicLink } = useFirebaseAuth();

  useEffect(() => {
    if (email) {
      signInWithMagicLink(email)
        .then((res) => console.log('res', res))
        .catch((err) => console.log('err', err));
    }
  }, [email, signInWithMagicLink]);

  return <>Validate email link</>;
}
