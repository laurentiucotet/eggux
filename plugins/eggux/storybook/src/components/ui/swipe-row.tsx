// EGG UI Swipe Row. Code only (no Figma component yet). A list row on mobile with actions behind it:
// swipe left to reveal them (archive, flag, delete), swipe right or tap elsewhere to close. Swiping
// is a shortcut, never the only way: the row is focusable, Left arrow reveals the actions and moves
// focus to the first, Right arrow or Escape closes them, and hidden actions are not in the tab order.
// Each action is 72 wide and 100 % high, one verb with an icon; a destructive action is red and
// last. The row follows the finger, snaps open past a third of the actions width, and the content
// keeps its own links and buttons. Not for rows with one obvious action (use a plain button).
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwipeAction {
  label: string;
  icon?: React.ReactNode;
  /** Red, and last. */
  destructive?: boolean;
  onSelect?: () => void;
}

export interface SwipeRowProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  /** The actions behind the row, 1 to 3. */
  actions: SwipeAction[];
  /** Accessible name of the row (what it is: "Invoice INV-2041"). */
  label: string;
  /** Start open (revealed). */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ACTION_WIDTH = 72;

function SwipeRow({ actions, label, defaultOpen = false, onOpenChange, className, children, ...props }: SwipeRowProps) {
  const [open, setOpenState] = React.useState(defaultOpen);
  const [drag, setDrag] = React.useState<number | null>(null);
  const start = React.useRef<{ x: number; base: number } | null>(null);
  const first = React.useRef<HTMLButtonElement>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const width = ACTION_WIDTH * actions.length;

  const setOpen = (value: boolean) => {
    setOpenState(value);
    onOpenChange?.(value);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, base: open ? -width : 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const next = start.current.base + (e.clientX - start.current.x);
    setDrag(Math.max(-width, Math.min(0, next)));
  };
  const end = () => {
    if (!start.current) return;
    const at = drag ?? start.current.base;
    start.current = null;
    setDrag(null);
    setOpen(at < -width / 3);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'ArrowLeft' && !open) {
      e.preventDefault();
      setOpen(true);
      window.setTimeout(() => first.current?.focus(), 0);
    } else if ((e.key === 'ArrowRight' || e.key === 'Escape') && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const offset = drag ?? (open ? -width : 0);
  return (
    <div
      ref={root}
      data-slot="swipe-row"
      data-state={open ? 'open' : 'closed'}
      role="group"
      aria-label={label}
      aria-roledescription="swipeable row"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      className={cn('relative touch-pan-y overflow-hidden rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', className)}
      {...props}
    >
      <div className="absolute inset-y-0 right-0 flex" style={{ width }}>
        {actions.map((a, i) => (
          <button
            key={a.label}
            ref={i === 0 ? first : undefined}
            type="button"
            tabIndex={open ? 0 : -1}
            aria-hidden={open ? undefined : true}
            onClick={() => {
              a.onSelect?.();
              setOpen(false);
            }}
            style={{ width: ACTION_WIDTH }}
            className={cn(
              'flex shrink-0 flex-col items-center justify-center gap-1 text-xs leading-4 font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50 [&_svg]:size-5',
              a.destructive ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground',
            )}
          >
            {a.icon}
            <span className="max-w-full truncate px-1">{a.label}</span>
          </button>
        ))}
      </div>
      <div
        className={cn('relative bg-background', drag === null && 'motion-safe:transition-transform motion-safe:duration-[var(--duration-fast)]')}
        style={{ transform: `translateX(${offset}px)` }}
      >
        {children}
      </div>
    </div>
  );
}

export { SwipeRow };
