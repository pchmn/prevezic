import {
  argbFromHex,
  hexFromArgb,
  Scheme,
  themeFromSourceColor,
  TonalPalette,
} from '@importantimport/material-color-utilities';
import { MantineTheme, Tuple } from '@mantine/core';

import { MaterialColor, MaterialScheme } from './types';

export function generateThemeFromColor(color: string) {
  const theme = themeFromSourceColor(argbFromHex(color));
  return {
    colors: {
      primary: generatePaletteFrom(theme.palettes.primary),
      secondary: generatePaletteFrom(theme.palettes.secondary),
      tertiary: generatePaletteFrom(theme.palettes.tertiary),
      error: generatePaletteFrom(theme.palettes.error),
      neutral: generatePaletteFrom(theme.palettes.neutral),
      neutralVariant: generatePaletteFrom(theme.palettes.neutralVariant),
    },
    schemes: {
      light: generateSchemeFrom(theme.schemes.light),
      dark: generateSchemeFrom(theme.schemes.dark),
    },
  };
}

function generatePaletteFrom(tonalPalette: TonalPalette) {
  return [
    hexFromArgb(tonalPalette.tone(95)),
    hexFromArgb(tonalPalette.tone(90)),
    hexFromArgb(tonalPalette.tone(80)),
    hexFromArgb(tonalPalette.tone(70)),
    hexFromArgb(tonalPalette.tone(60)),
    hexFromArgb(tonalPalette.tone(50)),
    hexFromArgb(tonalPalette.tone(40)),
    hexFromArgb(tonalPalette.tone(30)),
    hexFromArgb(tonalPalette.tone(20)),
    hexFromArgb(tonalPalette.tone(10)),
  ] as Tuple<string, 10>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getErrorPalette() {
  return [
    '#FFEDEA',
    '#FFDAD6',
    '#FFB4AB',
    '#FF897D',
    '#FF5449',
    '#DE3730',
    '#BA1A1A',
    '#93000A',
    '#690005',
    '#410002',
  ] as Tuple<string, 10>;
}

function generateSchemeFrom(scheme: Scheme) {
  const materialScheme: Partial<MaterialScheme> = {};
  const jsonScheme = scheme.toJSON();
  type schemeKeys = Exclude<keyof MaterialScheme, 'surface1' | 'surface2' | 'surface3' | 'surface4' | 'surface5'>;

  for (const key in jsonScheme) {
    materialScheme[key as schemeKeys] = hexFromArgb(jsonScheme[key as schemeKeys]);
  }

  if (materialScheme.primary) {
    materialScheme.surface1 = setOpacity(materialScheme.primary, 0.05);
    materialScheme.surface2 = setOpacity(materialScheme.primary, 0.08);
    materialScheme.surface3 = setOpacity(materialScheme.primary, 0.11);
    materialScheme.surface4 = setOpacity(materialScheme.primary, 0.12);
    materialScheme.surface5 = setOpacity(materialScheme.primary, 0.14);
  }

  return materialScheme as MaterialScheme;
}

function setOpacity(hex: string, alpha: number) {
  return `${hex}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;
}

export function getColor(color: MaterialColor = 'primary', theme: MantineTheme): string {
  return theme.other.schemes[theme.colorScheme][color as keyof MaterialScheme];
}

export function getOnColor(color: MaterialColor = 'primary', theme: MantineTheme): string {
  return theme.other.schemes[theme.colorScheme][
    `on${color.charAt(0).toUpperCase()}${color.slice(1)}` as keyof MaterialScheme
  ];
}
