// EGG UI Distribution Bar. Code only (no Figma component yet); Data Display family.
// One stacked horizontal bar that splits a total into parts (plan mix, traffic sources, storage by
// type), with a legend that names every part, its value and its share. Segments take the chart/N
// token colors in order and are separated by a 2 px gap, so the parts read without color: the legend
// carries the label and the number. The drawing is hidden from screen readers; a visually hidden
// table holds the same data. Zero parts keep their legend row and have no segment.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { chartColor } from './charts';

export interface DistributionSegment {
  label: string;
  value: number;
  /** A token color (var(--chart-3)); defaults to the chart/N slot of the position. */
  color?: string;
}

export interface DistributionBarProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  /** Names the figure and the table caption ("Revenue by plan"). */
  label: string;
  segments: DistributionSegment[];
  /** Formats a value for the legend and the table. */
  formatValue?: (value: number) => string;
  /** Shows the legend under the bar. Off: the hidden table still holds the numbers. */
  showLegend?: boolean;
  /** Shows each share (42%) in the legend. */
  showPercent?: boolean;
  /** Bar height: 8, 12 or 20 px. */
  size?: 'sm' | 'default' | 'lg';
}

const sizes = { sm: 'h-2', default: 'h-3', lg: 'h-5' } as const;

const defaultFormat = (v: number) => v.toLocaleString('en');

function DistributionBar({
  label, segments, formatValue = defaultFormat, showLegend = true, showPercent = true, size = 'default', className, ...props
}: DistributionBarProps) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const share = (v: number) => (total > 0 ? Math.round((Math.max(0, v) / total) * 100) : 0);
  const color = (s: DistributionSegment, i: number) => s.color ?? chartColor(i);
  return (
    <figure data-slot="distribution-bar" aria-label={label} className={cn('m-0 flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      <div aria-hidden="true" data-slot="distribution-track" className={cn('flex w-full gap-0.5 overflow-hidden rounded-full bg-muted', sizes[size])}>
        {segments.map((s, i) =>
          s.value > 0 ? (
            <span
              key={s.label}
              data-slot="distribution-segment"
              className="min-w-1 basis-0 first:rounded-l-full last:rounded-r-full motion-safe:transition-[flex-grow] motion-safe:duration-[var(--duration-fast)]"
              style={{ flexGrow: s.value, background: color(s, i) }}
            />
          ) : null,
        )}
      </div>
      {showLegend ? (
        <ul aria-hidden="true" data-slot="distribution-legend" className="m-0 flex w-full min-w-0 list-none flex-wrap gap-x-4 gap-y-2 p-0">
          {segments.map((s, i) => (
            <li key={s.label} className="flex min-w-0 max-w-full items-center gap-1.5 text-xs leading-4">
              <span className="size-2 shrink-0 rounded-sm" style={{ background: color(s, i) }} />
              <span className="min-w-0 truncate text-muted-foreground">{s.label}</span>
              <span className="shrink-0 whitespace-nowrap font-medium text-foreground">
                {formatValue(s.value)}
                {showPercent ? <span className="font-normal text-muted-foreground"> ({share(s.value)}%)</span> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr><th scope="col">Part</th><th scope="col">Value</th><th scope="col">Share</th></tr>
        </thead>
        <tbody>
          {segments.map(s => (
            <tr key={s.label}><th scope="row">{s.label}</th><td>{formatValue(s.value)}</td><td>{share(s.value)}%</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export { DistributionBar };
