import type { CellCoord, Range } from '../types';
import { getState, setState } from './gridStore';

export const getFocusedCell = (): CellCoord | null => getState().focusedCell;

export const getSelectedRange = (): Range | null => getState().selectedRange;

export const setFocusedCell = (cell: CellCoord | null): void => {
  setState({ focusedCell: cell });
};

export const setSelectedRange = (range: Range | null): void => {
  setState({ selectedRange: range });
};

/** 포커스 이동 시 선택 영역을 해당 셀만으로 갱신 */
export const setFocusAndSelection = (cell: CellCoord): void => {
  setState({
    focusedCell: cell,
    selectedRange: { start: cell, end: cell },
  });
};
