// EGG UI Scheduler page. Figma: Scheduler page (Time Slot has its own file).
// - Calendar Event: an event in day and week views. Card surface with a 4px left bar in the
//   calendar color (Series 1-4 = chart/1..4). Size default (title and time) or sm (one line, 30 min
//   or less). State: selected (2px ring while its details are open), dragging (shadow-lg). Status:
//   tentative (dashed outline on the page background), cancelled (muted fill, title struck through).
//   It is a button: click opens the details.
// - Gantt Bar: a task on a Gantt timeline. Status planned (dashed), in-progress (tint, edge and a
//   progress line), done (check), blocked (alert). The label truncates; the full name is the title.
// - Gantt Milestone: a diamond and its name.
// - Agenda Item: one event in a day agenda. State upcoming, now (accent fill, Now badge), past (muted).
// - Meeting Card: title, time, place, people, Join and Details. live: a Live badge and Join now in primary.
// - Availability Row: working hours for one weekday: switch, day, time ranges, add or remove a range.
import * as React from 'react';
import { Check, CircleAlert, Clock, Globe, Plus, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { MetaItem } from './meta-item';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { Switch } from './switch';

export type CalendarSeries = 1 | 2 | 3 | 4;

// Written out in full so Tailwind generates them.
const seriesBar: Record<CalendarSeries, string> = {
  1: 'border-l-[var(--chart-1)] outline-[var(--chart-1)]',
  2: 'border-l-[var(--chart-2)] outline-[var(--chart-2)]',
  3: 'border-l-[var(--chart-3)] outline-[var(--chart-3)]',
  4: 'border-l-[var(--chart-4)] outline-[var(--chart-4)]',
};
const seriesFill: Record<CalendarSeries, string> = {
  1: 'bg-[var(--chart-1)]',
  2: 'bg-[var(--chart-2)]',
  3: 'bg-[var(--chart-3)]',
  4: 'bg-[var(--chart-4)]',
};

/* Calendar Event */

export type CalendarEventState = 'default' | 'selected' | 'dragging';
export type CalendarEventStatus = 'confirmed' | 'tentative' | 'cancelled';

export interface CalendarEventProps extends Omit<React.ComponentProps<'button'>, 'title'> {
  title: string;
  /** "11:00 - 12:30"; while dragging, the new time. */
  time: string;
  /** Figma Series: the calendar color, chart/1..4. */
  series?: CalendarSeries;
  /** Figma Size: default (title and time) or sm (one line). */
  size?: 'default' | 'sm';
  /** Figma State. */
  state?: CalendarEventState;
  /** Figma Status. */
  status?: CalendarEventStatus;
}

const statusText: Record<CalendarEventStatus, string> = { confirmed: '', tentative: ', tentative', cancelled: ', cancelled' };

function CalendarEvent({ title, time, series = 1, size = 'default', state = 'default', status = 'confirmed', className, ...props }: CalendarEventProps) {
  const sm = size === 'sm';
  const cancelled = status === 'cancelled';
  return (
    <button
      type="button"
      data-slot="calendar-event"
      data-size={size}
      data-state={state}
      data-status={status}
      className={cn(
        'relative flex w-full min-w-0 overflow-clip rounded-r-sm border-l-4 pr-1.5 pl-2 text-left text-xs leading-4 shadow-xs outline-offset-0 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
        seriesBar[series],
        sm ? 'h-[22px] items-center gap-1 pt-0.5' : 'h-[46px] flex-col items-start gap-0.5 pt-1',
        cancelled ? 'bg-[var(--card-muted)]' : status === 'tentative' ? 'bg-background outline-1 -outline-offset-1 outline-dashed' : 'bg-card',
        state === 'selected' && 'outline-2 -outline-offset-2 outline-solid outline-ring',
        state === 'dragging' && 'shadow-lg',
        className,
      )}
      {...props}
    >
      <span className={cn('min-w-0 truncate font-medium', sm ? 'flex-1' : 'w-full', cancelled ? 'text-muted-foreground line-through' : 'text-card-foreground')}>{title}</span>
      <span className={cn('truncate text-muted-foreground', sm ? 'shrink-0' : 'w-full')}>
        <span className="sr-only">, </span>
        {time}
        <span className="sr-only">{statusText[status]}</span>
      </span>
    </button>
  );
}

/* Gantt Bar */

export type GanttStatus = 'planned' | 'in-progress' | 'done' | 'blocked';

export interface GanttBarProps extends React.ComponentProps<'div'> {
  label: string;
  /** Figma Status. */
  status?: GanttStatus;
  /** in-progress: 0 to 100, the bottom line. */
  progress?: number;
}

const ganttColor: Record<Exclude<GanttStatus, 'planned'>, string> = {
  'in-progress': 'bg-[var(--chart-1)]',
  done: 'bg-[var(--chart-6)]',
  blocked: 'bg-destructive',
};
const ganttText: Record<GanttStatus, string> = { planned: 'planned', 'in-progress': 'in progress', done: 'done', blocked: 'blocked' };

function GanttBar({ label, status = 'in-progress', progress = 60, className, ...props }: GanttBarProps) {
  const planned = status === 'planned';
  const fill = planned ? '' : ganttColor[status];
  const pct = status === 'in-progress' ? Math.max(0, Math.min(100, progress)) : 100;
  return (
    <div
      data-slot="gantt-bar"
      data-status={status}
      title={label}
      className={cn(
        'relative flex h-7 min-w-0 items-center gap-1.5 overflow-clip rounded-md pr-2 pl-3 text-xs leading-4',
        planned ? 'border border-dashed border-input text-muted-foreground' : 'text-foreground',
        className,
      )}
      {...props}
    >
      {!planned ? (
        <>
          <span aria-hidden="true" className={cn('absolute inset-0 opacity-20', fill)} />
          <span aria-hidden="true" className={cn('absolute inset-y-0 left-0 w-[3px]', fill)} />
          <span aria-hidden="true" data-slot="gantt-bar-progress" className={cn('absolute bottom-0 left-0 h-[3px]', fill)} style={{ width: `${pct}%` }} />
        </>
      ) : null}
      {status === 'done' ? <Check aria-hidden="true" className="relative size-3.5 shrink-0" /> : null}
      {status === 'blocked' ? <CircleAlert aria-hidden="true" className="relative size-3.5 shrink-0" /> : null}
      <span className="relative min-w-0 flex-1 truncate">
        {label}
        <span className="sr-only">, {ganttText[status]}{status === 'in-progress' ? `, ${pct}% done` : ''}</span>
      </span>
    </div>
  );
}

/* Gantt Milestone */

function GanttMilestone({ label, className, ...props }: React.ComponentProps<'div'> & { label: string }) {
  return (
    <div data-slot="gantt-milestone" className={cn('flex items-center gap-2 text-xs leading-4 whitespace-nowrap text-foreground', className)} {...props}>
      <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center">
        <span className="size-[11px] rotate-45 bg-foreground" />
      </span>
      <span>
        <span className="sr-only">Milestone: </span>
        {label}
      </span>
    </div>
  );
}

/* Agenda Item */

export type AgendaState = 'upcoming' | 'now' | 'past';

export interface AgendaItemProps extends Omit<React.ComponentProps<'a'>, 'title'> {
  start: string;
  end: string;
  title: string;
  /** Place and people: "Room 2 · 4 people". */
  meta?: string;
  /** Figma State. */
  state?: AgendaState;
  /** The calendar color of the bar. */
  series?: CalendarSeries;
  /** The event page. Without it the row is not a link. */
  href?: string;
}

function AgendaItem({ start, end, title, meta, state = 'upcoming', series = 1, href, className, ...props }: AgendaItemProps) {
  const past = state === 'past';
  const now = state === 'now';
  const Tag = (href ? 'a' : 'div') as 'a';
  return (
    <Tag
      href={href}
      data-slot="agenda-item"
      data-state={state}
      aria-current={now ? 'time' : undefined}
      className={cn(
        'flex w-100 max-w-full min-w-0 items-start gap-3 rounded-md px-3 py-2 outline-none',
        now && 'bg-accent',
        href && 'hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    >
      <span className={cn('flex w-12 shrink-0 flex-col whitespace-nowrap', past ? 'text-muted-foreground' : 'text-foreground')}>
        <span className="text-sm leading-5 font-medium">{start}</span>
        <span className={cn('text-xs leading-4', now ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>
          <span className="sr-only">to </span>
          {end}
        </span>
      </span>
      <span aria-hidden="true" className={cn('w-[3px] shrink-0 self-stretch rounded-full', past ? 'bg-border' : seriesFill[series])} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex w-full items-center gap-2">
          <span className={cn('min-w-0 flex-1 text-sm leading-5 font-medium', past ? 'text-muted-foreground' : 'text-foreground')}>{title}</span>
          {now ? <Badge variant="success">Now</Badge> : null}
        </span>
        {meta ? <span className={cn('text-xs leading-4', now ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>{meta}</span> : null}
      </span>
    </Tag>
  );
}

/* Meeting Card */

export interface MeetingCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: string;
  /** Time with time zone; recurring meetings say so here. */
  time: string;
  /** Place or video link name. */
  place?: string;
  /** Icon of the place line (Globe for a video call, MapPin for a room). */
  placeIcon?: React.ReactNode;
  /** An Avatar Group with the people invited. */
  people?: React.ReactNode;
  /** Figma State: live from 5 minutes before the start. */
  state?: 'upcoming' | 'live';
  onJoin?: () => void;
  onDetails?: () => void;
}

function MeetingCard({ title, time, place, placeIcon = <Globe />, people, state = 'upcoming', onJoin, onDetails, className, ...props }: MeetingCardProps) {
  const live = state === 'live';
  const join = live ? 'Join now' : 'Join';
  return (
    <div data-slot="meeting-card" data-state={state} className={cn('flex w-90 max-w-full min-w-60 flex-col gap-3 rounded-xl border border-border bg-card p-5 text-card-foreground', className)} {...props}>
      <div className="flex w-full items-center gap-2">
        <h3 className="m-0 min-w-0 flex-1 truncate text-lg leading-7 font-semibold">{title}</h3>
        {live ? <Badge variant="success">Live</Badge> : null}
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <MetaItem icon={<Clock />}>{time}</MetaItem>
        {place ? <MetaItem icon={placeIcon}>{place}</MetaItem> : null}
      </div>
      {people}
      <div className="flex w-full flex-wrap gap-2">
        <Button variant={live ? 'default' : 'outline'} aria-label={`${join}: ${title}`} onClick={onJoin}>
          {join}
        </Button>
        <Button variant="ghost" aria-label={`Details: ${title}`} onClick={onDetails}>
          Details
        </Button>
      </div>
    </div>
  );
}

/* Availability Row */

export interface TimeRange {
  start: string;
  end: string;
}

const halfHours = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);

export interface AvailabilityRowProps extends React.ComponentProps<'div'> {
  day: string;
  available?: boolean;
  onAvailableChange?: (available: boolean) => void;
  ranges?: TimeRange[];
  onRangesChange?: (ranges: TimeRange[]) => void;
  /** Times in the selects. Default: every 30 minutes. */
  times?: string[];
}

function AvailabilityRow({ day, available = true, onAvailableChange, ranges = [{ start: '09:00', end: '17:00' }], onRangesChange, times = halfHours, className, ...props }: AvailabilityRowProps) {
  const set = (i: number, patch: Partial<TimeRange>) => onRangesChange?.(ranges.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const add = () => {
    const last = ranges[ranges.length - 1];
    onRangesChange?.([...ranges, { start: last?.end ?? '09:00', end: last?.end ?? '17:00' }]);
  };
  return (
    <div data-slot="availability-row" data-available={available} className={cn('flex w-140 max-w-full flex-wrap items-start gap-x-3 gap-y-2 border-b border-border py-2', className)} {...props}>
      <div className={cn('flex items-center gap-3', available ? 'h-9' : 'h-5')}>
        <Switch checked={available} onCheckedChange={onAvailableChange} aria-label={`${day}: available`} />
        <p className="m-0 w-24 text-sm leading-5 font-medium text-foreground">{day}</p>
      </div>
      {available ? (
        <div role="group" aria-label={`${day} hours`} className="flex flex-col gap-2">
          {ranges.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select value={r.start} onValueChange={(v) => set(i, { start: v })}>
                <SelectTrigger aria-label={`${day}, range ${i + 1}: from`} className="w-[104px]" />
                <SelectContent>
                  {times.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span aria-hidden="true" className="text-sm leading-5 text-muted-foreground">
                –
              </span>
              <Select value={r.end} onValueChange={(v) => set(i, { end: v })}>
                <SelectTrigger aria-label={`${day}, range ${i + 1}: to`} className="w-[104px]" />
                <SelectContent>
                  {times.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {i > 0 ? (
                <ButtonIcon variant="ghost" size="sm" icon={<X />} label={`Remove ${day} range ${r.start} to ${r.end}`} onClick={() => onRangesChange?.(ranges.filter((_, j) => j !== i))} />
              ) : null}
              {i === ranges.length - 1 ? <ButtonIcon variant="ghost" size="sm" icon={<Plus />} label={`Add a time range for ${day}`} onClick={add} /> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="m-0 text-sm leading-5 text-muted-foreground">Unavailable</p>
      )}
    </div>
  );
}

export { AgendaItem, AvailabilityRow, CalendarEvent, GanttBar, GanttMilestone, MeetingCard };
