// EGG UI Bottom Sheet. Code only (no Figma component yet). Mobile page / Bottom Sheet.
// Like Drawer (same Radix Dialog, same surface: full width, radius xl on top, border on top, shadow
// lg, scrim, safe-area padding) with the part Drawer leaves out: it can be dragged. The handle sits
// on top; drag it down to close, up or down to move between detents (peek 30 %, half 50 %, full =
// the screen minus 48 px). The sheet follows the finger while dragging and snaps to the nearest
// detent on release; released below about 60 % of the peek height it closes.
// The handle is a button, so there is a keyboard path: ArrowUp and ArrowDown change the detent, Home
// and End jump to the lowest and highest, a click or Enter steps up (full goes back to the lowest).
// Escape or the Close part close it. Radix gives the focus trap, focus return to the trigger, the
// scrim, outside tap to close and the body scroll lock. Motion is only the height snap, off for
// reduced motion. Drawer stays the right choice for a short sheet that never needs to be resized.
import * as React from 'react';
import { Dialog as SheetPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type BottomSheetDetent = 'peek' | 'half' | 'full';
const ORDER: BottomSheetDetent[] = ['peek', 'half', 'full'];
const FULL_GAP = 48;
const FRACTION = { peek: 0.3, half: 0.5 } as const;
const FOCUSABLE =
  'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

const cssHeight = (d: BottomSheetDetent) => (d === 'full' ? `calc(100dvh - ${FULL_GAP}px)` : `${FRACTION[d] * 100}dvh`);
const pxHeight = (d: BottomSheetDetent) => (d === 'full' ? window.innerHeight - FULL_GAP : FRACTION[d] * window.innerHeight);

interface SheetContext {
  detent: BottomSheetDetent;
  setDetent: (d: BottomSheetDetent) => void;
  detents: BottomSheetDetent[];
}
const Context = React.createContext<SheetContext | null>(null);
const useSheet = () => {
  const ctx = React.useContext(Context);
  if (!ctx) throw new Error('Bottom Sheet parts must be inside <BottomSheet>');
  return ctx;
};

export interface BottomSheetProps extends React.ComponentProps<typeof SheetPrimitive.Root> {
  /** Controlled detent. */
  detent?: BottomSheetDetent;
  /** Starting detent when uncontrolled. Default half. */
  defaultDetent?: BottomSheetDetent;
  onDetentChange?: (detent: BottomSheetDetent) => void;
  /** Which detents exist, in any order. Default all three. */
  detents?: BottomSheetDetent[];
}

function BottomSheet({ detent: detentProp, defaultDetent = 'half', onDetentChange, detents = ORDER, ...props }: BottomSheetProps) {
  const [own, setOwn] = React.useState(defaultDetent);
  const list = ORDER.filter(d => detents.includes(d));
  const detent = detentProp ?? own;
  const setDetent = React.useCallback(
    (d: BottomSheetDetent) => {
      setOwn(d);
      onDetentChange?.(d);
    },
    [onDetentChange],
  );
  const value = React.useMemo(() => ({ detent, setDetent, detents: list }), [detent, setDetent, list.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Context.Provider value={value}>
      <SheetPrimitive.Root data-slot="bottom-sheet" {...props} />
    </Context.Provider>
  );
}

function BottomSheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="bottom-sheet-trigger" {...props} />;
}

function BottomSheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="bottom-sheet-close" {...props} />;
}

export interface BottomSheetContentProps extends React.ComponentProps<typeof SheetPrimitive.Content> {
  /** Accessible name of the handle button, translated by the app. The current detent is added. Default "Sheet size". */
  handleLabel?: string;
  /** Spoken hint for the arrow keys, translated by the app. */
  handleHint?: string;
}

