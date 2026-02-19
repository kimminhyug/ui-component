import type { UIMessages } from './i18n.types';

/** 기본 UI 메시지 (한국어). I18nProvider messages로 덮어쓸 수 있음. */
export const baseMessages: UIMessages = {
  button: {
    submit: '제출',
    cancel: '취소',
    confirm: '확인',
    close: '닫기',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    back: '뒤로',
  },
  input: {
    placeholder: '입력하세요',
    search: '검색',
    clear: '지우기',
  },
  badge: {
    new: '새 항목',
    default: '기본',
  },
  modal: {
    close: '닫기',
    confirm: '확인',
    cancel: '취소',
    title: '알림',
    description: '',
  },
  dropdown: {
    placeholder: '선택하세요',
    noOptions: '선택 항목 없음',
    searchPlaceholder: '검색...',
  },
  tabs: {
    next: '다음',
    prev: '이전',
  },
  checkbox: {
    label: '',
  },
  table: {
    empty: '데이터가 없습니다',
    loading: '로딩 중...',
    noResults: '검색 결과가 없습니다',
    pageInfo: '{{from}}-{{to}} / {{total}}',
    rowsPerPage: '페이지당 행 수',
    firstPage: '첫 페이지',
    lastPage: '마지막 페이지',
    nextPage: '다음 페이지',
    prevPage: '이전 페이지',
    // DataTable: 페이지네이션 버튼(짧은 형태)
    first: '처음',
    prev: '이전',
    next: '다음',
    last: '마지막',
    // DataTable: 선택 체크박스 aria-label
    selectAll: '전체 선택',
    selectRow: '행 선택',
  },
};
