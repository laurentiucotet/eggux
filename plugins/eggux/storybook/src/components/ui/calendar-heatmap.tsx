// EGG UI Calendar Heatmap. Code only (no Figma component yet). A grid of day cells coloured by
// intensity (0 to 4), like a contributions graph: `view="year"` is one cell per day with weeks as
// columns and weekdays as rows (scrolls sideways in a narrow container), `view="month"` is a
// month grid with the day number in each cell. Intensity is the value relative to the largest value
// shown (override with `max`), in four steps plus none, drawn in the primary colour; a legend
// ("Less" to "More") explains it. Every day is a button named with its date and value, with the
// same text as `title` for the mouse tooltip. WAI-ARIA grid pattern: arrows move by cell (one tab
// stop), Home and End jump to the ends of the row, Enter or Space picks when `onSelect` is given.
// The component shows one year or one month; the app changes `date` to move between them.
import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  DEFAULT_LOCALE,
  addDays,
  compareDays,
  dateKey,
  daysBetweenInclusive,
  endOfWeek,
  formatMonthLong,
  formatMonthShort,
  formatShortDate,
  isSameDay,
  monthGrid,
  startOfWeek,
  weekdayLabels,
  type WeekStart,
} from './calendar-date';

export interface CalendarHeatmapProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  /** Value per day, keyed "2026-10-22". Missing days count as 0. */
  data: Record<string, number>;
  /** year: one year of small cells. month: one month with day numbers. */
  view?: 'year' | 'month';
  /** Any day of the year or month to show. Default: the day given as `now`, else today. */
  date?: Date;
  /** The day marked as today. Pass it in tests and previews; the real today when not given. */
  now?: Date;
  /** Picked day. Controlled by the app. */
  selected?: Date;
  /** Makes days pickable: called with the day. Without it the cells only report their value. */
  onSelect?: (date: Date) => void;
  /** What a value counts, plural and singular ("contributions", "contribution"). */
  unit?: string;
  unitSingular?: string;
  /** The value that gets the darkest colour. Default: the largest value in the period. */
  max?: number;
  /** Show the "Less to More" legend. Default true. */
  showLegend?: boolean;
  /** Show the total line over the grid ("142 contributions in 2026"). Default true. */
  showSummary?: boolean;
  weekStartsOn?: WeekStart;
  locale?: string;
  /** Texts translated by the app. */
  labels?: { less?: string; more?: string; total?: (total: string, unit: string, period: string) => string };
}

// Every class name in full so Tailwind can generate it. The month view keeps the day number on a
// neutral cell and draws the intensity as a bar under it, so the number always has full contrast.
const levelFill = ['bg-muted', 'bg-primary/25', 'bg-primary/50', 'bg-primary/75', 'bg-primary'] as const;

const barFill = ['bg-border', 'bg-primary/40', 'bg-primary/60', 'bg-primary/80', 'bg-primary'] as const;
const levelBar = ['w-3', 'w-4', 'w-5', 'w-6', 'w-8'] as const;

type Cell = Date | null;

