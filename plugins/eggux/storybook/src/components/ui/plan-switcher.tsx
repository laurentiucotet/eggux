// EGG UI Plan Switcher. Code only (no Figma component yet); Billing family.
// Picks how a plan is paid for and how many seats: a Monthly / Yearly toggle (segmented Toggle
// Group, one always selected) with the yearly saving shown in a badge, a seat count stepper
// (Number Input) and the resulting price line in words ("5 seats x EUR 12.00 = EUR 60.00 per
// month"). The price line is a status, so a change is announced. The yearly price is the monthly
// price less `yearlyDiscount` percent, billed once a year. Prices are per seat, in EUR. It shows a
// price; it never takes a card (checkout does).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { NumberInput } from './number-input';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export type BillingPeriod = 'monthly' | 'yearly';

export interface PlanSwitcherProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Plan name, used in the group name ("Team plan"). */
  planName?: string;
  /** Price of one seat for one month, in EUR. */
  monthlyPrice: number;
  /** Percent taken off when paying yearly. 0 hides the saving. */
  yearlyDiscount?: number;
  period?: BillingPeriod;
  defaultPeriod?: BillingPeriod;
  onPeriodChange?: (period: BillingPeriod) => void;
  seats?: number;
  defaultSeats?: number;
  onSeatsChange?: (seats: number) => void;
  minSeats?: number;
  maxSeats?: number;
}

const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const round2 = (n: number) => Math.round(n * 100) / 100;

function PlanSwitcher({
  planName = 'Team',
  monthlyPrice,
  yearlyDiscount = 20,
  period: periodProp,
  defaultPeriod = 'monthly',
  onPeriodChange,
  seats: seatsProp,
  defaultSeats = 5,
  onSeatsChange,
  minSeats = 1,
  maxSeats = 500,
  className,
  ...props
}: PlanSwitcherProps) {
  const id = React.useId();
  const [innerPeriod, setInnerPeriod] = React.useState<BillingPeriod>(defaultPeriod);
  const [innerSeats, setInnerSeats] = React.useState(defaultSeats);
  const period = periodProp ?? innerPeriod;
  const seats = seatsProp ?? innerSeats;

  const yearlySeatMonthly = round2(monthlyPrice * (1 - yearlyDiscount / 100));
  const monthlyTotal = round2(monthlyPrice * seats);
  const yearlyTotal = round2(yearlySeatMonthly * 12 * seats);
  const yearlySaving = round2(monthlyPrice * 12 * seats - yearlyTotal);
  const seatWord = seats === 1 ? 'seat' : 'seats';

  const priceLine =
    period === 'monthly'
      ? `${seats} ${seatWord} × ${money.format(monthlyPrice)} = ${money.format(monthlyTotal)} per month`
      : `${seats} ${seatWord} × ${money.format(yearlySeatMonthly)} × 12 months = ${money.format(yearlyTotal)} per year`;
  const note =
    yearlyDiscount <= 0
      ? undefined
      : period === 'monthly'
        ? `Pay yearly and save ${money.format(yearlySaving)} a year.`
        : `That is ${money.format(round2(yearlySeatMonthly * seats))} a month. You save ${money.format(yearlySaving)} a year.`;

  return (
    <div
      data-slot="plan-switcher"
      data-period={period}
      role="group"
      aria-label={`${planName} plan`}
      className={cn('flex w-full max-w-md min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
        <ToggleGroup
          type="single"
          variant="segmented"
          aria-label="Billing period"
          value={period}
          onValueChange={v => {
            if (v !== 'monthly' && v !== 'yearly') return;
            if (periodProp === undefined) setInnerPeriod(v);
            onPeriodChange?.(v);
          }}
        >
          <ToggleGroupItem value="monthly" label="Monthly" />
          <ToggleGroupItem value="yearly" label="Yearly" />
        </ToggleGroup>
        {yearlyDiscount > 0 ? <Badge variant="soft-success">Save {yearlyDiscount}%</Badge> : null}
      </div>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <label htmlFor={`${id}-seats`} className="min-w-0 truncate text-sm leading-5 font-medium">
          Seats
        </label>
        <NumberInput
          id={`${id}-seats`}
          min={minSeats}
          max={maxSeats}
          value={seats}
          decrementLabel="Remove a seat"
          incrementLabel="Add a seat"
          onValueChange={n => {
            if (seatsProp === undefined) setInnerSeats(n);
            onSeatsChange?.(n);
          }}
        />
      </div>
      <div role="status" className="flex min-w-0 flex-col gap-1 border-t border-border pt-3">
        <p className="m-0 text-base leading-6 font-semibold break-words">{priceLine}</p>
        {note ? <p className="m-0 text-sm leading-5 text-muted-foreground">{note}</p> : null}
      </div>
    </div>
  );
}

export { PlanSwitcher };
