/**
 * 컬럼 셀 편집 시 사용할 입력 타입
 */
export type EditType = 'text' | 'number' | 'date' | 'checkbox' | 'dropdown';

export interface EditOption {
  value: string;
  label: string;
}

/**
 * EditableTable 컬럼에서 사용하는 meta.
 * editType이 있으면 해당 셀은 편집 가능, 없으면 읽기 전용 표시만.
 */
export interface EditableColumnMeta {
  /** 셀 편집 타입. 지정 시 해당 컬럼 셀이 해당 입력 컴포넌트로 렌더됨 */
  editType?: EditType;
  /** editType === 'dropdown' 일 때 선택 옵션 목록 */
  editOptions?: EditOption[];
  /** 기존 Table meta (className 등) */
  className?: string;
}