function CalendarHeatmap({
  data,
  view = 'year',
  date,
  now,
  selected,
  onSelect,
  unit = 'contributions',
  unitSingular = 'contribution',
  max,
  showLegend = true,
  showSummary = true,
  weekStartsOn = 1,
  locale = DEFAULT_LOCALE,
  labels,
  className,
  ...props
}: CalendarHeatmapProps) {
  const t = { less: 'Less', more: 'More', total: (total: string, u: string, period: string) => `${total} ${u} in ${period}`, ...labels };
  const today = now ?? new Date();
  const anchor = date ?? today;
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const rangeStart = view === 'year' ? new Date(year, 0, 1) : new Date(year, month, 1);
  const rangeEnd = view === 'year' ? new Date(year, 11, 31) : new Date(year, month + 1, 0);
  const inRange = (d: Date) => compareDays(d, rangeStart) >= 0 && compareDays(d, rangeEnd) <= 0;

  // rows x columns of dates; null outside the period.
  const rows: Cell[][] = React.useMemo(() => {
    if (view === 'month') {
      return monthGrid(year, month, weekStartsOn).map(week => week.map(d => (d.getMonth() === month ? d : null)));
    }
    const start = startOfWeek(rangeStart, weekStartsOn);
    const cols = daysBetweenInclusive(start, endOfWeek(rangeEnd, weekStartsOn)) / 7;
    return Array.from({ length: 7 }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        const d = addDays(start, c * 7 + r);
        return compareDays(d, rangeStart) >= 0 && compareDays(d, rangeEnd) <= 0 ? d : null;
      }),
    );
  }, [view, year, month, weekStartsOn]); // eslint-disable-line react-hooks/exhaustive-deps

  const days = rows.flat().filter((d): d is Date => d !== null);
  const valueOf = (d: Date) => Math.max(0, data[dateKey(d)] ?? 0);
  const peak = max ?? Math.max(0, ...days.map(valueOf));
  const levelOf = (v: number) => (v <= 0 || peak <= 0 ? 0 : Math.min(4, Math.max(1, Math.ceil((v / peak) * 4))));
  const total = days.reduce((sum, d) => sum + valueOf(d), 0);
  const fmt = new Intl.NumberFormat(locale);
  const describe = (d: Date) => {
    const v = valueOf(d);
    return `${formatShortDate(d, locale)}: ${fmt.format(v)} ${v === 1 ? unitSingular : unit}`;
  };

  // The one tab stop: the picked day, else today, else the first day of the period.
  const [focusDate, setFocusDate] = React.useState<Date | null>(null);
  const tabDate = (focusDate && inRange(focusDate) ? focusDate : null) ?? (selected && inRange(selected) ? selected : null) ?? (inRange(today) ? today : rangeStart);

  const root = React.useRef<HTMLDivElement>(null);
  const focusDay = (d: Date) => {
    setFocusDate(d);
    (root.current?.querySelector(`[data-date="${dateKey(d)}"]`) as HTMLElement | null)?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent, d: Date) => {
    const across = view === 'year' ? 7 : 1; // one column to the right
    const down = view === 'year' ? 1 : 7; // one row down
    let next: Date | null = null;
    switch (e.key) {
      case 'ArrowRight': next = addDays(d, across); break;
      case 'ArrowLeft': next = addDays(d, -across); break;
      case 'ArrowDown': next = addDays(d, down); break;
      case 'ArrowUp': next = addDays(d, -down); break;
      case 'Home':
      case 'End': {
        const row = rows.find(r => r.some(c => c && isSameDay(c, d)));
        const cells = row?.filter((c): c is Date => c !== null) ?? [];
        next = (e.key === 'Home' ? cells[0] : cells[cells.length - 1]) ?? null;
        break;
      }
      default:
        return;
    }
    e.preventDefault();
    if (next && inRange(next)) focusDay(next);
  };

  const uid = React.useId();
  const period = view === 'year' ? String(year) : `${formatMonthLong(month, locale)} ${year}`;
  const weekdays = weekdayLabels(locale, weekStartsOn);

  const cellButton = (d: Date) => {
    const v = valueOf(d);
    const level = levelOf(v);
    const isSelected = !!selected && isSameDay(selected, d);
    return (
      <button
        type="button"
        data-date={dateKey(d)}
        data-level={level}
        aria-label={describe(d)}
        title={describe(d)}
        aria-current={isSameDay(d, today) ? 'date' : undefined}
        tabIndex={isSameDay(d, tabDate) ? 0 : -1}
        onClick={() => onSelect?.(d)}
        onFocus={() => setFocusDate(d)}
        onKeyDown={e => onKeyDown(e, d)}
        className={cn(
          'flex items-center justify-center outline-none transition-shadow duration-[var(--duration-fast)] focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
          view === 'year' ? cn('size-[var(--heat-cell)] rounded-[3px]', levelFill[level]) : 'h-12 w-full min-w-0 flex-col gap-1 rounded-md bg-muted text-sm leading-5 font-medium text-foreground hover:bg-accent',
          isSameDay(d, today) && 'ring-1 ring-foreground/60 ring-inset',
          isSelected && 'ring-2 ring-foreground ring-inset',
          onSelect ? 'cursor-pointer' : 'cursor-default',
        )}
      >
        {view === 'month' ? (
          <>
            <span aria-hidden="true">{d.getDate()}</span>
            <span aria-hidden="true" className={cn('h-1.5 rounded-full', levelBar[level], barFill[level])} />
          </>
        ) : null}
      </button>
    );
  };

  const cellWrap = (c: Cell, key: string) => (
    <div key={key} role="gridcell" aria-selected={onSelect && c ? !!selected && isSameDay(selected, c) : undefined} className={cn(view === 'year' ? 'size-[var(--heat-cell)] shrink-0' : 'min-w-0')}>
      {c ? cellButton(c) : null}
    </div>
  );

  return (
    <div ref={root} data-slot="calendar-heatmap" data-view={view} className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      {showSummary ? (
        <p id={`${uid}-summary`} className="m-0 text-sm leading-5 font-medium text-foreground">
          {t.total(fmt.format(total), total === 1 ? unitSingular : unit, period)}
        </p>
      ) : null}

      {view === 'year' ? (
        <div className="min-w-0 overflow-x-auto p-1">
          <div role="grid" aria-label={showSummary ? undefined : period} aria-labelledby={showSummary ? `${uid}-summary` : undefined} className="flex w-max flex-col gap-[var(--heat-gap)] [--heat-cell:0.875rem] [--heat-gap:0.1875rem]">
            <div aria-hidden="true" className="relative ml-[calc(2rem+var(--heat-gap))] h-4">
              {rows[0]!.map((_, c) => {
                const first = rows.map(r => r[c]).find(d => d && d.getDate() === 1);
                if (!first) return null;
                return (
                  <span key={c} style={{ '--col': c } as React.CSSProperties} className="absolute top-0 left-[calc(var(--col)*(var(--heat-cell)+var(--heat-gap)))] text-xs leading-4 text-muted-foreground">
                    {formatMonthShort(first.getMonth(), locale)}
                  </span>
                );
              })}
            </div>
            {rows.map((row, r) => (
              <div key={r} role="row" className="flex gap-[var(--heat-gap)]">
                <span role="rowheader" className={cn('w-8 shrink-0 text-xs leading-[var(--heat-cell)] text-muted-foreground', r % 2 === 1 ? '' : 'sr-only')}>
                  {r % 2 === 1 ? weekdays[r]!.short : weekdays[r]!.long}
                </span>
                {row.map((c, i) => cellWrap(c, `${r}-${i}`))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div role="grid" aria-label={showSummary ? undefined : period} aria-labelledby={showSummary ? `${uid}-summary` : undefined} className="flex min-w-0 flex-col gap-1">
          <div role="row" className="grid grid-cols-7 gap-1">
            {weekdays.map(w => (
              <div key={w.long} role="columnheader" className="min-w-0 truncate text-center text-xs leading-4 text-muted-foreground">
                <span aria-hidden="true">{w.short}</span>
                <span className="sr-only">{w.long}</span>
              </div>
            ))}
          </div>
          {rows.map((row, r) => (
            <div key={r} role="row" className="grid grid-cols-7 gap-1">
              {row.map((c, i) => cellWrap(c, `${r}-${i}`))}
            </div>
          ))}
        </div>
      )}

      {showLegend ? (
        <div data-slot="calendar-heatmap-legend" className="flex items-center justify-end gap-1.5 text-xs leading-4 text-muted-foreground">
          <span>{t.less}</span>
          <span aria-hidden="true" className="flex gap-[0.1875rem]">
            {levelFill.map(f => (
              <span key={f} className={cn('size-3.5 rounded-[3px]', f)} />
            ))}
          </span>
          <span>{t.more}</span>
        </div>
      ) : null}
    </div>
  );
}

export { CalendarHeatmap };
