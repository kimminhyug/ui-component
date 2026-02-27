/** 공용 Excel Grid 타입 정의 */

export type CellCoord = { row: number; col: number };

export type Range = { start: CellCoord; end: CellCoord };

/** 셀 에디터 타입 */
export type CellEditorType = 'text' | 'datetime' | 'dropdown';

export interface ColumnDef<T = unknown> {
  /** 컬럼 식별자 (row[key] 접근용) */
  field: string;
  /** 헤더 표시 텍스트 */
  header?: string;
  /** 셀 너비 (px 또는 확장용) */
  width?: number;
  /** 편집 가능 여부 (editable=true일 때 개별 오버라이드) */
  editable?: boolean;
  /** 컬럼 고정: 'left' 왼쪽 스티키, 'right' 오른쪽 스티키 (가로 스크롤 시 고정) */
  pinned?: 'left' | 'right';
  /** 편집 시 에디터 타입. 기본 'text' */
  editor?: CellEditorType;
  /** editor: 'dropdown' 일 때 옵션 목록 */
  dropdownOptions?: string[];
}

export type RowData = Record<string, unknown>;

export type SortDirection = 'asc' | 'desc';

export interface GridState {
  rows: RowData[];
  columns: ColumnDef[];
  focusedCell: CellCoord | null;
  selectedRange: Range | null;
  editingCell: CellCoord | null;
  selectedRowIndices: number[];
  sortBy: { col: number; dir: SortDirection } | null;
  searchText: string;
  columnFilters: Record<number, string>;
  columnOrder: number[];
}

export interface PaginationOptions {
  pageSize: number;
  page?: number;
  onPageChange?: (page: number) => void;
}

export interface ExcelGridProps {
  columns: ColumnDef[];
  rows: RowData[];
  editable?: boolean;
  selection?: boolean;
  /** 행 단위 체크박스 선택 컬럼 표시 */
  checkboxSelection?: boolean;
  /** 다중 행 선택: Ctrl+클릭(토글), Shift+클릭(범위 선택). selection 또는 checkboxSelection과 함께 사용 */
  multiSelect?: boolean;
  /** 체크박스 선택 변경 시 (선택된 행 인덱스) */
  onSelectionChange?: (selectedRowIndices: number[]) => void;
  /** 컬럼 헤더 클릭 정렬 사용 */
  sortable?: boolean;
  /** 검색 입력 표시(상단), placeholder */
  searchPlaceholder?: string;
  /** 컬럼 헤더 필터 사용 */
  columnFilter?: boolean;
  /** 컬럼 드래그로 순서 변경 */
  columnReorder?: boolean;
  /** 페이징. pageSize 필수, page/onPageChange로 제어 */
  pagination?: PaginationOptions;
  /** 가상 스크롤 (rowHeight px 고정, tbody만 스크롤·헤더 고정) */
  virtualScroll?: { rowHeight: number; maxHeight?: number };
  /** 상단 고정 행 개수 (y축 pinned) */
  pinnedRowCount?: number;
  /** 행 grab(잡기) 가능 — 행을 잡아 다른 그리드로 드래그 시 대상 그리드 onDropRows 호출 */
  rowDraggable?: boolean;
  /** 다른 그리드에서 행을 이 그리드로 드롭했을 때 (추가할 행) */
  onDropRows?: (rows: RowData[]) => void;
  /** 행 추가 버튼 노출 시 클릭 시 호출 (호출 측에서 rows 상태에 행 추가) */
  onAddRow?: () => void;
  /** Export 시 파일명. 설정 시 내보내기 버튼 노출 */
  exportFileName?: string;
  /** Export/Import 구분자. 기본 ',' */
  exportImportDelimiter?: string;
  /** Import 완료 시 (파싱된 rows) */
  onImport?: (rows: RowData[]) => void;
  onChange?: (rowIndex: number, colIndex: number, value: unknown) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface GridCellRenderProps {
  value: unknown;
  focused: boolean;
  selected: boolean;
  editing: boolean;
  rowIndex: number;
  colIndex: number;
}
