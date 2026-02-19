import { createContext, useContext } from 'react';
import type { Table as TableInstance } from '@tanstack/react-table';

export type TableContextValue<TData = unknown> = TableInstance<TData> | null;

const TableContext = createContext<TableContextValue>(null);

export const useTableContext = <TData = unknown,>(): TableInstance<TData> => {
  const table = useContext(TableContext);
  if (!table) {
    throw new Error('Table subcomponents must be used within a Table root.');
  }
  return table as TableInstance<TData>;
};

export { TableContext };
