import { CSSObject, MantineTheme } from '@mantine/core';

export type MaterialColors = 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral' | 'neutralVariant';

export type MaterialScheme = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  surface1: string;
  surface2: string;
  surface3: string;
  surface4: string;
  surface5: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  shadow: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
};

export type ThemeComponent = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultProps?: Record<string, any>;
  classNames?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles?: Record<string, CSSObject> | ((theme: MantineTheme, params: any) => Record<string, CSSObject>);
};
