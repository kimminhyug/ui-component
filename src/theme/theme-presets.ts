import type { UITheme } from './theme.types';

export const neonTheme: UITheme = {
  button: {
    primary:
      'bg-cyan-500 text-black hover:bg-cyan-400 focus-visible:ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]',
    secondary:
      'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/50 hover:bg-fuchsia-500/30 focus-visible:ring-fuchsia-400',
    outline:
      'border-2 border-cyan-400 text-cyan-300 bg-transparent hover:bg-cyan-500/20 focus-visible:ring-cyan-400',
    ghost: 'text-pink-300 hover:bg-pink-500/20 focus-visible:ring-pink-400',
    danger:
      'bg-rose-500 text-white hover:bg-rose-400 focus-visible:ring-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]',
  },
  badge: {
    default: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50',
    primary: 'bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-400/50',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-400/50',
    danger: 'bg-rose-500/20 text-rose-300 border border-rose-400/50',
  },
  input: {
    base: 'border-cyan-500/50 bg-black/40 text-cyan-100 placeholder:text-cyan-400/60 focus:ring-cyan-400 focus:border-cyan-400',
    error: 'border-rose-500 focus:ring-rose-400',
  },
  tabs: {
    list: 'border-b border-cyan-500/30',
    tab: 'text-cyan-400/80 hover:text-cyan-300 hover:border-cyan-400/50',
    tabActive: 'border-cyan-400 text-cyan-300',
  },
  table: {
    root: 'divide-y divide-cyan-500/20 border border-cyan-500/30',
    head: 'bg-cyan-500/10',
    headCell: 'text-cyan-300',
    body: 'bg-black/20',
    row: 'hover:bg-cyan-500/10',
    cell: 'text-cyan-100',
  },
};

export const spaceTheme: UITheme = {
  button: {
    primary:
      'bg-indigo-700 text-white hover:bg-indigo-600 focus-visible:ring-indigo-400',
    secondary:
      'bg-slate-700/80 text-slate-200 border border-slate-500 hover:bg-slate-600/80 focus-visible:ring-slate-400',
    outline:
      'border border-violet-500/60 text-violet-200 bg-transparent hover:bg-violet-500/20 focus-visible:ring-violet-400',
    ghost: 'text-slate-300 hover:bg-slate-600/50 focus-visible:ring-slate-400',
    danger: 'bg-rose-700 text-white hover:bg-rose-600 focus-visible:ring-rose-400',
  },
  badge: {
    default: 'bg-slate-600/80 text-slate-200',
    primary: 'bg-indigo-600/80 text-indigo-100',
    success: 'bg-emerald-700/50 text-emerald-200',
    warning: 'bg-amber-600/50 text-amber-200',
    danger: 'bg-rose-700/50 text-rose-200',
  },
  input: {
    base: 'border-slate-500 bg-slate-800/80 text-slate-100 placeholder:text-slate-400 focus:ring-indigo-500 focus:border-indigo-500',
    error: 'border-rose-500 focus:ring-rose-500',
  },
  tabs: {
    list: 'border-b border-slate-600',
    tab: 'text-slate-400 hover:text-slate-200 hover:border-slate-500',
    tabActive: 'border-indigo-400 text-indigo-300',
  },
  table: {
    root: 'divide-y divide-slate-600 border border-slate-600',
    head: 'bg-slate-700/80',
    headCell: 'text-slate-200',
    body: 'bg-slate-800/50',
    row: 'hover:bg-slate-600/30',
    cell: 'text-slate-100',
  },
};

export const retroTheme: UITheme = {
  button: {
    primary:
      'bg-amber-600 text-white hover:bg-amber-500 focus-visible:ring-amber-500 rounded-none border-2 border-amber-800',
    secondary:
      'bg-stone-300 text-stone-800 hover:bg-stone-400 focus-visible:ring-stone-500 rounded-none border-2 border-stone-500',
    outline:
      'border-2 border-amber-800 text-amber-900 bg-amber-50 hover:bg-amber-100 focus-visible:ring-amber-600 rounded-none',
    ghost:
      'text-amber-900 hover:bg-amber-100 focus-visible:ring-amber-600 rounded-none',
    danger:
      'bg-red-700 text-white hover:bg-red-600 focus-visible:ring-red-600 rounded-none border-2 border-red-900',
    sizeSm: 'h-8 px-3 text-sm rounded-none',
    sizeMd: 'h-10 px-4 text-sm rounded-none',
    sizeLg: 'h-12 px-6 text-base rounded-none',
  },
  badge: {
    base: 'rounded-none font-semibold',
    default: 'bg-stone-200 text-stone-800 border border-stone-400',
    primary: 'bg-amber-200 text-amber-900 border border-amber-600',
    success: 'bg-green-200 text-green-900 border border-green-600',
    warning: 'bg-yellow-200 text-yellow-900 border border-yellow-600',
    danger: 'bg-red-200 text-red-900 border border-red-600',
  },
  input: {
    base: 'rounded-none border-2 border-stone-400 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-600',
    error: 'border-red-600 focus:ring-red-500',
  },
  tabs: {
    list: 'border-b-2 border-stone-400',
    tab: 'rounded-none border-b-2 border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-500',
    tabActive: 'border-amber-600 text-amber-800',
  },
  table: {
    root: 'divide-y-2 divide-stone-300 border-2 border-stone-400 rounded-none',
    head: 'bg-stone-200',
    headCell: 'text-stone-800 font-semibold',
    body: 'bg-stone-50',
    row: 'hover:bg-amber-50',
    cell: 'text-stone-800',
  },
};
