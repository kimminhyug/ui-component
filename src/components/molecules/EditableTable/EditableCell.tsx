import type { CellContext } from '@tanstack/react-table';
import type { FieldPath } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { useTheme } from '../../../theme/ThemeContext';
import { Input } from '../../atoms/Input';
import { Checkbox } from '../Checkbox';
import { cn } from '../../../utils/cn';
import type { EditableColumnMeta, EditType } from './editableTable.types';

export interface EditableCellProps<TData, TValue> {
  cell: CellContext<TData, TValue>;
  editType: EditType;
  editOptions?: { value: string; label: string }[];
  theme: Record<string, string>;
}

export const EditableCell = <TData, TValue>({
  cell,
  editType,
  editOptions = [],
  theme,
}: EditableCellProps<TData, TValue>) => {
  const globalTheme = useTheme();
  const { control } = useFormContext<{ rows: TData[] }>();
  const inputTheme = (globalTheme?.input ?? {}) as Record<string, string>;
  const selectClassName = cn('w-full', inputTheme.base);
  const rowIndex = cell.row.index;
  const columnId = cell.column.id;
  const fieldName = `rows.${rowIndex}.${columnId}` as FieldPath<{ rows: TData[] }>;
  const meta = (cell.column.columnDef.meta ?? {}) as EditableColumnMeta;

  const cellClassName = cn(theme.cell, meta.className);

  if (editType === 'checkbox') {
    return (
      <td style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }} className={cellClassName}>
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={Boolean(field.value)}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              className="m-0"
            />
          )}
        />
      </td>
    );
  }

  if (editType === 'dropdown') {
    return (
      <td style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }} className={cellClassName}>
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <select
              ref={field.ref}
              value={String(field.value ?? '')}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              className={selectClassName}
            >
              {editOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
      </td>
    );
  }

  const inputType = editType === 'number' ? 'number' : editType === 'date' ? 'date' : 'text';

  return (
    <td style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }} className={cellClassName}>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Input
            type={inputType}
            {...field}
            value={field.value != null ? String(field.value) : ''}
            onChange={(e) => {
              const v = e.target.value;
              if (editType === 'number') {
                const num = e.target.value === '' ? undefined : Number(e.target.value);
                field.onChange(Number.isNaN(num) ? v : num);
              } else {
                field.onChange(v);
              }
            }}
            className="min-w-0"
          />
        )}
      />
    </td>
  );
};
