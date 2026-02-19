import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { TabItem } from './Tabs';
import { Tabs } from './Tabs';

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: false },
    selectedIndex: { control: false },
    defaultIndex: { control: 'number' },
    onChange: { control: false },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

const tabItems: TabItem[] = [
  { key: 'tab1', label: '탭 1', panel: <p className="text-sm">탭 1 패널 내용입니다.</p> },
  { key: 'tab2', label: '탭 2', panel: <p className="text-sm">탭 2 패널 내용입니다.</p> },
  { key: 'tab3', label: '탭 3', panel: <p className="text-sm">탭 3 패널 내용입니다.</p> },
];

export const Uncontrolled: Story = {
  args: {
    items: tabItems,
    defaultIndex: 0,
  },
  parameters: {
    docs: {
      source: {
        code: '<Tabs items={tabItems} defaultIndex={0} />',
        language: 'tsx',
      },
    },
  },
};

const ControlledTabs = () => {
  const [idx, setIdx] = useState(0);
  return <Tabs items={tabItems} selectedIndex={idx} onChange={setIdx} />;
};

export const Controlled: Story = {
  render: () => <ControlledTabs />,
};
