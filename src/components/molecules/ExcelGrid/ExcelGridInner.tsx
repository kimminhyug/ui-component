import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { useExcelGridState, useExcelGridRef, useExcelGridOptions, useExcelGridOriginalRowIndexRef } from './ExcelGridContext';
import { GridRoot } from './core/GridRoot';
import { GridViewport } from './core/GridViewport';
import { GridBody } from './core/GridBody';
import { getDisplayedRows } from './model/sortFilterModel';
import { getDisplayColumns, getPinnedOffset } from './model/columnModel';
import { createKeyDownHandler } from './controller/keyboard';
import { createPointerHandlers } from './controller/mouse';
import { exportTableToText, downloadTableAsFile, importTableFromText } from './utils/exportImport';
import { Checkbox } from '../Checkbox';
import { IndeterminateCheckbox } from '../DataTable/IndeterminateCheckbox';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { cn } from '../../../utils/cn';

/** display 컬럼 인덱스 → 데이터 컬럼 인덱스 (필터/정렬 등에 사용) */
const getDataColIndexFromDisplay = (
  displayColIndex: number,
  displayColumns: import('./types').ColumnDef[],
  dataCols: import('./types').ColumnDef[]
): number => {
  const col = displayColumns[displayColIndex];
  if (!col || col.field === '__checkbox__' || col.field === '__drag__') return -1;
  return dataCols.findIndex((c) => c.field === col.field);
};

