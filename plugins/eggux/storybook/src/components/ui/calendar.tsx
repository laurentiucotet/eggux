// EGG UI Calendar. Figma: Calendar (Calendar page, "Calendar / Component"). Caption (label,
// dropdown), Months (1, 2), Month and Second month (text, here derived from the dates), Show week
// numbers. Month view of Calendar Days, week starting on Monday by default, single day or range.
// Built from Button (previous and next, ghost icon), Calendar Day and Select (the Caption=dropdown
// month and year Selects: the Select component is not in code yet, so the dropdowns are native
// selects with the same look; TODO Select). No date library: the date math is calendar-date.ts.
// Keyboard follows the WAI-ARIA date grid pattern: arrows move by day (up and down by week), Home
// and End go to the start and end of the week, PageUp and PageDown change the month (with Shift
// the year), Enter and Space pick. One day is in the tab order (roving tabindex).
import * as React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { CalendarDay, type CalendarDayState } from './calendar-day';
import {
  DEFAULT_LOCALE,
  addDays,
  addMonths,
  addYears,
  dateKey,
  endOfWeek,
  formatFullDate,
  formatMonthShort,
  formatMonthYear,
  isBefore,
  isBetween,
  isoWeek,
  isSameDay,
  monthGrid,
  startOfDay,
  startOfMonth,
  startOfWeek,
  weekdayLabels,
  type DateRange,
  type WeekStart,
} from './calendar-date';

export interface CalendarDayMeta {
  /** Figma Show dot: the day has events. */
  dot?: boolean;
  /** Figma Show note: 4 characters or fewer ("€89", "Full"). */
  note?: string;
}

export interface CalendarProps extends Omit<React.ComponentProps<'div'>, 'onSelect' | 'defaultValue'> {
  /** single picks one day (selected), range picks a period (range). */
  mode?: 'single' | 'range';
  /** Selected day (mode single). Controlled when given. */
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date) => void;
  /** Selected period (mode range). Controlled when given. */
  range?: DateRange;
  defaultRange?: DateRange;
  onRangeSelect?: (range: DateRange) => void;
  /** First visible month (any day of it). Controlled when given. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Figma Caption: label (month name between the arrows) or dropdown (month and year selects). */
  caption?: 'label' | 'dropdown';
  /** Figma Months: 1, or 2 side by side for ranges and booking on desktop. */
  months?: 1 | 2;
  /** Figma Show week numbers: an ISO week column. */
  showWeekNumbers?: boolean;
  /** The day marked as today (aria-current="date"); the real today when not given. */
  today?: Date;
  /** Days that cannot be picked (outside the allowed range). Say why near the calendar. */
  disabled?: (date: Date) => boolean;
  /** Days taken or sold out: visible with a strike line, announced as booked, not pickable. */
  booked?: (date: Date) => boolean;
  /** Dot or note of a day (Agenda mini calendars, booking prices). */
  getDayMeta?: (date: Date) => CalendarDayMeta | undefined;
  locale?: string;
  weekStartsOn?: WeekStart;
  /** Years offered by Caption=dropdown. Default: 10 before and 10 after the visible year. */
  fromYear?: number;
  toYear?: number;
  /** Texts translated by the app. */
  labels?: { previous?: string; next?: string; month?: string; year?: string; week?: string; booked?: string };
}

function useControllable<T>(value: T | undefined, defaultValue: T) {
  const [inner, setInner] = React.useState<T>(defaultValue);
  return [value !== undefined ? value : inner, setInner] as const;
}

function MonthSelect({ label, value, onChange, options, disabled }: { label: string; value: number; onChange: (v: number) => void; options: { value: number; label: string }[]; disabled?: boolean }) {
  return (
    <span data-slot="calendar-select" className="relative inline-flex h-8 items-center rounded-input hover:bg-accent focus-within:ring-[3px] focus-within:ring-ring/50">
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        className="h-8 w-18 cursor-pointer appearance-none truncate rounded-input bg-transparent pl-2 pr-8 text-sm font-medium text-foreground outline-none"
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-popover text-popover-foreground">{o.label}</option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 size-4 shrink-0 text-muted-foreground" />
    </span>
  );
}

