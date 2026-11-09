// EGG UI Chart page, third set: Bullet Chart (453:5875), Radar Chart (453:5888), Radial Chart
// (1101:9027, single / concentric), Box Plot (1101:9028), Dashboard Widget (451:7879).
// Same rules as charts.tsx: chart/N colors, ui/caption muted labels, border gridlines, input baseline,
// figure named by its label, drawings hidden from screen readers with the numbers in text or in a
// visually hidden table. Plots with values per slot are focusable: Left / Right show the tooltip.
import * as React from 'react';
import { Ellipsis, GripVertical, Maximize, RefreshCw } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { ChartLegend, ChartLegendItem, ChartTooltip, ChartTooltipRow, chartColor, defaultFormat, niceTicks } from './charts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';

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

/* Bullet Chart */

export interface BulletChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  title: string;
  /** Unit or period under the title: "EUR, this quarter". */
  unit?: string;
  value: number;
  target: number;
  /** Upper bounds of the bands, low to high (poor, fair, good). */
  ranges: number[];
  /** Names of the bands, read after the value. */
  rangeLabels?: string[];
  /** End of the scale; use the same max for stacked bullets. Defaults to a round number above every value. */
  max?: number;
  formatValue?: (v: number) => string;
}

// Figma: the low band is the darkest; bands are drawn widest first so they stack.
const bandOpacity = [0.28, 0.18, 0.1];

function BulletChart({ title, unit, value, target, ranges, rangeLabels = ['Poor', 'Fair', 'Good'], max, formatValue = defaultFormat, className, ...props }: BulletChartProps) {
  const top = max ?? niceTicks(Math.max(value, target, ...ranges))[4]!;
  const pct = (v: number) => `${Math.min(100, Math.max(0, (v / top) * 100))}%`;
  const band = ranges.findIndex(r => value <= r);
  const bandName = rangeLabels[band === -1 ? ranges.length - 1 : band];
  return (
    <figure data-slot="chart" data-type="bullet" aria-label={title} className={cn('m-0 flex w-full min-w-0 flex-wrap items-center gap-x-4 gap-y-2', className)} {...props}>
      <figcaption className="flex w-[140px] shrink-0 flex-col gap-0.5 whitespace-nowrap">
        <span className="truncate text-sm leading-5 font-medium text-foreground">{title}</span>
        {unit ? <span className="truncate text-xs leading-4 text-muted-foreground">{unit}</span> : null}
      </figcaption>
      <div aria-hidden="true" data-slot="bullet-track" className="relative h-6 min-w-40 flex-1 overflow-hidden">
        {[...ranges].map((r, i) => ({ r, i })).reverse().map(({ r, i }) => (
          <span key={i} data-slot="bullet-band" className="absolute inset-y-0 left-0 bg-muted-foreground" style={{ width: pct(r), opacity: bandOpacity[i] ?? 0.1 }} />
        ))}
        <span data-slot="bullet-value" className="absolute top-1/2 left-0 h-2 -translate-y-1/2" style={{ width: pct(value), background: chartColor(0) }} />
        <span data-slot="bullet-target" className="absolute top-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-foreground" style={{ left: pct(target) }} />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 whitespace-nowrap">
        <span className="max-w-[120px] truncate text-sm leading-5 font-medium text-foreground">{formatValue(value)}</span>
        <span className="max-w-[120px] truncate text-xs leading-4 text-muted-foreground">target {formatValue(target)}</span>
        {bandName ? <span className="sr-only">, {bandName}</span> : null}
      </div>
    </figure>
  );
}

/* Radar Chart */

export interface RadarChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  /** 5 to 8 qualities, one per axis, clockwise from the top. */
  axes: string[];
  /** 1 to 3 items; values[i] belongs to axes[i]. */
  series: { label: string; values: number[] }[];
  /** Same scale on every axis. Default 100. */
  max?: number;
  formatValue?: (v: number) => string;
  /** Show a Chart Legend under the drawing. Default: when there are two or more series. */
  legend?: boolean;
}

