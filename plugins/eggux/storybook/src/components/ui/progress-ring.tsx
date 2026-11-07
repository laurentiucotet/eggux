// EGG UI Progress Ring. Figma: Progress Ring (Progress page, "Progress Ring / Component", 272:1290).
// Size (sm 32, default 48, lg 80), Value. Circular progress for compact places: uploads in a list,
// setup completion, a quota in a card. The ring is 10% of the size thick (track background/muted,
// indicator primary, butt ends), starting at the top and going clockwise. default shows the percent
// inside in ui/label-small, lg in heading/h4; sm has no label, so put the number next to it.
// A11y: role="progressbar" with aria-valuenow and a name (aria-label or aria-labelledby).
import * as React from 'react';
import { cn } from '@/lib/utils';

export type ProgressRingSize = 'sm' | 'default' | 'lg';

export interface ProgressRingProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** 0 to 100. */
  value: number;
  size?: ProgressRingSize;
  /** Figma Show label; sm never shows it. */
  showLabel?: boolean;
}

const px: Record<ProgressRingSize, number> = { sm: 32, default: 48, lg: 80 };

function ProgressRing({ value, size = 'default', showLabel = true, className, style, ...props }: ProgressRingProps) {
  const v = Math.max(0, Math.min(100, value));
  const s = px[size];
  const stroke = s / 10;
  const r = (s - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      data-slot="progress-ring"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: s, height: s, ...style }}
      {...props}
    >
      <svg aria-hidden="true" width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="absolute inset-0 -rotate-90">
        <circle cx={s / 2} cy={s / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        {v > 0 ? (
          <circle
            data-slot="progress-ring-indicator"
            cx={s / 2}
            cy={s / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={c * (1 - v / 100)}
            className="stroke-primary transition-[stroke-dashoffset] duration-[var(--duration-fast)]"
          />
        ) : null}
      </svg>
      {showLabel && size !== 'sm' ? (
        <span aria-hidden="true" className={cn('relative font-medium text-foreground tabular-nums', size === 'lg' ? 'text-xl leading-7 font-semibold tracking-tight' : 'text-xs leading-4')}>{v}%</span>
      ) : null}
    </div>
  );
}

export { ProgressRing };
