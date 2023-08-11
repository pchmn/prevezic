import { Button, Drawer, Flex, Modal, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useFirebaseUser, useFirestoreAddDoc, useMediaQuery, useNotification } from '@prevezic/react';
import { collection, getFirestore } from 'firebase/firestore';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export function CreateAlbum({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const matches = useMediaQuery({ smallerThan: 'sm' });

  if (matches) {
    return (
      <Drawer opened={opened} onClose={onClose} title={t('album.createAlbum.title')} position="bottom">
        <CreateAlbumContent onSuccess={onClose} />
      </Drawer>
    );
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t('album.createAlbum.title')}>
      <CreateAlbumContent onSuccess={onClose} />
    </Modal>
  );
}

function CreateAlbumContent({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation();

  const { currentUser } = useFirebaseUser();

  const { mutate: addDoc, isLoading } = useFirestoreAddDoc();
  const collectionRef = useMemo(() => collection(getFirestore(), 'albums'), []);

  const { showError, showSuccess } = useNotification();

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string(),
      }),
    []
  );
  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      name: '',
    },
  });

  const handleSubmit = async ({ name }: { name: string }) => {
    addDoc(
      { ref: collectionRef, data: { name, createdBy: currentUser?.uid } },
      {
        onSuccess: () => {
          showSuccess({
            title: t('album.createAlbum.success.title'),
            message: t('album.createAlbum.success.description'),
          });
          onSuccess();
        },
        onError: () =>
          showError({ title: t('album.createAlbum.error.title'), message: t('album.createAlbum.error.description') }),
      }
    );
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))} style={{ width: '100%' }}>
      <Flex direction="column" gap="md" w="100%">
        <TextInput
          withAsterisk
          label={t('album.createAlbum.name')}
          placeholder={t('album.createAlbum.namePlaceholder') || ''}
          {...form.getInputProps('name')}
          disabled={isLoading}
        />
        <Button type="submit" disabled={!form.values.name} loading={isLoading}>
          {t('common.create')}
        </Button>
      </Flex>
    </form>
  );
}
