import type React from 'react';
import { cn } from '../lib/utils';

const flexStyles = {
  directions: {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  },
  justify: {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
    normal: 'justify-normal',
  },
  align: {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  },
  gap: {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-6',
    xl: 'gap-8',
    '0': 'gap-0',
    '1': 'gap-1',
    '2': 'gap-2',
    '3': 'gap-3',
    '4': 'gap-4',
    '5': 'gap-5',
    '6': 'gap-6',
    '7': 'gap-7',
    '8': 'gap-8',
    '9': 'gap-9',
    '10': 'gap-10',
    '11': 'gap-11',
    '12': 'gap-12',
  },
  flex: {
    '1': 'flex-1',
    auto: 'flex-auto',
    initial: 'flex-initial',
    none: 'flex-none',
  },
  wrap: {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  },
};

type Direction = keyof typeof flexStyles.directions;
type Wrap = keyof typeof flexStyles.wrap;
type Justify = keyof typeof flexStyles.justify;
type Align = keyof typeof flexStyles.align;
type Gap = keyof typeof flexStyles.gap;
type Flex = keyof typeof flexStyles.flex;

export interface FlexProps extends React.ComponentProps<'div'> {
  inline?: boolean;
  direction?: Direction; // Use the strict type instead of keyof typeof
  wrap?: Wrap;
  justify?: Justify;
  align?: Align;
  gap?: Gap;
  flex?: Flex;
}

export function Flex({
  className,
  inline = false,
  direction,
  wrap,
  justify,
  align,
  gap,
  flex,
  ...props
}: FlexProps) {
  const styles = {
    direction: direction ? flexStyles.directions[direction] : undefined,
    wrap: wrap ? flexStyles.wrap[wrap] : undefined,
    justify: justify ? flexStyles.justify[justify] : undefined,
    align: align ? flexStyles.align[align] : undefined,
    gap: gap ? flexStyles.gap[gap] : undefined,
    flex: flex ? flexStyles.flex[flex] : undefined,
  };

  return (
    <div
      data-slot='flex'
      className={cn(
        inline ? 'inline-flex' : 'flex',
        styles.direction,
        styles.wrap,
        styles.justify,
        styles.align,
        styles.gap,
        styles.flex,
        className,
      )}
      {...props}
    />
  );
}

Flex.displayName = 'Flex';
