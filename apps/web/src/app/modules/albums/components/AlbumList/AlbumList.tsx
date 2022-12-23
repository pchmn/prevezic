import { Button, Flex } from '@mantine/core';
import { useFirebaseUser } from '@prevezic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateAlbum } from './CreateAlbum';

export function AlbumList() {
  const { t } = useTranslation();

  const { currentUser } = useFirebaseUser();

  const [createAlbumOpened, setCreateAlbumOpened] = useState(false);

  return (
    <Flex h="100%" justify="center" align="center">
      {!currentUser?.isAnonymous && (
        <Button onClick={() => setCreateAlbumOpened(true)}>{t('album.createAlbum.title')}</Button>
      )}
      <CreateAlbum opened={createAlbumOpened} onClose={() => setCreateAlbumOpened(false)} />
    </Flex>
  );
}
