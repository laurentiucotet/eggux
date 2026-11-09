// EGG UI Chart page, second set: Heatmap (188:929), Treemap (207:880), Funnel Chart (277:1046),
// Scatter Chart (277:1077 / 277:1129), Waterfall Chart (396:5422), Combo Chart (396:5488).
// Same rules as charts.tsx: chart/N colors, ui/caption muted axes, border gridlines, input baseline,
// figure named by its label, drawings hidden from screen readers with the numbers in text or in a
// visually hidden table. Plots with values per slot are focusable: Left / Right show the tooltip.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChartLegend, ChartLegendItem, ChartTooltip, ChartTooltipRow, chartColor, defaultFormat, niceTicks } from './charts';

/** Left / Right / Escape over n slots, plus hover. */
function useActiveSlot(n: number) {
  const [active, setActive] = React.useState<number | null>(null);
  const plotProps = {
    tabIndex: 0,
    onMouseLeave: () => setActive(null),
    onBlur: () => setActive(null),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); setActive(a => (a === null ? 0 : Math.min(n - 1, a + 1))); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(a => (a === null ? n - 1 : Math.max(0, a - 1))); }
      else if (e.key === 'Escape') setActive(null);
    },
  };
  return { active, setActive, plotProps };
}

const plotClass = 'relative rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';
const tipLeft = (active: number, n: number) => `calc(${((active + 0.5) / n) * 100}% ${active > n / 2 ? '- 184px' : '+ 8px'})`;

/* Heatmap */

export interface HeatmapProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  rows: string[];
  columns: string[];
  /** values[row][column]; 0 is drawn as muted. */
  values: number[][];
  formatValue?: (v: number) => string;
  lowLabel?: string;
  highLabel?: string;
}

/** 0 for zero, 1..5 for the opacity steps of chart/1. */
const heatStep = (v: number, max: number) => (v <= 0 ? 0 : Math.max(1, Math.ceil((v / max) * 5)));
const heatCell = (step: number): React.CSSProperties => (step === 0 ? { background: 'var(--muted)' } : { background: chartColor(0), opacity: step / 5 });

function Heatmap({ label, rows, columns, values, formatValue = defaultFormat, lowLabel = 'Fewer', highLabel = 'More', className, ...props }: HeatmapProps) {
  const max = Math.max(1, ...values.flat());
  const [hover, setHover] = React.useState<{ r: number; c: number } | null>(null);
  return (
    <figure data-slot="chart" data-type="heatmap" aria-label={label} className={cn('m-0 flex w-full min-w-[276px] flex-col gap-3', className)} {...props}>
      <div aria-hidden="true" className="relative flex w-full flex-col gap-1" onMouseLeave={() => setHover(null)}>
        {rows.map((row, r) => (
          <div key={row} className="flex w-full items-center gap-1">
            <span className="w-8 shrink-0 truncate text-xs leading-4 text-muted-foreground">{row}</span>
            {columns.map((col, c) => (
              <span
                key={col}
                data-slot="heatmap-cell"
                data-step={heatStep(values[r]?.[c] ?? 0, max)}
                className={cn('h-7 min-w-px flex-1 rounded-sm', hover?.r === r && hover.c === c && 'ring-2 ring-foreground')}
                style={heatCell(heatStep(values[r]?.[c] ?? 0, max))}
                onMouseEnter={() => setHover({ r, c })}
              />
            ))}
          </div>
        ))}
        <div className="flex w-full gap-1 text-center text-xs leading-4 text-muted-foreground">
          <span className="w-8 shrink-0" />
          {columns.map(col => <span key={col} className="min-w-px flex-1 truncate">{col}</span>)}
        </div>
        {hover ? (
          <ChartTooltip
            title={`${rows[hover.r]}, ${columns[hover.c]}`}
            className="pointer-events-none absolute z-10"
            style={{ top: hover.r * 32 + 32, left: `calc(36px + (100% - 36px) * ${(hover.c + 0.5) / columns.length} ${hover.c > columns.length / 2 ? '- 184px' : '+ 8px'})` }}
          >
            <ChartTooltipRow label={label} value={formatValue(values[hover.r]?.[hover.c] ?? 0)} />
          </ChartTooltip>
        ) : null}
      </div>
      <div aria-hidden="true" className="flex items-center gap-1 text-xs leading-4 whitespace-nowrap text-muted-foreground">
        <span>{lowLabel}</span>
        {[0, 1, 2, 3, 4, 5].map(s => <span key={s} data-slot="heatmap-step" className="size-3 shrink-0 rounded-sm" style={heatCell(s)} />)}
        <span>{highLabel}</span>
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <thead><tr><td />{columns.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>{rows.map((row, r) => <tr key={row}><th scope="row">{row}</th>{columns.map((c, ci) => <td key={c}>{formatValue(values[r]?.[ci] ?? 0)}</td>)}</tr>)}</tbody>
      </table>
    </figure>
  );
}

/* Treemap */

export interface TreemapProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  data: { label: string; value: number }[];
  formatValue?: (v: number) => string;
  /** Plot height; the layout uses the width / height ratio (560 × 320 in Figma). */
  height?: number;
  ratio?: number;
}

