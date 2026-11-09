// EGG UI Date Input. Figma: Date Input (Input page, "Date Input / Component"). State (default,
// focus, error, disabled), Day ("12"), Month ("11"), Year ("2026"). A date people type: day, month
// and year segments in the locale order (12/11/2026 in en-GB, 11/12/2026 in en-US, 12.11.2026 in
// ro-RO) and a calendar button that opens a Calendar in a Popover, like Date Picker. 200 x 36, min
// 160; day and month segments 20 to 28 wide, the year 36 to 48, centered; 2 px between items, 12 px
// left and 4 px right padding, the 28 px calendar button at the end. Empty segments show DD, MM,
// YYYY in muted. Each segment is a spinbutton (react-aria DateField pattern): digits type into it
// and move on when the segment is full, arrows change it, Left/Right move between segments,
// Backspace clears, and pasting a full date fills all segments. Validation runs when focus leaves
// the field and the message names the rule ("Date must be on or after 1 Jan 2026"). Disabled fades
// the field and takes the segments out of the tab order. Built from Popover and Calendar.
// Inside a Field: the Field id goes on the first segment, the Field label names the group and
// focuses the first segment, the hint and error describe every segment.
import * as React from 'react';
import { Calendar as CalendarIcon, CircleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Calendar, type CalendarProps } from './calendar';
import { DEFAULT_LOCALE, daysInMonth, formatMonthLong, formatShortDate, isAfter, isBefore } from './calendar-date';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './popover';

type SegmentType = 'day' | 'month' | 'year';
type Segments = Record<SegmentType, number | null>;

export interface DateInputProps
  extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** The typed date (Figma Day, Month, Year). Controlled when given; null is empty. */
  value?: Date | null;
  defaultValue?: Date | null;
  /** Called with the date when all segments form a real date, and with null when it is emptied. */
  onValueChange?: (date: Date | null) => void;
  /** Earliest and latest allowed days (inclusive), checked when focus leaves the field. */
  minDate?: Date;
  maxDate?: Date;
  /** Name of the group when no Field label names it ("Date of birth"). */
  label?: string;
  /** Figma State=error, set by the app (for example a Field error). */
  invalid?: boolean;
  /** Figma State=disabled. */
  disabled?: boolean;
  required?: boolean;
  locale?: string;
  /** The day the calendar marks as today and the year arrows start from; the real today when not given. */
  today?: Date;
  /** Props of the Calendar in the popover. */
  calendarProps?: Partial<CalendarProps>;
  /** Texts translated by the app. */
  labels?: {
    day?: string; month?: string; year?: string; empty?: string; chooseDate?: string;
    placeholderDay?: string; placeholderMonth?: string; placeholderYear?: string;
    incomplete?: string; notADate?: string; before?: (min: string) => string; after?: (max: string) => string;
  };
}

/** The Field label (label[for=id]) names the group and focuses the first segment. */
function useFieldLabel(id: string | undefined, onClick: () => void) {
  const [labelId, setLabelId] = React.useState<string>();
  const click = React.useRef(onClick);
  click.current = onClick;
  React.useLayoutEffect(() => {
    if (!id) return;
    const label = document.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(id)}"]`);
    if (!label) return;
    if (!label.id) label.id = `${id}-label`;
    setLabelId(label.id);
    const handler = () => click.current();
    label.addEventListener('click', handler);
    return () => label.removeEventListener('click', handler);
  }, [id]);
  return labelId;
}

/** Segment order and separators of the locale: en-GB day/month/year, en-US month/day/year. */
function localeLayout(locale: string) {
  const parts = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(new Date(2026, 10, 12));
  const order: SegmentType[] = [];
  const separators: string[] = [];
  for (const p of parts) {
    if (p.type === 'day' || p.type === 'month' || p.type === 'year') order.push(p.type);
    else if (p.type === 'literal' && order.length > 0 && order.length < 3) separators[order.length - 1] = p.value.trim() || '/';
  }
  return { order: order.length === 3 ? order : (['day', 'month', 'year'] as SegmentType[]), separators };
}

