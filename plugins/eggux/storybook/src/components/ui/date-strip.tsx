// EGG UI Date Strip. Code only (no Figma component yet). A horizontal row of days, each with the
// weekday and the day number: the mobile booking pattern ("pick a day this fortnight"). One day is
// selected; Left and Right move between days (one Tab stop), Home and End jump to the first and last
// day, Enter or Space picks. The two scroll buttons move the strip by about a screen, so a mouse
// user without a trackpad can reach every day; they disable at the ends. A day outside min and max,
// or in `disabledDates`, stays visible and is announced as unavailable. Today is marked with a dot
// and named "today" for screen readers. For a whole month use Calendar.
import * as React from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { DEFAULT_LOCALE, addDays, compareDays, dateKey, formatFullDate, isSameDay, startOfDay } from './calendar-date';

export interface DateStripProps extends Omit<React.ComponentProps<'div'>, 'onSelect' | 'defaultValue'> {
  /** Selected day. Controlled when given. */
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  /** First day shown. Default: the selected day, or today. */
  start?: Date;
  /** How many days the strip holds. Default 14. */
  days?: number;
  /** Days before this date or after the max date cannot be picked. */
  minDate?: Date;
  maxDate?: Date;
  /** Days that cannot be picked (fully booked). */
  disabledDates?: Date[];
  /** The day marked as today. Pass it in tests and previews; the real today when not given. */
  now?: Date;
  /** Show the month name over the first day and every 1st. Default true. */
  showMonth?: boolean;
  /** Show the previous and next scroll buttons. Default true. */
  showScrollButtons?: boolean;
  locale?: string;
  /** Accessible name of the strip. Default "Choose a day". */
  label?: string;
  /** Texts translated by the app. */
  labels?: { earlier?: string; later?: string; today?: string; unavailable?: string };
}

function DateStrip({
  value: valueProp,
  defaultValue,
  onValueChange,
  start,
  days = 14,
  minDate,
  maxDate,
  disabledDates,
  now,
  showMonth = true,
  showScrollButtons = true,
  locale = DEFAULT_LOCALE,
  label = 'Choose a day',
  labels,
  className,
  ...props
}: DateStripProps) {
  const t = { earlier: 'Show earlier days', later: 'Show later days', today: 'today', unavailable: 'unavailable', ...labels };
  const [inner, setInner] = React.useState<Date | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const today = startOfDay(now ?? new Date());
  const first = startOfDay(start ?? value ?? today);
  const list = React.useMemo(() => Array.from({ length: days }, (_, i) => addDays(first, i)), [first.getTime(), days]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDisabled = (d: Date) =>
    (minDate !== undefined && compareDays(d, minDate) < 0) ||
    (maxDate !== undefined && compareDays(d, maxDate) > 0) ||
    !!disabledDates?.some(x => isSameDay(x, d));

  // The one tab stop: the selected day, else the first day that can be picked.
  const selectedIndex = list.findIndex(d => isSameDay(d, value));
  const firstFree = list.findIndex(d => !isDisabled(d));
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);
  const tabIndexDay = focusIndex ?? (selectedIndex >= 0 ? selectedIndex : Math.max(firstFree, 0));

  const scroller = React.useRef<HTMLDivElement>(null);
  const buttons = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [edges, setEdges] = React.useState({ atStart: true, atEnd: false });
  const updateEdges = React.useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ atStart: el.scrollLeft <= 1, atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  }, []);
  React.useEffect(() => {
    updateEdges();
    const el = scroller.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges, list]);

  // Bring the selected day into view when the strip first shows it (set the offset: no page scroll).
  React.useEffect(() => {
    const el = scroller.current;
    const btn = selectedIndex >= 0 ? buttons.current[selectedIndex] : null;
    if (!el || !btn) return;
    el.scrollLeft = Math.max(0, btn.offsetLeft - (el.clientWidth - btn.offsetWidth) / 2);
    updateEdges();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (d: Date) => {
    if (isDisabled(d)) return;
    if (valueProp === undefined) setInner(d);
    onValueChange?.(d);
  };
  const moveFocus = (i: number) => {
    const next = Math.min(Math.max(i, 0), list.length - 1);
    setFocusIndex(next);
    buttons.current[next]?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = i + (rtl ? -1 : 1);
    else if (e.key === 'ArrowLeft') next = i + (rtl ? 1 : -1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    if (next === null) return;
    e.preventDefault();
    moveFocus(next);
  };
  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8 });
  };

  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const monthName = new Intl.DateTimeFormat(locale, { month: 'short' });

  return (
    <div data-slot="date-strip" className={cn('flex min-w-0 items-center gap-1', className)} {...props}>
      {showScrollButtons ? (
        <ButtonIcon variant="ghost" size="sm" icon={<ChevronLeft />} label={t.earlier} disabled={edges.atStart} showTooltip={false} onClick={() => scrollBy(-1)} className="shrink-0" />
      ) : null}
      <div
        ref={scroller}
        role="listbox"
        aria-orientation="horizontal"
        aria-label={label}
        onScroll={updateEdges}
        className="flex min-w-0 flex-1 gap-1 overflow-x-auto overscroll-x-contain py-1 [scrollbar-width:none] motion-safe:scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {list.map((d, i) => {
          const selected = isSameDay(d, value);
          const unavailable = isDisabled(d);
          const isToday = isSameDay(d, today);
          const name = [formatFullDate(d, locale), isToday ? t.today : '', unavailable ? t.unavailable : ''].filter(Boolean).join(', ');
          const showMonthLabel = showMonth && (i === 0 || d.getDate() === 1);
          return (
            <button
              key={dateKey(d)}
              ref={el => {
                buttons.current[i] = el;
              }}
              type="button"
              role="option"
              aria-selected={selected}
              aria-disabled={unavailable || undefined}
              data-date={dateKey(d)}
              data-today={isToday || undefined}
              tabIndex={i === tabIndexDay ? 0 : -1}
              onClick={() => pick(d)}
              onFocus={() => setFocusIndex(i)}
              onKeyDown={e => onKeyDown(e, i)}
              className={cn(
                'relative flex h-18 w-14 min-w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border px-1 text-center outline-none transition-colors duration-[var(--duration-fast)] focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
                selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                unavailable && 'cursor-not-allowed opacity-50 hover:bg-background hover:text-foreground',
              )}
            >
              <span className="sr-only">{name}</span>
              <span aria-hidden="true" className={cn('h-4 truncate text-xs leading-4', selected ? 'text-primary-foreground' : 'text-muted-foreground')}>
                {showMonthLabel ? monthName.format(d) : ' '}
              </span>
              <span aria-hidden="true" className="max-w-full truncate text-xs leading-4 font-medium">{weekday.format(d).replace(/\.$/, '')}</span>
              <span aria-hidden="true" className={cn('text-base leading-6 font-semibold', unavailable && 'line-through')}>{d.getDate()}</span>
              {isToday ? <span aria-hidden="true" className={cn('absolute bottom-1 size-1 rounded-full', selected ? 'bg-primary-foreground' : 'bg-primary')} /> : null}
            </button>
          );
        })}
      </div>
      {showScrollButtons ? (
        <ButtonIcon variant="ghost" size="sm" icon={<ChevronRight />} label={t.later} disabled={edges.atEnd} showTooltip={false} onClick={() => scrollBy(1)} className="shrink-0" />
      ) : null}
    </div>
  );
}

export { DateStrip };
