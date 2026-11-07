// EGG UI Chart page: Chart Legend and Legend Item (106:52), Chart Tooltip and Tooltip Row (106:96),
// Bar Chart (108:116: single, grouped, stacked), Bar Chart Horizontal (188:898), Line Chart (108:166:
// line, area), Donut Chart (188:897: donut, pie), Distribution Bar and Segment (453:5849), Gauge and
// Gauge Target (207:879), Chart Card (1097:58675). Drawn with HTML and SVG from data, no library.
// Series colors are chart/1..8 in order. Axes: y ticks 32 wide (ui/caption muted, round values),
// x labels centered under each slot, gridlines border/default, baseline input. Plot 216 high with
// 8 px above the top tick and below the baseline (Figma 560 × 240 with the x axis).
// A11y: each chart is a figure named by its label; the drawing is hidden from screen readers and a
// visually hidden table carries the numbers. Bar and line plots are focusable: Left / Right move a
// highlighted slot that shows the Chart Tooltip (hover does the same); Escape hides it.
import * as React from 'react';
import { TrendingDown, TrendingUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Skeleton } from './skeleton';

export const chartColor = (i: number) => `var(--chart-${(i % 8) + 1})`;

export const defaultFormat = (v: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v);

export function niceTicks(max: number, count = 4) {
  if (max <= 0) return Array.from({ length: count + 1 }, (_, i) => i);
  const raw = max / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 1.5, 2, 2.5, 3, 5, 7.5, 10].map(m => m * pow).find(s => s >= raw) ?? raw;
  return Array.from({ length: count + 1 }, (_, i) => i * step);
}

/* Legend */

export interface ChartLegendItemProps extends React.ComponentProps<'li'> {
  label: string;
  series?: number;
  /** swatch (bars), line (lines), dashed (the Line Chart comparison). */
  keyType?: 'swatch' | 'line' | 'dashed';
  /** Optional value after the label (shares). */
  value?: string;
  /** Key color outside the chart/N slots (Waterfall increase / decrease / total). */
  color?: string;
}

function ChartLegendItem({ label, series = 0, keyType = 'swatch', value, color, className, ...props }: ChartLegendItemProps) {
  return (
    <li data-slot="chart-legend-item" className={cn('flex list-none items-center gap-1.5 text-xs leading-4', className)} {...props}>
      {keyType === 'dashed' ? (
        <span aria-hidden="true" className="h-0 w-3 shrink-0 border-t-2 border-dashed" style={{ borderColor: color ?? chartColor(series) }} />
      ) : (
        <span aria-hidden="true" className={cn('shrink-0', keyType === 'line' ? 'h-0.5 w-3 rounded-full' : 'size-2 rounded-sm')} style={{ background: color ?? chartColor(series) }} />
      )}
      <span className="whitespace-nowrap text-muted-foreground">{label}</span>
      {value ? <span className="whitespace-nowrap text-foreground">{value}</span> : null}
    </li>
  );
}

