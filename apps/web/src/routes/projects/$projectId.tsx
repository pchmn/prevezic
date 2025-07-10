import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import type { Id } from '@prevezic/backend/_generated/dataModel';
import { Button } from '@prevezic/ui/button';
import { Flex } from '@prevezic/ui/flex';
import { Spinner } from '@prevezic/ui/spinner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import imageCompression from 'browser-image-compression';
import { CameraIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { appConfig } from '~/config/config';
import { authClient } from '~/lib/auth.client';
import { isPrevezicError } from '~/lib/error.utils';

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const navigate = Route.useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const { project, medias, members } = useProject(projectId as Id<'projects'>);

  const { mutate: addPhotoMutation } = useMutation({
    mutationFn: async (file: File) => {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2,
        initialQuality: 0.75,
        alwaysKeepResolution: true,
        maxWidthOrHeight: 1500,
        useWebWorker: true,
      });
      return addPhoto(compressedFile, projectId as Id<'projects'>);
    },
    onSuccess: () => {
      setIsAddingPhoto(false);
    },
    onError: () => {
      setIsAddingPhoto(false);
    },
  });
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('cancel', () => {
        setIsAddingPhoto(false);
      });
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addPhotoMutation(file);
    } else {
      setIsAddingPhoto(false);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <Flex direction='col' gap='md' className='h-screen'>
      <Flex direction='col' gap='sm' className='p-4'>
        <h1
          className='text-2xl font-bold pt-2'
          style={{ fontFamily: 'Delius Swash Caps' }}
        >
          {project?.name}
        </h1>
        <Flex gap='sm' className='text-sm text-muted-foreground/75'>
          <p>{medias.length} photos</p>
        </Flex>
        {/* {!isPwa() && <Button variant='outline'>Installer l'application</Button>} */}
      </Flex>
      <div className='w-full grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1'>
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
      <input
        ref={inputRef}
        hidden
        type='file'
        accept='image/*'
        capture
        onChange={handleFileSelect}
      />

      {isAddingPhoto && (
        <Flex
          direction='col'
          align='center'
          justify='center'
          gap='md'
          className='fixed inset-0 bg-background'
        >
          <p>Ajout de la photo...</p>
          <Spinner className='w-8 h-8' />
        </Flex>
      )}

      <Button
        disabled={isAddingPhoto}
        hidden={isAddingPhoto}
        className='fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full p-6 shadow-lg font-[600]'
        onClick={() => {
          inputRef.current?.click();
          setIsAddingPhoto(true);
        }}
      >
        <CameraIcon />
        <span>Ajouter une photo</span>
      </Button>

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
