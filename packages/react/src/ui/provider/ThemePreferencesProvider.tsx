import { ColorScheme } from '@mantine/core';
import { createContext, useContext } from 'react';

interface ThemePreferencesProviderProps {
  colorScheme: ColorScheme;
  primaryColor: string;
  toggleColorScheme(colorScheme?: ColorScheme): void;
  changePrimaryColor(color: string): void;
}

const ThemeProviderContext = createContext<ThemePreferencesProviderProps>({} as ThemePreferencesProviderProps);

export function useThemePreferences() {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) {
    throw new Error('useThemePreferences must be used inside ThemePreferencesProvider');
  }
  return ctx;
}

export function ThemePreferencesProvider({
  children,
  ...props
}: React.PropsWithChildren<ThemePreferencesProviderProps>) {
  return <ThemeProviderContext.Provider value={props}>{children}</ThemeProviderContext.Provider>;
}
