import { Fragment, type ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTheme } from '../../theme/ThemeContext';
import { cn } from '../../utils/cn';
import type { Stylable, ThemedComponent } from '../../types/common';

export interface DropdownItem {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface DropdownProps extends Stylable, ThemedComponent {
  trigger: ReactNode;
  items: DropdownItem[];
  selectedKey?: string | null;
}

export const Dropdown = ({
  trigger,
  items,
  selectedKey,
  className,
  style,
  theme: themeOverride,
}: DropdownProps) => {
  const globalTheme = useTheme();
  const theme = themeOverride
    ? { ...globalTheme.dropdown, ...themeOverride }
    : globalTheme.dropdown;
  const t = (theme ?? {}) as Record<string, string>;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={cn(t.button, className)} style={style}>
        {trigger}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={cn(t.menu, 'py-1')}>
          {items.map((item) => (
            <Menu.Item key={item.key} disabled={item.disabled}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={cn(t.item, (active || item.key === selectedKey) && t.itemActive)}
                >
                  {item.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
