/**
 * className 문자열을 theme.custom 맵으로 치환.
 * className="my-token" 이고 custom['my-token'] = 'bg-red-500' 이면 → 'bg-red-500' 적용.
 */
export const resolveClassName = (
  className: string | undefined,
  customMap: Record<string, string> | undefined
): string => {
  if (!className?.trim()) return '';
  if (!customMap || typeof customMap !== 'object') return className.trim();

  return className
    .trim()
    .split(/\s+/)
    .map((token) => (customMap[token] !== undefined ? customMap[token] : token))
    .filter(Boolean)
    .join(' ');
};
