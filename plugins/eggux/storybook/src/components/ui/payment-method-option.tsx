// EGG UI Payment Method Option. Code only (no Figma component yet); Checkout family.
// The selectable version of Payment Method Card (Commerce page): a radio card with the brand mark,
// "Visa ending in 4242", the expiry and a Default badge. An expired card is shown but cannot be
// chosen (disabled), its expiry in destructive. The mark is a text mark, never a logo. Goes inside
// PaymentMethodOptionGroup (a radiogroup, label it): arrow keys move between options. Never takes
// a card number: only the brand, the last four digits and the expiry that the server returns.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { RadioGroup, RadioGroupItem } from './radio';
import { radioCardClass } from './shipping-option';

export interface PaymentMethodOptionProps extends Omit<React.ComponentProps<'label'>, 'title' | 'onChange'> {
  /** The value inside the PaymentMethodOptionGroup. */
  value: string;
  /** Text mark: "VISA". */
  brand: string;
  /** "Visa ending in 4242". */
  label: string;
  /** "Expires 08/28" or "Expired 08/25". */
  expiry: string;
  expired?: boolean;
  isDefault?: boolean;
  disabled?: boolean;
}

function PaymentMethodOption({ value, brand, label, expiry, expired = false, isDefault = false, disabled, className, ...props }: PaymentMethodOptionProps) {
  const id = React.useId();
  return (
    <label data-slot="payment-method-option" data-state={expired ? 'expired' : 'default'} className={cn(radioCardClass, 'items-center py-3', className)} {...props}>
      <RadioGroupItem value={value} disabled={disabled || expired} aria-labelledby={`${id}-label`} aria-describedby={`${id}-expiry`} />
      <span aria-hidden="true" className="flex h-[30px] w-11 shrink-0 items-center justify-center rounded-sm border border-border text-xs leading-4 font-medium">{brand}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span data-fade="" className="flex min-w-0 items-center gap-2">
          <span id={`${id}-label`} className="truncate text-sm leading-5 font-medium">{label}</span>
          {isDefault ? <Badge variant="secondary">Default</Badge> : null}
        </span>
        <span id={`${id}-expiry`} className={cn('truncate text-xs leading-4', expired ? 'text-destructive' : 'text-muted-foreground')}>{expiry}</span>
      </span>
    </label>
  );
}

/** A radiogroup of Payment Method Options. Give it an `aria-label` ("Payment method"). */
function PaymentMethodOptionGroup({ className, ...props }: React.ComponentProps<typeof RadioGroup>) {
  return <RadioGroup data-slot="payment-method-option-group" className={cn('gap-3', className)} {...props} />;
}

export { PaymentMethodOption, PaymentMethodOptionGroup };
