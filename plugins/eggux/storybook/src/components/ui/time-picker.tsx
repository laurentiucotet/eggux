// EGG UI Time Picker. Figma: Time Picker (Calendar page, "Time Picker / Component"). Type (single,
// range), Size (default 36, sm 32, lg 40), State (default, focus, error, disabled), Content
// (placeholder, filled), Value ("Select time"), Range ("09:00 to 10:30"), Duration ("1 h 30 min"),
// Show duration. A trigger with a clock icon that opens a list of times in fixed steps (15 or 30
// min) in a Popover; Checked on the selected one. Type=range opens two lists, start and end: the
// end list starts after the start and shows the duration next to each time. Code mapping: custom
// Select of times (the Select component is not in code yet, so the list is its own listbox).
// Keyboard: Enter or Space or ArrowDown on the trigger opens; arrows, Home and End move in the
// list, Enter picks, Escape closes and returns focus to the trigger. Typing hh:mm (any minute is
// valid) is not part of this component: use an Input for that.
import * as React from 'react';
import { Check, Clock } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { DEFAULT_LOCALE, formatDuration, formatTime, timeOptions, toMinutes } from './calendar-date';

export type TimePickerSize = 'sm' | 'default' | 'lg';
export interface TimeRange {
  start?: string;
  end?: string;
}

export interface TimePickerProps extends Omit<React.ComponentProps<'button'>, 'value' | 'defaultValue' | 'size' | 'onChange' | 'type'> {
  /** Figma Type: single is one time, range a start and an end. */
  type?: 'single' | 'range';
  /** Figma Size: default 36, sm 32 (match the Date Picker beside it), lg 40. */
  size?: TimePickerSize;
  /** Time "HH:MM" (single). Controlled when given. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Start and end (range). Controlled when given. */
  range?: TimeRange;
  defaultRange?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  /** Figma Value, shown when nothing is picked. */
  placeholder?: string;
  /** Figma Show duration (range): "1 h 30 min" after the range. */
  showDuration?: boolean;
  /** Minutes between times: 15 or 30 for bookings. */
  step?: number;
  /** First and last time of the day offered, "HH:MM". */
  from?: string;
  to?: string;
  /** Unavailable times stay in the list, disabled. */
  isUnavailable?: (time: string) => boolean;
  /** Figma State=error (aria-invalid). */
  invalid?: boolean;
  hour12?: boolean;
  locale?: string;
  /** Accessible name read with the value when there is no visible label bound to the trigger. */
  label?: string;
  labels?: { start?: string; end?: string };
}

// Every class name is written in full so Tailwind can generate it.
const sizes: Record<TimePickerSize, string> = {
  sm: 'h-8 px-3.5 text-sm',
  default: 'h-[var(--control-height)] px-3.5 text-sm',
  lg: 'h-10 px-4 text-base',
};

interface TimeListProps {
  label: string;
  options: string[];
  selected?: string;
  hour12: boolean;
  locale: string;
  isUnavailable?: (t: string) => boolean;
  /** Text shown after each time (the duration in the end list). */
  suffix?: (t: string) => string;
  onPick: (t: string) => void;
  autoFocus?: boolean;
  listRef?: React.Ref<HTMLDivElement>;
}

