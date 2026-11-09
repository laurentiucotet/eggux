// EGG UI Resizable Panels. Figma: Resizable Panels (Drawer page, "Resizable Panels / Component"),
// slots Start and End. Two panels with a handle that drags the split: list and detail, editor and
// preview, code and output. Figma: 960 × 400, radius lg, border; Start 320 wide, End fills on
// background/muted, both 16 padding, 8 gap; the handle is 12 wide with a left border and a 12 px
// grip-vertical icon. Needs at least 480.
// The code mapping names shadcn Resizable (react-resizable-panels); that package is not in this
// library, so the split is built here with the WAI-ARIA window splitter pattern: the handle is a
// focusable role="separator" (aria-valuenow = start panel width in px, aria-valuemin/max,
// aria-controls the start panel). Arrows move it 16 px (Shift 64), Home/End go to min/max, Enter
// collapses the start panel and restores it, double-click resets it. Pointer drag works on mouse,
// pen and touch. `storageKey` remembers the split per person (localStorage, best effort).
import * as React from 'react';
import { GripVertical } from '@/components/icons';
import { cn } from '@/lib/utils';

const HANDLE = 12;
const BORDERS = 2;

export interface ResizablePanelsProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Start slot: the first panel (a list, a tree, navigation). Keeps its width. */
  start: React.ReactNode;
  /** Figma End slot: the second panel (the detail of what is selected). Fills the rest. */
  end: React.ReactNode;
  /** Start panel width in px (controlled). */
  size?: number;
  /** Initial and reset (double-click) width of the start panel. Default 320, as in Figma. */
  defaultSize?: number;
  /** Called with the new start panel width (0 when collapsed). */
  onSizeChange?: (size: number) => void;
  /** Minimum width of the start panel. Default 200. */
  minStart?: number;
  /** Minimum width of the end panel. Default 240. */
  minEnd?: number;
  /** Enter on the handle collapses the start panel to nothing and restores it. Default true. */
  collapsible?: boolean;
  /** Remember the split per person under this localStorage key. */
  storageKey?: string;
  /** Accessible name of the handle. Default "Resize panels". */
  handleLabel?: string;
  /** Accessible names of the panels (they render as labelled groups when given). */
  startLabel?: string;
  endLabel?: string;
  startClassName?: string;
  endClassName?: string;
}

function readStored(key: string | undefined): number | undefined {
  if (!key) return undefined;
  try {
    const v = window.localStorage.getItem(key);
    const n = v === null ? NaN : Number(v);
    return Number.isFinite(n) ? n : undefined;
  } catch {
    return undefined;
  }
}

function ResizablePanels({
  start,
  end,
  size: sizeProp,
  defaultSize = 320,
  onSizeChange,
  minStart = 200,
  minEnd = 240,
  collapsible = true,
  storageKey,
  handleLabel = 'Resize panels',
  startLabel,
  endLabel,
  startClassName,
  endClassName,
  className,
  ...props
}: ResizablePanelsProps) {
  const [inner, setInner] = React.useState(() => readStored(storageKey) ?? defaultSize);
  const [containerWidth, setContainerWidth] = React.useState<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const lastOpen = React.useRef(defaultSize);
  const drag = React.useRef<{ x: number; size: number } | null>(null);
  const startId = React.useId();

  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const max = containerWidth === null ? Math.max(minStart, defaultSize) : Math.max(minStart, containerWidth - BORDERS - HANDLE - minEnd);
  const clamp = (n: number) => Math.round(Math.min(max, Math.max(minStart, n)));
  const raw = sizeProp ?? inner;
  const collapsed = collapsible && raw <= 0;
  const size = collapsed ? 0 : clamp(raw);
  const min = collapsible ? 0 : minStart;

  const commit = (next: number) => {
    const value = next <= 0 && collapsible ? 0 : clamp(next);
    if (value > 0) lastOpen.current = value;
    if (sizeProp === undefined) setInner(value);
    onSizeChange?.(value);
    if (storageKey) {
      try {
        window.localStorage.setItem(storageKey, String(value));
      } catch {
        /* storage blocked: the split is not remembered */
      }
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 64 : 16;
    const from = collapsed ? 0 : size;
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        next = collapsed ? 0 : Math.max(minStart, from - step);
        break;
      case 'ArrowRight':
        next = collapsed ? minStart : from + step;
        break;
      case 'Home':
        next = minStart;
        break;
      case 'End':
        next = max;
        break;
      case 'Enter':
        if (!collapsible) return;
        next = collapsed ? lastOpen.current : 0;
        break;
      default:
        return;
    }
    event.preventDefault();
    commit(next);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = { x: event.clientX, size };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    commit(Math.max(minStart, drag.current.size + event.clientX - drag.current.x));
  };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return (
    <div
      ref={rootRef}
      data-slot="resizable-panels"
      className={cn('flex min-w-[480px] overflow-hidden rounded-lg border bg-background text-foreground', className)}
      {...props}
    >
      <div
        id={startId}
        data-slot="resizable-panel-start"
        role={startLabel ? 'group' : undefined}
        aria-label={startLabel}
        hidden={collapsed}
        style={{ width: size }}
        className={cn('flex min-w-0 shrink-0 flex-col gap-2 overflow-auto p-4', startClassName)}
      >
        {start}
      </div>
      <div
        role="separator"
        tabIndex={0}
        aria-label={handleLabel}
        aria-orientation="vertical"
        aria-controls={startId}
        aria-valuenow={size}
        aria-valuemin={min}
        aria-valuemax={Math.round(max)}
        data-slot="resizable-handle"
        data-state={collapsed ? 'collapsed' : 'open'}
        onKeyDown={onKeyDown}
        onDoubleClick={() => commit(defaultSize)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          'flex w-3 shrink-0 cursor-col-resize touch-none items-center justify-center border-l text-muted-foreground outline-none select-none hover:bg-accent focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]',
          collapsed && 'border-l-0',
        )}
      >
        <GripVertical aria-hidden="true" className="size-3" />
      </div>
      <div
        data-slot="resizable-panel-end"
        role={endLabel ? 'group' : undefined}
        aria-label={endLabel}
        className={cn('flex min-w-0 flex-1 flex-col gap-2 overflow-auto bg-muted p-4', endClassName)}
      >
        {end}
      </div>
    </div>
  );
}

export { ResizablePanels };
