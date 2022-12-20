import { LeftArrowIcon } from '@app/shared/components';
import { ActionIcon, Flex, Modal, Title } from '@mantine/core';
import { useMediaQuery } from '@prevezic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom';

export function SignInModal({ opened = true, onClose }: { opened?: boolean; onClose?: () => void }) {
  const { t } = useTranslation();

  const isMobile = useMediaQuery({ smallerThan: 'sm' });

  const { state, pathname } = useLocation();
  const match = useMatch('/:path/signin/*');
  const [from] = useState(state?.from || match?.params?.path || '/home');
  const navigate = useNavigate();

  const handleOnClose = () => {
    onClose?.();
    navigate(from);
  };

  return (
    <Modal
      title={
        <Flex gap="sm" align="center">
          {pathname.includes('magic-link') && (
            <ActionIcon onClick={() => navigate(-1)}>
              <LeftArrowIcon />
            </ActionIcon>
          )}
          <Title order={4}>{t(pathname.includes('magic-link') ? 'signIn.magicLink' : 'signIn.title')}</Title>
        </Flex>
      }
      opened={opened}
      onClose={handleOnClose}
      fullScreen={isMobile}
      styles={{ modal: { display: 'flex', flexDirection: 'column' }, body: { flex: 1, padding: 24 } }}
    >
      <Outlet />
    </Modal>
  );
}
