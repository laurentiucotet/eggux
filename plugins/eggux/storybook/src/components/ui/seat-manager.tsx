// EGG UI Seat Manager. Code only (no Figma component yet); Billing family.
// Shows seats used of seats bought (a Progress bar with the numbers in words) and lets an admin
// add or remove seats: a Number Input whose minimum is the seats in use (a seat that is taken
// cannot be removed), a price change preview in words ("Adding 3 seats: +EUR 36.00 per month")
// and a Confirm button that stays disabled until the number changes. Nothing is charged before
// Confirm. After Confirm the new total is shown as a status. Prices are per seat per month, EUR.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { NumberInput } from './number-input';
import { Progress } from './progress';

export interface SeatManagerProps extends Omit<React.ComponentProps<'section'>, 'onChange' | 'children'> {
  /** Seats taken by people today. Also the lowest number allowed. */
  used: number;
  /** Seats paid for today. */
  bought: number;
  /** Price of one seat for one month, in EUR. */
  pricePerSeat: number;
  maxSeats?: number;
  /** Runs when Confirm is pressed, with the new number of seats. */
  onConfirm?: (seats: number) => void;
}

const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const plural = (n: number) => (n === 1 ? 'seat' : 'seats');

function SeatManager({ used, bought, pricePerSeat, maxSeats = 500, onConfirm, className, ...props }: SeatManagerProps) {
  const id = React.useId();
  const [committed, setCommitted] = React.useState(bought);
  const [target, setTarget] = React.useState(bought);
  const [done, setDone] = React.useState<string>('');

  // New data from the parent resets the draft.
  React.useEffect(() => {
    setCommitted(bought);
    setTarget(bought);
  }, [bought]);

  const delta = target - committed;
  const change = Math.round(delta * pricePerSeat * 100) / 100;
  const total = Math.round(target * pricePerSeat * 100) / 100;
  const preview =
    delta === 0
      ? `No change. You pay ${money.format(total)} per month for ${target} ${plural(target)}.`
      : delta > 0
        ? `Adding ${delta} ${plural(delta)}: +${money.format(change)} per month. New total ${money.format(total)} per month.`
        : `Removing ${-delta} ${plural(-delta)}: −${money.format(-change)} per month. New total ${money.format(total)} per month.`;
  const free = committed - used;

  return (
    <section
      data-slot="seat-manager"
      aria-labelledby={`${id}-title`}
      className={cn('flex w-full max-w-md min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <h3 id={`${id}-title`} className="m-0 truncate text-base leading-6 font-semibold">
        Seats
      </h3>
      <Progress
        label="Seats in use"
        valueText={`${used} of ${committed} used`}
        value={committed > 0 ? Math.min(100, Math.round((used / committed) * 100)) : 0}
        tone={used >= committed ? 'warning' : 'default'}
        getValueLabel={() => `${used} of ${committed} seats used`}
      />
      <p className="m-0 text-sm leading-5 text-muted-foreground">
        {free > 0 ? `${free} ${plural(free)} free.` : 'No free seats. New people cannot join until you add seats.'}
      </p>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <label htmlFor={`${id}-count`} className="min-w-0 truncate text-sm leading-5 font-medium">
          Seats you want
        </label>
        <NumberInput
          id={`${id}-count`}
          min={used}
          max={maxSeats}
          value={target}
          decrementLabel="Remove a seat"
          incrementLabel="Add a seat"
          aria-describedby={`${id}-hint`}
          onValueChange={n => {
            setTarget(n);
            setDone('');
          }}
        />
      </div>
      <p id={`${id}-hint`} className="m-0 text-xs leading-4 text-muted-foreground">
        The lowest number is {used}, the seats in use. Remove people first to go lower.
      </p>
      <div role="status" className="flex min-w-0 flex-col gap-1 border-t border-border pt-3 text-sm leading-5">
        <p className="m-0 font-medium break-words">{preview}</p>
        {done ? <p className="m-0 text-muted-foreground">{done}</p> : null}
      </div>
      <div className="flex justify-end">
        <Button
          disabled={delta === 0}
          onClick={() => {
            onConfirm?.(target);
            setCommitted(target);
            setDone(`Done. You now have ${target} ${plural(target)}.`);
          }}
        >
          Confirm change
        </Button>
      </div>
    </section>
  );
}

export { SeatManager };