function BottomSheetContent({
  handleLabel = 'Sheet size',
  handleHint = 'Press the up or down arrow to change the size.',
  className,
  style,
  children,
  onOpenAutoFocus,
  ...props
}: BottomSheetContentProps) {
  const { detent, setDetent, detents } = useSheet();
  const ref = React.useRef<HTMLDivElement>(null);
  const hintId = React.useId();
  const drag = React.useRef<{ y: number; start: number; moved: boolean } | null>(null);
  const [dragHeight, setDragHeight] = React.useState<number | null>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const handleOpenAutoFocus = (event: Event) => {
    onOpenAutoFocus?.(event);
    if (event.defaultPrevented) return;
    const root = ref.current;
    if (!root) return;
    const target =
      root.querySelector<HTMLElement>(`[data-slot="bottom-sheet-body"] :is(${FOCUSABLE})`) ??
      root.querySelector<HTMLElement>('[data-slot="bottom-sheet-title"]');
    if (target) {
      event.preventDefault();
      target.focus();
    }
  };

  const step = (dir: 1 | -1) => {
    const i = detents.indexOf(detent);
    const next = detents[Math.min(detents.length - 1, Math.max(0, i + dir))];
    if (next && next !== detent) setDetent(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowUp: () => step(1),
      ArrowDown: () => step(-1),
      Home: () => setDetent(detents[0]),
      End: () => setDetent(detents[detents.length - 1]),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  const onClick = () => {
    // A tap steps up; from the highest it goes back to the lowest. A drag ends in pointer-up, not here.
    if (drag.current?.moved) return;
    const i = detents.indexOf(detent);
    setDetent(detents[(i + 1) % detents.length]);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic pointers (tests) have no capture; events still reach the handle.
    }
    drag.current = { y: e.clientY, start: ref.current?.getBoundingClientRect().height ?? pxHeight(detent), moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.abs(dy) < 4) return;
    d.moved = true;
    setDragHeight(Math.min(pxHeight(detents[detents.length - 1]), Math.max(0, d.start - dy)));
  };

  const finish = (e: React.PointerEvent<HTMLButtonElement>, cancelled: boolean) => {
    const d = drag.current;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Nothing was captured.
    }
    if (!d) return;
    if (!d.moved || cancelled) {
      // Let the click handler run first, then forget the gesture.
      window.setTimeout(() => (drag.current = null), 0);
      setDragHeight(null);
      return;
    }
    const h = Math.min(pxHeight(detents[detents.length - 1]), Math.max(0, d.start - (e.clientY - d.y)));
    window.setTimeout(() => (drag.current = null), 0);
    setDragHeight(null);
    const lowest = pxHeight(detents[0]);
    if (h < lowest * 0.6) {
      closeRef.current?.click();
      return;
    }
    const nearest = detents.reduce((a, b) => (Math.abs(pxHeight(b) - h) < Math.abs(pxHeight(a) - h) ? b : a));
    setDetent(nearest);
  };

  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay data-slot="bottom-sheet-overlay" className="fixed inset-0 z-50 bg-[var(--dialog-overlay)]" />
      <SheetPrimitive.Content
        ref={ref}
        data-slot="bottom-sheet-content"
        data-detent={detent}
        data-dragging={dragHeight !== null ? '' : undefined}
        onOpenAutoFocus={handleOpenAutoFocus}
        style={{ ...style, height: dragHeight !== null ? `${dragHeight}px` : cssHeight(detent) }}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[640px] flex-col gap-2 rounded-t-xl border-t bg-background px-4 pt-1 pb-[calc(1rem+env(safe-area-inset-bottom))] text-foreground shadow-lg outline-none',
          'transition-[height] duration-[var(--duration-fast)] motion-reduce:transition-none data-[dragging]:transition-none',
          className,
        )}
        {...props}
      >
        <button
          type="button"
          data-slot="bottom-sheet-handle"
          aria-label={`${handleLabel}: ${detent}`}
          aria-describedby={hintId}
          onKeyDown={onKeyDown}
          onClick={onClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={e => finish(e, false)}
          onPointerCancel={e => finish(e, true)}
          className="-mx-4 flex h-11 w-[calc(100%+2rem)] shrink-0 cursor-grab touch-none items-center justify-center rounded-t-xl outline-none active:cursor-grabbing focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]"
        >
          <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-muted-foreground/40" />
        </button>
        <span id={hintId} className="sr-only">{handleHint}</span>
        <SheetPrimitive.Close ref={closeRef} tabIndex={-1} aria-hidden="true" className="sr-only" />
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function BottomSheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="bottom-sheet-header" className={cn('flex w-full min-w-0 shrink-0 flex-col gap-1', className)} {...props} />;
}

function BottomSheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="bottom-sheet-title"
      tabIndex={-1}
      className={cn('text-lg leading-7 font-semibold break-words text-foreground outline-none', className)}
      {...props}
    />
  );
}

function BottomSheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="bottom-sheet-description"
      className={cn('text-sm leading-5 break-words text-muted-foreground', className)}
      {...props}
    />
  );
}

/** The scrolling content. It takes focus with the keyboard so a long body can be scrolled without a pointer. */
function BottomSheetBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="bottom-sheet-body"
      tabIndex={0}
      className={cn('flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain outline-none focus-visible:shadow-[0_0_0_2px_var(--ring)]', className)}
      {...props}
    />
  );
}

/** Full-width buttons stacked 8 apart, primary first. Use Button size="touch". */
function BottomSheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="bottom-sheet-footer" className={cn('flex w-full shrink-0 flex-col gap-2 pt-2 [&>*]:w-full', className)} {...props} />;
}

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetBody,
  BottomSheetFooter,
};
