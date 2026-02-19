import { useTableContext } from './TableContext';
import { useTheme } from '../../../theme/ThemeContext';
import { cn } from '../../../utils/cn';
import type { Stylable } from '../../../types/common';

export interface TableHeadProps extends Stylable {
  /** Optional: render only for specific header group index (default: all) */
  headerGroupIndex?: number;
}

export const TableHead = ({
  className,
  style,
  headerGroupIndex,
}: TableHeadProps) => {
  const table = useTableContext();
  const globalTheme = useTheme();
  const theme = (globalTheme.table ?? {}) as Record<string, string>;

  const groups = table.getHeaderGroups();
  const groupsToRender =
    headerGroupIndex !== undefined ? [groups[headerGroupIndex]] : groups;

  return (
    <thead className={cn(theme.head, className)} style={style}>
      {groupsToRender.map(
        (group) =>
          group && (
            <tr key={group.id} className={theme.headRow}>
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  className={cn(theme.headCell, (header.column.columnDef.meta as { className?: string })?.className)}
                >
                  {typeof header.column.columnDef.header === 'function'
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header ?? null}
                </th>
              ))}
            </tr>
          )
      )}
    </thead>
  );
};
