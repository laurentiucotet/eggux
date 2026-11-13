// EGG UI Time Zone Picker. Code only (no Figma component yet). A searchable list of time zones, each
// with the current local time there and its offset from UTC ("Berlin, Europe, 14:00, GMT+2"), plus a
// "Tomorrow" or "Yesterday" hint when the date differs from the selected zone. Built with the
// WAI-ARIA combobox pattern on an always-open listbox: focus stays in the search field, Up and Down
// move the highlighted zone, Enter picks it, Escape clears the search. Times and offsets come from
// Intl (no zone database shipped), so daylight saving is right for the given `now`. Pass `now` to
// freeze the time (tests, previews); without it the list refreshes every minute. Use inside a
// Popover for a compact field, or on its own in a settings page.
import * as React from 'react';
import { Check, Search } from '@/components/icons';
import { cn } from '@/lib/utils';

export const DEFAULT_TIME_ZONES = [
  'Pacific/Honolulu',
  'America/Anchorage',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'UTC',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Bucharest',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export interface TimeZonePickerProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Selected zone, an IANA name ("Europe/Berlin"). Controlled when given. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (zone: string) => void;
  /** Zones offered. Default: 21 zones spread over the world. Unknown names are left out. */
  zones?: string[];
  /** The current time. When given the list is frozen at this moment; otherwise it refreshes every minute. */
  now?: Date;
  /** 12-hour clock (2:00 PM). Default false (14:00). */
  hour12?: boolean;
  locale?: string;
  /** Accessible name of the list. Default "Time zones". */
  label?: string;
  /** Placeholder and accessible name of the search field. Default "Search time zones". */
  searchLabel?: string;
  /** Height of the list in px before it scrolls. Default 256. */
  listHeight?: number;
  /** Texts translated by the app. */
  labels?: { tomorrow?: string; yesterday?: string; empty?: string; count?: (n: number) => string };
}

interface ZoneInfo {
  zone: string;
  city: string;
  region: string;
  offsetMinutes: number;
  offsetLabel: string;
  time: string;
  dayKey: string;
  search: string;
}

function parseOffset(text: string) {
  // "GMT", "GMT+02:00", "GMT-03:30"
  const m = /GMT([+-])(\d{2}):?(\d{2})?/.exec(text);
  if (!m) return 0;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

function describeZone(zone: string, now: Date, locale: string, hour12: boolean): ZoneInfo | null {
  try {
    const parts = zone.split('/');
    const city = (parts[parts.length - 1] ?? zone).replace(/_/g, ' ');
    const region = parts.length > 1 ? parts[0]!.replace(/_/g, ' ') : '';
    const offsetMinutes = parseOffset(new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' }).format(now));
    const offsetLabel = offsetMinutes === 0 ? 'UTC' : `UTC${offsetMinutes < 0 ? '-' : '+'}${Math.floor(Math.abs(offsetMinutes) / 60)}${Math.abs(offsetMinutes) % 60 ? `:${String(Math.abs(offsetMinutes) % 60).padStart(2, '0')}` : ''}`;
    const time = new Intl.DateTimeFormat(locale, { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: hour12 ? 'h12' : 'h23' }).format(now);
    const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    return { zone, city, region, offsetMinutes, offsetLabel, time, dayKey, search: `${city} ${region} ${zone} ${offsetLabel}`.toLowerCase() };
  } catch {
    return null;
  }
}

const dayNumber = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y!, m! - 1, d!) / 86_400_000;
};

function TimeZonePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  zones = DEFAULT_TIME_ZONES,
  now,
  hour12 = false,
  locale = 'en-GB',
  label = 'Time zones',
  searchLabel = 'Search time zones',
  listHeight = 256,
  labels,
  className,
  ...props
}: TimeZonePickerProps) {
  const t = {
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    empty: 'No time zones match',
    count: (n: number) => (n === 1 ? '1 time zone' : `${n} time zones`),
    ...labels,
  };
  const [inner, setInner] = React.useState<string | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;

  const frozen = now !== undefined;
  const [tick, setTick] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (frozen) return;
    const id = window.setInterval(() => setTick(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [frozen]);
  const current = frozen ? now.getTime() : Math.floor(tick / 60_000) * 60_000;

  const infos = React.useMemo(
    () =>
      zones
        .map(z => describeZone(z, new Date(current), locale, hour12))
        .filter((x): x is ZoneInfo => x !== null)
        .sort((a, b) => a.offsetMinutes - b.offsetMinutes || a.city.localeCompare(b.city)),
    [zones, current, locale, hour12],
  );

  const [query, setQuery] = React.useState('');
  const needle = query.trim().toLowerCase();
  const shown = needle ? infos.filter(i => i.search.includes(needle)) : infos;

  const [activeZone, setActiveZone] = React.useState<string | undefined>(value);
  const active = shown.find(i => i.zone === activeZone) ?? shown.find(i => i.zone === value) ?? shown[0];

  const reference = infos.find(i => i.zone === value) ?? infos.find(i => i.zone === 'UTC');
  const dayHint = (info: ZoneInfo) => {
    if (!reference) return '';
    const diff = dayNumber(info.dayKey) - dayNumber(reference.dayKey);
    return diff === 1 ? t.tomorrow : diff === -1 ? t.yesterday : '';
  };

  const uid = React.useId();
  const listId = `${uid}-list`;
  const optionId = (zone: string) => `${uid}-${zone.replace(/[^A-Za-z0-9]/g, '-')}`;
  const listRef = React.useRef<HTMLUListElement>(null);

  // Keep the highlighted zone in view by moving the list's own scroll (never the page).
  React.useEffect(() => {
    const list = listRef.current;
    const el = active ? (list?.querySelector(`[id="${optionId(active.zone)}"]`) as HTMLElement | null) : null;
    if (!list || !el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
  }, [active?.zone]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (zone: string) => {
    if (valueProp === undefined) setInner(zone);
    setActiveZone(zone);
    onValueChange?.(zone);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const i = active ? shown.indexOf(active) : -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = shown[Math.min(Math.max(i + (e.key === 'ArrowDown' ? 1 : -1), 0), shown.length - 1)];
      if (next) setActiveZone(next.zone);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active) pick(active.zone);
    } else if (e.key === 'Escape' && query) {
      e.preventDefault();
      setQuery('');
    }
  };

  return (
    <div data-slot="time-zone-picker" className={cn('flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 shrink-0 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          role="combobox"
          aria-label={searchLabel}
          aria-expanded={shown.length > 0}
          aria-controls={shown.length > 0 ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={active ? optionId(active.zone) : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder={searchLabel}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex h-[var(--control-height)] w-full min-w-0 rounded-input border border-input bg-background pr-3 pl-9 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] duration-[var(--duration-fast)] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] md:text-sm"
        />
      </div>
      <p role="status" className="sr-only">{shown.length ? t.count(shown.length) : t.empty}</p>
      {shown.length === 0 ? (
        <p className="m-0 rounded-lg border border-border bg-popover px-3 py-6 text-center text-sm leading-5 text-muted-foreground">{`${t.empty} "${query.trim()}"`}</p>
      ) : (
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={-1}
        aria-label={label}
        style={{ maxHeight: listHeight }}
        className="relative m-0 min-w-0 list-none overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground"
      >
        {shown.map(info => {
          const selected = info.zone === value;
          const isActive = info.zone === active?.zone;
          const hint = dayHint(info);
          return (
            <li
              key={info.zone}
              id={optionId(info.zone)}
              role="option"
              aria-selected={selected}
              data-zone={info.zone}
              data-active={isActive || undefined}
              onMouseDown={e => e.preventDefault()}
              onClick={() => pick(info.zone)}
              className={cn('flex min-w-0 cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm leading-5', isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60')}
            >
              <Check aria-hidden="true" className={cn('size-4 shrink-0', selected ? 'opacity-100' : 'opacity-0')} />
              <span className="min-w-0 flex-1">
                <span className={cn('block truncate', selected && 'font-medium')}>{info.city}</span>
                <span className={cn("block truncate text-xs leading-4", isActive ? "text-accent-foreground" : "text-muted-foreground")}>{info.region ? `${info.region} · ${info.offsetLabel}` : info.offsetLabel}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-medium tabular-nums">{info.time}</span>
                <span className={cn("block h-4 text-xs leading-4", isActive ? "text-accent-foreground" : "text-muted-foreground")}>{hint}</span>
              </span>
            </li>
          );
        })}
      </ul>
      )}
    </div>
  );
}

export { TimeZonePicker };
