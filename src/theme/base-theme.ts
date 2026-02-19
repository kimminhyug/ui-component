import type { UITheme } from './theme.types';

export const baseTheme: UITheme = {
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-400',
    ghost: 'hover:bg-gray-100 focus-visible:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    sizeSm: 'h-8 px-3 text-sm rounded-md',
    sizeMd: 'h-10 px-4 text-sm rounded-md',
    sizeLg: 'h-12 px-6 text-base rounded-lg',
  },
  input: {
    base: 'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
    error: 'border-red-500 focus:ring-red-500',
  },
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
  },
  modal: {
    overlay: 'fixed inset-0 bg-black/50 transition-opacity',
    panel:
      'relative w-full max-w-[calc(100%-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto transform overflow-x-hidden rounded-lg bg-white shadow-xl transition-all',
    title: 'text-lg font-semibold text-gray-900',
    description: 'mt-1 text-sm text-gray-500',
  },
  dropdown: {
    button:
      'inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-4',
    menu:
      'absolute left-0 right-auto sm:left-auto sm:right-0 z-10 mt-1 min-w-56 max-w-[min(100vw_-_2rem,20rem)] max-h-[min(70vh,20rem)] overflow-y-auto origin-top-left sm:origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none',
    item: 'block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap',
    itemActive: 'bg-gray-100',
  },
  tabs: {
    list: 'flex border-b border-gray-200 overflow-x-auto flex-nowrap -mb-px',
    tab: 'border-b-2 border-transparent px-3 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap flex-shrink-0 sm:px-4',
    tabActive: 'border-blue-500 text-blue-600',
    panel: 'py-4 min-w-0 overflow-x-auto',
  },
  checkbox: {
    base: 'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
    label: 'ml-2 text-sm text-gray-700',
  },
  table: {
    wrapper: 'w-full overflow-auto',
    root: 'min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg',
    head: 'bg-gray-50',
    headRow: '',
    headCell: 'px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider',
    body: 'divide-y divide-gray-200 bg-white',
    row: 'hover:bg-gray-50 transition-colors',
    cell: 'px-4 py-3 text-sm text-gray-900',
  },
  custom: {},
};
