import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ExcelGrid, generateDummyRows, type ColumnDef, type RowData } from './index';

const columns: ColumnDef[] = [
  { field: 'name', header: '이름', width: 120 },
  { field: 'email', header: '이메일', width: 200 },
  { field: 'role', header: '역할', width: 100 },
  { field: 'score', header: '점수', width: 80, editable: true },
];

const initialRows: RowData[] = [
  { name: '김민혁', email: 'kim@example.com', role: '개발자', score: 85 },
  { name: '이길동', email: 'lee@example.com', role: '디자이너', score: 92 },
  { name: '박길동', email: 'park@example.com', role: 'PM', score: 78 },
  { name: '최길동', email: 'choi@example.com', role: '개발자', score: 88 },
  { name: '정길동', email: 'jung@example.com', role: '디자이너', score: 95 },
];

const largeRows = generateDummyRows(columns, 500);

const meta: Meta<typeof ExcelGrid> = {
  title: 'Molecules/ExcelGrid',
  component: ExcelGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**멀티 선택**: 셀을 드래그하면 범위 선택.\n**편집**: `editable` 스토리에서 셀 **더블클릭** 또는 포커스 후 **Enter**로 편집. **Enter**로 저장, **Esc**로 취소.\n**복사/붙여넣기**: 선택 후 **Ctrl+C**, 포커스 위치에서 **Ctrl+V** (탭=열, 줄바꿈=행).',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExcelGrid>;

export const Default: Story = {
  args: {
    columns,
    rows: initialRows,
    selection: true,
  },
};

export const Editable: Story = {
  args: {
    columns,
    rows: initialRows,
    editable: true,
    selection: true,
    onChange: (row, col, value) => {
      console.log('onChange', { row, col, value });
    },
  },
  parameters: {
    docs: {
      description: {
        story: '**점수** 컬럼만 편집 가능. 셀을 **더블클릭**하거나 선택 후 **Enter**로 편집.',
      },
    },
  },
};

export const ReadOnlyNoSelection: Story = {
  args: {
    columns,
    rows: initialRows,
    selection: false,
  },
};

export const WithCheckbox: Story = {
  args: {
    columns,
    rows: initialRows,
    selection: true,
    checkboxSelection: true,
    onSelectionChange: (indices) => console.log('selected rows', indices),
  },
  parameters: {
    docs: { description: { story: '첫 열에 체크박스. 행 선택/전체 선택.' } },
  },
};

/** 다중 행 선택: 클릭(단일), Ctrl+클릭(토글), Shift+클릭(범위) */
export const MultiSelect: Story = {
  args: {
    columns,
    rows: initialRows,
    selection: true,
    multiSelect: true,
    onSelectionChange: (indices) => console.log('selected rows', indices),
  },
  parameters: {
    docs: {
      description: {
        story:
          '클릭: 해당 행만 선택. Ctrl+클릭: 행 선택 추가/해제. Shift+클릭: 이전 선택 행부터 현재 행까지 범위 선택.',
      },
    },
  },
};

export const SortableAndSearch: Story = {
  args: {
    columns,
    rows: initialRows,
    selection: true,
    sortable: true,
    searchPlaceholder: '검색...',
  },
  parameters: {
    docs: {
      description: {
        story: '컬럼 헤더 클릭으로 오름차순/내림차순/해제. 상단 검색으로 행 필터.',
      },
    },
  },
};

export const LargeData: Story = {
  args: {
    columns,
    rows: largeRows,
    selection: true,
    sortable: true,
    searchPlaceholder: '검색...',
  },
  parameters: {
    docs: { description: { story: '500행 더미 데이터. 정렬/검색 동작 확인.' } },
  },
};

export const WithPagination: Story = {
  args: {
    columns,
    rows: largeRows,
    selection: true,
    sortable: true,
    searchPlaceholder: '검색...',
    pagination: { pageSize: 15 },
  },
  parameters: {
    docs: { description: { story: '페이지당 15행. 하단 이전/다음 버튼.' } },
  },
};

export const WithColumnFilterAndReorder: Story = {
  args: {
    columns,
    rows: initialRows,
    selection: true,
    sortable: true,
    columnFilter: true,
    columnReorder: true,
  },
  parameters: {
    docs: {
      description: {
        story: '헤더 안 필터 입력 + 컬럼 헤더 드래그로 순서 변경.',
      },
    },
  },
};

/** tbody만 가상 스크롤, 헤더 고정 */
export const VirtualScroll: Story = {
  args: {
    columns,
    rows: largeRows,
    selection: true,
    sortable: true,
    searchPlaceholder: '검색...',
    virtualScroll: { rowHeight: 36, maxHeight: 400 },
  },
  parameters: {
    docs: {
      description: {
        story: '가상 스크롤: tbody만 렌더, 헤더는 고정. 많은 행에서도 스크롤 성능 유지.',
      },
    },
  },
};

/** 왼쪽/오른쪽 고정 컬럼 (pinned: true = 'left' 호환) */
const columnsWithPinned: ColumnDef[] = [
  { field: 'name', header: '이름', width: 120, pinned: 'left' },
  { field: 'email', header: '이메일', width: 200 },
  { field: 'role', header: '역할', width: 100 },
  { field: 'score', header: '점수', width: 80, pinned: 'right' },
];

/** 행 순서 변경용: 첫 컬럼에 rowDrag (AG Grid 스타일) */
const columnsWithRowDrag: ColumnDef[] = [
  { field: 'name', header: '이름', width: 120, rowDrag: true },
  { field: 'email', header: '이메일', width: 200 },
  { field: 'role', header: '역할', width: 100 },
  { field: 'score', header: '점수', width: 80 },
];

export const PinnedColumns: Story = {
  args: {
    columns: columnsWithPinned,
    rows: largeRows.slice(0, 20),
    selection: true,
    columnReorder: true,
  },
  parameters: {
    docs: {
      description: {
        story: '이름(왼쪽), 점수(오른쪽) 고정. 가로 스크롤 시에도 고정 컬럼 유지.',
      },
    },
  },
};

/** column.movable: false인 컬럼은 드래그로 옮기기 불가 */
const columnsWithMovable: ColumnDef[] = [
  { field: 'name', header: '이름', width: 120 },
  { field: 'email', header: '이메일', width: 200, movable: false },
  { field: 'role', header: '역할', width: 100 },
  { field: 'score', header: '점수', width: 80 },
];

export const ColumnMovable: Story = {
  args: {
    columns: columnsWithMovable,
    rows: initialRows,
    selection: true,
    columnReorder: true,
  },
  parameters: {
    docs: {
      description: {
        story: '이메일 컬럼만 movable: false — 드래그 불가. 나머지 컬럼은 드래그로 순서 변경 가능.',
      },
    },
  },
};

/** 행 grab + 드래그 미리보기 + 멀티 드래그(선택 행/셀 범위) → 다른 그리드로 추가 */
/** 행 드래그로 같은 그리드 내 순서 변경 (AG Grid rowDrag) */
export const RowDragReorder: Story = {
  render: () => {
    const [rows, setRows] = useState<RowData[]>(initialRows);
    return (
      <ExcelGrid
        columns={columnsWithRowDrag}
        rows={rows}
        selection
        onRowOrderChange={(newRows) => setRows(newRows)}
        editable
        onChange={(r, c, v) => {
          const col = columnsWithRowDrag[c];
          if (col)
            setRows((prev) => {
              const next = [...prev];
              next[r] = { ...next[r], [col.field]: v };
              return next;
            });
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '첫 컬럼(이름)의 ⋮⋮ 핸들을 드래그해 행 순서를 바꿉니다. onRowOrderChange로 부모 rows 상태를 업데이트하세요.',
      },
    },
  },
};

export const RowDragToOtherGrid: Story = {
  render: () => {
    const [rowsA, setRowsA] = useState<RowData[]>(largeRows.slice(0, 3));
    const [rowsB, setRowsB] = useState<RowData[]>(largeRows.slice(6, 20));
    return (
      <div className="flex gap-8">
        <div>
          <p className="text-sm font-medium mb-1">
            그리드 A (행 잡아 드래그 · 여러 행 선택 후 드래그 시 일괄 이동)
          </p>
          <ExcelGrid
            columns={columns}
            rows={rowsA}
            selection
            multiSelect
            rowDraggable
            editable
            onChange={(r, c, v) => {
              const col = columns[c];
              if (col)
                setRowsA((prev) => {
                  const next = [...prev];
                  next[r] = { ...next[r], [col.field]: v };
                  return next;
                });
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">그리드 B (파란 선 위치에 삽입)</p>
          <ExcelGrid
            columns={columns}
            rows={rowsB}
            selection
            onDropRows={(dropped, insertAtIndex) => {
              setRowsB((prev) => {
                const at = insertAtIndex ?? prev.length;
                return [...prev.slice(0, at), ...dropped, ...prev.slice(at)];
              });
            }}
            editable
            onChange={(r, c, v) => {
              const col = columns[c];
              if (col)
                setRowsB((prev) => {
                  const next = [...prev];
                  next[r] = { ...next[r], [col.field]: v };
                  return next;
                });
            }}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '드래그 시 미리보기 + 파란 선으로 삽입 위치 표시. onDropRows(rows, insertAtIndex)로 해당 위치에 삽입.',
      },
    },
  },
};

const columnsWithFilterTypes: ColumnDef[] = [
  { field: 'name', header: '이름', width: 120 },
  { field: 'score', header: '점수', width: 80, filterType: 'number' },
  { field: 'role', header: '역할', width: 100 },
];

export const ColumnFilterByType: Story = {
  args: {
    columns: columnsWithFilterTypes,
    rows: initialRows,
    selection: true,
    columnFilter: true,
  },
  parameters: {
    docs: {
      description: { story: '점수 컬럼은 filterType: "number" (숫자 일치). 이름/역할은 text(포함).' },
    },
  },
};

export const RowLoading: Story = {
  render: () => {
    const [rows, setRows] = useState<RowData[]>(initialRows);
    const loadingRow = 1;
    return (
      <>
        <p className="text-sm text-gray-600 mb-1">2번째 행에 로딩 표시 (isRowLoading)</p>
        <ExcelGrid
          columns={columns}
          rows={rows}
          selection
          isRowLoading={(idx) => idx === loadingRow}
          onChange={(r, c, v) => {
            const col = columns[c];
            if (col) setRows((prev) => [...prev.slice(0, r), { ...prev[r], [col.field]: v }, ...prev.slice(r + 1)]);
          }}
        />
      </>
    );
  },
  parameters: {
    docs: { description: { story: 'isRowLoading(rowIndex)이 true인 행은 "로딩 중..." 표시.' } },
  },
};

/** onCellChange: 변경된 셀만 강조 (ring + 배경) */
export const CellChangeHighlight: Story = {
  render: () => {
    const [rows, setRows] = useState<RowData[]>(initialRows);
    const [changed, setChanged] = useState<Set<string>>(new Set());
    return (
      <>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          셀을 편집하면 해당 셀에 노란 테두리·배경이 적용됩니다 (onCellChange + getCellClassName).
        </p>
        <ExcelGrid
          columns={columns}
          rows={rows}
          selection
          editable
          onChange={(r, c, v) => {
            const col = columns[c];
            if (col) setRows((prev) => [...prev.slice(0, r), { ...prev[r], [col.field]: v }, ...prev.slice(r + 1)]);
          }}
          onCellChange={(rowIndex, colIndex) => {
            setChanged((prev) => new Set(prev).add(`${rowIndex},${colIndex}`));
          }}
          getCellClassName={(rowIndex, colIndex) =>
            changed.has(`${rowIndex},${colIndex}`)
              ? 'ring-2 ring-amber-400 dark:ring-amber-500 bg-amber-50/80 dark:bg-amber-900/30'
              : undefined
          }
        />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'onCellChange로 변경된 셀을 추적하고, getCellClassName으로 해당 셀에 스타일을 넣어 변경 여부를 시각적으로 표시.',
      },
    },
  },
};

export const ExportImport: Story = {
  render: () => {
    const [rows, setRows] = useState<RowData[]>(initialRows);
    return (
      <ExcelGrid
        columns={columns}
        rows={rows}
        selection
        sortable
        editable
        exportFileName="grid-export.csv"
        exportImportDelimiter=","
        onImport={(imported) => setRows(imported)}
        onChange={(r, c, v) => {
          const next = [...rows];
          const col = columns[c];
          if (col) next[r] = { ...next[r], [col.field]: v };
          setRows(next);
        }}
      />
    );
  },
  parameters: {
    docs: { description: { story: 'Export/Import 버튼. 구분자 옵션(기본 CSV).' } },
  },
};

/** 다크모드: 상위에 class="dark" 적용 시 그리드 다크 스타일 */
export const DarkMode: Story = {
  render: () => {
    const [rows, setRows] = useState<RowData[]>(initialRows);
    return (
      <div className="dark bg-gray-950 p-6 rounded-lg min-h-[320px] text-gray-100">
        <p className="text-sm text-gray-400 mb-2">
          다크 모드 예제 (상위에 <code className="text-amber-400">class=&quot;dark&quot;</code> 적용)
        </p>
        <ExcelGrid
          columns={columns}
          rows={rows}
          selection
          editable
          columnFilter
          onChange={(r, c, v) => {
            const col = columns[c];
            if (col) setRows((prev) => [...prev.slice(0, r), { ...prev[r], [col.field]: v }, ...prev.slice(r + 1)]);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tailwind dark: 변수가 적용된 그리드. 부모에 class="dark"를 주면 헤더·본문·필터·에디터가 통일된 다크 팔레트로 표시됩니다.',
      },
    },
  },
};

/** 행 추가 버튼: onAddRow로 새 행 추가 */
export const AddRow: Story = {
  render: () => {
    const [rows, setRows] = useState<RowData[]>(initialRows);
    const emptyRow = (): RowData => ({ name: '', email: '', role: '', score: 0 });
    return (
      <ExcelGrid
        columns={columns}
        rows={rows}
        selection
        editable
        onAddRow={() => setRows((prev) => [...prev, emptyRow()])}
        onChange={(r, c, v) => {
          const col = columns[c];
          if (col)
            setRows((prev) => {
              const next = [...prev];
              next[r] = { ...next[r], [col.field]: v };
              return next;
            });
        }}
      />
    );
  },
  parameters: {
    docs: { description: { story: '상단 "행 추가" 버튼으로 빈 행을 맨 뒤에 추가.' } },
  },
};

export const PinnedRows: Story = {
  args: {
    columns,
    rows: initialRows,
    selection: true,
    pinnedRowCount: 2,
  },
  parameters: {
    docs: { description: { story: '상단 2행 고정 (스크롤 시에도 고정).' } },
  },
};

const columnsWithEditors: ColumnDef[] = [
  { field: 'name', header: '이름', width: 120 },
  { field: 'date', header: '날짜', width: 180, editable: true, editor: 'datetime' },
  {
    field: 'role',
    header: '역할',
    width: 120,
    editable: true,
    editor: 'dropdown',
    dropdownOptions: ['개발자', '디자이너', 'PM', '기획'],
  },
  { field: 'score', header: '점수', width: 80, editable: true },
];

const rowsWithEditors: RowData[] = [
  { name: '김민혁', date: '2024-01-15T09:00', role: '개발자', score: 85 },
  { name: '이길동', date: '2024-02-20T14:30', role: '디자이너', score: 92 },
];

export const CellEditors: Story = {
  args: {
    columns: columnsWithEditors,
    rows: rowsWithEditors,
    selection: true,
    editable: true,
    onChange: (row, col, value) => console.log('onChange', { row, col, value }),
  },
  parameters: {
    docs: {
      description: {
        story: '날짜 컬럼: datetime, 역할 컬럼: dropdown 에디터.',
      },
    },
  },
};

/** 테이블 간 행 이동: 한 그리드에서 선택 후 Ctrl+C, 다른 그리드 포커스 후 Ctrl+V */
export const TwoGridsCopyPaste: Story = {
  render: () => {
    const [rowsA, setRowsA] = useState<RowData[]>(initialRows.slice(0, 3));
    const [rowsB, setRowsB] = useState<RowData[]>(initialRows.slice(3, 5));
    return (
      <div className="flex gap-8">
        <div>
          <p className="text-sm font-medium mb-1">그리드 A (선택 후 Ctrl+C)</p>
          <ExcelGrid
            columns={columns}
            rows={rowsA}
            selection
            editable
            onChange={(r, c, v) => {
              const col = columns[c];
              if (col)
                setRowsA((prev) => {
                  const next = [...prev];
                  next[r] = { ...next[r], [col.field]: v };
                  return next;
                });
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">그리드 B (포커스 후 Ctrl+V)</p>
          <ExcelGrid
            columns={columns}
            rows={rowsB}
            selection
            editable
            onChange={(r, c, v) => {
              const col = columns[c];
              if (col)
                setRowsB((prev) => {
                  const next = [...prev];
                  next[r] = { ...next[r], [col.field]: v };
                  return next;
                });
            }}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '그리드 A에서 셀 선택 후 Ctrl+C, 그리드 B 클릭 후 Ctrl+V로 행 복사·붙여넣기.',
      },
    },
  },
};
