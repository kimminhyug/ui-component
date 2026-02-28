import type { ColumnDef } from '../types';

const DEFAULT_COL_WIDTH = 100;

/** AG Grid 호환: pinned true → 'left', initialPinned 보조 적용 */
export const getEffectivePinned = (col: ColumnDef): 'left' | 'right' | undefined => {
  const p = col.pinned;
  if (p === true || p === 'left') return 'left';
  if (p === 'right') return 'right';
  const init = col.initialPinned;
  if (init === true || init === 'left') return 'left';
  if (init === 'right') return 'right';
  return undefined;
};

/** pinned 컬럼용 sticky left/right 픽셀 값 (displayColumns 기준) */
export const getPinnedOffset = (
  columns: ColumnDef[],
  colIndex: number,
  side: 'left' | 'right'
): number => {
  const col = columns[colIndex];
  if (!col || getEffectivePinned(col) !== side) return 0;
  const w = (i: number) => (columns[i]?.width ?? DEFAULT_COL_WIDTH);
  if (side === 'left') {
    let sum = 0;
    for (let i = 0; i < colIndex; i++) if (getEffectivePinned(columns[i]!) === 'left') sum += w(i);
    return sum;
  }
  let sum = 0;
  for (let i = colIndex + 1; i < columns.length; i++)
    if (getEffectivePinned(columns[i]!) === 'right') sum += w(i);
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

/** pinned 컬럼이 있을 때 가로 스크롤이 생기도록 테이블 최소 너비 (px) */
export const getTableMinWidth = (columns: ColumnDef[]): number =>
  columns.reduce((sum, c) => sum + (c.width ?? DEFAULT_COL_WIDTH), 0);

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
  const left = reordered.filter((c) => getEffectivePinned(c) === 'left');
  const center = reordered.filter((c) => getEffectivePinned(c) !== 'left' && getEffectivePinned(c) !== 'right');
  const right = reordered.filter((c) => getEffectivePinned(c) === 'right');
  const ordered = [...left, ...center, ...right];
  const prefix = [...(hasDrag ? [columns[0]] : []), ...(hasCheckbox ? [columns[hasDrag ? 1 : 0]] : [])];
  return [...prefix, ...ordered];
};
