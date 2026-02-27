import type { CellCoord } from '../types';
import { getState, setState } from './gridStore';

export const getEditingCell = (): CellCoord | null => getState().editingCell;

export const setEditingCell = (cell: CellCoord | null): void => {
  setState({ editingCell: cell });
};

export const isEditing = (row: number, col: number): boolean => {
  const editing = getEditingCell();
  return editing !== null && editing.row === row && editing.col === col;
};
