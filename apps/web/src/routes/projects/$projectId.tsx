import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import type { Id } from '@prevezic/backend/_generated/dataModel';
import { Flex } from '@prevezic/ui/flex';
import { Spinner } from '@prevezic/ui/spinner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import imageCompression from 'browser-image-compression';
import { useEffect } from 'react';
import { appConfig } from '~/config/config';
import { authClient } from '~/lib/auth.client';
import { isPrevezicError } from '~/lib/error.utils';

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { project, medias, members } = useProject(projectId as Id<'projects'>);

  const { mutate: addPhotoMutation, isPending: isAddingPhoto } = useMutation({
    mutationFn: async (file: File) => {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2,
        initialQuality: 0.75,
        alwaysKeepResolution: true,
        maxWidthOrHeight: 1500,
        useWebWorker: true,
        fileType: 'image/webp',
      });
      return addPhoto(compressedFile, projectId as Id<'projects'>);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addPhotoMutation(file);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <Flex direction='col' gap='md'>
      <Flex direction='col' gap='md'>
        <h1>{project?.name}</h1>
        <Flex gap='sm' className='text-sm text-muted-foreground'>
          <p>{medias.length} photos</p>•<p>{members.length} membres</p>
        </Flex>
      </Flex>
      <div className='w-full grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {medias.map((media) => (
          <div
            key={media._id}
            className='aspect-square'
            style={{ contentVisibility: 'auto' }}
            onClick={() => {
              navigate({
                to: '/projects/$projectId/slide-show',
                params: { projectId },
                search: { mediaId: media._id },
              });
            }}
          >
            <img
              src={media.url ?? ''}
              alt={media.storageId}
              className='w-full h-full object-cover'
            />
          </div>
        ))}
      </div>
      <input type='file' accept='image/*' capture onChange={handleFileSelect} />

      {isAddingPhoto && (
        <Flex
          direction='col'
          align='center'
          justify='center'
          gap='md'
          className='absolute inset-0 bg-background'
        >
          <p>Ajout de la photo...</p>
          <Spinner className='w-8 h-8' />
        </Flex>
      )}
      <Outlet />
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

function useProject(projectId: Id<'projects'>) {
  const navigate = Route.useNavigate();

  const {
    data: project,
    error,
    isPending: isProjectPending,
  } = useQuery({
    ...convexQuery(api.project.get, { projectId: projectId as Id<'projects'> }),
  });

  const { data: medias, isPending: isMediasPending } = useQuery({
    ...convexQuery(api.media.list, { projectId: projectId as Id<'projects'> }),
    initialData: [],
  });

  const { data: members, isPending: isMembersPending } = useQuery({
    ...convexQuery(api.member.list, { projectId: projectId as Id<'projects'> }),
    initialData: [],
  });

  useEffect(() => {
    if (isPrevezicError(error) && error.data.code === 'not_project_member') {
      navigate({ to: '/' });
    }
  }, [error, navigate]);

  return {
    project,
    medias,
    members,
    isLoading: isProjectPending || isMediasPending || isMembersPending,
  };
}