interface Rect { x: number; y: number; w: number; h: number }

/** Squarified layout: largest first, rows laid along the short side, in a ratio × 1 box. */
function squarify(values: number[], ratio: number): Rect[] {
  const total = values.reduce((a, v) => a + v, 0) || 1;
  const areas = values.map(v => (v / total) * ratio);
  const out: Rect[] = [];
  let box: Rect = { x: 0, y: 0, w: ratio, h: 1 };
  let row: number[] = [];
  const worst = (r: number[], side: number) => {
    const s = r.reduce((a, v) => a + v, 0);
    return Math.max(...r.map(a => Math.max((side * side * a) / (s * s), (s * s) / (side * side * a))));
  };
  const place = (r: number[]) => {
    const s = r.reduce((a, v) => a + v, 0);
    if (box.w >= box.h) {
      const w = s / box.h;
      let y = box.y;
      for (const a of r) { out.push({ x: box.x, y, w, h: a / w }); y += a / w; }
      box = { x: box.x + w, y: box.y, w: box.w - w, h: box.h };
    } else {
      const h = s / box.w;
      let x = box.x;
      for (const a of r) { out.push({ x, y: box.y, w: a / h, h }); x += a / h; }
      box = { x: box.x, y: box.y + h, w: box.w, h: box.h - h };
    }
  };
  for (const a of areas) {
    const side = Math.min(box.w, box.h);
    if (row.length === 0 || worst([...row, a], side) <= worst(row, side)) row.push(a);
    else { place(row); row = [a]; }
  }
  if (row.length) place(row);
  return out;
}

