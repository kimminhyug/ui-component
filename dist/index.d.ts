import { C as ComponentTheme } from './ThemeContext-Ct89S9yt.js';
export { T as ThemeProvider, a as ThemeRegistry, U as UITheme, b as baseTheme, m as mergeTheme, u as useComponentTheme, c as useTheme, d as useThemeActions, e as useThemeKey, f as useThemeRegistry } from './ThemeContext-Ct89S9yt.js';
export { I18nProvider, MessageMap, UIMessages, baseMessages, mergeMessages, useI18n, useMessage, useT } from './i18n/index.js';
import * as react from 'react';
import react__default, { ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes, ReactNode, CSSProperties } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { Table, Row, ColumnDef as ColumnDef$1, CellContext, RowSelectionState, SortingState, useReactTable } from '@tanstack/react-table';
import { ClassValue } from 'clsx';

type ControlledProps<T> = {
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
};
interface Stylable {
    className?: string;
    style?: React.CSSProperties;
}
interface ThemedComponent {
    theme?: ComponentTheme | null;
}

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>, Stylable, ThemedComponent {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}
declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLButtonElement>>;

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>, Stylable, ThemedComponent {
    error?: boolean;
}
declare const Input: react.ForwardRefExoticComponent<InputProps & react.RefAttributes<HTMLInputElement>>;

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'>, Stylable, ThemedComponent {
    variant?: BadgeVariant;
    children?: React.ReactNode;
}
declare const Badge: ({ variant, className, style, theme: themeOverride, children, ...rest }: BadgeProps) => react_jsx_runtime.JSX.Element;

interface ModalProps extends Stylable, ThemedComponent {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    closeOnOverlayClick?: boolean;
}
declare const Modal: ({ open, onClose, title, description, children, closeOnOverlayClick, className, style, theme: themeOverride, }: ModalProps) => react_jsx_runtime.JSX.Element;

interface DropdownItem {
    key: string;
    label: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}
interface DropdownProps extends Stylable, ThemedComponent {
    trigger: ReactNode;
    items: DropdownItem[];
    selectedKey?: string | null;
}
declare const Dropdown: ({ trigger, items, selectedKey, className, style, theme: themeOverride, }: DropdownProps) => react_jsx_runtime.JSX.Element;

interface TabItem {
    key: string;
    label: React.ReactNode;
    panel: React.ReactNode;
}
interface TabsProps extends Stylable, ThemedComponent {
    items: TabItem[];
    selectedIndex?: number;
    defaultIndex?: number;
    onChange?: (index: number) => void;
}
declare const Tabs: ({ items, selectedIndex, defaultIndex, onChange, className, style, theme: themeOverride, }: TabsProps) => react_jsx_runtime.JSX.Element;

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'checked' | 'defaultChecked'>, Stylable, ThemedComponent {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode;
}
declare const Checkbox: react.ForwardRefExoticComponent<CheckboxProps & react.RefAttributes<HTMLInputElement>>;

interface TableProps<TData = unknown> extends Stylable, ThemedComponent {
    /** TanStack Table instance from useReactTable() */
    table: Table<TData>;
    children: React.ReactNode;
}
declare const TableRoot: <TData>({ table, children, className, style, theme: themeOverride, }: TableProps<TData>) => react_jsx_runtime.JSX.Element;

interface TableHeadProps extends Stylable {
    /** Optional: render only for specific header group index (default: all) */
    headerGroupIndex?: number;
}
declare const TableHead: ({ className, style, headerGroupIndex, }: TableHeadProps) => react_jsx_runtime.JSX.Element;

interface TableBodyProps extends Stylable {
    children?: react__default.ReactNode;
    /** Custom row renderer. If not provided, default cell rendering is used. */
    renderRow?: (row: Row<unknown>) => react__default.ReactNode;
}
declare const TableBody: ({ className, style, children, renderRow, }: TableBodyProps) => react_jsx_runtime.JSX.Element;

type TableContextValue<TData = unknown> = Table<TData> | null;
declare const useTableContext: <TData = unknown>() => Table<TData>;

interface DataTableScrollOptions {
    /** 스크롤 영역 최대 높이 (예: '400px', '60vh') */
    maxHeight?: string;
}
interface DataTableProps<TData> extends Stylable, ThemedComponent {
    /** 테이블 데이터 */
    data: TData[];
    /** 컬럼 정의 (TanStack Table ColumnDef). cell로 버튼/아이콘/링크 등 커스텀 렌더링 가능 */
    columns: ColumnDef$1<TData, any>[];
    /** 행 선택(체크박스) 사용 여부 */
    selectable?: boolean;
    /** 컬럼 클릭 정렬 사용 여부 */
    sortable?: boolean;
    /** 페이지네이션 사용 여부 */
    pagination?: boolean;
    /** 페이지당 행 수 */
    pageSize?: number;
    /** 행별 조건부 className (예: 특정 값이면 빨강) */
    getRowClassName?: (row: Row<TData>) => string | undefined;
    /** 행별 조건부 style */
    getRowStyle?: (row: Row<TData>) => React.CSSProperties | undefined;
    /** 선택 변경 시 콜백 */
    onSelectionChange?: (selection: Record<string, boolean>) => void;
    /** 스크롤 옵션 (많은 데이터 시 영역 고정) */
    scroll?: DataTableScrollOptions;
}
declare const DataTable: <TData>({ data, columns, selectable, sortable, pagination, pageSize, getRowClassName, getRowStyle, onSelectionChange, scroll, className, style, theme: themeOverride, }: DataTableProps<TData>) => react_jsx_runtime.JSX.Element;

