import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { baseMessages } from './base-messages';
import type { UIMessages } from './i18n.types';
import { mergeMessages } from './merge-messages';

type I18nContextValue = UIMessages;

const replaceParams = (
  template: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return template;
  let out = template;
  for (const [k, v] of Object.entries(params)) {
    out = out.split(`{{${k}}}`).join(String(v));
  }
  return out;
};

const I18nContext = createContext<I18nContextValue>(baseMessages);

export interface I18nProviderProps {
  messages?: UIMessages | null;
  children: ReactNode;
}

export const I18nProvider = ({ messages, children }: I18nProviderProps) => {
  const value = useMemo(
    () => (messages ? mergeMessages(baseMessages, messages) : baseMessages),
    [messages]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) return baseMessages;
  return ctx;
};


export const useMessage = (
  componentKey: keyof UIMessages,
  messageKey: string,
  params?: Record<string, string | number>
): string => {
  const messages = useI18n();
  const map = messages[componentKey];
  const raw = (map && typeof map === 'object' && (map as Record<string, string>)[messageKey]) ?? '';
  return typeof raw === 'string' ? replaceParams(raw, params) : '';
};


export const useT = (): ((
  key: string,
  params?: Record<string, string | number>
) => string) => {
  const messages = useI18n();

  return (key, params) => {
    const dot = key.indexOf('.');
    const componentKey = dot < 0 ? key : key.slice(0, dot);
    const messageKey = dot < 0 ? '' : key.slice(dot + 1);

    const map = messages[componentKey];
    const raw =
      (map && typeof map === 'object' && (map as Record<string, string>)[messageKey]) ?? '';
    return typeof raw === 'string' ? replaceParams(raw, params) : '';
  };
};
