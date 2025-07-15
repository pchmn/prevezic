import { Button } from '@prevezic/ui/button';
import { Spinner } from '@prevezic/ui/spinner';
import { cn } from '@prevezic/ui/utils';
import { CheckIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast as sonnerToast } from 'sonner';
import type { FileUpload } from './types';

interface UploadProgressProps {
  className?: string;
  uploads: FileUpload[];
  onRetry: (uploadId: string) => void;
  onClear: () => void;
}

export function UploadProgress({
  className,
  uploads,
  onRetry,
  onClear,
}: UploadProgressProps) {
  const activeUploads = uploads.filter(
    (u) => !['success', 'error'].includes(u.status),
  );
  const completedUploads = uploads.filter((u) =>
    ['success', 'error'].includes(u.status),
  );

  if (uploads.length === 0) return null;

  return (
    <div
      className={cn(
        'bg-background border rounded-lg shadow-lg max-h-60 overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      {uploads.length > 1 && (
        <div className='p-3 border-b flex justify-between items-center'>
          <span className='font-medium'>
            {activeUploads.length > 0
              ? `Envoi de ${activeUploads.length} ${
                  activeUploads.length === 1 ? 'photo' : 'photos'
                }...`
              : `${completedUploads.length} ${
                  completedUploads.length === 1
                    ? 'photo ajoutée'
                    : 'photos ajoutées'
                }`}
          </span>
          <Button
            size='icon'
            variant='ghost'
            onClick={onClear}
            disabled={activeUploads.length > 0}
          >
            <XIcon
              className={`w-4 h-4 ${activeUploads.length > 0 ? 'opacity-0' : ''}`}
            />
          </Button>
        </div>
      )}

      {/* Upload list */}
      <div className='max-h-40 overflow-y-auto'>
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className={cn(
              'border-b last:border-b-0 flex items-center gap-3',
              uploads.length === 1 ? 'px-4 py-5' : 'p-3',
            )}
          >
            <div className='flex-1 min-w-0 flex items-center gap-2'>
              <div className='text-xs text-muted-foreground'>
                {['pending', 'compressing', 'uploading'].includes(
                  upload.status,
                ) && <Spinner className='size-4' />}
                {upload.status === 'success' && (
                  <CheckIcon className='size-4 text-green-400 dark:text-green-300' />
                )}
                {upload.status === 'error' && (
                  <XIcon className='size-4 text-red-400 dark:text-red-300' />
                )}
              </div>
              <div className='text-sm truncate'>{upload.file.name}</div>
            </div>

            {upload.status === 'error' && (
              <Button
                size='sm'
                variant='outline'
                onClick={() => onRetry(upload.id)}
              >
                Réessayer
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function useProgressToast(
  uploads: FileUpload[],
  retryUpload: (uploadId: string) => void,
  clearCompletedUploads: () => void,
) {
  const [uploadToastId, setUploadToastId] = useState<string | number>();

  useEffect(() => {
    if (uploads.length > 0) {
      const activeUploads = uploads.filter(
        (u) => !['success', 'error'].includes(u.status),
      );
      const completedUploads = uploads.filter((u) =>
        ['success', 'error'].includes(u.status),
      );
      if (uploadToastId) {
        // Update existing toast
        sonnerToast.custom(
          (t) => (
            <UploadProgress
              uploads={uploads}
              onRetry={retryUpload}
              onClear={() => {
                clearCompletedUploads();
                sonnerToast.dismiss(t);
                setUploadToastId(undefined);
              }}
              className='w-full'
            />
          ),
          {
            duration:
              completedUploads.length === 1 &&
              completedUploads[0].status === 'success'
                ? 3000
                : Number.POSITIVE_INFINITY,
            id: uploadToastId,
            dismissible: activeUploads.length === 0,
            onAutoClose: () => {
              clearCompletedUploads();
              setUploadToastId(undefined);
            },
            onDismiss: () => {
              clearCompletedUploads();
              setUploadToastId(undefined);
            },
          },
        );
      } else {
        // Create new toast
        const toastId = sonnerToast.custom(
          (t) => (
            <UploadProgress
              uploads={uploads}
              onRetry={retryUpload}
              onClear={() => {
                clearCompletedUploads();
                sonnerToast.dismiss(t);
                setUploadToastId(undefined);
              }}
              className='w-full'
            />
          ),
          {
            duration: Number.POSITIVE_INFINITY,
            dismissible: activeUploads.length === 0,
            onAutoClose: () => {
              clearCompletedUploads();
              setUploadToastId(undefined);
            },
            onDismiss: () => {
              clearCompletedUploads();
              setUploadToastId(undefined);
            },
          },
        );
        // toast.message(<div>test</div>, {
        //   duration: Number.POSITIVE_INFINITY,
        // });
        setUploadToastId(toastId);
      }
    } else if (uploadToastId) {
      // Dismiss toast when no uploads
      sonnerToast.dismiss(uploadToastId);
      setUploadToastId(undefined);
    }
  }, [uploads, uploadToastId, retryUpload, clearCompletedUploads]);
}
