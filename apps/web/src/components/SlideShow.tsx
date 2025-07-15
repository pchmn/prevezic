import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '@prevezic/backend/_generated/api';
import type { Id } from '@prevezic/backend/_generated/dataModel';
import { Button } from '@prevezic/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@prevezic/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@prevezic/ui/dialog';
import { Flex } from '@prevezic/ui/flex';
import { cn } from '@prevezic/ui/utils';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeftIcon, DownloadIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from '~/hooks/useSession';
import { toast } from '~/lib/toast/toast';

interface SlideShowProps {
  images: {
    _id: string;
    url: string;
    description?: string;
    uploaderId: string;
  }[];
  initialIndex?: number;
}

export function SlideShowDialog({
  images,
  initialIndex,
  open,
  onOpenChange,
  onDownload,
}: SlideShowProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (index: number) => void;
}) {
  const { session } = useSession();

  const [activeIndex, setActiveIndex] = useState(initialIndex ?? 0);
  const [showToolbar, setShowToolbar] = useState(true);

  const [removeMediaIsOpen, setRemoveMediaIsOpen] = useState(false);

  const { mutate: removeMedia, isPending: isRemoveMediaPending } = useMutation({
    mutationFn: useConvexMutation(api.media.remove),
    onSuccess: () => {
      setRemoveMediaIsOpen(false);
      toast.success('Photo supprimée');
    },
    onError: () => {
      setRemoveMediaIsOpen(false);
      toast.error('Erreur lors de la suppression de la photo');
    },
  });

  useEffect(() => {
    if (images.length === 0) {
      onOpenChange(false);
    }
  }, [images, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='h-full max-w-full w-full rounded-none p-0 bg-black border-none shadow-none outline-none'
        showCloseButton={false}
      >
        <div hidden>
          <DialogHeader>
            <DialogTitle>SlideShow</DialogTitle>
            <DialogDescription>Slideshow description</DialogDescription>
          </DialogHeader>
        </div>

        <Flex
          className={cn(
            'absolute top-0 left-0 w-full p-4 justify-between z-10',
            showToolbar ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Button
            variant='ghost'
            size='icon'
            className='z-10 p-5 backdrop-blur-md bg-black/30 rounded-full border border-white/20'
            onClick={() => {
              onOpenChange(false);
            }}
          >
            <ArrowLeftIcon className='size-6! text-white' />
          </Button>
          <Flex align='center' gap='md'>
            <Button
              variant='ghost'
              size='icon'
              className='z-10 p-5 backdrop-blur-md bg-black/30 rounded-full border border-white/20'
              onClick={() => {
                onDownload?.(activeIndex);
              }}
            >
              <DownloadIcon className='size-6! text-white' />
            </Button>
            {session?.user?.id === images[activeIndex]?.uploaderId && (
              <Button
                variant='ghost'
                size='icon'
                className='z-10 p-5 backdrop-blur-md bg-black/30 rounded-full border border-white/20'
                onClick={() => setRemoveMediaIsOpen(true)}
              >
                <Trash2Icon className='size-6! text-red-300' />
              </Button>
            )}
          </Flex>
        </Flex>

        <Dialog open={removeMediaIsOpen} onOpenChange={setRemoveMediaIsOpen}>
          <DialogContent closable={!isRemoveMediaPending}>
            <DialogHeader>
              <DialogTitle>Supprimer la photo</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cette photo ?
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setRemoveMediaIsOpen(false)}
                  disabled={isRemoveMediaPending}
                >
                  Annuler
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => {
                    removeMedia({
                      mediaId: images[activeIndex]._id as Id<'medias'>,
                    });
                  }}
                  loading={isRemoveMediaPending}
                >
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <SlideShow
          images={images}
          initialIndex={initialIndex}
          onActiveChange={setActiveIndex}
          onMediaClick={() => {
            setShowToolbar(!showToolbar);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export function SlideShow({
  images,
  initialIndex,
  onActiveChange,
  onMediaClick,
}: SlideShowProps & {
  onActiveChange?: (index: number) => void;
  onMediaClick?: (mediaId: string) => void;
}) {
  return (
    <Carousel
      className='w-full h-full'
      opts={{ startIndex: initialIndex }}
      onActiveChange={onActiveChange}
    >
      <CarouselContent className='-ml-2'>
        {images.map((image, index) => (
          <CarouselItem key={image.url} className='relative pl-2'>
            <img
              key={image.url}
              src={image.url}
              alt={image.description ?? `Slide ${index + 1}`}
              className='w-screen h-screen object-contain flex-shrink-0'
              loading='lazy'
              onClick={() => {
                onMediaClick?.(image._id);
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
