import { MantineProvider } from '@mantine/core';
import { PropsWithChildren } from 'react';

export function UiProvider({ children }: PropsWithChildren) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        globalStyles: (theme) => ({
          body: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.orange[0],
            WebkitFontSmoothing: 'antialiased'
          }
        })
      }}
    >
      {children}
    </MantineProvider>
  );
}
