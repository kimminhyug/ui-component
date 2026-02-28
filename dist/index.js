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

// src/i18n/base-messages.ts
var baseMessages = {
  button: {
    submit: "\uC81C\uCD9C",
    cancel: "\uCDE8\uC18C",
    confirm: "\uD655\uC778",
    close: "\uB2EB\uAE30",
    save: "\uC800\uC7A5",
    delete: "\uC0AD\uC81C",
    edit: "\uD3B8\uC9D1",
    back: "\uB4A4\uB85C"
  },
  input: {
    placeholder: "\uC785\uB825\uD558\uC138\uC694",
    search: "\uAC80\uC0C9",
    clear: "\uC9C0\uC6B0\uAE30"
  },
  badge: {
    new: "\uC0C8 \uD56D\uBAA9",
    default: "\uAE30\uBCF8"
  },
  modal: {
    close: "\uB2EB\uAE30",
    confirm: "\uD655\uC778",
    cancel: "\uCDE8\uC18C",
    title: "\uC54C\uB9BC",
    description: ""
  },
  dropdown: {
    placeholder: "\uC120\uD0DD\uD558\uC138\uC694",
    noOptions: "\uC120\uD0DD \uD56D\uBAA9 \uC5C6\uC74C",
    searchPlaceholder: "\uAC80\uC0C9..."
  },
  tabs: {
    next: "\uB2E4\uC74C",
    prev: "\uC774\uC804"
  },
  checkbox: {
    label: ""
  },
  table: {
    empty: "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",
    loading: "\uB85C\uB529 \uC911...",
    noResults: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",
    pageInfo: "{{from}}-{{to}} / {{total}}",
    rowsPerPage: "\uD398\uC774\uC9C0\uB2F9 \uD589 \uC218",
    firstPage: "\uCCAB \uD398\uC774\uC9C0",
    lastPage: "\uB9C8\uC9C0\uB9C9 \uD398\uC774\uC9C0",
    nextPage: "\uB2E4\uC74C \uD398\uC774\uC9C0",
    prevPage: "\uC774\uC804 \uD398\uC774\uC9C0",
    // DataTable: 페이지네이션 버튼(짧은 형태)
    first: "\uCC98\uC74C",
    prev: "\uC774\uC804",
    next: "\uB2E4\uC74C",
    last: "\uB9C8\uC9C0\uB9C9",
    // DataTable: 선택 체크박스 aria-label
    selectAll: "\uC804\uCCB4 \uC120\uD0DD",
    selectRow: "\uD589 \uC120\uD0DD"
  }
};

// src/i18n/merge-messages.ts
var mergeMessages = /* @__PURE__ */ __name((base, override) => {
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
}, "mergeMessages");

// src/i18n/I18nContext.tsx
import { createContext as createContext2, useContext as useContext2, useMemo as useMemo2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var replaceParams = /* @__PURE__ */ __name((template, params) => {
  if (!params) return template;
  let out = template;
  for (const [k, v] of Object.entries(params)) {
    out = out.split(`{{${k}}}`).join(String(v));
  }
  return out;
}, "replaceParams");
var I18nContext = createContext2(baseMessages);
var I18nProvider = /* @__PURE__ */ __name(({ messages, children }) => {
  const value = useMemo2(
    () => messages ? mergeMessages(baseMessages, messages) : baseMessages,
    [messages]
  );
  return /* @__PURE__ */ jsx2(I18nContext.Provider, { value, children });
}, "I18nProvider");
var useI18n = /* @__PURE__ */ __name(() => {
  const ctx = useContext2(I18nContext);
  if (!ctx) return baseMessages;
  return ctx;
}, "useI18n");
var useMessage = /* @__PURE__ */ __name((componentKey, messageKey, params) => {
  const messages = useI18n();
  const map = messages[componentKey];
  const raw = (map && typeof map === "object" && map[messageKey]) ?? "";
  return typeof raw === "string" ? replaceParams(raw, params) : "";
}, "useMessage");
var useT = /* @__PURE__ */ __name(() => {
  const messages = useI18n();
  return (key, params) => {
    const dot = key.indexOf(".");
    const componentKey = dot < 0 ? key : key.slice(0, dot);
    const messageKey = dot < 0 ? "" : key.slice(dot + 1);
    const map = messages[componentKey];
    const raw = (map && typeof map === "object" && map[messageKey]) ?? "";
    return typeof raw === "string" ? replaceParams(raw, params) : "";
  };
}, "useT");

// src/components/atoms/Button.tsx
import { forwardRef } from "react";

// src/utils/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
var cn = /* @__PURE__ */ __name((...inputs) => twMerge(clsx(inputs)), "cn");

// src/components/atoms/Button.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var sizeMap = { sm: "sizeSm", md: "sizeMd", lg: "sizeLg" };
var Button = forwardRef(
  ({
    variant = "primary",
    size = "md",
    fullWidth,
    className,
    style,
    theme: themeOverride,
    disabled,
    children,
    ...rest
  }, ref) => {
    const globalTheme = useTheme();
    const theme = themeOverride ? { ...globalTheme.button, ...themeOverride } : globalTheme.button;
    const t = theme ?? {};
    const resolvedClassName = resolveClassName(className, globalTheme.custom);
    const base = t.base ?? "";
    const variantClass = t[variant] ?? "";
    const sizeClass = t[sizeMap[size]] ?? "";
    return /* @__PURE__ */ jsx3(
      "button",
      {
        ref,
        type: "button",
        disabled,
        className: cn(base, variantClass, sizeClass, fullWidth && "w-full", resolvedClassName),
        style,
        ...rest,
        children
      }
    );
  }
);
Button.displayName = "Button";

// src/components/atoms/Input.tsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var Input = forwardRef2(
  ({ className, style, theme: themeOverride, error, ...rest }, ref) => {
    const globalTheme = useTheme();
    const theme = themeOverride ? { ...globalTheme.input, ...themeOverride } : globalTheme.input;
    const t = theme ?? {};
    const resolvedClassName = resolveClassName(className, globalTheme.custom);
    const base = t.base ?? "";
    const errorClass = error ? t.error ?? "" : "";
    return /* @__PURE__ */ jsx4("input", { ref, className: cn(base, errorClass, resolvedClassName), style, ...rest });
  }
);
Input.displayName = "Input";

// src/components/atoms/Badge.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
var Badge = /* @__PURE__ */ __name(({
  variant = "default",
  className,
  style,
  theme: themeOverride,
  children,
  ...rest
}) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.badge, ...themeOverride } : globalTheme.badge;
  const t = theme ?? {};
  const resolvedClassName = resolveClassName(className, globalTheme.custom);
  const base = t.base ?? "";
  const variantClass = t[variant] ?? "";
  return /* @__PURE__ */ jsx5("span", { className: cn(base, variantClass, resolvedClassName), style, ...rest, children });
}, "Badge");

// src/components/molecules/Modal.tsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { jsx as jsx6, jsxs } from "react/jsx-runtime";
var Modal = /* @__PURE__ */ __name(({
  open,
  onClose,
  title,
  description,
  children,
  closeOnOverlayClick = true,
  className,
  style,
  theme: themeOverride
}) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.modal, ...themeOverride } : globalTheme.modal;
  const t = theme ?? {};
  return /* @__PURE__ */ jsx6(Transition, { show: open, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: closeOnOverlayClick ? onClose : () => {
  }, children: [
    /* @__PURE__ */ jsx6(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-out duration-200",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "ease-in duration-150",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
        children: /* @__PURE__ */ jsx6("div", { className: cn("fixed inset-0", t.overlay) })
      }
    ),
    /* @__PURE__ */ jsx6("div", { className: "fixed inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx6("div", { className: "flex min-h-full items-center justify-center p-4", children: /* @__PURE__ */ jsx6(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-out duration-200",
        enterFrom: "opacity-0 scale-95",
        enterTo: "opacity-100 scale-100",
        leave: "ease-in duration-150",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-95",
        children: /* @__PURE__ */ jsxs(Dialog.Panel, { className: cn(t.panel, className), style, children: [
          (title || description) && /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
            title && /* @__PURE__ */ jsx6(Dialog.Title, { className: t.title, children: title }),
            description && /* @__PURE__ */ jsx6(Dialog.Description, { className: t.description, children: description })
          ] }),
          /* @__PURE__ */ jsx6("div", { className: "p-4 pt-0", children })
        ] })
      }
    ) }) })
  ] }) });
}, "Modal");

// src/components/molecules/Dropdown.tsx
import { Fragment as Fragment2 } from "react";
import { Menu, Transition as Transition2 } from "@headlessui/react";
import { jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
var Dropdown = /* @__PURE__ */ __name(({
  trigger,
  items,
  selectedKey,
  className,
  style,
  theme: themeOverride
}) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.dropdown, ...themeOverride } : globalTheme.dropdown;
  const t = theme ?? {};
  return /* @__PURE__ */ jsxs2(Menu, { as: "div", className: "relative inline-block text-left", children: [
    /* @__PURE__ */ jsx7(Menu.Button, { className: cn(t.button, className), style, children: trigger }),
    /* @__PURE__ */ jsx7(
      Transition2,
      {
        as: Fragment2,
        enter: "transition ease-out duration-100",
        enterFrom: "transform opacity-0 scale-95",
        enterTo: "transform opacity-100 scale-100",
        leave: "transition ease-in duration-75",
        leaveFrom: "transform opacity-100 scale-100",
        leaveTo: "transform opacity-0 scale-95",
        children: /* @__PURE__ */ jsx7(Menu.Items, { className: cn(t.menu, "py-1"), children: items.map((item) => /* @__PURE__ */ jsx7(Menu.Item, { disabled: item.disabled, children: ({ active }) => /* @__PURE__ */ jsx7(
          "button",
          {
            type: "button",
            onClick: item.onClick,
            disabled: item.disabled,
            className: cn(t.item, (active || item.key === selectedKey) && t.itemActive),
            children: item.label
          }
        ) }, item.key)) })
      }
    )
  ] });
}, "Dropdown");

// src/components/molecules/Tabs.tsx
import { Tab } from "@headlessui/react";
import { jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
var Tabs = /* @__PURE__ */ __name(({
  items,
  selectedIndex,
  defaultIndex = 0,
  onChange,
  className,
  style,
  theme: themeOverride
}) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.tabs, ...themeOverride } : globalTheme.tabs;
  const t = theme ?? {};
  return /* @__PURE__ */ jsxs3(
    Tab.Group,
    {
      selectedIndex,
      defaultIndex,
      onChange,
      className,
      style,
      children: [
        /* @__PURE__ */ jsx8(Tab.List, { className: t.list, children: items.map((item) => /* @__PURE__ */ jsx8(Tab, { className: ({ selected }) => cn(t.tab, selected && t.tabActive), children: item.label }, item.key)) }),
        /* @__PURE__ */ jsx8(Tab.Panels, { className: t.panel, children: items.map((item) => /* @__PURE__ */ jsx8(Tab.Panel, { children: item.panel }, item.key)) })
      ]
    }
  );
}, "Tabs");

// src/components/molecules/Checkbox.tsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
var Checkbox = forwardRef3(
  ({ checked, defaultChecked, onChange, label, className, style, theme: themeOverride, ...rest }, ref) => {
    const globalTheme = useTheme();
    const theme = themeOverride ? { ...globalTheme.checkbox, ...themeOverride } : globalTheme.checkbox;
    const t = theme ?? {};
    const handleChange = /* @__PURE__ */ __name((e) => {
      onChange?.(e.target.checked);
    }, "handleChange");
    return /* @__PURE__ */ jsxs4("label", { className: "inline-flex items-center", style, children: [
      /* @__PURE__ */ jsx9(
        "input",
        {
          ref,
          type: "checkbox",
          checked,
          defaultChecked,
          onChange: handleChange,
          className: cn(t.base, className),
          ...rest
        }
      ),
      label != null && /* @__PURE__ */ jsx9("span", { className: t.label, children: label })
    ] });
  }
);
Checkbox.displayName = "Checkbox";

// src/components/molecules/Table/TableContext.tsx
import { createContext as createContext3, useContext as useContext3 } from "react";
var TableContext = createContext3(null);
var useTableContext = /* @__PURE__ */ __name(() => {
  const table = useContext3(TableContext);
  if (!table) {
    throw new Error("Table subcomponents must be used within a Table root.");
  }
  return table;
}, "useTableContext");

// src/components/molecules/Table/Table.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
var TableRoot = /* @__PURE__ */ __name(({
  table,
  children,
  className,
  style,
  theme: themeOverride
}) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.table, ...themeOverride } : globalTheme.table;
  const t = theme ?? {};
  return /* @__PURE__ */ jsx10(TableContext.Provider, { value: table, children: /* @__PURE__ */ jsx10("div", { className: cn(t.wrapper, className), style, children: /* @__PURE__ */ jsx10("table", { className: t.root, children }) }) });
}, "TableRoot");

// src/components/molecules/Table/TableHead.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
var TableHead = /* @__PURE__ */ __name(({
  className,
  style,
  headerGroupIndex
}) => {
  const table = useTableContext();
  const globalTheme = useTheme();
  const theme = globalTheme.table ?? {};
  const groups = table.getHeaderGroups();
  const groupsToRender = headerGroupIndex !== void 0 ? [groups[headerGroupIndex]] : groups;
  return /* @__PURE__ */ jsx11("thead", { className: cn(theme.head, className), style, children: groupsToRender.map(
    (group) => group && /* @__PURE__ */ jsx11("tr", { className: theme.headRow, children: group.headers.map((header) => /* @__PURE__ */ jsx11(
      "th",
      {
        colSpan: header.colSpan,
        style: { width: header.getSize() !== 150 ? header.getSize() : void 0 },
        className: cn(theme.headCell, header.column.columnDef.meta?.className),
        children: typeof header.column.columnDef.header === "function" ? header.column.columnDef.header(header.getContext()) : header.column.columnDef.header ?? null
      },
      header.id
    )) }, group.id)
  ) });
}, "TableHead");