function Calendar({
  mode = 'single',
  selected: selectedProp,
  defaultSelected,
  onSelect,
  range: rangeProp,
  defaultRange,
  onRangeSelect,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  caption = 'label',
  months = 1,
  showWeekNumbers = false,
  today: todayProp,
  disabled,
  booked,
  getDayMeta,
  locale = DEFAULT_LOCALE,
  weekStartsOn = 1,
  fromYear,
  toYear,
  labels,
  className,
  ...props
}: CalendarProps) {
  const t = { previous: 'Previous month', next: 'Next month', month: 'Month', year: 'Year', week: 'Week', booked: 'booked', ...labels };
  const today = React.useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const [selected, setSelected] = useControllable<Date | undefined>(selectedProp, defaultSelected);
  const [range, setRange] = useControllable<DateRange>(rangeProp, defaultRange ?? {});
  const initialMonth = startOfMonth(defaultMonth ?? selected ?? range.from ?? today);
  const [monthState, setMonthState] = React.useState<Date>(initialMonth);
  const month = startOfMonth(monthProp ?? monthState);
  const setMonth = (m: Date) => {
    const next = startOfMonth(m);
    setMonthState(next);
    onMonthChange?.(next);
  };
  const [focusDate, setFocusDate] = React.useState<Date>(() => {
    const wanted = selected ?? range.from ?? today;
    return startOfMonth(wanted).getTime() === initialMonth.getTime() ? wanted : initialMonth;
  });
  const rootRef = React.useRef<HTMLDivElement>(null);
  const keyboardMove = React.useRef(false);
  const uid = React.useId();

  const visible = Array.from({ length: months }, (_, i) => addMonths(month, i));
  const monthIndex = (d: Date) => d.getFullYear() * 12 + d.getMonth();
  const isVisible = (d: Date) => monthIndex(d) >= monthIndex(month) && monthIndex(d) <= monthIndex(month) + months - 1;
  // If the focus day is not on screen (the month was changed from outside), the first day of the first month takes the tab stop.
  const tabDate = isVisible(focusDate) ? focusDate : month;

  React.useEffect(() => {
    if (!keyboardMove.current) return;
    keyboardMove.current = false;
    rootRef.current?.querySelector<HTMLElement>(`[data-date="${dateKey(focusDate)}"][data-outside="false"]`)?.focus();
  }, [focusDate, month]);

  const goToMonth = (next: Date) => {
    const diff = monthIndex(next) - monthIndex(month);
    setMonth(next);
    setFocusDate(addMonths(tabDate, diff));
  };

  const moveFocus = (next: Date) => {
    keyboardMove.current = true;
    setFocusDate(next);
    if (monthIndex(next) < monthIndex(month)) setMonth(next);
    else if (monthIndex(next) > monthIndex(month) + months - 1) setMonth(addMonths(startOfMonth(next), -(months - 1)));
  };

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-date]');
    if (!target) return;
    const [y, m, d] = target.dataset.date!.split('-').map(Number);
    const from = new Date(y, m - 1, d);
    let next: Date | undefined;
    switch (e.key) {
      case 'ArrowLeft': next = addDays(from, -1); break;
      case 'ArrowRight': next = addDays(from, 1); break;
      case 'ArrowUp': next = addDays(from, -7); break;
      case 'ArrowDown': next = addDays(from, 7); break;
      case 'Home': next = startOfWeek(from, weekStartsOn); break;
      case 'End': next = endOfWeek(from, weekStartsOn); break;
      case 'PageUp': next = e.shiftKey ? addYears(from, -1) : addMonths(from, -1); break;
      case 'PageDown': next = e.shiftKey ? addYears(from, 1) : addMonths(from, 1); break;
      default: return;
    }
    e.preventDefault();
    moveFocus(next);
  };

  const isBlocked = (d: Date) => !!(disabled?.(d) || booked?.(d));

  const pick = (d: Date) => {
    if (isBlocked(d)) return;
    setFocusDate(d);
    if (!isVisible(d)) setMonth(monthIndex(d) < monthIndex(month) ? d : addMonths(startOfMonth(d), -(months - 1)));
    if (mode === 'single') {
      setSelected(d);
      onSelect?.(d);
      return;
    }
    const { from, to } = range;
    const next: DateRange = !from || to || isBefore(d, from) ? { from: d, to: undefined } : { from, to: d };
    setRange(next);
    onRangeSelect?.(next);
  };

  const stateOf = (d: Date, inMonth: boolean): CalendarDayState => {
    if (booked?.(d)) return 'booked';
    if (disabled?.(d)) return 'disabled';
    if (mode === 'range') {
      const { from, to } = range;
      if (from && !to && isSameDay(d, from)) return 'selected';
      if (from && to) {
        if (isSameDay(from, to) && isSameDay(d, from)) return 'selected';
        if (isSameDay(d, from)) return 'range-start';
        if (isSameDay(d, to)) return 'range-end';
        if (isBetween(d, from, to)) return 'range-middle';
      }
    } else if (isSameDay(d, selected)) return 'selected';
    if (!inMonth) return 'outside';
    return isSameDay(d, today) ? 'today' : 'default';
  };

  const weekdays = weekdayLabels(locale, weekStartsOn);
  const yearOf = (m: Date) => m.getFullYear();
  const yearOptions = (m: Date) => {
    const lo = Math.min(fromYear ?? yearOf(m) - 10, yearOf(m));
    const hi = Math.max(toYear ?? yearOf(m) + 10, yearOf(m));
    return Array.from({ length: hi - lo + 1 }, (_, i) => ({ value: lo + i, label: String(lo + i) }));
  };
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: i, label: formatMonthShort(i, locale) }));

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Calendar"
      data-slot="calendar"
      data-caption={caption}
      data-months={months}
      className={cn('flex w-fit min-w-[250px] max-w-full gap-6 rounded-md border bg-popover p-3 text-popover-foreground', className)}
      {...props}
    >
      {visible.map((m, index) => {
        const labelId = `${uid}-label-${index}`;
        const first = index === 0;
        const last = index === months - 1;
        const spacer = <span aria-hidden="true" data-slot="calendar-spacer" className="size-[var(--control-height)] shrink-0" />;
        return (
          <div key={index} data-slot="calendar-month" className="flex min-w-0 flex-col gap-4">
            <div data-slot="calendar-caption" className="flex items-center justify-between">
              {first ? (
                <Button type="button" variant="ghost" size="icon" aria-label={t.previous} onClick={() => goToMonth(addMonths(month, -1))}>
                  <ChevronLeft aria-hidden="true" />
                </Button>
              ) : spacer}
              {caption === 'label' ? (
                <p id={labelId} aria-live="polite" data-slot="calendar-label" className="min-w-0 flex-1 truncate text-center text-sm font-medium leading-5 text-foreground">
                  {formatMonthYear(m, locale)}
                </p>
              ) : (
                <div id={labelId} role="group" aria-label={formatMonthYear(m, locale)} data-slot="calendar-dropdowns" className="flex shrink-0 items-center gap-1">
                  <MonthSelect label={t.month} value={m.getMonth()} options={monthOptions} onChange={v => goToMonth(addMonths(month, v - m.getMonth()))} />
                  <MonthSelect label={t.year} value={m.getFullYear()} options={yearOptions(m)} onChange={v => goToMonth(addMonths(month, (v - m.getFullYear()) * 12))} />
                </div>
              )}
              {last ? (
                <Button type="button" variant="ghost" size="icon" aria-label={t.next} onClick={() => goToMonth(addMonths(month, 1))}>
                  <ChevronRight aria-hidden="true" />
                </Button>
              ) : spacer}
            </div>
            <div
              role="grid"
              aria-labelledby={labelId}
              data-slot="calendar-grid"
              className="flex flex-col gap-2"
              onKeyDown={onGridKeyDown}
            >
              <div role="row" className="flex">
                {showWeekNumbers ? <div role="columnheader" className="h-4 w-8 shrink-0"><span className="sr-only">{t.week}</span></div> : null}
                {weekdays.map(w => (
                  <div key={w.long} role="columnheader" aria-label={w.long} className="flex w-8 shrink-0 items-center justify-center text-xs leading-4 text-muted-foreground">
                    {w.short}
                  </div>
                ))}
              </div>
              {monthGrid(m.getFullYear(), m.getMonth(), weekStartsOn).map(week => (
                <div key={dateKey(week[0])} role="row" className="flex">
                  {showWeekNumbers ? (
                    <div role="rowheader" aria-label={`${t.week} ${isoWeek(addDays(week[0], (4 - weekStartsOn + 7) % 7))}`} data-slot="calendar-week-number" className="flex size-8 shrink-0 items-center justify-center text-xs leading-4 text-muted-foreground">
                      {isoWeek(addDays(week[0], (4 - weekStartsOn + 7) % 7))}
                    </div>
                  ) : null}
                  {week.map(d => {
                    const inMonth = d.getMonth() === m.getMonth();
                    const state = stateOf(d, inMonth);
                    const meta = getDayMeta?.(d);
                    const isSel = state === 'selected' || state.startsWith('range-');
                    const isToday = isSameDay(d, today);
                    // The visible text comes first ("21 €79, Wednesday 21 October 2026"): the name must contain what is on screen.
                    const label = [meta?.note ? `${d.getDate()} ${meta.note}` : '', formatFullDate(d, locale), state === 'booked' ? t.booked : ''].filter(Boolean).join(', ');
                    return (
                      <div key={dateKey(d)} role="gridcell" aria-selected={isSel} className="flex">
                        <CalendarDay
                          state={state}
                          day={d.getDate()}
                          showNote={!!meta?.note}
                          note={meta?.note}
                          showDot={!!meta?.dot}
                          data-date={dateKey(d)}
                          data-outside={!inMonth}
                          tabIndex={inMonth && isSameDay(d, tabDate) ? 0 : -1}
                          aria-label={label}
                          {...(isToday ? { 'aria-current': 'date' as const } : {})}
                          onClick={() => pick(d)}
                          onFocus={() => {
                            if (inMonth && !isSameDay(d, focusDate)) setFocusDate(d);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { Calendar };
