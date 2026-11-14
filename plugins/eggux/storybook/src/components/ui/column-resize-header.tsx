// EGG UI Column Resize Header. Code only (no Figma component yet); family Data Structures.
// A table header cell (<th>) with a resize handle on its right edge. Drag the handle with the
// pointer, or focus it and press Left and Right (10 px, Shift for 50 px). Home goes to the minimum,
// End to the maximum, Enter or a double click puts the column back to its default width. The width
// is clamped between `minWidth` and `maxWidth`. While the handle is dragged or focused a small tag
// shows the width. The app owns the width (`width` / `onWidthChange`), so it can store it or share
// it with other columns. Use in a table with `table-layout: fixed` so the th width is the column
// width; the table scrolls sideways inside its own region when the columns add up wider.
// Built on TableHead (header look, aria-sort). A11y: the handle is a focusable separator (WAI-ARIA
// window splitter): aria-orientation vertical, aria-valuenow / min / max and aria-valuetext "160
// pixels" so the new width is announced after each key press or drag step; named "Resize <column>
// column". Every pointer feature has a key: drag = Left and Right, double click = Enter.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { TableHead, type TableHeadProps } from './table';

export interface ColumnResizeHeaderProps extends Omit<TableHeadProps, 'resizeHandle' | 'children'> {
  /** The column name, used in the handle's name and as the default content. */
  label: string;
  /** Current width in px. */
  width: number;
  onWidthChange: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  /** Width Enter and double click go back to. Default: the width at the first render. */
  defaultWidth?: number;
  /** Pixels per arrow key press. Shift multiplies it by 5. Default 10. */
  step?: number;
  /** Header content when it is more than the label (a sort button). */
  children?: React.ReactNode;
}

function ColumnResizeHeader({ label, width, onWidthChange, minWidth = 80, maxWidth = 480, defaultWidth, step = 10, children, className, style, ...props }: ColumnResizeHeaderProps) {
  const initial = React.useRef(width);
  const reset = defaultWidth ?? initial.current;
  const clamp = React.useCallback((n: number) => Math.min(maxWidth, Math.max(minWidth, Math.round(n))), [minWidth, maxWidth]);
  const [dragging, setDragging] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const handleRef = React.useRef<HTMLDivElement>(null);
  const stop = React.useRef<(() => void) | null>(null);
  const latest = React.useRef({ onWidthChange, clamp });
  latest.current = { onWidthChange, clamp };

  React.useEffect(() => () => stop.current?.(), []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    handleRef.current?.focus();
    const startX = e.clientX;
    const startW = width;
    setDragging(true);
    const move = (ev: PointerEvent) => latest.current.onWidthChange(latest.current.clamp(startW + ev.clientX - startX));
    const end = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      document.removeEventListener('pointercancel', end);
      stop.current = null;
      setDragging(false);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', end);
    stop.current = end;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const delta = e.shiftKey ? step * 5 : step;
    if (e.key === 'ArrowRight') onWidthChange(clamp(width + delta));
    else if (e.key === 'ArrowLeft') onWidthChange(clamp(width - delta));
    else if (e.key === 'Home') onWidthChange(minWidth);
    else if (e.key === 'End') onWidthChange(maxWidth);
    else if (e.key === 'Enter') onWidthChange(clamp(reset));
    else return;
    e.preventDefault();
  };

  const active = dragging || focused;
  return (
    <TableHead
      data-slot="column-resize-header"
      style={{ width, minWidth: width, maxWidth: width, ...style }}
      className={cn('relative', className)}
      {...props}
    >
      <span className="block min-w-0 truncate pr-2" title={label}>{children ?? label}</span>
      <div
        ref={handleRef}
        role="separator"
        aria-orientation="vertical"
        aria-label={`Resize ${label} column`}
        aria-valuenow={width}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        aria-valuetext={`${width} pixels`}
        tabIndex={0}
        data-slot="column-resize-handle"
        onPointerDown={onPointerDown}
        onDoubleClick={() => onWidthChange(clamp(reset))}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'group/handle absolute top-0 -right-1.5 z-10 flex h-full w-3 cursor-col-resize touch-none justify-center outline-none',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'h-full w-0.5 transition-colors duration-[var(--duration-fast)] motion-reduce:transition-none group-hover/handle:bg-primary',
            active ? 'bg-primary' : 'bg-input',
            focused && 'shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
          )}
        />
        {active ? (
          <span aria-hidden="true" data-slot="column-resize-tag" className="pointer-events-none absolute top-full mt-1 rounded-md bg-foreground px-1.5 py-0.5 text-xs leading-4 whitespace-nowrap text-background tabular-nums">
            {width} px
          </span>
        ) : null}
      </div>
    </TableHead>
  );
}

export { ColumnResizeHeader };
