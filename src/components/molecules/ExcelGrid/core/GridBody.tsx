import { Fragment } from 'react';
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
  /** 행 순서 변경용 드래그 핸들 컬럼(display 인덱스). 있으면 해당 컬럼에 핸들 표시 */
  rowDragColumnIndex?: number;
  /** 행 드래그로 순서 변경 시 (fromDisplayedIndex, toDisplayedIndex) */
  onRowReorderDrop?: (fromDisplayedIndex: number, toDisplayedIndex: number) => void;
  onDropRows?: (e: React.DragEvent) => void;
  onDragOverRows?: (e: React.DragEvent) => void;
  onDragLeaveGrid?: () => void;
  /** 드롭 시 삽입될 위치(표시 행 인덱스). 이 행 앞에 삽입. null이면 미표시 */
  dropInsertBeforeIndex?: number | null;
  /** 표시 행 총 개수 (드롭 인디케이터 맨 뒤용) */
  totalRowCount?: number;
  multiSelect?: boolean;
  onRowClick?: (rowIndex: number, e: React.MouseEvent) => void;
  /** 멀티 드래그: 표시 행 인덱스 → RowData[] */
  getRowsForIndices?: (indices: number[]) => import('../types').RowData[];
  /** 해당 행 로딩 중이면 로딩 셀 표시 */
  isRowLoading?: (rowIndex: number) => boolean;
  /** 셀별 추가 className (변경 강조 등) */
  getCellClassName?: (rowIndex: number, colIndex: number) => string | undefined;
  /** 편집 셀 blur 시 편집 모드 종료 */
  onEditingBlur?: () => void;
  /** 편집 중 값 변경 시 실시간 반영 */
  onEditingChange?: (value: string) => void;
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
  rowDragColumnIndex,
  onRowReorderDrop,
  onDropRows,
  onDragOverRows,
  onDragLeaveGrid,
  dropInsertBeforeIndex,
  totalRowCount = 0,
  multiSelect,
  onRowClick,
  getRowsForIndices,
  isRowLoading,
  getCellClassName,
  onEditingBlur,
  onEditingChange,
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

  const dropIndicatorLine = (key: string) => (
    <tr key={key} aria-hidden className="bg-blue-100 dark:bg-blue-900/30" style={{ height: 0 }}>
      <td colSpan={colCount} style={{ padding: 0, border: 'none', verticalAlign: 'top', lineHeight: 0 }}>
        <div className="bg-blue-500 dark:bg-blue-400" style={{ height: 2, margin: 0 }} />
      </td>
    </tr>
  );

  return (
    <tbody
      className={cn(className, onDropRows && 'relative')}
      onDragOver={onDragOverRows}
      onDragLeave={onDragLeaveGrid}
      onDrop={onDropRows}
    >
      {topHeight > 0 && spacerCell('top-spacer', topHeight)}
      {rows.map((row, i) => {
        const rowIndex = startRowIndex + i;
        const showDropIndicatorBefore =
          dropInsertBeforeIndex === rowIndex;
        return (
          <Fragment key={rowIndex}>
            {showDropIndicatorBefore && dropIndicatorLine(`drop-before-${rowIndex}`)}
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
            rowDragColumnIndex={rowDragColumnIndex}
            onRowReorderDrop={onRowReorderDrop}
            rowHeight={virtualScroll?.rowHeight}
            onRowClick={onRowClick ? (e) => onRowClick(rowIndex, e) : undefined}
            getRowsForIndices={getRowsForIndices}
            selectedRowIndices={selectedRowIndices}
            isRowLoading={isRowLoading?.(rowIndex)}
            getCellClassName={getCellClassName}
            onEditingBlur={onEditingBlur}
            onEditingChange={onEditingChange}
          />
          </Fragment>
        );
      })}
      {dropInsertBeforeIndex === totalRowCount && dropIndicatorLine('drop-after-last')}
      {bottomHeight > 0 && spacerCell('bottom-spacer', bottomHeight)}
    </tbody>
  );
};
