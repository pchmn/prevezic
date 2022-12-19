import { GoogleIcon, LeftArrowIcon, MagicIcon } from '@app/shared/components';
import { ActionIcon, Button, Flex, Modal, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useFirebaseAuth } from '@prevezic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MagicLinkSignIn } from './MagicLinkSignIn';

export function SignInModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const { t } = useTranslation();

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const [signInMethod, setSignInMethod] = useState<'google' | 'magic' | null>(null);

  const handleOnClose = () => {
    onClose();
    setSignInMethod(null);
  };

  return (
    <Modal
      title={
        <Flex gap="sm" align="center">
          {signInMethod && (
            <ActionIcon onClick={() => setSignInMethod(null)} sx={{ marginLeft: -4 }}>
              <LeftArrowIcon />
            </ActionIcon>
          )}
          <Title order={4}>{t('signIn.title')}</Title>
        </Flex>
      }
      opened={opened}
      onClose={handleOnClose}
      fullScreen={isMobile}
      styles={{ modal: { display: 'flex', flexDirection: 'column' }, body: { flex: 1, padding: 24 } }}
    >
      <SignInModalContent
        signInMethod={signInMethod}
        setSignInMethod={setSignInMethod}
        onSuccessfulSignIn={handleOnClose}
      />
    </Modal>
  );
}

function SignInModalContent({
  signInMethod,
  setSignInMethod,
  onSuccessfulSignIn,
}: {
  signInMethod: 'google' | 'magic' | null;
  setSignInMethod: (method: 'google' | 'magic' | null) => void;
  onSuccessfulSignIn: () => void;
}) {
  const { t } = useTranslation();
  const { signInWithGoogle } = useFirebaseAuth();

  const googleSignIn = async () => {
    await signInWithGoogle();
    onSuccessfulSignIn();
  };

  return (
    <>
      {!signInMethod && (
        <Flex direction="column" gap="md" justify="center" h="100%">
          <Button leftIcon={<GoogleIcon />} onClick={googleSignIn}>
            {t('signIn.signInWithGoogle')}
          </Button>
          <Button leftIcon={<MagicIcon />} onClick={() => setSignInMethod('magic')}>
            {t('signIn.signInWithMagicLink')}
          </Button>
        </Flex>
      )}
      {signInMethod === 'magic' && <MagicLinkSignIn />}
    </>
  );
}
