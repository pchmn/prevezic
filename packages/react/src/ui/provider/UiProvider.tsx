import { ColorScheme, MantineProvider } from '@mantine/core';
import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks';
import { PropsWithChildren } from 'react';
import { generateThemeFromColor } from '../theme';
import { componentsTheme } from '../theme/components';
import { ThemePreferencesProvider } from './ThemePreferencesProvider';

export function UiProvider({ children }: PropsWithChildren) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'theme-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true
  });

  const [primaryColor, setPrimaryColor] = useLocalStorage<string>({
    key: 'theme-primary-color',
    defaultValue: '#E6DEFF',
    getInitialValueInEffect: true
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const theme = generateThemeFromColor(primaryColor);
  // console.log('theme', JSON.stringify(theme, null, 2));

  return (
    <ThemePreferencesProvider
      primaryColor={primaryColor}
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
      changePrimaryColor={setPrimaryColor}
    >
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
  );
}
