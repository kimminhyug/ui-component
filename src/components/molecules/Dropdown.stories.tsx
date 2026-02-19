import type { Meta, StoryObj } from '@storybook/react';
import type { DropdownItem } from './Dropdown';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Molecules/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: false },
    items: { control: false },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

const sampleItems: DropdownItem[] = [
  { key: 'edit', label: '수정', onClick: () => {} },
  { key: 'duplicate', label: '복제', onClick: () => {} },
  { key: 'archive', label: '보관', onClick: () => {} },
  { key: 'delete', label: '삭제', onClick: () => {}, disabled: true },
];

export const Default: Story = {
  args: {
    trigger: '메뉴 열기',
    items: sampleItems,
  },
  parameters: {
    docs: {
      source: {
        code: '<Dropdown trigger="메뉴 열기" items={items} />',
        language: 'tsx',
      },
    },
  },
};

export const WithSelected: Story = {
  args: {
    trigger: '선택: 수정',
    items: sampleItems,
    selectedKey: 'edit',
  },
  parameters: {
    docs: {
      source: {
        code: '<Dropdown trigger="선택: 수정" items={items} selectedKey="edit" />',
        language: 'tsx',
      },
    },
  },
};

export const CustomTrigger: Story = {
  args: {
    trigger: <span className="font-medium">⋮ 더보기</span>,
    items: sampleItems,
  },
  parameters: {
    docs: {
      source: {
        code: '<Dropdown trigger={<span>⋮ 더보기</span>} items={items} />',
        language: 'tsx',
      },
    },
  },
};
