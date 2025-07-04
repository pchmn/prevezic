import { cn } from '@/lib/utils';

export function Divider({
  text,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { text?: string }) {
  return (
    <div className={cn('w-full flex items-center', className)} {...props}>
      <div className='bg-border h-px flex-1' />
      <span className=' px-2 text-sm'>{text}</span>
      <div className='bg-border h-px flex-1' />
    </div>
  );
}