const RW = 360, RH = 320, CX = 180, CY = 165, RR = 110;

function RadarChart({ label, axes, series, max = 100, formatValue = v => String(v), legend, className, ...props }: RadarChartProps) {
  const n = axes.length;
  const ang = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const at = (i: number, r: number) => [CX + Math.cos(ang(i)) * r, CY + Math.sin(ang(i)) * r] as const;
  const ring = (f: number) => axes.map((_, i) => at(i, RR * f).join(',')).join(' ');
  const { active, plotProps } = useActiveSlot(n);
  const showLegend = legend ?? series.length > 1;
  return (
    <figure data-slot="chart" data-type="radar" aria-label={label} className={cn('m-0 flex w-full min-w-[288px] flex-col items-center gap-2', className)} {...props}>
      <div data-slot="chart-plot" role="group" aria-label={`${label}. Use the left and right arrow keys to read the axes.`} className={cn(plotClass, 'w-full max-w-[360px]')} {...plotProps}>
        <svg aria-hidden="true" viewBox={`0 0 ${RW} ${RH}`} className="block h-auto w-full overflow-visible">
          {[0.25, 0.5, 0.75, 1].map(f => <polygon key={f} data-slot="radar-grid" points={ring(f)} fill="none" stroke="var(--border)" strokeWidth={1} />)}
          {axes.map((a, i) => {
            const [x, y] = at(i, RR);
            return <line key={a} x1={CX} y1={CY} x2={x} y2={y} stroke={active === i ? 'var(--foreground)' : 'var(--border)'} strokeWidth={1} />;
          })}
          {series.map((s, si) => {
            const pts = axes.map((_, i) => at(i, (Math.min(max, Math.max(0, s.values[i] ?? 0)) / max) * RR).join(',')).join(' ');
            return (
              <g key={s.label} data-slot="radar-series">
                <polygon points={pts} fill={chartColor(si)} fillOpacity={0.2} stroke="none" />
                <polygon data-slot="chart-line" points={pts} fill="none" stroke={chartColor(si)} strokeWidth={2} strokeLinejoin="round" />
              </g>
            );
          })}
          {active !== null ? series.map((s, si) => {
            const [x, y] = at(active, (Math.min(max, s.values[active] ?? 0) / max) * RR);
            return <circle key={s.label} data-slot="chart-dot" cx={x} cy={y} r={4} fill={chartColor(si)} stroke="var(--background)" strokeWidth={2} />;
          }) : null}
          {axes.map((a, i) => {
            const [x, y] = at(i, RR + 18);
            const c = Math.cos(ang(i));
            return (
              <text key={a} x={x} y={y} dominantBaseline="middle" textAnchor={c > 0.1 ? 'start' : c < -0.1 ? 'end' : 'middle'} fontSize={12} fill={active === i ? 'var(--foreground)' : 'var(--muted-foreground)'}>
                {a}
              </text>
            );
          })}
        </svg>
        {active !== null ? (
          <div className="relative">
            <ChartTooltip aria-hidden="true" title={axes[active]} className="pointer-events-none absolute z-10 -translate-x-1/2" style={{ bottom: 8, left: '50%' }}>
              {series.map((s, si) => <ChartTooltipRow key={s.label} series={si} label={s.label} value={formatValue(s.values[active] ?? 0)} />)}
            </ChartTooltip>
          </div>
        ) : null}
        <span aria-live="polite" className="sr-only">{active !== null ? `${axes[active]}: ${series.map(s => `${s.label} ${formatValue(s.values[active] ?? 0)}`).join(', ')}` : ''}</span>
      </div>
      {showLegend ? <ChartLegend className="justify-center">{series.map((s, si) => <ChartLegendItem key={s.label} series={si} label={s.label} />)}</ChartLegend> : null}
      <table className="sr-only">
        <caption>{label}, out of {formatValue(max)}</caption>
        <thead><tr><td />{series.map(s => <th key={s.label} scope="col">{s.label}</th>)}</tr></thead>
        <tbody>{axes.map((a, i) => <tr key={a}><th scope="row">{a}</th>{series.map(s => <td key={s.label}>{formatValue(s.values[i] ?? 0)}</td>)}</tr>)}</tbody>
      </table>
    </figure>
  );
}

