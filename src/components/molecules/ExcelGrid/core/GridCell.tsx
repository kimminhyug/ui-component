import { cn } from '../../../../utils/cn';
import type { CellEditorType } from '../../types';

export interface GridCellProps {
  value: unknown;
  focused: boolean;
  selected: boolean;
  editing: boolean;
  rowIndex: number;
  colIndex: number;
  width?: number;
  editor?: CellEditorType;
  dropdownOptions?: string[];
  pinnedStyle?: React.CSSProperties;
  className?: string;
  /** 편집 중 blur 시 편집 모드 종료 */
  onEditingBlur?: () => void;
  /** 편집 중 값 변경 시 실시간 반영 (controlled) */
  onEditingChange?: (value: string) => void;
}

/** Dumb: 렌더링만. 이벤트/내부 state 없음. */
export const GridCell = ({
  value,
  focused,
  selected,
  editing,
  rowIndex,
  colIndex,
  width,
  editor = 'text',
  dropdownOptions = [],
  pinnedStyle,
  className,
  onEditingBlur,
  onEditingChange,
}: GridCellProps) => {
  const displayValue = value == null ? '' : String(value);
  const dataAttrs = { 'data-row': rowIndex, 'data-col': colIndex };
  const editorInputClass =
    'w-full min-w-0 text-sm outline-none rounded border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 dark:placeholder-gray-400';
  const editorSelectClass =
    'w-full min-w-0 text-sm outline-none rounded border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 appearance-none cursor-pointer';

  const blurHandler = onEditingBlur ? { onBlur: onEditingBlur } : {};
  const changeHandler = onEditingChange
    ? { onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onEditingChange(e.target.value) }
    : {};

  const renderEditor = () => {
    if (editor === 'datetime') {
      const iso = displayValue ? new Date(displayValue).toISOString().slice(0, 16) : '';
      return (
        <input
          type="datetime-local"
          value={iso}
          className={editorInputClass}
          {...dataAttrs}
          {...blurHandler}
          {...changeHandler}
          aria-label={`Cell ${rowIndex} ${colIndex}`}
        />
      );
    }
    if (editor === 'dropdown' && dropdownOptions.length > 0) {
      return (
        <select
          value={displayValue}
          className={editorSelectClass}
          {...dataAttrs}
          {...blurHandler}
          {...changeHandler}
          aria-label={`Cell ${rowIndex} ${colIndex}`}
        >
          <option value="">선택</option>
          {dropdownOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type="text"
        value={displayValue}
        className={editorInputClass}
        {...dataAttrs}
        {...blurHandler}
        {...changeHandler}
        aria-label={`Cell ${rowIndex} ${colIndex}`}
      />
    );
  };

  return (
    <td
      role="gridcell"
      data-row={rowIndex}
      data-col={colIndex}
      className={cn(
        'border-b border-r border-gray-200 dark:border-gray-700 px-2 py-1 text-sm outline-none text-gray-900 dark:text-gray-100',
        pinnedStyle && Object.keys(pinnedStyle).length > 0 && 'bg-white dark:bg-gray-800',
        editing && 'bg-blue-50/80 dark:bg-blue-900/25 dark:ring-blue-500/80 ring-2 ring-blue-400 ring-inset dark:ring-blue-500 z-[1]',
        selected && !editing && 'bg-blue-100 ring-1 ring-blue-300 ring-inset dark:bg-blue-900/35 dark:ring-blue-500',
        focused && !editing && 'ring-2 ring-blue-500 ring-inset z-[1] dark:ring-blue-400',
        className
      )}
      style={{
        ...(width != null ? { width: `${width}px`, minWidth: `${width}px` } : {}),
        ...pinnedStyle,
      }}
    >
      {editing ? renderEditor() : displayValue}
    </td>
  );
};
