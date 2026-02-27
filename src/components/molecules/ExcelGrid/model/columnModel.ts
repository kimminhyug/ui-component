import type { ColumnDef } from '../types';

const DEFAULT_COL_WIDTH = 100;

/** pinned 컬럼용 sticky left/right 픽셀 값 (displayColumns 기준) */
export const getPinnedOffset = (
  columns: ColumnDef[],
  colIndex: number,
  side: 'left' | 'right'
): number => {
  const col = columns[colIndex];
  if (!col || col.pinned !== side) return 0;
  const w = (i: number) => (columns[i]?.width ?? DEFAULT_COL_WIDTH);
  if (side === 'left') {
    let sum = 0;
    for (let i = 0; i < colIndex; i++) if (columns[i]?.pinned === 'left') sum += w(i);
    return sum;
  }
  let sum = 0;
  for (let i = colIndex + 1; i < columns.length; i++) if (columns[i]?.pinned === 'right') sum += w(i);
  return sum;
};

/** 컬럼 인덱스 → ColumnDef */
export const getColumnByIndex = (columns: ColumnDef[], colIndex: number): ColumnDef | undefined =>
  columns[colIndex];

/** 필드명 → 컬럼 인덱스 */
export const getColIndexByField = (columns: ColumnDef[], field: string): number =>
  columns.findIndex((c) => c.field === field);

/** 유효 컬럼 인덱스 범위 */
export const clampColIndex = (columns: ColumnDef[], col: number): number =>
  Math.max(0, Math.min(col, columns.length - 1));

/** columnOrder(데이터 컬럼 인덱스 배열)로 재정렬 후 pinned(left → center → right) 순서로 반환. __drag__, __checkbox__는 항상 앞에 유지 */
export const getDisplayColumns = (
  columns: ColumnDef[],
  columnOrder: number[]
): ColumnDef[] => {
  const hasDrag = columns[0]?.field === '__drag__';
  const hasCheckbox = columns[hasDrag ? 1 : 0]?.field === '__checkbox__';
  const dataStart = (hasDrag ? 1 : 0) + (hasCheckbox ? 1 : 0);
  const dataCols = columns.slice(dataStart);
  if (columnOrder.length === 0 || columnOrder.length !== dataCols.length) {
    return columns;
  }
  const reordered = columnOrder.map((i) => dataCols[i]).filter(Boolean);
  const left = reordered.filter((c) => c.pinned === 'left');
  const center = reordered.filter((c) => c.pinned !== 'left' && c.pinned !== 'right');
  const right = reordered.filter((c) => c.pinned === 'right');
  const ordered = [...left, ...center, ...right];
  const prefix = [...(hasDrag ? [columns[0]] : []), ...(hasCheckbox ? [columns[hasDrag ? 1 : 0]] : [])];
  return [...prefix, ...ordered];
};
