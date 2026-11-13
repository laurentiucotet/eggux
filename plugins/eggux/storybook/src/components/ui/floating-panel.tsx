// EGG UI Floating Panel. Code only (no Figma component yet). A small non-modal panel that floats
// over the page, docked to a corner (a notes pad, a help or chat window, a live preview): a title
// bar with a move handle and a close button, then the content. Drag the title bar with the pointer,
// or focus the handle (the grip button) and move it with the arrow keys (16 px, Shift 64 px; Home
// puts it back in its corner). It never leaves the window (or its container). Escape closes it
// while focus is inside; the close button does the same. Not modal: the page behind stays usable,
// focus is not trapped and not moved on open. `fixed` pins it to the window (page level); without it
// it is positioned inside the nearest positioned parent. role="dialog" with the title as its name.
import * as React from 'react';
import { GripVertical, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type FloatingPanelCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface FloatingPanelProps extends Omit<React.ComponentProps<'section'>, 'title' | 'role'> {
  /** Title bar text; also the accessible name. */
  title: string;
  /** Which corner it is docked to at the start and after Home. */
  corner?: FloatingPanelCorner;
  /** Pin to the window (position fixed). Off: inside the nearest positioned parent. */
  fixed?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Panel width in px (never wider than its bounds minus 16). */
  width?: number;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Accessible name of the move handle. */
  moveLabel?: string;
}

const corners: Record<FloatingPanelCorner, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

const STEP = 16;
const BIG_STEP = 64;

function FloatingPanel({
  title,
  corner = 'bottom-right',
  fixed = false,
  open,
  defaultOpen = true,
  onOpenChange,
  width = 320,
  closeLabel = 'Close panel',
  moveLabel = 'Move panel',
  className,
  style,
  children,
  onKeyDown,
  ...props
}: FloatingPanelProps) {
  const [inner, setInner] = React.useState(defaultOpen);
  const isOpen = open ?? inner;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };

  const id = React.useId();
  const panel = React.useRef<HTMLElement>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const drag = React.useRef<{ px: number; py: number; ox: number; oy: number; rect: DOMRect } | null>(null);

  const bounds = () => {
    const el = panel.current;
    if (!el) return null;
    if (fixed || !el.offsetParent) return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    const r = el.offsetParent.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
  };

  // Move by (dx, dy) from `start`, kept inside the bounds.
  const moveTo = (start: { ox: number; oy: number; rect: DOMRect }, dx: number, dy: number) => {
    const b = bounds();
    if (!b) return;
    const left = Math.min(Math.max(start.rect.left + dx, b.left), Math.max(b.left, b.right - start.rect.width));
    const top = Math.min(Math.max(start.rect.top + dy, b.top), Math.max(b.top, b.bottom - start.rect.height));
    setOffset({ x: start.ox + (left - start.rect.left), y: start.oy + (top - start.rect.top) });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    const el = panel.current;
    if (!el) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic pointers (tests) cannot be captured; the bar still follows pointermove.
    }
    drag.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y, rect: el.getBoundingClientRect() };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d) moveTo(d, e.clientX - d.px, e.clientY - d.py);
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const onHandleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const el = panel.current;
    if (!el) return;
    const step = e.shiftKey ? BIG_STEP : STEP;
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (e.key === 'Home') {
      e.preventDefault();
      setOffset({ x: 0, y: 0 });
    } else if (delta[e.key]) {
      e.preventDefault();
      moveTo({ ox: offset.x, oy: offset.y, rect: el.getBoundingClientRect() }, ...delta[e.key]);
    }
  };

  // Keep it inside when the window or container shrinks.
  React.useEffect(() => {
    if (!isOpen) return;
    const onResize = () => {
      const el = panel.current;
      if (el) moveTo({ ox: offset.x, oy: offset.y, rect: el.getBoundingClientRect() }, 0, 0);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, offset.x, offset.y, fixed]);

  if (!isOpen) return null;
  return (
    <section
      ref={panel}
      data-slot="floating-panel"
      data-corner={corner}
      data-dragging={dragging || undefined}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
      onKeyDown={e => {
        onKeyDown?.(e);
        if (!e.defaultPrevented && e.key === 'Escape') {
          e.stopPropagation();
          setOpen(false);
        }
      }}
      style={{ width, transform: `translate(${offset.x}px, ${offset.y}px)`, ...style }}
      className={cn(
        'z-50 flex max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)] min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg',
        fixed ? 'fixed' : 'absolute',
        corners[corner],
        className,
      )}
      {...props}
    >
      <div
        data-slot="floating-panel-bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn('flex shrink-0 touch-none items-center gap-1 border-b border-border bg-muted/50 py-1 pr-1 pl-1', dragging ? 'cursor-grabbing' : 'cursor-grab')}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          data-slot="floating-panel-handle"
          aria-label={moveLabel}
          aria-describedby={`${id}-hint`}
          onKeyDown={onHandleKey}
          className="cursor-grab"
        >
          <GripVertical aria-hidden="true" />
        </Button>
        <span id={`${id}-hint`} className="sr-only">
          Use the arrow keys to move, Shift for bigger steps, Home to reset.
        </span>
        <h2 id={`${id}-title`} className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-medium select-none">
          {title}
        </h2>
        <Button type="button" variant="ghost" size="icon-sm" data-slot="floating-panel-close" aria-label={closeLabel} onClick={() => setOpen(false)}>
          <X aria-hidden="true" />
        </Button>
      </div>
      <div data-slot="floating-panel-body" className="min-h-0 min-w-0 flex-1 overflow-auto p-4 text-sm">
        {children}
      </div>
    </section>
  );
}

export { FloatingPanel };
