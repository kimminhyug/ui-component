import { type HTMLAttributes } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { resolveClassName } from '../../theme/resolveClassName';
import type { Stylable, ThemedComponent } from '../../types/common';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'>, Stylable, ThemedComponent {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge = ({
  variant = 'default',
  className,
  style,
  theme: themeOverride,
  children,
  ...rest
}: BadgeProps) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.badge, ...themeOverride } : globalTheme.badge;
  const t = (theme ?? {}) as Record<string, string>;
  const resolvedClassName = resolveClassName(className, globalTheme.custom);

  const base = t.base ?? '';
  const variantClass = t[variant] ?? '';

  return (
    <span className={cn(base, variantClass, resolvedClassName)} style={style} {...rest}>
      {children}
    </span>
  );
};
