// EGG UI Calendar Day. Figma: Calendar Day (Calendar page, "Calendar / Component"). State
// (default, hover, focus, today, selected, outside, disabled, range-start, range-middle,
// range-end, booked), Day, Show dot, Show note + Note. One 32 x 32 cell (36 with a note).
// today = accent, selected and range ends = primary, range-middle = accent without radius,
// outside = adjacent months (muted, still pickable), disabled = faded and not pickable, booked =
// muted with a strike line, not pickable. Use a dot or a note, not both. The note is aria-hidden:
// the parent (Calendar) puts it in the button's accessible name ("21 October 2026, €79").
import * as React from 'react';
import { cn } from '@/lib/utils';

export type CalendarDayState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'today'
  | 'selected'
  | 'outside'
  | 'disabled'
  | 'range-start'
  | 'range-middle'
  | 'range-end'
  | 'booked';

// Every class name is written in full so Tailwind can generate it.
// root = shape + fill, text = number color and weight, note = note color, dot = dot color.
const states: Record<CalendarDayState, { root: string; text: string; note: string; dot: string }> = {
  default: { root: 'rounded-md hover:bg-accent hover:text-accent-foreground', text: 'font-normal text-foreground', note: 'text-muted-foreground', dot: 'bg-primary' },
  hover: { root: 'rounded-md bg-accent', text: 'font-normal text-accent-foreground', note: 'text-accent-foreground', dot: 'bg-primary' },
  focus: { root: 'rounded-md bg-background ring-[3px] ring-ring/50', text: 'font-normal text-foreground', note: 'text-muted-foreground', dot: 'bg-primary' },
  today: { root: 'rounded-md bg-accent', text: 'font-medium text-accent-foreground', note: 'text-accent-foreground', dot: 'bg-primary' },
  selected: { root: 'rounded-md bg-primary', text: 'font-medium text-primary-foreground', note: 'text-primary-foreground', dot: 'bg-primary-foreground' },
  outside: { root: 'rounded-md hover:bg-accent', text: 'font-normal text-muted-foreground', note: 'text-muted-foreground', dot: 'bg-primary' },
  disabled: { root: 'rounded-md opacity-50', text: 'font-normal text-muted-foreground', note: 'text-muted-foreground', dot: 'bg-primary' },
  'range-start': { root: 'rounded-l-md rounded-r-none bg-primary', text: 'font-medium text-primary-foreground', note: 'text-primary-foreground', dot: 'bg-primary-foreground' },
  'range-middle': { root: 'rounded-none bg-accent', text: 'font-normal text-accent-foreground', note: 'text-accent-foreground', dot: 'bg-primary' },
  'range-end': { root: 'rounded-l-none rounded-r-md bg-primary', text: 'font-medium text-primary-foreground', note: 'text-primary-foreground', dot: 'bg-primary-foreground' },
  booked: { root: 'rounded-md', text: 'font-normal text-muted-foreground', note: 'text-muted-foreground', dot: 'bg-primary' },
};

export interface CalendarDayProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  /** Figma State. */
  state?: CalendarDayState;
  /** Figma Day: the number shown. */
  day?: React.ReactNode;
  /** Figma Show dot: a 4 px dot under the number for days with events. Not with a note. */
  showDot?: boolean;
  /** Figma Show note: a short line under the number (4 characters or fewer: "€89", "Full"). */
  showNote?: boolean;
  /** Figma Note. */
  note?: React.ReactNode;
}

function CalendarDay({ state = 'default', day = '19', showDot = false, showNote = false, note = '€89', className, type = 'button', ...props }: CalendarDayProps) {
  const s = states[state];
  const blocked = state === 'disabled' || state === 'booked';
  return (
    <button
      type={type}
      data-slot="calendar-day"
      data-state={state}
      aria-disabled={blocked || undefined}
      aria-current={state === 'today' ? 'date' : undefined}
      className={cn(
        'relative flex min-h-8 w-8 shrink-0 flex-col items-center justify-center text-sm outline-none transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] focus-visible:ring-[3px] focus-visible:ring-ring/50',
        blocked ? 'cursor-not-allowed' : 'cursor-pointer',
        s.root,
        className,
      )}
      {...props}
    >
      {state === 'booked' ? (
        <span className="relative flex">
          <span data-slot="calendar-day-number" className={cn('leading-5', s.text)}>{day}</span>
          <span aria-hidden="true" data-slot="calendar-day-strike" className="absolute -left-px -right-px top-[calc(50%+0.5px)] h-px -translate-y-1/2 bg-muted-foreground" />
        </span>
      ) : (
        <span data-slot="calendar-day-number" className={cn('leading-5', s.text)}>{day}</span>
      )}
      {showNote ? ' ' : null}
      {showNote ? <span aria-hidden="true" data-slot="calendar-day-note" className={cn('whitespace-nowrap text-xs leading-4 font-normal', s.note)}>{note}</span> : null}
      {showDot && !showNote ? <span aria-hidden="true" data-slot="calendar-day-dot" className={cn('absolute bottom-[3px] left-1/2 size-1 -translate-x-1/2 rounded-full', s.dot)} /> : null}
    </button>
  );
}

export { CalendarDay };
