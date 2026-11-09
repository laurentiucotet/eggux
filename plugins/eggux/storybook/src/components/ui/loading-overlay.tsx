// EGG UI Loading Overlay. Figma: Loading Overlay (Spinner page, "Loading Overlay / Component",
// 443:5282). Covers one region while its content reloads: the old content stays underneath, faded
// by a background scrim at 85%, with a Spinner (20) over a short label (body/small, centered, 2
// lines), 8 apart, 24 px from the sides. First loads use Skeleton; long work uses Background Job.
// A11y: the region gets aria-busy while loading; the content underneath is inert; the label is in
// a role="status" element and the Spinner is hidden when the label shows.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

export interface LoadingOverlayProps extends React.ComponentProps<'div'> {
  loading: boolean;
  /** What loads: "Loading invoices…". Without it the Spinner carries "Loading". */
  label?: string;
  /** Figma Show label: false keeps the label for screen readers only. */
  showLabel?: boolean;
}

function LoadingOverlay({ loading, label, showLabel = true, className, children, ...props }: LoadingOverlayProps) {
  return (
    <div data-slot="loading-overlay" aria-busy={loading || undefined} className={cn('relative', className)} {...props}>
      <div data-slot="loading-overlay-content" inert={loading || undefined} className="contents">{children}</div>
      {loading ? (
        <div data-slot="loading-overlay-scrim" className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/85 px-6">
          <div role="status" className="flex w-full flex-col items-center gap-2 text-center">
            <Spinner />
            <span className={cn('line-clamp-2 text-sm leading-5 text-foreground', !showLabel && 'sr-only')}>{label ?? 'Loading'}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { LoadingOverlay };
