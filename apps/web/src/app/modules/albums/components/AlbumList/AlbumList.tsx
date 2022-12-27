import { Button, Flex } from '@mantine/core';
import { UserDocument } from '@prevezic/core';
import { useFirebaseUser, useFirestoreQuery } from '@prevezic/react';
import { User } from 'firebase/auth';
import { collection, documentId, getFirestore, query, where } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  console.log('albumIds', albumIds);
  return albumIds;
};

export function AlbumList() {
  const { t } = useTranslation();

  const { currentUser } = useFirebaseUser();
  console.log('currentUser', currentUser?.rights);
  const albumAccessIds = useMemo(() => getAlbumAccessIds(currentUser), [currentUser]);
  // const { data: albums, loading } = useFirestoreCollection(
  //   query(
  //     collection(getFirestore(), 'albums'),
  //     where(documentId(), 'in', albumAccessIds.length ? albumAccessIds : ['unknown'])
  //   ),
  //   {
  //     queryKey: `albums-${albumAccessIds.join('-')}`,
  //     enabled: !!albumAccessIds.length,
  //   }
  // );
  // const { data } = useFirestoreQueryData(
  //   ['albums', albumAccessIds.join('-')],
  //   query(
  //     collection(getFirestore(), 'albums'),
  //     where(documentId(), 'in', albumAccessIds.length ? albumAccessIds : ['unknown'])
  //   ),
  //   { subscribe: true }
  // );
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
    <Flex h="100%" justify="center" align="center">
      {!currentUser?.isAnonymous && (
        <Button onClick={() => setCreateAlbumOpened(true)}>{t('album.createAlbum.title')}</Button>
      )}
      <CreateAlbum opened={createAlbumOpened} onClose={() => setCreateAlbumOpened(false)} />
    </Flex>
  );
}
