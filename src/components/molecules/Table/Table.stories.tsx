import type { Meta, StoryObj } from '@storybook/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type React from 'react';
import { ThemeProvider } from '../../../theme/ThemeContext';
import { Table, TableBody, TableHead } from './index';

type Person = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const sampleData: Person[] = [
  { id: 1, name: '김민혁', email: 'kimminhyug29@gmail.com', role: '개발자' },
  { id: 2, name: '이영희', email: 'lee@example.com', role: '디자이너' },
  { id: 3, name: '박민수', email: 'park@example.com', role: 'PM' },
];

const columnHelper = createColumnHelper<Person>();
const columns = [
  columnHelper.accessor('name', { header: '이름', meta: { className: 'font-medium' } }),
  columnHelper.accessor('email', { header: '이메일' }),
  columnHelper.accessor('role', { header: '역할' }),
];

const DefaultTable = () => {
  const table = useReactTable({
    data: sampleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table table={table}>
      <TableHead />
      <TableBody />
    </Table>
  );
};

const CustomCellTable = () => {
  const table = useReactTable({
    data: sampleData,
    columns: [
      columnHelper.accessor('name', { header: '이름' }),
      columnHelper.accessor('email', {
        header: '이메일',
        cell: (info) => (
          <a href={`mailto:${info.getValue()}`} className="text-blue-600 hover:underline">
            {info.getValue()}
          </a>
        ),
      }),
      columnHelper.accessor('role', {
        header: '역할',
        cell: (info) => (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{info.getValue()}</span>
        ),
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table table={table}>
      <TableHead />
      <TableBody />
    </Table>
  );
};

const CustomBodyTable = () => {
  const table = useReactTable({
    data: sampleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table table={table}>
      <TableHead />
      <TableBody
        renderRow={(row) => (
          <tr key={row.id} className="hover:bg-amber-50">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-4 py-3">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        )}
      />
    </Table>
  );
};

const meta = {
  title: 'Molecules/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeProvider>
        <div className="w-[480px]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    table: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Table>;

export default meta;

/** render만 쓰는 스토리라 args 불필요 */
type Story = Omit<StoryObj<typeof meta>, 'args'> & { args?: Record<string, unknown> };

export const Default: Story = {
  render: () => <DefaultTable />,
};

export const CustomCells: Story = {
  render: () => <CustomCellTable />,
  parameters: {
    docs: {
      description: {
        story: 'columnDef.cell로 셀 렌더링을 커스텀할 수 있습니다.',
      },
    },
  },
};

export const CustomRowRender: Story = {
  render: () => <CustomBodyTable />,
  parameters: {
    docs: {
      description: {
        story: 'TableBody의 renderRow로 행 전체 스타일/구조를 확장할 수 있습니다.',
      },
    },
  },
};
