import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { ThemeProvider } from '../../../theme/ThemeContext';
import { EditableTable, type EditableTableProps } from './index';

type Task = {
  id: number;
  title: string;
  score: number;
  due: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
};

const sampleData: Task[] = [
  { id: 1, title: '요구사항 정리', score: 80, due: '2025-02-20', done: false, priority: 'high' },
  { id: 2, title: 'API 설계', score: 0, due: '2025-02-25', done: false, priority: 'medium' },
  { id: 3, title: 'UI 컴포넌트 구현', score: 100, due: '2025-02-19', done: true, priority: 'high' },
];

const columnHelper = createColumnHelper<Task>();
const priorityOptions = [
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
];

const columns = [
  columnHelper.accessor('title', {
    header: '제목',
    meta: { editType: 'text' as const },
  }),
  columnHelper.accessor('score', {
    header: '점수',
    meta: { editType: 'number' as const },
  }),
  columnHelper.accessor('due', {
    header: '마감일',
    meta: { editType: 'date' as const },
  }),
  columnHelper.accessor('done', {
    header: '완료',
    meta: { editType: 'checkbox' as const },
  }),
  columnHelper.accessor('priority', {
    header: '우선순위',
    meta: { editType: 'dropdown' as const, editOptions: priorityOptions },
  }),
];

type TaskTableProps = EditableTableProps<Task>;

const meta = {
  title: 'Molecules/EditableTable',
  component: EditableTable as React.ComponentType<TaskTableProps>,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeProvider>
        <div className="w-[720px]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    data: { control: false },
    columns: { control: false },
  },
} satisfies Meta<TaskTableProps>;

export default meta;

type Story = StoryObj<TaskTableProps>;

export const Default: Story = {
  args: {
    data: sampleData,
    columns,
  },
  parameters: {
    docs: {
      description: {
        story:
          '컬럼별 editType(text, number, date, checkbox, dropdown)에 따라 셀이 수정 컴포넌트로 렌더링 react-hook-form으로 상태 제어.',
      },
    },
  },
};

export const WithSubmit: Story = {
  args: {
    data: sampleData,
    columns,
    submitLabel: '저장',
    onSubmit: (data) => {
      console.log('제출된 데이터:', data);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'onSubmit을 넘기면 폼 제출 시 편집된 rows를 콜백으로 받을 수 있습니다. (실제 제출 버튼은 예제에서 생략)',
      },
    },
  },
};
