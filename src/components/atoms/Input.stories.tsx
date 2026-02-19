import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Placeholder...' },
  parameters: {
    docs: { source: { code: '<Input placeholder="Placeholder..." />', language: 'tsx' } },
  },
};

export const Error: Story = {
  args: { placeholder: 'Invalid value', error: true },
  parameters: {
    docs: { source: { code: '<Input placeholder="Invalid value" error />', language: 'tsx' } },
  },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
  parameters: {
    docs: { source: { code: '<Input placeholder="Disabled" disabled />', language: 'tsx' } },
  },
};

export const Types: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Input placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
    </div>
  ),
};
