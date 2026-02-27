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
}: GridCellProps) => {
  const displayValue = value == null ? '' : String(value);
  const dataAttrs = { 'data-row': rowIndex, 'data-col': colIndex };
  const inputClass = 'w-full min-w-0 border-0 bg-transparent px-0 py-0 text-sm outline-none';

  const renderEditor = () => {
    if (editor === 'datetime') {
      const iso = displayValue ? new Date(displayValue).toISOString().slice(0, 16) : '';
      return (
        <input
          type="datetime-local"
          defaultValue={iso}
          className={inputClass}
          {...dataAttrs}
          aria-label={`Cell ${rowIndex} ${colIndex}`}
        />
      );
    }
    if (editor === 'dropdown' && dropdownOptions.length > 0) {
      return (
        <select
          defaultValue={displayValue}
          className={inputClass}
          {...dataAttrs}
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
        defaultValue={displayValue}
        className={inputClass}
        {...dataAttrs}
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
        'border-b border-r border-gray-200 px-2 py-1 text-sm outline-none',
        selected && 'bg-blue-100 ring-1 ring-blue-300 ring-inset',
        focused && 'ring-2 ring-blue-500 ring-inset z-[1]',
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
