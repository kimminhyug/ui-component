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

// src/hooks/useDisclosure.ts
import { useCallback as useCallback2, useState as useState3 } from "react";
var useDisclosure = /* @__PURE__ */ __name((initial = false) => {
  const [isOpen, setIsOpen] = useState3(initial);
  const open = useCallback2(() => setIsOpen(true), []);
  const close = useCallback2(() => setIsOpen(false), []);
  const toggle = useCallback2(() => setIsOpen((prev) => !prev), []);
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