const fromDate = (d: Date | null | undefined): Segments =>
  d ? { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() } : { day: null, month: null, year: null };

const maxOf = (type: SegmentType, s: Segments) =>
  type === 'month' ? 12 : type === 'year' ? 9999 : s.month ? daysInMonth(s.year ?? 2024, s.month - 1) : 31;

/** The date the segments form, or null when one is empty or the day does not exist (31/02). */
function toDate(s: Segments) {
  // A year is complete at 4 digits: "202" while typing 2026 is not a date yet.
  if (s.day == null || s.month == null || s.year == null || s.year < 1000) return null;
  if (s.day > daysInMonth(s.year, s.month - 1)) return null;
  return new Date(s.year, s.month - 1, s.day);
}

/** "12/11/2026", "12.11.2026" in the locale order, or ISO "2026-11-12". */
export function parseDateText(text: string, locale = DEFAULT_LOCALE): Date | null {
  const iso = text.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const nums = iso ? null : text.match(/\d+/g);
  let s: Segments;
  if (iso) s = { year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) };
  else if (nums && nums.length === 3) {
    const { order } = localeLayout(locale);
    s = { day: null, month: null, year: null };
    order.forEach((type, i) => (s[type] = Number(nums[i])));
  } else return null;
  if (s.month! < 1 || s.month! > 12 || s.day! < 1) return null;
  return toDate(s);
}

const segmentWidth: Record<SegmentType, string> = {
  day: 'min-w-5 max-w-7',
  month: 'min-w-5 max-w-7',
  year: 'min-w-9 max-w-12',
};

