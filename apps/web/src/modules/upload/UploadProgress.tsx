import { Button } from '@prevezic/ui/button';
import { XIcon } from 'lucide-react';
import type { FileUpload } from './types';

interface UploadProgressProps {
  uploads: FileUpload[];
  onRetry: (uploadId: string) => void;
  onClear: () => void;
}

export function UploadProgress({
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
    <div className='fixed bottom-20 left-4 right-4 bg-background border rounded-lg shadow-lg max-h-60 overflow-hidden'>
      {/* Header */}
      <div className='p-3 border-b flex justify-between items-center'>
        <span className='font-medium'>
          {activeUploads.length > 0
            ? `Envoi de ${activeUploads.length} photos...`
            : `${completedUploads.length} photos ajoutées`}
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
            <div className='flex-1 min-w-0'>
              <div className='text-sm truncate'>{upload.file.name}</div>
              <div className='text-xs text-muted-foreground'>
                {upload.status === 'pending' && '⏳ En attente...'}
                {upload.status === 'compressing' && '🔄 Compression...'}
                {upload.status === 'uploading' && '📤 Envoi...'}
                {upload.status === 'success' && '✅ Ajouté'}
                {upload.status === 'error' && `❌ ${upload.error}`}
              </div>
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
