import { Tuple } from '@mantine/core';
import { MaterialColors, MaterialScheme } from './src/ui/theme/types';

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<MaterialColors, Tuple<string, 10>>;
  }
  export interface MantineThemeOther {
    schemes: {
      light: MaterialScheme;
      dark: MaterialScheme;
    };
  }
}
