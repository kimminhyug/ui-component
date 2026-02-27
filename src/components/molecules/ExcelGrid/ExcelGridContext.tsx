import { createContext, useContext, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSyncExternalStore } from 'react';
import { createGridStore, type GridStoreApi } from './state/gridStore';
import type { RowData, ColumnDef } from './types';

export interface ExcelGridContextValue {
  state: ReturnType<GridStoreApi['getState']>;
  store: GridStoreApi;
  gridRef: React.RefObject<HTMLDivElement | null>;
  getOriginalRowIndexRef: React.MutableRefObject<((displayedRow: number) => number) | null>;
  getEditingValue: () => string | undefined;
  editable: boolean;
  onChange?: (rowIndex: number, colIndex: number, value: unknown) => void;
  sortable?: boolean;
  searchPlaceholder?: string;
  columnFilter?: boolean;
  columnReorder?: boolean;
  pagination?: { pageSize: number; page?: number; onPageChange?: (page: number) => void };
  virtualScroll?: { rowHeight: number; maxHeight?: number };
  pinnedRowCount?: number;
  multiSelect?: boolean;
  rowDraggable?: boolean;
  onDropRows?: (rows: RowData[]) => void;
  onAddRow?: () => void;
  exportFileName?: string;
  exportImportDelimiter?: string;
  onImport?: (rows: RowData[]) => void;
}

const ExcelGridContext = createContext<ExcelGridContextValue | null>(null);

export const useExcelGridState = (): ReturnType<GridStoreApi['getState']> => {
  const ctx = useContext(ExcelGridContext);
  if (!ctx) throw new Error('ExcelGrid subcomponents must be used within ExcelGrid.');
  return ctx.state;
};

export const useExcelGridRef = (): React.RefObject<HTMLDivElement | null> => {
  const ctx = useContext(ExcelGridContext);
  if (!ctx) throw new Error('ExcelGrid subcomponents must be used within ExcelGrid.');
  return ctx.gridRef;
};

export const useExcelGridOptions = (): ExcelGridContextValue => {
  const ctx = useContext(ExcelGridContext);
  if (!ctx) throw new Error('ExcelGrid subcomponents must be used within ExcelGrid.');
  return ctx;
};

export const useExcelGridOriginalRowIndexRef = (): ExcelGridContextValue['getOriginalRowIndexRef'] => {
  const ctx = useContext(ExcelGridContext);
  if (!ctx) throw new Error('ExcelGrid subcomponents must be used within ExcelGrid.');
  return ctx.getOriginalRowIndexRef;
};

interface ExcelGridProviderProps {
  rows: RowData[];
  columns: ColumnDef[];
  editable?: boolean;
  checkboxSelection?: boolean;
  onSelectionChange?: (selectedRowIndices: number[]) => void;
  sortable?: boolean;
  searchPlaceholder?: string;
  columnFilter?: boolean;
  columnReorder?: boolean;
  pagination?: { pageSize: number; page?: number; onPageChange?: (page: number) => void };
  virtualScroll?: { rowHeight: number; maxHeight?: number };
  pinnedRowCount?: number;
  multiSelect?: boolean;
  rowDraggable?: boolean;
  onDropRows?: (rows: RowData[]) => void;
  onAddRow?: () => void;
  exportFileName?: string;
  exportImportDelimiter?: string;
  onImport?: (rows: RowData[]) => void;
  onChange?: (rowIndex: number, colIndex: number, value: unknown) => void;
  children: React.ReactNode;
}

/** 그리드별 독립 스토어 생성 + context 제공 */
export const ExcelGridProvider = ({
  rows,
  columns,
  editable = false,
  checkboxSelection = false,
  onSelectionChange,
  sortable = false,
  searchPlaceholder,
  columnFilter = false,
  columnReorder = false,
  pagination,
  virtualScroll,
  pinnedRowCount = 0,
  multiSelect = false,
  rowDraggable = false,
  onDropRows,
  onAddRow,
  exportFileName,
  exportImportDelimiter = ',',
  onImport,
  onChange,
  children,
}: ExcelGridProviderProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const getOriginalRowIndexRef = useRef<((displayedRow: number) => number) | null>(null);

  const storeRef = useRef<GridStoreApi | null>(null);
  if (!storeRef.current) storeRef.current = createGridStore();
  const store = storeRef.current;

  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);

  useEffect(() => {
    store.initStore(rows, columns, { checkboxSelection, rowDraggable });
  }, [rows, columns, checkboxSelection, rowDraggable, store]);

  const getEditingValue = useCallback((): string | undefined => {
    const root = gridRef.current;
    const s = store.getState();
    const ec = s.editingCell;
    if (!root || !ec) return undefined;
    const sel = `[data-row="${ec.row}"][data-col="${ec.col}"]`;
    const input = root.querySelector<HTMLInputElement>(`input${sel}`);
    if (input) return input.value;
    const selectEl = root.querySelector<HTMLSelectElement>(`select${sel}`);
    return selectEl?.value;
  }, [store]);

  const getOriginalRowIndex = useCallback((i: number) => getOriginalRowIndexRef.current?.(i) ?? i, []);

  useEffect(() => {
    onSelectionChange?.(state.selectedRowIndices);
  }, [state.selectedRowIndices, onSelectionChange]);

  const value: ExcelGridContextValue = useMemo(
    () => ({
      state,
      store,
      gridRef,
      getOriginalRowIndexRef,
      getEditingValue,
      editable: !!editable,
      onChange,
      sortable,
      searchPlaceholder,
      columnFilter,
      columnReorder,
      pagination,
      virtualScroll,
      pinnedRowCount,
      multiSelect,
      rowDraggable,
      onDropRows,
      onAddRow,
      exportFileName,
      exportImportDelimiter,
      onImport,
    }),
    [
      state,
      store,
      getEditingValue,
      editable,
      onChange,
      sortable,
      searchPlaceholder,
      columnFilter,
      columnReorder,
      pagination,
      virtualScroll,
      pinnedRowCount,
      multiSelect,
      rowDraggable,
      onDropRows,
      onAddRow,
      exportFileName,
      exportImportDelimiter,
      onImport,
    ]
  );

  return (
    <ExcelGridContext.Provider value={value}>
      {children}
    </ExcelGridContext.Provider>
  );
};

export { ExcelGridContext };
