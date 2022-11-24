import { MantineNumberSize, useMantineTheme } from '@mantine/core';
import { ReactNode } from 'react';
import { MaterialColor } from '../theme/types';

export const sizes = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 26,
  xl: 34,
};

interface IconProps {
  size?: MantineNumberSize;
  color?: MaterialColor | string;
  children: ReactNode;
}

export function Icon({ size = 'md', color, children }: IconProps) {
  const theme = useMantineTheme();
  size = theme.fn.size({ size, sizes });
  color = color && color in theme.colors ? theme.fn.themeColor(color) : color;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      color={color}
    >
      {children}
    </svg>
  );
}
