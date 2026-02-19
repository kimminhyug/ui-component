export type ComponentTheme = Record<string, string>;

export interface UITheme {
  button?: ComponentTheme;
  input?: ComponentTheme;
  badge?: ComponentTheme;
  modal?: ComponentTheme;
  dropdown?: ComponentTheme;
  tabs?: ComponentTheme;
  checkbox?: ComponentTheme;
  table?: ComponentTheme;
  /** className → Tailwind 클래스 매핑. className="키" 시 해당 값이 적용됨 */
  custom?: ComponentTheme;
  [key: string]: ComponentTheme | undefined;
}
