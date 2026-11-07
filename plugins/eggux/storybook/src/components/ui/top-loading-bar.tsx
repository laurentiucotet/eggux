// EGG UI Top Loading Bar. Figma: Top Loading Bar (Progress page, "Top Loading Bar / Component",
// 1097:114749). Value (indeterminate, or a number), Show track. A 2 px primary bar along the top
// edge of the page or a region while a route, page change or in-place generation loads. Without a
// value a 40% segment slides across; with one it fills to that share (uploads, reading progress).
// Show track adds the background/muted rail (reading progress); route loads have none. Fills any
// width; put it at the very top, above everything, and remove it when the load ends. Never for
// loads under about 300 ms.
// A11y: role="progressbar" with a name; aria-valuenow only when the value is known.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TopLoadingBarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** 0 to 100; leave out for indeterminate. */
  value?: number;
  /** Figma Show track. */
  track?: boolean;
  /** Accessible name. */
  label?: string;
}

function TopLoadingBar({ value, track = false, label = 'Loading', className, ...props }: TopLoadingBarProps) {
  const known = typeof value === 'number';
  const v = known ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div
      data-slot="top-loading-bar"
      role="progressbar"
      aria-label={label}
      aria-valuemin={known ? 0 : undefined}
      aria-valuemax={known ? 100 : undefined}
      aria-valuenow={known ? v : undefined}
      className={cn('relative h-0.5 w-full overflow-hidden', track && 'bg-muted', className)}
      {...props}
    >
      <div
        data-slot="top-loading-bar-indicator"
        className={cn('absolute inset-y-0 left-0 bg-primary', known ? 'transition-[width] duration-[var(--duration-fast)]' : 'w-2/5 animate-progress-indeterminate motion-reduce:animate-pulse')}
        style={known ? { width: `${v}%` } : undefined}
      />
    </div>
  );
}

export { TopLoadingBar };
