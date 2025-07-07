import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import type { Id } from '@prevezic/backend/_generated/dataModel';
import { Flex } from '@prevezic/ui/flex';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ImageEditor } from '~/components/ImageEditor';
import { appConfig } from '~/config/config';
import { authClient } from '~/lib/auth.client';

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();

  const { data: project } = useQuery({
    ...convexQuery(api.project.get, { projectId: projectId as Id<'projects'> }),
  });

  const { mutate: addPhotoMutation, isPending: isAddingPhoto } = useMutation({
    mutationFn: (croppedFile: File | Blob) =>
      addPhoto(croppedFile, projectId as Id<'projects'>),
    onSuccess: () => {
      setShowCropper(false);
      setSelectedImageSrc('');
    },
  });

  const [showCropper, setShowCropper] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageSrc(imageUrl);
      setShowCropper(true);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    if (selectedImageSrc) {
      URL.revokeObjectURL(selectedImageSrc);
    }
    setSelectedImageSrc('');
  };

  return (
    <Flex direction='col' gap='md'>
      <Flex direction='col' gap='md'>
        <h1>{project?.name}</h1>
        <Flex gap='sm' className='text-sm text-muted-foreground'>
          <p>{project?.photos.length} photos</p>•
          <p>{project?.members.length} membres</p>
        </Flex>
      </Flex>
      <div className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {project?.photos.map((photo) => (
          <div
            key={photo._id}
            className='aspect-square'
            style={{ contentVisibility: 'auto' }}
          >
            <img
              src={photo.url ?? ''}
              alt={photo.storageId}
              className='w-full h-full object-cover'
            />
          </div>
        ))}
      </div>
      <input type='file' accept='image/*' capture onChange={handleFileSelect} />
      <ImageEditor
        isLoading={isAddingPhoto}
        isOpen={showCropper}
        onOpenChange={setShowCropper}
        imageSrc={selectedImageSrc}
        onSave={addPhotoMutation}
        onCancel={handleCancelCrop}
      />
    </Flex>
  );
}

async function addPhoto(file: File | Blob, projectId: Id<'projects'>) {
  const sendImageUrl = new URL(`${appConfig.convexSiteUrl}/add-photo`);
  sendImageUrl.searchParams.set('projectId', projectId);

  const { data } = await authClient.convex.token();

  await fetch(sendImageUrl, {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      Authorization: `Bearer ${data?.token}`,
    },
    body: file,
  });
}
