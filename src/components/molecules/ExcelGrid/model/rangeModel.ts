import type { Range } from '../types';

/** 셀 (row, col)이 range 안에 있는지 (순수 함수) */
export const isCellInRange = (row: number, col: number, range: Range): boolean => {
  const rMin = Math.min(range.start.row, range.end.row);
  const rMax = Math.max(range.start.row, range.end.row);
  const cMin = Math.min(range.start.col, range.end.col);
  const cMax = Math.max(range.start.col, range.end.col);
  return row >= rMin && row <= rMax && col >= cMin && col <= cMax;
};
