import type { Meta, StoryObj } from '@storybook/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Input } from '../components/atoms/Input';
import { ThemeProvider } from './ThemeContext';
import { neonTheme, spaceTheme, retroTheme } from './theme-presets';
import { useDisclosure } from '../hooks';
import { Modal } from '../components/molecules/Modal';
import { Dropdown } from '../components/molecules/Dropdown';
import type { DropdownItem } from '../components/molecules/Dropdown';
import { Tabs } from '../components/molecules/Tabs';
import type { TabItem } from '../components/molecules/Tabs';
import { Checkbox } from '../components/molecules/Checkbox';
import { Table, TableHead, TableBody } from '../components/molecules/Table';
import { DataTable } from '../components/molecules/DataTable';
import { EditableTable } from '../components/molecules/EditableTable';

type Person = { id: number; name: string; email: string; role: string };
type PersonWithStatus = Person & { status: 'active' | 'inactive' };
type Task = {
  id: number;
  title: string;
  score: number;
  due: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
};

const tableData: Person[] = [
  { id: 1, name: '김민혁', email: 'kim@example.com', role: '개발자' },
  { id: 2, name: '이영희', email: 'lee@example.com', role: '디자이너' },
  { id: 3, name: '박민수', email: 'park@example.com', role: 'PM' },
];

const dataTableData: PersonWithStatus[] = [
  { id: 1, name: '김민혁', email: 'kim@example.com', role: '개발자', status: 'active' },
  { id: 2, name: '이영희', email: 'lee@example.com', role: '디자이너', status: 'inactive' },
  { id: 3, name: '박민수', email: 'park@example.com', role: 'PM', status: 'active' },
];

const editableData: Task[] = [
  { id: 1, title: '요구사항 정리', score: 80, due: '2025-02-20', done: false, priority: 'high' },
  { id: 2, title: 'API 설계', score: 0, due: '2025-02-25', done: false, priority: 'medium' },
];

const personColumnHelper = createColumnHelper<Person>();
const tableColumns = [
  personColumnHelper.accessor('name', { header: '이름' }),
  personColumnHelper.accessor('email', { header: '이메일' }),
  personColumnHelper.accessor('role', { header: '역할' }),
];

const personWithStatusHelper = createColumnHelper<PersonWithStatus>();
const dataTableColumns = [
  personWithStatusHelper.accessor('name', { header: '이름' }),
  personWithStatusHelper.accessor('email', { header: '이메일' }),
  personWithStatusHelper.accessor('role', { header: '역할' }),
  personWithStatusHelper.accessor('status', { header: '상태' }),
];

const taskColumnHelper = createColumnHelper<Task>();
const priorityOptions = [
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
];
const editableColumns = [
  taskColumnHelper.accessor('title', { header: '제목', meta: { editType: 'text' as const } }),
  taskColumnHelper.accessor('score', { header: '점수', meta: { editType: 'number' as const } }),
  taskColumnHelper.accessor('due', { header: '마감일', meta: { editType: 'date' as const } }),
  taskColumnHelper.accessor('done', { header: '완료', meta: { editType: 'checkbox' as const } }),
  taskColumnHelper.accessor('priority', {
    header: '우선순위',
    meta: { editType: 'dropdown' as const, editOptions: priorityOptions },
  }),
];

const dropdownItems: DropdownItem[] = [
  { key: 'edit', label: '수정', onClick: () => {} },
  { key: 'dup', label: '복제', onClick: () => {} },
  { key: 'del', label: '삭제', onClick: () => {} },
];

const tabItems: TabItem[] = [
  { key: 'a', label: '탭 A', panel: <p className="text-sm">탭 A 내용</p> },
  { key: 'b', label: '탭 B', panel: <p className="text-sm">탭 B 내용</p> },
  { key: 'c', label: '탭 C', panel: <p className="text-sm">탭 C 내용</p> },
];

const AllComponentsDemo = ({ wrapperClassName }: { wrapperClassName: string }) => {
  const { isOpen, open, close } = useDisclosure();
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className={`p-6 rounded-lg max-w-3xl space-y-8 ${wrapperClassName}`}>
      <section>
        <h3 className="text-sm font-semibold mb-2">Button</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" size="sm">Sm</Button>
          <Button variant="primary" size="lg">Lg</Button>
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Badge</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Input</h3>
        <div className="flex flex-col gap-2 max-w-xs">
          <Input placeholder="Placeholder" />
          <Input placeholder="Error state" error />
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Checkbox</h3>
        <div className="flex flex-wrap gap-4">
          <Checkbox label="옵션 1" />
          <Checkbox label="옵션 2" defaultChecked />
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Modal</h3>
        <Button onClick={open}>모달 열기</Button>
        <Modal open={isOpen} onClose={close} title="제목" description="설명">
          <p className="text-sm">모달 내용</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={close}>취소</Button>
            <Button variant="primary" onClick={close}>확인</Button>
          </div>
        </Modal>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Dropdown</h3>
        <Dropdown trigger="메뉴 열기" items={dropdownItems} />
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Tabs</h3>
        <Tabs items={tabItems} defaultIndex={0} />
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Table</h3>
        <Table table={table}>
          <TableHead />
          <TableBody />
        </Table>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">DataTable</h3>
        <DataTable data={dataTableData} columns={dataTableColumns} />
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">EditableTable</h3>
        <EditableTable data={editableData} columns={editableColumns} />
      </section>
    </div>
  );
};