/** Context에서 state/ref 읽어서 core 조립 + controller 바인딩만. */
export const ExcelGridInner = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => {
  const state = useExcelGridState();
  const gridRef = useExcelGridRef();
  const opts = useExcelGridOptions();
  const getOriginalRowIndexRef = useExcelGridOriginalRowIndexRef();
  const { store } = opts;
  const [page, setPage] = useState(1);
  const [columnDragIndex, setColumnDragIndex] = useState<number | null>(null);

  const handleKeyDown = useMemo(
    () =>
      createKeyDownHandler({
        store,
        editable: opts.editable,
        onChange: opts.onChange,
        getEditingValue: opts.getEditingValue,
        getOriginalRowIndex: (i) => getOriginalRowIndexRef.current?.(i) ?? i,
      }),
    [store, opts.editable, opts.onChange, opts.getEditingValue]
  );

  const pointerHandlers = useMemo(
    () => createPointerHandlers(store, { editable: opts.editable }),
    [store, opts.editable]
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const selectionAnchorRef = useRef<number | null>(null);
  const [scrollState, setScrollState] = useState({ scrollTop: 0, containerHeight: 400 });

  const displayColumns = useMemo(
    () => getDisplayColumns(state.columns, state.columnOrder),
    [state.columns, state.columnOrder]
  );

  const displayedRows = useMemo(
    () =>
      getDisplayedRows(
        state.rows,
        displayColumns,
        state.searchText,
        state.sortBy,
        state.columnFilters
      ),
    [state.rows, displayColumns, state.searchText, state.sortBy, state.columnFilters]
  );

  const pagination = opts.pagination;
  const pageSize = pagination?.pageSize ?? displayedRows.length;
  const totalPages = Math.max(1, Math.ceil(displayedRows.length / pageSize));
  const currentPage = pagination?.page ?? page;
  const setCurrentPage = pagination?.onPageChange ?? setPage;

  const virtualScrollOpts = opts.virtualScroll;
  const useVirtualScroll = Boolean(virtualScrollOpts);
  const rowHeight = virtualScrollOpts?.rowHeight ?? 32;
  const maxScrollHeight = virtualScrollOpts?.maxHeight ?? 400;

  const paginatedRows = useMemo(() => {
    if (useVirtualScroll) return displayedRows;
    if (!pagination || displayedRows.length <= pageSize) return displayedRows;
    const start = (currentPage - 1) * pageSize;
    return displayedRows.slice(start, start + pageSize);
  }, [displayedRows, pagination, pageSize, currentPage, useVirtualScroll]);

  const totalVirtualRows = useVirtualScroll ? displayedRows.length : paginatedRows.length;
  const virtualStart = useVirtualScroll
    ? Math.max(0, Math.floor(scrollState.scrollTop / rowHeight))
    : 0;
  const virtualEnd = useVirtualScroll
    ? Math.min(
        totalVirtualRows,
        virtualStart + Math.ceil(scrollState.containerHeight / rowHeight) + 2
      )
    : totalVirtualRows;
  const virtualSlice = useVirtualScroll ? displayedRows.slice(virtualStart, virtualEnd) : paginatedRows;
  const virtualStartRowIndex = useVirtualScroll ? virtualStart : (pagination ? (currentPage - 1) * pageSize : 0);

  const hasCheckboxColumn = displayColumns.some((c) => c.field === '__checkbox__');
  const hasDragColumn = displayColumns.some((c) => c.field === '__drag__');
  const columnOrder = state.columnOrder;
  const dataCols = useMemo(
    () => state.columns.filter((c) => c.field !== '__checkbox__' && c.field !== '__drag__'),
    [state.columns]
  );

  useEffect(() => {
    getOriginalRowIndexRef.current = (i: number) => {
      const idx = virtualStartRowIndex + i;
      return displayedRows[idx]?.originalIndex ?? idx;
    };
    return () => {
      getOriginalRowIndexRef.current = null;
    };
  }, [virtualStartRowIndex, displayedRows, getOriginalRowIndexRef]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (useVirtualScroll) setScrollState({ scrollTop: el.scrollTop, containerHeight: el.clientHeight });
    if (headerScrollRef.current) headerScrollRef.current.scrollLeft = el.scrollLeft;
  }, [useVirtualScroll]);

  useEffect(() => {
    if (!useVirtualScroll) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScrollState((s) => ({ ...s, containerHeight: el.clientHeight })));
    ro.observe(el);
    return () => ro.disconnect();
  }, [useVirtualScroll]);

  useEffect(() => {
    const onPointerUp = () => pointerHandlers.handlePointerUp();
    window.addEventListener('pointerup', onPointerUp);
    return () => window.removeEventListener('pointerup', onPointerUp);
  }, [pointerHandlers]);

  const { focusedCell, selectedRange, editingCell, selectedRowIndices, sortBy } = state;
  const rowsToShow = virtualSlice.map((d) => d.row);

  useEffect(() => {
    if (!editingCell || !gridRef.current) return;
    const sel = `[data-row="${editingCell.row}"][data-col="${editingCell.col}"]`;
    const input = gridRef.current.querySelector<HTMLInputElement>(`input${sel}`);
    if (input) {
      input.focus();
      return;
    }
    const selectEl = gridRef.current.querySelector<HTMLSelectElement>(`select${sel}`);
    selectEl?.focus();
  }, [editingCell, gridRef]);

  const handleHeaderSort = useCallback((colIndex: number) => {
    if (!opts.sortable) return;
    if (!sortBy || sortBy.col !== colIndex) store.setSortBy(colIndex, 'asc');
    else if (sortBy.dir === 'asc') store.setSortBy(colIndex, 'desc');
    else store.clearSort();
  }, [sortBy, opts.sortable, store]);

  const handleExport = useCallback(() => {
    const dataCols = displayColumns.filter((c) => c.field !== '__checkbox__' && c.field !== '__drag__');
    const content = exportTableToText(state.rows, dataCols, {
      delimiter: opts.exportImportDelimiter ?? ',',
    });
    downloadTableAsFile(content, opts.exportFileName ?? 'export.csv');
  }, [state.rows, displayColumns, opts.exportFileName, opts.exportImportDelimiter]);

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !opts.onImport) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? '');
        const dataCols = displayColumns.filter((c) => c.field !== '__checkbox__' && c.field !== '__drag__');
        const rows = importTableFromText(text, dataCols, {
          delimiter: opts.exportImportDelimiter ?? ',',
        });
        opts.onImport(rows);
      };
      reader.readAsText(file, 'UTF-8');
      e.target.value = '';
    },
    [opts.onImport, opts.exportImportDelimiter, displayColumns]
  );

  const handleColumnDragStart = (displayIndex: number) => setColumnDragIndex(displayIndex);
  const handleColumnDragOver = (e: React.DragEvent, displayIndex: number) => {
    e.preventDefault();
    if (columnDragIndex == null || columnDragIndex === displayIndex) return;
    const dataDisplayCols = displayColumns.filter((c) => c.field !== '__checkbox__' && c.field !== '__drag__');
    const metaCount = (hasDragColumn ? 1 : 0) + (hasCheckboxColumn ? 1 : 0);
    const from = columnDragIndex - metaCount;
    const to = displayIndex - metaCount;
    if (from < 0 || to < 0 || from >= dataDisplayCols.length || to >= dataDisplayCols.length) return;
    const next = [...dataDisplayCols];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    const newColumnOrder = next.map((c) => dataCols.findIndex((x) => x.field === c.field)).filter((i) => i >= 0);
    if (newColumnOrder.length === dataCols.length) store.setColumnOrder(newColumnOrder);
    setColumnDragIndex(displayIndex);
  };
  const handleColumnDragEnd = () => setColumnDragIndex(null);

  const handleDropRows = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const raw = e.dataTransfer.getData('application/x-excelgrid-rows');
      if (!raw || !opts.onDropRows) return;
      try {
        const rows = JSON.parse(raw) as import('./types').RowData[];
        if (Array.isArray(rows) && rows.length > 0) opts.onDropRows(rows);
      } catch {
        // ignore
      }
    },
    [opts.onDropRows]
  );
  const handleDragOverRows = useCallback((e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('application/x-excelgrid-rows')) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleMultiSelectRow = useCallback(
    (rowIndex: number, e: React.MouseEvent) => {
      const anchor = selectionAnchorRef.current;
      if (e.shiftKey) {
        const from = anchor != null ? Math.min(anchor, rowIndex) : 0;
        const to = anchor != null ? Math.max(anchor, rowIndex) : rowIndex;
        const indices = Array.from({ length: to - from + 1 }, (_, i) => from + i).filter(
          (i) => i >= 0 && i < totalVirtualRows
        );
        store.setSelectedRowIndices(indices);
      } else if (e.ctrlKey || e.metaKey) {
        const set = new Set(state.selectedRowIndices);
        if (set.has(rowIndex)) set.delete(rowIndex);
        else set.add(rowIndex);
        store.setSelectedRowIndices(Array.from(set));
        selectionAnchorRef.current = rowIndex;
      } else {
        store.setSelectedRowIndices([rowIndex]);
        selectionAnchorRef.current = rowIndex;
      }
    },
    [totalVirtualRows, state.selectedRowIndices, store]
  );

  const getRowsForIndices = useCallback(
    (indices: number[]) =>
      indices
        .map((i) => displayedRows[i]?.row)
        .filter((r): r is import('./types').RowData => r != null),
    [displayedRows]
  );

  const pinnedRowCount = opts.pinnedRowCount ?? 0;

  return (
    <GridRoot className={className} style={style}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {opts.searchPlaceholder != null && (
          <Input
            type="search"
            placeholder={opts.searchPlaceholder}
            value={state.searchText}
            onChange={(e) => store.setSearchText(e.target.value)}
            className="max-w-xs"
          />
        )}
        {opts.onAddRow && (
          <Button type="button" variant="secondary" size="sm" onClick={opts.onAddRow}>
            행 추가
          </Button>
        )}
        {opts.exportFileName && (
          <>
            <Button type="button" variant="secondary" size="sm" onClick={handleExport}>
              Export
            </Button>
            {opts.onImport && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleImport}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Import
                </Button>
              </>
            )}
          </>
        )}
      </div>

      <GridViewport
        ref={gridRef as React.RefObject<HTMLDivElement>}
        onKeyDown={handleKeyDown}
        onPointerDown={pointerHandlers.handlePointerDown}
        onPointerMove={pointerHandlers.handlePointerMove}
        onPointerUp={pointerHandlers.handlePointerUp}
        onDoubleClick={pointerHandlers.handleDoubleClick}
      >
        <div
          className="flex flex-col border border-gray-200 rounded overflow-hidden"
          style={
            useVirtualScroll
              ? { maxHeight: maxScrollHeight, minHeight: 0 }
              : undefined
          }
        >
          {/* 헤더: 스크롤 영역 밖 고정. 가로 스크롤은 body와 동기화 */}
          <div
            ref={headerScrollRef}
            className="bg-gray-100 overflow-x-auto overflow-y-hidden shrink-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                {displayColumns.map((col, i) => (
                  <col key={col.field} style={col.width != null ? { width: col.width, minWidth: col.width } : undefined} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {displayColumns.map((col, colIndex) => {
                    const leftPx = col.pinned === 'left' ? getPinnedOffset(displayColumns, colIndex, 'left') : undefined;
                    const rightPx = col.pinned === 'right' ? getPinnedOffset(displayColumns, colIndex, 'right') : undefined;
                    const stickyStyle: React.CSSProperties =
                      leftPx !== undefined
                        ? { position: 'sticky', left: leftPx, zIndex: 11, background: '#f3f4f6', boxShadow: '2px 0 2px -2px rgba(0,0,0,0.1)' }
                        : rightPx !== undefined
                          ? { position: 'sticky', right: rightPx, zIndex: 11, background: '#f3f4f6', boxShadow: '-2px 0 2px -2px rgba(0,0,0,0.1)' }
                          : {};
                    const isMetaCol = col.field === '__checkbox__' || col.field === '__drag__';
                    return (
                      <th
                        key={`${col.field}-${colIndex}`}
                        className={cn(
                          'border-b border-r border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700',
                          opts.sortable && !isMetaCol && 'cursor-pointer select-none hover:bg-gray-200',
                          opts.columnReorder && !isMetaCol && 'cursor-grab',
                          columnDragIndex === colIndex && 'opacity-50'
                        )}
                        style={{
                          ...(col.width != null ? { width: col.width, minWidth: col.width } : {}),
                          ...stickyStyle,
                        }}
                        onClick={
                          opts.sortable && !isMetaCol
                            ? () => handleHeaderSort(colIndex)
                            : undefined
                        }
                        draggable={opts.columnReorder && !isMetaCol}
                        onDragStart={() => opts.columnReorder && handleColumnDragStart(colIndex)}
                        onDragOver={(e) => opts.columnReorder && handleColumnDragOver(e, colIndex)}
                        onDragEnd={handleColumnDragEnd}
                      >
                        {col.field === '__drag__' ? (
                          <span className="inline-block w-4 h-4 text-gray-400" aria-hidden>⋮⋮</span>
                        ) : col.field === '__checkbox__' ? (
                          hasCheckboxColumn && (
                            <div onClick={(e) => e.stopPropagation()}>
                              <IndeterminateCheckbox
                                checked={totalVirtualRows > 0 && selectedRowIndices.length === totalVirtualRows}
                                indeterminate={selectedRowIndices.length > 0 && selectedRowIndices.length < totalVirtualRows}
                                onChange={() => store.toggleAllRowsSelection(totalVirtualRows)}
                                aria-label="전체 선택"
                              />
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1">
                              {col.header ?? col.field}
                              {opts.sortable && sortBy?.col === colIndex && (
                                <span className="text-blue-600" aria-hidden>
                                  {sortBy.dir === 'asc' ? '▲' : '▼'}
                                </span>
                              )}
                            </span>
                            {opts.columnFilter && (
                              <input
                                type="text"
                                placeholder="필터..."
                                value={state.columnFilters[getDataColIndexFromDisplay(colIndex, displayColumns, dataCols)] ?? ''}
                                onChange={(e) => store.setColumnFilter(getDataColIndexFromDisplay(colIndex, displayColumns, dataCols), e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full text-xs border border-gray-300 rounded px-1 py-0.5"
                              />
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
            </table>
          </div>

          {/* 스크롤은 항상 table body 영역에서만. 가로 스크롤 시 헤더와 동기화 */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-auto"
          >
            <table className="w-full border-collapse border-t-0" style={useVirtualScroll ? { tableLayout: 'fixed' } : undefined}>
              <colgroup>
                {displayColumns.map((col) => (
                  <col key={col.field} style={col.width != null ? { width: col.width, minWidth: col.width } : undefined} />
                ))}
              </colgroup>
              <GridBody
                rows={rowsToShow}
                columns={displayColumns}
                focusedCell={focusedCell}
                selectedRange={selectedRange}
                editingCell={editingCell}
                checkboxSelection={hasCheckboxColumn}
                selectedRowIndices={selectedRowIndices}
                onToggleRowSelection={store.toggleRowSelection}
                pinnedRowCount={pinnedRowCount}
                startRowIndex={virtualStartRowIndex}
                virtualScroll={
                  useVirtualScroll
                    ? {
                        totalRows: totalVirtualRows,
                        rowHeight,
                        startIndex: virtualStart,
                        endIndex: virtualEnd,
                      }
                    : undefined
                }
                rowDraggable={opts.rowDraggable}
                onDropRows={opts.onDropRows ? handleDropRows : undefined}
                onDragOverRows={opts.onDropRows ? handleDragOverRows : undefined}
                multiSelect={opts.multiSelect}
                onRowClick={opts.multiSelect ? handleMultiSelectRow : undefined}
                getRowsForIndices={opts.rowDraggable ? getRowsForIndices : undefined}
              />
            </table>
          </div>
        </div>
      </GridViewport>

      {pagination && !useVirtualScroll && totalPages > 1 && (
        <div className="flex items-center gap-2 mt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            이전
          </Button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </GridRoot>
  );
};
