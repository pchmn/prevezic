import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@prevezic/ui/dialog';

export function InstallExplanation({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='h-full max-w-full w-full rounded-none border-none shadow-none outline-none'>
        <DialogHeader>
          <DialogTitle>Installer l'application</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
