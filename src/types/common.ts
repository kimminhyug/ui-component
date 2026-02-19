import type { ComponentTheme } from '../theme/theme.types';

export type ControlledProps<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

export interface Stylable {
  className?: string;
  style?: React.CSSProperties;
}

export interface ThemedComponent {
  theme?: ComponentTheme | null;
}
