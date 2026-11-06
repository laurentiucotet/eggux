// EGG UI Recurrence Picker. Figma: Recurrence Picker (Select page, "Recurrence Picker / Component",
// set 432:2592). Frequency (daily, weekly, monthly), Show summary. How often something repeats
// (recurring invoices, reports by email, reminders): 400 wide, parts 16 px apart.
// 1. "Repeat every" (body/small) + interval Number Input (96 wide) + unit Select (day, week, month),
//    8 px apart. 2. Weekly: seven Toggle Group Items (36, 4 apart) M T W T F S S with full names
//    as aria-labels and aria-pressed; at least one day stays on (default: the day of the start
//    date). 3. Monthly: "On" + Select of the day ("Day 5"); days 29-31 say what happens in shorter
//    months. 4. "Ends" (ui/label) radiogroup, 8 apart: Never, On <date> (Date Picker), After <n>
//    times (Number Input); changing the date or the count picks its radio. 5. Summary
//    (body/small, muted, aria-live="polite"): "Every week on Monday, Wednesday and Friday, until
//    31 Dec 2026". Read it back in confirmations; `describeRecurrence` gives the same sentence and
//    `toRRule` the RFC 5545 rule for the server. Dates are local days in the account time zone.
// Code differs from Figma in one place: Figma writes the end date and count into the radio labels
// ("On 31 Dec 2026", "After 12 times"); here they are a Date Picker and a Number Input next to the
// radios, so people can change them.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_LOCALE, formatShortDate, weekdayLabels } from './calendar-date';
import { DatePicker } from './date-picker';
import { NumberInput } from './number-input';
import { RadioGroup, RadioGroupItem } from './radio';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';
/** Day of the week as Date.getDay(): 0 Sunday ... 6 Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type RecurrenceEnd = { type: 'never' } | { type: 'on'; date: Date } | { type: 'after'; count: number };

export interface Recurrence {
  frequency: RecurrenceFrequency;
  /** Every N days, weeks or months (1 or more). */
  interval: number;
  /** Weekly: the days, at least one. */
  weekdays: Weekday[];
  /** Monthly: day of the month, 1-31. */
  monthDay: number;
  end: RecurrenceEnd;
}

const UNIT: Record<RecurrenceFrequency, [string, string]> = { daily: ['day', 'days'], weekly: ['week', 'weeks'], monthly: ['month', 'months'] };
const RRULE_FREQ: Record<RecurrenceFrequency, string> = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY' };
const RRULE_DAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

/** Full weekday name of a Date.getDay() index in the locale ("Monday"). */
function weekdayName(day: Weekday, locale = DEFAULT_LOCALE) {
  // 2026-10-04 is a Sunday.
  return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date(2026, 9, 4 + day));
}

/** Weekdays in week order (Monday first by default), for lists and the summary. */
function weekOrder(days: Weekday[], weekStartsOn: Weekday = 1) {
  return [...days].sort((a, b) => ((a - weekStartsOn + 7) % 7) - ((b - weekStartsOn + 7) % 7));
}

/** The summary sentence: "Every 2 weeks on Monday and Thursday, until 31 Dec 2026". */
function describeRecurrence(rule: Recurrence, locale = DEFAULT_LOCALE, weekStartsOn: Weekday = 1) {
  const n = Math.max(1, Math.round(rule.interval));
  const [one, many] = UNIT[rule.frequency];
  let text = n === 1 ? `Every ${one}` : `Every ${n} ${many}`;
  if (rule.frequency === 'weekly' && rule.weekdays.length) {
    const names = weekOrder(rule.weekdays, weekStartsOn).map(d => weekdayName(d, locale));
    text += ` on ${new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(names).replace(/, and /, ' and ')}`;
  }
  if (rule.frequency === 'monthly') {
    text += ` on day ${rule.monthDay}`;
    if (rule.monthDay > 28) text += ' (the last day in shorter months)';
  }
  if (rule.end.type === 'on') text += `, until ${formatShortDate(rule.end.date, locale)}`;
  if (rule.end.type === 'after') text += `, ${rule.end.count} ${rule.end.count === 1 ? 'time' : 'times'}`;
  return text;
}

