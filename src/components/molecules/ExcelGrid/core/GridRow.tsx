import type { RowData, ColumnDef } from '../types';
import { GridCell } from './GridCell';
import { isCellInRange } from '../model/rangeModel';
import { getPinnedOffset } from '../model/columnModel';
import { Checkbox } from '../../Checkbox';
import { cn } from '../../../../utils/cn';
import { createDragPreview } from '../utils/dragPreview';

export interface GridRowProps {
  rowIndex: number;
  row: RowData;
  columns: ColumnDef[];
  focusedCell: { row: number; col: number } | null;
  selectedRange: { start: { row: number; col: number }; end: { row: number; col: number } } | null;
  editingCell: { row: number; col: number } | null;
  checkboxSelection?: boolean;
  isRowSelected?: boolean;
  onToggleRowSelection?: () => void;
  isPinned?: boolean;
  pinnedRowIndex?: number;
  rowDraggable?: boolean;
  rowHeight?: number;
  /** multiSelect 시 행 클릭 시 호출 (Ctrl/Shift 클릭 처리) */
  onRowClick?: (e: React.MouseEvent) => void;
  /** 멀티 드래그: 표시 행 인덱스 배열 → RowData[] (선택된 행/범위 일괄 드래그용) */
  getRowsForIndices?: (indices: number[]) => RowData[];
  /** 선택된 행 인덱스 (멀티 드래그 시 이 행들 전체 전달) */
  selectedRowIndices?: number[];
  className?: string;
}

const EXCEL_GRID_ROWS_TYPE = 'application/x-excelgrid-rows';

/** 행 한 줄: pinned 셀 스타일, 행 드래그 지원 */
export const GridRow = ({
  rowIndex,
  row,
  columns,
  focusedCell,
  selectedRange,
  editingCell,
  checkboxSelection,
  isRowSelected,
  onToggleRowSelection,
  isPinned,
  pinnedRowIndex = 0,
  rowDraggable,
  rowHeight,
  onRowClick,
  getRowsForIndices,
  selectedRowIndices = [],
  className,
}: GridRowProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (!rowDraggable) return;

    let rowsToDrag: RowData[];
    if (getRowsForIndices && selectedRowIndices.length > 1 && selectedRowIndices.includes(rowIndex)) {
      rowsToDrag = getRowsForIndices(selectedRowIndices);
    } else if (
      getRowsForIndices &&
      selectedRange &&
      selectedRange.start.row !== selectedRange.end.row
    ) {
      const rMin = Math.min(selectedRange.start.row, selectedRange.end.row);
      const rMax = Math.max(selectedRange.start.row, selectedRange.end.row);
      if (rowIndex >= rMin && rowIndex <= rMax) {
        const indices = Array.from({ length: rMax - rMin + 1 }, (_, i) => rMin + i);
        rowsToDrag = getRowsForIndices(indices);
      } else {
        rowsToDrag = [row];
      }
    } else {
      rowsToDrag = [row];
    }

    if (rowsToDrag.length === 0) rowsToDrag = [row];

    e.dataTransfer.setData(EXCEL_GRID_ROWS_TYPE, JSON.stringify(rowsToDrag));
    e.dataTransfer.effectAllowed = 'copy';

    createDragPreview(rowsToDrag, columns, e.dataTransfer);

    const tr = e.currentTarget as HTMLTableRowElement;
    tr.style.cursor = 'grabbing';
  };
  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLTableRowElement).style.cursor = 'grab';
  };

  const rowStyle: React.CSSProperties = {
    ...(rowHeight != null ? { height: rowHeight, minHeight: rowHeight } : {}),
    ...(rowDraggable ? { cursor: 'grab' } : {}),
    ...(isPinned
      ? {
          position: 'sticky',
          top: pinnedRowIndex * (rowHeight ?? 32),
          zIndex: 5,
          background: 'white',
          boxShadow: '0 1px 0 #e5e7eb',
        }
      : {}),
  };

  return (
    <tr
      className={cn(className, isRowSelected && 'bg-blue-50')}
      draggable={rowDraggable}
      onDragStart={rowDraggable ? handleDragStart : undefined}
      onDragEnd={rowDraggable ? handleDragEnd : undefined}
      style={Object.keys(rowStyle).length > 0 ? rowStyle : undefined}
      title={rowDraggable ? '행을 잡아 다른 그리드로 드래그하세요' : undefined}
      aria-label={rowDraggable ? `행 ${rowIndex + 1} 드래그 가능` : undefined}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
        if (onRowClick) {
          onRowClick(e);
          return;
        }
        if (checkboxSelection && onToggleRowSelection) onToggleRowSelection();
      }}
    >
      {columns.map((col, colIndex) => {
        const leftPx = col.pinned === 'left' ? getPinnedOffset(columns, colIndex, 'left') : undefined;
        const rightPx = col.pinned === 'right' ? getPinnedOffset(columns, colIndex, 'right') : undefined;
        const pinnedStyle: React.CSSProperties =
          leftPx !== undefined
            ? { position: 'sticky', left: leftPx, zIndex: 4, background: 'white', boxShadow: '2px 0 2px -2px rgba(0,0,0,0.08)' }
            : rightPx !== undefined
              ? { position: 'sticky', right: rightPx, zIndex: 4, background: 'white', boxShadow: '-2px 0 2px -2px rgba(0,0,0,0.08)' }
              : {};

        if (col.field === '__drag__') {
          return (
            <td
              key={col.field}
              className="border-b border-r border-gray-200 px-1 py-1 text-center align-middle"
              style={{ ...(col.width != null ? { width: col.width, minWidth: col.width } : {}), ...pinnedStyle }}
              onClick={(e) => e.stopPropagation()}
              aria-hidden
            >
              <span className="inline-flex cursor-grab text-gray-400 hover:text-gray-600 select-none" title="행 잡아 드래그">⋮⋮</span>
            </td>
          );
        }
        if (col.field === '__checkbox__' && checkboxSelection) {
          return (
            <td
              key={col.field}
              className="border-b border-r border-gray-200 px-2 py-1 text-sm w-10"
              style={{ ...(col.width != null ? { width: col.width, minWidth: col.width } : {}), ...pinnedStyle }}
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={!!isRowSelected}
                onChange={() => onToggleRowSelection?.()}
                aria-label={`행 ${rowIndex + 1} 선택`}
              />
            </td>
          );
        }
        const value = row[col.field];
        const focused =
          focusedCell !== null && focusedCell.row === rowIndex && focusedCell.col === colIndex;
        const selected =
          selectedRange !== null && isCellInRange(rowIndex, colIndex, selectedRange);
        const editing =
          editingCell !== null && editingCell.row === rowIndex && editingCell.col === colIndex;
        return (
          <GridCell
            key={col.field}
            value={value}
            focused={focused}
            selected={selected}
            editing={editing}
            rowIndex={rowIndex}
            colIndex={colIndex}
            width={col.width}
            editor={col.editor}
            dropdownOptions={col.dropdownOptions}
            pinnedStyle={pinnedStyle}
          />
        );
      })}
    </tr>
  );
};
