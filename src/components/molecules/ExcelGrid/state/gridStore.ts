import type { GridState, RowData, ColumnDef, SortDirection } from '../types';

const CHECKBOX_COLUMN: ColumnDef = {
  field: '__checkbox__',
  header: '',
  width: 40,
};

export const DRAG_HANDLE_COLUMN: ColumnDef = {
  field: '__drag__',
  header: '',
  width: 28,
};

type Listener = () => void;

export interface InitStoreOptions {
  checkboxSelection?: boolean;
  rowDraggable?: boolean;
}

export interface GridStoreApi {
  getState: () => GridState;
  setState: (partial: Partial<GridState>) => void;
  subscribe: (listener: Listener) => () => void;
  initStore: (rows: RowData[], columns: ColumnDef[], options?: InitStoreOptions) => void;
  getColumnOrder: () => number[];
  setColumnOrder: (order: number[]) => void;
  setColumnFilter: (colIndex: number, value: string) => void;
  setSortBy: (col: number, dir: SortDirection) => void;
  clearSort: () => void;
  setSearchText: (text: string) => void;
  setRows: (rows: RowData[]) => void;
  toggleRowSelection: (rowIndex: number) => void;
  toggleAllRowsSelection: (displayedRowCount: number) => void;
  setSelectedRowIndices: (indices: number[]) => void;
}

/** 그리드별 독립 스토어 생성 (한 페이지에 여러 ExcelGrid 사용 시 각각 다른 데이터/상태 유지) */
export const createGridStore = (): GridStoreApi => {
  let state: GridState = {
    rows: [],
    columns: [],
    focusedCell: null,
    selectedRange: null,
    editingCell: null,
    selectedRowIndices: [],
    sortBy: null,
    searchText: '',
    columnFilters: {},
    columnOrder: [],
  };

  const listeners = new Set<Listener>();
  const emit = (): void => {
    listeners.forEach((l) => l());
  };

  return {
    getState: () => state,
    setState: (partial) => {
      state = { ...state, ...partial };
      emit();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    initStore: (rows, columns, options = {}) => {
      const withCheckbox =
        options.checkboxSelection === true ? [CHECKBOX_COLUMN, ...columns] : columns;
      const displayColumns =
        options.rowDraggable === true ? [DRAG_HANDLE_COLUMN, ...withCheckbox] : withCheckbox;
      const dataLen = options.checkboxSelection ? columns.length : columns.length;
      const columnOrder = Array.from({ length: dataLen }, (_, i) => i);
      state = {
        rows: [...rows],
        columns: displayColumns,
        focusedCell: null,
        selectedRange: null,
        editingCell: null,
        selectedRowIndices: [],
        sortBy: null,
        searchText: '',
        columnFilters: {},
        columnOrder,
      };
      emit();
    },
    getColumnOrder: () => state.columnOrder,
    setColumnOrder: (order) => {
      state = { ...state, columnOrder: order };
      emit();
    },
    setColumnFilter: (colIndex, value) => {
      const next = { ...state.columnFilters, [colIndex]: value };
      if (!value.trim()) delete next[colIndex];
      state = { ...state, columnFilters: next };
      emit();
    },
    setSortBy: (col, dir) => {
      state = { ...state, sortBy: { col, dir } };
      emit();
    },
    clearSort: () => {
      state = { ...state, sortBy: null };
      emit();
    },
    setSearchText: (text) => {
      state = { ...state, searchText: text };
      emit();
    },
    setRows: (rows) => {
      state = { ...state, rows: [...rows] };
      emit();
    },
    toggleRowSelection: (rowIndex) => {
      const set = new Set(state.selectedRowIndices);
      if (set.has(rowIndex)) set.delete(rowIndex);
      else set.add(rowIndex);
      state = { ...state, selectedRowIndices: Array.from(set) };
      emit();
    },
    toggleAllRowsSelection: (displayedRowCount) => {
      const current = state.selectedRowIndices.length;
      const allSelected = current === displayedRowCount && displayedRowCount > 0;
      state = {
        ...state,
        selectedRowIndices: allSelected ? [] : Array.from({ length: displayedRowCount }, (_, i) => i),
      };
      emit();
    },
    setSelectedRowIndices: (indices) => {
      state = { ...state, selectedRowIndices: [...indices] };
      emit();
    },
  };
};