function DateInput({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  minDate,
  maxDate,
  label,
  invalid: invalidProp,
  disabled,
  required,
  locale = DEFAULT_LOCALE,
  today,
  calendarProps,
  labels,
  id,
  className,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  ...props
}: DateInputProps) {
  const t = {
    day: 'Day', month: 'Month', year: 'Year', empty: 'Empty', chooseDate: 'Choose date',
    placeholderDay: 'DD', placeholderMonth: 'MM', placeholderYear: 'YYYY',
    incomplete: 'Enter the day, month and year', notADate: 'This date does not exist',
    before: (min: string) => `Date must be on or after ${min}`,
    after: (max: string) => `Date must be on or before ${max}`,
    ...labels,
  };
  const autoId = React.useId();
  const baseId = id ?? autoId;
  const errorId = `${baseId}-error`;
  const { order, separators } = React.useMemo(() => localeLayout(locale), [locale]);
  const refs = React.useRef<Partial<Record<SegmentType, HTMLDivElement | null>>>({});
  const focusSegment = (type: SegmentType | undefined) => type && refs.current[type]?.focus();
  const fieldLabelId = useFieldLabel(id, () => !disabled && focusSegment(order[0]));

  const [segments, setSegments] = React.useState<Segments>(() => fromDate(valueProp !== undefined ? valueProp : defaultValue));
  const [buffer, setBuffer] = React.useState<{ type: SegmentType; text: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const lastEmitted = React.useRef<number | null>(toDate(segments)?.getTime() ?? null);

  // A controlled value changed from outside.
  const controlledTime = valueProp === undefined ? undefined : valueProp?.getTime() ?? null;
  React.useEffect(() => {
    if (controlledTime === undefined || controlledTime === lastEmitted.current) return;
    lastEmitted.current = controlledTime;
    setSegments(fromDate(controlledTime == null ? null : new Date(controlledTime)));
  }, [controlledTime]);

  const update = (next: Segments) => {
    setSegments(next);
    const date = toDate(next);
    const time = date?.getTime() ?? null;
    if (date && time !== lastEmitted.current) {
      lastEmitted.current = time;
      onValueChange?.(date);
      setError(null);
    } else if (!date && lastEmitted.current !== null) {
      lastEmitted.current = null;
      onValueChange?.(null);
    }
  };

  const validate = () => {
    setBuffer(null);
    const filled = order.filter(type => segments[type] != null).length;
    const date = toDate(segments);
    if (filled === 0) setError(null);
    else if (filled < 3) setError(t.incomplete);
    else if (!date) setError(t.notADate);
    else if (minDate && isBefore(date, minDate)) setError(t.before(formatShortDate(minDate, locale)));
    else if (maxDate && isAfter(date, maxDate)) setError(t.after(formatShortDate(maxDate, locale)));
    else setError(null);
  };

  const invalid = Boolean(invalidProp || error || ariaInvalid === true || ariaInvalid === 'true');
  const describedBy = [describedByProp, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  const move = (type: SegmentType, by: number) => focusSegment(order[order.indexOf(type) + by]);

  const onKeyDown = (type: SegmentType) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const current = segments[type];
    const max = maxOf(type, segments);
    const key = e.key;
    if (/^\d$/.test(key)) {
      e.preventDefault();
      const text = (buffer?.type === type ? buffer.text : '') + key;
      const n = Number(text);
      const full = type === 'year' ? text.length >= 4 : text.length >= 2 || n * 10 > max;
      if (full) {
        const value = type === 'year' ? n : Math.min(Math.max(n, 1), max);
        setBuffer(null);
        update({ ...segments, [type]: value });
        move(type, 1);
      } else {
        setBuffer({ type, text });
        update({ ...segments, [type]: n === 0 ? null : n });
      }
    } else if (key === 'Backspace' || key === 'Delete') {
      e.preventDefault();
      if (buffer?.type === type && buffer.text.length > 1) {
        const text = buffer.text.slice(0, -1);
        setBuffer({ type, text });
        update({ ...segments, [type]: Number(text) || null });
      } else if (current != null || buffer?.type === type) {
        setBuffer(null);
        update({ ...segments, [type]: null });
      } else if (key === 'Backspace') move(type, -1);
    } else if (key === 'ArrowUp' || key === 'ArrowDown') {
      e.preventDefault();
      setBuffer(null);
      const up = key === 'ArrowUp';
      let next: number;
      if (type === 'year') next = current == null ? (today ?? new Date()).getFullYear() : Math.min(9999, Math.max(1000, current + (up ? 1 : -1)));
      else if (current == null) next = up ? 1 : max;
      else next = up ? (current >= max ? 1 : current + 1) : current <= 1 ? max : current - 1;
      update({ ...segments, [type]: next });
    } else if (key === 'ArrowLeft' || key === 'ArrowRight') {
      e.preventDefault();
      setBuffer(null);
      move(type, key === 'ArrowRight' ? 1 : -1);
    } else if (['/', '.', '-', separators[order.indexOf(type)]].includes(key)) {
      e.preventDefault();
      if (current != null) {
        setBuffer(null);
        move(type, 1);
      }
    }
  };

  const display = (type: SegmentType) => {
    if (buffer?.type === type) return buffer.text;
    const v = segments[type];
    if (v == null) return null;
    return type === 'year' ? String(v) : String(v).padStart(2, '0');
  };
  const placeholder = { day: t.placeholderDay, month: t.placeholderMonth, year: t.placeholderYear };
  const segmentLabel = { day: t.day, month: t.month, year: t.year };
  const valueText = (type: SegmentType) => {
    const v = segments[type];
    if (v == null) return t.empty;
    return type === 'month' && v >= 1 && v <= 12 ? `${v}, ${formatMonthLong(v - 1, locale)}` : String(v);
  };

  const selected = toDate(segments) ?? undefined;

  return (
    <div data-slot="date-input" data-state={disabled ? 'disabled' : invalid ? 'error' : 'default'} className={cn('flex w-50 min-w-40 flex-col gap-2', className)} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div
            role="group"
            aria-label={fieldLabelId ? undefined : label}
            aria-labelledby={fieldLabelId}
            aria-disabled={disabled || undefined}
            data-invalid={invalid ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
            className="flex h-[var(--control-height)] w-full min-w-0 items-center gap-0.5 overflow-hidden rounded-input border border-input bg-background pr-1 pl-3 text-sm leading-5 text-foreground shadow-xs transition-[color,box-shadow,border-color] duration-[var(--duration-fast)] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            onBlur={e => {
              if (!open && !e.currentTarget.contains(e.relatedTarget as Node | null)) validate();
            }}
            onPaste={e => {
              if (disabled) return;
              const date = parseDateText(e.clipboardData.getData('text'), locale);
              if (!date) return;
              e.preventDefault();
              setBuffer(null);
              update(fromDate(date));
            }}
            onMouseDown={e => {
              // A click on a separator or the padding focuses the first empty segment (or the last).
              if (disabled || e.target !== e.currentTarget) return;
              e.preventDefault();
              focusSegment(order.find(type => segments[type] == null) ?? order[2]);
            }}
          >
            {order.map((type, i) => {
              const text = display(type);
              return (
                <React.Fragment key={type}>
                  <div
                    ref={el => {
                      refs.current[type] = el;
                    }}
                    id={i === 0 ? id : undefined}
                    role="spinbutton"
                    tabIndex={disabled ? -1 : 0}
                    aria-label={segmentLabel[type]}
                    aria-valuemin={1}
                    aria-valuemax={maxOf(type, segments)}
                    aria-valuenow={segments[type] ?? undefined}
                    aria-valuetext={valueText(type)}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    aria-required={required || ariaRequired ? true : undefined}
                    aria-disabled={disabled || undefined}
                    data-slot={`date-input-${type}`}
                    data-placeholder={text == null ? '' : undefined}
                    inputMode="numeric"
                    onKeyDown={onKeyDown(type)}
                    onFocus={() => setBuffer(null)}
                    className={cn(
                      'shrink-0 cursor-default truncate rounded-sm px-0.5 text-center tabular-nums caret-transparent outline-none select-none',
                      'data-[placeholder]:text-muted-foreground focus:bg-accent focus:text-accent-foreground focus:data-[placeholder]:text-accent-foreground',
                      segmentWidth[type],
                    )}
                  >
                    {text ?? placeholder[type]}
                  </div>
                  {i < 2 ? (
                    <span aria-hidden="true" className="max-w-[9px] shrink-0 truncate text-muted-foreground">{separators[i] ?? '/'}</span>
                  ) : null}
                </React.Fragment>
              );
            })}
            <span aria-hidden="true" className="min-w-px flex-1" />
            <PopoverTrigger asChild>
              <button
                type="button"
                data-slot="date-input-calendar"
                aria-label={t.chooseDate}
                aria-haspopup="dialog"
                disabled={disabled}
                className="flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground disabled:cursor-not-allowed"
              >
                <CalendarIcon aria-hidden="true" className="size-4" />
              </button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-auto max-w-[calc(100vw-16px)] border-0 bg-transparent p-0 shadow-none"
          aria-label={t.chooseDate}
          onOpenAutoFocus={e => {
            // Focus goes to the typed day, or today: the one day in the calendar's tab order.
            e.preventDefault();
            (e.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-date][tabindex="0"]')?.focus();
          }}
        >
          <Calendar
            today={today}
            locale={locale}
            selected={selected}
            defaultMonth={selected ?? today}
            disabled={d => (minDate ? isBefore(d, minDate) : false) || (maxDate ? isAfter(d, maxDate) : false)}
            onSelect={d => {
              setBuffer(null);
              setError(null);
              update(fromDate(d));
              setOpen(false);
            }}
            className="shadow-md"
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
      {error ? (
        <p id={errorId} data-slot="date-input-error" className="flex items-start gap-1.5 text-xs text-destructive">
          <span className="flex h-4 shrink-0 items-center"><CircleAlert className="size-3.5" aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export { DateInput };
