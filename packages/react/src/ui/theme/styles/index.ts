import { ButtonProps, InputProps, MantineTheme } from '@mantine/core';

import { MaterialColor, ThemeComponent } from '../types';
import { getOnColor } from '../utils';

export const componentsTheme: Record<string, ThemeComponent> = {
  Button: {
    styles: (theme, params: ButtonProps) => ({
      root: {
        color: params.variant === 'filled' ? getOnColor(params.color as MaterialColor, theme) : undefined,
        ':disabled': {
          color: theme.fn.darken(getOnColor(params.color as MaterialColor, theme), 0.6),
          '.mantine-Button-icon': {
            color: theme.fn.darken(getOnColor(params.color as MaterialColor, theme), 0.6),
            svg: {
              stroke: theme.fn.darken(getOnColor(params.color as MaterialColor, theme), 0.6),
            },
          },
        },
      },
      icon: {
        color: params.variant === 'filled' ? getOnColor(params.color as MaterialColor, theme) : undefined,
        '& svg': {
          stroke: params.variant === 'filled' ? getOnColor(params.color as MaterialColor, theme) : undefined,
        },
      },
    }),
  },
  Input: {
    styles: (theme, params: InputProps) => ({
      input: {
        backgroundColor:
          params.variant === 'default'
            ? theme.other.schemes[theme.colorScheme].surface1
            : params.variant === 'filled'
            ? theme.other.schemes[theme.colorScheme].surface2
            : undefined,
        color: theme.other.schemes[theme.colorScheme].onSurface,
        borderColor:
          params.variant === 'default'
            ? theme.colorScheme === 'dark'
              ? theme.colors.neutral[7]
              : theme.colors.neutral[2]
            : undefined,
        '::placeholder': {
          color: theme.colorScheme === 'dark' ? theme.colors.neutral[6] : theme.colors.neutral[3],
        },
      },
    }),
  },
  InputWrapper: {
    styles: {
      label: {
        marginBottom: 5,
      },
    },
  },
  Modal: {
    styles: (theme: MantineTheme) => ({
      modal: {
        backgroundColor: theme.other.schemes[theme.colorScheme].background,
      },
    }),
    defaultProps: {
      padding: 32,
    },
  },
  Drawer: {
    styles: (theme: MantineTheme) => ({
      drawer: {
        backgroundColor: theme.other.schemes[theme.colorScheme].background,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      },
    }),
    defaultProps: {
      padding: 32,
      size: -1,
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
        height: '100dvh',
        borderColor: theme.colorScheme === 'dark' ? theme.colors.neutral[8] : theme.colors.neutral[1],
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
