import { Button } from '@prevezic/ui/button';
import { Spinner } from '@prevezic/ui/spinner';
import { cn } from '@prevezic/ui/utils';
import { CheckIcon, XIcon } from 'lucide-react';
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
  const activeUploads = uploads.filter((u) => !['success'].includes(u.status));
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
        {completedUploads.length > 0 && activeUploads.length === 0 && (
          <Button
            size='icon'
            variant='ghost'
            onClick={onClear}
            className='rounded-full'
          >
            <XIcon className='w-4 h-4' />
          </Button>
        )}
      </div>

      {/* Upload list */}
      <div className='max-h-40 overflow-y-auto'>
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className='p-3 border-b last:border-b-0 flex items-center gap-3'
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
