// EGG UI Week Picker. Code only (no Figma component yet). Picks a whole week: previous and next
// buttons step one week, and the middle button shows the range ("19 to 25 Oct 2026") with the week
// number as a badge and opens a Popover with the weeks of one month, a month switcher on top, as a
// listbox (Up and Down move, Home and End jump, Enter or Space picks and closes, Escape closes).
// A week is shown from `weekStartsOn` (Monday by default; the ISO week number is then exact). Weeks
// outside min and max stay in the list but cannot be picked. The new week is announced politely.
// For a single day use Date Picker; for any period use Date Range Picker.
import * as React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { DEFAULT_LOCALE, addDays, addMonths, compareDays, dateKey, endOfWeek, formatMonthYear, isoWeek, isSameDay, monthGrid, startOfMonth, startOfWeek, type WeekStart } from './calendar-date';

export interface WeekValue {
  /** First day of the week. */
  from: Date;
  /** Last day of the week. */
  to: Date;
  /** ISO week number (exact when the week starts on Monday). */
  week: number;
}

export interface WeekPickerProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Any day of the picked week. Controlled when given. */
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (week: WeekValue) => void;
  weekStartsOn?: WeekStart;
  /** Weeks that end before this day or start after the max day cannot be picked. */
  minDate?: Date;
  maxDate?: Date;
  /** The day marked as the current week. Pass it in tests and previews; the real today when not given. */
  now?: Date;
  /** Show the week number badge. Default true. */
  showWeekNumber?: boolean;
  locale?: string;
  /** Accessible name of the picker. Default "Week". */
  label?: string;
  /** Texts translated by the app. */
  labels?: { previous?: string; next?: string; previousMonth?: string; nextMonth?: string; week?: string; choose?: string; thisWeek?: string };
}

const weekNumber = (start: Date, ws: WeekStart) => isoWeek(addDays(start, (4 - ws + 7) % 7));

