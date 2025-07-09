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
  DialogHeader,
  DialogTitle,
} from '@prevezic/ui/dialog';
import { Flex } from '@prevezic/ui/flex';
import { cn } from '@prevezic/ui/utils';
import { ArrowLeftIcon, DownloadIcon } from 'lucide-react';
import { useState } from 'react';

interface SlideShowProps {
  images: {
    _id: string;
    url: string;
    description?: string;
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
  const [activeIndex, setActiveIndex] = useState(initialIndex ?? 0);

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

        <Flex className='absolute top-0 left-0 w-full p-4 justify-between'>
          <Button
            variant='ghost'
            size='icon'
            className='z-10'
            onClick={() => {
              console.log('close');
              onOpenChange(false);
            }}
          >
            <ArrowLeftIcon className='size-5!' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='z-10'
            onClick={() => {
              console.log('download');
              onDownload?.(activeIndex);
            }}
          >
            <DownloadIcon className='size-5!' />
          </Button>
        </Flex>

        <SlideShow
          images={images}
          initialIndex={initialIndex}
          onActiveChange={setActiveIndex}
          // onMediaClick={onMediaClick}
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
      <CarouselContent
        className={cn({
          'gap-0.5': images.length > 40,
          'gap-0': images.length > 100,
        })}
      >
        {images.map((image, index) => (
          <CarouselItem key={image.url} className='relative'>
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
