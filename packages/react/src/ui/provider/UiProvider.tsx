import { MantineProvider } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { generateThemeFromColor } from '../theme';

export function UiProvider({ children }: PropsWithChildren) {
  const theme = generateThemeFromColor('#E6DEFF');
  console.log('theme', JSON.stringify(theme, null, 2));

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        colors: theme.colors,
        other: { schemes: theme.schemes },
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
  );
}
