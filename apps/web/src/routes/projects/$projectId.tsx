import { convexQuery } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import type { Id } from '@prevezic/backend/_generated/dataModel';
import { Button } from '@prevezic/ui/button';
import { Flex } from '@prevezic/ui/flex';
import { useQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { CameraIcon, UploadIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { z } from 'zod/v4';
import { InstallExplanation } from '~/components/InstallExplanation';
import { useInstallationPrompt } from '~/components/InstallationPromptProvider';
import { isPwa } from '~/lib/cache-storage/cache-storage';
import { isPrevezicError } from '~/lib/error.utils';
import { toast } from '~/lib/toast/toast';
import { UploadProgress } from '~/modules/upload/UploadProgress';
import { useFileUpload } from '~/modules/upload/useFileUpload';

const searchSchema = z.object({
  installExplanation: z.boolean().optional(),
});

export const Route = createFileRoute('/projects/$projectId')({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const navigate = Route.useNavigate();

  const inputRefUpload = useRef<HTMLInputElement>(null);
  const inputRefCamera = useRef<HTMLInputElement>(null);

  const { installExplanation } = Route.useSearch();
  const { isInstalled, isInstallable, showInstallPrompt } =
    useInstallationPrompt();

  const { project, medias } = useProject(projectId as Id<'projects'>);

  const {
    uploads,
    hasActiveUploads,
    addFiles,
    retryUpload,
    clearCompletedUploads,
  } = useFileUpload(projectId as Id<'projects'>);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await addFiles(files);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <Flex direction='col' className='h-screen'>
      <Flex justify='between'>
        <Flex direction='col' gap='sm' className='p-6'>
          <h1
            className='text-2xl font-bold '
            style={{ fontFamily: 'Delius Swash Caps' }}
          >
            {project?.name}
          </h1>
          <span className='text-sm text-muted-foreground/75'>
            {medias.length} photos
          </span>
        </Flex>
        {!isPwa() && (
          <div className='p-6'>
            <Button
              variant='outline'
              onClick={() => {
                if (isInstallable) {
                  showInstallPrompt();
                } else {
                  navigate({
                    search: { installExplanation: true },
                  });
                }
              }}
            >
              Installer
            </Button>
          </div>
        )}
      </Flex>

      <InstallExplanation
        invitationToken={project?.invitationToken ?? ''}
        open={!!installExplanation}
        onOpenChange={() => {
          navigate({ search: { installExplanation: undefined } });
        }}
      />

      {medias.length > 0 ? (
        <div className='w-full grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1'>
          {medias.map((media) => (
            <div
              key={media._id}
              className='aspect-square'
              style={{ contentVisibility: 'auto' }}
              onClick={() => {
                navigate({
                  to: './slide-show',
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
      ) : (
        <div className='w-full h-full flex justify-center pt-8'>
          <p className='text-sm text-muted-foreground'>
            Aucune photo ajoutée pour le moment
          </p>
        </div>
      )}
      <input
        ref={inputRefUpload}
        hidden
        type='file'
        accept='image/*'
        onChange={handleFileSelect}
        multiple
      />

      <input
        ref={inputRefCamera}
        hidden
        type='file'
        accept='image/*'
        capture
        onChange={handleFileSelect}
        multiple
      />

      {uploads.length > 0 && (
        <UploadProgress
          uploads={uploads}
          onRetry={retryUpload}
          onClear={clearCompletedUploads}
        />
      )}

      <Flex
        justify='between'
        align='center'
        gap='sm'
        className='fixed bottom-6 left-1/2 -translate-x-1/2'
      >
        <Button
          variant='outline'
          className='rounded-full p-6 shadow-lg font-[600] bg-[#f7eef3] dark:bg-[#2b212a]!'
          onClick={() => {
            inputRefUpload.current?.click();
          }}
        >
          <UploadIcon className='size-6!' />
          {/* <span>Ajouter une photo</span> */}
        </Button>

        <Button
          className='rounded-full p-6 shadow-lg font-[600]'
          onClick={() => {
            inputRefCamera.current?.click();
          }}
        >
          <CameraIcon className='size-6!' />
          {/* <span>Prendre une photo</span> */}
        </Button>
      </Flex>

      <Outlet />
    </Flex>
  );
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

  // const { data: members, isPending: isMembersPending } = useQuery({
  //   ...convexQuery(api.member.list, { projectId: projectId as Id<'projects'> }),
  //   initialData: [],
  // });

  useEffect(() => {
    if (isPrevezicError(error) && error.data.code === 'not_project_member') {
      toast.error('Projet non trouvé');
      navigate({ to: '/' });
    }
  }, [error, navigate]);

  return {
    project,
    medias,
    // members,
    isLoading: isProjectPending || isMediasPending,
  };
}

export interface FileUpload {
  id: string;
  file: File;
  status: 'pending' | 'compressing' | 'uploading' | 'success' | 'error';
  error?: string;
}
