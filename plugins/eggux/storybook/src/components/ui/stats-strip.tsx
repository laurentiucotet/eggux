// EGG UI Stats Strip. Code only (no Figma component yet); family Marketing.
// Three or four big numbers with a label under each and one source line. Numbers carry thousands
// separators (12,400) and an optional prefix and suffix (€, %, +). Count-up is off by default; when
// it is on the number counts from 0 once, and never under prefers-reduced-motion. Stat Card is a
// dashboard tile with a trend; this is the marketing strip for a landing page.
// A11y: a description list (label = term, number = value) in a labelled region; while counting, the
// animated number is hidden from assistive technology and the final value is read instead, so
// nothing is announced mid-count. The source line is a plain paragraph. Columns reflow through
// auto-fit; numbers never wrap or overflow at 276 px.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StatsStripItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  /** Decimal places. Default 0. */
  decimals?: number;
}

export interface StatsStripProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Region name, read by screen readers. */
  label?: string;
  /** Three or four stats; more are cut. */
  stats: StatsStripItem[];
  /** "Source: Acme customer survey, 2026". */
  source?: string;
  /** Count from 0 once on mount. Off by default; ignored with reduced motion. */
  countUp?: boolean;
  /** Count-up length in ms. */
  duration?: number;
}

function format(value: number, decimals: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}

function useCountUp(target: number, enabled: boolean, duration: number) {
  const [current, setCurrent] = React.useState(enabled ? 0 : target);
  React.useEffect(() => {
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enabled || reduced) {
      setCurrent(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCurrent(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, duration]);
  return current;
}

function Stat({ stat, countUp, duration }: { stat: StatsStripItem; countUp: boolean; duration: number }) {
  const decimals = stat.decimals ?? 0;
  const current = useCountUp(stat.value, countUp, duration);
  const final = `${stat.prefix ?? ''}${format(stat.value, decimals)}${stat.suffix ?? ''}`;
  return (
    <div data-slot="stats-strip-item" className="flex min-w-0 flex-col-reverse justify-end gap-1 border-t border-border pt-4">
      <dt className="text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">{stat.label}</dt>
      <dd className="m-0 min-w-0 text-4xl leading-10 font-semibold tracking-tight text-foreground tabular-nums">
        <span aria-hidden={countUp ? 'true' : undefined} className="block truncate">
          {stat.prefix}{format(current, decimals)}{stat.suffix}
        </span>
        {countUp ? <span className="sr-only">{final}</span> : null}
      </dd>
    </div>
  );
}

function StatsStrip({ label = 'Acme in numbers', stats, source, countUp = false, duration = 1200, className, ...props }: StatsStripProps) {
  return (
    <section data-slot="stats-strip" aria-label={label} className={cn('flex w-full min-w-0 flex-col gap-6', className)} {...props}>
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-x-8 gap-y-6">
        {stats.slice(0, 4).map(s => <Stat key={s.label} stat={s} countUp={countUp} duration={duration} />)}
      </dl>
      {source ? <p data-slot="stats-strip-source" className="m-0 text-xs leading-4 text-muted-foreground [overflow-wrap:anywhere]">{source}</p> : null}
    </section>
  );
}

export { StatsStrip };
