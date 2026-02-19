import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: 'Button', variant: 'primary' },
  parameters: {
    docs: { source: { code: '<Button variant="primary">Button</Button>', language: 'tsx' } },
  },
};

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
  parameters: {
    docs: { source: { code: '<Button variant="secondary">Secondary</Button>', language: 'tsx' } },
  },
};

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline' },
  parameters: {
    docs: { source: { code: '<Button variant="outline">Outline</Button>', language: 'tsx' } },
  },
};

export const Ghost: Story = {
  args: { children: 'Ghost', variant: 'ghost' },
  parameters: {
    docs: { source: { code: '<Button variant="ghost">Ghost</Button>', language: 'tsx' } },
  },
};

export const Danger: Story = {
  args: { children: 'Delete', variant: 'danger' },
  parameters: {
    docs: { source: { code: '<Button variant="danger">Delete</Button>', language: 'tsx' } },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
  parameters: {
    docs: { source: { code: '<Button disabled>Disabled</Button>', language: 'tsx' } },
  },
};

export const FullWidth: Story = {
  args: { children: 'Full Width', fullWidth: true },
  parameters: {
    docs: { source: { code: '<Button fullWidth>Full Width</Button>', language: 'tsx' } },
  },
};

export const ThemeOverride: Story = {
  args: {
    children: 'Custom Theme',
    variant: 'primary',
    theme: { primary: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500' },
  },
  parameters: {
    docs: {
      source: {
        code:
          '<Button variant="primary" theme={{ primary: "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500" }}>Custom Theme</Button>',
        language: 'tsx',
      },
    },
  },
};