/** "19 to 25 Oct 2026", "28 Sep to 4 Oct 2026", "28 Dec 2026 to 3 Jan 2027". */
function rangeText(from: Date, to: Date, locale: string) {
  const f = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, o).format(d);
  if (from.getFullYear() !== to.getFullYear()) return `${f(from, { day: 'numeric', month: 'short', year: 'numeric' })} to ${f(to, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  if (from.getMonth() !== to.getMonth()) return `${f(from, { day: 'numeric', month: 'short' })} to ${f(to, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  return `${f(from, { day: 'numeric' })} to ${f(to, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}
const shortRange = (from: Date, to: Date, locale: string) => {
  const f = (d: Date) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(d);
  return `${f(from)} to ${f(to)}`;
};

function WeekPicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  weekStartsOn = 1,
  minDate,
  maxDate,
  now,
  showWeekNumber = true,
  locale = DEFAULT_LOCALE,
  label = 'Week',
  labels,
  className,
  ...props
}: WeekPickerProps) {
  const t = { previous: 'Previous week', next: 'Next week', previousMonth: 'Previous month', nextMonth: 'Next month', week: 'Week', choose: 'Choose a week', thisWeek: 'this week', ...labels };
  const today = now ?? new Date();
  const [inner, setInner] = React.useState<Date>(defaultValue ?? today);
  const value = valueProp !== undefined ? valueProp : inner;
  const start = startOfWeek(value, weekStartsOn);
  const end = endOfWeek(value, weekStartsOn);
  const number = weekNumber(start, weekStartsOn);

  const allowed = (weekStart: Date) =>
    (minDate === undefined || compareDays(addDays(weekStart, 6), minDate) >= 0) && (maxDate === undefined || compareDays(weekStart, maxDate) <= 0);

  const choose = (weekStart: Date) => {
    if (!allowed(weekStart)) return;
    if (valueProp === undefined) setInner(weekStart);
    onValueChange?.({ from: weekStart, to: addDays(weekStart, 6), week: weekNumber(weekStart, weekStartsOn) });
  };

  const [open, setOpen] = React.useState(false);
  const [viewMonth, setViewMonth] = React.useState(() => startOfMonth(start));
  const weeks = monthGrid(viewMonth.getFullYear(), viewMonth.getMonth(), weekStartsOn).map(w => w[0]!);

  // One tab stop in the list: the picked week when it is listed, else the first week.
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const pickedIndex = weeks.findIndex(w => isSameDay(w, start));
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);
  const tabIndexOption = Math.min(focusIndex ?? (pickedIndex >= 0 ? pickedIndex : 0), weeks.length - 1);
  const moveFocus = (i: number) => {
    const next = Math.min(Math.max(i, 0), weeks.length - 1);
    setFocusIndex(next);
    optionRefs.current[next]?.focus();
  };
  const onOptionKeyDown = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? weeks.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    moveFocus(next);
  };

  const rangeLabel = rangeText(start, end, locale);
  const prevStart = addDays(start, -7);
  const nextStart = addDays(start, 7);

  return (
    <div data-slot="week-picker" role="group" aria-label={label} className={cn('flex w-full min-w-0 items-center gap-2', className)} {...props}>
      <ButtonIcon variant="outline" icon={<ChevronLeft />} label={t.previous} disabled={!allowed(prevStart)} onClick={() => choose(prevStart)} className="shrink-0" />
      <Popover
        open={open}
        onOpenChange={next => {
          if (next) {
            setViewMonth(startOfMonth(start));
            setFocusIndex(null);
          }
          setOpen(next);
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-0 flex-1 justify-between gap-2 px-3">
            <CalendarIcon aria-hidden="true" className="text-muted-foreground" />
            <span className="sr-only">{`${t.choose}: `}</span>
            <span className="min-w-0 flex-1 truncate text-start">{rangeLabel}</span>
            {showWeekNumber ? <Badge variant="secondary" shape="pill">{`${t.week} ${number}`}</Badge> : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent aria-label={t.choose} className="w-72 max-w-[calc(100vw-1rem)] p-3">
          <div className="flex items-center justify-between gap-2 pb-2">
            <ButtonIcon variant="ghost" size="sm" icon={<ChevronLeft />} label={t.previousMonth} showTooltip={false} onClick={() => setViewMonth(m => addMonths(m, -1))} />
            <span aria-live="polite" className="min-w-0 truncate text-sm leading-5 font-medium">{formatMonthYear(viewMonth, locale)}</span>
            <ButtonIcon variant="ghost" size="sm" icon={<ChevronRight />} label={t.nextMonth} showTooltip={false} onClick={() => setViewMonth(m => addMonths(m, 1))} />
          </div>
          <div role="listbox" aria-label={`${t.week}s of ${formatMonthYear(viewMonth, locale)}`} className="flex flex-col gap-1">
            {weeks.map((w, i) => {
              const picked = isSameDay(w, start);
              const ok = allowed(w);
              const isCurrent = isSameDay(w, startOfWeek(today, weekStartsOn));
              const to = addDays(w, 6);
              return (
                <button
                  key={dateKey(w)}
                  ref={el => {
                    optionRefs.current[i] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={picked}
                  aria-disabled={!ok || undefined}
                  data-week={dateKey(w)}
                  tabIndex={i === tabIndexOption ? 0 : -1}
                  onFocus={() => setFocusIndex(i)}
                  onKeyDown={e => onOptionKeyDown(e, i)}
                  onClick={() => {
                    if (!ok) return;
                    choose(w);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex min-w-0 items-center justify-between gap-3 rounded-md px-3 py-2 text-start text-sm leading-5 outline-none transition-colors duration-[var(--duration-fast)] focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
                    picked ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                    !ok && 'cursor-not-allowed opacity-50 hover:bg-transparent',
                  )}
                >
                  <span className="shrink-0 font-medium">{`${t.week} ${weekNumber(w, weekStartsOn)}`}</span>
                  <span className="min-w-0 truncate">{shortRange(w, to, locale)}</span>
                  {isCurrent ? <span className="sr-only">{`, ${t.thisWeek}`}</span> : null}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      <ButtonIcon variant="outline" icon={<ChevronRight />} label={t.next} disabled={!allowed(nextStart)} onClick={() => choose(nextStart)} className="shrink-0" />
      <p role="status" className="sr-only">{`${t.week} ${number}, ${rangeLabel}`}</p>
    </div>
  );
}

export { WeekPicker };
