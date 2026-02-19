import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Molecules/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: false },
    defaultChecked: { control: 'boolean' },
    onChange: { control: false },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: '동의합니다', defaultChecked: false },
  parameters: {
    docs: {
      source: {
        code: '<Checkbox label="동의합니다" defaultChecked={false} />',
        language: 'tsx',
      },
    },
  },
};

export const Checked: Story = {
  args: { label: '기본 체크', defaultChecked: true },
  parameters: {
    docs: {
      source: {
        code: '<Checkbox label="기본 체크" defaultChecked />',
        language: 'tsx',
      },
    },
  },
};

const ControlledCheckbox = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox label={`체크됨: ${checked}`} checked={checked} onChange={setChecked} />;
};

export const Controlled: Story = {
  render: () => <ControlledCheckbox />,
};

export const NoLabel: Story = {
  args: {},
  parameters: {
    docs: { source: { code: '<Checkbox />', language: 'tsx' } },
  },
};
