import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { mergeTheme } from './merge-theme';
import { baseTheme } from './base-theme';
import type { UITheme } from './theme.types';

export type ThemeRegistry = Record<string, UITheme>;

type ThemeContextValue = {
  theme: UITheme;
  themeKey: string;
  themes: ThemeRegistry;
  setThemeKey: (key: string) => void;
  updateTheme: (
    key: string,
    value: UITheme | ((prev: UITheme) => UITheme)
  ) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const defaultThemes: ThemeRegistry = { default: {} };

export interface ThemeProviderProps {
  themes?: ThemeRegistry;
  defaultThemeKey?: string;
  children: ReactNode;
}

export const ThemeProvider = ({
  themes: themesProp,
  defaultThemeKey = 'default',
  children,
}: ThemeProviderProps) => {
  const [themes, setThemes] = useState<ThemeRegistry>(
    () => themesProp ?? defaultThemes
  );
  const [themeKey, setThemeKeyState] = useState(defaultThemeKey);

  const setThemeKey = useCallback((key: string) => {
    setThemeKeyState(key);
  }, []);

  const updateTheme = useCallback(
    (key: string, value: UITheme | ((prev: UITheme) => UITheme)) => {
      setThemes((prev) => {
        const next = { ...prev };
        const prevTheme = next[key] ?? {};
        next[key] =
          typeof value === 'function' ? value(prevTheme) : value;
        return next;
      });
    },
    []
  );

  const theme = useMemo(
    () => mergeTheme(baseTheme, themes[themeKey] ?? {}),
    [themes, themeKey]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeKey,
      themes,
      setThemeKey,
      updateTheme,
    }),
    [theme, themeKey, themes, setThemeKey, updateTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): UITheme => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return baseTheme;
  return ctx.theme;
};

export const useThemeKey = (): string => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return 'default';
  return ctx.themeKey;
};

export const useThemeActions = (): {
  setThemeKey: (key: string) => void;
  updateTheme: (
    key: string,
    value: UITheme | ((prev: UITheme) => UITheme)
  ) => void;
} => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    return {
      setThemeKey: () => {},
      updateTheme: () => {},
    };
  return { setThemeKey: ctx.setThemeKey, updateTheme: ctx.updateTheme };
};

export const useThemeRegistry = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    return {
      theme: baseTheme,
      themeKey: 'default',
      themes: defaultThemes,
      setThemeKey: () => {},
      updateTheme: () => {},
    };
  return ctx;
};

export const useComponentTheme = (
  componentKey: keyof UITheme,
  variantKeys: string[] = []
): string => {
  const theme = useTheme();
  const componentTheme = theme[componentKey];
  if (!componentTheme || typeof componentTheme !== 'object') return '';

  const base = (componentTheme as Record<string, string>).base ?? '';
  const variants = variantKeys
    .map((k) => (componentTheme as Record<string, string>)[k])
    .filter(Boolean)
    .join(' ');
  return [base, variants].filter(Boolean).join(' ');
};
