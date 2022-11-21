import '@emotion/react';
import { MantineTheme, Tuple } from '@mantine/core';
import { MaterialColor, MaterialScheme } from './src/ui/theme/types';

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<MaterialColor, Tuple<string, 10>>;
  }
  export interface MantineThemeOther {
    schemes: {
      light: MaterialScheme;
      dark: MaterialScheme;
    };
  }
}

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends MantineTheme {}
}
