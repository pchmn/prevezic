import { ColorScheme, MantineProvider } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { PropsWithChildren } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { ThemePreferencesProvider } from '../theme';
import { componentsTheme } from '../theme/styles';
import { generateThemeFromColor } from '../theme/utils';

export function UiProvider({ children }: PropsWithChildren) {
  const preferredColorScheme =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'theme-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const [baseColor, setBaseColor] = useLocalStorage<string>({
    key: 'theme-base-color',
    defaultValue: '#E7DEFF',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const theme = generateThemeFromColor(baseColor);

  return (
    <HelmetProvider>
      <ThemePreferencesProvider
        baseColor={baseColor}
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
        changeBaseColor={setBaseColor}
      >
        <Helmet>
          <link rel="mask-icon" href="/mask-icon.svg" color={theme.schemes[colorScheme].background} />
          <meta name="theme-color" content={theme.schemes[colorScheme].background} />
        </Helmet>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: colorScheme,
            colors: theme.colors,
            primaryColor: 'primary',
            primaryShade: { light: 6, dark: 2 },
            other: { schemes: theme.schemes },
            defaultRadius: 'md',
            components: componentsTheme,
            fontFamily: 'Readex Pro, sans-serif',
            headings: {
              fontFamily: 'Readex Pro, sans-serif',
            },
            spacing: {
              xs: 4,
              sm: 8,
              md: 16,
              lg: 24,
              xl: 32,
            },
            globalStyles: (theme) => ({
              body: {
                backgroundColor: theme.other.schemes[theme.colorScheme].background,
                color: theme.other.schemes[theme.colorScheme].onBackground,
                WebkitFontSmoothing: 'antialiased',
              },
            }),
          }}
        >
          {children}
        </MantineProvider>
      </ThemePreferencesProvider>
    </HelmetProvider>
  );
}
