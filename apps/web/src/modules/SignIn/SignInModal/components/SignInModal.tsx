import { ActionIcon, Flex, Modal, Title } from '@mantine/core';
import { useMediaQuery } from '@prevezic/react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { LeftArrowIcon } from 'src/shared/components';

import { useSignInRouteParams } from '../hooks';
import { SignInContextProvider, useSignInContext } from './SignInContext';

export function SignInModal({ opened = true, onClose }: { opened?: boolean; onClose?: () => void }) {
  return (
    <SignInContextProvider>
      <SignInModalContent opened={opened} onClose={onClose} />
    </SignInContextProvider>
  );
}

export function SignInModalContent({ opened = true, onClose }: { opened?: boolean; onClose?: () => void }) {
  const { loading } = useSignInContext();

  const { t } = useTranslation();

  const isMobile = useMediaQuery({ smallerThan: 'sm' });

  const { from, isMagicLinkRoute } = useSignInRouteParams();
  const navigate = useNavigate();

  const handleOnClose = () => {
    if (!loading) {
      onClose?.();
      navigate(from);
    }
  };

  return (
    <Modal
      title={
        <Flex gap="sm" align="center">
          {isMagicLinkRoute && (
            <ActionIcon onClick={() => navigate(-1)}>
              <LeftArrowIcon />
            </ActionIcon>
          )}
          <Title order={4}>{t(isMagicLinkRoute ? 'signIn.magicLink' : 'signIn.title')}</Title>
        </Flex>
      }
      opened={opened}
      onClose={handleOnClose}
      centered
      fullScreen={isMobile}
      styles={{ modal: { display: 'flex', flexDirection: 'column' }, body: { flex: 1, padding: 24 } }}
    >
      <Outlet />
    </Modal>
  );
}
