import type { RowData, ColumnDef, SortDirection } from '../types';
import { getColumnByIndex } from './columnModel';
import { getCellValue } from './rowModel';

/** 검색어가 행의 어떤 셀에 포함되는지 (대소문자 무시) */
export const rowMatchesSearch = (row: RowData, columns: ColumnDef[], searchText: string): boolean => {
  if (!searchText.trim()) return true;
  const lower = searchText.trim().toLowerCase();
  return columns.some((col) => {
    if (col.field === '__checkbox__') return false;
    const v = getCellValue(row, col.field);
    return String(v ?? '').toLowerCase().includes(lower);
  });
};

/** 정렬 비교 (숫자/문자 자동) */
const compare = (a: unknown, b: unknown): number => {
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true });
};

export interface DisplayRow {
  row: RowData;
  originalIndex: number;
}

/** 필터 타입별 일치 여부 */
const matchesFilter = (
  value: unknown,
  filterValue: string,
  col: ColumnDef
): boolean => {
  const trimmed = filterValue.trim();
  if (!trimmed) return true;

  if (col.filterType === 'custom' && col.filterFn) {
    return col.filterFn(value, trimmed);
  }
  if (col.filterType === 'number') {
    const n = Number(value);
    const nFilter = Number(trimmed);
    if (!Number.isNaN(n) && !Number.isNaN(nFilter)) return n === nFilter;
    return String(value ?? '').toLowerCase().includes(trimmed.toLowerCase());
  }
  if (col.filterType === 'date') {
    const d = value instanceof Date ? value.getTime() : new Date(String(value)).getTime();
    const dFilter = new Date(trimmed).getTime();
    if (!Number.isNaN(d) && !Number.isNaN(dFilter)) return d === dFilter;
    return String(value ?? '').toLowerCase().includes(trimmed.toLowerCase());
  }
  // text (default)
  return String(value ?? '').toLowerCase().includes(trimmed.toLowerCase());
};

/** 컬럼별 필터에 맞는지 (데이터 컬럼 인덱스 -> 검색어, filterType 적용) */
const rowMatchesColumnFilters = (
  row: RowData,
  columns: ColumnDef[],
  columnFilters: Record<number, string>
): boolean => {
  const dataCols = columns.filter((c) => c.field !== '__checkbox__' && c.field !== '__drag__');
  return dataCols.every((col, dataIdx) => {
    const filter = columnFilters[dataIdx];
    if (!filter?.trim()) return true;
    const v = getCellValue(row, col.field);
    return matchesFilter(v, filter, col);
  });
};

/** 필터 후 정렬하여 표시용 행 배열 반환 */
export const getDisplayedRows = (
  rows: RowData[],
  columns: ColumnDef[],
  searchText: string,
  sortBy: { col: number; dir: SortDirection } | null,
  columnFilters: Record<number, string> = {}
): DisplayRow[] => {
  const withIndex = rows
    .map((row, originalIndex) => ({ row, originalIndex }))
    .filter(({ row }) => rowMatchesSearch(row, columns, searchText))
    .filter(({ row }) => rowMatchesColumnFilters(row, columns, columnFilters));

  if (!sortBy) return withIndex;

  const colDef = getColumnByIndex(columns, sortBy.col);
  if (!colDef || colDef.field === '__checkbox__') return withIndex;

  const sorted = [...withIndex].sort((a, b) => {
    const va = getCellValue(a.row, colDef.field);
    const vb = getCellValue(b.row, colDef.field);
    const c = compare(va, vb);
    return sortBy.dir === 'asc' ? c : -c;
  });
  return sorted;
};
