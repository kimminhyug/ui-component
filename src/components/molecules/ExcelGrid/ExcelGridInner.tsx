import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { useExcelGridState, useExcelGridRef, useExcelGridOptions, useExcelGridOriginalRowIndexRef } from './ExcelGridContext';
import { GridRoot } from './core/GridRoot';
import { GridViewport } from './core/GridViewport';
import { GridBody } from './core/GridBody';
import { getDisplayedRows } from './model/sortFilterModel';
import { getDisplayColumns, getPinnedOffset, getEffectivePinned, getTableMinWidth, getColumnByIndex } from './model/columnModel';
import { getCellValue, setCellValue } from './model/rowModel';
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
  const [dropInsertBeforeIndex, setDropInsertBeforeIndex] = useState<number | null>(null);

  const { handleKeyDown, commitEditingCell } = useMemo(
    () =>
      createKeyDownHandler({
        store,
        editable: opts.editable,
        onChange: opts.onChange,
        onCellChange: opts.onCellChange,
        getEditingValue: opts.getEditingValue,
        getOriginalRowIndex: (i) => getOriginalRowIndexRef.current?.(i) ?? i,
      }),
    [store, opts.editable, opts.onChange, opts.onCellChange, opts.getEditingValue]
  );

  const pointerHandlers = useMemo(
    () =>
      createPointerHandlers(store, {
        editable: opts.editable,
        commitEditingCell,
      }),
    [store, opts.editable, commitEditingCell]
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
  const rowDragColumnIndex = useMemo(
    () => displayColumns.findIndex((c) => c.rowDrag === true),
    [displayColumns]
  );
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
        if (Array.isArray(rows) && rows.length > 0) {
          const insertAtIndex = dropInsertBeforeIndex ?? totalVirtualRows;
          opts.onDropRows(rows, insertAtIndex);
        }
      } catch {
        // ignore
      }
      setDropInsertBeforeIndex(null);
    },
    [opts.onDropRows, dropInsertBeforeIndex, totalVirtualRows]
  );
  const handleDragOverRows = useCallback(
    (e: React.DragEvent) => {
      const isReorder = e.dataTransfer.types.includes('application/x-excelgrid-row-reorder');
      const isRows = e.dataTransfer.types.includes('application/x-excelgrid-rows');
      if (isReorder) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
      } else if (isRows) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
      } else return;

      if (isReorder || isRows) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const tr = el?.closest('tr[data-row-index]');
        if (tr) {
          const idx = parseInt(tr.getAttribute('data-row-index') ?? '', 10);
          if (!Number.isNaN(idx)) {
            const rect = tr.getBoundingClientRect();
            const insertBefore =
              e.clientY < rect.top + rect.height / 2 ? idx : idx + 1;
            setDropInsertBeforeIndex(Math.min(insertBefore, totalVirtualRows));
            return;
          }
        }
        setDropInsertBeforeIndex(totalVirtualRows);
      }
    },
    [totalVirtualRows]
  );

  const handleDragLeaveGrid = useCallback(() => {
    setDropInsertBeforeIndex(null);
  }, []);

  const handleRowReorderDrop = useCallback(
    (fromDisplayedIndex: number, toDisplayedIndex: number) => {
      if (fromDisplayedIndex === toDisplayedIndex) return;
      setDropInsertBeforeIndex(null);
      const { rows } = store.getState();
      const fromOriginal = displayedRows[fromDisplayedIndex]?.originalIndex ?? fromDisplayedIndex;
      const toOriginal = displayedRows[toDisplayedIndex]?.originalIndex ?? toDisplayedIndex;
      if (fromOriginal < 0 || toOriginal < 0 || fromOriginal >= rows.length || toOriginal >= rows.length) return;
      const newRows = [...rows];
      const [removed] = newRows.splice(fromOriginal, 1);
      let insertAt = toOriginal;
      if (fromOriginal < toOriginal) insertAt -= 1;
      newRows.splice(insertAt, 0, removed!);
      store.setRows(newRows);
      opts.onRowOrderChange?.(newRows);
    },
    [displayedRows, store, opts.onRowOrderChange]
  );

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

  const handleEditingChange = useCallback(
    (newValue: string) => {
      const s = store.getState();
      const { editingCell, rows, columns, columnOrder } = s;
      if (!editingCell) return;
      const displayCols = getDisplayColumns(columns, columnOrder);
      const colDef = getColumnByIndex(displayCols, editingCell.col);
      if (!colDef || colDef.field === '__checkbox__' || colDef.field === '__drag__') return;
      const originalRow = getOriginalRowIndexRef.current?.(editingCell.row) ?? editingCell.row;
      const prevValue = getCellValue(rows[originalRow], colDef.field);
      const nextRows = setCellValue(rows, originalRow, colDef.field, newValue);
      store.setRows(nextRows);
      opts.onChange?.(originalRow, editingCell.col, newValue);
      if (opts.onCellChange && String(prevValue ?? '') !== String(newValue ?? '')) {
        opts.onCellChange(originalRow, editingCell.col, prevValue, newValue);
      }
    },
    [store, opts.onChange, opts.onCellChange]
  );

  const pinnedRowCount = opts.pinnedRowCount ?? 0;
  const hasPinnedColumn = displayColumns.some((c) => getEffectivePinned(c) != null);
  const tableMinWidth = hasPinnedColumn ? getTableMinWidth(displayColumns) : undefined;

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
          className="flex flex-col border border-gray-200 dark:border-gray-700 rounded overflow-hidden dark:bg-gray-900"
          style={
            useVirtualScroll
              ? { maxHeight: maxScrollHeight, minHeight: 0 }
              : undefined
          }
        >
          {/* 헤더: 스크롤 영역 밖 고정. 가로 스크롤은 body와 동기화 */}
          <div
            ref={headerScrollRef}
            className="bg-gray-100 dark:bg-gray-800/95 dark:border-b dark:border-gray-700 overflow-x-auto overflow-y-hidden shrink-0"
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
                    const pinned = getEffectivePinned(col);
                    const leftPx = pinned === 'left' ? getPinnedOffset(displayColumns, colIndex, 'left') : undefined;
                    const rightPx = pinned === 'right' ? getPinnedOffset(displayColumns, colIndex, 'right') : undefined;
                    const stickyStyle: React.CSSProperties =
                      leftPx !== undefined
                        ? { position: 'sticky', left: leftPx, zIndex: 11, boxShadow: '2px 0 2px -2px rgba(0,0,0,0.1)' }
                        : rightPx !== undefined
                          ? { position: 'sticky', right: rightPx, zIndex: 11, boxShadow: '-2px 0 2px -2px rgba(0,0,0,0.1)' }
                          : {};
                    const stickyThClass = leftPx !== undefined || rightPx !== undefined ? 'bg-gray-100 dark:bg-gray-800/95' : '';
                    const isMetaCol = col.field === '__checkbox__' || col.field === '__drag__';
                    const colMovable = 'movable' in col ? (col as import('./types').ColumnDef).movable !== false : true;
                    const canDragCol = opts.columnReorder && !isMetaCol && colMovable;
                    return (
                      <th
                        key={`${col.field}-${colIndex}`}
                        className={cn(
                          'border-b border-r border-gray-200 dark:border-gray-700 px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-100',
                          stickyThClass,
                          opts.sortable && !isMetaCol && 'cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700/80',
                          canDragCol && 'cursor-grab',
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
                        draggable={canDragCol}
                        onDragStart={() => canDragCol && handleColumnDragStart(colIndex)}
                        onDragOver={(e) => opts.columnReorder && !isMetaCol && handleColumnDragOver(e, colIndex)}
                        onDragEnd={handleColumnDragEnd}
                      >
                        {col.field === '__drag__' ? (
                          <span className="inline-block w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden>⋮⋮</span>
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
                                <span className="text-blue-600 dark:text-blue-400" aria-hidden>
                                  {sortBy.dir === 'asc' ? '▲' : '▼'}
                                </span>
                              )}
                            </span>
                            {opts.columnFilter && (
                              <input
                                type={
                                  col.filterType === 'number'
                                    ? 'number'
                                    : col.filterType === 'date'
                                      ? 'date'
                                      : 'text'
                                }
                                placeholder="필터..."
                                value={state.columnFilters[getDataColIndexFromDisplay(colIndex, displayColumns, dataCols)] ?? ''}
                                onChange={(e) => store.setColumnFilter(getDataColIndexFromDisplay(colIndex, displayColumns, dataCols), e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700/90 dark:text-gray-100 dark:placeholder-gray-400 rounded px-1 py-0.5 focus:dark:border-gray-500 focus:dark:ring-1 focus:dark:ring-gray-500 focus:dark:outline-none"
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
            className="flex-1 min-h-0 overflow-auto dark:bg-gray-900"
          >
            <table className="w-full border-collapse border-t-0" style={useVirtualScroll ? { tableLayout: 'fixed' } : { tableLayout: 'fixed', minWidth: tableMinWidth }}>
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
                rowDragColumnIndex={rowDragColumnIndex >= 0 ? rowDragColumnIndex : undefined}
                onRowReorderDrop={opts.onRowOrderChange ? handleRowReorderDrop : undefined}
                onDropRows={opts.onDropRows ? handleDropRows : undefined}
                onDragOverRows={opts.onDropRows || opts.onRowOrderChange ? handleDragOverRows : undefined}
                onDragLeaveGrid={opts.onDropRows || opts.onRowOrderChange ? handleDragLeaveGrid : undefined}
                dropInsertBeforeIndex={dropInsertBeforeIndex}
                totalRowCount={totalVirtualRows}
                multiSelect={opts.multiSelect}
                onRowClick={opts.multiSelect ? handleMultiSelectRow : undefined}
                getRowsForIndices={opts.rowDraggable ? getRowsForIndices : undefined}
                isRowLoading={opts.isRowLoading}
                getCellClassName={opts.getCellClassName}
                onEditingBlur={commitEditingCell}
                onEditingChange={opts.editable ? handleEditingChange : undefined}
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
