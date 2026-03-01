import type { GridStoreApi } from '../state/gridStore';
import { getColumnByIndex } from '../model/columnModel';
import { moveFocus, extendSelection } from './selection';

const CELL_SELECTOR = '[data-row][data-col]';
/** 행 드래그(순서 변경/다른 그리드로 이동) 핸들 — 이 영역에서는 셀 선택/드래그 선택 하지 않음 */
const ROW_DRAG_HANDLE_SELECTOR = '[data-row-drag-handle]';

export interface MouseControllerOptions {
  editable: boolean;
  /** 다른 셀 클릭 시 현재 편집 셀 커밋 (값 반영 후 편집 모드 해제) */
  commitEditingCell?: () => void;
  /** 다중 행 선택 시 드래그로 행 범위도 selectedRowIndices에 반영 */
  multiSelect?: boolean;
  /** 표시 행 개수 (행 범위 클램프용) */
  totalDisplayedRows?: number;
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
    if ((e.target as HTMLElement).closest?.(ROW_DRAG_HANDLE_SELECTOR)) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;
    const state = store.getState();
    const { editingCell, focusedCell } = state;
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
    if (e.shiftKey && focusedCell) {
      extendSelection(store, cell.row, cell.col);
      isDragSelecting = false;
      return;
    }
    isDragSelecting = true;
    moveFocus(store, cell.row, cell.col);
  };

  const handlePointerMove = (e: React.PointerEvent): void => {
    if (!isDragSelecting) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;
    extendSelection(store, cell.row, cell.col);
    if (options.multiSelect && options.totalDisplayedRows != null) {
      const s = store.getState();
      const range = s.selectedRange;
      if (range) {
        const minR = Math.max(0, Math.min(range.start.row, range.end.row));
        const maxR = Math.min(options.totalDisplayedRows - 1, Math.max(range.start.row, range.end.row));
        const indices = Array.from({ length: maxR - minR + 1 }, (_, i) => minR + i);
        store.setSelectedRowIndices(indices);
      }
    }
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
