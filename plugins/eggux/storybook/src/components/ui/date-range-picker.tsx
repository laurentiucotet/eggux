// EGG UI Date Range Picker. Figma: Date Range Picker (Calendar page, "Date Range Picker /
// Component"). Presets slot (Show presets), Summary, 662 x 355: presets, two months (previous and
// current), a summary with the number of days, Cancel and Apply. Built from Button, Calendar and
// Menu Item (the presets are plain buttons here: Menu is not in code yet; TODO Menu Item).
// Future days are disabled for reports on past data (disableFuture); past days for bookings
// (disablePast). The draft range only becomes the value on Apply.
import * as React from 'react';
import { Check } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import {
  DEFAULT_LOCALE,
  addDays,
  addMonths,
  daysBetweenInclusive,
  formatRangeText,
  formatShortDate,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
  type DateRange,
} from './calendar-date';

export interface DateRangePreset {
  id: string;
  label: string;
  /** The period for a given today; leave out for "Custom". */
  range?: (today: Date) => Required<DateRange>;
}

const lastDays = (n: number) => (today: Date) => ({ from: addDays(today, -(n - 1)), to: today });

export const defaultPresets: DateRangePreset[] = [
  { id: 'today', label: 'Today', range: t => ({ from: t, to: t }) },
  { id: 'yesterday', label: 'Yesterday', range: t => ({ from: addDays(t, -1), to: addDays(t, -1) }) },
  { id: 'last-7', label: 'Last 7 days', range: lastDays(7) },
  { id: 'last-14', label: 'Last 14 days', range: lastDays(14) },
  { id: 'last-30', label: 'Last 30 days', range: lastDays(30) },
  { id: 'this-month', label: 'This month', range: t => ({ from: startOfMonth(t), to: t }) },
  { id: 'last-month', label: 'Last month', range: t => ({ from: addMonths(startOfMonth(t), -1), to: addDays(startOfMonth(t), -1) }) },
  { id: 'this-year', label: 'This year', range: t => ({ from: new Date(t.getFullYear(), 0, 1), to: t }) },
  { id: 'custom', label: 'Custom' },
];

export interface DateRangePickerProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** The applied period. Controlled when given. */
  value?: DateRange;
  defaultValue?: DateRange;
  /** Apply: the draft becomes the value. */
  onApply?: (range: Required<DateRange>) => void;
  onCancel?: () => void;
  /** Figma Show presets. */
  showPresets?: boolean;
  /** Figma Presets slot content: replace the default list. */
  presets?: DateRangePreset[];
  today?: Date;
  /** Future days cannot be picked (reports on past data). Default true, as in Figma. */
  disableFuture?: boolean;
  /** Past days cannot be picked (bookings). */
  disablePast?: boolean;
  locale?: string;
  labels?: { presets?: string; cancel?: string; apply?: string; pickFirst?: string; pickLast?: string; day?: string; days?: string; panel?: string };
}

function DateRangePicker({
  value,
  defaultValue,
  onApply,
  onCancel,
  showPresets = true,
  presets = defaultPresets,
  today: todayProp,
  disableFuture = true,
  disablePast = false,
  locale = DEFAULT_LOCALE,
  labels,
  className,
  ...props
}: DateRangePickerProps) {
  const t = { presets: 'Presets', cancel: 'Cancel', apply: 'Apply', pickFirst: 'Pick the first and the last day', pickLast: 'Pick the last day', day: 'day', days: 'days', panel: 'Choose a period', ...labels };
  const today = React.useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const initial = value ?? defaultValue ?? {};
  const [draft, setDraft] = React.useState<DateRange>(initial);
  const [month, setMonth] = React.useState(() => addMonths(startOfMonth(initial.to ?? initial.from ?? today), -1));

  const activePreset = React.useMemo(() => {
    if (!draft.from || !draft.to) return undefined;
    const match = presets.find(p => {
      const r = p.range?.(today);
      return r && isSameDay(r.from, draft.from) && isSameDay(r.to, draft.to);
    });
    return match?.id ?? presets.find(p => !p.range)?.id;
  }, [draft, presets, today]);

  const choose = (p: DateRangePreset) => {
    const r = p.range?.(today);
    if (!r) return;
    setDraft(r);
    setMonth(addMonths(startOfMonth(r.to), -1));
  };

  const complete = !!(draft.from && draft.to);
  const count = complete ? daysBetweenInclusive(draft.from!, draft.to!) : 0;
  const summary = complete
    ? `${count === 1 ? formatShortDate(draft.from!, locale) : formatRangeText(draft, locale).replace(' to ', ' - ')} · ${count} ${count === 1 ? t.day : t.days}`
    : draft.from ? t.pickLast : t.pickFirst;

  return (
    <div
      role="group"
      aria-label={t.panel}
      data-slot="date-range-picker"
      className={cn('flex w-[662px] max-w-full flex-col rounded-md border bg-popover text-popover-foreground shadow-md', className)}
      {...props}
    >
      <div className="flex min-w-0">
        {showPresets ? (
          <div role="group" aria-label={t.presets} data-slot="date-range-presets" className="flex w-40 shrink-0 flex-col border-r p-1">
            {presets.map(p => {
              const active = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(p)}
                  data-slot="date-range-preset"
                  className={cn(
                    'flex h-8 w-full items-center justify-between gap-2 rounded-md px-2 text-left text-sm text-foreground outline-none transition-[background-color,box-shadow] duration-[var(--duration-fast)] hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50',
                    active && 'bg-accent text-accent-foreground',
                  )}
                >
                  <span className="min-w-0 truncate">{p.label}</span>
                  {active ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        ) : null}
        <div className="min-w-0 flex-1 overflow-x-auto">
          <Calendar
            mode="range"
            months={2}
            today={today}
            locale={locale}
            range={draft}
            onRangeSelect={setDraft}
            month={month}
            onMonthChange={setMonth}
            disabled={d => (disableFuture && isAfter(d, today)) || (disablePast && isBefore(d, today))}
            className="border-0 bg-transparent"
          />
        </div>
      </div>
      <div data-slot="date-range-footer" className="flex items-center justify-between gap-3 border-t px-3 py-3">
        <p role="status" aria-live="polite" data-slot="date-range-summary" className="min-w-0 truncate text-sm text-muted-foreground">{summary}</p>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>{t.cancel}</Button>
          <Button type="button" size="sm" disabled={!complete} onClick={() => complete && onApply?.({ from: draft.from!, to: draft.to! })}>{t.apply}</Button>
        </div>
      </div>
    </div>
  );
}

export { DateRangePicker };
