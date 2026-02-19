import { Tab } from '@headlessui/react';
import { useTheme } from '../../theme/ThemeContext';
import { cn } from '../../utils/cn';
import type { Stylable, ThemedComponent } from '../../types/common';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  panel: React.ReactNode;
}

export interface TabsProps extends Stylable, ThemedComponent {
  items: TabItem[];
  selectedIndex?: number;
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export const Tabs = ({
  items,
  selectedIndex,
  defaultIndex = 0,
  onChange,
  className,
  style,
  theme: themeOverride,
}: TabsProps) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.tabs, ...themeOverride } : globalTheme.tabs;
  const t = (theme ?? {}) as Record<string, string>;

  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      defaultIndex={defaultIndex}
      onChange={onChange}
      className={className}
      style={style}
    >
      <Tab.List className={t.list}>
        {items.map((item) => (
          <Tab key={item.key} className={({ selected }) => cn(t.tab, selected && t.tabActive)}>
            {item.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className={t.panel}>
        {items.map((item) => (
          <Tab.Panel key={item.key}>{item.panel}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};
