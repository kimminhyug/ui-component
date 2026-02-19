import React from 'react';
import type { Row } from '@tanstack/react-table';
import { useTableContext } from './TableContext';
import { useTheme } from '../../../theme/ThemeContext';
import { cn } from '../../../utils/cn';
import type { Stylable } from '../../../types/common';

export interface TableBodyProps extends Stylable {
  children?: React.ReactNode;
  /** Custom row renderer. If not provided, default cell rendering is used. */
  renderRow?: (row: Row<unknown>) => React.ReactNode;
}

export const TableBody = ({
  className,
  style,
  children,
  renderRow,
}: TableBodyProps) => {
  const table = useTableContext();
  const globalTheme = useTheme();
  const theme = (globalTheme.table ?? {}) as Record<string, string>;
  const rows = table.getRowModel().rows;

  if (children !== undefined) {
    return (
      <tbody className={cn(theme.body, className)} style={style}>
        {children}
      </tbody>
    );
  }

  return (
    <tbody className={cn(theme.body, className)} style={style}>
      {rows.map((row) =>
        renderRow ? (
          <React.Fragment key={row.id}>{renderRow(row)}</React.Fragment>
        ) : (
          <TableDefaultRow key={row.id} row={row} theme={theme} />
        )
      )}
    </tbody>
  );
};

const TableDefaultRow = <TData,>({
  row,
  theme,
}: {
  row: Row<TData>;
  theme: Record<string, string>;
}) => {
  return (
    <tr
      key={row.id}
      className={theme.row}
      data-state={row.getIsSelected() ? 'selected' : undefined}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }}
          className={cn(theme.cell, (cell.column.columnDef.meta as { className?: string })?.className)}
        >
          {typeof cell.column.columnDef.cell === 'function'
            ? cell.column.columnDef.cell(cell.getContext())
            : String(cell.getValue() ?? '')}
        </td>
      ))}
    </tr>
  );
};
