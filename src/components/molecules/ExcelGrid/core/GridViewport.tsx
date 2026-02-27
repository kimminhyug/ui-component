import { forwardRef, type ReactNode } from 'react';

export interface GridViewportProps {
  children: ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

/** 스크롤 영역 + 입력 이벤트 위임. 로직 없음. */
export const GridViewport = forwardRef<HTMLDivElement, GridViewportProps>(
  (
    {
      children,
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onDoubleClick,
      className,
      style,
    },
    ref
  ) => (
    <div
      ref={ref}
      className={className}
      style={style}
      role="grid"
      tabIndex={0}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  )
);
GridViewport.displayName = 'GridViewport';
