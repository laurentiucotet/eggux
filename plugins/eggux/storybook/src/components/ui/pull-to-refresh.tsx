// EGG UI Pull To Refresh. Code only (no Figma component yet). Wraps a scrolling list on mobile:
// drag down at the top of the list past the threshold and release to refresh. While it runs a spinner
// shows at the top and the list stays put; when `onRefresh` settles the indicator closes. Pulling is a
// shortcut, never the only way: a visible "Refresh" button is the first tab stop (shown on focus) and
// a polite status announces "Refreshing" and "Updated". The indicator does not animate under
// prefers-reduced-motion. Use on lists that change while the screen is open (inbox, orders, feeds).
import * as React from 'react';
import { RefreshCw } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

export interface PullToRefreshProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Reloads the data. The indicator stays until the promise settles. */
  onRefresh: () => Promise<unknown> | void;
  /** How far to pull (px of finger movement, before damping) to arm the refresh. Default 80. */
  threshold?: number;
  /** Accessible name of the keyboard button. Default "Refresh". */
  refreshLabel?: string;
}

type Status = 'idle' | 'pulling' | 'ready' | 'refreshing' | 'done';

const MAX_PULL = 72;

function PullToRefresh({ onRefresh, threshold = 80, refreshLabel = 'Refresh', className, children, ...props }: PullToRefreshProps) {
  const [status, setStatus] = React.useState<Status>('idle');
  const [pull, setPull] = React.useState(0);
  const start = React.useRef<number | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  const run = async () => {
    setStatus('refreshing');
    setPull(MAX_PULL * 0.7);
    try {
      await onRefresh();
    } finally {
      setStatus('done');
      setPull(0);
      window.setTimeout(() => setStatus(s => (s === 'done' ? 'idle' : s)), 1500);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (status === 'refreshing') return;
    if ((ref.current?.scrollTop ?? 0) > 0) return;
    start.current = e.clientY;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (start.current === null) return;
    const dy = e.clientY - start.current;
    if (dy <= 0) {
      setPull(0);
      setStatus('idle');
      return;
    }
    // Damped: the list follows the finger at about half speed and stops at MAX_PULL.
    setPull(Math.min(MAX_PULL, dy * 0.5));
    setStatus(dy >= threshold ? 'ready' : 'pulling');
  };
  const end = () => {
    if (start.current === null) return;
    start.current = null;
    if (status === 'ready') void run();
    else {
      setPull(0);
      setStatus('idle');
    }
  };

  const busy = status === 'refreshing';
  return (
    <div
      ref={ref}
      data-slot="pull-to-refresh"
      data-status={status}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      className={cn('relative min-h-0 touch-pan-y overflow-y-auto overscroll-contain', className)}
      {...props}
    >
      <div className="sticky top-0 z-10 flex justify-center">
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          className="sr-only rounded-full border border-border bg-background px-3 py-1 text-sm font-medium focus:not-sr-only focus:mt-2 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {refreshLabel}
        </button>
      </div>
      <div
        aria-hidden="true"
        className="flex items-center justify-center overflow-hidden text-muted-foreground motion-safe:transition-[height] motion-safe:duration-[var(--duration-fast)]"
        style={{ height: pull }}
      >
        {busy ? (
          <Spinner size="sm" />
        ) : (
          <RefreshCw className="size-5" style={{ transform: `rotate(${(pull / MAX_PULL) * 270}deg)`, opacity: Math.min(1, pull / 24) }} />
        )}
      </div>
      <p role="status" className="sr-only">
        {status === 'ready' ? 'Release to refresh' : busy ? 'Refreshing' : status === 'done' ? 'Updated' : ''}
      </p>
      {children}
    </div>
  );
}

export { PullToRefresh };
