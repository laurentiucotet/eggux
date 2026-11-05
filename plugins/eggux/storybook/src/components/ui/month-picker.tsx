// EGG UI Month Picker. Figma: Month Picker (Calendar page, "Month Picker / Component"). Type
// (month 3 x 4, quarter 2 x 2, year 12 years), Period ("2026") and Decade ("2020 to 2031") in the
// caption. Built from Button (previous and next, ghost icon) and Month Picker Cell. Arrows move
// by a year (by 12 years for Type=year). Value is the first day of the period. Same surface as
// Calendar: popover fill, border, radius md, padding 12, 250 wide (cells fill when it stretches).
// Keyboard (grid of buttons): arrows move between cells, Home and End the row, PageUp and
// PageDown change the year (the 12 years for Type=year), Enter and Space pick.
import * as React from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { MonthPickerCell, type MonthPickerCellState } from './month-picker-cell';
import { DEFAULT_LOCALE, formatMonthLong, formatMonthShort, startOfDay } from './calendar-date';

export type MonthPickerType = 'month' | 'quarter' | 'year';

export interface MonthPickerProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Figma Type. */
  type?: MonthPickerType;
  /** Picked period: any day of it, returned as its first day. Controlled when given. */
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  /** The day that marks the current month, quarter or year; the real today when not given. */
  today?: Date;
  /** Periods without data or in the future for reports; pass the first day of the period. */
  disabled?: (periodStart: Date) => boolean;
  locale?: string;
  /** Texts translated by the app. */
  labels?: { previous?: string; next?: string };
}

const ORDINALS = ['First', 'Second', 'Third', 'Fourth'];
const COLUMNS: Record<MonthPickerType, number> = { month: 3, quarter: 2, year: 3 };

