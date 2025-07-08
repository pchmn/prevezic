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
import { cn } from '@prevezic/ui/utils';

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
}: SlideShowProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
        <SlideShow
          images={images}
          initialIndex={initialIndex}
          // onActiveChange={onActiveChange}
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
