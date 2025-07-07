import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '../lib/utils';
import { Label } from './label';

export const inputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-primary/6 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring/60 focus-within:border-ring/50 focus-visible:bg-primary/10 focus-within:bg-primary/10 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      size: {
        default: 'h-9 px-3 py-1',
        sm: 'h-7 rounded-md px-2 text-xs',
        lg: 'h-11 rounded-md px-4',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string | React.ReactNode;
  error?: string;
  rightSection?: React.ReactNode;
  leftSection?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

function Input({
  className,
  type,
  label,
  id,
  error,
  leftSection,
  rightSection,
  size,
  clearable,
  onClear,
  readOnly,
  ref,
  ...props
}: InputProps) {
  return (
    <div className={cn('grid', label ? className : undefined)}>
      {label && (
        <Label htmlFor={id} className='mb-2'>
          {label}
        </Label>
      )}
      <div className='relative'>
        {leftSection && (
          <div className='text-muted-foreground absolute inset-y-0 left-0 flex items-center justify-center pl-3'>
            {leftSection}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ size, className: label ? undefined : className }),
            error
              ? 'border-destructive hover:border-destructive bg-destructive/10 focus-visible:bg-destructive/10'
              : undefined,
            leftSection ? 'pl-10' : undefined,
            readOnly
              ? 'opacity-50 focus-visible:border-input focus-visible:bg-accent/20'
              : undefined,
          )}
          ref={ref}
          id={id}
          readOnly={readOnly}
          {...props}
        />
        {rightSection && (
          <div className='absolute inset-y-0 right-0 flex items-center justify-center pr-3'>
            {rightSection}
          </div>
        )}
        {clearable && (
          <div className='absolute inset-y-0 right-0 flex items-center justify-center pr-3'>
            <ClearIcon onClick={onClear} />
          </div>
        )}
      </div>

      {error && (
        <span className='text-destructive mt-2 text-[0.8rem] font-medium'>
          {error}
        </span>
      )}
    </div>
  );
}

const ClearIcon = ({
  className,
  ...props
}: React.HTMLAttributes<SVGElement>) => {
  return (
    <svg
      role='graphics-symbol'
      viewBox='0 0 16 16'
      className={cn(
        'h-4 w-4 cursor-pointer fill-black/40 dark:fill-white/40',
        className,
      )}
      {...props}
    >
      <path d='M7.993 15.528a7.273 7.273 0 01-2.923-.593A7.633 7.633 0 012.653 13.3a7.797 7.797 0 01-1.633-2.417 7.273 7.273 0 01-.593-2.922c0-1.035.198-2.01.593-2.922A7.758 7.758 0 015.063.99 7.273 7.273 0 017.985.395a7.29 7.29 0 012.93.593 7.733 7.733 0 012.417 1.64 7.647 7.647 0 011.64 2.41c.396.914.594 1.888.594 2.923 0 1.035-.198 2.01-.593 2.922a7.735 7.735 0 01-4.058 4.05 7.272 7.272 0 01-2.922.594zM5.59 11.06c.2 0 .371-.066.513-.198L8 8.951l1.904 1.911a.675.675 0 00.498.198.667.667 0 00.491-.198.67.67 0 00.205-.49.64.64 0 00-.205-.491L8.981 7.969l1.92-1.911a.686.686 0 00.204-.491.646.646 0 00-.205-.484.646.646 0 00-.483-.205.67.67 0 00-.49.205L8 6.995 6.081 5.083a.696.696 0 00-.49-.19.682.682 0 00-.491.198.651.651 0 00-.198.49c0 .181.068.342.205.484l1.912 1.904-1.912 1.92a.646.646 0 00-.205.483c0 .19.066.354.198.49.136.132.3.198.49.198z' />
    </svg>
  );
};

/** 
<input
type={type}
data-slot='input'
className={cn(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border dark:bg-primary/7.5 bg-primary/6 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  'focus-visible:border-ring/60 dark:focus-visible:bg-primary/13 focus-visible:bg-primary/12',
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  className,
)}
{...props}
/>
*/

export { Input };
