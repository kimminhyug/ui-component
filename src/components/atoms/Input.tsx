import { forwardRef, type InputHTMLAttributes } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { resolveClassName } from '../../theme/resolveClassName';
import { cn } from '../../utils/cn';
import type { Stylable, ThemedComponent } from '../../types/common';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>, Stylable, ThemedComponent {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, style, theme: themeOverride, error, ...rest }, ref) => {
    const globalTheme = useTheme();
    const theme = themeOverride ? { ...globalTheme.input, ...themeOverride } : globalTheme.input;
    const t = (theme ?? {}) as Record<string, string>;
    const resolvedClassName = resolveClassName(className, globalTheme.custom);

    const base = t.base ?? '';
    const errorClass = error ? (t.error ?? '') : '';

    return (
      <input ref={ref} className={cn(base, errorClass, resolvedClassName)} style={style} {...rest} />
    );
  }
);

Input.displayName = 'Input';
