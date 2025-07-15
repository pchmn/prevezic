import { Button } from '@prevezic/ui/button';
import { Card, CardContent, CardHeader } from '@prevezic/ui/card';
import { Flex } from '@prevezic/ui/flex';
import { Spinner } from '@prevezic/ui/spinner';
import { cn } from '@prevezic/ui/utils';
import { CheckIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
    <Card
      className={cn('shadow-lg max-h-60 overflow-hidden rounded-lg', className)}
    >
      {uploads.length > 1 && (
        <CardHeader className='p-3 border-b'>
          <Flex justify='between' align='center'>
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
          </Flex>
        </CardHeader>
      )}

      <CardContent
        className={cn(
          'max-h-40 overflow-y-auto overscroll-none',
          uploads.length > 1 ? 'p-0' : 'px-4 py-5',
        )}
        onPointerMove={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className={cn(
              'border-b last:border-b-0',
              uploads.length === 1 ? '' : 'p-3',
            )}
          >
            <Flex align='center' gap='3'>
              <Flex flex='1' align='center' gap='2' className='min-w-0'>
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
              </Flex>

              {upload.status === 'error' && (
                <Button
                  size='xs'
                  variant='outline'
                  onClick={() => onRetry(upload.id)}
                >
                  Réessayer
                </Button>
              )}
            </Flex>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function useProgressToast(
  uploads: FileUpload[],
  retryUpload: (uploadId: string) => void,
  clearCompletedUploads: () => void,
) {
  const [uploadToastId, setUploadToastId] = useState<string | number>();

  const dismissToast = useCallback(() => {
    clearCompletedUploads();
    if (uploadToastId) {
      sonnerToast.dismiss(uploadToastId);
    }
    setUploadToastId(undefined);
  }, [clearCompletedUploads, uploadToastId]);

  useEffect(() => {
    if (uploads.length === 0) {
      if (uploadToastId) dismissToast();
      return;
    }

    const activeUploads = uploads.filter(
      (u) => !['success', 'error'].includes(u.status),
    );
    const isOnlyOneSuccess =
      uploads.length === 1 && uploads[0].status === 'success';

    const toastOptions = {
      duration: isOnlyOneSuccess ? 3000 : Number.POSITIVE_INFINITY,
      dismissible: activeUploads.length === 0,
      onAutoClose: dismissToast,
      onDismiss: dismissToast,
      ...(uploadToastId && { id: uploadToastId }), // Add id only if updating
    };

    const toastId = sonnerToast.custom(
      (t) => (
        <UploadProgress
          uploads={uploads}
          onRetry={retryUpload}
          onClear={dismissToast}
          className='w-full'
        />
      ),
      toastOptions,
    );

    // Only set the ID if it's a new toast (not an update)
    if (!uploadToastId) {
      setUploadToastId(toastId);
    }
  }, [uploads, uploadToastId, retryUpload, dismissToast]);
}
