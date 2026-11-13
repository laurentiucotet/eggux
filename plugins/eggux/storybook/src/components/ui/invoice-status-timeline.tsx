// EGG UI Invoice Status Timeline. Code only (no Figma component yet); Billing family.
// The life of one invoice as a vertical list of steps: Draft, Sent, Viewed, Paid, each with its
// date. Done steps get a check, the current step is marked with aria-current="step", steps not
// reached say "Not yet". Two special states: overdue (an Overdue step in the error tone, in words:
// "Overdue by 12 days", counted from the due date to the fixed `now`) and refunded (a Refunded
// step after Paid). State is never colour alone: every step has a word ("Done", "Current",
// "Not yet", "Overdue", "Refunded"). Dates are ISO strings and shown in UTC; pass `now` in tests.
import * as React from 'react';
import { Check, Clock, CircleAlert, RefreshCw } from '@/components/icons';
import { cn } from '@/lib/utils';

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'refunded';

export interface InvoiceDates {
  created?: string;
  sent?: string;
  viewed?: string;
  /** Due date, needed for overdue. */
  due?: string;
  paid?: string;
  refunded?: string;
}

export interface InvoiceStatusTimelineProps extends Omit<React.ComponentProps<'ol'>, 'children'> {
  status: InvoiceStatus;
  dates: InvoiceDates;
  /** The current moment, for the overdue count. Defaults to the clock; pass a fixed value in tests. */
  now?: Date | string | number;
}

type StepState = 'done' | 'current' | 'upcoming' | 'overdue' | 'refunded';
interface Step {
  key: string;
  label: string;
  state: StepState;
  detail: string;
  iso?: string;
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const fmt = (iso?: string) => (iso ? dateFormat.format(new Date(iso)) : undefined);
const DAY = 86_400_000;

const stateWord: Record<StepState, string> = { done: 'Done', current: 'Current', upcoming: 'Not yet', overdue: 'Overdue', refunded: 'Refunded' };

function buildSteps(status: InvoiceStatus, dates: InvoiceDates, now: number): Step[] {
  const order = ['draft', 'sent', 'viewed', 'paid'] as const;
  const at = (k: (typeof order)[number]) => ({ draft: dates.created, sent: dates.sent, viewed: dates.viewed, paid: dates.paid })[k];
  const labels = { draft: 'Draft created', sent: 'Sent', viewed: 'Viewed', paid: 'Paid' };
  // Index of the furthest step reached on the normal path.
  const reached = status === 'overdue' ? (dates.viewed ? 2 : 1) : status === 'refunded' ? 3 : order.indexOf(status);
  const steps: Step[] = [];
  order.forEach((k, i) => {
    if (k === 'paid' && status === 'overdue') {
      const days = dates.due ? Math.max(1, Math.floor((now - new Date(dates.due).getTime()) / DAY)) : 0;
      steps.push({
        key: 'overdue',
        label: 'Overdue',
        state: 'overdue',
        detail: dates.due ? `Overdue by ${days} ${days === 1 ? 'day' : 'days'} (due ${fmt(dates.due)})` : 'Past the due date',
        iso: dates.due,
      });
    }
    const state: StepState = i < reached ? 'done' : i === reached && status !== 'overdue' ? (k === 'paid' ? 'done' : 'current') : i === reached ? 'done' : 'upcoming';
    // A viewed step that was skipped before overdue stays "Not yet".
    const date = fmt(at(k));
    steps.push({ key: k, label: labels[k], state, detail: state === 'upcoming' ? 'Not yet' : (date ?? stateWord[state]), iso: state === 'upcoming' ? undefined : at(k) });
  });
  if (status === 'refunded') {
    steps.push({ key: 'refunded', label: 'Refunded', state: 'refunded', detail: fmt(dates.refunded) ?? 'Refunded', iso: dates.refunded });
  }
  return steps;
}

const dot: Record<StepState, string> = {
  done: 'bg-[var(--badge-soft-success-bg)] text-[var(--badge-soft-success-fg)]',
  current: 'bg-primary text-primary-foreground',
  upcoming: 'border border-border bg-card text-muted-foreground',
  overdue: 'bg-destructive text-destructive-foreground',
  refunded: 'bg-[var(--badge-soft-info-bg)] text-[var(--badge-soft-info-fg)]',
};

function InvoiceStatusTimeline({ status, dates, now = Date.now(), className, ...props }: InvoiceStatusTimelineProps) {
  const steps = buildSteps(status, dates, new Date(now).getTime());
  return (
    <ol data-slot="invoice-status-timeline" data-status={status} aria-label="Invoice status" className={cn('m-0 flex w-full max-w-sm min-w-0 list-none flex-col p-0', className)} {...props}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const current = s.state === 'current' || s.state === 'overdue' || (last && s.state !== 'upcoming');
        return (
          <li key={s.key} data-state={s.state} aria-current={current ? 'step' : undefined} className="relative flex min-w-0 gap-3 pb-5 last:pb-0">
            {!last ? <span aria-hidden="true" className="absolute top-7 bottom-0 left-3 w-px -translate-x-1/2 bg-border" /> : null}
            <span aria-hidden="true" className={cn('relative flex size-6 shrink-0 items-center justify-center rounded-full [&_svg]:size-3.5', dot[s.state])}>
              {s.state === 'done' ? <Check /> : s.state === 'current' ? <Clock /> : s.state === 'overdue' ? <CircleAlert /> : s.state === 'refunded' ? <RefreshCw /> : null}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className={cn('m-0 truncate text-sm leading-6 font-medium', s.state === 'upcoming' ? 'text-muted-foreground' : 'text-foreground')}>
                {s.label}
                <span className="sr-only">: {stateWord[s.state]}</span>
              </p>
              {s.iso ? (
                <time dateTime={s.iso.slice(0, 10)} className={cn('text-xs leading-4 break-words', s.state === 'overdue' ? 'font-medium text-destructive' : 'text-muted-foreground')}>
                  {s.detail}
                </time>
              ) : (
                <span className={cn('text-xs leading-4 text-muted-foreground', s.state === 'overdue' && 'text-destructive')}>{s.detail}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { InvoiceStatusTimeline };
