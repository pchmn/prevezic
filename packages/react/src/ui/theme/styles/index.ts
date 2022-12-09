import { ButtonStylesParams, MantineTheme } from '@mantine/core';

import { MaterialColor, ThemeComponent } from '../types';
import { getOnColor } from '../utils';

export const componentsTheme: Record<string, ThemeComponent> = {
  Button: {
    styles: (theme, params: ButtonStylesParams) => ({
      root: {
        color: params.variant === 'filled' ? getOnColor(params.color as MaterialColor, theme) : undefined,
      },
      icon: {
        color: params.variant === 'filled' ? getOnColor(params.color as MaterialColor, theme) : undefined,
        '& svg': {
          stroke: params.variant === 'filled' ? getOnColor(params.color as MaterialColor, theme) : undefined,
        },
      },
    }),
  },
  Modal: {
    styles: (theme: MantineTheme) => ({
      modal: {
        backgroundColor: theme.other.schemes[theme.colorScheme].background,
      },
    }),
    defaultProps: {
      padding: 30,
    },
  },
  SegmentedControl: {
    styles: (theme: MantineTheme) => ({
      root: {
        backgroundColor: theme.fn.darken(
          theme.other.schemes[theme.colorScheme].background,
          theme.colorScheme === 'dark' ? 0.3 : 0.05
        ),
      },
      active: {
        backgroundColor: theme.other.schemes[theme.colorScheme][theme.colorScheme === 'dark' ? 'surface4' : 'surface'],
      },
      label: {
        '&:hover': {
          color: `${theme.other.schemes[theme.colorScheme].onSurface}`,
        },
      },
      labelActive: {
        color: `${theme.other.schemes[theme.colorScheme].onSurface} !important`,
      },
    }),
  },
  Paper: {
    styles: (theme: MantineTheme) => ({
      root: {
        backgroundColor: theme.other.schemes[theme.colorScheme].surface1,
      },
    }),
  },
  Navbar: {
    styles: (theme: MantineTheme) => ({
      root: {
        backgroundColor: theme.fn.rgba(theme.other.schemes[theme.colorScheme].primary, 0.025),
      },
    }),
  },
  Header: {
    styles: (theme: MantineTheme) => ({
      root: {
        backgroundColor: theme.fn.rgba(theme.other.schemes[theme.colorScheme].primary, 0.025),
      },
    }),
  },
  AppShell: {
    styles: (theme: MantineTheme) => ({
      main: {
        backgroundColor: theme.other.schemes[theme.colorScheme].background,
        color: theme.other.schemes[theme.colorScheme].onBackground,
      },
    }),
  },
};
