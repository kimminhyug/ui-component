import type { GridStoreApi } from '../state/gridStore';
import { moveFocusBy } from './selection';
import { getColumnByIndex, getDisplayColumns } from '../model/columnModel';
import { setCellValue } from '../model/rowModel';
import { copySelection, pasteAtFocus } from './clipboard';

export interface KeyboardControllerOptions {
  store: GridStoreApi;
  editable: boolean;
  onChange?: (rowIndex: number, colIndex: number, value: unknown) => void;
  getEditingValue?: () => string | undefined;
  getOriginalRowIndex?: (displayedRow: number) => number;
}

/** 그리드별 키다운 핸들러 생성 */
export const createKeyDownHandler = (options: KeyboardControllerOptions) => {
  const { store } = options;

  const commitEditingCell = (): void => {
    const state = store.getState();
    const { editingCell, rows, columns, columnOrder } = state;
    if (!editingCell || !options.getEditingValue || !options.onChange) return;
    const displayCols = getDisplayColumns(columns, columnOrder);
    const colDef = getColumnByIndex(displayCols, editingCell.col);
    if (!colDef || colDef.field === '__checkbox__') return;
    const value = options.getEditingValue();
    const originalRow = options.getOriginalRowIndex?.(editingCell.row) ?? editingCell.row;
    const nextRows = setCellValue(rows, originalRow, colDef.field, value);
    store.setRows(nextRows);
    options.onChange(originalRow, editingCell.col, value);
    store.setState({ editingCell: null });
  };

  return (event: React.KeyboardEvent): void => {
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
};
