import { cn } from '../lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 28 28'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('h-4 w-4 animate-spin', className)}
    >
      <path
        d='M23.748 7C25.1654 8.97024 26.0001 11.3876 26.0001 14C26.0001 16.3053 25.3501 18.4587 24.2233 20.2871'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
      />
      <path
        d='M18.8034 3C17.3326 2.35683 15.708 2 14 2C7.37258 2 2 7.37258 2 14C2 20.6274 7.37258 26 14 26C16.1094 26 18.0916 25.4557 19.814 24.5'
        stroke='currentColor'
        strokeOpacity='0.4'
        strokeWidth='3'
        strokeLinecap='round'
      />
    </svg>
  );
}