interface DataTableHeadProps extends Stylable {
    /** 정렬 가능 헤더 사용 여부 (클릭 시 오름/내림차순) */
    sortable?: boolean;
}
declare const DataTableHead: ({ className, style, sortable, }: DataTableHeadProps) => react_jsx_runtime.JSX.Element;

interface EditableTableProps<TData> extends Stylable, ThemedComponent {
    /** 테이블 데이터 (폼 초기값으로 사용) */
    data: TData[];
    /** 컬럼 정의. meta.editType으로 셀 편집 타입 지정 (text | number | date | checkbox | dropdown) */
    columns: ColumnDef$1<TData, any>[];
    /** 폼 제출 시 콜백 (편집된 rows 전달) */
    onSubmit?: (data: {
        rows: TData[];
    }) => void;
    /** 제출 버튼 문구. 지정 시 테이블 하단에 제출 버튼 렌더 (onSubmit과 함께 사용) */
    submitLabel?: string;
}
declare const EditableTable: <TData>({ data, columns, onSubmit, submitLabel, className, style, theme: themeOverride, }: EditableTableProps<TData>) => react_jsx_runtime.JSX.Element;

/**
 * 컬럼 셀 편집 시 사용할 입력 타입
 */
type EditType = 'text' | 'number' | 'date' | 'checkbox' | 'dropdown';
interface EditOption {
    value: string;
    label: string;
}
/**
 * EditableTable 컬럼에서 사용하는 meta.
 * editType이 있으면 해당 셀은 편집 가능, 없으면 읽기 전용 표시만.
 */
interface EditableColumnMeta {
    /** 셀 편집 타입. 지정 시 해당 컬럼 셀이 해당 입력 컴포넌트로 렌더됨 */
    editType?: EditType;
    /** editType === 'dropdown' 일 때 선택 옵션 목록 */
    editOptions?: EditOption[];
    /** 기존 Table meta (className 등) */
    className?: string;
}

interface EditableCellProps<TData, TValue> {
    cell: CellContext<TData, TValue>;
    editType: EditType;
    editOptions?: {
        value: string;
        label: string;
    }[];
    theme: Record<string, string>;
}
declare const EditableCell: <TData, TValue>({ cell, editType, editOptions, theme, }: EditableCellProps<TData, TValue>) => react_jsx_runtime.JSX.Element;

/** 셀 에디터 타입 */
type CellEditorType = 'text' | 'datetime' | 'dropdown';
/** 컬럼 필터 데이터 타입 — 필터 입력 해석 및 비교 방식 */
type ColumnFilterType = 'text' | 'number' | 'date' | 'custom';
/** 컬럼 pinning: true는 'left'와 동일 */
type PinnedType = boolean | 'left' | 'right' | null;
interface ColumnDef<T = unknown> {
    /** 컬럼 식별자 (row[key] 접근용) */
    field: string;
    /** 헤더 표시 텍스트 */
    header?: string;
    /** 셀 너비 (px 또는 확장용) */
    width?: number;
    /** 편집 가능 여부 (editable=true일 때 개별 오버라이드) */
    editable?: boolean;
    /** 컬럼 고정: true | 'left' 왼쪽 스티키, 'right' 오른쪽 스티키 (가로 스크롤 시 고정) */
    pinned?: PinnedType;
    /** 초기 고정: 컬럼 생성 시에만 적용. pinned가 없을 때 사용 */
    initialPinned?: boolean | 'left' | 'right';
    /** true면 사용자가 pin/unpin 할 수 없음 (정의로만 고정) */
    lockPinned?: boolean;
    /** 이 컬럼에 행 드래그 핸들 표시 — 행 순서 변경(같은 그리드 내 재정렬) */
    rowDrag?: boolean;
    /** 편집 시 에디터 타입. 기본 'text' */
    editor?: CellEditorType;
    /** editor: 'dropdown' 일 때 옵션 목록 */
    dropdownOptions?: string[];
    /** 필터 데이터 타입. columnFilter 사용 시 적용 */
    filterType?: ColumnFilterType;
    /** filterType: 'custom' 일 때 (셀값, 필터 입력값) → 통과 여부 */
    filterFn?: (value: unknown, filterValue: string) => boolean;
    /** columnReorder 시 true면 드래그로 순서 변경 가능. 기본 true (false면 고정) */
    movable?: boolean;
}
type RowData = Record<string, unknown>;
interface PaginationOptions {
    pageSize: number;
    page?: number;
    onPageChange?: (page: number) => void;
}
interface ExcelGridProps {
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
    virtualScroll?: {
        rowHeight: number;
        maxHeight?: number;
    };
    /** 상단 고정 행 개수 (y축 pinned) */
    pinnedRowCount?: number;
    /** 행 grab(잡기) 가능 — 행을 잡아 다른 그리드로 드래그 시 대상 그리드 onDropRows 호출 */
    rowDraggable?: boolean;
    /** 다른 그리드에서 행을 이 그리드로 드롭했을 때 (추가할 행, insertAtIndex = 맨 뒤) */
    onDropRows?: (rows: RowData[], insertAtIndex?: number) => void;
    /** 행 드래그로 순서 변경 시 (새 행 배열 — 부모에서 rows 상태 업데이트) */
    onRowOrderChange?: (newRows: RowData[]) => void;
    /** 행 추가 버튼 노출 시 클릭 시 호출 (호출 측에서 rows 상태에 행 추가) */
    onAddRow?: () => void;
    /** Export 시 파일명. 설정 시 내보내기 버튼 노출 */
    exportFileName?: string;
    /** Export/Import 구분자. 기본 ',' */
    exportImportDelimiter?: string;
    /** Import 완료 시 (파싱된 rows) */
    onImport?: (rows: RowData[]) => void;
    onChange?: (rowIndex: number, colIndex: number, value: unknown) => void;
    /** 셀 값이 실제로 변경되었을 때 (이전값, 변경값) */
    onCellChange?: (rowIndex: number, colIndex: number, prevValue: unknown, nextValue: unknown) => void;
    /** 무한스크롤 등: 해당 행이 로딩 중이면 true (행에 로딩 표시) */
    isRowLoading?: (rowIndex: number) => boolean;
    /** 셀별 추가 className (변경 강조 등) */
    getCellClassName?: (rowIndex: number, colIndex: number) => string | undefined;
    className?: string;
    style?: React.CSSProperties;
}

