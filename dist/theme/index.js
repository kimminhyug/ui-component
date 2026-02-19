var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/theme/base-theme.ts
var baseTheme = {
  button: {
    base: "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-400",
    ghost: "hover:bg-gray-100 focus-visible:ring-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    sizeSm: "h-8 px-3 text-sm rounded-md",
    sizeMd: "h-10 px-4 text-sm rounded-md",
    sizeLg: "h-12 px-6 text-base rounded-lg"
  },
  input: {
    base: "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
    error: "border-red-500 focus:ring-red-500"
  },
  badge: {
    base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800"
  },
  modal: {
    overlay: "fixed inset-0 bg-black/50 transition-opacity",
    panel: "relative w-full max-w-[calc(100%-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto transform overflow-x-hidden rounded-lg bg-white shadow-xl transition-all",
    title: "text-lg font-semibold text-gray-900",
    description: "mt-1 text-sm text-gray-500"
  },
  dropdown: {
    button: "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-4",
    menu: "absolute left-0 right-auto sm:left-auto sm:right-0 z-10 mt-1 min-w-56 max-w-[min(100vw_-_2rem,20rem)] max-h-[min(70vh,20rem)] overflow-y-auto origin-top-left sm:origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none",
    item: "block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap",
    itemActive: "bg-gray-100"
  },
  tabs: {
    list: "flex border-b border-gray-200 overflow-x-auto flex-nowrap -mb-px",
    tab: "border-b-2 border-transparent px-3 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap flex-shrink-0 sm:px-4",
    tabActive: "border-blue-500 text-blue-600",
    panel: "py-4 min-w-0 overflow-x-auto"
  },
  checkbox: {
    base: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
    label: "ml-2 text-sm text-gray-700"
  },
  table: {
    wrapper: "w-full overflow-auto",
    root: "min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg",
    head: "bg-gray-50",
    headRow: "",
    headCell: "px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider",
    body: "divide-y divide-gray-200 bg-white",
    row: "hover:bg-gray-50 transition-colors",
    cell: "px-4 py-3 text-sm text-gray-900"
  },
  custom: {}
};

// src/theme/merge-theme.ts
var mergeTheme = /* @__PURE__ */ __name((base, override) => {
  if (!override || typeof override !== "object") return base;
  const result = {};
  for (const key of Object.keys(base)) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (baseVal && typeof baseVal === "object" && !Array.isArray(baseVal)) {
      const overrideObj = overrideVal && typeof overrideVal === "object" && !Array.isArray(overrideVal) ? overrideVal : {};
      result[key] = { ...baseVal, ...overrideObj };
    } else {
      result[key] = overrideVal !== void 0 ? overrideVal : baseVal;
    }
  }
  for (const key of Object.keys(override)) {
    if (result[key] === void 0) {
      result[key] = override[key];
    }
  }
  return result;
}, "mergeTheme");

