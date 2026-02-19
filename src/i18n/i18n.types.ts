/** 컴포넌트별 메시지 맵 (key → 번역 문자열) */
export type MessageMap = Record<string, string>;

/** 테마와 동일하게 컴포넌트별로 구분한 UI 메시지 타입 */
export interface UIMessages {
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