/** Public API: 단일 컴포넌트. 로직 없음, 초기화 + 조합만. */
declare const ExcelGrid: ({ columns, rows, editable, selection, checkboxSelection, multiSelect, onSelectionChange, sortable, searchPlaceholder, columnFilter, columnReorder, pagination, virtualScroll, pinnedRowCount, rowDraggable, onDropRows, onRowOrderChange, onAddRow, isRowLoading, getCellClassName, exportFileName, exportImportDelimiter, onImport, onChange, onCellChange, className, style, }: ExcelGridProps) => react_jsx_runtime.JSX.Element;

declare const cn: (...inputs: ClassValue[]) => string;

interface UseDisclosureReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}
declare const useDisclosure: (initial?: boolean) => UseDisclosureReturn;

interface UseDataTableOptions<TData> {
    /** 행 선택(체크박스) 사용 여부 */
    selectable?: boolean;
    /** 컬럼 클릭 정렬 사용 여부 */
    sortable?: boolean;
    /** 페이지네이션 사용 여부 */
    pagination?: boolean;
    /** 페이지당 행 수 (pagination 시) */
    pageSize?: number;
    /** 행별 조건부 className (예: 특정 값이면 빨강) */
    getRowClassName?: (row: Row<TData>) => string | undefined;
    /** 행별 조건부 style */
    getRowStyle?: (row: Row<TData>) => CSSProperties | undefined;
    /** 선택 변경 시 콜백 (새 선택 상태) */
    onSelectionChange?: (selection: RowSelectionState) => void;
    /** 초기 정렬 상태 */
    initialSorting?: SortingState;
}
interface UseDataTablePaginationState {
    pageIndex: number;
    pageCount: number;
    setPageIndex: (index: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    canNextPage: boolean;
    canPrevPage: boolean;
}
interface UseDataTableReturn<TData> {
    table: ReturnType<typeof useReactTable<TData>>;
    getRowClassName?: (row: Row<TData>) => string | undefined;
    getRowStyle?: (row: Row<TData>) => React.CSSProperties | undefined;
    pagination: UseDataTablePaginationState | null;
}
declare const useDataTable: <TData>(data: TData[], columns: ColumnDef$1<TData, any>[], options?: UseDataTableOptions<TData>) => UseDataTableReturn<TData>;

export { Badge, type BadgeProps, type BadgeVariant, Button, type ButtonProps, type ButtonSize, type ButtonVariant, Checkbox, type CheckboxProps, ComponentTheme, type ControlledProps, DataTable, DataTableHead, type DataTableHeadProps, type DataTableProps, type DataTableScrollOptions, Dropdown, type DropdownItem, type DropdownProps, type EditOption, type EditType, EditableCell, type EditableCellProps, type EditableColumnMeta, EditableTable, type EditableTableProps, ExcelGrid, type ColumnDef as ExcelGridColumnDef, type ExcelGridProps, type RowData as ExcelGridRowData, Input, type InputProps, Modal, type ModalProps, type Stylable, type TabItem, TableRoot as Table, TableBody, type TableBodyProps, type TableContextValue, TableHead, type TableHeadProps, type TableProps, Tabs, type TabsProps, type ThemedComponent, type UseDataTableOptions, type UseDataTablePaginationState, type UseDataTableReturn, type UseDisclosureReturn, cn, useDataTable, useDisclosure, useTableContext };