// src/theme/theme-presets.ts
var neonTheme = {
  button: {
    primary: "bg-cyan-500 text-black hover:bg-cyan-400 focus-visible:ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]",
    secondary: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/50 hover:bg-fuchsia-500/30 focus-visible:ring-fuchsia-400",
    outline: "border-2 border-cyan-400 text-cyan-300 bg-transparent hover:bg-cyan-500/20 focus-visible:ring-cyan-400",
    ghost: "text-pink-300 hover:bg-pink-500/20 focus-visible:ring-pink-400",
    danger: "bg-rose-500 text-white hover:bg-rose-400 focus-visible:ring-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
  },
  badge: {
    default: "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50",
    primary: "bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-400/50",
    success: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50",
    warning: "bg-amber-500/20 text-amber-300 border border-amber-400/50",
    danger: "bg-rose-500/20 text-rose-300 border border-rose-400/50"
  },
  input: {
    base: "border-cyan-500/50 bg-black/40 text-cyan-100 placeholder:text-cyan-400/60 focus:ring-cyan-400 focus:border-cyan-400",
    error: "border-rose-500 focus:ring-rose-400"
  },
  tabs: {
    list: "border-b border-cyan-500/30",
    tab: "text-cyan-400/80 hover:text-cyan-300 hover:border-cyan-400/50",
    tabActive: "border-cyan-400 text-cyan-300"
  },
  table: {
    root: "divide-y divide-cyan-500/20 border border-cyan-500/30",
    head: "bg-cyan-500/10",
    headCell: "text-cyan-300",
    body: "bg-black/20",
    row: "hover:bg-cyan-500/10",
    cell: "text-cyan-100"
  }
};
var spaceTheme = {
  button: {
    primary: "bg-indigo-700 text-white hover:bg-indigo-600 focus-visible:ring-indigo-400",
    secondary: "bg-slate-700/80 text-slate-200 border border-slate-500 hover:bg-slate-600/80 focus-visible:ring-slate-400",
    outline: "border border-violet-500/60 text-violet-200 bg-transparent hover:bg-violet-500/20 focus-visible:ring-violet-400",
    ghost: "text-slate-300 hover:bg-slate-600/50 focus-visible:ring-slate-400",
    danger: "bg-rose-700 text-white hover:bg-rose-600 focus-visible:ring-rose-400"
  },
  badge: {
    default: "bg-slate-600/80 text-slate-200",
    primary: "bg-indigo-600/80 text-indigo-100",
    success: "bg-emerald-700/50 text-emerald-200",
    warning: "bg-amber-600/50 text-amber-200",
    danger: "bg-rose-700/50 text-rose-200"
  },
  input: {
    base: "border-slate-500 bg-slate-800/80 text-slate-100 placeholder:text-slate-400 focus:ring-indigo-500 focus:border-indigo-500",
    error: "border-rose-500 focus:ring-rose-500"
  },
  tabs: {
    list: "border-b border-slate-600",
    tab: "text-slate-400 hover:text-slate-200 hover:border-slate-500",
    tabActive: "border-indigo-400 text-indigo-300"
  },
  table: {
    root: "divide-y divide-slate-600 border border-slate-600",
    head: "bg-slate-700/80",
    headCell: "text-slate-200",
    body: "bg-slate-800/50",
    row: "hover:bg-slate-600/30",
    cell: "text-slate-100"
  }
};
var retroTheme = {
  button: {
    primary: "bg-amber-600 text-white hover:bg-amber-500 focus-visible:ring-amber-500 rounded-none border-2 border-amber-800",
    secondary: "bg-stone-300 text-stone-800 hover:bg-stone-400 focus-visible:ring-stone-500 rounded-none border-2 border-stone-500",
    outline: "border-2 border-amber-800 text-amber-900 bg-amber-50 hover:bg-amber-100 focus-visible:ring-amber-600 rounded-none",
    ghost: "text-amber-900 hover:bg-amber-100 focus-visible:ring-amber-600 rounded-none",
    danger: "bg-red-700 text-white hover:bg-red-600 focus-visible:ring-red-600 rounded-none border-2 border-red-900",
    sizeSm: "h-8 px-3 text-sm rounded-none",
    sizeMd: "h-10 px-4 text-sm rounded-none",
    sizeLg: "h-12 px-6 text-base rounded-none"
  },
  badge: {
    base: "rounded-none font-semibold",
    default: "bg-stone-200 text-stone-800 border border-stone-400",
    primary: "bg-amber-200 text-amber-900 border border-amber-600",
    success: "bg-green-200 text-green-900 border border-green-600",
    warning: "bg-yellow-200 text-yellow-900 border border-yellow-600",
    danger: "bg-red-200 text-red-900 border border-red-600"
  },
  input: {
    base: "rounded-none border-2 border-stone-400 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-600",
    error: "border-red-600 focus:ring-red-500"
  },
  tabs: {
    list: "border-b-2 border-stone-400",
    tab: "rounded-none border-b-2 border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-500",
    tabActive: "border-amber-600 text-amber-800"
  },
  table: {
    root: "divide-y-2 divide-stone-300 border-2 border-stone-400 rounded-none",
    head: "bg-stone-200",
    headCell: "text-stone-800 font-semibold",
    body: "bg-stone-50",
    row: "hover:bg-amber-50",
    cell: "text-stone-800"
  }
};

