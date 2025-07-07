import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import type { Id } from '@prevezic/backend/_generated/dataModel';
import { useQuery } from '@tanstack/react-query';
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
  const [showCropper, setShowCropper] = useState(false);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('');

  const { data: photos } = useQuery({
    ...convexQuery(api.photo.list, { projectId: projectId as Id<'projects'> }),
    initialData: [],
  });

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

  const handleCrop = async (croppedFile: File | Blob) => {
    setIsAddingPhoto(true);
    await addPhoto(croppedFile, projectId as Id<'projects'>);
    setIsAddingPhoto(false);
    setShowCropper(false);
    setSelectedImageSrc('');
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    if (selectedImageSrc) {
      URL.revokeObjectURL(selectedImageSrc);
    }
    setSelectedImageSrc('');
  };

  return (
    <div>
      Hello "/projects/$projectId" {projectId}!
      <div>{JSON.stringify(photos)}</div>
      {photos.map((photo) => (
        <div key={photo._id}>
          <img
            src={photo.url ?? ''}
            alt={photo.storageId}
            width={100}
            height={100}
          />
        </div>
      ))}
      <input type='file' accept='image/*' capture onChange={handleFileSelect} />
      <ImageEditor
        isLoading={isAddingPhoto}
        isOpen={showCropper}
        onOpenChange={setShowCropper}
        imageSrc={selectedImageSrc}
        onSave={handleCrop}
        onCancel={handleCancelCrop}
      />
    </div>
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
