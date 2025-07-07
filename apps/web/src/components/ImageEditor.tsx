import { Button } from '@prevezic/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@prevezic/ui/dialog';
import { Flex } from '@prevezic/ui/flex';
import { RotateCcwIcon, RotateCwIcon } from 'lucide-react';
import { useRef } from 'react';
import { Cropper, type CropperRef } from 'react-advanced-cropper';

export function ImageEditor({
  isOpen,
  onOpenChange,
  imageSrc,
  isLoading,
  onSave,
  onCancel,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  imageSrc: string;
  onSave: (croppedImage: File | Blob) => void;
  onCancel: () => void;
}) {
  const cropperRef = useRef<CropperRef>(null);

  const rotate = (angle: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className='w-screen h-screen m-0 rounded-none'
        closable={!isLoading}
      >
        <DialogHeader>
          <DialogTitle>Ajouter la photo</DialogTitle>
          {/* <DialogDescription>
            Modifiez la photo pour l'ajouter à votre projet.
          </DialogDescription> */}
        </DialogHeader>

        <Flex direction='col' gap='md' justify='between'>
          <Flex direction='col' gap='md'>
            <Cropper
              ref={cropperRef}
              src={imageSrc}
              stencilProps={{ aspectRatio: 4 / 3 }}
            />
            <Flex gap='md' align='center'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => rotate(-90)}
                disabled={isLoading}
              >
                <RotateCcwIcon />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => rotate(90)}
                disabled={isLoading}
              >
                <RotateCwIcon />
              </Button>
            </Flex>
          </Flex>

          <Flex gap='md' align='center' className='self-end'>
            <Button variant='outline' onClick={onCancel} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              onClick={async () => {
                const croppedImage = cropperRef.current?.getCanvas();
                console.log('croppedImage', croppedImage);
                if (croppedImage) {
                  croppedImage.toBlob((blob) => {
                    if (blob) {
                      console.log('blob', blob);
                      onSave(blob);
                    }
                  }, 'image/jpeg');
                }
              }}
              loading={isLoading}
            >
              Valider
            </Button>
          </Flex>
        </Flex>
      </DialogContent>
    </Dialog>
  );
}
