import type { RowData, ColumnDef } from '../types';

const MAX_PREVIEW_COLS = 4;
const MAX_PREVIEW_ROWS = 5;

/** 드래그 시 커서 따라다니는 미리보기 — 실제 셀 컨텐츠 표시 */
export const createDragPreview = (
  rows: RowData[],
  columns: ColumnDef[],
  dt: DataTransfer
): void => {
  const dataCols = columns.filter((c) => c.field !== '__checkbox__' && c.field !== '__drag__').slice(0, MAX_PREVIEW_COLS);
  if (dataCols.length === 0) return;

  const el = document.createElement('div');
  el.setAttribute('role', 'presentation');
  el.style.cssText = [
    'position:absolute;top:-9999px;left:-9999px;',
    'padding:0;min-width:80px;max-width:320px;max-height:200px;overflow:hidden;',
    'background:white;border:1px solid #e5e7eb;border-radius:6px;',
    'box-shadow:0 4px 12px rgba(0,0,0,0.15);',
    'font-size:11px;color:#374151;',
    'pointer-events:none;z-index:9999;',
  ].join('');

  const table = document.createElement('table');
  table.style.cssText = 'border-collapse:collapse;width:100%;table-layout:fixed;';
  table.setAttribute('role', 'presentation');

  const thead = document.createElement('thead');
  thead.style.background = '#f3f4f6';
  const headerRow = document.createElement('tr');
  dataCols.forEach((col) => {
    const th = document.createElement('th');
    th.style.cssText = 'padding:4px 6px;text-align:left;border-bottom:1px solid #e5e7eb;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px;';
    th.textContent = col.header ?? col.field;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const previewRows = rows.slice(0, MAX_PREVIEW_ROWS);
  previewRows.forEach((row) => {
    const tr = document.createElement('tr');
    dataCols.forEach((col) => {
      const td = document.createElement('td');
      td.style.cssText = 'padding:4px 6px;border-bottom:1px solid #f3f4f6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px;';
      const val = row[col.field];
      td.textContent = val != null ? String(val) : '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  el.appendChild(table);

  if (rows.length > MAX_PREVIEW_ROWS) {
    const footer = document.createElement('div');
    footer.style.cssText = 'padding:2px 6px;background:#f9fafb;font-size:10px;color:#6b7280;';
    footer.textContent = `외 ${rows.length - MAX_PREVIEW_ROWS}행`;
    el.appendChild(footer);
  }

  document.body.appendChild(el);
  dt.setDragImage(el, 24, 16);
  requestAnimationFrame(() => el.remove());
};
