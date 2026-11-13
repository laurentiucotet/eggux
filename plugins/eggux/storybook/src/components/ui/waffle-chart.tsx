// EGG UI Waffle Chart. Code only (no Figma component yet); Data Display family.
// A 10 x 10 grid of squares where each square is one percent of the whole: easier to read than a pie
// for "how many out of 100". Cells fill row by row from the bottom left, one part after another, using
// the largest remainder method so the cells always add up to 100. Parts use the chart/N token colors;
// the legend names each part with its value and share, so color is never the only carrier. The grid is
// hidden from screen readers; a visually hidden table holds the numbers.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { chartColor } from './charts';

export interface WaffleSegment {
  label: string;
  value: number;
  /** A token color; defaults to the chart/N slot of the position. */
  color?: string;
}

export interface WaffleChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  /** Names the figure ("Customers by plan"). */
  label: string;
  segments: WaffleSegment[];
  /** Whole the parts are measured against. Defaults to their sum; a larger total leaves empty cells. */
  total?: number;
  formatValue?: (value: number) => string;
  showLegend?: boolean;
}

const defaultFormat = (v: number) => v.toLocaleString('en');

/** Cells per segment out of 100, largest remainder, never more than 100 in all. */
export function waffleCells(values: number[], total: number): number[] {
  const safe = total > 0 ? total : 1;
  const exact = values.map(v => (Math.max(0, v) / safe) * 100);
  const cells = exact.map(Math.floor);
  const target = Math.min(100, Math.round(exact.reduce((a, b) => a + b, 0)));
  let left = target - cells.reduce((a, b) => a + b, 0);
  const order = exact.map((e, i) => ({ i, r: e - Math.floor(e) })).sort((a, b) => b.r - a.r);
  for (let k = 0; left > 0 && k < order.length; k++, left--) cells[order[k]!.i]! += 1;
  return cells;
}

function WaffleChart({ label, segments, total, formatValue = defaultFormat, showLegend = true, className, ...props }: WaffleChartProps) {
  const sum = segments.reduce((a, s) => a + Math.max(0, s.value), 0);
  const whole = total ?? sum;
  const cells = waffleCells(segments.map(s => s.value), whole);
  const color = (s: WaffleSegment, i: number) => s.color ?? chartColor(i);
  // Flat list of cell owners, index 0 = first cell filled.
  const owners: number[] = [];
  cells.forEach((n, i) => { for (let k = 0; k < n; k++) owners.push(i); });
  const share = (v: number) => (whole > 0 ? Math.round((Math.max(0, v) / whole) * 100) : 0);
  return (
    <figure data-slot="waffle-chart" aria-label={label} className={cn('m-0 flex w-full min-w-0 flex-col items-start gap-3', className)} {...props}>
      <div aria-hidden="true" data-slot="waffle-grid" className="grid aspect-square w-full max-w-60 grid-cols-10 grid-rows-10 gap-0.5">
        {Array.from({ length: 100 }, (_, n) => {
          // Row 0 is the bottom row: cell n sits at row 9 - floor(n / 10).
          const row = 9 - Math.floor(n / 10);
          const col = n % 10;
          const owner = owners[n];
          return (
            <span
              key={n}
              data-slot="waffle-cell"
              data-segment={owner ?? 'empty'}
              className="min-h-0 min-w-0 rounded-[2px] bg-muted"
              style={{ gridRow: row + 1, gridColumn: col + 1, ...(owner !== undefined ? { background: color(segments[owner]!, owner) } : null) }}
            />
          );
        })}
      </div>
      {showLegend ? (
        <ul aria-hidden="true" className="m-0 flex w-full min-w-0 list-none flex-col gap-1.5 p-0">
          {segments.map((s, i) => (
            <li key={s.label} className="flex min-w-0 items-center gap-1.5 text-xs leading-4">
              <span className="size-2 shrink-0 rounded-sm" style={{ background: color(s, i) }} />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{s.label}</span>
              <span className="shrink-0 whitespace-nowrap font-medium text-foreground">
                {formatValue(s.value)} <span className="font-normal text-muted-foreground">({share(s.value)}%)</span>
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

export { WaffleChart };
