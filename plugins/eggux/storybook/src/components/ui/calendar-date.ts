// Date math for the Calendar page (Calendar, Month Picker, Date Range Picker, Date Time Picker).
// No date library: native Date and Intl only. All functions work on local dates and never mutate
// their arguments. Weeks start on Monday by default (weekStartsOn 1; 0 = Sunday).

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface DateRange {
  from?: Date;
  to?: Date;
}

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

/** Adds months and keeps the day when the target month has it, otherwise the last day (31 Jan + 1 = 28 Feb). */
export function addMonths(d: Date, n: number) {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const day = Math.min(d.getDate(), daysInMonth(target.getFullYear(), target.getMonth()));
  return new Date(target.getFullYear(), target.getMonth(), day);
}
export const addYears = (d: Date, n: number) => addMonths(d, n * 12);

export const isSameDay = (a?: Date, b?: Date) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
export const compareDays = (a: Date, b: Date) => startOfDay(a).getTime() - startOfDay(b).getTime();
export const isBefore = (a: Date, b: Date) => compareDays(a, b) < 0;
export const isAfter = (a: Date, b: Date) => compareDays(a, b) > 0;
export const isBetween = (d: Date, from: Date, to: Date) => compareDays(d, from) > 0 && compareDays(d, to) < 0;

/** Number of days from `from` to `to`, both included (6 Oct to 19 Oct = 14). */
export function daysBetweenInclusive(from: Date, to: Date) {
  // Round, because a daylight saving change makes a day 23 or 25 hours long.
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / 86_400_000) + 1;
}

export function startOfWeek(d: Date, weekStartsOn: WeekStart = 1) {
  const diff = (d.getDay() - weekStartsOn + 7) % 7;
  return addDays(d, -diff);
}
export const endOfWeek = (d: Date, weekStartsOn: WeekStart = 1) => addDays(startOfWeek(d, weekStartsOn), 6);

/** Weeks of a month as arrays of 7 dates, from the week of the 1st to the week of the last day (5 or 6 rows). */
export function monthGrid(year: number, month: number, weekStartsOn: WeekStart = 1): Date[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month, daysInMonth(year, month));
  const weeks: Date[][] = [];
  let cursor = startOfWeek(first, weekStartsOn);
  while (compareDays(cursor, last) <= 0) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(cursor, i)));
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

/** ISO 8601 week number (weeks start on Monday, week 1 holds the first Thursday of the year). */
export function isoWeek(d: Date) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/** Stable key for data attributes: 2026-10-22. */
export const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Locale names. The default locale has a Monday week start and 24 h times.
export const DEFAULT_LOCALE = 'en-GB';

/** Two-letter weekday headers in week order: Mo Tu We Th Fr Sa Su. */
export function weekdayLabels(locale = DEFAULT_LOCALE, weekStartsOn: WeekStart = 1) {
  const fmtShort = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const fmtLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  // 2026-10-04 is a Sunday.
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 9, 4 + ((weekStartsOn + i) % 7));
    return { short: fmtShort.format(d).replace(/\.$/, '').slice(0, 2), long: fmtLong.format(d) };
  });
}

export const formatMonthYear = (d: Date, locale = DEFAULT_LOCALE) => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d);
// English short months follow Figma ("Sep", never en-GB's "Sept"): three letters for every month.
const shortParts = (fmt: Intl.DateTimeFormat, d: Date) =>
  fmt.formatToParts(d).map(p => (p.type === 'month' && p.value === 'Sept' ? 'Sep' : p.value)).join('');
export const formatMonthShort = (monthIndex: number, locale = DEFAULT_LOCALE) => shortParts(new Intl.DateTimeFormat(locale, { month: 'short' }), new Date(2026, monthIndex, 1));
export const formatMonthLong = (monthIndex: number, locale = DEFAULT_LOCALE) => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2026, monthIndex, 1));
/** Full label for screen readers: "Thursday 22 October 2026". */
export const formatFullDate = (d: Date, locale = DEFAULT_LOCALE) => new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
/** Value of a Date Picker: "22 Oct 2026". */
export const formatShortDate = (d: Date, locale = DEFAULT_LOCALE) => shortParts(new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }), d);
const formatDayMonth = (d: Date, locale = DEFAULT_LOCALE) => shortParts(new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }), d);

/** "6 Oct to 19 Oct 2026": the year goes once at the end when both dates share it. */
export function formatRangeText(range: DateRange, locale = DEFAULT_LOCALE) {
  if (!range.from) return '';
  if (!range.to) return formatShortDate(range.from, locale);
  if (range.from.getFullYear() === range.to.getFullYear()) return `${formatDayMonth(range.from, locale)} to ${formatShortDate(range.to, locale)}`;
  return `${formatShortDate(range.from, locale)} to ${formatShortDate(range.to, locale)}`;
}

// Times as minutes since midnight, written "HH:MM".
export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const fromMinutes = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
export function timeOptions(stepMinutes = 30, startMinutes = 0, endMinutes = 24 * 60 - stepMinutes) {
  const out: string[] = [];
  for (let m = startMinutes; m <= endMinutes; m += stepMinutes) out.push(fromMinutes(m));
  return out;
}
/** "14:30" in 24 h, "2:30 PM" in 12 h. */
export function formatTime(hhmm: string, hour12 = false, locale = DEFAULT_LOCALE) {
  if (!hour12) return hhmm;
  const m = toMinutes(hhmm);
  return new Intl.DateTimeFormat(locale === DEFAULT_LOCALE ? 'en-US' : locale, { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(2026, 0, 1, Math.floor(m / 60), m % 60));
}
/** "1 h 30 min", "45 min", "2 h". */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(' ') || '0 min';
}
export const timeOfDate = (d: Date) => fromMinutes(d.getHours() * 60 + d.getMinutes());
export function withTime(d: Date, hhmm: string) {
  const m = toMinutes(hhmm);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60);
}
