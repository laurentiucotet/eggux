// EGG UI Proration Preview. Code only (no Figma component yet); Billing family. Invented to fill
// the gap between Plan Switcher and checkout: what a plan change costs today. Three lines in words
// from a fixed `now` and the renewal date: the credit for the unused days on the current plan, the
// charge for the same days on the new plan, and the amount due today (or the credit added to the
// balance when the new plan is cheaper), then when the next full invoice comes. Prices are per
// month in EUR; a period is 30 days. Nothing changes until Confirm.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ProrationPreviewProps extends Omit<React.ComponentProps<'section'>, 'children'> {
  fromPlan: string;
  /** Monthly price of the current plan, EUR. */
  fromMonthly: number;
  toPlan: string;
  /** Monthly price of the new plan, EUR. */
  toMonthly: number;
  /** When the current period ends and the next invoice is made (ISO date). */
  renewsOn: string;
  /** The current moment. Defaults to the clock; pass a fixed value in tests. */
  now?: Date | string | number;
  onConfirm?: () => void;
}

const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const DAY = 86_400_000;
const PERIOD_DAYS = 30;
const round2 = (n: number) => Math.round(n * 100) / 100;

function ProrationPreview({ fromPlan, fromMonthly, toPlan, toMonthly, renewsOn, now = Date.now(), onConfirm, className, ...props }: ProrationPreviewProps) {
  const id = React.useId();
  const left = Math.min(PERIOD_DAYS, Math.max(0, Math.ceil((new Date(renewsOn).getTime() - new Date(now).getTime()) / DAY)));
  const credit = round2((fromMonthly * left) / PERIOD_DAYS);
  const charge = round2((toMonthly * left) / PERIOD_DAYS);
  const due = round2(charge - credit);
  const days = `${left} ${left === 1 ? 'day' : 'days'}`;
  return (
    <section data-slot="proration-preview" aria-labelledby={id} className={cn('flex w-full max-w-md min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground', className)} {...props}>
      <h3 id={id} className="m-0 text-base leading-6 font-semibold break-words">
        Switch from {fromPlan} to {toPlan}
      </h3>
      <dl className="m-0 flex flex-col gap-2 text-sm leading-5">
        <div className="flex min-w-0 items-baseline justify-between gap-3">
          <dt className="min-w-0 text-muted-foreground">Unused time on {fromPlan} ({days})</dt>
          <dd className="m-0 shrink-0">−{money.format(credit)}</dd>
        </div>
        <div className="flex min-w-0 items-baseline justify-between gap-3">
          <dt className="min-w-0 text-muted-foreground">{toPlan} for the same {days}</dt>
          <dd className="m-0 shrink-0">{money.format(charge)}</dd>
        </div>
        <div className="flex min-w-0 items-baseline justify-between gap-3 border-t border-border pt-2 font-semibold">
          <dt className="min-w-0">{due < 0 ? 'Credit added to your balance' : 'Due today'}</dt>
          <dd className="m-0 shrink-0">{money.format(Math.abs(due))}</dd>
        </div>
      </dl>
      <p className="m-0 text-xs leading-4 text-muted-foreground">
        Your next invoice is on {dateFormat.format(new Date(renewsOn))}, {money.format(toMonthly)} for {toPlan}.
      </p>
      <Button className="w-full" onClick={onConfirm}>
        Confirm change
      </Button>
    </section>
  );
}

export { ProrationPreview };
