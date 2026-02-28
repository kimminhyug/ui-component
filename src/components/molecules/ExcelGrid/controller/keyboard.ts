import type { GridStoreApi } from '../state/gridStore';
import { moveFocusBy } from './selection';
import { getColumnByIndex, getDisplayColumns } from '../model/columnModel';
import { getCellValue, setCellValue } from '../model/rowModel';
import { copySelection, pasteAtFocus } from './clipboard';

export interface KeyboardControllerOptions {
  store: GridStoreApi;
  editable: boolean;
  onChange?: (rowIndex: number, colIndex: number, value: unknown) => void;
  onCellChange?: (rowIndex: number, colIndex: number, prevValue: unknown, nextValue: unknown) => void;
  getEditingValue?: () => string | undefined;
  getOriginalRowIndex?: (displayedRow: number) => number;
}

export interface KeyDownHandlerResult {
  handleKeyDown: (event: React.KeyboardEvent) => void;
  /** 편집 셀 커밋(blur 시 호출). 입력 끝났을 때 감지용 */
  commitEditingCell: () => void;
}

/** 그리드별 키다운 핸들러 생성 */
export const createKeyDownHandler = (options: KeyboardControllerOptions): KeyDownHandlerResult => {
  const { store } = options;

  const commitEditingCell = (): void => {
    const state = store.getState();
    const { editingCell, rows, columns, columnOrder } = state;
    if (!editingCell || !options.getEditingValue) return;
    const displayCols = getDisplayColumns(columns, columnOrder);
    const colDef = getColumnByIndex(displayCols, editingCell.col);
    if (!colDef || colDef.field === '__checkbox__') return;
    const value = options.getEditingValue();
    const originalRow = options.getOriginalRowIndex?.(editingCell.row) ?? editingCell.row;
    const prevValue = getCellValue(rows[originalRow], colDef.field);
    const nextRows = setCellValue(rows, originalRow, colDef.field, value);
    store.setRows(nextRows);
    if (options.onChange) options.onChange(originalRow, editingCell.col, value);
    if (options.onCellChange && String(prevValue ?? '') !== String(value ?? '')) {
      options.onCellChange(originalRow, editingCell.col, prevValue, value);
    }
    store.setState({ editingCell: null });
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    const state = store.getState();
    const { focusedCell, editingCell, rows, columns, columnOrder } = state;
    const displayCols = getDisplayColumns(columns, columnOrder);
    if (displayCols.length === 0 || rows.length === 0) return;

    const focus = focusedCell ?? { row: 0, col: 0 };

    if (editingCell) {
      if (event.key === 'Enter') {
        event.preventDefault();
        commitEditingCell();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        store.setState({ editingCell: null });
      } else if (event.key === 'Tab') {
        event.preventDefault();
        commitEditingCell();
        moveFocusBy(store, 0, event.shiftKey ? -1 : 1);
      }
      return;
    }

    if (event.key === 'c' && (event.metaKey || event.ctrlKey)) {
      const text = copySelection(store, { editable: options.editable });
      if (text) {
        event.preventDefault();
        void navigator.clipboard.writeText(text);
      }
      return;
    }
    if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (editingCell) commitEditingCell();
      if (!options.editable) return;
      navigator.clipboard.readText().then((t) => {
        pasteAtFocus(store, t, {
          onChange: options.onChange,
          onCellChange: options.onCellChange,
          getOriginalRowIndex: options.getOriginalRowIndex,
          editable: options.editable,
        });
      });
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        moveFocusBy(store, -1, 0);
        return;
      case 'ArrowDown':
        event.preventDefault();
        moveFocusBy(store, 1, 0);
        return;
      case 'ArrowLeft':
        event.preventDefault();
        moveFocusBy(store, 0, -1);
        return;
      case 'ArrowRight':
        event.preventDefault();
        moveFocusBy(store, 0, 1);
        return;
      case 'Enter':
        event.preventDefault();
        if (options.editable) {
          const colDef = getColumnByIndex(displayCols, focus.col);
          if (colDef?.field !== '__checkbox__' && colDef?.editable !== false) {
            store.setState({ editingCell: focus });
          }
        } else {
          moveFocusBy(store, 1, 0);
        }
        return;
      case 'Tab':
        event.preventDefault();
        if (event.shiftKey) moveFocusBy(store, 0, -1);
        else moveFocusBy(store, 0, 1);
        return;
      default:
        break;
    }
  };

  return { handleKeyDown, commitEditingCell };
};