// src/components/molecules/Table/TableBody.tsx
import React from "react";
import { jsx as jsx12 } from "react/jsx-runtime";
var TableBody = /* @__PURE__ */ __name(({
  className,
  style,
  children,
  renderRow
}) => {
  const table = useTableContext();
  const globalTheme = useTheme();
  const theme = globalTheme.table ?? {};
  const rows = table.getRowModel().rows;
  if (children !== void 0) {
    return /* @__PURE__ */ jsx12("tbody", { className: cn(theme.body, className), style, children });
  }
  return /* @__PURE__ */ jsx12("tbody", { className: cn(theme.body, className), style, children: rows.map(
    (row) => renderRow ? /* @__PURE__ */ jsx12(React.Fragment, { children: renderRow(row) }, row.id) : /* @__PURE__ */ jsx12(TableDefaultRow, { row, theme }, row.id)
  ) });
}, "TableBody");
var TableDefaultRow = /* @__PURE__ */ __name(({
  row,
  theme
}) => {
  return /* @__PURE__ */ jsx12(
    "tr",
    {
      className: theme.row,
      "data-state": row.getIsSelected() ? "selected" : void 0,
      children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx12(
        "td",
        {
          style: { width: cell.column.getSize() !== 150 ? cell.column.getSize() : void 0 },
          className: cn(theme.cell, cell.column.columnDef.meta?.className),
          children: typeof cell.column.columnDef.cell === "function" ? cell.column.columnDef.cell(cell.getContext()) : String(cell.getValue() ?? "")
        },
        cell.id
      ))
    },
    row.id
  );
}, "TableDefaultRow");

// src/components/molecules/DataTable/DataTable.tsx
import { flexRender } from "@tanstack/react-table";

// src/hooks/useDataTable.ts
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel
} from "@tanstack/react-table";
import { useMemo as useMemo3, useState as useState2 } from "react";
var useDataTable = /* @__PURE__ */ __name((data, columns, options = {}) => {
  const {
    selectable = false,
    sortable = false,
    pagination: usePagination = false,
    pageSize: initialPageSize = 10,
    getRowClassName,
    getRowStyle,
    onSelectionChange,
    initialSorting
  } = options;
  const [rowSelection, setRowSelection] = useState2({});
  const [sorting, setSorting] = useState2(initialSorting ?? []);
  const [pagination, setPagination] = useState2({
    pageIndex: 0,
    pageSize: initialPageSize
  });
  const handleRowSelectionChange = /* @__PURE__ */ __name((updater) => {
    const next = typeof updater === "function" ? updater(rowSelection) : updater;
    setRowSelection(next);
    onSelectionChange?.(next);
  }, "handleRowSelectionChange");
  const enhancedColumns = useMemo3(() => {
    return columns.map((col) => ({
      ...col,
      enableSorting: sortable && col.enableSorting !== false
    }));
  }, [columns, sortable]);
  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: {
      rowSelection: selectable ? rowSelection : {},
      sorting: sortable ? sorting : void 0,
      pagination: usePagination ? pagination : void 0
    },
    onRowSelectionChange: selectable ? handleRowSelectionChange : void 0,
    onSortingChange: sortable ? setSorting : void 0,
    onPaginationChange: usePagination ? setPagination : void 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : void 0,
    getPaginationRowModel: usePagination ? getPaginationRowModel() : void 0
  });
  const paginationState = usePagination ? {
    pageIndex: table.getState().pagination.pageIndex,
    pageCount: table.getPageCount(),
    setPageIndex: table.setPageIndex,
    nextPage: table.nextPage,
    prevPage: table.previousPage,
    firstPage: /* @__PURE__ */ __name(() => table.setPageIndex(0), "firstPage"),
    lastPage: /* @__PURE__ */ __name(() => table.setPageIndex(table.getPageCount() - 1), "lastPage"),
    canNextPage: table.getCanNextPage(),
    canPrevPage: table.getCanPreviousPage()
  } : null;
  return {
    table,
    getRowClassName,
    getRowStyle,
    pagination: paginationState
  };
}, "useDataTable");

// src/components/molecules/DataTable/IndeterminateCheckbox.tsx
import { useEffect, useRef } from "react";
import { jsx as jsx13 } from "react/jsx-runtime";
var IndeterminateCheckbox = /* @__PURE__ */ __name(({
  checked,
  indeterminate,
  onChange,
  disabled,
  "aria-label": ariaLabel
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);
  return /* @__PURE__ */ jsx13(
    Checkbox,
    {
      ref,
      checked,
      onChange,
      disabled,
      "aria-label": ariaLabel
    }
  );
}, "IndeterminateCheckbox");

// src/components/molecules/DataTable/DataTableHead.tsx
import { Fragment as Fragment3, jsx as jsx14, jsxs as jsxs5 } from "react/jsx-runtime";
var SortIcon = /* @__PURE__ */ __name(({ direction }) => {
  if (direction === "asc") return /* @__PURE__ */ jsx14("span", { className: "ml-1", children: "\u2191" });
  if (direction === "desc") return /* @__PURE__ */ jsx14("span", { className: "ml-1", children: "\u2193" });
  return /* @__PURE__ */ jsx14("span", { className: "ml-1 opacity-40", children: "\u21C5" });
}, "SortIcon");
var DataTableHead = /* @__PURE__ */ __name(({
  className,
  style,
  sortable = false
}) => {
  const table = useTableContext();
  const globalTheme = useTheme();
  const theme = globalTheme.table ?? {};
  const groups = table.getHeaderGroups();
  return /* @__PURE__ */ jsx14("thead", { className: cn(theme.head, className), style, children: groups.map(
    (group) => group && /* @__PURE__ */ jsx14("tr", { className: theme.headRow, children: group.headers.map((header) => {
      const canSort = sortable && header.column.getCanSort();
      const content = /* @__PURE__ */ jsxs5(Fragment3, { children: [
        typeof header.column.columnDef.header === "function" ? header.column.columnDef.header(header.getContext()) : header.column.columnDef.header ?? null,
        canSort && /* @__PURE__ */ jsx14(
          SortIcon,
          {
            direction: header.column.getIsSorted() ?? false
          }
        )
      ] });
      return /* @__PURE__ */ jsx14(
        "th",
        {
          colSpan: header.colSpan,
          style: {
            width: header.getSize() !== 150 ? header.getSize() : void 0
          },
          className: cn(
            theme.headCell,
            header.column.columnDef.meta?.className,
            canSort && "cursor-pointer select-none"
          ),
          onClick: canSort ? header.column.getToggleSortingHandler() : void 0,
          children: content
        },
        header.id
      );
    }) }, group.id)
  ) });
}, "DataTableHead");

// src/components/molecules/DataTable/DataTable.tsx
import { jsx as jsx15, jsxs as jsxs6 } from "react/jsx-runtime";
var createSelectionColumn = /* @__PURE__ */ __name((labels) => ({
  id: "select",
  size: 40,
  maxSize: 40,
  header: /* @__PURE__ */ __name(({ table }) => /* @__PURE__ */ jsx15(
    IndeterminateCheckbox,
    {
      checked: table.getIsAllRowsSelected(),
      indeterminate: table.getIsSomeRowsSelected(),
      onChange: table.getToggleAllRowsSelectedHandler(),
      "aria-label": labels.selectAll
    }
  ), "header"),
  cell: /* @__PURE__ */ __name(({ row }) => /* @__PURE__ */ jsx15(
    IndeterminateCheckbox,
    {
      checked: row.getIsSelected(),
      onChange: row.getToggleSelectedHandler(),
      disabled: !row.getCanSelect(),
      "aria-label": labels.selectRow
    }
  ), "cell"),
  enableSorting: false
}), "createSelectionColumn");
var DataTable = /* @__PURE__ */ __name(({
  data,
  columns,
  selectable = false,
  sortable = false,
  pagination = false,
  pageSize = 10,
  getRowClassName,
  getRowStyle,
  onSelectionChange,
  scroll,
  className,
  style,
  theme: themeOverride
}) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.table, ...themeOverride } : globalTheme.table;
  const t = theme ?? {};
  const selectAllLabel = useMessage("table", "selectAll");
  const selectRowLabel = useMessage("table", "selectRow");
  const finalColumns = selectable ? [createSelectionColumn({ selectAll: selectAllLabel, selectRow: selectRowLabel }), ...columns] : columns;
  const { table, getRowClassName: rowClassNameFn, getRowStyle: rowStyleFn, pagination: paginationState } = useDataTable(
    data,
    finalColumns,
    {
      selectable,
      sortable,
      pagination,
      pageSize,
      getRowClassName,
      getRowStyle,
      onSelectionChange
    }
  );
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = paginationState ? paginationState.pageIndex * pageSize + 1 : 0;
  const to = paginationState ? Math.min((paginationState.pageIndex + 1) * pageSize, totalRows) : 0;
  const pageInfoText = useMessage("table", "pageInfo", {
    from: String(from),
    to: String(to),
    total: String(totalRows)
  });
  const firstLabel = useMessage("table", "first");
  const prevLabel = useMessage("table", "prev");
  const nextLabel = useMessage("table", "next");
  const lastLabel = useMessage("table", "last");
  const tableEl = /* @__PURE__ */ jsxs6(TableRoot, { table, className, style, theme: themeOverride, children: [
    /* @__PURE__ */ jsx15(DataTableHead, { sortable }),
    /* @__PURE__ */ jsx15(
      TableBody,
      {
        renderRow: (row) => /* @__PURE__ */ jsx15(
          "tr",
          {
            className: cn(
              t.row,
              rowClassNameFn?.(row),
              row.getIsSelected() && "data-[state=selected]"
            ),
            style: rowStyleFn?.(row),
            "data-state": row.getIsSelected() ? "selected" : void 0,
            children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx15(
              "td",
              {
                style: {
                  width: cell.column.getSize() !== 150 ? cell.column.getSize() : void 0
                },
                className: cn(
                  t.cell,
                  cell.column.columnDef.meta?.className
                ),
                children: flexRender(cell.column.columnDef.cell, cell.getContext())
              },
              cell.id
            ))
          },
          row.id
        )
      }
    )
  ] });
  const content = scroll?.maxHeight ? /* @__PURE__ */ jsx15(
    "div",
    {
      className: "overflow-auto",
      style: { maxHeight: scroll.maxHeight },
      children: tableEl
    }
  ) : tableEl;
  if (!paginationState) {
    return content;
  }
  const p = paginationState;
  return /* @__PURE__ */ jsxs6("div", { className: "flex flex-col gap-2", children: [
    content,
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between gap-2 px-1 text-sm text-gray-600", children: [
      /* @__PURE__ */ jsx15("span", { children: pageInfoText }),
      /* @__PURE__ */ jsxs6("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx15(
          "button",
          {
            type: "button",
            onClick: p.firstPage,
            disabled: !p.canPrevPage,
            className: "rounded px-2 py-1 disabled:opacity-50 hover:bg-gray-100",
            children: firstLabel
          }
        ),
        /* @__PURE__ */ jsx15(
          "button",
          {
            type: "button",
            onClick: p.prevPage,
            disabled: !p.canPrevPage,
            className: "rounded px-2 py-1 disabled:opacity-50 hover:bg-gray-100",
            children: prevLabel
          }
        ),
        /* @__PURE__ */ jsxs6("span", { className: "flex items-center px-2", children: [
          p.pageIndex + 1,
          " / ",
          p.pageCount
        ] }),
        /* @__PURE__ */ jsx15(
          "button",
          {
            type: "button",
            onClick: p.nextPage,
            disabled: !p.canNextPage,
            className: "rounded px-2 py-1 disabled:opacity-50 hover:bg-gray-100",
            children: nextLabel
          }
        ),
        /* @__PURE__ */ jsx15(
          "button",
          {
            type: "button",
            onClick: p.lastPage,
            disabled: !p.canNextPage,
            className: "rounded px-2 py-1 disabled:opacity-50 hover:bg-gray-100",
            children: lastLabel
          }
        )
      ] })
    ] })
  ] });
}, "DataTable");

// src/components/molecules/EditableTable/EditableTable.tsx
import { flexRender as flexRender2, getCoreRowModel as getCoreRowModel2, useReactTable as useReactTable2 } from "@tanstack/react-table";
import { useMemo as useMemo4 } from "react";
import { FormProvider, useForm } from "react-hook-form";