function Treemap({ label, data, formatValue = defaultFormat, height = 320, ratio = 1.75, className, ...props }: TreemapProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((a, d) => a + d.value, 0) || 1;
  const rects = squarify(sorted.map(d => d.value), ratio);
  return (
    <figure data-slot="chart" data-type="treemap" aria-label={label} className={cn('m-0 w-full min-w-0', className)} {...props}>
      <ul className="relative m-0 w-full list-none p-0" style={{ height }}>
        {sorted.map((d, i) => {
          const r = rects[i]!;
          const share = `${Math.round((d.value / total) * 100)}%`;
          return (
            <li
              key={d.label}
              data-slot="treemap-cell"
              title={`${d.label}: ${formatValue(d.value)}, ${share}`}
              className="absolute overflow-hidden rounded-sm p-px"
              style={{ left: `${(r.x / ratio) * 100}%`, top: `${r.y * 100}%`, width: `${(r.w / ratio) * 100}%`, height: `${r.h * 100}%` }}
            >
              <div className="relative size-full overflow-hidden rounded-sm">
                <span aria-hidden="true" className="absolute inset-0 opacity-20" style={{ background: chartColor(i) }} />
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px]" style={{ background: chartColor(i) }} />
                <div className="absolute inset-x-3 top-2.5 flex flex-col whitespace-nowrap">
                  <span className="truncate text-sm leading-5 font-medium text-foreground">{d.label}</span>
                  <span className="truncate text-xs leading-4 text-foreground/80">{formatValue(d.value)} · {share}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

/* Funnel Chart */

export interface FunnelChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  stages: { label: string; value: number }[];
  formatValue?: (v: number) => string;
  /** Overall line under the stages; defaults to "65% overall". */
  summary?: string;
}

const pctOf = (a: number, b: number) => `${b ? Math.round((a / b) * 100) : 0}%`;

function FunnelChart({ label, stages, formatValue = v => v.toLocaleString('en'), summary, className, ...props }: FunnelChartProps) {
  const max = Math.max(1, ...stages.map(s => s.value));
  const first = stages[0]?.value ?? 0;
  const last = stages[stages.length - 1]?.value ?? 0;
  return (
    <figure data-slot="chart" data-type="funnel" aria-label={label} className={cn('m-0 flex w-full min-w-[480px] flex-col gap-2', className)} {...props}>
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {stages.map((s, i) => (
          <li key={s.label} data-slot="funnel-stage" className="flex items-center gap-3">
            <div className="flex w-[104px] shrink-0 flex-col">
              <span className="line-clamp-2 text-sm leading-5 font-medium break-words text-foreground">{s.label}</span>
              <span className="text-xs leading-4 whitespace-nowrap text-muted-foreground">{formatValue(s.value)}</span>
            </div>
            <span aria-hidden="true" className="flex min-w-px flex-1 justify-center">
              <span data-slot="chart-bar" className="block h-8 rounded-sm" style={{ width: `${(s.value / max) * 78}%`, background: chartColor(0) }} />
            </span>
            <span className="w-12 shrink-0 text-right text-sm leading-5 font-medium text-muted-foreground">
              {i > 0 ? <>{pctOf(s.value, stages[i - 1]!.value)}<span className="sr-only"> of the previous step</span></> : null}
            </span>
          </li>
        ))}
      </ol>
      <p className="m-0 pt-2 text-right text-xs leading-4 text-muted-foreground">{summary ?? `${pctOf(last, first)} overall`}</p>
    </figure>
  );
}

/* Scatter Chart */

export interface ScatterPoint { x: number; y: number; label?: string }
export interface ScatterChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  /** One or two series (chart/1, chart/2); add a Chart Legend next to it for two. */
  series: { label: string; points: ScatterPoint[] }[];
  xTitle: string;
  yTitle: string;
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
}

function ScatterChart({ label, series, xTitle, yTitle, formatX = defaultFormat, formatY = defaultFormat, className, ...props }: ScatterChartProps) {
  const all = series.flatMap((s, si) => s.points.map(p => ({ ...p, si }))).sort((a, b) => a.x - b.x);
  const yt = niceTicks(Math.max(1, ...all.map(p => p.y)));
  const xt = niceTicks(Math.max(1, ...all.map(p => p.x)), 5);
  const yMax = yt[yt.length - 1]!, xMax = xt[xt.length - 1]!;
  const y = (v: number) => 208 - (v / yMax) * 200;
  const { active, plotProps } = useActiveSlot(all.length);
  const cur = active !== null ? all[active] : null;
  return (
    <figure data-slot="chart" data-type="scatter" aria-label={label} className={cn('m-0 flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      <div className="flex w-full gap-2">
        <div aria-hidden="true" className="flex h-[216px] w-8 shrink-0 flex-col items-end justify-between text-xs leading-4 whitespace-nowrap text-muted-foreground">
          {[...yt].reverse().map(t => <span key={t}>{formatY(t)}</span>)}
        </div>
        <div data-slot="chart-plot" role="group" aria-label={`${label}. Use the left and right arrow keys to read the points.`} className={cn(plotClass, 'h-[216px] min-w-0 flex-1')} {...plotProps}>
          {yt.map((t, i) => <span key={t} className={cn('absolute inset-x-0 h-px', i === 0 ? 'bg-input' : 'bg-border')} style={{ top: y(t) }} />)}
          {all.map((p, i) => (
            <span
              key={i}
              data-slot="chart-dot"
              className={cn('absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full', active === i && 'ring-2 ring-foreground ring-offset-1 ring-offset-background')}
              style={{ left: `${(p.x / xMax) * 100}%`, top: y(p.y), background: chartColor(p.si) }}
            />
          ))}
          {cur ? (
            <ChartTooltip
              aria-hidden="true"
              title={cur.label ?? series[cur.si]!.label}
              className="pointer-events-none absolute z-10"
              style={{ top: Math.max(0, y(cur.y) - 80), left: `calc(${(cur.x / xMax) * 100}% ${cur.x > xMax / 2 ? '- 188px' : '+ 12px'})` }}
            >
              <ChartTooltipRow series={cur.si} label={xTitle} value={formatX(cur.x)} />
              <ChartTooltipRow series={cur.si} label={yTitle} value={formatY(cur.y)} />
            </ChartTooltip>
          ) : null}
          <span aria-live="polite" className="sr-only">{cur ? `${cur.label ?? series[cur.si]!.label}: ${xTitle} ${formatX(cur.x)}, ${yTitle} ${formatY(cur.y)}` : ''}</span>
        </div>
      </div>
      <div aria-hidden="true" className="flex w-full justify-between pl-10 text-xs leading-4 whitespace-nowrap text-muted-foreground">
        {xt.map(t => <span key={t}>{formatX(t)}</span>)}
      </div>
      <div aria-hidden="true" className="flex w-full justify-between gap-4 pl-10 text-xs leading-4 whitespace-nowrap text-muted-foreground">
        <span className="min-w-px flex-1 truncate">{yTitle}</span>
        <span className="min-w-px flex-1 truncate text-right">{xTitle}</span>
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <thead><tr><th scope="col">Item</th><th scope="col">{xTitle}</th><th scope="col">{yTitle}</th></tr></thead>
        <tbody>{all.map((p, i) => <tr key={i}><th scope="row">{p.label ?? series[p.si]!.label}</th><td>{formatX(p.x)}</td><td>{formatY(p.y)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}

/* Waterfall Chart */

export interface WaterfallStep { label: string; value: number; /** A running total drawn from zero (opening, subtotal, closing). */ total?: boolean }
export interface WaterfallChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  steps: WaterfallStep[];
  formatValue?: (v: number) => string;
  legend?: boolean;
}

// Figma uses the color primitives here (the diverging arms), not the chart/N slots.
const waterfallColor = { increase: 'var(--color-blue-600, #2563eb)', decrease: 'var(--color-red-600, #dc2626)', total: 'var(--color-neutral-400, #a3a3a3)' };

function WaterfallChart({ label, steps, formatValue = defaultFormat, legend = true, className, ...props }: WaterfallChartProps) {
  let run = 0;
  const bars = steps.map(s => {
    const from = s.total ? 0 : run;
    const to = s.total ? s.value : run + s.value;
    run = to;
    const kind = s.total ? 'total' : s.value >= 0 ? 'increase' : 'decrease';
    const text = s.total ? formatValue(s.value) : `${s.value >= 0 ? '+' : '−'}${formatValue(Math.abs(s.value))}`;
    return { ...s, from, to, kind: kind as keyof typeof waterfallColor, text };
  });
  const ticks = niceTicks(Math.max(1, ...bars.map(b => Math.max(b.from, b.to))));
  const top = ticks[ticks.length - 1]!;
  const y = (v: number) => 228 - (v / top) * 200;
  const n = bars.length;
  const { active, plotProps } = useActiveSlot(n);
  const cur = active !== null ? bars[active] : null;
  return (
    <figure data-slot="chart" data-type="waterfall" aria-label={label} className={cn('m-0 flex w-full min-w-[500px] flex-col gap-2', className)} {...props}>
      <div className="relative h-[236px] w-full">
        {ticks.map((t, i) => (
          <React.Fragment key={t}>
            <span aria-hidden="true" className="absolute right-[calc(100%-48px)] -translate-y-1/2 text-xs leading-4 whitespace-nowrap text-muted-foreground" style={{ top: y(t) }}>{formatValue(t)}</span>
            <span aria-hidden="true" className={cn('absolute right-0 left-14 h-px', i === 0 ? 'bg-input' : 'bg-border')} style={{ top: y(t) }} />
          </React.Fragment>
        ))}
        <div data-slot="chart-plot" role="group" aria-label={`${label}. Use the left and right arrow keys to read the steps.`} className={cn(plotClass, 'absolute inset-y-0 right-0 left-14 flex')} {...plotProps}>
          {bars.map((b, i) => {
            const hi = Math.max(b.from, b.to), lo = Math.min(b.from, b.to);
            return (
              <div key={b.label} aria-hidden="true" className={cn('relative h-full min-w-0 flex-1', active === i && 'bg-foreground/5')}>
                <span className="absolute left-1/2 -translate-x-1/2 text-xs leading-4 whitespace-nowrap text-foreground" style={{ top: y(hi) - 20 }}>{b.text}</span>
                <span
                  data-slot="chart-bar"
                  data-kind={b.kind}
                  className={cn('absolute left-1/2 w-6 -translate-x-1/2', b.kind === 'decrease' ? 'rounded-b-[4px]' : 'rounded-t-[4px]')}
                  style={{ top: y(hi), height: Math.max(1, y(lo) - y(hi)), background: waterfallColor[b.kind] }}
                />
                {i < n - 1 ? <span data-slot="waterfall-connector" className="absolute right-[calc(-50%+12px)] left-[calc(50%+12px)] h-px bg-input" style={{ top: y(b.to) }} /> : null}
              </div>
            );
          })}
          {cur ? (
            <ChartTooltip aria-hidden="true" title={cur.label} className="pointer-events-none absolute z-10" style={{ top: 8, left: tipLeft(active!, n) }}>
              <ChartTooltipRow label={cur.kind === 'total' ? 'Total' : cur.kind === 'increase' ? 'Increase' : 'Decrease'} value={cur.text} />
              {cur.kind !== 'total' ? <ChartTooltipRow label="Running total" value={formatValue(cur.to)} /> : null}
            </ChartTooltip>
          ) : null}
          <span aria-live="polite" className="sr-only">{cur ? `${cur.label}: ${cur.text}${cur.kind !== 'total' ? `, running total ${formatValue(cur.to)}` : ''}` : ''}</span>
        </div>
      </div>
      <div aria-hidden="true" className="flex w-full pl-14 text-center text-xs leading-4 text-muted-foreground">
        {bars.map(b => <span key={b.label} className="min-w-0 flex-1 truncate">{b.label}</span>)}
      </div>
      {legend ? (
        <ChartLegend>
          <ChartLegendItem label="Increase" color={waterfallColor.increase} />
          <ChartLegendItem label="Decrease" color={waterfallColor.decrease} />
          <ChartLegendItem label="Total" color={waterfallColor.total} />
        </ChartLegend>
      ) : null}
      <table className="sr-only">
        <caption>{label}</caption>
        <thead><tr><th scope="col">Step</th><th scope="col">Change</th><th scope="col">Running total</th></tr></thead>
        <tbody>{bars.map(b => <tr key={b.label}><th scope="row">{b.label}</th><td>{b.text}</td><td>{formatValue(b.to)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}

/* Combo Chart */

export interface ComboChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  data: { label: string; bar: number; line: number }[];
  barLabel: string;
  lineLabel: string;
  formatBar?: (v: number) => string;
  formatLine?: (v: number) => string;
  /** Room above the bars so the line stays clear of them (left max = largest bar × headroom). */
  headroom?: number;
}

function ComboChart({ label, data, barLabel, lineLabel, formatBar = defaultFormat, formatLine = v => `${v}%`, headroom = 1.3, className, ...props }: ComboChartProps) {
  const lt = niceTicks(Math.max(1, ...data.map(d => d.bar)) * headroom);
  const rt = niceTicks(Math.max(1, ...data.map(d => d.line)));
  const lMax = lt[lt.length - 1]!, rMax = rt[rt.length - 1]!;
  const yl = (v: number) => 208 - (v / lMax) * 200;
  const yr = (v: number) => 208 - (v / rMax) * 200;
  const n = data.length;
  const xs = data.map((_, i) => ((i + 0.5) / n) * 100);
  const { active, plotProps } = useActiveSlot(n);
  const cur = active !== null ? data[active] : null;
  const end = data[n - 1];
  return (
    <figure data-slot="chart" data-type="combo" aria-label={label} className={cn('m-0 flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      <div className="flex h-[216px] w-full gap-2">
        <div aria-hidden="true" className="flex w-8 shrink-0 flex-col items-end justify-between text-xs leading-4 whitespace-nowrap text-muted-foreground">
          {[...lt].reverse().map(t => <span key={t}>{formatBar(t)}</span>)}
        </div>
        <div data-slot="chart-plot" role="group" aria-label={`${label}. Use the left and right arrow keys to read the values.`} className={cn(plotClass, 'h-full min-w-0 flex-1')} {...plotProps}>
          {lt.map((t, i) => <span key={t} className={cn('absolute inset-x-0 h-px', i === 0 ? 'bg-input' : 'bg-border')} style={{ top: yl(t) }} />)}
          <div className="absolute inset-0 flex">
            {data.map((d, i) => (
              <div key={d.label} className={cn('relative h-full flex-1', active === i && 'bg-foreground/5')}>
                <span data-slot="chart-bar" className="absolute left-1/2 w-6 -translate-x-1/2 rounded-t-[4px]" style={{ top: yl(d.bar), bottom: 8, background: chartColor(0) }} />
              </div>
            ))}
          </div>
          <svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 216" preserveAspectRatio="none">
            <polyline data-slot="chart-line" points={data.map((d, i) => `${xs[i]},${yr(d.line)}`).join(' ')} fill="none" stroke={chartColor(1)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {end ? (
            <>
              <span data-slot="chart-dot" className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background" style={{ left: `${xs[n - 1]}%`, top: yr(end.line), background: chartColor(1) }} />
              <span aria-hidden="true" className="absolute -translate-x-1/2 text-xs leading-4 whitespace-nowrap text-foreground" style={{ left: `${xs[n - 1]}%`, top: yr(end.line) - 22 }}>{formatLine(end.line)}</span>
            </>
          ) : null}
          {cur ? (
            <ChartTooltip aria-hidden="true" title={cur.label} className="pointer-events-none absolute z-10" style={{ top: 8, left: tipLeft(active!, n) }}>
              <ChartTooltipRow series={0} label={barLabel} value={formatBar(cur.bar)} />
              <ChartTooltipRow series={1} label={lineLabel} value={formatLine(cur.line)} />
            </ChartTooltip>
          ) : null}
          <span aria-live="polite" className="sr-only">{cur ? `${cur.label}: ${barLabel} ${formatBar(cur.bar)}, ${lineLabel} ${formatLine(cur.line)}` : ''}</span>
        </div>
        <div aria-hidden="true" className="flex w-10 shrink-0 flex-col items-start justify-between text-xs leading-4 whitespace-nowrap text-muted-foreground">
          {[...rt].reverse().map(t => <span key={t}>{formatLine(t)}</span>)}
        </div>
      </div>
      <div aria-hidden="true" className="flex w-full pr-12 pl-10 text-center text-xs leading-4 text-muted-foreground">
        {data.map(d => <span key={d.label} className="min-w-0 flex-1 truncate">{d.label}</span>)}
      </div>
      <ChartLegend>
        <ChartLegendItem series={0} label={`${barLabel} (left axis)`} />
        <ChartLegendItem series={1} keyType="line" label={`${lineLabel} (right axis)`} />
      </ChartLegend>
      <table className="sr-only">
        <caption>{label}</caption>
        <thead><tr><td /><th scope="col">{barLabel}</th><th scope="col">{lineLabel}</th></tr></thead>
        <tbody>{data.map(d => <tr key={d.label}><th scope="row">{d.label}</th><td>{formatBar(d.bar)}</td><td>{formatLine(d.line)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}

export { ComboChart, FunnelChart, Heatmap, ScatterChart, Treemap, WaterfallChart, squarify };
