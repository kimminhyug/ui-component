import type { GridStoreApi } from '../state/gridStore';
import { getColumnByIndex } from '../model/columnModel';
import { moveFocus, extendSelection } from './selection';

const CELL_SELECTOR = '[data-row][data-col]';

export interface MouseControllerOptions {
  editable: boolean;
  /** 다른 셀 클릭 시 현재 편집 셀 커밋 (값 반영 후 편집 모드 해제) */
  commitEditingCell?: () => void;
}

const getCellFromEvent = (e: React.PointerEvent): { row: number; col: number } | null => {
  const el = (e.target as HTMLElement).closest(CELL_SELECTOR);
  if (!el) return null;
  const row = el.getAttribute('data-row');
  const col = el.getAttribute('data-col');
  if (row == null || col == null) return null;
  return { row: parseInt(row, 10), col: parseInt(col, 10) };
};

/** select/input/button 클릭 시 기본 동작(드롭다운 열기 등)이 막히지 않도록 */
const isInteractiveTarget = (e: React.PointerEvent): boolean =>
  !!(e.target as HTMLElement).closest?.('select, input, button, [role="combobox"]');

/** 그리드별 포인터 핸들러 생성 (스토어별로 isDragSelecting 분리) */
export const createPointerHandlers = (
  store: GridStoreApi,
  options: MouseControllerOptions
) => {
  let isDragSelecting = false;

  const handlePointerDown = (e: React.PointerEvent): void => {
    const cell = getCellFromEvent(e);
    if (!cell) return;
    const state = store.getState();
    const { editingCell } = state;
    const isClickingOtherCell =
      editingCell && (editingCell.row !== cell.row || editingCell.col !== cell.col);
    if (isClickingOtherCell && options.commitEditingCell) {
      options.commitEditingCell();
    }
    if (isInteractiveTarget(e)) {
      moveFocus(store, cell.row, cell.col);
      return;
    }
    e.preventDefault();
    isDragSelecting = true;
    moveFocus(store, cell.row, cell.col);
  };

  const handlePointerMove = (e: React.PointerEvent): void => {
    if (!isDragSelecting) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;
    extendSelection(store, cell.row, cell.col);
  };

  const handlePointerUp = (): void => {
    isDragSelecting = false;
  };

  const handleDoubleClick = (e: React.MouseEvent): void => {
    const cell = getCellFromEvent(e as unknown as React.PointerEvent);
    if (!cell || !options.editable) return;
    const { columns } = store.getState();
    const colDef = getColumnByIndex(columns, cell.col);
    if (colDef?.editable === false) return;
    store.setState({ editingCell: cell });
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
  };
};
