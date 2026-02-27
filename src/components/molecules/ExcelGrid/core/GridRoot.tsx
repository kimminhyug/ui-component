import type { ReactNode } from 'react';
import { cn } from '../../../../utils/cn';

export interface GridRootProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** 최상위 래퍼. 스타일만. */
export const GridRoot = ({ children, className, style }: GridRootProps) => (
  <div className={cn('w-full overflow-auto', className)} style={style}>
    {children}
  </div>
);
