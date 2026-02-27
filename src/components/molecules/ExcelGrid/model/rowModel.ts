import type { RowData } from '../types';

/** 행 인덱스 → row 객체 */
export const getRowByIndex = (rows: RowData[], rowIndex: number): RowData | undefined =>
  rows[rowIndex];

/** 셀 값 조회 (row, column field) */
export const getCellValue = (row: RowData, field: string): unknown => row[field];

/** 셀 값 설정 (불변 업데이트용) */
export const setCellValue = (
  rows: RowData[],
  rowIndex: number,
  field: string,
  value: unknown
): RowData[] => {
  const next = rows.map((r, i) =>
    i === rowIndex ? { ...r, [field]: value } : r
  );
  return next;
};

/** 유효 행 인덱스 범위 */
export const clampRowIndex = (rows: RowData[], row: number): number =>
  Math.max(0, Math.min(row, rows.length - 1));
