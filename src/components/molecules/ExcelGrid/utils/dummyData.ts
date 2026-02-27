import type { RowData, ColumnDef } from '../types';

const ROLES = ['개발자', '디자이너', 'PM', '기획', 'QA'];
const NAMES = [
  '김민혁', '이길동', '박길동', '최길동', '정길동', '강지훈', '조수진', '한소희',
  '윤서준', '임도현', '오민지', '신동엽', '권나라', '송혜교', '현빈',
];

/** 대용량 더미 행 생성 */
export const generateDummyRows = (
  columns: ColumnDef[],
  count: number,
  seed = 0
): RowData[] => {
  const dataCols = columns.filter((c) => c.field !== '__checkbox__');
  const rows: RowData[] = [];
  for (let i = 0; i < count; i++) {
    const row: RowData = {};
    dataCols.forEach((col) => {
      const idx = (seed + i) % 9999;
      if (col.field === 'name' || col.field === '이름') {
        row[col.field] = `${NAMES[idx % NAMES.length]}${i}`;
      } else if (col.field === 'email' || col.field === '이메일') {
        row[col.field] = `user${i}@example.com`;
      } else if (col.field === 'role' || col.field === '역할') {
        row[col.field] = ROLES[idx % ROLES.length];
      } else if (col.field === 'score' || col.field === '점수') {
        row[col.field] = 50 + (idx % 51);
      } else if (col.field === 'date' || col.field === '날짜') {
        const d = new Date(2024, 0, 1 + (idx % 365));
        row[col.field] = d.toISOString().slice(0, 10);
      } else if (col.field === 'status' || col.field === '상태') {
        row[col.field] = ['진행중', '완료', '대기'][idx % 3];
      } else {
        row[col.field] = `cell_${col.field}_${i}`;
      }
    });
    rows.push(row);
  }
  return rows;
};
