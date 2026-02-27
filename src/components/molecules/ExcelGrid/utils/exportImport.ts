import type { RowData, ColumnDef } from '../types';
import { getColumnByIndex } from '../model/columnModel';
import { getCellValue } from '../model/rowModel';

export interface ExportImportOptions {
  /** 컬럼 구분자. 기본 ',' (CSV) */
  delimiter?: string;
  /** 줄 구분자. 기본 '\n' */
  lineEnd?: string;
  /** 헤더 행 포함 여부. 기본 true */
  includeHeader?: boolean;
}

const DEFAULT_DELIMITER = ',';
const DEFAULT_LINE_END = '\n';

/** CSV 등 텍스트로 테이블 내보내기 */
export const exportTableToText = (
  rows: RowData[],
  columns: ColumnDef[],
  opts: ExportImportOptions = {}
): string => {
  const delim = opts.delimiter ?? DEFAULT_DELIMITER;
  const lineEnd = opts.lineEnd ?? DEFAULT_LINE_END;
  const includeHeader = opts.includeHeader !== false;
  const dataColumns = columns.filter((c) => c.field !== '__checkbox__');

  const lines: string[] = [];
  if (includeHeader) {
    lines.push(dataColumns.map((c) => escapeCell(c.header ?? c.field, delim)).join(delim));
  }
  for (const row of rows) {
    const cells = dataColumns.map((col) => {
      const v = getCellValue(row, col.field);
      return escapeCell(v == null ? '' : String(v), delim);
    });
    lines.push(cells.join(delim));
  }
  return lines.join(lineEnd);
};

/** CSV 등 텍스트에서 테이블 데이터 파싱 */
export const importTableFromText = (
  text: string,
  columns: ColumnDef[],
  opts: ExportImportOptions = {}
): RowData[] => {
  const delim = opts.delimiter ?? DEFAULT_DELIMITER;
  const lineEnd = opts.lineEnd ?? '\n';
  const includeHeader = opts.includeHeader !== false;
  const dataColumns = columns.filter((c) => c.field !== '__checkbox__');

  const lines = text.split(/\r?\n/).filter((line) => line.length > 0);
  let start = 0;
  if (includeHeader && lines.length > 0) start = 1;

  const rows: RowData[] = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    const cells = parseLine(line, delim);
    const row: RowData = {};
    dataColumns.forEach((col, ci) => {
      row[col.field] = cells[ci] ?? '';
    });
    rows.push(row);
  }
  return rows;
};

function escapeCell(val: string, delim: string): string {
  const needsQuote = val.includes(delim) || val.includes('"') || val.includes('\n') || val.includes('\r');
  if (!needsQuote) return val;
  return `"${val.replace(/"/g, '""')}"`;
}

function parseLine(line: string, delim: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (inQuotes) {
      current += c;
    } else if (c === delim) {
      result.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

/** Blob으로 다운로드 (파일 저장) */
export const downloadTableAsFile = (
  content: string,
  filename: string,
  mimeType = 'text/csv;charset=utf-8'
): void => {
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};
