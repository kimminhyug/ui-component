import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

/** 컴포넌트별 메시지 맵 (key → 번역 문자열) */
type MessageMap = Record<string, string>;
/** 테마와 동일하게 컴포넌트별로 구분한 UI 메시지 타입 */
interface UIMessages {
    button?: MessageMap;
    input?: MessageMap;
    badge?: MessageMap;
    modal?: MessageMap;
    dropdown?: MessageMap;
    tabs?: MessageMap;
    checkbox?: MessageMap;
    table?: MessageMap;
    [key: string]: MessageMap | undefined;
}

/** 기본 UI 메시지 (한국어). I18nProvider messages로 덮어쓸 수 있음. */
declare const baseMessages: UIMessages;

declare const mergeMessages: (base: UIMessages, override?: UIMessages | null) => UIMessages;

type I18nContextValue = UIMessages;
interface I18nProviderProps {
    messages?: UIMessages | null;
    children: ReactNode;
}
declare const I18nProvider: ({ messages, children }: I18nProviderProps) => react_jsx_runtime.JSX.Element;
declare const useI18n: () => I18nContextValue;
declare const useMessage: (componentKey: keyof UIMessages, messageKey: string, params?: Record<string, string | number>) => string;
declare const useT: () => ((key: string, params?: Record<string, string | number>) => string);

export { I18nProvider, type MessageMap, type UIMessages, baseMessages, mergeMessages, useI18n, useMessage, useT };
