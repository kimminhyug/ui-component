import type { RowData, ColumnDef } from '../types';
import { GridRow } from './GridRow';
import { cn } from '../../../../utils/cn';

export interface VirtualScrollConfig {
  totalRows: number;
  rowHeight: number;
  startIndex: number;
  endIndex: number;
}

export interface GridBodyProps {
  rows: RowData[];
  columns: ColumnDef[];
  focusedCell: { row: number; col: number } | null;
  selectedRange: { start: { row: number; col: number }; end: { row: number; col: number } } | null;
  editingCell: { row: number; col: number } | null;
  checkboxSelection?: boolean;
  selectedRowIndices?: number[];
  onToggleRowSelection?: (rowIndex: number) => void;
  pinnedRowCount?: number;
  startRowIndex?: number;
  virtualScroll?: VirtualScrollConfig;
  rowDraggable?: boolean;
  onDropRows?: (e: React.DragEvent) => void;
  onDragOverRows?: (e: React.DragEvent) => void;
  multiSelect?: boolean;
  onRowClick?: (rowIndex: number, e: React.MouseEvent) => void;
  /** 멀티 드래그: 표시 행 인덱스 → RowData[] */
  getRowsForIndices?: (indices: number[]) => import('../types').RowData[];
  className?: string;
}

/** tbody: 가상 스크롤 시 상단/하단 스페이서 + 행 목록, 행 드롭 영역 */
export const GridBody = ({
  rows,
  columns,
  focusedCell,
  selectedRange,
  editingCell,
  checkboxSelection,
  selectedRowIndices = [],
  onToggleRowSelection,
  pinnedRowCount = 0,
  startRowIndex = 0,
  virtualScroll,
  rowDraggable,
  onDropRows,
  onDragOverRows,
  multiSelect,
  onRowClick,
  getRowsForIndices,
  className,
}: GridBodyProps) => {
  const colCount = columns.length;
  const topHeight = virtualScroll ? virtualScroll.startIndex * virtualScroll.rowHeight : 0;
  const bottomHeight = virtualScroll
    ? (virtualScroll.totalRows - virtualScroll.endIndex) * virtualScroll.rowHeight
    : 0;

  const spacerCell = (key: string, height: number) => (
    <tr key={key} aria-hidden style={{ height, lineHeight: 0, fontSize: 0 }}>
      <td colSpan={colCount} style={{ height, padding: 0, border: 'none', verticalAlign: 'top' }} />
    </tr>
  );

  return (
    <tbody
      className={cn(className, onDropRows && 'relative')}
      onDragOver={onDragOverRows}
      onDrop={onDropRows}
    >
      {topHeight > 0 && spacerCell('top-spacer', topHeight)}
      {rows.map((row, i) => {
        const rowIndex = startRowIndex + i;
        return (
          <GridRow
            key={rowIndex}
            rowIndex={rowIndex}
            row={row}
            columns={columns}
            focusedCell={focusedCell}
            selectedRange={selectedRange}
            editingCell={editingCell}
            checkboxSelection={checkboxSelection}
            isRowSelected={selectedRowIndices.includes(rowIndex)}
            onToggleRowSelection={onToggleRowSelection ? () => onToggleRowSelection(rowIndex) : undefined}
            isPinned={i < pinnedRowCount}
            pinnedRowIndex={i}
            rowDraggable={rowDraggable}
            rowHeight={virtualScroll?.rowHeight}
            onRowClick={onRowClick ? (e) => onRowClick(rowIndex, e) : undefined}
            getRowsForIndices={getRowsForIndices}
            selectedRowIndices={selectedRowIndices}
          />
        );
      })}
      {bottomHeight > 0 && spacerCell('bottom-spacer', bottomHeight)}
    </tbody>
  );
};
