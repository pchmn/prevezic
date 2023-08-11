import { Box, Button, Flex, Group, Title } from '@mantine/core';
import { UserDocument } from '@prevezic/core';
import { useFirebaseUser, useFirestoreQuery } from '@prevezic/react';
import { User } from 'firebase/auth';
import { collection, documentId, getFirestore, query, where } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PlusIcon } from '@/shared/components';

import { CreateAlbum } from './CreateAlbum';

const getAlbumAccessIds = (currentUser: (User & UserDocument) | null | undefined) => {
  if (currentUser?.isAnonymous || !currentUser?.rights) {
    return [];
  }

  const albumIds = [];
  for (const key of Object.keys(currentUser.rights)) {
    if (['member', 'editor', 'owner'].includes(currentUser.rights[key])) {
      albumIds.push(key);
    }
  }
  return albumIds;
};

export function AlbumList() {
  const { t } = useTranslation();

  const { currentUser } = useFirebaseUser();

  const albumAccessIds = useMemo(() => getAlbumAccessIds(currentUser), [currentUser]);
  const { data, isLoading } = useFirestoreQuery(
    ['albums', albumAccessIds.join('-')],
    query(
      collection(getFirestore(), 'albums'),
      where(documentId(), 'in', albumAccessIds.length ? albumAccessIds : ['unknown'])
    ),
    {
      enabled: !!albumAccessIds.length,
      listen: true,
    }
  );

  console.log('albums', data, isLoading);

  const [createAlbumOpened, setCreateAlbumOpened] = useState(false);

  return (
    <Flex direction="column" h="100%" gap="md" sx={{ position: 'relative' }}>
      <Title order={4}>{t('album.albumList.title')}</Title>
      <Group>
        <Flex
          justify="center"
          align="center"
          sx={(theme) => ({
            borderRadius: 8,
            backgroundColor: theme.other.schemes[theme.colorScheme].surface2,
            // minWidth: 150,
            maxWidth: 175,
            aspectRatio: '1 / 1',
          })}
          onClick={() => setCreateAlbumOpened(true)}
        >
          <PlusIcon size="lg" />
        </Flex>
        <Flex
          justify="center"
          align="center"
          sx={(theme) => ({
            borderRadius: 8,
            backgroundColor: theme.other.schemes[theme.colorScheme].surface2,
            // minWidth: 150,
            maxWidth: 175,
            aspectRatio: '1 / 1',
          })}
          onClick={() => setCreateAlbumOpened(true)}
        >
          <PlusIcon size="lg" />
        </Flex>
        <Flex
          justify="center"
          align="center"
          sx={(theme) => ({
            borderRadius: 8,
            backgroundColor: theme.other.schemes[theme.colorScheme].surface2,
            // minWidth: 150,
            maxWidth: 175,
            aspectRatio: '1 / 1',
          })}
          onClick={() => setCreateAlbumOpened(true)}
        >
          <PlusIcon size="lg" />
        </Flex>
        <Flex
          justify="center"
          align="center"
          sx={(theme) => ({
            borderRadius: 8,
            backgroundColor: theme.other.schemes[theme.colorScheme].surface2,
            // minWidth: 150,
            maxWidth: 175,
            aspectRatio: '1 / 1',
          })}
          onClick={() => setCreateAlbumOpened(true)}
        >
          <PlusIcon size="lg" />
        </Flex>
      </Group>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
        <Flex
          justify="center"
          align="center"
          sx={(theme) => ({
            borderRadius: 8,
            backgroundColor: theme.other.schemes[theme.colorScheme].surface2,
            aspectRatio: '1 / 1',
          })}
          onClick={() => setCreateAlbumOpened(true)}
        >
          <PlusIcon size="lg" />
        </Flex>
        <Flex
          justify="center"
          align="center"
          sx={(theme) => ({
            borderRadius: 8,
            backgroundColor: theme.other.schemes[theme.colorScheme].surface2,
            aspectRatio: '1 / 1',
          })}
          onClick={() => setCreateAlbumOpened(true)}
        >
          <PlusIcon size="lg" />
        </Flex>
      </Box>
      {/* <Grid>
        <Grid.Col span={6}>
          <Flex
            justify="center"
            align="center"
            sx={(theme) => ({
              borderRadius: 8,
              backgroundColor: theme.other.schemes[theme.colorScheme].surface2,
              aspectRatio: '1 / 1',
            })}
            onClick={() => setCreateAlbumOpened(true)}
          >
            <PlusIcon size="lg" />
          </Flex>
        </Grid.Col>
      </Grid> */}
      {!currentUser?.isAnonymous && (
        <>
          <Button
            sx={{ position: 'absolute', bottom: 0, right: 0 }}
            radius="lg"
            size="md"
            onClick={() => setCreateAlbumOpened(true)}
            leftIcon={<PlusIcon size="lg" />}
          >
            {t('album.createAlbum.title')}
          </Button>
        </>
      )}
      <CreateAlbum opened={createAlbumOpened} onClose={() => setCreateAlbumOpened(false)} />
    </Flex>
  );
}
