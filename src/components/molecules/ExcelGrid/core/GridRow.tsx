import type { RowData, ColumnDef } from '../types';
import { GridCell } from './GridCell';
import { isCellInRange } from '../model/rangeModel';
import { getPinnedOffset, getEffectivePinned } from '../model/columnModel';
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
  /** 행 순서 변경용 드래그 핸들 컬럼(display 인덱스). 이 컬럼에 핸들 표시 */
  rowDragColumnIndex?: number;
  /** 행 순서 변경 드롭 시 (fromDisplayedIndex, toDisplayedIndex) */
  onRowReorderDrop?: (fromDisplayedIndex: number, toDisplayedIndex: number) => void;
  rowHeight?: number;
  /** multiSelect 시 행 클릭 시 호출 (Ctrl/Shift 클릭 처리) */
  onRowClick?: (e: React.MouseEvent) => void;
  /** 멀티 드래그: 표시 행 인덱스 배열 → RowData[] (선택된 행/범위 일괄 드래그용) */
  getRowsForIndices?: (indices: number[]) => RowData[];
  /** 선택된 행 인덱스 (멀티 드래그 시 이 행들 전체 전달) */
  selectedRowIndices?: number[];
  /** 이 행이 로딩 중이면 true (셀 대신 로딩 표시) */
  isRowLoading?: boolean;
  /** 셀별 추가 className */
  getCellClassName?: (rowIndex: number, colIndex: number) => string | undefined;
  /** 편집 셀 blur 시 편집 모드 종료 */
  onEditingBlur?: () => void;
  /** 편집 중 값 변경 시 실시간 반영 */
  onEditingChange?: (value: string) => void;
  className?: string;
}

const EXCEL_GRID_ROWS_TYPE = 'application/x-excelgrid-rows';
const ROW_REORDER_TYPE = 'application/x-excelgrid-row-reorder';

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
  rowDragColumnIndex,
  onRowReorderDrop,
  rowHeight,
  onRowClick,
  getRowsForIndices,
  selectedRowIndices = [],
  isRowLoading,
  getCellClassName,
  onEditingBlur,
  onEditingChange,
  className,
}: GridRowProps) => {
  const handleRowReorderDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(ROW_REORDER_TYPE, JSON.stringify({ fromDisplayedIndex: rowIndex }));
    e.dataTransfer.effectAllowed = 'move';
    e.stopPropagation();
    createDragPreview([row], columns, e.dataTransfer);
  };

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

  const handleRowReorderDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(ROW_REORDER_TYPE) || !onRowReorderDrop) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleRowReorderDrop = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(ROW_REORDER_TYPE) || !onRowReorderDrop) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      const raw = e.dataTransfer.getData(ROW_REORDER_TYPE);
      const { fromDisplayedIndex } = JSON.parse(raw) as { fromDisplayedIndex: number };
      if (typeof fromDisplayedIndex === 'number') onRowReorderDrop(fromDisplayedIndex, rowIndex);
    } catch {
      // ignore
    }
  };

  const rowStyle: React.CSSProperties = {
    ...(rowHeight != null ? { height: rowHeight, minHeight: rowHeight } : {}),
    ...(rowDraggable ? { cursor: 'grab' } : {}),
    ...(isPinned
      ? {
          position: 'sticky',
          top: pinnedRowIndex * (rowHeight ?? 32),
          zIndex: 5,
        }
      : {}),
  };

  if (isRowLoading) {
    return (
      <tr className={cn(className, 'bg-gray-50 dark:bg-gray-800/80')} aria-busy>
        <td colSpan={columns.length} className="border-b border-gray-200 dark:border-gray-700 px-2 py-2 text-center">
          <span className="inline-flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
            <span className="animate-pulse w-4 h-4 rounded bg-gray-200" aria-hidden />
            로딩 중...
          </span>
        </td>
      </tr>
    );
  }

  return (
    <tr
      className={cn(
        className,
        isRowSelected && 'bg-blue-50 dark:bg-blue-900/25',
        isPinned && 'bg-white dark:bg-gray-800 shadow-[0_1px_0_0_rgba(229,231,235,1)] dark:shadow-[0_1px_0_0_rgba(55,65,81,1)]'
      )}
      draggable={rowDraggable}
      onDragStart={rowDraggable ? handleDragStart : undefined}
      onDragEnd={rowDraggable ? handleDragEnd : undefined}
      onDragOver={onRowReorderDrop ? handleRowReorderDragOver : undefined}
      onDrop={onRowReorderDrop ? handleRowReorderDrop : undefined}
      style={Object.keys(rowStyle).length > 0 ? rowStyle : undefined}
      title={rowDraggable ? '행을 잡아 다른 그리드로 드래그하세요' : undefined}
      aria-label={rowDraggable ? `행 ${rowIndex + 1} 드래그 가능` : undefined}
      data-row-index={rowIndex}
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
        const pinned = getEffectivePinned(col);
        const leftPx = pinned === 'left' ? getPinnedOffset(columns, colIndex, 'left') : undefined;
        const rightPx = pinned === 'right' ? getPinnedOffset(columns, colIndex, 'right') : undefined;
        const pinnedStyle: React.CSSProperties =
          leftPx !== undefined
            ? { position: 'sticky', left: leftPx, zIndex: 4, boxShadow: '2px 0 2px -2px rgba(0,0,0,0.08)' }
            : rightPx !== undefined
              ? { position: 'sticky', right: rightPx, zIndex: 4, boxShadow: '-2px 0 2px -2px rgba(0,0,0,0.08)' }
              : {};
        const pinnedCellClass = leftPx !== undefined || rightPx !== undefined ? 'bg-white dark:bg-gray-800' : '';

        if (col.field === '__drag__') {
          return (
            <td
              key={col.field}
              className={cn('border-b border-r border-gray-200 dark:border-gray-700 px-1 py-1 text-center align-middle', pinnedCellClass)}
              style={{ ...(col.width != null ? { width: col.width, minWidth: col.width } : {}), ...pinnedStyle }}
              onClick={(e) => e.stopPropagation()}
              aria-hidden
            >
              <span className="inline-flex cursor-grab text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 select-none" title="행 잡아 드래그">⋮⋮</span>
            </td>
          );
        }
        if (col.field === '__checkbox__' && checkboxSelection) {
          return (
            <td
              key={col.field}
              className={cn('border-b border-r border-gray-200 dark:border-gray-700 px-2 py-1 text-sm w-10', pinnedCellClass)}
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
        const isRowDragHandleCell = rowDragColumnIndex !== undefined && colIndex === rowDragColumnIndex;
        if (isRowDragHandleCell) {
          return (
            <td
              key={col.field}
              className={cn('border-b border-r border-gray-200 dark:border-gray-700 px-1 py-1 text-center align-middle', pinnedCellClass)}
              style={{ ...(col.width != null ? { width: col.width, minWidth: col.width } : {}), ...pinnedStyle }}
              onClick={(e) => e.stopPropagation()}
              aria-hidden
            >
              <span
                className="inline-flex cursor-grab text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 select-none"
                title="행 순서 변경"
                draggable
                onDragStart={handleRowReorderDragStart}
              >
                ⋮⋮
              </span>
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
            className={getCellClassName?.(rowIndex, colIndex)}
            onEditingBlur={onEditingBlur}
            onEditingChange={onEditingChange}
          />
        );
      })}
    </tr>
  );
};
