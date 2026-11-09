// EGG UI Chart page: Sankey Chart (453:5907) and Choropleth Map (453:5923). Drawn from data with
// HTML and SVG, no library, like the other charts.
// - Sankey Chart: two columns of nodes (12 wide, radius sm) joined by bands whose width is the
//   amount, colored by source at 30%. Every node is labelled with its share. The plot is focusable:
//   Left / Right move through the bands and show the Chart Tooltip; a hidden table lists the flows.
// - Choropleth Map: equal tiles per region shaded in chart/1 from light (low) to dark (high), with
//   a Low-High legend of 5 steps. Tile labels switch to light text only on the darkest shade, where
//   it keeps 4.5:1. Hover shows the name and value; the values are also in the list for screen readers.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChartTooltip, ChartTooltipRow, chartColor, defaultFormat } from './charts';

/* Sankey Chart */

export interface SankeyNode {
  id: string;
  label: string;
  /** 0 = sources (left), 1 = outcomes (right). */
  column: 0 | 1;
  /** Node color; default chart/N in source order, foreground for outcomes. */
  color?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyChartProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  nodes: SankeyNode[];
  links: SankeyLink[];
  formatValue?: (v: number) => string;
  /** Plot height (280 in Figma). */
  height?: number;
}

const PAD = 20;
const GAP = 12;
const NODE_W = 12;
const LEFT = 140;
const RIGHT = 128;

