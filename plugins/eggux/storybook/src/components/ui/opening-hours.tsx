// EGG UI Opening Hours. Code only (no Figma component yet). A week table (Monday to Sunday) with
// today highlighted, a one line summary ("Open now. Closes at 18:00" or "Closed. Opens tomorrow at
// 09:00") and exceptions (a holiday with its own hours or closed). The status is computed from a
// fixed `now` ("2026-11-13T14:30", the local time at the place, no time zone math), so the same
// data gives the same text in every browser and test. Days can have several ranges (lunch break).
// Hours are 24 h by default or 12 h with AM and PM. Built on Badge.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export interface HoursRange {
  /** "09:00" (24 h). */
  open: string;
  /** "18:00"; "24:00" is midnight at the end of the day. */
  close: string;
}
export interface HoursException {
  /** "2026-12-25". */
  date: string;
  /** "Christmas Day". */
  label: string;
  /** Empty = closed that day. */
  ranges: HoursRange[];
}

export interface OpeningHoursProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Seven entries, Monday first. An empty list is a closed day. */
  hours: HoursRange[][];
  /** The moment to judge by, local time at the place: "2026-11-13T14:30". */
  now: string;
  exceptions?: HoursException[];
  /** 24 or 12 hour clock. Default 24. */
  hourFormat?: '24' | '12';
  /** The summary line and badge above the table. Default true. */
  showSummary?: boolean;
  /** Minutes before closing that count as "Closing soon". Default 60. */
  closingSoonMinutes?: number;
  /** Accessible caption of the table. */
  caption?: string;
}

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Day {
  y: number;
  mo: number;
  d: number;
}
const pad = (n: number) => String(n).padStart(2, '0');
const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};
const keyOf = (day: Day) => `${day.y}-${pad(day.mo)}-${pad(day.d)}`;
// Monday is 0.
const weekday = (day: Day) => (new Date(Date.UTC(day.y, day.mo - 1, day.d)).getUTCDay() + 6) % 7;
function addDays(day: Day, n: number): Day {
  const t = new Date(Date.UTC(day.y, day.mo - 1, day.d + n));
  return { y: t.getUTCFullYear(), mo: t.getUTCMonth() + 1, d: t.getUTCDate() };
}
function parseNow(now: string): { day: Day; minutes: number } {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(now);
  if (!m) return { day: { y: 2026, mo: 1, d: 5 }, minutes: 720 };
  return { day: { y: Number(m[1]), mo: Number(m[2]), d: Number(m[3]) }, minutes: Number(m[4]) * 60 + Number(m[5]) };
}
function formatTime(t: string, format: '24' | '12') {
  const [h, m] = t.split(':').map(Number);
  if (format === '24') return `${pad(h === 24 ? 24 : h)}:${pad(m || 0)}`;
  const hour = h % 24;
  return `${hour % 12 || 12}:${pad(m || 0)} ${hour < 12 ? 'AM' : 'PM'}`;
}
function formatRanges(ranges: HoursRange[], format: '24' | '12') {
  if (ranges.length === 0) return 'Closed';
  return ranges.map(r => `${formatTime(r.open, format)} – ${formatTime(r.close, format)}`).join(', ');
}
const longDate = (day: Day) =>
  new Date(Date.UTC(day.y, day.mo - 1, day.d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

function OpeningHours({ hours, now, exceptions = [], hourFormat = '24', showSummary = true, closingSoonMinutes = 60, caption = 'Opening hours', className, ...props }: OpeningHoursProps) {
  const { day: today, minutes } = parseNow(now);
  const resolve = (day: Day) => {
    const exception = exceptions.find(e => e.date === keyOf(day));
    return { ranges: exception ? exception.ranges : (hours[weekday(day)] ?? []), exception };
  };

  const todayHours = resolve(today);
  const current = todayHours.ranges.find(r => toMin(r.open) <= minutes && minutes < toMin(r.close));
  let summary: string;
  let tone: 'open' | 'soon' | 'closed' = 'closed';
  if (current) {
    const left = toMin(current.close) - minutes;
    tone = left <= closingSoonMinutes ? 'soon' : 'open';
    summary = `Closes at ${formatTime(current.close, hourFormat)}`;
  } else {
    const later = todayHours.ranges.find(r => toMin(r.open) > minutes);
    if (later) {
      summary = `Opens today at ${formatTime(later.open, hourFormat)}`;
    } else {
      summary = 'Closed this week';
      for (let i = 1; i <= 7; i++) {
        const day = addDays(today, i);
        const next = resolve(day).ranges[0];
        if (next) {
          summary = `Opens ${i === 1 ? 'tomorrow' : dayNames[weekday(day)]} at ${formatTime(next.open, hourFormat)}`;
          break;
        }
      }
    }
  }

  // The week that holds today, Monday first.
  const monday = addDays(today, -weekday(today));
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const weekKeys = week.map(keyOf);
  const upcoming = exceptions
    .filter(e => e.date >= keyOf(today) && !weekKeys.includes(e.date))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div data-slot="opening-hours" className={cn('flex w-full max-w-sm min-w-0 flex-col gap-3 text-sm', className)} {...props}>
      {showSummary ? (
        <div role="status" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <Badge variant={tone === 'open' ? 'soft-success' : tone === 'soon' ? 'soft-warning' : 'soft-neutral'} size="lg" dot>
            {tone === 'open' ? 'Open now' : tone === 'soon' ? 'Closing soon' : 'Closed'}
          </Badge>
          <span className="min-w-0 text-foreground">{summary}</span>
        </div>
      ) : null}
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {week.map((day, i) => {
            const { ranges, exception } = resolve(day);
            const isToday = keyOf(day) === keyOf(today);
            return (
              <tr key={i} aria-current={isToday ? 'date' : undefined} className={cn('border-b border-border last:border-b-0', isToday && 'bg-muted font-medium')}>
                <th scope="row" className="py-2 pr-3 pl-2 text-left align-top font-[inherit] whitespace-nowrap">
                  {dayNames[i]}
                  {isToday ? <span className="sr-only"> (today)</span> : null}
                  {isToday ? <Badge aria-hidden="true" size="sm" variant="soft-info" className="ml-2 align-middle">Today</Badge> : null}
                </th>
                <td className="min-w-0 py-2 pr-2 text-right align-top tabular-nums">
                  <span className={cn(ranges.length === 0 && !isToday && 'text-muted-foreground')}>{formatRanges(ranges, hourFormat)}</span>
                  {exception ? <span className={cn('block text-xs font-normal', isToday ? 'text-foreground' : 'text-muted-foreground')}>{exception.label}</span> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {upcoming.length > 0 ? (
        <div data-slot="opening-hours-exceptions" className="flex flex-col gap-1">
          <p className="m-0 text-xs font-medium text-muted-foreground">Special hours</p>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {upcoming.map(e => (
              <li key={e.date} className="flex min-w-0 items-baseline justify-between gap-3">
                <span className="min-w-0">
                  {e.label} <span className="text-muted-foreground">({longDate({ y: Number(e.date.slice(0, 4)), mo: Number(e.date.slice(5, 7)), d: Number(e.date.slice(8, 10)) })})</span>
                </span>
                <span className="shrink-0 tabular-nums">{formatRanges(e.ranges, hourFormat)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export { OpeningHours };
