import { ColorScheme, MantineProvider } from '@mantine/core';
import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks';
import { PropsWithChildren } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemePreferencesProvider } from '../theme';
import { componentsTheme } from '../theme/styles';
import { generateThemeFromColor } from '../theme/utils';

export function UiProvider({ children }: PropsWithChildren) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'theme-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true
  });

  const [baseColor, setBaseColor] = useLocalStorage<string>({
    key: 'theme-base-color',
    defaultValue: '#E6DEFF',
    getInitialValueInEffect: true
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
            globalStyles: (theme) => ({
              body: {
                backgroundColor: theme.other.schemes[theme.colorScheme].background,
                color: theme.other.schemes[theme.colorScheme].onBackground,
                WebkitFontSmoothing: 'antialiased'
              }
            })
          }}
        >
          {children}
        </MantineProvider>
      </ThemePreferencesProvider>
    </HelmetProvider>
  );
}