function ChartLegend({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="chart-legend" className={cn('m-0 flex w-full flex-wrap items-center gap-x-4 gap-y-2 p-0', className)} {...props} />;
}

/* Tooltip */

function ChartTooltipRow({ label, value, series = 0, color, className, ...props }: React.ComponentProps<'div'> & { label: string; value: string; series?: number; color?: string }) {
  return (
    <div data-slot="chart-tooltip-row" className={cn('flex items-center gap-2 text-xs leading-4', className)} {...props}>
      <span aria-hidden="true" className="size-2 shrink-0 rounded-sm" style={{ background: color ?? chartColor(series) }} />
      <span className="min-w-0 flex-1 text-muted-foreground">{label}</span>
      <span className="shrink-0 font-medium whitespace-nowrap text-foreground">{value}</span>
    </div>
  );
}

function ChartTooltip({ title, className, children, ...props }: React.ComponentProps<'div'> & { title: string }) {
  return (
    <div data-slot="chart-tooltip" className={cn('flex w-44 flex-col gap-1.5 rounded-md border border-border bg-popover px-2 py-1.5 text-popover-foreground shadow-md', className)} {...props}>
      <p className="m-0 truncate text-xs leading-4 font-medium">{title}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

/* Shared data shape for bar and line charts */

export interface ChartSeries { key: string; label: string; /** A color outside the chart/N slots (the Line Chart comparison is muted-foreground). */ color?: string }
export interface ChartDatum { label: string; values: Record<string, number> }

interface CartesianProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  /** Accessible name and the table caption: "Revenue vs costs, January to June 2026". */
  label: string;
  series: ChartSeries[];
  data: ChartDatum[];
  formatValue?: (v: number) => string;
  /** Height of the plot (216 in Figma). */
  plotHeight?: number;
}

function DataTable({ label, series, data, formatValue }: Pick<CartesianProps, 'label' | 'series' | 'data'> & { formatValue: (v: number) => string }) {
  return (
    <table className="sr-only">
      <caption>{label}</caption>
      <thead><tr><td />{series.map(s => <th key={s.key} scope="col">{s.label}</th>)}</tr></thead>
      <tbody>
        {data.map(d => (
          <tr key={d.label}><th scope="row">{d.label}</th>{series.map(s => <td key={s.key}>{formatValue(d.values[s.key] ?? 0)}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

function Cartesian({ label, series, data, formatValue = defaultFormat, plotHeight = 216, stacked = false, className, render, ...props }: CartesianProps & { stacked?: boolean; render: (ctx: { max: number; y: (v: number) => number; active: number | null }) => React.ReactNode }) {
  const max = Math.max(1, ...data.map(d => (stacked ? series.reduce((a, s) => a + (d.values[s.key] ?? 0), 0) : Math.max(...series.map(s => d.values[s.key] ?? 0)))));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1]!;
  const inner = plotHeight - 16;
  const y = (v: number) => plotHeight - 8 - (v / top) * inner;
  const [active, setActive] = React.useState<number | null>(null);
  const tooltip = active !== null ? data[active] : null;
  return (
    <figure data-slot="chart" aria-label={label} className={cn('m-0 flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      <div className="flex w-full gap-2">
        <div aria-hidden="true" className="flex w-8 shrink-0 flex-col items-end justify-between text-xs leading-4 whitespace-nowrap text-muted-foreground" style={{ height: plotHeight }}>
          {[...ticks].reverse().map(t => <span key={t}>{formatValue(t)}</span>)}
        </div>
        <div
          data-slot="chart-plot"
          tabIndex={0}
          role="group"
          aria-label={`${label}. Use the left and right arrow keys to read the values.`}
          className="relative min-w-0 flex-1 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          style={{ height: plotHeight }}
          onMouseLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') { e.preventDefault(); setActive(a => (a === null ? 0 : Math.min(data.length - 1, a + 1))); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(a => (a === null ? data.length - 1 : Math.max(0, a - 1))); }
            else if (e.key === 'Escape') setActive(null);
          }}
        >
          {ticks.map((t, i) => (
            <span key={t} className={cn('absolute inset-x-0 h-px', i === 0 ? 'bg-input' : 'bg-border')} style={{ top: y(t) }} />
          ))}
          {render({ max: top, y, active })}
          <div className="absolute inset-0 flex">
            {data.map((d, i) => (
              <span key={d.label} data-slot="chart-slot" className={cn('h-full flex-1', active === i && 'bg-foreground/5')} onMouseEnter={() => setActive(i)} />
            ))}
          </div>
          {tooltip ? (
            <ChartTooltip
              title={tooltip.label}
              aria-hidden="true"
              className="pointer-events-none absolute z-10"
              style={{ top: 8, left: `calc(${((active! + 0.5) / data.length) * 100}% ${active! > data.length / 2 ? '- 184px' : '+ 8px'})` }}
            >
              {series.map((s, si) => <ChartTooltipRow key={s.key} series={si} color={s.color} label={s.label} value={formatValue(tooltip.values[s.key] ?? 0)} />)}
            </ChartTooltip>
          ) : null}
          <span aria-live="polite" className="sr-only">{tooltip ? `${tooltip.label}: ${series.map(s => `${s.label} ${formatValue(tooltip.values[s.key] ?? 0)}`).join(', ')}` : ''}</span>
        </div>
      </div>
      <div aria-hidden="true" className="flex w-full pl-10 text-center text-xs leading-4 text-muted-foreground">
        {data.map(d => <span key={d.label} className="min-w-0 flex-1 truncate">{d.label}</span>)}
      </div>
      <DataTable label={label} series={series} data={data} formatValue={formatValue} />
    </figure>
  );
}

/* Bar Chart */

export interface BarChartProps extends CartesianProps {
  type?: 'single' | 'grouped' | 'stacked';
}

function BarChart({ type = 'grouped', series, data, ...props }: BarChartProps) {
  const shown = type === 'single' ? series.slice(0, 1) : series;
  return (
    <Cartesian
      data-type={type}
      series={shown}
      data={data}
      stacked={type === 'stacked'}
      {...props}
      render={({ y }) => (
        <div className="absolute inset-0 flex">
          {data.map(d => (
            <div key={d.label} className="flex h-full flex-1 items-end justify-center gap-0.5 px-[8%]">
              {type === 'stacked' ? (
                <div data-slot="chart-bar" className="flex w-6 flex-col-reverse gap-0.5" style={{ marginBottom: 8 }}>
                  {shown.map((s, si) => {
                    const v = d.values[s.key] ?? 0;
                    return <span key={s.key} className={cn(si === shown.length - 1 && 'rounded-t-sm')} style={{ height: (props.plotHeight ?? 216) - 8 - y(v), background: chartColor(si) }} />;
                  })}
                </div>
              ) : (
                shown.map((s, si) => {
                  const v = d.values[s.key] ?? 0;
                  return <span key={s.key} data-slot="chart-bar" className="block max-w-6 min-w-1 flex-1 rounded-t-sm" style={{ height: (props.plotHeight ?? 216) - 8 - y(v), marginBottom: 8, background: chartColor(si) }} />;
                })
              )}
            </div>
          ))}
        </div>
      )}
    />
  );
}

/* Line Chart */

export interface LineChartProps extends CartesianProps {
  /** line: up to 3 series; area: one series filled; stacked-area: series add up (parts of a total);
   *  step: values that change at points in time (prices, plan limits). */
  type?: 'line' | 'area' | 'stacked-area' | 'step';
  /** Figma Show comparison (line and area): the previous period of series 1 as a dashed muted line.
   *  Its values are in `data` under `key`; name it in the legend ("Previous period"). */
  comparison?: { key: string; label: string };
}

const comparisonColor = 'var(--muted-foreground)';

function LineChart({ type = 'line', series, data, plotHeight = 216, comparison, ...props }: LineChartProps) {
  const shown = type === 'area' ? series.slice(0, 1) : series.slice(0, 3);
  const compare = comparison && (type === 'line' || type === 'area') ? { ...comparison, color: comparisonColor } : undefined;
  const stacked = type === 'stacked-area';
  // Running totals per point for stacked-area: base[si][i] is the value under series si.
  const base = shown.map((_, si) => data.map(d => shown.slice(0, si).reduce((a, s) => a + (d.values[s.key] ?? 0), 0)));
  const top = (si: number, i: number) => (stacked ? base[si]![i]! : 0) + (data[i]!.values[shown[si]!.key] ?? 0);
  return (
    <Cartesian
      data-type={type}
      series={compare ? [...shown, compare] : shown}
      data={data}
      plotHeight={plotHeight}
      stacked={stacked}
      {...props}
      render={({ y, active }) => {
        const xs = data.map((_, i) => ((i + 0.5) / data.length) * 100);
        const linePts = (si: number) => {
          const pts = data.map((_, i) => [xs[i]!, y(top(si, i))] as const);
          if (type !== 'step') return pts.map(p => p.join(',')).join(' ');
          // Step: hold each value until the next point, then jump.
          return pts.flatMap((p, i) => (i === 0 ? [p] : [[p[0], pts[i - 1]![1]] as const, p])).map(p => p.join(',')).join(' ');
        };
        return (
          <>
            <svg className="absolute inset-0 size-full overflow-visible" viewBox={`0 0 100 ${plotHeight}`} preserveAspectRatio="none">
              {compare ? (
                <polyline
                  data-slot="chart-comparison"
                  points={data.map((d, i) => `${xs[i]},${y(d.values[compare.key] ?? 0)}`).join(' ')}
                  fill="none"
                  stroke={comparisonColor}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
              {shown.map((s, si) => {
                const pts = linePts(si);
                const lower = stacked ? data.map((_, i) => `${xs[i]},${y(base[si]![i]!)}`).reverse().join(' ') : `${xs[xs.length - 1]},${plotHeight - 8} ${xs[0]},${plotHeight - 8}`;
                return (
                  <g key={s.key}>
                    {type === 'area' || stacked ? <polygon data-slot="chart-area" points={`${pts} ${lower}`} fill={chartColor(si)} fillOpacity={stacked ? 0.2 : 0.1} /> : null}
                    <polyline data-slot="chart-line" points={pts} fill="none" stroke={chartColor(si)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </g>
                );
              })}
              {active !== null ? <line x1={xs[active]} x2={xs[active]} y1={8} y2={plotHeight - 8} stroke="var(--border)" strokeWidth={1} vectorEffect="non-scaling-stroke" /> : null}
            </svg>
            {shown.map((s, si) => {
              const i = active ?? data.length - 1;
              return (
                <span
                  key={s.key}
                  data-slot="chart-dot"
                  className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background"
                  style={{ left: `${xs[i]}%`, top: y(top(si, i)), background: chartColor(si) }}
                />
              );
            })}
          </>
        );
      }}
    />
  );
}

/* Bar Chart Horizontal */

export interface BarChartHorizontalProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  data: { label: string; value: number }[];
  formatValue?: (v: number) => string;
  /** Index of one bar to point out in chart/2. */
  highlight?: number;
}

function BarChartHorizontal({ label, data, formatValue = defaultFormat, highlight, className, ...props }: BarChartHorizontalProps) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <figure data-slot="chart" data-type="horizontal" aria-label={label} className={cn('m-0 w-full min-w-0', className)} {...props}>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {data.map((d, i) => (
          <li key={d.label} data-slot="chart-row" className="flex items-center gap-3 text-xs leading-4">
            <span title={d.label} className="w-[140px] shrink-0 truncate text-foreground">{d.label}</span>
            <span aria-hidden="true" className="relative h-4 min-w-0 flex-1">
              <span data-slot="chart-bar" className="absolute inset-y-0 left-0 rounded-r-sm" style={{ width: `${(d.value / max) * 96}%`, background: chartColor(highlight === i ? 1 : 0) }} />
            </span>
            <span className="w-16 shrink-0 text-right text-muted-foreground">{formatValue(d.value)}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* Donut Chart */

export interface DonutChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  data: { label: string; value: number }[];
  type?: 'donut' | 'pie';
  total?: string;
  totalLabel?: string;
  formatValue?: (v: number) => string;
}

function DonutChart({ label, data, type = 'donut', total, totalLabel, formatValue = defaultFormat, className, ...props }: DonutChartProps) {
  const sum = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = type === 'donut' ? 80 : 50;
  const width = type === 'donut' ? 40 : 100;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <figure data-slot="chart" data-type={type} aria-label={label} className={cn('m-0 flex w-full min-w-0 flex-wrap items-center gap-8', className)} {...props}>
      <div className="relative size-[200px] shrink-0">
        <svg aria-hidden="true" viewBox="0 0 200 200" className="size-full -rotate-90">
          {data.map((d, i) => {
            const len = (d.value / sum) * c;
            const seg = <circle key={d.label} data-slot="chart-segment" cx={100} cy={100} r={r} fill="none" stroke={chartColor(i)} strokeWidth={width} strokeDasharray={`${Math.max(0, len - 2)} ${c}`} strokeDashoffset={-offset} />;
            offset += len;
            return seg;
          })}
        </svg>
        {type === 'donut' && total ? (
          <div className="absolute top-1/2 left-1/2 flex w-[120px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <span className="w-full truncate text-2xl leading-8 font-semibold tracking-[-0.4px] text-foreground">{total}</span>
            {totalLabel ? <span className="w-full truncate text-xs leading-4 text-muted-foreground">{totalLabel}</span> : null}
          </div>
        ) : null}
      </div>
      <ul className="m-0 flex min-w-40 flex-1 list-none flex-col gap-2 p-0">
        {data.map((d, i) => (
          <li key={d.label} data-slot="chart-legend-item" className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-sm" style={{ background: chartColor(i) }} />
            <span className="min-w-0 flex-1 truncate text-xs leading-4 text-foreground">{d.label}</span>
            <span className="max-w-24 shrink-0 truncate text-xs leading-4 text-muted-foreground">{formatValue(d.value)}</span>
            <span className="w-10 shrink-0 text-right text-sm leading-5 font-medium text-foreground">{Math.round((d.value / sum) * 100)}%</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* Distribution Bar */

export interface DistributionBarProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  title: string;
  total?: string;
  data: { label: string; value: number }[];
  legend?: boolean;
}

function DistributionBar({ title, total, data, legend = true, className, ...props }: DistributionBarProps) {
  const sum = data.reduce((a, d) => a + d.value, 0) || 1;
  const pct = (v: number) => `${Math.round((v / sum) * 100)}%`;
  return (
    <figure data-slot="distribution-bar" aria-label={title} className={cn('m-0 flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      <figcaption className="flex items-center gap-2">
        <span className="min-w-[120px] flex-1 text-sm leading-5 font-medium text-foreground">{title}</span>
        {total ? <span className="max-w-[140px] shrink-0 truncate text-xs leading-4 text-muted-foreground">{total}</span> : null}
      </figcaption>
      <div aria-hidden="true" className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full">
        {data.map((d, i) => <span key={d.label} data-slot="distribution-segment" title={`${d.label}: ${d.value}`} className="h-full min-w-1" style={{ flex: `${d.value} 0 0`, background: chartColor(i) }} />)}
      </div>
      {legend ? (
        <ChartLegend>{data.map((d, i) => <ChartLegendItem key={d.label} series={i} label={d.label} value={pct(d.value)} />)}</ChartLegend>
      ) : (
        <span className="sr-only">{data.map(d => `${d.label} ${pct(d.value)}`).join(', ')}</span>
      )}
    </figure>
  );
}

/* Gauge */

export type GaugeStatus = 'on-track' | 'at-risk' | 'off-track';
const gaugeStatus: Record<GaugeStatus, { text: string; color: string }> = {
  'on-track': { text: 'On track', color: 'var(--chart-1)' },
  'at-risk': { text: 'At risk', color: 'var(--warning)' },
  'off-track': { text: 'Off track', color: 'var(--destructive)' },
};

export interface GaugeProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  /** 0-100. */
  value: number;
  /** 0-100, the target tick. */
  target?: number;
  status?: GaugeStatus;
  label: string;
  min?: string;
  max?: string;
  targetLabel?: string;
}

function Gauge({ value, target, status = 'on-track', label, min, max, targetLabel, className, ...props }: GaugeProps) {
  const s = gaugeStatus[status];
  const R = 108;
  const arc = (p: number) => {
    const a = Math.PI * (1 - Math.min(100, Math.max(0, p)) / 100);
    return { x: 120 + R * Math.cos(a), y: 120 - R * Math.sin(a) };
  };
  const end = arc(value);
  const t = target !== undefined ? arc(target) : null;
  return (
    <figure data-slot="gauge" data-status={status} aria-label={`${label}: ${value}%, ${s.text}`} className={cn('m-0 flex w-full min-w-60 flex-col items-center gap-2', className)} {...props}>
      <div className="relative h-32 w-60">
        <svg aria-hidden="true" viewBox="0 0 240 128" className="size-full overflow-visible">
          <path d={`M 12 120 A ${R} ${R} 0 0 1 228 120`} fill="none" stroke="var(--muted)" strokeWidth={24} />
          <path data-slot="gauge-value" d={`M 12 120 A ${R} ${R} 0 0 1 ${end.x} ${end.y}`} fill="none" stroke={s.color} strokeWidth={24} />
          {t ? (() => {
            const a = Math.PI * (1 - target! / 100);
            const ix = 120 + 92 * Math.cos(a), iy = 120 - 92 * Math.sin(a);
            const ox = 120 + 124 * Math.cos(a), oy = 120 - 124 * Math.sin(a);
            return <line data-slot="gauge-target" x1={ix} y1={iy} x2={ox} y2={oy} stroke="var(--foreground)" strokeWidth={3} />;
          })() : null}
        </svg>
        <div className="absolute top-[72px] left-1/2 flex w-[200px] -translate-x-1/2 flex-col items-center text-center">
          <span className="text-3xl leading-9 font-semibold tracking-[-0.4px] text-foreground">{value}%</span>
          <span className="text-sm leading-5 font-medium text-muted-foreground">{s.text}</span>
        </div>
      </div>
      {min || max || targetLabel ? (
        <div className="flex w-60 justify-between gap-1 text-xs leading-4 whitespace-nowrap text-muted-foreground">
          <span className="max-w-[72px] truncate">{min}</span>
          <span className="min-w-0 flex-1 truncate text-center">{targetLabel}</span>
          <span className="max-w-[72px] truncate">{max}</span>
        </div>
      ) : null}
      <figcaption className="w-full truncate text-center text-xs leading-4 text-muted-foreground">{label}</figcaption>
    </figure>
  );
}

/* Chart Card */

export interface ChartCardProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  legend?: React.ReactNode;
  insight?: { text: string; trend?: 'up' | 'down' };
  note?: string;
  state?: 'default' | 'loading' | 'empty' | 'error';
  onRetry?: () => void;
  emptyText?: string;
}

function ChartCard({ title, description, actions, legend, insight, note, state = 'default', onRetry, emptyText = 'No data for this period.', className, children, ...props }: ChartCardProps) {
  const id = React.useId();
  return (
    <section data-slot="chart-card" data-state={state} aria-labelledby={id} aria-busy={state === 'loading' || undefined} className={cn('flex w-full min-w-0 flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm', className)} {...props}>
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <h3 id={id} className="m-0 truncate text-xl leading-7 font-semibold tracking-[-0.4px]">{title}</h3>
          {description ? <p className="m-0 truncate text-sm leading-5 text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0">{actions}</div> : null}
      </div>
      {state === 'default' ? (
        <>
          {children}
          {legend}
          {insight || note ? (
            <div className="flex flex-col gap-1">
              {insight ? (
                <p className="m-0 flex items-start gap-2 text-sm leading-5 font-medium">
                  {insight.trend === 'down' ? <TrendingDown aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> : <TrendingUp aria-hidden="true" className="mt-0.5 size-4 shrink-0" />}
                  {insight.text}
                </p>
              ) : null}
              {note ? <p className="m-0 text-sm leading-5 text-muted-foreground">{note}</p> : null}
            </div>
          ) : null}
        </>
      ) : state === 'loading' ? (
        <div role="status" className="flex h-60 items-end gap-4 px-10"><span className="sr-only">Loading chart</span>
          {[40, 65, 50, 80, 60, 90].map((h, i) => <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />)}
        </div>
      ) : (
        <div role={state === 'error' ? 'alert' : 'status'} className="flex h-60 flex-col items-center justify-center gap-3 text-center">
          <p className="m-0 text-sm leading-5 font-medium text-foreground">{state === 'error' ? 'The chart could not load.' : emptyText}</p>
          {state === 'error' && onRetry ? <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button> : null}
        </div>
      )}
    </section>
  );
}

export { BarChart, BarChartHorizontal, ChartCard, ChartLegend, ChartLegendItem, ChartTooltip, ChartTooltipRow, DistributionBar, DonutChart, Gauge, LineChart };
