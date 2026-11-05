// EGG UI Date Picker. Figma: Date Picker (Calendar page, "Date Picker / Component"). Type (single,
// range), Size (default 36, sm 32, lg 40), State (default, focus, error, disabled, read-only),
// Content (placeholder, filled), Value ("Pick a date"), Range ("1 Oct to 31 Oct 2026"). A trigger
// with a calendar icon that opens a Calendar in a Popover, 4 px below (shadow md). Type=range opens
// the Date Range Picker; type="datetime" (code only, the Figma trigger of Date Time Picker) opens
// the Date Time Picker and shows "22 Oct 2026, 14:30". Built from Popover, Calendar, Date Range
// Picker and Date Time Picker. Opening moves focus to the selected day or today; Escape closes and
// returns focus to the trigger; a single day pick closes. Read-only: muted fill, the value stays
// readable and nothing opens (a textbox with aria-readonly, since a button cannot be read-only).
import * as React from 'react';
import { Calendar as CalendarIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Calendar, type CalendarProps } from './calendar';
import { DateRangePicker, type DateRangePickerProps } from './date-range-picker';
import { DateTimePicker, type DateTimePickerProps } from './date-time-picker';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { DEFAULT_LOCALE, formatRangeText, formatShortDate, formatTime, timeOfDate, type DateRange } from './calendar-date';

export type DatePickerSize = 'sm' | 'default' | 'lg';

export interface DatePickerProps extends Omit<React.ComponentProps<'button'>, 'value' | 'defaultValue' | 'size' | 'onChange' | 'type'> {
  /** Figma Type: single (one day), range (a period, opens Date Range Picker), datetime (date and time). */
  type?: 'single' | 'range' | 'datetime';
  /** Figma Size: default 36, sm 32 (report and filter bars), lg 40 (booking and mobile forms). */
  size?: DatePickerSize;
  /** Picked day (single, datetime). Controlled when given. */
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date) => void;
  /** Picked period (range). Controlled when given. */
  range?: DateRange;
  defaultRange?: DateRange;
  onRangeChange?: (range: Required<DateRange>) => void;
  /** Figma Value: shown when nothing is picked. */
  placeholder?: string;
  /** Figma State=error (aria-invalid). Say what is wrong near the field. */
  invalid?: boolean;
  /** Figma State=read-only. */
  readOnly?: boolean;
  today?: Date;
  locale?: string;
  hour12?: boolean;
  /** Accessible name read together with the value when no visible label is bound to the trigger. */
  label?: string;
  /** Props of the Calendar in the popover (disabled days, booked days, ...). */
  calendarProps?: Partial<CalendarProps>;
  rangePickerProps?: Partial<DateRangePickerProps>;
  dateTimePickerProps?: Partial<DateTimePickerProps>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Every class name is written in full so Tailwind can generate it.
const sizes: Record<DatePickerSize, string> = {
  sm: 'h-8 px-3.5 text-sm',
  default: 'h-[var(--control-height)] px-3.5 text-sm',
  lg: 'h-10 px-4 text-base',
};
const base =
  'flex w-full min-w-0 items-center gap-2 rounded-input border border-input bg-background text-left text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] duration-[var(--duration-fast)]';

function DatePicker({
  type = 'single',
  size = 'default',
  value: valueProp,
  defaultValue,
  onValueChange,
  range: rangeProp,
  defaultRange,
  onRangeChange,
  placeholder = 'Pick a date',
  invalid,
  readOnly,
  today,
  locale = DEFAULT_LOCALE,
  hour12 = false,
  label,
  calendarProps,
  rangePickerProps,
  dateTimePickerProps,
  open: openProp,
  onOpenChange,
  disabled,
  className,
  ...props
}: DatePickerProps) {
  const [innerValue, setInnerValue] = React.useState<Date | undefined>(defaultValue);
  const [innerRange, setInnerRange] = React.useState<DateRange>(defaultRange ?? {});
  const [innerOpen, setInnerOpen] = React.useState(false);
  const value = valueProp ?? innerValue;
  const range = rangeProp ?? innerRange;
  const open = openProp ?? innerOpen;
  const setOpen = (o: boolean) => {
    setInnerOpen(o);
    onOpenChange?.(o);
  };

  const filled = type === 'range' ? !!(range.from && range.to) : !!value;
  const text =
    type === 'range'
      ? filled ? formatRangeText(range, locale) : placeholder
      : value
        ? type === 'datetime' ? `${formatShortDate(value, locale)}, ${formatTime(timeOfDate(value), hour12, locale)}` : formatShortDate(value, locale)
        : placeholder;
  const name = label ? `${label}, ${text}` : undefined;
  const content = (
    <>
      <CalendarIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <span data-slot="date-picker-value" className={cn('min-w-0 flex-1 truncate', !filled && 'text-muted-foreground')}>{text}</span>
    </>
  );

  if (readOnly) {
    // aria-label stays when the parent Field passes an id: the Field label cannot name a div.
    return (
      <div
        id={props.id}
        role="textbox"
        aria-readonly="true"
        tabIndex={0}
        aria-label={name ?? props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
        aria-describedby={props['aria-describedby']}
        data-slot="date-picker"
        data-type={type}
        data-readonly=""
        className={cn(base, 'border-input bg-muted shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50', sizes[size], className)}
      >
        {content}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-slot="date-picker"
          data-type={type}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-haspopup="dialog"
          aria-label={name}
          className={cn(
            base,
            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-ring',
            sizes[size],
            className,
          )}
          {...props}
        >
          {content}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-[calc(100vw-16px)] border-0 bg-transparent p-0 shadow-none"
        aria-label={type === 'range' ? 'Choose a period' : type === 'datetime' ? 'Choose date and time' : 'Choose a date'}
        onOpenAutoFocus={e => {
          if (type === 'single') {
            // Focus goes to the selected day, or today: the one day in the calendar's tab order.
            e.preventDefault();
            (e.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-date][tabindex="0"]')?.focus();
          }
        }}
      >
        {type === 'range' ? (
          <DateRangePicker
            today={today}
            locale={locale}
            value={range}
            onCancel={() => setOpen(false)}
            onApply={r => {
              setInnerRange(r);
              onRangeChange?.(r);
              setOpen(false);
            }}
            {...rangePickerProps}
          />
        ) : type === 'datetime' ? (
          <DateTimePicker
            today={today}
            locale={locale}
            hour12={hour12}
            value={value}
            onCancel={() => setOpen(false)}
            onApply={v => {
              setInnerValue(v);
              onValueChange?.(v);
              setOpen(false);
            }}
            {...dateTimePickerProps}
          />
        ) : (
          <Calendar
            today={today}
            locale={locale}
            selected={value}
            onSelect={d => {
              setInnerValue(d);
              onValueChange?.(d);
              setOpen(false);
            }}
            className="shadow-md"
            {...calendarProps}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
