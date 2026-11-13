// EGG UI Working Hours Editor. Code only (no Figma component yet). Seven weekday rows: a Switch that
// opens or closes the day, and "from" and "to" time selects in fixed steps (30 min by default). A
// closed day keeps its hours and shows "Closed" until it is switched on again. The "to" list only
// offers times after "from", and moving "from" past "to" pushes "to" along, so a day can never end
// before it starts. The Copy button of a row copies that day's hours to all days (a polite status
// announces it). The foot shows the weekly total. Times are native selects (one Tab stop each, the
// phone picker on mobile). Value is an array of seven days indexed like Date.getDay() (0 is Sunday),
// shown from `weekStartsOn`.
import * as React from 'react';
import { ChevronDown, Copy } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { Switch } from './switch';
import { DEFAULT_LOCALE, formatDuration, formatTime, fromMinutes, toMinutes, weekdayLabels, type WeekStart } from './calendar-date';

export interface WorkingDay {
  /** Open on this day. */
  enabled: boolean;
  /** Opening time "HH:MM". */
  from: string;
  /** Closing time "HH:MM" ("24:00" is midnight at the end of the day). */
  to: string;
}
/** Seven days indexed like Date.getDay(): 0 is Sunday, 1 Monday, 6 Saturday. */
export type WorkingHours = WorkingDay[];

export interface WorkingHoursEditorProps extends Omit<React.ComponentProps<'fieldset'>, 'onChange' | 'defaultValue'> {
  value?: WorkingHours;
  defaultValue?: WorkingHours;
  onValueChange?: (value: WorkingHours) => void;
  /** Minutes between the times offered. Default 30. */
  step?: 15 | 30 | 60;
  weekStartsOn?: WeekStart;
  /** 12-hour times (9:00 AM). Default false. */
  hour12?: boolean;
  locale?: string;
  /** Show the weekly total in the foot. Default true. */
  showTotal?: boolean;
  /** Show the Copy to all days button on each open day. Default true. */
  showCopy?: boolean;
  /** Accessible name of the group. Default "Working hours". */
  label?: string;
  /** Texts translated by the app. */
  labels?: {
    closed?: string;
    to?: string;
    opens?: string;
    closes?: string;
    copy?: (day: string) => string;
    copied?: (day: string) => string;
    total?: (duration: string) => string;
    noHours?: string;
  };
}

/** Monday to Friday 09:00 to 17:00, the weekend closed. */
export const defaultWorkingHours: WorkingHours = [0, 1, 2, 3, 4, 5, 6].map(d => ({ enabled: d >= 1 && d <= 5, from: '09:00', to: '17:00' }));

function TimeSelect({ label, value, options, onChange, hour12, locale }: { label: string; value: string; options: string[]; onChange: (v: string) => void; hour12: boolean; locale: string }) {
  return (
    <span className="relative inline-flex h-8 min-w-0 items-center rounded-input focus-within:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]">
      <select
        aria-label={label}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-8 w-24 min-w-0 cursor-pointer appearance-none truncate rounded-input border border-input bg-background pr-7 pl-2 text-sm text-foreground shadow-xs outline-none disabled:cursor-not-allowed"
      >
        {options.map(o => (
          <option key={o} value={o} className="bg-popover text-popover-foreground">{formatTime(o, hour12, locale)}</option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 size-4 shrink-0 text-muted-foreground" />
    </span>
  );
}

function WorkingHoursEditor({
  value: valueProp,
  defaultValue = defaultWorkingHours,
  onValueChange,
  step = 30,
  weekStartsOn = 1,
  hour12 = false,
  locale = DEFAULT_LOCALE,
  showTotal = true,
  showCopy = true,
  label = 'Working hours',
  labels,
  disabled,
  className,
  ...props
}: WorkingHoursEditorProps) {
  const t = {
    closed: 'Closed',
    to: 'to',
    opens: 'opens',
    closes: 'closes',
    copy: (day: string) => `Copy ${day} hours to all days`,
    copied: (day: string) => `${day} hours copied to all days`,
    total: (duration: string) => `Total ${duration} per week`,
    noHours: 'Closed all week',
    ...labels,
  };
  const [inner, setInner] = React.useState<WorkingHours>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const [notice, setNotice] = React.useState('');

  const commit = (next: WorkingHours) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };
  const update = (dow: number, patch: Partial<WorkingDay>) => {
    setNotice('');
    commit(value.map((d, i) => (i === dow ? { ...d, ...patch } : d)));
  };
  const setFrom = (dow: number, from: string) => {
    const day = value[dow]!;
    const to = toMinutes(day.to) <= toMinutes(from) ? fromMinutes(Math.min(1440, toMinutes(from) + step)) : day.to;
    update(dow, { from, to });
  };
  const copyToAll = (dow: number, dayName: string) => {
    const src = value[dow]!;
    commit(value.map(() => ({ ...src })));
    setNotice(t.copied(dayName));
  };

  const names = weekdayLabels(locale, weekStartsOn);
  const fromOptions = Array.from({ length: Math.floor(1440 / step) }, (_, i) => fromMinutes(i * step));
  const toOptions = (from: string) => Array.from({ length: Math.floor(1440 / step) }, (_, i) => (i + 1) * step).filter(m => m > toMinutes(from)).map(fromMinutes);
  const totalMinutes = value.reduce((sum, d) => sum + (d.enabled ? Math.max(0, toMinutes(d.to) - toMinutes(d.from)) : 0), 0);

  return (
    <fieldset data-slot="working-hours-editor" disabled={disabled} className={cn('m-0 flex w-full min-w-0 flex-col border-0 p-0', className)} {...props}>
      <legend className="sr-only">{label}</legend>
      <div className="flex min-w-0 flex-col divide-y divide-border">
        {names.map((n, i) => {
          const dow = (weekStartsOn + i) % 7;
          const day = value[dow]!;
          return (
            <div key={dow} data-day={dow} className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 py-2">
              <Switch size="sm" checked={day.enabled} onCheckedChange={enabled => update(dow, { enabled })} label={n.long} wrapperClassName="min-w-32 flex-1" />
              <div className="flex min-w-0 items-center gap-2">
                {day.enabled ? (
                  <>
                    <TimeSelect label={`${n.long} ${t.opens}`} value={day.from} options={fromOptions} onChange={v => setFrom(dow, v)} hour12={hour12} locale={locale} />
                    <span aria-hidden="true" className="shrink-0 text-sm leading-5 text-muted-foreground">{t.to}</span>
                    <TimeSelect label={`${n.long} ${t.closes}`} value={day.to} options={toOptions(day.from)} onChange={v => update(dow, { to: v })} hour12={hour12} locale={locale} />
                  </>
                ) : (
                  <span className="h-8 min-w-0 truncate text-sm leading-8 text-muted-foreground">{t.closed}</span>
                )}
                {showCopy ? (
                  <ButtonIcon variant="ghost" size="xs" icon={<Copy />} label={t.copy(n.long)} disabled={!day.enabled} onClick={() => copyToAll(dow, n.long)} />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {showTotal ? (
        <p className="m-0 border-t border-border pt-3 text-sm leading-5 font-medium text-foreground">{totalMinutes > 0 ? t.total(formatDuration(totalMinutes)) : t.noHours}</p>
      ) : null}
      <p role="status" className="sr-only">{notice}</p>
    </fieldset>
  );
}

export { WorkingHoursEditor };
