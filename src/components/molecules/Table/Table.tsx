import type { Table as TableInstance } from '@tanstack/react-table';
import { TableContext } from './TableContext';
import { useTheme } from '../../../theme/ThemeContext';
import { cn } from '../../../utils/cn';
import type { Stylable, ThemedComponent } from '../../../types/common';

export interface TableProps<TData = unknown> extends Stylable, ThemedComponent {
  /** TanStack Table instance from useReactTable() */
  table: TableInstance<TData>;
  children: React.ReactNode;
}

const TableRoot = <TData,>({
  table,
  children,
  className,
  style,
  theme: themeOverride,
}: TableProps<TData>) => {
  const globalTheme = useTheme();
  const theme = themeOverride
    ? { ...globalTheme.table, ...themeOverride }
    : globalTheme.table;
  const t = (theme ?? {}) as Record<string, string>;

  return (
    <TableContext.Provider value={table as TableInstance<unknown>}>
      <div className={cn(t.wrapper, className)} style={style}>
        <table className={t.root}>{children}</table>
      </div>
    </TableContext.Provider>
  );
};

export { TableRoot as Table };