/** RFC 5545 RRULE: "FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TH;UNTIL=20261231". */
function toRRule(rule: Recurrence) {
  const parts = [`FREQ=${RRULE_FREQ[rule.frequency]}`];
  if (rule.interval > 1) parts.push(`INTERVAL=${rule.interval}`);
  if (rule.frequency === 'weekly' && rule.weekdays.length) parts.push(`BYDAY=${weekOrder(rule.weekdays).map(d => RRULE_DAY[d]).join(',')}`);
  if (rule.frequency === 'monthly') parts.push(rule.monthDay > 28 ? `BYMONTHDAY=${Array.from({ length: rule.monthDay - 27 }, (_, i) => 28 + i).join(',')};BYSETPOS=-1` : `BYMONTHDAY=${rule.monthDay}`);
  if (rule.end.type === 'on') {
    const d = rule.end.date;
    parts.push(`UNTIL=${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`);
  }
  if (rule.end.type === 'after') parts.push(`COUNT=${rule.end.count}`);
  return parts.join(';');
}

export interface RecurrencePickerProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** The rule (controlled). */
  value?: Recurrence;
  /** The rule to start from; missing parts come from startDate. */
  defaultValue?: Partial<Recurrence>;
  onValueChange?: (value: Recurrence) => void;
  /** First occurrence: the default weekday, day of the month and end date (+1 year). Pass a fixed date. */
  startDate?: Date;
  /** Figma Show summary. */
  showSummary?: boolean;
  /** Frequencies offered in the unit Select. */
  frequencies?: RecurrenceFrequency[];
  locale?: string;
  weekStartsOn?: Weekday;
  /** Highest interval and count. */
  maxInterval?: number;
  maxCount?: number;
  /** Summary text; default describeRecurrence. */
  summary?: (rule: Recurrence) => string;
  disabled?: boolean;
  /** Visible labels, translated by the app. */
  labels?: Partial<{ repeatEvery: string; unit: string; days: string; on: string; ends: string; never: string; onDate: string; endDate: string; after: string; times: string; count: string; interval: string }>;
}

const defaultLabels = {
  repeatEvery: 'Repeat every',
  unit: 'Repeat unit',
  days: 'Days',
  on: 'On',
  ends: 'Ends',
  never: 'Never',
  onDate: 'On',
  endDate: 'End date',
  after: 'After',
  times: 'times',
  count: 'Number of times',
  interval: 'Interval',
};

function RecurrencePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  startDate,
  showSummary = true,
  frequencies = ['daily', 'weekly', 'monthly'],
  locale = DEFAULT_LOCALE,
  weekStartsOn = 1,
  maxInterval = 99,
  maxCount = 999,
  summary = rule => describeRecurrence(rule, locale, weekStartsOn),
  disabled = false,
  labels: labelsProp,
  className,
  ...props
}: RecurrencePickerProps) {
  const id = React.useId();
  const L = { ...defaultLabels, ...labelsProp };
  const [start] = React.useState(() => startDate ?? new Date());
  const [inner, setInner] = React.useState<Recurrence>(() => ({
    frequency: 'weekly',
    interval: 1,
    weekdays: [start.getDay() as Weekday],
    monthDay: start.getDate(),
    end: { type: 'never' },
    ...defaultValue,
  }));
  const rule = valueProp ?? inner;
  // The end date and count stay remembered while another end is picked.
  const [endDate, setEndDate] = React.useState<Date>(() => (rule.end.type === 'on' ? rule.end.date : new Date(start.getFullYear() + 1, start.getMonth(), start.getDate())));
  const [count, setCount] = React.useState(() => (rule.end.type === 'after' ? rule.end.count : 12));

  const update = (patch: Partial<Recurrence>) => {
    const next = { ...rule, ...patch };
    setInner(next);
    onValueChange?.(next);
  };

  const days = weekdayLabels(locale, weekStartsOn).map((d, i) => ({ ...d, day: ((weekStartsOn + i) % 7) as Weekday }));

  return (
    <div data-slot="recurrence-picker" data-frequency={rule.frequency} className={cn('flex w-full min-w-0 flex-col gap-4 text-foreground', className)} {...props}>
      <fieldset disabled={disabled} className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
        <div data-slot="recurrence-repeat" className="flex min-w-0 items-center gap-2">
          <label htmlFor={`${id}-interval`} className="shrink-0 text-sm leading-5 whitespace-nowrap">{L.repeatEvery}</label>
          <NumberInput
            id={`${id}-interval`}
            min={1}
            max={maxInterval}
            value={rule.interval}
            onValueChange={n => update({ interval: n })}
            decrementLabel={`Decrease ${L.interval.toLocaleLowerCase()}`}
            incrementLabel={`Increase ${L.interval.toLocaleLowerCase()}`}
            disabled={disabled}
            className="w-24 shrink-0"
          />
          <Select value={rule.frequency} onValueChange={v => update({ frequency: v as RecurrenceFrequency })} disabled={disabled}>
            <SelectTrigger aria-label={L.unit} className="min-w-0 flex-1">
              {UNIT[rule.frequency][rule.interval === 1 ? 0 : 1]}
            </SelectTrigger>
            <SelectContent>
              {frequencies.map(f => <SelectItem key={f} value={f}>{rule.interval === 1 ? UNIT[f][0] : UNIT[f][1]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {rule.frequency === 'weekly' ? (
          <ToggleGroup
            type="multiple"
            aria-label={L.days}
            disabled={disabled}
            value={rule.weekdays.map(String)}
            onValueChange={v => {
              // Weekly needs at least one day.
              if (!v.length) return;
              update({ weekdays: v.map(Number) as Weekday[] });
            }}
            data-slot="recurrence-days"
          >
            {days.map(d => (
              <ToggleGroupItem key={d.day} value={String(d.day)} label={d.short.slice(0, 1)} aria-label={d.long} />
            ))}
          </ToggleGroup>
        ) : null}

        {rule.frequency === 'monthly' ? (
          <div data-slot="recurrence-month-day" className="flex min-w-0 items-center gap-2">
            <span id={`${id}-on`} className="shrink-0 text-sm leading-5">{L.on}</span>
            <Select value={String(rule.monthDay)} onValueChange={v => update({ monthDay: Number(v) })} disabled={disabled}>
              <SelectTrigger aria-labelledby={`${id}-on ${id}-on-value`} className="min-w-0 flex-1">
                <span id={`${id}-on-value`}>Day {rule.monthDay}</span>
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <SelectItem key={d} value={String(d)}>Day {d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div data-slot="recurrence-ends" className="flex min-w-0 flex-col gap-2">
          <span id={`${id}-ends`} className="text-sm leading-5 font-medium">{L.ends}</span>
          <RadioGroup
            aria-labelledby={`${id}-ends`}
            value={rule.end.type}
            disabled={disabled}
            onValueChange={t => update({ end: t === 'on' ? { type: 'on', date: endDate } : t === 'after' ? { type: 'after', count } : { type: 'never' } })}
            className="gap-2"
          >
            <RadioGroupItem value="never" label={L.never} />
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <RadioGroupItem value="on" label={L.onDate} />
              <DatePicker
                size="sm"
                value={endDate}
                today={start}
                locale={locale}
                label={L.endDate}
                disabled={disabled}
                onValueChange={d => {
                  setEndDate(d);
                  update({ end: { type: 'on', date: d } });
                }}
                className="w-40"
              />
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <RadioGroupItem value="after" label={L.after} />
              <NumberInput
                size="sm"
                min={1}
                max={maxCount}
                value={count}
                aria-label={L.count}
                decrementLabel="Fewer times"
                incrementLabel="More times"
                disabled={disabled}
                onValueChange={n => {
                  setCount(n);
                  update({ end: { type: 'after', count: n } });
                }}
              />
              <span className="text-sm leading-5">{L.times}</span>
            </div>
          </RadioGroup>
        </div>
      </fieldset>

      {showSummary ? (
        <p data-slot="recurrence-summary" aria-live="polite" className="m-0 text-sm leading-5 text-muted-foreground">
          {summary(rule)}
        </p>
      ) : null}
    </div>
  );
}

export { RecurrencePicker, describeRecurrence, toRRule, weekdayName };