// src/theme/resolveClassName.ts
var resolveClassName = /* @__PURE__ */ __name((className, customMap) => {
  if (!className?.trim()) return "";
  if (!customMap || typeof customMap !== "object") return className.trim();
  return className.trim().split(/\s+/).map((token) => customMap[token] !== void 0 ? customMap[token] : token).filter(Boolean).join(" ");
}, "resolveClassName");

// src/theme/ThemeContext.tsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback
} from "react";
import { jsx } from "react/jsx-runtime";
var ThemeContext = createContext(null);
var defaultThemes = { default: {} };
var ThemeProvider = /* @__PURE__ */ __name(({
  themes: themesProp,
  defaultThemeKey = "default",
  children
}) => {
  const [themes, setThemes] = useState(
    () => themesProp ?? defaultThemes
  );
  const [themeKey, setThemeKeyState] = useState(defaultThemeKey);
  const setThemeKey = useCallback((key) => {
    setThemeKeyState(key);
  }, []);
  const updateTheme = useCallback(
    (key, value2) => {
      setThemes((prev) => {
        const next = { ...prev };
        const prevTheme = next[key] ?? {};
        next[key] = typeof value2 === "function" ? value2(prevTheme) : value2;
        return next;
      });
    },
    []
  );
  const theme = useMemo(
    () => mergeTheme(baseTheme, themes[themeKey] ?? {}),
    [themes, themeKey]
  );
  const value = useMemo(
    () => ({
      theme,
      themeKey,
      themes,
      setThemeKey,
      updateTheme
    }),
    [theme, themeKey, themes, setThemeKey, updateTheme]
  );
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
}, "ThemeProvider");
var useTheme = /* @__PURE__ */ __name(() => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return baseTheme;
  return ctx.theme;
}, "useTheme");
var useThemeKey = /* @__PURE__ */ __name(() => {
  const ctx = useContext(ThemeContext);
  if (!ctx) return "default";
  return ctx.themeKey;
}, "useThemeKey");
var useThemeActions = /* @__PURE__ */ __name(() => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    return {
      setThemeKey: /* @__PURE__ */ __name(() => {
      }, "setThemeKey"),
      updateTheme: /* @__PURE__ */ __name(() => {
      }, "updateTheme")
    };
  return { setThemeKey: ctx.setThemeKey, updateTheme: ctx.updateTheme };
}, "useThemeActions");
var useThemeRegistry = /* @__PURE__ */ __name(() => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    return {
      theme: baseTheme,
      themeKey: "default",
      themes: defaultThemes,
      setThemeKey: /* @__PURE__ */ __name(() => {
      }, "setThemeKey"),
      updateTheme: /* @__PURE__ */ __name(() => {
      }, "updateTheme")
    };
  return ctx;
}, "useThemeRegistry");
var useComponentTheme = /* @__PURE__ */ __name((componentKey, variantKeys = []) => {
  const theme = useTheme();
  const componentTheme = theme[componentKey];
  if (!componentTheme || typeof componentTheme !== "object") return "";
  const base = componentTheme.base ?? "";
  const variants = variantKeys.map((k) => componentTheme[k]).filter(Boolean).join(" ");
  return [base, variants].filter(Boolean).join(" ");
}, "useComponentTheme");
export {
  ThemeProvider,
  baseTheme,
  mergeTheme,
  neonTheme,
  resolveClassName,
  retroTheme,
  spaceTheme,
  useComponentTheme,
  useTheme,
  useThemeActions,
  useThemeKey,
  useThemeRegistry
};
//# sourceMappingURL=index.js.map