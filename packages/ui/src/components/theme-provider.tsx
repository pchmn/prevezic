import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setMetaThemeColor: (color?: string) => void;
  resetMetaThemeColor: () => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  setMetaThemeColor: () => null,
  resetMetaThemeColor: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(
    'light',
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        setEffectiveTheme(newTheme);
        changeThemeColor({ theme: newTheme });
      };

      mediaQuery.addEventListener('change', handleChange);

      // Initial setup
      handleChange();

      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    root.classList.add(theme);
  }, [theme]);

  const setMetaThemeColor = useCallback(
    (color?: string) => changeThemeColor({ color }),
    [],
  );

  const resetMetaThemeColor = useCallback(
    () => changeThemeColor({ theme: effectiveTheme }),
    [effectiveTheme],
  );

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setMetaThemeColor,
    resetMetaThemeColor,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

const lightColor = '#dedede';
const darkColor = '#0d0614';

export const changeThemeColor = ({
  theme,
  color,
}: { theme?: 'light' | 'dark'; color?: string }) => {
  const newColor = color ? color : theme === 'light' ? lightColor : darkColor;

  let meta = document.querySelector(
    "meta[name='theme-color']",
  ) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.getElementsByTagName('head')[0]?.appendChild(meta);
  }
  meta.setAttribute('content', newColor);
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
