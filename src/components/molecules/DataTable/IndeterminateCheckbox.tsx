import { useEffect, useRef } from 'react';
import { Checkbox } from '../Checkbox';

export interface IndeterminateCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export const IndeterminateCheckbox = ({
  checked,
  indeterminate,
  onChange,
  disabled,
  'aria-label': ariaLabel,
}: IndeterminateCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  return (
    <Checkbox
      ref={ref}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
};
