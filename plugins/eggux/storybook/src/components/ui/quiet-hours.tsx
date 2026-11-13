// EGG UI Quiet Hours. Code only (no Figma component yet); family Notifications.
// A schedule that mutes notifications: a Switch (Quiet hours on or off), two Selects for the start
// and end time (every 30 minutes, 24 hour clock; the end may be earlier than the start, which
// means "through the night"), seven weekday chips (a multi-select Toggle Group, Mon to Sun) and one summary sentence that says it all: "Muted 22:00 to 07:00 on weekdays".
// The summary is the only live region (polite), so each change is read once. Off: the controls
// sit in a disabled fieldset (they are disabled and fade together) and the summary reads "Quiet
// hours are off". Same start and end, or no day, shows what to fix in the summary instead of
// muting. Controlled with `value` or uncontrolled with `defaultValue`. The chips wrap under 276 px.
// Not for a one-off pause (that is Do Not Disturb).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { Switch } from './switch';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface QuietHoursValue {
  enabled: boolean;
  /** "22:00". */
  from: string;
  /** "07:00". */
  to: string;
  days: Weekday[];
}

const days: { key: Weekday; short: string; full: string }[] = [
  { key: 'mon', short: 'Mon', full: 'Monday' },
  { key: 'tue', short: 'Tue', full: 'Tuesday' },
  { key: 'wed', short: 'Wed', full: 'Wednesday' },
  { key: 'thu', short: 'Thu', full: 'Thursday' },
  { key: 'fri', short: 'Fri', full: 'Friday' },
  { key: 'sat', short: 'Sat', full: 'Saturday' },
  { key: 'sun', short: 'Sun', full: 'Sunday' },
];

const times = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);

const weekdays: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

/** "on weekdays", "every day", "on Mon, Wed and Fri". */
export function describeDays(selected: Weekday[]): string {
  const set = new Set(selected);
  if (set.size === 7) return 'every day';
  if (set.size === 5 && weekdays.every(d => set.has(d))) return 'on weekdays';
  if (set.size === 2 && set.has('sat') && set.has('sun')) return 'on weekends';
  const names = days.filter(d => set.has(d.key)).map(d => d.short);
  if (names.length === 1) return `on ${days.find(d => d.key === [...set][0])!.full}s`;
  return `on ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export function describeQuietHours(v: QuietHoursValue): string {
  if (!v.enabled) return 'Quiet hours are off';
  if (v.days.length === 0) return 'Choose at least one day';
  if (v.from === v.to) return 'Choose different start and end times';
  return `Muted ${v.from} to ${v.to} ${describeDays(v.days)}`;
}

export interface QuietHoursProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: QuietHoursValue;
  defaultValue?: QuietHoursValue;
  onValueChange?: (value: QuietHoursValue) => void;
  /** Label of the switch. Default "Quiet hours". */
  label?: string;
}

const initial: QuietHoursValue = { enabled: true, from: '22:00', to: '07:00', days: weekdays };

function QuietHours({ value: valueProp, defaultValue = initial, onValueChange, label = 'Quiet hours', className, ...props }: QuietHoursProps) {
  const [inner, setInner] = React.useState<QuietHoursValue>(defaultValue);
  const value = valueProp ?? inner;
  const set = (patch: Partial<QuietHoursValue>) => {
    const next = { ...value, ...patch };
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <div data-slot="quiet-hours" data-enabled={value.enabled || undefined} className={cn('flex w-full min-w-0 max-w-120 flex-col gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground', className)} {...props}>
      <Switch label={label} description="Pause notifications on a schedule." checked={value.enabled} onCheckedChange={enabled => set({ enabled })} />
      <fieldset disabled={!value.enabled} className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
        <legend className="sr-only">Schedule</legend>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <TimeSelect label="From" value={value.from} onChange={from => set({ from })} />
          <TimeSelect label="To" value={value.to} onChange={to => set({ to })} />
        </div>
        <ToggleGroup type="multiple" variant="default" size="default" aria-label="Days" value={value.days} onValueChange={d => set({ days: d as Weekday[] })} className="flex-wrap">
          {days.map(d => <ToggleGroupItem key={d.key} value={d.key} label={d.short} />)}
        </ToggleGroup>
      </fieldset>
      <p role="status" data-slot="quiet-hours-summary" className="m-0 text-sm leading-5 font-medium text-foreground">{describeQuietHours(value)}</p>
    </div>
  );
}

function TimeSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span aria-hidden="true" className="text-sm leading-5 text-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label} className="w-28" />
        <SelectContent className="max-h-60">
          {times.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

export { QuietHours };