// src/components/molecules/EditableTable/EditableCell.tsx
import { Controller, useFormContext } from "react-hook-form";
import { jsx as jsx16 } from "react/jsx-runtime";
var EditableCell = /* @__PURE__ */ __name(({
  cell,
  editType,
  editOptions = [],
  theme
}) => {
  const globalTheme = useTheme();
  const { control } = useFormContext();
  const inputTheme = globalTheme?.input ?? {};
  const selectClassName = cn("w-full", inputTheme.base);
  const rowIndex = cell.row.index;
  const columnId = cell.column.id;
  const fieldName = `rows.${rowIndex}.${columnId}`;
  const meta = cell.column.columnDef.meta ?? {};
  const cellClassName = cn(theme.cell, meta.className);
  if (editType === "checkbox") {
    return /* @__PURE__ */ jsx16("td", { style: { width: cell.column.getSize() !== 150 ? cell.column.getSize() : void 0 }, className: cellClassName, children: /* @__PURE__ */ jsx16(
      Controller,
      {
        name: fieldName,
        control,
        render: ({ field }) => /* @__PURE__ */ jsx16(
          Checkbox,
          {
            checked: Boolean(field.value),
            onChange: field.onChange,
            onBlur: field.onBlur,
            ref: field.ref,
            className: "m-0"
          }
        )
      }
    ) });
  }
  if (editType === "dropdown") {
    return /* @__PURE__ */ jsx16("td", { style: { width: cell.column.getSize() !== 150 ? cell.column.getSize() : void 0 }, className: cellClassName, children: /* @__PURE__ */ jsx16(
      Controller,
      {
        name: fieldName,
        control,
        render: ({ field }) => /* @__PURE__ */ jsx16(
          "select",
          {
            ref: field.ref,
            value: String(field.value ?? ""),
            onChange: (e) => field.onChange(e.target.value),
            onBlur: field.onBlur,
            className: selectClassName,
            children: editOptions.map((opt) => /* @__PURE__ */ jsx16("option", { value: opt.value, children: opt.label }, opt.value))
          }
        )
      }
    ) });
  }
  const inputType = editType === "number" ? "number" : editType === "date" ? "date" : "text";
  return /* @__PURE__ */ jsx16("td", { style: { width: cell.column.getSize() !== 150 ? cell.column.getSize() : void 0 }, className: cellClassName, children: /* @__PURE__ */ jsx16(
    Controller,
    {
      name: fieldName,
      control,
      render: ({ field }) => /* @__PURE__ */ jsx16(
        Input,
        {
          type: inputType,
          ...field,
          value: field.value != null ? String(field.value) : "",
          onChange: (e) => {
            const v = e.target.value;
            if (editType === "number") {
              const num = e.target.value === "" ? void 0 : Number(e.target.value);
              field.onChange(Number.isNaN(num) ? v : num);
            } else {
              field.onChange(v);
            }
          },
          className: "min-w-0"
        }
      )
    }
  ) });
}, "EditableCell");

// src/components/molecules/EditableTable/EditableTable.tsx
import { jsx as jsx17, jsxs as jsxs7 } from "react/jsx-runtime";
var createEditableColumns = /* @__PURE__ */ __name((columns, theme) => columns.map((col) => {
  const meta = col.meta ?? {};
  const editType = meta.editType;
  if (!editType) {
    return col;
  }
  return {
    ...col,
    cell: /* @__PURE__ */ __name((ctx) => /* @__PURE__ */ jsx17(EditableCell, { cell: ctx, editType, editOptions: meta.editOptions, theme }), "cell")
  };
}), "createEditableColumns");
var EditableTable = /* @__PURE__ */ __name(({
  data,
  columns,
  onSubmit,
  submitLabel,
  className,
  style,
  theme: themeOverride
}) => {
  const globalTheme = useTheme();
  const theme = themeOverride ? { ...globalTheme.table, ...themeOverride } : globalTheme.table;
  const t = theme ?? {};
  const methods = useForm({
    defaultValues: { rows: data },
    values: { rows: data }
  });
  const formRows = methods.watch("rows");
  const editableColumns = useMemo4(() => createEditableColumns(columns, t), [columns, t]);
  const table = useReactTable2({
    data: formRows ?? data,
    columns: editableColumns,
    getCoreRowModel: getCoreRowModel2()
  });
  return /* @__PURE__ */ jsx17(FormProvider, { ...methods, children: /* @__PURE__ */ jsxs7(
    "form",
    {
      onSubmit: onSubmit ? methods.handleSubmit(onSubmit) : void 0,
      className: cn("flex flex-col gap-2", className),
      style,
      children: [
        /* @__PURE__ */ jsxs7(TableRoot, { table, theme: themeOverride, children: [
          /* @__PURE__ */ jsx17(TableHead, {}),
          /* @__PURE__ */ jsx17(
            TableBody,
            {
              renderRow: (row) => /* @__PURE__ */ jsx17(
                "tr",
                {
                  className: t.row,
                  "data-state": row.getIsSelected() ? "selected" : void 0,
                  children: row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta ?? {};
                    if (meta.editType) {
                      return flexRender2(cell.column.columnDef.cell, cell.getContext());
                    }
                    return /* @__PURE__ */ jsx17(
                      "td",
                      {
                        style: {
                          width: cell.column.getSize() !== 150 ? cell.column.getSize() : void 0
                        },
                        className: cn(t.cell, meta.className),
                        children: flexRender2(cell.column.columnDef.cell, cell.getContext())
                      },
                      cell.id
                    );
                  })
                },
                row.id
              )
            }
          )
        ] }),
        submitLabel && onSubmit && /* @__PURE__ */ jsx17(
          "button",
          {
            type: "submit",
            className: cn(
              "self-end",
              globalTheme?.button?.base,
              globalTheme?.button?.primary
            ),
            children: submitLabel
          }
        )
      ]
    }
  ) });
}, "EditableTable");

// src/components/molecules/ExcelGrid/ExcelGridContext.tsx
import { createContext as createContext4, useContext as useContext4, useRef as useRef2, useEffect as useEffect2, useCallback as useCallback2, useMemo as useMemo5 } from "react";
import { useSyncExternalStore } from "react";

