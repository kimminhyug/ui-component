import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type OnChangeFn,
  type SortingState,
} from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';

export interface UseDataTableOptions<TData> {
  /** 행 선택(체크박스) 사용 여부 */
  selectable?: boolean;
  /** 컬럼 클릭 정렬 사용 여부 */
  sortable?: boolean;
  /** 페이지네이션 사용 여부 */
  pagination?: boolean;
  /** 페이지당 행 수 (pagination 시) */
  pageSize?: number;
  /** 행별 조건부 className (예: 특정 값이면 빨강) */
  getRowClassName?: (row: Row<TData>) => string | undefined;
  /** 행별 조건부 style */
  getRowStyle?: (row: Row<TData>) => CSSProperties | undefined;
  /** 선택 변경 시 콜백 (새 선택 상태) */
  onSelectionChange?: (selection: RowSelectionState) => void;
  /** 초기 정렬 상태 */
  initialSorting?: SortingState;
}

export interface UseDataTablePaginationState {
  pageIndex: number;
  pageCount: number;
  setPageIndex: (index: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  canNextPage: boolean;
  canPrevPage: boolean;
}

export interface UseDataTableReturn<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  getRowClassName?: (row: Row<TData>) => string | undefined;
  getRowStyle?: (row: Row<TData>) => React.CSSProperties | undefined;
  pagination: UseDataTablePaginationState | null;
}

export const useDataTable = <TData,>(
  data: TData[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[],
  options: UseDataTableOptions<TData> = {}
): UseDataTableReturn<TData> => {
  const {
    selectable = false,
    sortable = false,
    pagination: usePagination = false,
    pageSize: initialPageSize = 10,
    getRowClassName,
    getRowStyle,
    onSelectionChange,
    initialSorting,
  } = options;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const next = typeof updater === 'function' ? updater(rowSelection) : updater;
    setRowSelection(next);
    onSelectionChange?.(next);
  };

  const enhancedColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      enableSorting: sortable && (col.enableSorting !== false),
    }));
  }, [columns, sortable]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      rowSelection: selectable ? rowSelection : {},
      sorting: sortable ? sorting : undefined,
      pagination: usePagination ? pagination : undefined,
    },
    onRowSelectionChange: selectable ? handleRowSelectionChange : undefined,
    onSortingChange: sortable ? setSorting : undefined,
    onPaginationChange: usePagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getPaginationRowModel: usePagination ? getPaginationRowModel() : undefined,
  });

  const paginationState: UseDataTablePaginationState | null = usePagination
    ? {
        pageIndex: table.getState().pagination.pageIndex,
        pageCount: table.getPageCount(),
        setPageIndex: table.setPageIndex,
        nextPage: table.nextPage,
        prevPage: table.previousPage,
        firstPage: () => table.setPageIndex(0),
        lastPage: () => table.setPageIndex(table.getPageCount() - 1),
        canNextPage: table.getCanNextPage(),
        canPrevPage: table.getCanPreviousPage(),
      }
    : null;

  return {
    table,
    getRowClassName,
    getRowStyle,
    pagination: paginationState,
  };
};
