import type { ColumnDef, Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Table, TableBody } from '../Table';
import { useDataTable } from '../../../hooks/useDataTable';
import { IndeterminateCheckbox } from './IndeterminateCheckbox';
import { DataTableHead } from './DataTableHead';
import { useTheme } from '../../../theme/ThemeContext';
import { useMessage } from '../../../i18n/I18nContext';
import { cn } from '../../../utils/cn';
import type { Stylable, ThemedComponent } from '../../../types/common';

export interface DataTableScrollOptions {
  /** 스크롤 영역 최대 높이 (예: '400px', '60vh') */
  maxHeight?: string;
}

export interface DataTableProps<TData> extends Stylable, ThemedComponent {
  /** 테이블 데이터 */
  data: TData[];
  /** 컬럼 정의 (TanStack Table ColumnDef). cell로 버튼/아이콘/링크 등 커스텀 렌더링 가능 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  /** 행 선택(체크박스) 사용 여부 */
  selectable?: boolean;
  /** 컬럼 클릭 정렬 사용 여부 */
  sortable?: boolean;
  /** 페이지네이션 사용 여부 */
  pagination?: boolean;
  /** 페이지당 행 수 */
  pageSize?: number;
  /** 행별 조건부 className (예: 특정 값이면 빨강) */
  getRowClassName?: (row: Row<TData>) => string | undefined;
  /** 행별 조건부 style */
  getRowStyle?: (row: Row<TData>) => React.CSSProperties | undefined;
  /** 선택 변경 시 콜백 */
  onSelectionChange?: (selection: Record<string, boolean>) => void;
  /** 스크롤 옵션 (많은 데이터 시 영역 고정) */
  scroll?: DataTableScrollOptions;
}

const createSelectionColumn = <TData,>(labels: {
  selectAll: string;
  selectRow: string;
}): ColumnDef<TData, unknown> => ({
  id: 'select',
  size: 40,
  maxSize: 40,
  header: ({ table }) => (
    <IndeterminateCheckbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
      aria-label={labels.selectAll}
    />
  ),
  cell: ({ row }) => (
    <IndeterminateCheckbox
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
      disabled={!row.getCanSelect()}
      aria-label={labels.selectRow}
    />
  ),
  enableSorting: false,
});

export const DataTable = <TData,>({
  data,
  columns,
  selectable = false,
  sortable = false,
  pagination = false,
  pageSize = 10,
  getRowClassName,
  getRowStyle,
  onSelectionChange,
  scroll,
  className,
  style,
  theme: themeOverride,
}: DataTableProps<TData>) => {
  const globalTheme = useTheme();
  const theme = themeOverride
    ? { ...globalTheme.table, ...themeOverride }
    : globalTheme.table;
  const t = (theme ?? {}) as Record<string, string>;

  const selectAllLabel = useMessage('table', 'selectAll');
  const selectRowLabel = useMessage('table', 'selectRow');

  const finalColumns = selectable
    ? [createSelectionColumn<TData>({ selectAll: selectAllLabel, selectRow: selectRowLabel }), ...columns]
    : columns;

  const { table, getRowClassName: rowClassNameFn, getRowStyle: rowStyleFn, pagination: paginationState } = useDataTable(
    data,
    finalColumns,
    {
      selectable,
      sortable,
      pagination,
      pageSize,
      getRowClassName,
      getRowStyle,
      onSelectionChange,
    }
  );

  const totalRows = table.getFilteredRowModel().rows.length;
  const from = paginationState ? paginationState.pageIndex * pageSize + 1 : 0;
  const to = paginationState ? Math.min((paginationState.pageIndex + 1) * pageSize, totalRows) : 0;

  const pageInfoText = useMessage('table', 'pageInfo', {
    from: String(from),
    to: String(to),
    total: String(totalRows),
  });
  const firstLabel = useMessage('table', 'first');
  const prevLabel = useMessage('table', 'prev');
  const nextLabel = useMessage('table', 'next');
  const lastLabel = useMessage('table', 'last');

  const tableEl = (
    <Table table={table} className={className} style={style} theme={themeOverride}>
      <DataTableHead sortable={sortable} />
      <TableBody
        renderRow={(row) => (
          <tr
            key={row.id}
            className={cn(
              t.row,
              rowClassNameFn?.(row as Row<TData>),
              row.getIsSelected() && 'data-[state=selected]'
            )}
            style={rowStyleFn?.(row as Row<TData>)}
            data-state={row.getIsSelected() ? 'selected' : undefined}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                style={{
                  width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
                }}
                className={cn(
                  t.cell,
                  (cell.column.columnDef.meta as { className?: string })?.className
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        )}
      />
    </Table>
  );

  const content = scroll?.maxHeight ? (
    <div
      className="overflow-auto"
      style={{ maxHeight: scroll.maxHeight }}
    >
      {tableEl}
    </div>
  ) : (
    tableEl
  );

  if (!paginationState) {
    return content;
  }

  const p = paginationState;

  return (
    <div className="flex flex-col gap-2">
      {content}
      <div className="flex items-center justify-between gap-2 px-1 text-sm text-gray-600">
        <span>{pageInfoText}</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={p.firstPage}
            disabled={!p.canPrevPage}
            className="rounded px-2 py-1 disabled:opacity-50 hover:bg-gray-100"
          >
            {firstLabel}
          </button>
          <button
            type="button"
            onClick={p.prevPage}
            disabled={!p.canPrevPage}
            className="rounded px-2 py-1 disabled:opacity-50 hover:bg-gray-100"
          >
            {prevLabel}
          </button>
          <span className="flex items-center px-2">
            {p.pageIndex + 1} / {p.pageCount}
          </span>
          <button
            type="button"
            onClick={p.nextPage}
            disabled={!p.canNextPage}
            className="rounded px-2 py-1 disabled:opacity-50 hover:bg-gray-100"
          >
            {nextLabel}
          </button>
          <button
            type="button"
            onClick={p.lastPage}
            disabled={!p.canNextPage}
            className="rounded px-2 py-1 disabled:opacity-50 hover:bg-gray-100"
          >
            {lastLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