function SankeyChart({ label, nodes, links, formatValue = defaultFormat, height = 280, className, ...props }: SankeyChartProps) {
  const total = links.reduce((a, l) => a + l.value, 0) || 1;
  const cols = [nodes.filter((n) => n.column === 0), nodes.filter((n) => n.column === 1)];
  const value = (id: string) => links.filter((l) => l.source === id || l.target === id).reduce((a, l) => a + l.value, 0);
  const color = (n: SankeyNode) => n.color ?? (n.column === 0 ? chartColor(cols[0].indexOf(n)) : 'var(--foreground)');
  const pct = (v: number) => `${Math.round((v / total) * 100)}%`;

  // One scale for both columns (set by the column with more nodes and 12 gaps); the other column
  // spreads its spare height over its gaps, so both span the same height.
  const inner = height - PAD * 2;
  const most = Math.max(cols[0].length, cols[1].length);
  const scale = (inner - GAP * Math.max(0, most - 1)) / total;
  const scaleR = scale;
  const pos: Record<string, { top: number; h: number }> = {};
  for (const col of cols) {
    const gap = col.length > 1 ? (inner - total * scale) / (col.length - 1) : 0;
    let top = PAD;
    for (const n of col) {
      const h = value(n.id) * scale;
      pos[n.id] = { top, h };
      top += h + gap;
    }
  }
  // Band ends: out-flows stack in target order inside the source, in-flows in source order inside the target.
  const outOff: Record<string, number> = {};
  const inOff: Record<string, number> = {};
  const order = (id: string) => nodes.findIndex((n) => n.id === id);
  const sorted = [...links].sort((a, b) => order(a.source) - order(b.source) || order(a.target) - order(b.target));
  const bands = sorted.map((l) => {
    const s = pos[l.source]!;
    const t = pos[l.target]!;
    const y0 = s.top + (outOff[l.source] ?? 0);
    const y1 = t.top + (inOff[l.target] ?? 0);
    const h0 = l.value * scale;
    const h1 = l.value * scaleR;
    outOff[l.source] = (outOff[l.source] ?? 0) + h0;
    inOff[l.target] = (inOff[l.target] ?? 0) + h1;
    const src = nodes.find((n) => n.id === l.source)!;
    // x runs 0..100 between the two node columns (the SVG stretches horizontally).
    const d = `M0 ${y0} C50 ${y0} 50 ${y1} 100 ${y1} L100 ${y1 + h1} C50 ${y1 + h1} 50 ${y0 + h0} 0 ${y0 + h0} Z`;
    return { l, d, fill: color(src) };
  });
  const [active, setActive] = React.useState<number | null>(null);
  const tip = active !== null ? bands[active] : null;
  const name = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;

  return (
    <figure data-slot="chart" data-type="sankey" aria-label={label} className={cn('m-0 w-160 max-w-full min-w-60', className)} {...props}>
      <div
        data-slot="chart-plot"
        role="group"
        tabIndex={0}
        aria-label={`${label}. Use the left and right arrow keys to read the flows.`}
        className="relative w-full rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        style={{ height }}
        onMouseLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            setActive((a) => (a === null ? 0 : Math.min(bands.length - 1, a + 1)));
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setActive((a) => (a === null ? bands.length - 1 : Math.max(0, a - 1)));
          } else if (e.key === 'Escape') setActive(null);
        }}
      >
        <svg aria-hidden="true" className="absolute inset-y-0 overflow-visible" style={{ left: LEFT + NODE_W, right: RIGHT + NODE_W, width: `calc(100% - ${LEFT + RIGHT + NODE_W * 2}px)`, height }} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
          {bands.map((b, i) => (
            <path
              key={`${b.l.source}-${b.l.target}`}
              data-slot="sankey-band"
              d={b.d}
              fill={b.fill}
              fillOpacity={active === i ? 0.5 : 0.3}
              onMouseEnter={() => setActive(i)}
            />
          ))}
        </svg>
        {nodes.map((n) => {
          const p = pos[n.id]!;
          const left = n.column === 0;
          return (
            <React.Fragment key={n.id}>
              <span aria-hidden="true" data-slot="sankey-node" className="absolute w-3 rounded-sm" style={{ top: p.top, height: p.h, background: color(n), ...(left ? { left: LEFT } : { right: RIGHT }) }} />
              <span
                aria-hidden="true"
                className={cn('absolute flex -translate-y-1/2 items-center text-xs leading-4 text-foreground', left ? 'justify-end text-right' : 'text-left')}
                style={{ top: p.top + p.h / 2, ...(left ? { right: `calc(100% - ${LEFT - 8}px)`, maxWidth: LEFT - 8 } : { left: `calc(100% - ${RIGHT - 8}px)`, maxWidth: RIGHT - 8 }) }}
              >
                <span>
                  {n.label}&nbsp; {pct(value(n.id))}
                </span>
              </span>
            </React.Fragment>
          );
        })}
        {tip ? (
          <ChartTooltip title={`${name(tip.l.source)} → ${name(tip.l.target)}`} aria-hidden="true" className="pointer-events-none absolute top-2 left-1/2 z-10 -translate-x-1/2">
            <ChartTooltipRow color={tip.fill} label="Amount" value={`${formatValue(tip.l.value)} (${pct(tip.l.value)})`} />
          </ChartTooltip>
        ) : null}
        <span aria-live="polite" className="sr-only">
          {tip ? `${name(tip.l.source)} to ${name(tip.l.target)}: ${formatValue(tip.l.value)}, ${pct(tip.l.value)}` : ''}
        </span>
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((l) => (
            <tr key={`${l.source}-${l.target}`}>
              <td>{name(l.source)}</td>
              <td>{name(l.target)}</td>
              <td>
                {formatValue(l.value)} ({pct(l.value)})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/* Choropleth Map */

export interface ChoroplethRegion {
  id: string;
  /** Short tile label ("NW"). */
  label: string;
  /** Full name for the tooltip and screen readers ("North-West"). */
  name?: string;
  value: number;
  /** Tile column (0, 1, 2... half steps offset a row) and row. */
  x: number;
  y: number;
}

export interface ChoroplethMapProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  label: string;
  regions: ChoroplethRegion[];
  formatValue?: (v: number) => string;
  lowLabel?: string;
  highLabel?: string;
}

// Figma tiles: 88 × 64 on a 92 × 68 grid inside a 480 × 300 map, 40 in from the left, 8 from the top.
const MAP_W = 480;

function ChoroplethMap({ label, regions, formatValue = defaultFormat, lowLabel = 'Low', highLabel = 'High', className, ...props }: ChoroplethMapProps) {
  const min = Math.min(...regions.map((r) => r.value));
  const max = Math.max(...regions.map((r) => r.value));
  const shade = (v: number) => (max === min ? 1 : 0.15 + 0.85 * ((v - min) / (max - min)));
  const [active, setActive] = React.useState<string | null>(null);
  const tip = regions.find((r) => r.id === active);
  // Label color per tile: whichever of foreground and primary-foreground has the higher contrast on
  // the shade as drawn in the current theme.
  const listRef = React.useRef<HTMLUListElement>(null);
  const [ink, setInk] = React.useState<Record<string, 'light' | 'dark' | 'pill'>>({});
  const measure = React.useCallback(() => {
    const ul = listRef.current;
    if (!ul) return;
    // Any CSS color (hex, rgb, oklch, color()) to [r, g, b, a] through a 1 px canvas.
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const rgb = (c: string) => {
      if (!ctx) return [] as number[];
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
    };
    const lum = ([r, g, b]: number[]) => {
      const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!);
    };
    const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    let el: HTMLElement | null = ul;
    let bg = [255, 255, 255];
    while (el) {
      const c = rgb(getComputedStyle(el).backgroundColor);
      if (c.length >= 3 && c[3]! > 0) { bg = c.slice(0, 3); break; }
      el = el.parentElement;
    }
    const next: Record<string, 'light' | 'dark' | 'pill'> = {};
    ul.querySelectorAll<HTMLElement>('[data-slot="choropleth-region"]').forEach((li) => {
      const shadeEl = li.firstElementChild as HTMLElement;
      const c = rgb(getComputedStyle(shadeEl).backgroundColor);
      const o = Number(getComputedStyle(shadeEl).opacity);
      const mix = [0, 1, 2].map((i) => c[i]! * o + bg[i]! * (1 - o));
      const fg = rgb(getComputedStyle(ul).color);
      const tile = lum(mix);
      const darkText = fg.length >= 3 ? ratio(tile, lum(fg)) : ratio(tile, 0);
      const lightText = ratio(tile, 1);
      // Neither text reaches 4.5:1 on a mid shade in some themes: the label then sits on a background pill.
      next[li.dataset.id!] = Math.max(lightText, darkText) < 4.5 ? 'pill' : lightText > darkText ? 'light' : 'dark';
    });
    setInk((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, []);
  React.useLayoutEffect(measure);
  // Themes switch with a class on <html>: measure again when it changes.
  React.useEffect(() => {
    const mo = new MutationObserver(measure);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    return () => mo.disconnect();
  }, [measure]);
  return (
    <figure data-slot="chart" data-type="choropleth" aria-label={label} className={cn('m-0 flex w-120 max-w-full min-w-60 flex-col gap-3', className)} {...props}>
      <ul ref={listRef} aria-label={label} className="relative m-0 h-[300px] w-full list-none overflow-clip p-0 text-foreground" onMouseLeave={() => setActive(null)}>
        {regions.map((r) => {
          const o = shade(r.value);
          const look = ink[r.id] ?? (o >= 0.9 ? 'light' : 'dark');
          return (
            <li
              key={r.id}
              data-id={r.id}
              data-slot="choropleth-region"
              className="absolute flex h-16 items-center justify-center rounded-sm"
              style={{ left: `${((40 + r.x * 92) / MAP_W) * 100}%`, width: `${(88 / MAP_W) * 100}%`, top: 8 + r.y * 68 }}
              onMouseEnter={() => setActive(r.id)}
            >
              <span aria-hidden="true" className="absolute inset-0 rounded-sm" style={{ background: chartColor(0), opacity: o }} />
              <span data-slot="choropleth-label" className={cn('relative text-xs leading-4 whitespace-nowrap', look === 'light' ? 'text-primary-foreground' : 'text-foreground', look === 'pill' && 'rounded-sm bg-background px-1')}>
                <span aria-hidden="true">{r.label}</span>
                <span className="sr-only">
                  {r.name ?? r.label}: {formatValue(r.value)}
                </span>
              </span>
            </li>
          );
        })}
        {tip ? (
          <ChartTooltip title={tip.name ?? tip.label} aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0 z-10">
            <ChartTooltipRow label="Value" value={formatValue(tip.value)} />
          </ChartTooltip>
        ) : null}
      </ul>
      <div aria-hidden="true" className="flex items-center gap-2 text-xs leading-4 text-muted-foreground">
        <span>{lowLabel}</span>
        <span className="flex gap-0.5">
          {[0.15, 0.35, 0.55, 0.75, 1].map((o) => (
            <span key={o} className="h-2 w-6" style={{ background: chartColor(0), opacity: o }} />
          ))}
        </span>
        <span>{highLabel}</span>
      </div>
    </figure>
  );
}

export { ChoroplethMap, SankeyChart };
