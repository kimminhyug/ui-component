import { useTableContext } from '../Table/TableContext';
import { useTheme } from '../../../theme/ThemeContext';
import { cn } from '../../../utils/cn';
import type { Stylable } from '../../../types/common';

export interface DataTableHeadProps extends Stylable {
  /** 정렬 가능 헤더 사용 여부 (클릭 시 오름/내림차순) */
  sortable?: boolean;
}

const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | false }) => {
  if (direction === 'asc') return <span className="ml-1">↑</span>;
  if (direction === 'desc') return <span className="ml-1">↓</span>;
  return <span className="ml-1 opacity-40">⇅</span>;
};

export const DataTableHead = ({
  className,
  style,
  sortable = false,
}: DataTableHeadProps) => {
  const table = useTableContext();
  const globalTheme = useTheme();
  const theme = (globalTheme.table ?? {}) as Record<string, string>;
  const groups = table.getHeaderGroups();

  return (
    <thead className={cn(theme.head, className)} style={style}>
      {groups.map(
        (group) =>
          group && (
            <tr key={group.id} className={theme.headRow}>
              {group.headers.map((header) => {
                const canSort = sortable && header.column.getCanSort();
                const content = (
                  <>
                    {typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header ?? null}
                    {canSort && (
                      <SortIcon
                        direction={header.column.getIsSorted() ?? false}
                      />
                    )}
                  </>
                );
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                    className={cn(
                      theme.headCell,
                      (header.column.columnDef.meta as { className?: string })
                        ?.className,
                      canSort && 'cursor-pointer select-none'
                    )}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {content}
                  </th>
                );
              })}
            </tr>
          )
      )}
    </thead>
  );
};
