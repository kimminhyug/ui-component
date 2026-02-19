import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTheme } from '../../../theme/ThemeContext';
import type { Stylable, ThemedComponent } from '../../../types/common';
import { cn } from '../../../utils/cn';
import { Table, TableBody, TableHead } from '../Table';
import { EditableCell } from './EditableCell';
import type { EditableColumnMeta } from './editableTable.types';

export interface EditableTableProps<TData> extends Stylable, ThemedComponent {
  /** 테이블 데이터 (폼 초기값으로 사용) */
  data: TData[];
  /** 컬럼 정의. meta.editType으로 셀 편집 타입 지정 (text | number | date | checkbox | dropdown) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  /** 폼 제출 시 콜백 (편집된 rows 전달) */
  onSubmit?: (data: { rows: TData[] }) => void;
  /** 제출 버튼 문구. 지정 시 테이블 하단에 제출 버튼 렌더 (onSubmit과 함께 사용) */
  submitLabel?: string;
}

const createEditableColumns = <TData,>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[],
  theme: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ColumnDef<TData, any>[] =>
  columns.map((col) => {
    const meta = (col.meta ?? {}) as EditableColumnMeta;
    const editType = meta.editType;

    if (!editType) {
      return col;
    }

    return {
      ...col,
      cell: (ctx) => (
        <EditableCell cell={ctx} editType={editType} editOptions={meta.editOptions} theme={theme} />
      ),
    };
  });

export const EditableTable = <TData,>({
  data,
  columns,
  onSubmit,
  submitLabel,
  className,
  style,
  theme: themeOverride,
}: EditableTableProps<TData>) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.table, ...themeOverride } : globalTheme.table;
  const t = (theme ?? {}) as Record<string, string>;

  const methods = useForm<{ rows: TData[] }>({
    defaultValues: { rows: data },
    values: { rows: data },
  });

  const formRows = methods.watch('rows');

  const editableColumns = useMemo(() => createEditableColumns(columns, t), [columns, t]);

  const table = useReactTable({
    data: formRows ?? data,
    columns: editableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : undefined}
        className={cn('flex flex-col gap-2', className)}
        style={style}
      >
        <Table table={table} theme={themeOverride}>
          <TableHead />
          <TableBody
            renderRow={(row) => (
              <tr
                key={row.id}
                className={t.row}
                data-state={row.getIsSelected() ? 'selected' : undefined}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = (cell.column.columnDef.meta ?? {}) as EditableColumnMeta;
                  if (meta.editType) {
                    return flexRender(cell.column.columnDef.cell, cell.getContext());
                  }
                  return (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
                      }}
                      className={cn(t.cell, meta.className)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            )}
          />
        </Table>
        {submitLabel && onSubmit && (
          <button
            type="submit"
            className={cn(
              'self-end',
              globalTheme?.button?.base,
              globalTheme?.button?.primary
            )}
          >
            {submitLabel}
          </button>
        )}
      </form>
    </FormProvider>
  );
};
