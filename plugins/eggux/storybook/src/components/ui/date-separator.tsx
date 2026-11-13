// EGG UI Date Separator. Code only (no Figma component yet). The day label in a message list:
// "Today", "Yesterday" or "12 Oct 2026", worked out from a fixed `now` (so stories and tests never
// depend on the clock). Two looks: a centered pill, or a line with the label in the middle. It
// sticks to the top of its scroll area by default so the reader always knows the day. The label
// is real text in a <time> with a machine date; the wrapper is a separator named by the label.
// Compares calendar days in the local time zone. Not for a time range or a date picker.
import * as React from 'react';
import { cn } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type DateInput = Date | string | number;

function startOfDay(value: DateInput) {
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** "Today", "Yesterday" or "12 Oct 2026". */
export function dayLabel(date: DateInput, now: DateInput = new Date()) {
  const day = startOfDay(date);
  const diff = Math.round((startOfDay(now).getTime() - day.getTime()) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${day.getDate()} ${MONTHS[day.getMonth()]} ${day.getFullYear()}`;
}

function isoDay(date: DateInput) {
  const d = startOfDay(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface DateSeparatorProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The day the messages below belong to. */
  date: DateInput;
  /** The reference "now". Default: the current time; pass a fixed value in stories and tests. */
  now?: DateInput;
  /** pill: a centered chip. line: a rule with the label in the middle. */
  variant?: 'pill' | 'line';
  /** Stick to the top of the scroll area. */
  sticky?: boolean;
  /** Replace the computed label ("Last week"). */
  label?: string;
}

function DateSeparator({ date, now, variant = 'pill', sticky = true, label, className, ...props }: DateSeparatorProps) {
  const text = label ?? dayLabel(date, now);
  const chip = (
    <time
      dateTime={isoDay(date)}
      className={cn(
        'min-w-0 truncate px-3 text-xs leading-4 font-medium',
        variant === 'pill' ? 'rounded-full border border-border bg-background py-1 text-foreground shadow-xs' : 'bg-background py-0.5 text-muted-foreground',
      )}
    >
      {text}
    </time>
  );
  return (
    <div
      data-slot="date-separator"
      role="separator"
      aria-label={text}
      className={cn('z-10 flex w-full min-w-0 items-center py-2', sticky && 'sticky top-0', variant === 'pill' ? 'justify-center' : 'gap-2 bg-background', className)}
      {...props}
    >
      {variant === 'line' ? <span aria-hidden="true" className="h-px flex-1 bg-border" /> : null}
      {chip}
      {variant === 'line' ? <span aria-hidden="true" className="h-px flex-1 bg-border" /> : null}
    </div>
  );
}

export { DateSeparator };
