// EGG UI Shipping Option. Code only (no Figma component yet); Checkout family.
// A radio card for one delivery choice: carrier and service name (wraps), delivery estimate
// ("Arrives Tue 14 to Thu 16 Oct") and the price on the right ("Free" in success). The whole card is
// the target (a <label> around the Radio); selected = 2 px primary border; the price is read with
// the name ("Express, EUR 9.90"). Goes inside ShippingOptionGroup (a radiogroup, label it): arrow
// keys move between options. Built on Radio, same card states as Option Card. Disabled (not
// available for this address) keeps the reason in `note` readable: only the title and price fade.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { RadioGroup, RadioGroupItem } from './radio';

/** Card chrome shared by the radio cards of Checkout (Shipping Option, Payment Method Option). */
export const radioCardClass = [
  'relative flex w-full min-w-0 max-w-96 cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs',
  'motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-[var(--duration-fast)]',
  'hover:bg-accent',
  'has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-1 has-[[data-state=checked]]:ring-primary',
  'has-[:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
  'has-[:disabled]:cursor-not-allowed has-[:disabled]:hover:bg-card [&:has(:disabled)_[data-fade]]:opacity-50',
].join(' ');

export interface ShippingOptionProps extends Omit<React.ComponentProps<'label'>, 'title' | 'onChange'> {
  /** The value inside the ShippingOptionGroup. */
  value: string;
  /** Carrier and service: "Acme Post · Express". */
  name: string;
  /** Delivery estimate: "Arrives Tue 14 to Thu 16 Oct". */
  estimate?: string;
  /** Price, formatted ("€9.90"), or "Free". */
  price: string;
  /** Short flag next to the name: "Fastest", "Greenest". */
  badge?: string;
  /** Extra line: why it is not available, or a condition. */
  note?: string;
  disabled?: boolean;
}

function ShippingOption({ value, name, estimate, price, badge, note, disabled, className, ...props }: ShippingOptionProps) {
  const id = React.useId();
  const free = price.toLowerCase() === 'free';
  return (
    <label data-slot="shipping-option" className={cn(radioCardClass, className)} {...props}>
      <RadioGroupItem value={value} disabled={disabled} aria-labelledby={`${id}-name ${id}-price`} aria-describedby={[estimate ? `${id}-estimate` : null, note ? `${id}-note` : null].filter(Boolean).join(' ') || undefined} className="mt-0.5" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span data-fade="" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span id={`${id}-name`} className="min-w-0 text-sm leading-5 font-medium [overflow-wrap:anywhere]">{name}</span>
          {badge ? <Badge variant="soft-info">{badge}</Badge> : null}
        </span>
        {estimate ? <span id={`${id}-estimate`} className="text-xs leading-4 text-muted-foreground [overflow-wrap:anywhere]">{estimate}</span> : null}
        {note ? <span id={`${id}-note`} className="text-xs leading-4 text-muted-foreground [overflow-wrap:anywhere]">{note}</span> : null}
      </span>
      <span id={`${id}-price`} data-fade="" className={cn('shrink-0 text-sm leading-5 font-medium whitespace-nowrap tabular-nums', free ? 'text-success' : 'text-foreground')}>{price}</span>
    </label>
  );
}

/** A radiogroup of Shipping Options. Give it an `aria-label` ("Delivery method"). */
function ShippingOptionGroup({ className, ...props }: React.ComponentProps<typeof RadioGroup>) {
  return <RadioGroup data-slot="shipping-option-group" className={cn('gap-3', className)} {...props} />;
}

export { ShippingOption, ShippingOptionGroup };
