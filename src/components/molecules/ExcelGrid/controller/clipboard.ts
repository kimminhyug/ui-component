import type { GridStoreApi } from '../state/gridStore';
import { getCellValue, setCellValue } from '../model/rowModel';
import { getColumnByIndex, getDisplayColumns } from '../model/columnModel';

export interface CopyOptions {
  editable?: boolean;
}

/** 선택 영역을 텍스트로 복사 (탭 구분). editable 시 편집 가능 셀만 복사 */
export const copySelection = (store: GridStoreApi, opts: CopyOptions = {}): string => {
  const state = store.getState();
  const { rows, columns, selectedRange, columnOrder } = state;
  const displayCols = getDisplayColumns(columns, columnOrder);
  if (!selectedRange || rows.length === 0 || displayCols.length === 0) return '';
  if (opts.editable === false) return '';

  const rMin = Math.min(selectedRange.start.row, selectedRange.end.row);
  const rMax = Math.max(selectedRange.start.row, selectedRange.end.row);
  const cMin = Math.min(selectedRange.start.col, selectedRange.end.col);
  const cMax = Math.max(selectedRange.start.col, selectedRange.end.col);

  const lines: string[] = [];
  for (let r = rMin; r <= rMax; r++) {
    const row = rows[r];
    if (!row) continue;
    const cells: string[] = [];
    for (let c = cMin; c <= cMax; c++) {
      const col = getColumnByIndex(displayCols, c);
      if (col?.field === '__checkbox__') continue;
      if (opts.editable === true && col?.editable === false) continue;
      const val = col ? getCellValue(row, col.field) : undefined;
      cells.push(String(val ?? ''));
    }
    lines.push(cells.join('\t'));
  }
  return lines.join('\n');
};

export interface PasteOptions {
  onChange?: (rowIndex: number, colIndex: number, value: unknown) => void;
  onCellChange?: (rowIndex: number, colIndex: number, prevValue: unknown, nextValue: unknown) => void;
  getOriginalRowIndex?: (displayedRow: number) => number;
  editable?: boolean;
}

/** 클립보드 텍스트를 현재 포커스 위치부터 붙여넣기 */
export const pasteAtFocus = (store: GridStoreApi, text: string, opts: PasteOptions = {}): void => {
  const state = store.getState();
  const { rows, columns, focusedCell, columnOrder } = state;
  const displayCols = getDisplayColumns(columns, columnOrder);
  if (rows.length === 0 || displayCols.length === 0) return;
  if (opts.editable === false) return;
  const focus = focusedCell ?? { row: 0, col: 0 };

  const lines = text.split(/\r?\n/).filter((line) => line.length > 0 || text.includes('\n'));
  if (lines.length === 0) return;

  const parsed: string[][] = lines.map((line) => line.split('\t'));
  let nextRows = [...rows];

  const getOriginal = opts.getOriginalRowIndex ?? ((i: number) => i);
  for (let dr = 0; dr < parsed.length; dr++) {
    const displayedRowIndex = focus.row + dr;
    const rowIndex = getOriginal(displayedRowIndex);
    if (rowIndex < 0 || rowIndex >= nextRows.length) continue;
    const line = parsed[dr];
    if (!line) continue;
    for (let dc = 0; dc < line.length; dc++) {
      const colIndex = focus.col + dc;
      if (colIndex >= displayCols.length) break;
      const colDef = getColumnByIndex(displayCols, colIndex);
      if (!colDef || colDef.field === '__checkbox__') continue;
      if (colDef.editable === false) continue;
      const value = line[dc];
      const prevValue = getCellValue(nextRows[rowIndex], colDef.field);
      nextRows = setCellValue(nextRows, rowIndex, colDef.field, value);
      opts.onChange?.(rowIndex, colIndex, value);
      if (opts.onCellChange && String(prevValue ?? '') !== String(value ?? '')) {
        opts.onCellChange(rowIndex, colIndex, prevValue, value);
      }
    }
  }

  store.setRows(nextRows);
};
