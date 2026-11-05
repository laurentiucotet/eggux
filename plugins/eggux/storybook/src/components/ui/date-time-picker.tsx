// EGG UI Date Time Picker. Figma: Date Time Picker (Calendar page, "Date Time Picker /
// Component"). Summary, Show footer, Times slot; 373 x 351: Calendar (250), a divider, a column of
// Time Slots (96, steps of 15 or 30 min, unavailable times disabled) and a footer with the summary
// ("22 Oct 2026, 14:30"), Cancel and Apply. Built from Button, Calendar and Time Slot. Apply
// commits both values; without the footer every pick commits at once. The selected time is
// scrolled into view on open. The summary is a live region.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar, type CalendarProps } from './calendar';
import { TimeSlot } from './time-slot';
import { DEFAULT_LOCALE, formatShortDate, formatTime, startOfDay, timeOfDate, timeOptions, withTime } from './calendar-date';

export interface DateTimePickerProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** The applied date and time. */
  value?: Date;
  defaultValue?: Date;
  /** Apply (or every pick when Show footer is off). */
  onApply?: (value: Date) => void;
  onCancel?: () => void;
  /** Figma Show footer. */
  showFooter?: boolean;
  /** The times in the list; default every 30 minutes. */
  times?: string[];
  /** Unavailable times stay in the list, disabled. */
  isTimeUnavailable?: (time: string, date: Date) => boolean;
  /** Days that cannot be picked. */
  isDateDisabled?: (date: Date) => boolean;
  today?: Date;
  locale?: string;
  hour12?: boolean;
  calendarProps?: Partial<CalendarProps>;
  labels?: { time?: string; cancel?: string; apply?: string; panel?: string };
}

function DateTimePicker({
  value,
  defaultValue,
  onApply,
  onCancel,
  showFooter = true,
  times,
  isTimeUnavailable,
  isDateDisabled,
  today: todayProp,
  locale = DEFAULT_LOCALE,
  hour12 = false,
  calendarProps,
  labels,
  className,
  ...props
}: DateTimePickerProps) {
  const t = { time: 'Time', cancel: 'Cancel', apply: 'Apply', panel: 'Choose date and time', ...labels };
  const today = React.useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const options = React.useMemo(() => times ?? timeOptions(30), [times]);
  const initial = value ?? defaultValue;
  const [date, setDate] = React.useState<Date | undefined>(initial ? startOfDay(initial) : undefined);
  const [time, setTime] = React.useState<string | undefined>(initial ? timeOfDate(initial) : undefined);
  const viewport = React.useRef<HTMLDivElement>(null);
  const [focusTime, setFocusTime] = React.useState<string | null>(null);
  const keyboardMove = React.useRef(false);

  const unavailable = (o: string) => !!isTimeUnavailable?.(o, date ?? today);
  const firstFree = options.find(o => !unavailable(o));
  const tabTime = focusTime ?? (time && options.includes(time) ? time : firstFree);

  // Scroll the selected time into view on open.
  React.useEffect(() => {
    const el = viewport.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (el && viewport.current) viewport.current.scrollTop = Math.max(0, el.offsetTop - viewport.current.offsetTop - viewport.current.clientHeight / 2 + el.offsetHeight / 2);
    // Only on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (!keyboardMove.current || !focusTime) return;
    keyboardMove.current = false;
    viewport.current?.querySelector<HTMLElement>(`[data-time="${focusTime}"]`)?.focus();
  }, [focusTime]);

  const commit = (d: Date | undefined, tm: string | undefined) => {
    if (!showFooter && d && tm) onApply?.(withTime(d, tm));
  };
  const pickDate = (d: Date) => {
    setDate(d);
    commit(d, time);
  };
  const pickTime = (o: string) => {
    if (unavailable(o)) return;
    setTime(o);
    setFocusTime(o);
    commit(date ?? today, o);
    if (!date) setDate(today);
  };

  const onTimeKeyDown = (e: React.KeyboardEvent) => {
    const free = options.filter(o => !unavailable(o));
    const i = free.indexOf(tabTime ?? '');
    let next: string | undefined;
    if (e.key === 'ArrowDown') next = free[Math.min(free.length - 1, i + 1)];
    else if (e.key === 'ArrowUp') next = free[Math.max(0, i - 1)];
    else if (e.key === 'Home') next = free[0];
    else if (e.key === 'End') next = free[free.length - 1];
    else return;
    e.preventDefault();
    keyboardMove.current = true;
    setFocusTime(next ?? null);
  };

  const complete = !!(date && time);
  const summary = complete ? `${formatShortDate(date!, locale)}, ${formatTime(time!, hour12, locale)}` : '';

  return (
    <div
      role="group"
      aria-label={t.panel}
      data-slot="date-time-picker"
      className={cn('flex w-[373px] max-w-full flex-col rounded-md border bg-popover text-popover-foreground shadow-md', className)}
      {...props}
    >
      <div className="flex min-w-0">
        <Calendar
          {...calendarProps}
          today={today}
          locale={locale}
          selected={date}
          onSelect={pickDate}
          defaultMonth={date ?? today}
          disabled={isDateDisabled}
          className="shrink-0 rounded-none border-0 bg-transparent"
        />
        <div data-slot="date-time-times" className="relative w-[122px] shrink-0 border-l">
          <div className="absolute inset-0 flex flex-col gap-2 p-3">
            <p className="text-sm font-medium leading-5 text-foreground">{t.time}</p>
            <div
              ref={viewport}
              role="group"
              aria-label={t.time}
              data-slot="date-time-slots"
              onKeyDown={onTimeKeyDown}
              className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto"
            >
              {options.map(o => (
                <TimeSlot
                  key={o}
                  time={formatTime(o, hour12, locale)}
                  data-time={o}
                  selected={o === time}
                  unavailable={unavailable(o)}
                  className="w-24 self-center"
                  tabIndex={o === tabTime ? 0 : -1}
                  onClick={() => pickTime(o)}
                  onFocus={() => setFocusTime(o)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showFooter ? (
        <div data-slot="date-time-footer" className="flex items-center justify-between gap-3 border-t px-3 py-3">
          <p role="status" aria-live="polite" data-slot="date-time-summary" className="min-w-0 truncate text-sm text-muted-foreground">{summary}</p>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>{t.cancel}</Button>
            <Button type="button" size="sm" disabled={!complete} onClick={() => complete && onApply?.(withTime(date!, time!))}>{t.apply}</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { DateTimePicker };
