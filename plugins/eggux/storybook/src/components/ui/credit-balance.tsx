// EGG UI Credit Balance. Code only (no Figma component yet); Billing family.
// What is left of prepaid credit: the amount in EUR as the main figure, a state in words (Low
// balance from the threshold, Empty at zero), the credit that expires soon with its date and the
// days left counted from a fixed `now`, and a Top up button. Colour is never the only signal: the
// state is a Badge with text. The figure is a status, so a change after a top up is announced.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';

export interface CreditBalanceProps extends Omit<React.ComponentProps<'section'>, 'children' | 'title'> {
  /** Credit left, in EUR. */
  balance: number;
  /** At or below this amount the balance is "Low". Default 10. */
  lowThreshold?: number;
  /** Credit that expires: the amount in EUR and the date (ISO). */
  expiring?: { amount: number; on: string };
  /** The current moment, for the days left. Defaults to the clock; pass a fixed value in tests. */
  now?: Date | string | number;
  title?: string;
  onTopUp?: () => void;
}

const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const DAY = 86_400_000;

function CreditBalance({ balance, lowThreshold = 10, expiring, now = Date.now(), title = 'Credit balance', onTopUp, className, ...props }: CreditBalanceProps) {
  const id = React.useId();
  const state = balance <= 0 ? 'empty' : balance <= lowThreshold ? 'low' : 'ok';
  let expiryText: string | undefined;
  if (expiring) {
    const days = Math.ceil((new Date(expiring.on).getTime() - new Date(now).getTime()) / DAY);
    const when = days < 0 ? 'expired' : days === 0 ? 'expires today' : `expires in ${days} ${days === 1 ? 'day' : 'days'}`;
    expiryText = `${money.format(expiring.amount)} ${when} (${dateFormat.format(new Date(expiring.on))})`;
  }
  return (
    <section data-slot="credit-balance" data-state={state} aria-labelledby={id} className={cn('flex w-full max-w-sm min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground', className)} {...props}>
      <div className="flex min-w-0 items-center justify-between gap-2">
        <h3 id={id} className="m-0 min-w-0 truncate text-sm leading-5 font-medium text-muted-foreground">
          {title}
        </h3>
        {state === 'low' ? <Badge variant="soft-warning">Low balance</Badge> : null}
        {state === 'empty' ? <Badge variant="soft-destructive">Empty</Badge> : null}
      </div>
      <p role="status" className="m-0 truncate text-3xl leading-9 font-semibold">
        {money.format(Math.max(0, balance))}
      </p>
      {expiryText ? <p className="m-0 text-sm leading-5 break-words text-muted-foreground">{expiryText}</p> : null}
      {state === 'empty' ? <p className="m-0 text-sm leading-5 text-muted-foreground">Add credit to keep your services running.</p> : null}
      <Button variant={state === 'ok' ? 'outline' : 'default'} className="w-full" onClick={onTopUp}>
        Top up
      </Button>
    </section>
  );
}

export { CreditBalance };
