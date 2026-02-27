import { ExcelGridProvider } from './ExcelGridContext';
import { ExcelGridInner } from './ExcelGridInner';
import type { ExcelGridProps } from './types';

/** Public API: 단일 컴포넌트. 로직 없음, 초기화 + 조합만. */
export const ExcelGrid = ({
  columns,
  rows,
  editable = false,
  selection = true,
  checkboxSelection = false,
  multiSelect = false,
  onSelectionChange,
  sortable = false,
  searchPlaceholder,
  columnFilter = false,
  columnReorder = false,
  pagination,
  virtualScroll,
  pinnedRowCount = 0,
  rowDraggable = false,
  onDropRows,
  onAddRow,
  exportFileName,
  exportImportDelimiter = ',',
  onImport,
  onChange,
  className,
  style,
}: ExcelGridProps) => (
  <ExcelGridProvider
    rows={rows}
    columns={columns}
    editable={editable}
    checkboxSelection={checkboxSelection}
    multiSelect={multiSelect}
    onSelectionChange={onSelectionChange}
    sortable={sortable}
    searchPlaceholder={searchPlaceholder}
    columnFilter={columnFilter}
    columnReorder={columnReorder}
    pagination={pagination}
    virtualScroll={virtualScroll}
    pinnedRowCount={pinnedRowCount}
    rowDraggable={rowDraggable}
    onDropRows={onDropRows}
    onAddRow={onAddRow}
    exportFileName={exportFileName}
    exportImportDelimiter={exportImportDelimiter}
    onImport={onImport}
    onChange={onChange}
  >
    <ExcelGridInner className={className} style={style} />
  </ExcelGridProvider>
);
