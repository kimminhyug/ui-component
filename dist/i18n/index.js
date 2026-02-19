var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
import { createContext, useContext, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
var replaceParams = /* @__PURE__ */ __name((template, params) => {
  if (!params) return template;
  let out = template;
  for (const [k, v] of Object.entries(params)) {
    out = out.split(`{{${k}}}`).join(String(v));
  }
  return out;
}, "replaceParams");
var I18nContext = createContext(baseMessages);
var I18nProvider = /* @__PURE__ */ __name(({ messages, children }) => {
  const value = useMemo(
    () => messages ? mergeMessages(baseMessages, messages) : baseMessages,
    [messages]
  );
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value, children });
}, "I18nProvider");
var useI18n = /* @__PURE__ */ __name(() => {
  const ctx = useContext(I18nContext);
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
export {
  I18nProvider,
  baseMessages,
  mergeMessages,
  useI18n,
  useMessage,
  useT
};
//# sourceMappingURL=index.js.map