const meta = {
  title: 'Theme/Override',
  parameters: {
    layout: 'centered',
    docs: {
      source: { type: 'code' },
      description: {
        story: 'ThemeProvider로 전역 테마를 오버라이드할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const GlobalThemeOverride: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ThemeProvider
  themes={{
    violet: {
      button: {
        primary: 'bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-500',
      },
    },
  }}
  defaultThemeKey="violet"
>
  <Button variant="primary">Primary (오버라이드)</Button>
  <Button variant="secondary">Secondary (base 유지)</Button>
</ThemeProvider>`,
        language: 'tsx',
      },
    },
  },
  render: () => (
    <ThemeProvider
      themes={{
        violet: {
          button: {
            primary:
              'bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-500',
          },
        },
      }}
      defaultThemeKey="violet"
    >
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary (오버라이드)</Button>
        <Button variant="secondary">Secondary (base 유지)</Button>
        <Button variant="primary" size="sm">
          Small (base 유지)
        </Button>
      </div>
    </ThemeProvider>
  ),
};

export const CustomClassName: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ThemeProvider
  themes={{
    emerald: {
      custom: {
        'btn-emerald': 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
      },
    },
  }}
  defaultThemeKey="emerald"
>
  <Button className="btn-emerald" variant="primary">className="btn-emerald" 적용</Button>
</ThemeProvider>`,
        language: 'tsx',
      },
    },
  },
  render: () => (
    <ThemeProvider
      themes={{
        emerald: {
          custom: {
            'btn-emerald':
              'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
          },
        },
      }}
      defaultThemeKey="emerald"
    >
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">기본 Primary</Button>
        <Button className="btn-emerald" variant="primary">
          className=&apos;btn-emerald&apos; → 테마에서 초록 스타일 적용
        </Button>
      </div>
    </ThemeProvider>
  ),
};

export const ComponentThemeProp: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Button variant="primary">기본 Primary</Button>
<Button
  variant="primary"
  theme={{ primary: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500' }}
>
  컴포넌트 theme prop으로 초록
</Button>`,
        language: 'tsx',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">기본 Primary</Button>
      <Button
        variant="primary"
        theme={{ primary: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500' }}
      >
        컴포넌트 theme prop으로 초록
      </Button>
    </div>
  ),
};

export const NeonTheme: Story = {
  parameters: {
    docs: {
      source: {
        code: `import { ThemeProvider } from './theme';
import { neonTheme } from './theme';

<ThemeProvider themes={{ neon: neonTheme }} defaultThemeKey="neon">
  <div className="bg-slate-950 text-slate-200 p-6">
    {/* your components */}
  </div>
</ThemeProvider>`,
        language: 'tsx',
      },
    },
  },
  render: () => (
    <ThemeProvider themes={{ neon: neonTheme }} defaultThemeKey="neon">
      <AllComponentsDemo wrapperClassName="bg-slate-950 text-slate-200" />
    </ThemeProvider>
  ),
};

export const SpaceTheme: Story = {
  parameters: {
    docs: {
      source: {
        code: `import { ThemeProvider } from './theme';
import { spaceTheme } from './theme';

<ThemeProvider themes={{ space: spaceTheme }} defaultThemeKey="space">
  <div className="bg-slate-900 text-slate-200 p-6">
    {/* your components */}
  </div>
</ThemeProvider>`,
        language: 'tsx',
      },
    },
  },
  render: () => (
    <ThemeProvider themes={{ space: spaceTheme }} defaultThemeKey="space">
      <AllComponentsDemo wrapperClassName="bg-slate-900 text-slate-200" />
    </ThemeProvider>
  ),
};

export const RetroTheme: Story = {
  parameters: {
    docs: {
      source: {
        code: `import { ThemeProvider } from './theme';
import { retroTheme } from './theme';

<ThemeProvider themes={{ retro: retroTheme }} defaultThemeKey="retro">
  <div className="bg-amber-50 border-2 border-amber-200 text-stone-800 p-6">
    {/* your components */}
  </div>
</ThemeProvider>`,
        language: 'tsx',
      },
    },
  },
  render: () => (
    <ThemeProvider themes={{ retro: retroTheme }} defaultThemeKey="retro">
      <AllComponentsDemo wrapperClassName="bg-amber-50 border-2 border-amber-200 text-stone-800" />
    </ThemeProvider>
  ),
};