// src/components/molecules/ExcelGrid/state/gridStore.ts
var CHECKBOX_COLUMN = {
  field: "__checkbox__",
  header: "",
  width: 40
};
var DRAG_HANDLE_COLUMN = {
  field: "__drag__",
  header: "",
  width: 28
};
var createGridStore = /* @__PURE__ */ __name(() => {
  let state = {
    rows: [],
    columns: [],
    focusedCell: null,
    selectedRange: null,
    editingCell: null,
    selectedRowIndices: [],
    sortBy: null,
    searchText: "",
    columnFilters: {},
    columnOrder: []
  };
  const listeners = /* @__PURE__ */ new Set();
  const emit = /* @__PURE__ */ __name(() => {
    listeners.forEach((l) => l());
  }, "emit");
  return {
    getState: /* @__PURE__ */ __name(() => state, "getState"),
    setState: /* @__PURE__ */ __name((partial) => {
      state = { ...state, ...partial };
      emit();
    }, "setState"),
    subscribe: /* @__PURE__ */ __name((listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, "subscribe"),
    initStore: /* @__PURE__ */ __name((rows, columns, options = {}) => {
      const withCheckbox = options.checkboxSelection === true ? [CHECKBOX_COLUMN, ...columns] : columns;
      const displayColumns = options.rowDraggable === true ? [DRAG_HANDLE_COLUMN, ...withCheckbox] : withCheckbox;
      const dataLen = options.checkboxSelection ? columns.length : columns.length;
      const columnOrder = Array.from({ length: dataLen }, (_, i) => i);
      state = {
        rows: [...rows],
        columns: displayColumns,
        focusedCell: null,
        selectedRange: null,
        editingCell: null,
        selectedRowIndices: [],
        sortBy: null,
        searchText: "",
        columnFilters: {},
        columnOrder
      };
      emit();
    }, "initStore"),
    getColumnOrder: /* @__PURE__ */ __name(() => state.columnOrder, "getColumnOrder"),
    setColumnOrder: /* @__PURE__ */ __name((order) => {
      state = { ...state, columnOrder: order };
      emit();
    }, "setColumnOrder"),
    setColumnFilter: /* @__PURE__ */ __name((colIndex, value) => {
      const next = { ...state.columnFilters, [colIndex]: value };
      if (!value.trim()) delete next[colIndex];
      state = { ...state, columnFilters: next };
      emit();
    }, "setColumnFilter"),
    setSortBy: /* @__PURE__ */ __name((col, dir) => {
      state = { ...state, sortBy: { col, dir } };
      emit();
    }, "setSortBy"),
    clearSort: /* @__PURE__ */ __name(() => {
      state = { ...state, sortBy: null };
      emit();
    }, "clearSort"),
    setSearchText: /* @__PURE__ */ __name((text) => {
      state = { ...state, searchText: text };
      emit();
    }, "setSearchText"),
    setRows: /* @__PURE__ */ __name((rows) => {
      state = { ...state, rows: [...rows] };
      emit();
    }, "setRows"),
    toggleRowSelection: /* @__PURE__ */ __name((rowIndex) => {
      const set = new Set(state.selectedRowIndices);
      if (set.has(rowIndex)) set.delete(rowIndex);
      else set.add(rowIndex);
      state = { ...state, selectedRowIndices: Array.from(set) };
      emit();
    }, "toggleRowSelection"),
    toggleAllRowsSelection: /* @__PURE__ */ __name((displayedRowCount) => {
      const current = state.selectedRowIndices.length;
      const allSelected = current === displayedRowCount && displayedRowCount > 0;
      state = {
        ...state,
        selectedRowIndices: allSelected ? [] : Array.from({ length: displayedRowCount }, (_, i) => i)
      };
      emit();
    }, "toggleAllRowsSelection"),
    setSelectedRowIndices: /* @__PURE__ */ __name((indices) => {
      state = { ...state, selectedRowIndices: [...indices] };
      emit();
    }, "setSelectedRowIndices")
  };
}, "createGridStore");

// src/components/molecules/ExcelGrid/ExcelGridContext.tsx
import { jsx as jsx18 } from "react/jsx-runtime";
var ExcelGridContext = createContext4(null);
var useExcelGridState = /* @__PURE__ */ __name(() => {
  const ctx = useContext4(ExcelGridContext);
  if (!ctx) throw new Error("ExcelGrid subcomponents must be used within ExcelGrid.");
  return ctx.state;
}, "useExcelGridState");
var useExcelGridRef = /* @__PURE__ */ __name(() => {
  const ctx = useContext4(ExcelGridContext);
  if (!ctx) throw new Error("ExcelGrid subcomponents must be used within ExcelGrid.");
  return ctx.gridRef;
}, "useExcelGridRef");
var useExcelGridOptions = /* @__PURE__ */ __name(() => {
  const ctx = useContext4(ExcelGridContext);
  if (!ctx) throw new Error("ExcelGrid subcomponents must be used within ExcelGrid.");
  return ctx;
}, "useExcelGridOptions");
var useExcelGridOriginalRowIndexRef = /* @__PURE__ */ __name(() => {
  const ctx = useContext4(ExcelGridContext);
  if (!ctx) throw new Error("ExcelGrid subcomponents must be used within ExcelGrid.");
  return ctx.getOriginalRowIndexRef;
}, "useExcelGridOriginalRowIndexRef");
var ExcelGridProvider = /* @__PURE__ */ __name(({
  rows,
  columns,
  editable = false,
  checkboxSelection = false,
  onSelectionChange,
  sortable = false,
  searchPlaceholder,
  columnFilter = false,
  columnReorder = false,
  pagination,
  virtualScroll,
  pinnedRowCount = 0,
  multiSelect = false,
  rowDraggable = false,
  onDropRows,
  onRowOrderChange,
  onAddRow,
  isRowLoading,
  getCellClassName,
  exportFileName,
  exportImportDelimiter = ",",
  onImport,
  onChange,
  onCellChange,
  children
}) => {
  const gridRef = useRef2(null);
  const getOriginalRowIndexRef = useRef2(null);
  const storeRef = useRef2(null);
  if (!storeRef.current) storeRef.current = createGridStore();
  const store = storeRef.current;
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  const initOptions = useMemo5(
    () => ({ checkboxSelection, rowDraggable }),
    [checkboxSelection, rowDraggable]
  );
  const hasInitedRef = useRef2(false);
  const prevColumnsRef = useRef2(columns);
  const prevOptionsRef = useRef2(initOptions);
  useEffect2(() => {
    const columnsChanged = prevColumnsRef.current !== columns || prevColumnsRef.current?.length !== columns?.length;
    const optionsChanged = prevOptionsRef.current.checkboxSelection !== initOptions.checkboxSelection || prevOptionsRef.current.rowDraggable !== initOptions.rowDraggable;
    if (!hasInitedRef.current || columnsChanged || optionsChanged) {
      store.initStore(rows, columns, initOptions);
      hasInitedRef.current = true;
      prevColumnsRef.current = columns;
      prevOptionsRef.current = initOptions;
    } else {
      store.setRows(rows);
    }
  }, [rows, columns, initOptions, store]);
  const getEditingValue = useCallback2(() => {
    const root = gridRef.current;
    const s = store.getState();
    const ec = s.editingCell;
    if (!root || !ec) return void 0;
    const sel = `[data-row="${ec.row}"][data-col="${ec.col}"]`;
    const input = root.querySelector(`input${sel}`);
    if (input) return input.value;
    const selectEl = root.querySelector(`select${sel}`);
    return selectEl?.value;
  }, [store]);
  const getOriginalRowIndex = useCallback2((i) => getOriginalRowIndexRef.current?.(i) ?? i, []);
  useEffect2(() => {
    onSelectionChange?.(state.selectedRowIndices);
  }, [state.selectedRowIndices, onSelectionChange]);
  const value = useMemo5(
    () => ({
      state,
      store,
      gridRef,
      getOriginalRowIndexRef,
      getEditingValue,
      editable: !!editable,
      onChange,
      onCellChange,
      sortable,
      searchPlaceholder,
      columnFilter,
      columnReorder,
      pagination,
      virtualScroll,
      pinnedRowCount,
      multiSelect,
      rowDraggable,
      onDropRows,
      onRowOrderChange,
      onAddRow,
      isRowLoading,
      getCellClassName,
      exportFileName,
      exportImportDelimiter,
      onImport
    }),
    [
      state,
      store,
      getEditingValue,
      editable,
      onChange,
      onCellChange,
      sortable,
      searchPlaceholder,
      columnFilter,
      columnReorder,
      pagination,
      virtualScroll,
      pinnedRowCount,
      multiSelect,
      rowDraggable,
      onDropRows,
      onRowOrderChange,
      onAddRow,
      isRowLoading,
      getCellClassName,
      exportFileName,
      exportImportDelimiter,
      onImport
    ]
  );
  return /* @__PURE__ */ jsx18(ExcelGridContext.Provider, { value, children });
}, "ExcelGridProvider");

// src/components/molecules/ExcelGrid/ExcelGridInner.tsx
import { useEffect as useEffect3, useMemo as useMemo6, useCallback as useCallback3, useState as useState3, useRef as useRef3 } from "react";

// src/components/molecules/ExcelGrid/core/GridRoot.tsx
import { jsx as jsx19 } from "react/jsx-runtime";
var GridRoot = /* @__PURE__ */ __name(({ children, className, style }) => /* @__PURE__ */ jsx19("div", { className: cn("w-full overflow-auto", className), style, children }), "GridRoot");

// src/components/molecules/ExcelGrid/core/GridViewport.tsx
import { forwardRef as forwardRef4 } from "react";
import { jsx as jsx20 } from "react/jsx-runtime";
var GridViewport = forwardRef4(
  ({
    children,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDoubleClick,
    className,
    style
  }, ref) => /* @__PURE__ */ jsx20(
    "div",
    {
      ref,
      className,
      style,
      role: "grid",
      tabIndex: 0,
      draggable: false,
      onDragStart: (e) => {
        if (e.target?.closest?.("tr[data-row-index]")) return;
        e.preventDefault();
      },
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onDoubleClick,
      children
    }
  )
);
GridViewport.displayName = "GridViewport";

// src/components/molecules/ExcelGrid/core/GridBody.tsx
import { Fragment as Fragment4 } from "react";

// src/components/molecules/ExcelGrid/core/GridCell.tsx
import { jsx as jsx21, jsxs as jsxs8 } from "react/jsx-runtime";
var GridCell = /* @__PURE__ */ __name(({
  value,
  focused,
  selected,
  editing,
  rowIndex,
  colIndex,
  width,
  editor = "text",
  dropdownOptions = [],
  pinnedStyle,
  className,
  onEditingBlur,
  onEditingChange
}) => {
  const displayValue = value == null ? "" : String(value);
  const dataAttrs = { "data-row": rowIndex, "data-col": colIndex };
  const editorInputClass = "w-full min-w-0 text-sm outline-none rounded border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 dark:placeholder-gray-400";
  const editorSelectClass = "w-full min-w-0 text-sm outline-none rounded border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 appearance-none cursor-pointer";
  const blurHandler = onEditingBlur ? { onBlur: onEditingBlur } : {};
  const changeHandler = onEditingChange ? { onChange: /* @__PURE__ */ __name((e) => onEditingChange(e.target.value), "onChange") } : {};
  const renderEditor = /* @__PURE__ */ __name(() => {
    if (editor === "datetime") {
      const iso = displayValue ? new Date(displayValue).toISOString().slice(0, 16) : "";
      return /* @__PURE__ */ jsx21(
        "input",
        {
          type: "datetime-local",
          value: iso,
          className: editorInputClass,
          ...dataAttrs,
          ...blurHandler,
          ...changeHandler,
          "aria-label": `Cell ${rowIndex} ${colIndex}`
        }
      );
    }
    if (editor === "dropdown" && dropdownOptions.length > 0) {
      return /* @__PURE__ */ jsxs8(
        "select",
        {
          value: displayValue,
          className: editorSelectClass,
          ...dataAttrs,
          ...blurHandler,
          ...changeHandler,
          "aria-label": `Cell ${rowIndex} ${colIndex}`,
          children: [
            /* @__PURE__ */ jsx21("option", { value: "", children: "\uC120\uD0DD" }),
            dropdownOptions.map((opt) => /* @__PURE__ */ jsx21("option", { value: opt, children: opt }, opt))
          ]
        }
      );
    }
    return /* @__PURE__ */ jsx21(
      "input",
      {
        type: "text",
        value: displayValue,
        className: editorInputClass,
        ...dataAttrs,
        ...blurHandler,
        ...changeHandler,
        "aria-label": `Cell ${rowIndex} ${colIndex}`
      }
    );
  }, "renderEditor");
  return /* @__PURE__ */ jsx21(
    "td",
    {
      role: "gridcell",
      "data-row": rowIndex,
      "data-col": colIndex,
      className: cn(
        "border-b border-r border-gray-200 dark:border-gray-700 px-2 py-1 text-sm outline-none text-gray-900 dark:text-gray-100",
        pinnedStyle && Object.keys(pinnedStyle).length > 0 && "bg-white dark:bg-gray-800",
        editing && "bg-blue-50/80 dark:bg-blue-900/25 dark:ring-blue-500/80 ring-2 ring-blue-400 ring-inset dark:ring-blue-500 z-[1]",
        selected && !editing && "bg-blue-100 ring-1 ring-blue-300 ring-inset dark:bg-blue-900/35 dark:ring-blue-500",
        focused && !editing && "ring-2 ring-blue-500 ring-inset z-[1] dark:ring-blue-400",
        className
      ),
      style: {
        ...width != null ? { width: `${width}px`, minWidth: `${width}px` } : {},
        ...pinnedStyle
      },
      children: editing ? renderEditor() : displayValue
    }
  );
}, "GridCell");

// src/components/molecules/ExcelGrid/model/rangeModel.ts
var isCellInRange = /* @__PURE__ */ __name((row, col, range) => {
  const rMin = Math.min(range.start.row, range.end.row);
  const rMax = Math.max(range.start.row, range.end.row);
  const cMin = Math.min(range.start.col, range.end.col);
  const cMax = Math.max(range.start.col, range.end.col);
  return row >= rMin && row <= rMax && col >= cMin && col <= cMax;
}, "isCellInRange");

// src/components/molecules/ExcelGrid/model/columnModel.ts
var DEFAULT_COL_WIDTH = 100;
var getEffectivePinned = /* @__PURE__ */ __name((col) => {
  const p = col.pinned;
  if (p === true || p === "left") return "left";
  if (p === "right") return "right";
  const init = col.initialPinned;
  if (init === true || init === "left") return "left";
  if (init === "right") return "right";
  return void 0;
}, "getEffectivePinned");
var getPinnedOffset = /* @__PURE__ */ __name((columns, colIndex, side) => {
  const col = columns[colIndex];
  if (!col || getEffectivePinned(col) !== side) return 0;
  const w = /* @__PURE__ */ __name((i) => columns[i]?.width ?? DEFAULT_COL_WIDTH, "w");
  if (side === "left") {
    let sum2 = 0;
    for (let i = 0; i < colIndex; i++) if (getEffectivePinned(columns[i]) === "left") sum2 += w(i);
    return sum2;
  }
  let sum = 0;
  for (let i = colIndex + 1; i < columns.length; i++)
    if (getEffectivePinned(columns[i]) === "right") sum += w(i);
  return sum;
}, "getPinnedOffset");
var getColumnByIndex = /* @__PURE__ */ __name((columns, colIndex) => columns[colIndex], "getColumnByIndex");
var clampColIndex = /* @__PURE__ */ __name((columns, col) => Math.max(0, Math.min(col, columns.length - 1)), "clampColIndex");
var getTableMinWidth = /* @__PURE__ */ __name((columns) => columns.reduce((sum, c) => sum + (c.width ?? DEFAULT_COL_WIDTH), 0), "getTableMinWidth");
var getDisplayColumns = /* @__PURE__ */ __name((columns, columnOrder) => {
  const hasDrag = columns[0]?.field === "__drag__";
  const hasCheckbox = columns[hasDrag ? 1 : 0]?.field === "__checkbox__";
  const dataStart = (hasDrag ? 1 : 0) + (hasCheckbox ? 1 : 0);
  const dataCols = columns.slice(dataStart);
  if (columnOrder.length === 0 || columnOrder.length !== dataCols.length) {
    return columns;
  }
  const reordered = columnOrder.map((i) => dataCols[i]).filter(Boolean);
  const left = reordered.filter((c) => getEffectivePinned(c) === "left");
  const center = reordered.filter((c) => getEffectivePinned(c) !== "left" && getEffectivePinned(c) !== "right");
  const right = reordered.filter((c) => getEffectivePinned(c) === "right");
  const ordered = [...left, ...center, ...right];
  const prefix = [...hasDrag ? [columns[0]] : [], ...hasCheckbox ? [columns[hasDrag ? 1 : 0]] : []];
  return [...prefix, ...ordered];
}, "getDisplayColumns");

// src/components/molecules/ExcelGrid/utils/dragPreview.ts
var MAX_PREVIEW_COLS = 4;
var MAX_PREVIEW_ROWS = 5;
var createDragPreview = /* @__PURE__ */ __name((rows, columns, dt) => {
  const dataCols = columns.filter((c) => c.field !== "__checkbox__" && c.field !== "__drag__").slice(0, MAX_PREVIEW_COLS);
  if (dataCols.length === 0) return;
  const isDark = document.documentElement.classList.contains("dark");
  const bg = isDark ? "#1f2937" : "white";
  const border = isDark ? "#4b5563" : "#e5e7eb";
  const text = isDark ? "#e5e7eb" : "#374151";
  const headerBg = isDark ? "#374151" : "#f3f4f6";
  const rowBorder = isDark ? "#374151" : "#f3f4f6";
  const footerBg = isDark ? "#374151" : "#f9fafb";
  const footerText = isDark ? "#9ca3af" : "#6b7280";
  const el = document.createElement("div");
  el.setAttribute("role", "presentation");
  el.style.cssText = [
    "position:absolute;top:-9999px;left:-9999px;",
    "padding:0;min-width:80px;max-width:320px;max-height:200px;overflow:hidden;",
    `background:${bg};border:1px solid ${border};border-radius:6px;`,
    "box-shadow:0 4px 12px rgba(0,0,0,0.15);",
    `font-size:11px;color:${text};`,
    "pointer-events:none;z-index:9999;"
  ].join("");
  const table = document.createElement("table");
  table.style.cssText = "border-collapse:collapse;width:100%;table-layout:fixed;";
  table.setAttribute("role", "presentation");
  const thead = document.createElement("thead");
  thead.style.background = headerBg;
  const headerRow = document.createElement("tr");
  dataCols.forEach((col) => {
    const th = document.createElement("th");
    th.style.cssText = `padding:4px 6px;text-align:left;border-bottom:1px solid ${border};font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px;color:${text};`;
    th.textContent = col.header ?? col.field;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  const previewRows = rows.slice(0, MAX_PREVIEW_ROWS);
  previewRows.forEach((row) => {
    const tr = document.createElement("tr");
    dataCols.forEach((col) => {
      const td = document.createElement("td");
      td.style.cssText = `padding:4px 6px;border-bottom:1px solid ${rowBorder};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px;color:${text};`;
      const val = row[col.field];
      td.textContent = val != null ? String(val) : "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  el.appendChild(table);
  if (rows.length > MAX_PREVIEW_ROWS) {
    const footer = document.createElement("div");
    footer.style.cssText = `padding:2px 6px;background:${footerBg};font-size:10px;color:${footerText};`;
    footer.textContent = `\uC678 ${rows.length - MAX_PREVIEW_ROWS}\uD589`;
    el.appendChild(footer);
  }
  document.body.appendChild(el);
  dt.setDragImage(el, 24, 16);
  requestAnimationFrame(() => el.remove());
}, "createDragPreview");

// src/components/molecules/ExcelGrid/core/GridRow.tsx
import { jsx as jsx22, jsxs as jsxs9 } from "react/jsx-runtime";
var EXCEL_GRID_ROWS_TYPE = "application/x-excelgrid-rows";
var ROW_REORDER_TYPE = "application/x-excelgrid-row-reorder";
var GridRow = /* @__PURE__ */ __name(({
  rowIndex,
  row,
  columns,
  focusedCell,
  selectedRange,
  editingCell,
  checkboxSelection,
  isRowSelected,
  onToggleRowSelection,
  isPinned,
  pinnedRowIndex = 0,
  rowDraggable,
  rowDragColumnIndex,
  onRowReorderDrop,
  rowHeight,
  onRowClick,
  getRowsForIndices,
  selectedRowIndices = [],
  isRowLoading,
  getCellClassName,
  onEditingBlur,
  onEditingChange,
  className
}) => {
  const handleRowReorderDragStart = /* @__PURE__ */ __name((e) => {
    e.dataTransfer.setData(ROW_REORDER_TYPE, JSON.stringify({ fromDisplayedIndex: rowIndex }));
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
    createDragPreview([row], columns, e.dataTransfer);
  }, "handleRowReorderDragStart");
  const handleDragStart = /* @__PURE__ */ __name((e) => {
    if (!rowDraggable) return;
    let rowsToDrag;
    if (getRowsForIndices && selectedRowIndices.length > 1 && selectedRowIndices.includes(rowIndex)) {
      rowsToDrag = getRowsForIndices(selectedRowIndices);
    } else if (getRowsForIndices && selectedRange && selectedRange.start.row !== selectedRange.end.row) {
      const rMin = Math.min(selectedRange.start.row, selectedRange.end.row);
      const rMax = Math.max(selectedRange.start.row, selectedRange.end.row);
      if (rowIndex >= rMin && rowIndex <= rMax) {
        const indices = Array.from({ length: rMax - rMin + 1 }, (_, i) => rMin + i);
        rowsToDrag = getRowsForIndices(indices);
      } else {
        rowsToDrag = [row];
      }
    } else {
      rowsToDrag = [row];
    }
    if (rowsToDrag.length === 0) rowsToDrag = [row];
    e.dataTransfer.setData(EXCEL_GRID_ROWS_TYPE, JSON.stringify(rowsToDrag));
    e.dataTransfer.effectAllowed = "copy";
    createDragPreview(rowsToDrag, columns, e.dataTransfer);
    const tr = e.currentTarget;
    tr.style.cursor = "grabbing";
  }, "handleDragStart");
  const handleDragEnd = /* @__PURE__ */ __name((e) => {
    e.currentTarget.style.cursor = "grab";
  }, "handleDragEnd");
  const handleRowReorderDragOver = /* @__PURE__ */ __name((e) => {
    if (!e.dataTransfer.types.includes(ROW_REORDER_TYPE) || !onRowReorderDrop) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  }, "handleRowReorderDragOver");
  const handleRowReorderDrop = /* @__PURE__ */ __name((e) => {
    if (!e.dataTransfer.types.includes(ROW_REORDER_TYPE) || !onRowReorderDrop) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      const raw = e.dataTransfer.getData(ROW_REORDER_TYPE);
      const { fromDisplayedIndex } = JSON.parse(raw);
      if (typeof fromDisplayedIndex === "number") onRowReorderDrop(fromDisplayedIndex, rowIndex);
    } catch {
    }
  }, "handleRowReorderDrop");
  const rowStyle = {
    ...rowHeight != null ? { height: rowHeight, minHeight: rowHeight } : {},
    ...rowDraggable ? { cursor: "grab" } : {},
    ...isPinned ? {
      position: "sticky",
      top: pinnedRowIndex * (rowHeight ?? 32),
      zIndex: 5
    } : {}
  };
  if (isRowLoading) {
    return /* @__PURE__ */ jsx22("tr", { className: cn(className, "bg-gray-50 dark:bg-gray-800/80"), "aria-busy": true, children: /* @__PURE__ */ jsx22("td", { colSpan: columns.length, className: "border-b border-gray-200 dark:border-gray-700 px-2 py-2 text-center", children: /* @__PURE__ */ jsxs9("span", { className: "inline-flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-xs", children: [
      /* @__PURE__ */ jsx22("span", { className: "animate-pulse w-4 h-4 rounded bg-gray-200", "aria-hidden": true }),
      "\uB85C\uB529 \uC911..."
    ] }) }) });
  }
  return /* @__PURE__ */ jsx22(
    "tr",
    {
      className: cn(
        className,
        isRowSelected && "bg-blue-50 dark:bg-blue-900/25",
        isPinned && "bg-white dark:bg-gray-800 shadow-[0_1px_0_0_rgba(229,231,235,1)] dark:shadow-[0_1px_0_0_rgba(55,65,81,1)]"
      ),
      draggable: rowDraggable,
      onDragStart: rowDraggable ? handleDragStart : void 0,
      onDragEnd: rowDraggable ? handleDragEnd : void 0,
      onDragOver: onRowReorderDrop ? handleRowReorderDragOver : void 0,
      onDrop: onRowReorderDrop ? handleRowReorderDrop : void 0,
      style: Object.keys(rowStyle).length > 0 ? rowStyle : void 0,
      title: rowDraggable ? "\uD589\uC744 \uC7A1\uC544 \uB2E4\uB978 \uADF8\uB9AC\uB4DC\uB85C \uB4DC\uB798\uADF8\uD558\uC138\uC694" : void 0,
      "aria-label": rowDraggable ? `\uD589 ${rowIndex + 1} \uB4DC\uB798\uADF8 \uAC00\uB2A5` : void 0,
      "data-row-index": rowIndex,
      onClick: (e) => {
        if (e.target.closest('input[type="checkbox"]')) return;
        if (onRowClick) {
          onRowClick(e);
          return;
        }
        if (checkboxSelection && onToggleRowSelection) onToggleRowSelection();
      },
      children: columns.map((col, colIndex) => {
        const pinned = getEffectivePinned(col);
        const leftPx = pinned === "left" ? getPinnedOffset(columns, colIndex, "left") : void 0;
        const rightPx = pinned === "right" ? getPinnedOffset(columns, colIndex, "right") : void 0;
        const pinnedStyle = leftPx !== void 0 ? { position: "sticky", left: leftPx, zIndex: 4, boxShadow: "2px 0 2px -2px rgba(0,0,0,0.08)" } : rightPx !== void 0 ? { position: "sticky", right: rightPx, zIndex: 4, boxShadow: "-2px 0 2px -2px rgba(0,0,0,0.08)" } : {};
        const pinnedCellClass = leftPx !== void 0 || rightPx !== void 0 ? "bg-white dark:bg-gray-800" : "";
        if (col.field === "__drag__") {
          return /* @__PURE__ */ jsx22(
            "td",
            {
              className: cn("border-b border-r border-gray-200 dark:border-gray-700 px-1 py-1 text-center align-middle", pinnedCellClass),
              style: { ...col.width != null ? { width: col.width, minWidth: col.width } : {}, ...pinnedStyle },
              onClick: (e) => e.stopPropagation(),
              "aria-hidden": true,
              children: /* @__PURE__ */ jsx22("span", { className: "inline-flex cursor-grab text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 select-none", title: "\uD589 \uC7A1\uC544 \uB4DC\uB798\uADF8", children: "\u22EE\u22EE" })
            },
            col.field
          );
        }
        if (col.field === "__checkbox__" && checkboxSelection) {
          return /* @__PURE__ */ jsx22(
            "td",
            {
              className: cn("border-b border-r border-gray-200 dark:border-gray-700 px-2 py-1 text-sm w-10", pinnedCellClass),
              style: { ...col.width != null ? { width: col.width, minWidth: col.width } : {}, ...pinnedStyle },
              onClick: (e) => e.stopPropagation(),
              children: /* @__PURE__ */ jsx22(
                Checkbox,
                {
                  checked: !!isRowSelected,
                  onChange: () => onToggleRowSelection?.(),
                  "aria-label": `\uD589 ${rowIndex + 1} \uC120\uD0DD`
                }
              )
            },
            col.field
          );
        }
        const isRowDragHandleCell = rowDragColumnIndex !== void 0 && colIndex === rowDragColumnIndex;
        if (isRowDragHandleCell) {
          return /* @__PURE__ */ jsx22(
            "td",
            {
              className: cn("border-b border-r border-gray-200 dark:border-gray-700 px-1 py-1 text-center align-middle", pinnedCellClass),
              style: { ...col.width != null ? { width: col.width, minWidth: col.width } : {}, ...pinnedStyle },
              onClick: (e) => e.stopPropagation(),
              "aria-hidden": true,
              children: /* @__PURE__ */ jsx22(
                "span",
                {
                  className: "inline-flex cursor-grab text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 select-none",
                  title: "\uD589 \uC21C\uC11C \uBCC0\uACBD",
                  draggable: true,
                  onDragStart: handleRowReorderDragStart,
                  children: "\u22EE\u22EE"
                }
              )
            },
            col.field
          );
        }
        const value = row[col.field];
        const focused = focusedCell !== null && focusedCell.row === rowIndex && focusedCell.col === colIndex;
        const selected = selectedRange !== null && isCellInRange(rowIndex, colIndex, selectedRange);
        const editing = editingCell !== null && editingCell.row === rowIndex && editingCell.col === colIndex;
        return /* @__PURE__ */ jsx22(
          GridCell,
          {
            value,
            focused,
            selected,
            editing,
            rowIndex,
            colIndex,
            width: col.width,
            editor: col.editor,
            dropdownOptions: col.dropdownOptions,
            pinnedStyle,
            className: getCellClassName?.(rowIndex, colIndex),
            onEditingBlur,
            onEditingChange
          },
          col.field
        );
      })
    }
  );
}, "GridRow");

// src/components/molecules/ExcelGrid/core/GridBody.tsx
import { jsx as jsx23, jsxs as jsxs10 } from "react/jsx-runtime";
var GridBody = /* @__PURE__ */ __name(({
  rows,
  columns,
  focusedCell,
  selectedRange,
  editingCell,
  checkboxSelection,
  selectedRowIndices = [],
  onToggleRowSelection,
  pinnedRowCount = 0,
  startRowIndex = 0,
  virtualScroll,
  rowDraggable,
  rowDragColumnIndex,
  onRowReorderDrop,
  onDropRows,
  onDragOverRows,
  onDragLeaveGrid,
  dropInsertBeforeIndex,
  totalRowCount = 0,
  multiSelect,
  onRowClick,
  getRowsForIndices,
  isRowLoading,
  getCellClassName,
  onEditingBlur,
  onEditingChange,
  className
}) => {
  const colCount = columns.length;
  const topHeight = virtualScroll ? virtualScroll.startIndex * virtualScroll.rowHeight : 0;
  const bottomHeight = virtualScroll ? (virtualScroll.totalRows - virtualScroll.endIndex) * virtualScroll.rowHeight : 0;
  const spacerCell = /* @__PURE__ */ __name((key, height) => /* @__PURE__ */ jsx23("tr", { "aria-hidden": true, style: { height, lineHeight: 0, fontSize: 0 }, children: /* @__PURE__ */ jsx23("td", { colSpan: colCount, style: { height, padding: 0, border: "none", verticalAlign: "top" } }) }, key), "spacerCell");
  const dropIndicatorLine = /* @__PURE__ */ __name((key) => /* @__PURE__ */ jsx23("tr", { "aria-hidden": true, className: "bg-blue-100 dark:bg-blue-900/30", style: { height: 0 }, children: /* @__PURE__ */ jsx23("td", { colSpan: colCount, style: { padding: 0, border: "none", verticalAlign: "top", lineHeight: 0 }, children: /* @__PURE__ */ jsx23("div", { className: "bg-blue-500 dark:bg-blue-400", style: { height: 2, margin: 0 } }) }) }, key), "dropIndicatorLine");
  return /* @__PURE__ */ jsxs10(
    "tbody",
    {
      className: cn(className, onDropRows && "relative"),
      onDragOver: onDragOverRows,
      onDragLeave: onDragLeaveGrid,
      onDrop: onDropRows,
      children: [
        topHeight > 0 && spacerCell("top-spacer", topHeight),
        rows.map((row, i) => {
          const rowIndex = startRowIndex + i;
          const showDropIndicatorBefore = dropInsertBeforeIndex === rowIndex;
          return /* @__PURE__ */ jsxs10(Fragment4, { children: [
            showDropIndicatorBefore && dropIndicatorLine(`drop-before-${rowIndex}`),
            /* @__PURE__ */ jsx23(
              GridRow,
              {
                rowIndex,
                row,
                columns,
                focusedCell,
                selectedRange,
                editingCell,
                checkboxSelection,
                isRowSelected: selectedRowIndices.includes(rowIndex),
                onToggleRowSelection: onToggleRowSelection ? () => onToggleRowSelection(rowIndex) : void 0,
                isPinned: i < pinnedRowCount,
                pinnedRowIndex: i,
                rowDraggable,
                rowDragColumnIndex,
                onRowReorderDrop,
                rowHeight: virtualScroll?.rowHeight,
                onRowClick: onRowClick ? (e) => onRowClick(rowIndex, e) : void 0,
                getRowsForIndices,
                selectedRowIndices,
                isRowLoading: isRowLoading?.(rowIndex),
                getCellClassName,
                onEditingBlur,
                onEditingChange
              },
              rowIndex
            )
          ] }, rowIndex);
        }),
        dropInsertBeforeIndex === totalRowCount && dropIndicatorLine("drop-after-last"),
        bottomHeight > 0 && spacerCell("bottom-spacer", bottomHeight)
      ]
    }
  );
}, "GridBody");

// src/components/molecules/ExcelGrid/model/rowModel.ts
var getCellValue = /* @__PURE__ */ __name((row, field) => row[field], "getCellValue");
var setCellValue = /* @__PURE__ */ __name((rows, rowIndex, field, value) => {
  const next = rows.map(
    (r, i) => i === rowIndex ? { ...r, [field]: value } : r
  );
  return next;
}, "setCellValue");
var clampRowIndex = /* @__PURE__ */ __name((rows, row) => Math.max(0, Math.min(row, rows.length - 1)), "clampRowIndex");

// src/components/molecules/ExcelGrid/model/sortFilterModel.ts
var rowMatchesSearch = /* @__PURE__ */ __name((row, columns, searchText) => {
  if (!searchText.trim()) return true;
  const lower = searchText.trim().toLowerCase();
  return columns.some((col) => {
    if (col.field === "__checkbox__") return false;
    const v = getCellValue(row, col.field);
    return String(v ?? "").toLowerCase().includes(lower);
  });
}, "rowMatchesSearch");
var compare = /* @__PURE__ */ __name((a, b) => {
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return String(a ?? "").localeCompare(String(b ?? ""), void 0, { numeric: true });
}, "compare");
var matchesFilter = /* @__PURE__ */ __name((value, filterValue, col) => {
  const trimmed = filterValue.trim();
  if (!trimmed) return true;
  if (col.filterType === "custom" && col.filterFn) {
    return col.filterFn(value, trimmed);
  }
  if (col.filterType === "number") {
    const n = Number(value);
    const nFilter = Number(trimmed);
    if (!Number.isNaN(n) && !Number.isNaN(nFilter)) return n === nFilter;
    return String(value ?? "").toLowerCase().includes(trimmed.toLowerCase());
  }
  if (col.filterType === "date") {
    const d = value instanceof Date ? value.getTime() : new Date(String(value)).getTime();
    const dFilter = new Date(trimmed).getTime();
    if (!Number.isNaN(d) && !Number.isNaN(dFilter)) return d === dFilter;
    return String(value ?? "").toLowerCase().includes(trimmed.toLowerCase());
  }
  return String(value ?? "").toLowerCase().includes(trimmed.toLowerCase());
}, "matchesFilter");
var rowMatchesColumnFilters = /* @__PURE__ */ __name((row, columns, columnFilters) => {
  const dataCols = columns.filter((c) => c.field !== "__checkbox__" && c.field !== "__drag__");
  return dataCols.every((col, dataIdx) => {
    const filter = columnFilters[dataIdx];
    if (!filter?.trim()) return true;
    const v = getCellValue(row, col.field);
    return matchesFilter(v, filter, col);
  });
}, "rowMatchesColumnFilters");
var getDisplayedRows = /* @__PURE__ */ __name((rows, columns, searchText, sortBy, columnFilters = {}) => {
  const withIndex = rows.map((row, originalIndex) => ({ row, originalIndex })).filter(({ row }) => rowMatchesSearch(row, columns, searchText)).filter(({ row }) => rowMatchesColumnFilters(row, columns, columnFilters));
  if (!sortBy) return withIndex;
  const colDef = getColumnByIndex(columns, sortBy.col);
  if (!colDef || colDef.field === "__checkbox__") return withIndex;
  const sorted = [...withIndex].sort((a, b) => {
    const va = getCellValue(a.row, colDef.field);
    const vb = getCellValue(b.row, colDef.field);
    const c = compare(va, vb);
    return sortBy.dir === "asc" ? c : -c;
  });
  return sorted;
}, "getDisplayedRows");

// src/components/molecules/ExcelGrid/controller/selection.ts
var moveFocus = /* @__PURE__ */ __name((store, row, col) => {
  const rows = store.getState().rows;
  const cols = store.getState().columns;
  if (rows.length === 0 || cols.length === 0) return;
  const r = clampRowIndex(rows, row);
  const c = clampColIndex(cols, col);
  store.setState({
    focusedCell: { row: r, col: c },
    selectedRange: { start: { row: r, col: c }, end: { row: r, col: c } }
  });
}, "moveFocus");
var extendSelection = /* @__PURE__ */ __name((store, endRow, endCol) => {
  const state = store.getState();
  const focus = state.focusedCell;
  const rows = state.rows;
  const cols = state.columns;
  if (!focus || rows.length === 0 || cols.length === 0) return;
  const r = clampRowIndex(rows, endRow);
  const c = clampColIndex(cols, endCol);
  store.setState({
    focusedCell: { row: r, col: c },
    selectedRange: { start: focus, end: { row: r, col: c } }
  });
}, "extendSelection");
var moveFocusBy = /* @__PURE__ */ __name((store, dRow, dCol) => {
  const state = store.getState();
  const focus = state.focusedCell;
  const rows = state.rows;
  const cols = state.columns;
  if (!focus || rows.length === 0 || cols.length === 0) return null;
  const r = clampRowIndex(rows, focus.row + dRow);
  const c = clampColIndex(cols, focus.col + dCol);
  moveFocus(store, r, c);
  return { row: r, col: c };
}, "moveFocusBy");

// src/components/molecules/ExcelGrid/controller/clipboard.ts
var copySelection = /* @__PURE__ */ __name((store, opts = {}) => {
  const state = store.getState();
  const { rows, columns, selectedRange, columnOrder } = state;
  const displayCols = getDisplayColumns(columns, columnOrder);
  if (!selectedRange || rows.length === 0 || displayCols.length === 0) return "";
  if (opts.editable === false) return "";
  const rMin = Math.min(selectedRange.start.row, selectedRange.end.row);
  const rMax = Math.max(selectedRange.start.row, selectedRange.end.row);
  const cMin = Math.min(selectedRange.start.col, selectedRange.end.col);
  const cMax = Math.max(selectedRange.start.col, selectedRange.end.col);
  const lines = [];
  for (let r = rMin; r <= rMax; r++) {
    const row = rows[r];
    if (!row) continue;
    const cells = [];
    for (let c = cMin; c <= cMax; c++) {
      const col = getColumnByIndex(displayCols, c);
      if (col?.field === "__checkbox__") continue;
      if (opts.editable === true && col?.editable === false) continue;
      const val = col ? getCellValue(row, col.field) : void 0;
      cells.push(String(val ?? ""));
    }
    lines.push(cells.join("	"));
  }
  return lines.join("\n");
}, "copySelection");
var pasteAtFocus = /* @__PURE__ */ __name((store, text, opts = {}) => {
  const state = store.getState();
  const { rows, columns, focusedCell, columnOrder } = state;
  const displayCols = getDisplayColumns(columns, columnOrder);
  if (rows.length === 0 || displayCols.length === 0) return;
  if (opts.editable === false) return;
  const focus = focusedCell ?? { row: 0, col: 0 };
  const lines = text.split(/\r?\n/).filter((line) => line.length > 0 || text.includes("\n"));
  if (lines.length === 0) return;
  const parsed = lines.map((line) => line.split("	"));
  let nextRows = [...rows];
  const getOriginal = opts.getOriginalRowIndex ?? ((i) => i);
  for (let dr = 0; dr < parsed.length; dr++) {
    const displayedRowIndex = focus.row + dr;
    const rowIndex = getOriginal(displayedRowIndex);
    if (rowIndex < 0 || rowIndex >= nextRows.length) continue;
    const line = parsed[dr];
    if (!line) continue;
    for (let dc = 0; dc < line.length; dc++) {
      const colIndex = focus.col + dc;
      if (colIndex >= displayCols.length) break;
      const colDef = getColumnByIndex(displayCols, colIndex);
      if (!colDef || colDef.field === "__checkbox__") continue;
      if (colDef.editable === false) continue;
      const value = line[dc];
      const prevValue = getCellValue(nextRows[rowIndex], colDef.field);
      nextRows = setCellValue(nextRows, rowIndex, colDef.field, value);
      opts.onChange?.(rowIndex, colIndex, value);
      if (opts.onCellChange && String(prevValue ?? "") !== String(value ?? "")) {
        opts.onCellChange(rowIndex, colIndex, prevValue, value);
      }
    }
  }
  store.setRows(nextRows);
}, "pasteAtFocus");

// src/components/molecules/ExcelGrid/controller/keyboard.ts
var createKeyDownHandler = /* @__PURE__ */ __name((options) => {
  const { store } = options;
  const commitEditingCell = /* @__PURE__ */ __name(() => {
    const state = store.getState();
    const { editingCell, rows, columns, columnOrder } = state;
    if (!editingCell || !options.getEditingValue) return;
    const displayCols = getDisplayColumns(columns, columnOrder);
    const colDef = getColumnByIndex(displayCols, editingCell.col);
    if (!colDef || colDef.field === "__checkbox__") return;
    const value = options.getEditingValue();
    const originalRow = options.getOriginalRowIndex?.(editingCell.row) ?? editingCell.row;
    const prevValue = getCellValue(rows[originalRow], colDef.field);
    const nextRows = setCellValue(rows, originalRow, colDef.field, value);
    store.setRows(nextRows);
    if (options.onChange) options.onChange(originalRow, editingCell.col, value);
    if (options.onCellChange && String(prevValue ?? "") !== String(value ?? "")) {
      options.onCellChange(originalRow, editingCell.col, prevValue, value);
    }
    store.setState({ editingCell: null });
  }, "commitEditingCell");
  const handleKeyDown = /* @__PURE__ */ __name((event) => {
    const state = store.getState();
    const { focusedCell, editingCell, rows, columns, columnOrder } = state;
    const displayCols = getDisplayColumns(columns, columnOrder);
    if (displayCols.length === 0 || rows.length === 0) return;
    const focus = focusedCell ?? { row: 0, col: 0 };
    if (editingCell) {
      if (event.key === "Enter") {
        event.preventDefault();
        commitEditingCell();
      } else if (event.key === "Escape") {
        event.preventDefault();
        store.setState({ editingCell: null });
      } else if (event.key === "Tab") {
        event.preventDefault();
        commitEditingCell();
        moveFocusBy(store, 0, event.shiftKey ? -1 : 1);
      }
      return;
    }
    if (event.key === "c" && (event.metaKey || event.ctrlKey)) {
      const text = copySelection(store, { editable: options.editable });
      if (text) {
        event.preventDefault();
        void navigator.clipboard.writeText(text);
      }
      return;
    }
    if (event.key === "v" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (editingCell) commitEditingCell();
      if (!options.editable) return;
      navigator.clipboard.readText().then((t) => {
        pasteAtFocus(store, t, {
          onChange: options.onChange,
          onCellChange: options.onCellChange,
          getOriginalRowIndex: options.getOriginalRowIndex,
          editable: options.editable
        });
      });
      return;
    }
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        moveFocusBy(store, -1, 0);
        return;
      case "ArrowDown":
        event.preventDefault();
        moveFocusBy(store, 1, 0);
        return;
      case "ArrowLeft":
        event.preventDefault();
        moveFocusBy(store, 0, -1);
        return;
      case "ArrowRight":
        event.preventDefault();
        moveFocusBy(store, 0, 1);
        return;
      case "Enter":
        event.preventDefault();
        if (options.editable) {
          const colDef = getColumnByIndex(displayCols, focus.col);
          if (colDef?.field !== "__checkbox__" && colDef?.editable !== false) {
            store.setState({ editingCell: focus });
          }
        } else {
          moveFocusBy(store, 1, 0);
        }
        return;
      case "Tab":
        event.preventDefault();
        if (event.shiftKey) moveFocusBy(store, 0, -1);
        else moveFocusBy(store, 0, 1);
        return;
      default:
        break;
    }
  }, "handleKeyDown");
  return { handleKeyDown, commitEditingCell };
}, "createKeyDownHandler");

// src/components/molecules/ExcelGrid/controller/mouse.ts
var CELL_SELECTOR = "[data-row][data-col]";
var getCellFromEvent = /* @__PURE__ */ __name((e) => {
  const el = e.target.closest(CELL_SELECTOR);
  if (!el) return null;
  const row = el.getAttribute("data-row");
  const col = el.getAttribute("data-col");
  if (row == null || col == null) return null;
  return { row: parseInt(row, 10), col: parseInt(col, 10) };
}, "getCellFromEvent");
var isInteractiveTarget = /* @__PURE__ */ __name((e) => !!e.target.closest?.('select, input, button, [role="combobox"]'), "isInteractiveTarget");
var createPointerHandlers = /* @__PURE__ */ __name((store, options) => {
  let isDragSelecting = false;
  const handlePointerDown = /* @__PURE__ */ __name((e) => {
    const cell = getCellFromEvent(e);
    if (!cell) return;
    const state = store.getState();
    const { editingCell } = state;
    const isClickingOtherCell = editingCell && (editingCell.row !== cell.row || editingCell.col !== cell.col);
    if (isClickingOtherCell && options.commitEditingCell) {
      options.commitEditingCell();
    }
    if (isInteractiveTarget(e)) {
      moveFocus(store, cell.row, cell.col);
      return;
    }
    e.preventDefault();
    isDragSelecting = true;
    moveFocus(store, cell.row, cell.col);
  }, "handlePointerDown");
  const handlePointerMove = /* @__PURE__ */ __name((e) => {
    if (!isDragSelecting) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;
    extendSelection(store, cell.row, cell.col);
  }, "handlePointerMove");
  const handlePointerUp = /* @__PURE__ */ __name(() => {
    isDragSelecting = false;
  }, "handlePointerUp");
  const handleDoubleClick = /* @__PURE__ */ __name((e) => {
    const cell = getCellFromEvent(e);
    if (!cell || !options.editable) return;
    const { columns } = store.getState();
    const colDef = getColumnByIndex(columns, cell.col);
    if (colDef?.editable === false) return;
    store.setState({ editingCell: cell });
  }, "handleDoubleClick");
  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick
  };
}, "createPointerHandlers");

// src/components/molecules/ExcelGrid/utils/exportImport.ts
var DEFAULT_DELIMITER = ",";
var DEFAULT_LINE_END = "\n";
var exportTableToText = /* @__PURE__ */ __name((rows, columns, opts = {}) => {
  const delim = opts.delimiter ?? DEFAULT_DELIMITER;
  const lineEnd = opts.lineEnd ?? DEFAULT_LINE_END;
  const includeHeader = opts.includeHeader !== false;
  const dataColumns = columns.filter((c) => c.field !== "__checkbox__");
  const lines = [];
  if (includeHeader) {
    lines.push(dataColumns.map((c) => escapeCell(c.header ?? c.field, delim)).join(delim));
  }
  for (const row of rows) {
    const cells = dataColumns.map((col) => {
      const v = getCellValue(row, col.field);
      return escapeCell(v == null ? "" : String(v), delim);
    });
    lines.push(cells.join(delim));
  }
  return lines.join(lineEnd);
}, "exportTableToText");
var importTableFromText = /* @__PURE__ */ __name((text, columns, opts = {}) => {
  const delim = opts.delimiter ?? DEFAULT_DELIMITER;
  const lineEnd = opts.lineEnd ?? "\n";
  const includeHeader = opts.includeHeader !== false;
  const dataColumns = columns.filter((c) => c.field !== "__checkbox__");
  const lines = text.split(/\r?\n/).filter((line) => line.length > 0);
  let start = 0;
  if (includeHeader && lines.length > 0) start = 1;
  const rows = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    const cells = parseLine(line, delim);
    const row = {};
    dataColumns.forEach((col, ci) => {
      row[col.field] = cells[ci] ?? "";
    });
    rows.push(row);
  }
  return rows;
}, "importTableFromText");
function escapeCell(val, delim) {
  const needsQuote = val.includes(delim) || val.includes('"') || val.includes("\n") || val.includes("\r");
  if (!needsQuote) return val;
  return `"${val.replace(/"/g, '""')}"`;
}
__name(escapeCell, "escapeCell");
function parseLine(line, delim) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (inQuotes) {
      current += c;
    } else if (c === delim) {
      result.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}
__name(parseLine, "parseLine");
var downloadTableAsFile = /* @__PURE__ */ __name((content, filename, mimeType = "text/csv;charset=utf-8") => {
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}, "downloadTableAsFile");

// src/components/molecules/ExcelGrid/ExcelGridInner.tsx
import { Fragment as Fragment5, jsx as jsx24, jsxs as jsxs11 } from "react/jsx-runtime";
var getDataColIndexFromDisplay = /* @__PURE__ */ __name((displayColIndex, displayColumns, dataCols) => {
  const col = displayColumns[displayColIndex];
  if (!col || col.field === "__checkbox__" || col.field === "__drag__") return -1;
  return dataCols.findIndex((c) => c.field === col.field);
}, "getDataColIndexFromDisplay");
var ExcelGridInner = /* @__PURE__ */ __name(({
  className,
  style
}) => {
  const state = useExcelGridState();
  const gridRef = useExcelGridRef();
  const opts = useExcelGridOptions();
  const getOriginalRowIndexRef = useExcelGridOriginalRowIndexRef();
  const { store } = opts;
  const [page, setPage] = useState3(1);
  const [columnDragIndex, setColumnDragIndex] = useState3(null);
  const [dropInsertBeforeIndex, setDropInsertBeforeIndex] = useState3(null);
  const { handleKeyDown, commitEditingCell } = useMemo6(
    () => createKeyDownHandler({
      store,
      editable: opts.editable,
      onChange: opts.onChange,
      onCellChange: opts.onCellChange,
      getEditingValue: opts.getEditingValue,
      getOriginalRowIndex: /* @__PURE__ */ __name((i) => getOriginalRowIndexRef.current?.(i) ?? i, "getOriginalRowIndex")
    }),
    [store, opts.editable, opts.onChange, opts.onCellChange, opts.getEditingValue]
  );
  const pointerHandlers = useMemo6(
    () => createPointerHandlers(store, {
      editable: opts.editable,
      commitEditingCell
    }),
    [store, opts.editable, commitEditingCell]
  );
  const fileInputRef = useRef3(null);
  const scrollContainerRef = useRef3(null);
  const headerScrollRef = useRef3(null);
  const selectionAnchorRef = useRef3(null);
  const [scrollState, setScrollState] = useState3({ scrollTop: 0, containerHeight: 400 });
  const displayColumns = useMemo6(
    () => getDisplayColumns(state.columns, state.columnOrder),
    [state.columns, state.columnOrder]
  );
  const displayedRows = useMemo6(
    () => getDisplayedRows(
      state.rows,
      displayColumns,
      state.searchText,
      state.sortBy,
      state.columnFilters
    ),
    [state.rows, displayColumns, state.searchText, state.sortBy, state.columnFilters]
  );
  const pagination = opts.pagination;
  const pageSize = pagination?.pageSize ?? displayedRows.length;
  const totalPages = Math.max(1, Math.ceil(displayedRows.length / pageSize));
  const currentPage = pagination?.page ?? page;
  const setCurrentPage = pagination?.onPageChange ?? setPage;
  const virtualScrollOpts = opts.virtualScroll;
  const useVirtualScroll = Boolean(virtualScrollOpts);
  const rowHeight = virtualScrollOpts?.rowHeight ?? 32;
  const maxScrollHeight = virtualScrollOpts?.maxHeight ?? 400;
  const paginatedRows = useMemo6(() => {
    if (useVirtualScroll) return displayedRows;
    if (!pagination || displayedRows.length <= pageSize) return displayedRows;
    const start = (currentPage - 1) * pageSize;
    return displayedRows.slice(start, start + pageSize);
  }, [displayedRows, pagination, pageSize, currentPage, useVirtualScroll]);
  const totalVirtualRows = useVirtualScroll ? displayedRows.length : paginatedRows.length;
  const virtualStart = useVirtualScroll ? Math.max(0, Math.floor(scrollState.scrollTop / rowHeight)) : 0;
  const virtualEnd = useVirtualScroll ? Math.min(
    totalVirtualRows,
    virtualStart + Math.ceil(scrollState.containerHeight / rowHeight) + 2
  ) : totalVirtualRows;
  const virtualSlice = useVirtualScroll ? displayedRows.slice(virtualStart, virtualEnd) : paginatedRows;
  const virtualStartRowIndex = useVirtualScroll ? virtualStart : pagination ? (currentPage - 1) * pageSize : 0;
  const hasCheckboxColumn = displayColumns.some((c) => c.field === "__checkbox__");
  const hasDragColumn = displayColumns.some((c) => c.field === "__drag__");
  const rowDragColumnIndex = useMemo6(
    () => displayColumns.findIndex((c) => c.rowDrag === true),
    [displayColumns]
  );
  const columnOrder = state.columnOrder;
  const dataCols = useMemo6(
    () => state.columns.filter((c) => c.field !== "__checkbox__" && c.field !== "__drag__"),
    [state.columns]
  );
  useEffect3(() => {
    getOriginalRowIndexRef.current = (i) => {
      const idx = virtualStartRowIndex + i;
      return displayedRows[idx]?.originalIndex ?? idx;
    };
    return () => {
      getOriginalRowIndexRef.current = null;
    };
  }, [virtualStartRowIndex, displayedRows, getOriginalRowIndexRef]);
  const handleScroll = useCallback3(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (useVirtualScroll) setScrollState({ scrollTop: el.scrollTop, containerHeight: el.clientHeight });
    if (headerScrollRef.current) headerScrollRef.current.scrollLeft = el.scrollLeft;
  }, [useVirtualScroll]);
  useEffect3(() => {
    if (!useVirtualScroll) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScrollState((s) => ({ ...s, containerHeight: el.clientHeight })));
    ro.observe(el);
    return () => ro.disconnect();
  }, [useVirtualScroll]);
  useEffect3(() => {
    const onPointerUp = /* @__PURE__ */ __name(() => pointerHandlers.handlePointerUp(), "onPointerUp");
    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, [pointerHandlers]);
  const { focusedCell, selectedRange, editingCell, selectedRowIndices, sortBy } = state;
  const rowsToShow = virtualSlice.map((d) => d.row);
  useEffect3(() => {
    if (!editingCell || !gridRef.current) return;
    const sel = `[data-row="${editingCell.row}"][data-col="${editingCell.col}"]`;
    const input = gridRef.current.querySelector(`input${sel}`);
    if (input) {
      input.focus();
      return;
    }
    const selectEl = gridRef.current.querySelector(`select${sel}`);
    selectEl?.focus();
  }, [editingCell, gridRef]);
  const handleHeaderSort = useCallback3((colIndex) => {
    if (!opts.sortable) return;
    if (!sortBy || sortBy.col !== colIndex) store.setSortBy(colIndex, "asc");
    else if (sortBy.dir === "asc") store.setSortBy(colIndex, "desc");
    else store.clearSort();
  }, [sortBy, opts.sortable, store]);
  const handleExport = useCallback3(() => {
    const dataCols2 = displayColumns.filter((c) => c.field !== "__checkbox__" && c.field !== "__drag__");
    const content = exportTableToText(state.rows, dataCols2, {
      delimiter: opts.exportImportDelimiter ?? ","
    });
    downloadTableAsFile(content, opts.exportFileName ?? "export.csv");
  }, [state.rows, displayColumns, opts.exportFileName, opts.exportImportDelimiter]);
  const handleImport = useCallback3(
    (e) => {
      const file = e.target.files?.[0];
      if (!file || !opts.onImport) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? "");
        const dataCols2 = displayColumns.filter((c) => c.field !== "__checkbox__" && c.field !== "__drag__");
        const rows = importTableFromText(text, dataCols2, {
          delimiter: opts.exportImportDelimiter ?? ","
        });
        opts.onImport(rows);
      };
      reader.readAsText(file, "UTF-8");
      e.target.value = "";
    },
    [opts.onImport, opts.exportImportDelimiter, displayColumns]
  );
  const handleColumnDragStart = /* @__PURE__ */ __name((displayIndex) => setColumnDragIndex(displayIndex), "handleColumnDragStart");
  const handleColumnDragOver = /* @__PURE__ */ __name((e, displayIndex) => {
    e.preventDefault();
    if (columnDragIndex == null || columnDragIndex === displayIndex) return;
    const dataDisplayCols = displayColumns.filter((c) => c.field !== "__checkbox__" && c.field !== "__drag__");
    const metaCount = (hasDragColumn ? 1 : 0) + (hasCheckboxColumn ? 1 : 0);
    const from = columnDragIndex - metaCount;
    const to = displayIndex - metaCount;
    if (from < 0 || to < 0 || from >= dataDisplayCols.length || to >= dataDisplayCols.length) return;
    const next = [...dataDisplayCols];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    const newColumnOrder = next.map((c) => dataCols.findIndex((x) => x.field === c.field)).filter((i) => i >= 0);
    if (newColumnOrder.length === dataCols.length) store.setColumnOrder(newColumnOrder);
    setColumnDragIndex(displayIndex);
  }, "handleColumnDragOver");
  const handleColumnDragEnd = /* @__PURE__ */ __name(() => setColumnDragIndex(null), "handleColumnDragEnd");
  const handleDropRows = useCallback3(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const raw = e.dataTransfer.getData("application/x-excelgrid-rows");
      if (!raw || !opts.onDropRows) return;
      try {
        const rows = JSON.parse(raw);
        if (Array.isArray(rows) && rows.length > 0) {
          const insertAtIndex = dropInsertBeforeIndex ?? totalVirtualRows;
          opts.onDropRows(rows, insertAtIndex);
        }
      } catch {
      }
      setDropInsertBeforeIndex(null);
    },
    [opts.onDropRows, dropInsertBeforeIndex, totalVirtualRows]
  );
  const handleDragOverRows = useCallback3(
    (e) => {
      const isReorder = e.dataTransfer.types.includes("application/x-excelgrid-row-reorder");
      const isRows = e.dataTransfer.types.includes("application/x-excelgrid-rows");
      if (isReorder) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";
      } else if (isRows) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "copy";
      } else return;
      if (isReorder || isRows) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const tr = el?.closest("tr[data-row-index]");
        if (tr) {
          const idx = parseInt(tr.getAttribute("data-row-index") ?? "", 10);
          if (!Number.isNaN(idx)) {
            const rect = tr.getBoundingClientRect();
            const insertBefore = e.clientY < rect.top + rect.height / 2 ? idx : idx + 1;
            setDropInsertBeforeIndex(Math.min(insertBefore, totalVirtualRows));
            return;
          }
        }
        setDropInsertBeforeIndex(totalVirtualRows);
      }
    },
    [totalVirtualRows]
  );
  const handleDragLeaveGrid = useCallback3(() => {
    setDropInsertBeforeIndex(null);
  }, []);
  const handleRowReorderDrop = useCallback3(
    (fromDisplayedIndex, toDisplayedIndex) => {
      if (fromDisplayedIndex === toDisplayedIndex) return;
      setDropInsertBeforeIndex(null);
      const { rows } = store.getState();
      const fromOriginal = displayedRows[fromDisplayedIndex]?.originalIndex ?? fromDisplayedIndex;
      const toOriginal = displayedRows[toDisplayedIndex]?.originalIndex ?? toDisplayedIndex;
      if (fromOriginal < 0 || toOriginal < 0 || fromOriginal >= rows.length || toOriginal >= rows.length) return;
      const newRows = [...rows];
      const [removed] = newRows.splice(fromOriginal, 1);
      let insertAt = toOriginal;
      if (fromOriginal < toOriginal) insertAt -= 1;
      newRows.splice(insertAt, 0, removed);
      store.setRows(newRows);
      opts.onRowOrderChange?.(newRows);
    },
    [displayedRows, store, opts.onRowOrderChange]
  );
  const handleMultiSelectRow = useCallback3(
    (rowIndex, e) => {
      const anchor = selectionAnchorRef.current;
      if (e.shiftKey) {
        const from = anchor != null ? Math.min(anchor, rowIndex) : 0;
        const to = anchor != null ? Math.max(anchor, rowIndex) : rowIndex;
        const indices = Array.from({ length: to - from + 1 }, (_, i) => from + i).filter(
          (i) => i >= 0 && i < totalVirtualRows
        );
        store.setSelectedRowIndices(indices);
      } else if (e.ctrlKey || e.metaKey) {
        const set = new Set(state.selectedRowIndices);
        if (set.has(rowIndex)) set.delete(rowIndex);
        else set.add(rowIndex);
        store.setSelectedRowIndices(Array.from(set));
        selectionAnchorRef.current = rowIndex;
      } else {
        store.setSelectedRowIndices([rowIndex]);
        selectionAnchorRef.current = rowIndex;
      }
    },
    [totalVirtualRows, state.selectedRowIndices, store]
  );
  const getRowsForIndices = useCallback3(
    (indices) => indices.map((i) => displayedRows[i]?.row).filter((r) => r != null),
    [displayedRows]
  );
  const handleEditingChange = useCallback3(
    (newValue) => {
      const s = store.getState();
      const { editingCell: editingCell2, rows, columns, columnOrder: columnOrder2 } = s;
      if (!editingCell2) return;
      const displayCols = getDisplayColumns(columns, columnOrder2);
      const colDef = getColumnByIndex(displayCols, editingCell2.col);
      if (!colDef || colDef.field === "__checkbox__" || colDef.field === "__drag__") return;
      const originalRow = getOriginalRowIndexRef.current?.(editingCell2.row) ?? editingCell2.row;
      const prevValue = getCellValue(rows[originalRow], colDef.field);
      const nextRows = setCellValue(rows, originalRow, colDef.field, newValue);
      store.setRows(nextRows);
      opts.onChange?.(originalRow, editingCell2.col, newValue);
      if (opts.onCellChange && String(prevValue ?? "") !== String(newValue ?? "")) {
        opts.onCellChange(originalRow, editingCell2.col, prevValue, newValue);
      }
    },
    [store, opts.onChange, opts.onCellChange]
  );
  const pinnedRowCount = opts.pinnedRowCount ?? 0;
  const hasPinnedColumn = displayColumns.some((c) => getEffectivePinned(c) != null);
  const tableMinWidth = hasPinnedColumn ? getTableMinWidth(displayColumns) : void 0;
  return /* @__PURE__ */ jsxs11(GridRoot, { className, style, children: [
    /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
      opts.searchPlaceholder != null && /* @__PURE__ */ jsx24(
        Input,
        {
          type: "search",
          placeholder: opts.searchPlaceholder,
          value: state.searchText,
          onChange: (e) => store.setSearchText(e.target.value),
          className: "max-w-xs"
        }
      ),
      opts.onAddRow && /* @__PURE__ */ jsx24(Button, { type: "button", variant: "secondary", size: "sm", onClick: opts.onAddRow, children: "\uD589 \uCD94\uAC00" }),
      opts.exportFileName && /* @__PURE__ */ jsxs11(Fragment5, { children: [
        /* @__PURE__ */ jsx24(Button, { type: "button", variant: "secondary", size: "sm", onClick: handleExport, children: "Export" }),
        opts.onImport && /* @__PURE__ */ jsxs11(Fragment5, { children: [
          /* @__PURE__ */ jsx24(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: ".csv,.txt",
              className: "hidden",
              onChange: handleImport
            }
          ),
          /* @__PURE__ */ jsx24(
            Button,
            {
              type: "button",
              variant: "secondary",
              size: "sm",
              onClick: () => fileInputRef.current?.click(),
              children: "Import"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx24(
      GridViewport,
      {
        ref: gridRef,
        onKeyDown: handleKeyDown,
        onPointerDown: pointerHandlers.handlePointerDown,
        onPointerMove: pointerHandlers.handlePointerMove,
        onPointerUp: pointerHandlers.handlePointerUp,
        onDoubleClick: pointerHandlers.handleDoubleClick,
        children: /* @__PURE__ */ jsxs11(
          "div",
          {
            className: "flex flex-col border border-gray-200 dark:border-gray-700 rounded overflow-hidden dark:bg-gray-900",
            style: useVirtualScroll ? { maxHeight: maxScrollHeight, minHeight: 0 } : void 0,
            children: [
              /* @__PURE__ */ jsx24(
                "div",
                {
                  ref: headerScrollRef,
                  className: "bg-gray-100 dark:bg-gray-800/95 dark:border-b dark:border-gray-700 overflow-x-auto overflow-y-hidden shrink-0",
                  style: { scrollbarWidth: "none", msOverflowStyle: "none" },
                  children: /* @__PURE__ */ jsxs11("table", { className: "w-full border-collapse", style: { tableLayout: "fixed" }, children: [
                    /* @__PURE__ */ jsx24("colgroup", { children: displayColumns.map((col, i) => /* @__PURE__ */ jsx24("col", { style: col.width != null ? { width: col.width, minWidth: col.width } : void 0 }, col.field)) }),
                    /* @__PURE__ */ jsx24("thead", { children: /* @__PURE__ */ jsx24("tr", { children: displayColumns.map((col, colIndex) => {
                      const pinned = getEffectivePinned(col);
                      const leftPx = pinned === "left" ? getPinnedOffset(displayColumns, colIndex, "left") : void 0;
                      const rightPx = pinned === "right" ? getPinnedOffset(displayColumns, colIndex, "right") : void 0;
                      const stickyStyle = leftPx !== void 0 ? { position: "sticky", left: leftPx, zIndex: 11, boxShadow: "2px 0 2px -2px rgba(0,0,0,0.1)" } : rightPx !== void 0 ? { position: "sticky", right: rightPx, zIndex: 11, boxShadow: "-2px 0 2px -2px rgba(0,0,0,0.1)" } : {};
                      const stickyThClass = leftPx !== void 0 || rightPx !== void 0 ? "bg-gray-100 dark:bg-gray-800/95" : "";
                      const isMetaCol = col.field === "__checkbox__" || col.field === "__drag__";
                      const colMovable = "movable" in col ? col.movable !== false : true;
                      const canDragCol = opts.columnReorder && !isMetaCol && colMovable;
                      return /* @__PURE__ */ jsx24(
                        "th",
                        {
                          className: cn(
                            "border-b border-r border-gray-200 dark:border-gray-700 px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-100",
                            stickyThClass,
                            opts.sortable && !isMetaCol && "cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700/80",
                            canDragCol && "cursor-grab",
                            columnDragIndex === colIndex && "opacity-50"
                          ),
                          style: {
                            ...col.width != null ? { width: col.width, minWidth: col.width } : {},
                            ...stickyStyle
                          },
                          onClick: opts.sortable && !isMetaCol ? () => handleHeaderSort(colIndex) : void 0,
                          draggable: canDragCol,
                          onDragStart: () => canDragCol && handleColumnDragStart(colIndex),
                          onDragOver: (e) => opts.columnReorder && !isMetaCol && handleColumnDragOver(e, colIndex),
                          onDragEnd: handleColumnDragEnd,
                          children: col.field === "__drag__" ? /* @__PURE__ */ jsx24("span", { className: "inline-block w-4 h-4 text-gray-400 dark:text-gray-500", "aria-hidden": true, children: "\u22EE\u22EE" }) : col.field === "__checkbox__" ? hasCheckboxColumn && /* @__PURE__ */ jsx24("div", { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx24(
                            IndeterminateCheckbox,
                            {
                              checked: totalVirtualRows > 0 && selectedRowIndices.length === totalVirtualRows,
                              indeterminate: selectedRowIndices.length > 0 && selectedRowIndices.length < totalVirtualRows,
                              onChange: () => store.toggleAllRowsSelection(totalVirtualRows),
                              "aria-label": "\uC804\uCCB4 \uC120\uD0DD"
                            }
                          ) }) : /* @__PURE__ */ jsxs11("div", { className: "flex flex-col gap-1", children: [
                            /* @__PURE__ */ jsxs11("span", { className: "inline-flex items-center gap-1", children: [
                              col.header ?? col.field,
                              opts.sortable && sortBy?.col === colIndex && /* @__PURE__ */ jsx24("span", { className: "text-blue-600 dark:text-blue-400", "aria-hidden": true, children: sortBy.dir === "asc" ? "\u25B2" : "\u25BC" })
                            ] }),
                            opts.columnFilter && /* @__PURE__ */ jsx24(
                              "input",
                              {
                                type: col.filterType === "number" ? "number" : col.filterType === "date" ? "date" : "text",
                                placeholder: "\uD544\uD130...",
                                value: state.columnFilters[getDataColIndexFromDisplay(colIndex, displayColumns, dataCols)] ?? "",
                                onChange: (e) => store.setColumnFilter(getDataColIndexFromDisplay(colIndex, displayColumns, dataCols), e.target.value),
                                onClick: (e) => e.stopPropagation(),
                                className: "w-full text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700/90 dark:text-gray-100 dark:placeholder-gray-400 rounded px-1 py-0.5 focus:dark:border-gray-500 focus:dark:ring-1 focus:dark:ring-gray-500 focus:dark:outline-none"
                              }
                            )
                          ] })
                        },
                        `${col.field}-${colIndex}`
                      );
                    }) }) })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx24(
                "div",
                {
                  ref: scrollContainerRef,
                  onScroll: handleScroll,
                  className: "flex-1 min-h-0 overflow-auto dark:bg-gray-900",
                  children: /* @__PURE__ */ jsxs11("table", { className: "w-full border-collapse border-t-0", style: useVirtualScroll ? { tableLayout: "fixed" } : { tableLayout: "fixed", minWidth: tableMinWidth }, children: [
                    /* @__PURE__ */ jsx24("colgroup", { children: displayColumns.map((col) => /* @__PURE__ */ jsx24("col", { style: col.width != null ? { width: col.width, minWidth: col.width } : void 0 }, col.field)) }),
                    /* @__PURE__ */ jsx24(
                      GridBody,
                      {
                        rows: rowsToShow,
                        columns: displayColumns,
                        focusedCell,
                        selectedRange,
                        editingCell,
                        checkboxSelection: hasCheckboxColumn,
                        selectedRowIndices,
                        onToggleRowSelection: store.toggleRowSelection,
                        pinnedRowCount,
                        startRowIndex: virtualStartRowIndex,
                        virtualScroll: useVirtualScroll ? {
                          totalRows: totalVirtualRows,
                          rowHeight,
                          startIndex: virtualStart,
                          endIndex: virtualEnd
                        } : void 0,
                        rowDraggable: opts.rowDraggable,
                        rowDragColumnIndex: rowDragColumnIndex >= 0 ? rowDragColumnIndex : void 0,
                        onRowReorderDrop: opts.onRowOrderChange ? handleRowReorderDrop : void 0,
                        onDropRows: opts.onDropRows ? handleDropRows : void 0,
                        onDragOverRows: opts.onDropRows || opts.onRowOrderChange ? handleDragOverRows : void 0,
                        onDragLeaveGrid: opts.onDropRows || opts.onRowOrderChange ? handleDragLeaveGrid : void 0,
                        dropInsertBeforeIndex,
                        totalRowCount: totalVirtualRows,
                        multiSelect: opts.multiSelect,
                        onRowClick: opts.multiSelect ? handleMultiSelectRow : void 0,
                        getRowsForIndices: opts.rowDraggable ? getRowsForIndices : void 0,
                        isRowLoading: opts.isRowLoading,
                        getCellClassName: opts.getCellClassName,
                        onEditingBlur: commitEditingCell,
                        onEditingChange: opts.editable ? handleEditingChange : void 0
                      }
                    )
                  ] })
                }
              )
            ]
          }
        )
      }
    ),
    pagination && !useVirtualScroll && totalPages > 1 && /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2 mt-2", children: [
      /* @__PURE__ */ jsx24(
        Button,
        {
          type: "button",
          variant: "secondary",
          size: "sm",
          disabled: currentPage <= 1,
          onClick: () => setCurrentPage(currentPage - 1),
          children: "\uC774\uC804"
        }
      ),
      /* @__PURE__ */ jsxs11("span", { className: "text-sm", children: [
        currentPage,
        " / ",
        totalPages
      ] }),
      /* @__PURE__ */ jsx24(
        Button,
        {
          type: "button",
          variant: "secondary",
          size: "sm",
          disabled: currentPage >= totalPages,
          onClick: () => setCurrentPage(currentPage + 1),
          children: "\uB2E4\uC74C"
        }
      )
    ] })
  ] });
}, "ExcelGridInner");

// src/components/molecules/ExcelGrid/ExcelGrid.tsx
import { jsx as jsx25 } from "react/jsx-runtime";
var ExcelGrid = /* @__PURE__ */ __name(({
  columns,
  rows,
  editable = false,
  selection = true,
  checkboxSelection = false,
  multiSelect = false,
  onSelectionChange,
  sortable = false,
  searchPlaceholder,
  columnFilter = false,
  columnReorder = false,
  pagination,
  virtualScroll,
  pinnedRowCount = 0,
  rowDraggable = false,
  onDropRows,
  onRowOrderChange,
  onAddRow,
  isRowLoading,
  getCellClassName,
  exportFileName,
  exportImportDelimiter = ",",
  onImport,
  onChange,
  onCellChange,
  className,
  style
}) => /* @__PURE__ */ jsx25(
  ExcelGridProvider,
  {
    rows,
    columns,
    editable,
    checkboxSelection,
    multiSelect,
    onSelectionChange,
    sortable,
    searchPlaceholder,
    columnFilter,
    columnReorder,
    pagination,
    virtualScroll,
    pinnedRowCount,
    rowDraggable,
    onDropRows,
    onRowOrderChange,
    onAddRow,
    isRowLoading,
    getCellClassName,
    exportFileName,
    exportImportDelimiter,
    onImport,
    onChange,
    onCellChange,
    children: /* @__PURE__ */ jsx25(ExcelGridInner, { className, style })
  }
), "ExcelGrid");

// src/hooks/useDisclosure.ts
import { useCallback as useCallback4, useState as useState4 } from "react";
var useDisclosure = /* @__PURE__ */ __name((initial = false) => {
  const [isOpen, setIsOpen] = useState4(initial);
  const open = useCallback4(() => setIsOpen(true), []);
  const close = useCallback4(() => setIsOpen(false), []);
  const toggle = useCallback4(() => setIsOpen((prev) => !prev), []);
  return { isOpen, open, close, toggle };
}, "useDisclosure");
export {
  Badge,
  Button,
  Checkbox,
  DataTable,
  DataTableHead,
  Dropdown,
  EditableCell,
  EditableTable,
  ExcelGrid,
  I18nProvider,
  Input,
  Modal,
  TableRoot as Table,
  TableBody,
  TableHead,
  Tabs,
  ThemeProvider,
  baseMessages,
  baseTheme,
  cn,
  mergeMessages,
  mergeTheme,
  useComponentTheme,
  useDataTable,
  useDisclosure,
  useI18n,
  useMessage,
  useT,
  useTableContext,
  useTheme,
  useThemeActions,
  useThemeKey,
  useThemeRegistry
};
//# sourceMappingURL=index.js.map