function MonthPicker({
  type = 'month',
  value,
  defaultValue,
  onValueChange,
  today: todayProp,
  disabled,
  locale = DEFAULT_LOCALE,
  labels,
  className,
  ...props
}: MonthPickerProps) {
  const t = { previous: type === 'year' ? 'Previous 12 years' : 'Previous year', next: type === 'year' ? 'Next 12 years' : 'Next year', ...labels };
  const today = React.useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const [inner, setInner] = React.useState<Date | undefined>(defaultValue);
  const picked = value ?? inner;
  const [year, setYear] = React.useState((picked ?? today).getFullYear());
  // Type=year shows 12 years from the start of the decade ("2020 to 2031").
  const [decadeStart, setDecadeStart] = React.useState(Math.floor((picked ?? today).getFullYear() / 10) * 10);
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const keyboardMove = React.useRef(false);

  const cells = React.useMemo(() => {
    if (type === 'month') {
      return Array.from({ length: 12 }, (_, i) => ({ start: new Date(year, i, 1), label: formatMonthShort(i, locale), name: `${formatMonthShort(i, locale)}, ${formatMonthLong(i, locale)} ${year}` }));
    }
    if (type === 'quarter') {
      return Array.from({ length: 4 }, (_, i) => ({ start: new Date(year, i * 3, 1), label: `Q${i + 1}`, name: `Q${i + 1}, ${ORDINALS[i].toLowerCase()} quarter ${year}` }));
    }
    return Array.from({ length: 12 }, (_, i) => ({ start: new Date(decadeStart + i, 0, 1), label: String(decadeStart + i), name: String(decadeStart + i) }));
  }, [type, year, decadeStart, locale]);

  const same = (a: Date | undefined, b: Date) => {
    if (!a) return false;
    if (type === 'year') return a.getFullYear() === b.getFullYear();
    if (type === 'quarter') return a.getFullYear() === b.getFullYear() && Math.floor(a.getMonth() / 3) === Math.floor(b.getMonth() / 3);
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  };
  const selectedIndex = cells.findIndex(c => same(picked, c.start));
  const currentIndex = cells.findIndex(c => same(today, c.start));
  const tabIndex = focusIndex ?? (selectedIndex >= 0 ? selectedIndex : currentIndex >= 0 ? currentIndex : 0);

  React.useEffect(() => {
    if (!keyboardMove.current) return;
    keyboardMove.current = false;
    rootRef.current?.querySelector<HTMLElement>(`[data-index="${tabIndex}"]`)?.focus();
  }, [tabIndex, year, decadeStart]);

  const shift = (direction: -1 | 1) => {
    if (type === 'year') setDecadeStart(s => s + direction * 12);
    else setYear(y => y + direction);
  };

  const pick = (index: number) => {
    const cell = cells[index];
    if (disabled?.(cell.start)) return;
    setFocusIndex(index);
    setInner(cell.start);
    onValueChange?.(cell.start);
  };

  const cols = COLUMNS[type];
  const onKeyDown = (e: React.KeyboardEvent) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
    if (!target) return;
    const i = Number(target.dataset.index);
    let next = i;
    switch (e.key) {
      case 'ArrowLeft': next = Math.max(0, i - 1); break;
      case 'ArrowRight': next = Math.min(cells.length - 1, i + 1); break;
      case 'ArrowUp': next = i - cols >= 0 ? i - cols : i; break;
      case 'ArrowDown': next = i + cols < cells.length ? i + cols : i; break;
      case 'Home': next = i - (i % cols); break;
      case 'End': next = i - (i % cols) + cols - 1; break;
      case 'PageUp': shift(-1); break;
      case 'PageDown': shift(1); break;
      default: return;
    }
    e.preventDefault();
    keyboardMove.current = true;
    setFocusIndex(next);
  };

  const uid = React.useId();
  const caption = type === 'year' ? `${decadeStart} to ${decadeStart + 11}` : String(year);
  const rows = Array.from({ length: Math.ceil(cells.length / cols) }, (_, r) => cells.slice(r * cols, r * cols + cols).map((c, k) => ({ ...c, index: r * cols + k })));

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={type === 'month' ? 'Month picker' : type === 'quarter' ? 'Quarter picker' : 'Year picker'}
      data-slot="month-picker"
      data-type={type}
      className={cn('flex w-[250px] min-w-[250px] max-w-full flex-col gap-4 rounded-md border bg-popover p-3 text-popover-foreground', className)}
      {...props}
    >
      <div data-slot="month-picker-caption" className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" aria-label={t.previous} onClick={() => shift(-1)}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <p id={`${uid}-caption`} aria-live="polite" data-slot="month-picker-period" className="min-w-0 flex-1 truncate text-center text-sm font-medium leading-5 text-foreground">{caption}</p>
        <Button type="button" variant="ghost" size="icon" aria-label={t.next} onClick={() => shift(1)}>
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      <div role="grid" aria-labelledby={`${uid}-caption`} data-slot="month-picker-grid" className="flex flex-col gap-2" onKeyDown={onKeyDown}>
        {rows.map((row, r) => (
          <div key={r} role="row" className="flex gap-2">
            {row.map(c => {
              const isDisabled = !!disabled?.(c.start);
              const isSelected = c.index === selectedIndex;
              const state: MonthPickerCellState = isDisabled ? 'disabled' : isSelected ? 'selected' : c.index === currentIndex ? 'current' : 'default';
              return (
                <div key={c.index} role="gridcell" aria-selected={isSelected} className="flex min-w-0 flex-1">
                  <MonthPickerCell
                    state={state}
                    label={c.label}
                    data-index={c.index}
                    aria-label={c.name}
                    tabIndex={c.index === tabIndex ? 0 : -1}
                    // The current period is still marked when it is also the selected one.
                    {...(c.index === currentIndex ? { 'aria-current': 'date' as const } : {})}
                    onClick={() => pick(c.index)}
                    onFocus={() => setFocusIndex(c.index)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export { MonthPicker };