function TimeList({ label, options, selected, hour12, locale, isUnavailable, suffix, onPick, autoFocus, listRef }: TimeListProps) {
  const uid = React.useId();
  const inner = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<string | undefined>(selected ?? options.find(o => !isUnavailable?.(o)));
  React.useImperativeHandle(listRef, () => inner.current as HTMLDivElement);
  const idOf = (o: string) => `${uid}-${o.replace(':', '')}`;

  // Scroll the active option into view inside the list, never the page.
  React.useEffect(() => {
    const list = inner.current;
    const el = active ? list?.querySelector<HTMLElement>(`[id="${idOf(active)}"]`) : null;
    if (list && el) {
      if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop;
      else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  React.useEffect(() => {
    if (autoFocus) inner.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const free = options.filter(o => !isUnavailable?.(o));
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = free.indexOf(active ?? '');
    if (e.key === 'ArrowDown') setActive(free[Math.min(free.length - 1, i + 1)]);
    else if (e.key === 'ArrowUp') setActive(free[Math.max(0, i - 1)]);
    else if (e.key === 'Home') setActive(free[0]);
    else if (e.key === 'End') setActive(free[free.length - 1]);
    else if ((e.key === 'Enter' || e.key === ' ') && active) onPick(active);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={inner}
      role="listbox"
      tabIndex={0}
      aria-label={label}
      aria-activedescendant={active ? idOf(active) : undefined}
      onKeyDown={onKeyDown}
      data-slot="time-picker-list"
      className="relative flex max-h-60 min-w-[120px] flex-col gap-px overflow-y-auto rounded-sm p-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {options.map(o => {
        const unavailable = !!isUnavailable?.(o);
        const isSelected = o === selected;
        return (
          <div
            key={o}
            id={idOf(o)}
            role="option"
            aria-selected={isSelected}
            aria-disabled={unavailable || undefined}
            data-time={o}
            data-active={o === active || undefined}
            onClick={() => !unavailable && onPick(o)}
            onMouseMove={() => !unavailable && setActive(o)}
            className={cn(
              'flex h-8 shrink-0 cursor-pointer items-center justify-between gap-3 rounded-sm px-2 text-sm text-foreground',
              o === active && 'bg-accent text-accent-foreground',
              unavailable && 'cursor-not-allowed text-muted-foreground opacity-50',
            )}
          >
            <span className="flex items-baseline gap-2">
              <span>{formatTime(o, hour12, locale)}</span>
              {suffix ? <span className="text-xs text-muted-foreground">{suffix(o)}</span> : null}
            </span>
            {isSelected ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
          </div>
        );
      })}
    </div>
  );
}

function TimePicker({
  type = 'single',
  size = 'default',
  value: valueProp,
  defaultValue,
  onValueChange,
  range: rangeProp,
  defaultRange,
  onRangeChange,
  placeholder,
  showDuration = true,
  step = 30,
  from = '00:00',
  to = '23:30',
  isUnavailable,
  invalid,
  hour12 = false,
  locale = DEFAULT_LOCALE,
  label,
  labels,
  disabled,
  className,
  id,
  ...props
}: TimePickerProps) {
  const t = { start: 'Start time', end: 'End time', ...labels };
  const [innerValue, setInnerValue] = React.useState(defaultValue);
  const [innerRange, setInnerRange] = React.useState<TimeRange>(defaultRange ?? {});
  const value = valueProp ?? innerValue;
  const range = rangeProp ?? innerRange;
  const [open, setOpen] = React.useState(false);
  const [step2, setStep2] = React.useState<'start' | 'end'>('start');
  const valueId = React.useId();
  const endList = React.useRef<HTMLDivElement>(null);

  const all = React.useMemo(() => timeOptions(step, toMinutes(from), toMinutes(to)), [step, from, to]);
  const endOptions = range.start ? all.filter(o => toMinutes(o) > toMinutes(range.start!)) : all;
  const duration = range.start && range.end ? formatDuration(toMinutes(range.end) - toMinutes(range.start)) : '';

  const isRange = type === 'range';
  const text = isRange
    ? range.start && range.end ? `${formatTime(range.start, hour12, locale)} to ${formatTime(range.end, hour12, locale)}` : undefined
    : value ? formatTime(value, hour12, locale) : undefined;
  const shown = text ?? placeholder ?? (isRange ? 'Select time range' : 'Select time');
  const name = label ? `${label}, ${shown}${isRange && showDuration && duration ? `, ${duration}` : ''}` : undefined;

  const pickSingle = (o: string) => {
    setInnerValue(o);
    onValueChange?.(o);
    setOpen(false);
  };
  const pickStart = (o: string) => {
    const end = range.end && toMinutes(range.end) > toMinutes(o) ? range.end : undefined;
    const next = { start: o, end };
    setInnerRange(next);
    onRangeChange?.(next);
    setStep2('end');
    requestAnimationFrame(() => endList.current?.focus({ preventScroll: true }));
  };
  const pickEnd = (o: string) => {
    const next = { start: range.start, end: o };
    setInnerRange(next);
    onRangeChange?.(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={o => { setOpen(o); if (o) setStep2('start'); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          data-slot="time-picker"
          data-type={type}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-haspopup="listbox"
          aria-label={name}
          className={cn(
            'flex w-full min-w-0 items-center gap-2 rounded-input border border-input bg-background text-left text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] duration-[var(--duration-fast)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-ring',
            sizes[size],
            className,
          )}
          {...props}
        >
          <Clock aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span id={valueId} data-slot="time-picker-value" className={cn('min-w-0 flex-1 truncate', !text && 'text-muted-foreground')}>{shown}</span>
          {isRange && showDuration && duration ? <span data-slot="time-picker-duration" className="shrink-0 text-sm text-muted-foreground">{duration}</span> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={isRange ? 'Choose a time range' : 'Choose a time'}
        className="flex w-auto gap-3 p-1"
        onOpenAutoFocus={e => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).querySelector<HTMLElement>('[role="listbox"]')?.focus({ preventScroll: true });
        }}
      >
        {isRange ? (
          <>
            <TimeList label={t.start} options={all} selected={range.start} hour12={hour12} locale={locale} isUnavailable={isUnavailable} onPick={pickStart} />
            <TimeList
              key={range.start ?? 'none'}
              listRef={endList}
              label={t.end}
              options={endOptions}
              selected={range.end}
              hour12={hour12}
              locale={locale}
              isUnavailable={isUnavailable}
              suffix={o => (range.start ? formatDuration(toMinutes(o) - toMinutes(range.start)) : '')}
              onPick={pickEnd}
              autoFocus={step2 === 'end'}
            />
          </>
        ) : (
          <TimeList label="Times" options={all} selected={value} hour12={hour12} locale={locale} isUnavailable={isUnavailable} onPick={pickSingle} />
        )}
      </PopoverContent>
    </Popover>
  );
}

export { TimePicker };
