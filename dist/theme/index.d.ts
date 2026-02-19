import { U as UITheme } from '../ThemeContext-Ct89S9yt.js';
export { C as ComponentTheme, T as ThemeProvider, a as ThemeRegistry, b as baseTheme, m as mergeTheme, u as useComponentTheme, c as useTheme, d as useThemeActions, e as useThemeKey, f as useThemeRegistry } from '../ThemeContext-Ct89S9yt.js';
import 'react/jsx-runtime';
import 'react';

declare const neonTheme: UITheme;
declare const spaceTheme: UITheme;
declare const retroTheme: UITheme;

/**
 * className 문자열을 theme.custom 맵으로 치환.
 * className="my-token" 이고 custom['my-token'] = 'bg-red-500' 이면 → 'bg-red-500' 적용.
 */
declare const resolveClassName: (className: string | undefined, customMap: Record<string, string> | undefined) => string;

export { UITheme, neonTheme, resolveClassName, retroTheme, spaceTheme };