/* Radial Chart */

export interface RadialChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  /** One ring (single) or up to 3 (concentric, outside in: chart/1, chart/2, chart/3). Values are percent, 0 to 100. */
  rings: { label: string; value: number }[];
  /** Center value. Default: the first ring in percent. */
  value?: string;
  /** Center caption ("of goal"); Figma Show label. */
  caption?: string;
}

const RS = 200;

/** Arc from 12 o'clock, clockwise, for share 0..1. */
function arcPath(r: number, share: number) {
  const s = Math.min(0.9999, Math.max(0, share));
  const a = -Math.PI / 2 + s * Math.PI * 2;
  const x = RS / 2 + Math.cos(a) * r, y = RS / 2 + Math.sin(a) * r;
  return `M ${RS / 2} ${RS / 2 - r} A ${r} ${r} 0 ${s > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
}

function RadialChart({ label, rings, value, caption, className, ...props }: RadialChartProps) {
  const concentric = rings.length > 1;
  const stroke = concentric ? 16 : 20;
  const list = rings.slice(0, 3);
  return (
    <figure data-slot="chart" data-type={concentric ? 'concentric' : 'single'} aria-label={label} className={cn('relative m-0 size-[200px] shrink-0', className)} {...props}>
      <svg aria-hidden="true" viewBox={`0 0 ${RS} ${RS}`} className="block size-full">
        {list.map((r, i) => {
          const radius = RS / 2 - stroke / 2 - i * 24;
          return (
            <g key={r.label}>
              <circle data-slot="radial-track" cx={RS / 2} cy={RS / 2} r={radius} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
              {r.value > 0 ? <path data-slot="radial-value" d={arcPath(radius, r.value / 100)} fill="none" stroke={chartColor(i)} strokeWidth={stroke} /> : null}
            </g>
          );
        })}
      </svg>
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center whitespace-nowrap">
        <span className={cn('font-semibold tracking-[-0.4px] text-foreground', concentric ? 'text-xl leading-7' : 'text-3xl leading-9')}>{value ?? `${Math.round(list[0]?.value ?? 0)}%`}</span>
        {caption ? <span className="text-xs leading-4 text-muted-foreground">{caption}</span> : null}
      </div>
      <ul className="sr-only">
        {list.map(r => <li key={r.label}>{r.label}: {Math.round(r.value)}%{caption ? ` ${caption}` : ''}</li>)}
      </ul>
    </figure>
  );
}

/* Box Plot */

export interface BoxGroup { label: string; min: number; q1: number; median: number; q3: number; max: number; outliers?: number[] }
export interface BoxPlotProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  /** Up to 8 groups; build them from raw values with `boxStats`. */
  groups: BoxGroup[];
  formatValue?: (v: number) => string;
  /** Y ticks from 0; defaults to round ticks above the highest value. */
  ticks?: number[];
  /** Figma Show outliers. Default true. */
  showOutliers?: boolean;
}

/** Quartiles (linear), whiskers to the furthest values within 1.5 × the box, the rest as outliers. */
function boxStats(label: string, values: number[]): BoxGroup {
  const v = [...values].sort((a, b) => a - b);
  const q = (p: number) => {
    const pos = (v.length - 1) * p, lo = Math.floor(pos), hi = Math.ceil(pos);
    return v[lo]! + (v[hi]! - v[lo]!) * (pos - lo);
  };
  const q1 = q(0.25), q3 = q(0.75), fence = 1.5 * (q3 - q1);
  const inside = v.filter(x => x >= q1 - fence && x <= q3 + fence);
  return { label, q1, median: q(0.5), q3, min: inside[0] ?? q1, max: inside[inside.length - 1] ?? q3, outliers: v.filter(x => x < q1 - fence || x > q3 + fence) };
}

function BoxPlot({ label, groups, formatValue = defaultFormat, ticks, showOutliers = true, className, ...props }: BoxPlotProps) {
  const yt = ticks ?? niceTicks(Math.max(1, ...groups.flatMap(g => [g.max, ...(g.outliers ?? [])])));
  const top = yt[yt.length - 1]!;
  const y = (v: number) => 208 - (v / top) * 200;
  const n = groups.length;
  const { active, plotProps } = useActiveSlot(n);
  const cur = active !== null ? groups[active] : null;
  return (
    <figure data-slot="chart" data-type="box-plot" aria-label={label} className={cn('m-0 flex w-full min-w-[320px] flex-col gap-2', className)} {...props}>
      <div className="flex w-full gap-2">
        <div aria-hidden="true" className="relative h-[216px] w-8 shrink-0 text-xs leading-4 whitespace-nowrap text-muted-foreground">
          {yt.map(t => <span key={t} className="absolute right-0" style={{ top: y(t) - 8 }}>{formatValue(t)}</span>)}
        </div>
        <div data-slot="chart-plot" role="group" aria-label={`${label}. Use the left and right arrow keys to read the groups.`} className={cn(plotClass, 'h-[216px] min-w-0 flex-1')} {...plotProps}>
          {yt.map((t, i) => <span key={t} aria-hidden="true" className={cn('absolute inset-x-0 h-px', i === 0 ? 'bg-input' : 'bg-border')} style={{ top: y(t) }} />)}
          <div aria-hidden="true" className="absolute inset-0 flex">
            {groups.map((g, i) => (
              <div key={g.label} className={cn('relative h-full min-w-0 flex-1', active === i && 'bg-foreground/5')}>
                <div data-slot="box-group" className="absolute inset-y-0 left-[30.75%] w-[38.5%]">
                  <span className="absolute left-1/2 w-px -translate-x-1/2" style={{ top: y(g.max), height: y(g.min) - y(g.max), background: chartColor(0) }} />
                  <span className="absolute inset-x-[30%] h-px" style={{ top: y(g.max), background: chartColor(0) }} />
                  <span className="absolute inset-x-[30%] h-px" style={{ top: y(g.min), background: chartColor(0) }} />
                  <span data-slot="box" className="absolute inset-x-0 border bg-[var(--badge-category-1-bg)]" style={{ top: y(g.q3), height: Math.max(2, y(g.q1) - y(g.q3)), borderColor: chartColor(0) }} />
                  <span data-slot="box-median" className="absolute inset-x-0 h-0.5 -translate-y-1/2" style={{ top: y(g.median), background: chartColor(0) }} />
                  {showOutliers ? (g.outliers ?? []).map((o, oi) => (
                    <span key={oi} data-slot="box-outlier" className="absolute left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background" style={{ top: y(o), borderColor: chartColor(0) }} />
                  )) : null}
                </div>
              </div>
            ))}
          </div>
          {cur ? (
            <ChartTooltip aria-hidden="true" title={cur.label} className="pointer-events-none absolute z-10" style={{ top: 8, left: `calc(${((active! + 0.5) / n) * 100}% ${active! > n / 2 ? '- 184px' : '+ 24px'})` }}>
              <ChartTooltipRow label="Highest" value={formatValue(cur.max)} />
              <ChartTooltipRow label="Upper quartile" value={formatValue(cur.q3)} />
              <ChartTooltipRow label="Median" value={formatValue(cur.median)} />
              <ChartTooltipRow label="Lower quartile" value={formatValue(cur.q1)} />
              <ChartTooltipRow label="Lowest" value={formatValue(cur.min)} />
              {cur.outliers?.length ? <ChartTooltipRow label="Outliers" value={cur.outliers.map(formatValue).join(', ')} /> : null}
            </ChartTooltip>
          ) : null}
          <span aria-live="polite" className="sr-only">
            {cur ? `${cur.label}: median ${formatValue(cur.median)}, quartiles ${formatValue(cur.q1)} to ${formatValue(cur.q3)}, range ${formatValue(cur.min)} to ${formatValue(cur.max)}${cur.outliers?.length ? `, outliers ${cur.outliers.map(formatValue).join(', ')}` : ''}` : ''}
          </span>
        </div>
      </div>
      <div aria-hidden="true" className="flex w-full pl-10 text-center text-xs leading-4 text-muted-foreground">
        {groups.map(g => <span key={g.label} className="min-w-0 flex-1 truncate">{g.label}</span>)}
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <thead><tr><th scope="col">Group</th><th scope="col">Lowest</th><th scope="col">Lower quartile</th><th scope="col">Median</th><th scope="col">Upper quartile</th><th scope="col">Highest</th><th scope="col">Outliers</th></tr></thead>
        <tbody>{groups.map(g => <tr key={g.label}><th scope="row">{g.label}</th><td>{formatValue(g.min)}</td><td>{formatValue(g.q1)}</td><td>{formatValue(g.median)}</td><td>{formatValue(g.q3)}</td><td>{formatValue(g.max)}</td><td>{(g.outliers ?? []).map(formatValue).join(', ')}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}

/* Dashboard Widget */

export interface DashboardWidgetProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title: string;
  /** Period under the title: "Last 30 days". */
  period?: string;
  /** Footer text: "Updated 5 min ago"; Figma Show footer when given. */
  updated?: React.ReactNode;
  /** Edit mode shows the drag handle. Default true, as in Figma. */
  editing?: boolean;
  /** Props for the drag handle (listeners and attributes from the dashboard's drag library). */
  handleProps?: React.ComponentProps<'span'>;
  onRefresh?: () => void;
  /** Refresh is running: the refresh button shows a spinner. */
  refreshing?: boolean;
  onExpand?: () => void;
  /** Dropdown Menu items for the More button. */
  menu?: React.ReactNode;
}

function DashboardWidget({ title, period, updated, editing = true, handleProps, onRefresh, refreshing = false, onExpand, menu, className, children, ...props }: DashboardWidgetProps) {
  const id = React.useId();
  return (
    <section data-slot="dashboard-widget" aria-labelledby={id} className={cn('flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground', className)} {...props}>
      <div className="flex w-full items-center gap-2 px-4 py-3">
        {editing ? (
          <span data-slot="widget-handle" className="flex shrink-0 cursor-grab text-muted-foreground [&_svg]:size-3.5" {...handleProps}>
            <GripVertical aria-hidden="true" />
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 id={id} className="m-0 truncate text-sm leading-5 font-medium">{title}</h3>
          {period ? <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{period}</p> : null}
        </div>
        {onRefresh ? <ButtonIcon variant="ghost" size="sm" icon={<RefreshCw aria-hidden="true" />} label={`Refresh ${title}`} loadingLabel="Refreshing" loading={refreshing} onClick={onRefresh} /> : null}
        {onExpand ? <ButtonIcon variant="ghost" size="sm" icon={<Maximize aria-hidden="true" />} label={`Expand ${title}`} onClick={onExpand} /> : null}
        {menu ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${title}`}><Ellipsis aria-hidden="true" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      <div data-slot="widget-content" className="flex w-full flex-col gap-2 p-4">{children}</div>
      {updated ? <p className="m-0 w-full border-t border-border px-4 py-2 text-xs leading-4 text-muted-foreground">{updated}</p> : null}
    </section>
  );
}

export { BoxPlot, BulletChart, DashboardWidget, RadarChart, RadialChart, boxStats };
