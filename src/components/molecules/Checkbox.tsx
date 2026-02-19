import { forwardRef } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { cn } from '../../utils/cn';
import type { Stylable, ThemedComponent } from '../../types/common';

export interface CheckboxProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'type' | 'onChange' | 'checked' | 'defaultChecked'
    >,
    Stylable,
    ThemedComponent {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { checked, defaultChecked, onChange, label, className, style, theme: themeOverride, ...rest },
    ref
  ) => {
    const globalTheme = useTheme();
    const theme = themeOverride
      ? { ...globalTheme.checkbox, ...themeOverride }
      : globalTheme.checkbox;
    const t = (theme ?? {}) as Record<string, string>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    return (
      <label className="inline-flex items-center" style={style}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          className={cn(t.base, className)}
          {...rest}
        />
        {label != null && <span className={t.label}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
