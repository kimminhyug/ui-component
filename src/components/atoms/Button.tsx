import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { resolveClassName } from '../../theme/resolveClassName';
import { cn } from '../../utils/cn';
import type { Stylable, ThemedComponent } from '../../types/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>, Stylable, ThemedComponent {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const sizeMap = { sm: 'sizeSm', md: 'sizeMd', lg: 'sizeLg' } as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth,
      className,
      style,
      theme: themeOverride,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const globalTheme = useTheme();
    const theme = themeOverride ? { ...globalTheme.button, ...themeOverride } : globalTheme.button;
    const t = (theme ?? {}) as Record<string, string>;
    const resolvedClassName = resolveClassName(className, globalTheme.custom);

    const base = t.base ?? '';
    const variantClass = t[variant] ?? '';
    const sizeClass = t[sizeMap[size]] ?? '';

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(base, variantClass, sizeClass, fullWidth && 'w-full', resolvedClassName)}
        style={style}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
