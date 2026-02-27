import type { CellCoord } from '../types';
import type { GridStoreApi } from '../state/gridStore';
import { clampRowIndex } from '../model/rowModel';
import { clampColIndex as clampCol } from '../model/columnModel';

/** 포커스 이동 + 선택 영역을 해당 셀로 */
export const moveFocus = (store: GridStoreApi, row: number, col: number): void => {
  const rows = store.getState().rows;
  const cols = store.getState().columns;
  if (rows.length === 0 || cols.length === 0) return;
  const r = clampRowIndex(rows, row);
  const c = clampCol(cols, col);
  store.setState({
    focusedCell: { row: r, col: c },
    selectedRange: { start: { row: r, col: c }, end: { row: r, col: c } },
  });
};

/** 드래그로 선택 영역만 확장 (focus는 end로) */
export const extendSelection = (store: GridStoreApi, endRow: number, endCol: number): void => {
  const state = store.getState();
  const focus = state.focusedCell;
  const rows = state.rows;
  const cols = state.columns;
  if (!focus || rows.length === 0 || cols.length === 0) return;
  const r = clampRowIndex(rows, endRow);
  const c = clampCol(cols, endCol);
  store.setState({
    focusedCell: { row: r, col: c },
    selectedRange: { start: focus, end: { row: r, col: c } },
  });
};

/** 현재 포커스 셀 기준으로 (dRow, dCol)만큼 이동 */
export const moveFocusBy = (store: GridStoreApi, dRow: number, dCol: number): CellCoord | null => {
  const state = store.getState();
  const focus = state.focusedCell;
  const rows = state.rows;
  const cols = state.columns;
  if (!focus || rows.length === 0 || cols.length === 0) return null;
  const r = clampRowIndex(rows, focus.row + dRow);
  const c = clampCol(cols, focus.col + dCol);
  moveFocus(store, r, c);
  return { row: r, col: c };
};
