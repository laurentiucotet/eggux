// EGG UI Sparkline. Figma: Sparkline (Card page dependency of Stat Card). A trend line without axes,
// 12 points, 120 x 32 by default (48 high in the horizontal Stat Card). Trend (up, down, neutral)
// picks the sample shape; real data goes in `data`. The line uses chart/1. Decorative: the delta
// text next to it carries the meaning, never the color or the shape.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type SparklineTrend = 'up' | 'down' | 'neutral';

const samples: Record<SparklineTrend, number[]> = {
  up: [10, 12, 11, 14, 13, 17, 16, 20, 19, 24, 23, 28],
  down: [28, 26, 27, 23, 24, 20, 21, 17, 18, 14, 15, 10],
  neutral: [18, 20, 17, 19, 21, 18, 20, 19, 21, 18, 20, 19],
};

export interface SparklineProps extends Omit<React.ComponentProps<'svg'>, 'children'> {
  /** Figma Trend: the sample shape when `data` is not given. */
  trend?: SparklineTrend;
  /** The values to draw, oldest first. */
  data?: number[];
}

function Sparkline({ trend = 'up', data, className, ...props }: SparklineProps) {
  const values = data && data.length > 1 ? data : samples[trend];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 120;
  const h = 32;
  const points = values
    .map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / span) * (h - 4)).toFixed(1)}`)
    .join(' ');
  return (
    <svg
      data-slot="sparkline"
      data-trend={trend}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn('block h-8 w-[120px] shrink-0 overflow-visible', className)}
      {...props}
    >
      <polyline points={points} fill="none" stroke="var(--chart-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export { Sparkline };
