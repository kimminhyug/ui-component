import type { Meta, StoryObj } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { ThemeProvider } from '../../../theme/ThemeContext';
import { DataTable, type DataTableProps } from './index';

type Person = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
};

const sampleData: Person[] = [
  { id: 1, name: '김민혁', email: 'kimminhyug29@gmail.com', role: '개발자', status: 'active' },
  { id: 2, name: '이길동', email: 'lee@example.com', role: '디자이너', status: 'inactive' },
  { id: 3, name: '박길동', email: 'park@example.com', role: 'PM', status: 'active' },
  { id: 4, name: '최길동', email: 'choi@example.com', role: '개발자', status: 'active' },
  { id: 5, name: '정길동', email: 'jung@example.com', role: '디자이너', status: 'inactive' },
];

const columnHelper = createColumnHelper<Person>();
const columns = [
  columnHelper.accessor('name', { header: '이름', meta: { className: 'font-medium' } }),
  columnHelper.accessor('email', {
    header: '이메일',
    cell: (info) => (
      <a href={`mailto:${info.getValue()}`} className="text-blue-600 hover:underline">
        {info.getValue()}
      </a>
    ),
  }),
  columnHelper.accessor('role', { header: '역할' }),
  columnHelper.accessor('status', {
    header: '상태',
    cell: (info) => (
      <span
        className={
          info.getValue() === 'active'
            ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800'
            : 'rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600'
        }
      >
        {info.getValue()}
      </span>
    ),
  }),
];

type PersonTableProps = DataTableProps<Person>;

const meta = {
  title: 'Molecules/DataTable',
  component: DataTable as React.ComponentType<PersonTableProps>,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeProvider>
        <div className="w-[640px]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    data: { control: false },
    columns: { control: false },
  },
} satisfies Meta<PersonTableProps>;

export default meta;

type Story = StoryObj<PersonTableProps>;

export const Default: Story = {
  args: {
    data: sampleData,
    columns,
  },
  parameters: {
    docs: {
      description: {
        story: '기본 테이블. 이메일은 링크, 상태는 뱃지로 커스텀 렌더링.',
      },
      source: {
        code: '<DataTable data={data} columns={columns} />',
        language: 'tsx',
      },
    },
  },
};

export const CustomCells: Story = {
  args: {
    data: sampleData,
    columns: [
      columnHelper.accessor('name', { header: '이름' }),
      columnHelper.accessor('email', { header: '이메일' }),
      columnHelper.accessor('role', { header: '역할' }),
      columnHelper.accessor('status', {
        header: '상태',
        cell: (info) => (
          <span
            className={
              info.getValue() === 'active'
                ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800'
                : 'rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600'
            }
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: '액션',
        cell: ({ row }) => (
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 hover:bg-blue-200"
              onClick={() => console.log('수정', row.original)}
            >
              수정
            </button>
            <button
              type="button"
              className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200"
              onClick={() => console.log('삭제', row.original.id)}
            >
              삭제
            </button>
          </div>
        ),
      }),
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '커스텀 셀: columnDef.cell로 버튼, 아이콘, 링크, 뱃지 등을 자유롭게 렌더링할 수 있습니다.',
      },
    },
  },
};

export const Selectable: Story = {
  args: {
    data: sampleData,
    columns,
    selectable: true,
    onSelectionChange: (selection) => {
      console.log('Selection:', selection);
    },
  },
  parameters: {
    docs: {
      description: {
        story: '체크박스로 행 선택, 헤더 체크박스로 전체 선택.',
      },
    },
  },
};

export const Sortable: Story = {
  args: {
    data: sampleData,
    columns,
    sortable: true,
  },
  parameters: {
    docs: {
      description: {
        story: '컬럼 헤더 클릭 시 오름차순/내림차순 정렬. ⇅ 아이콘으로 정렬 가능 컬럼 표시.',
      },
    },
  },
};

export const WithPagination: Story = {
  args: {
    data: sampleData,
    columns,
    pagination: true,
    pageSize: 2,
  },
  parameters: {
    docs: {
      description: {
        story: '페이지네이션으로 많은 데이터를 구간별로 표시. 처음/이전/다음/마지막 버튼 제공.',
      },
    },
  },
};

export const RowHighlight: Story = {
  args: {
    data: sampleData,
    columns,
    getRowClassName: (row) =>
      row.original.status === 'inactive' ? 'bg-red-50 text-red-900' : undefined,
  },
  parameters: {
    docs: {
      description: {
        story: '특정 값(status === inactive)이면 행을 빨간색 계열로 강조합니다.',
      },
    },
  },
};

const scrollData = [...sampleData, ...sampleData.map((p, i) => ({ ...p, id: 10 + i }))];

export const Scroll: Story = {
  args: {
    data: scrollData,
    columns,
    scroll: { maxHeight: '200px' },
  },
  parameters: {
    docs: {
      description: {
        story: 'scroll.maxHeight로 테이블 영역만 스크롤. 많은 데이터를 고정 높이 안에서 처리.',
      },
    },
  },
};

export const AllFeatures: Story = {
  args: {
    data: sampleData,
    columns,
    selectable: true,
    sortable: true,
    pagination: true,
    pageSize: 2,
    getRowClassName: (row) => (row.original.status === 'inactive' ? 'bg-red-50' : undefined),
    onSelectionChange: (selection) => console.log('Selection:', selection),
  },
  parameters: {
    docs: {
      description: {
        story: '선택, 정렬, 페이지네이션, 조건부 행 스타일을 모두 사용한 예시입니다.',
      },
    },
  },
};
