import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type ComponentTheme = Record<string, string>;
interface UITheme {
    button?: ComponentTheme;
    input?: ComponentTheme;
    badge?: ComponentTheme;
    modal?: ComponentTheme;
    dropdown?: ComponentTheme;
    tabs?: ComponentTheme;
    checkbox?: ComponentTheme;
    table?: ComponentTheme;
    /** className → Tailwind 클래스 매핑. className="키" 시 해당 값이 적용됨 */
    custom?: ComponentTheme;
    [key: string]: ComponentTheme | undefined;
}

declare const baseTheme: UITheme;

declare const mergeTheme: (base: UITheme, override?: UITheme | null) => UITheme;

type ThemeRegistry = Record<string, UITheme>;
type ThemeContextValue = {
    theme: UITheme;
    themeKey: string;
    themes: ThemeRegistry;
    setThemeKey: (key: string) => void;
    updateTheme: (key: string, value: UITheme | ((prev: UITheme) => UITheme)) => void;
};
interface ThemeProviderProps {
    themes?: ThemeRegistry;
    defaultThemeKey?: string;
    children?: ReactNode;
}
declare const ThemeProvider: ({ themes: themesProp, defaultThemeKey, children, }: ThemeProviderProps) => react_jsx_runtime.JSX.Element;
declare const useTheme: () => UITheme;
declare const useThemeKey: () => string;
declare const useThemeActions: () => {
    setThemeKey: (key: string) => void;
    updateTheme: (key: string, value: UITheme | ((prev: UITheme) => UITheme)) => void;
};
declare const useThemeRegistry: () => ThemeContextValue;
declare const useComponentTheme: (componentKey: keyof UITheme, variantKeys?: string[]) => string;

export { type ComponentTheme as C, ThemeProvider as T, type UITheme as U, type ThemeRegistry as a, baseTheme as b, useTheme as c, useThemeActions as d, useThemeKey as e, useThemeRegistry as f, mergeTheme as m, useComponentTheme as u };
