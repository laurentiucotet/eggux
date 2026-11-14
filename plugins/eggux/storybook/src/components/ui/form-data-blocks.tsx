// EGG UI Blocks, Forms page (BLOCKS / Forms, Figma 67:2089), the data group: Block / Payment,
// Address, Multi-step Form, Account Settings Form and Waitlist. Same card and validation as the auth
// blocks (form-auth-blocks.tsx, useBlockForm): checked on blur after typing, again on every change
// once wrong, everything on submit with focus on the first wrong field; long forms (Account Settings)
// show an Error Summary that takes focus instead. Guides: build-ui/patterns/form-validation.md,
// multi-step-form.md, auth.md (Waitlist).
// Payment: plain inputs with the cc-* autocomplete tokens and no payment provider. Card values stay
// in the form state and go only to onSubmit; nothing is logged.
import * as React from 'react';
import { AuthCard, requiredRule, useBlockForm } from './form-auth-blocks';
import { Button } from './button';
import { Field } from './field';
import { Input } from './input';
import { InputGroup } from './input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

/* Shared */

const COUNTRIES = [
  ['RO', 'Romania'], ['DE', 'Germany'], ['FR', 'France'], ['NL', 'Netherlands'], ['PL', 'Poland'], ['ES', 'Spain'], ['IT', 'Italy'], ['GB', 'United Kingdom'],
] as const;
const COUNTIES = ['Alba', 'Bihor', 'Brașov', 'Bucharest', 'Cluj', 'Constanța', 'Iași', 'Timiș'];

/** A Select inside a Field: Field hands the id, description and invalid state to the trigger. */
function FieldSelect({ value, onValueChange, placeholder, options, autoComplete, ...fieldProps }: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  options: readonly (readonly [string, string])[];
  autoComplete?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}) {
  return (
    <Select value={value} onValueChange={onValueChange} autoComplete={autoComplete} {...fieldProps}>
      <SelectTrigger placeholder={placeholder}><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

const postalRule = (v: string) => (!v.trim() ? 'Enter the postal code.' : !/^\d{6}$/.test(v.trim()) ? 'Enter a postal code with 6 digits.' : undefined);
const twoCols = 'grid grid-cols-1 gap-4 @min-[300px]:grid-cols-2';

/* Payment */

const digits = (s: string) => s.replace(/\D/g, '');
/** Groups of 4 as people type (Amex 4-6-5). */
export function formatCardNumber(value: string) {
  const d = digits(value).slice(0, 19);
  if (/^3[47]/.test(d)) return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(' ');
  return d.replace(/(.{4})/g, '$1 ').trim();
}
export function cardBrand(value: string) {
  const d = digits(value);
  if (/^4/.test(d)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
  if (/^3[47]/.test(d)) return 'Amex';
  return undefined;
}
function luhn(d: string) {
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}
const formatExpiry = (value: string, previous: string) => {
  const d = digits(value).slice(0, 4);
  if (d.length < 2) return d;
  // Deleting the separator deletes the month's last digit too.
  if (value.length < previous.length && previous.endsWith(' / ')) return d.slice(0, 1);
  return `${d.slice(0, 2)} / ${d.slice(2)}`;
};

export type PaymentValues = { number: string; expiry: string; cvc: string; name: string; country: string; postalCode: string };

export interface PaymentProps extends Omit<React.ComponentProps<'div'>, 'title' | 'onSubmit'> {
  title?: string;
  /** Amount charged, already formatted ("€250"). */
  amount?: string;
  description?: string;
  /** For the expiry check; pass a fixed date in tests. */
  today?: Date;
  onSubmit?: (values: PaymentValues) => void | Promise<unknown>;
  titleAs?: 'h1' | 'h2';
}

export function Payment({ title = 'Payment details', amount = '€250', description, today, onSubmit, titleAs = 'h2', ...props }: PaymentProps) {
  const f = useBlockForm<PaymentValues>(
    { number: '', expiry: '', cvc: '', name: '', country: '', postalCode: '' },
    {
      number: v => {
        const d = digits(v);
        if (!d) return 'Enter the card number.';
        if (d.length < 13 || !luhn(d)) return 'Check the card number: it should be the 15 or 16 digits on the front of the card.';
        return undefined;
      },
      expiry: v => {
        const m = /^(\d{2}) \/ (\d{2})$/.exec(v);
        if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return 'Enter the expiry date as MM / YY.';
        const now = today ?? new Date();
        const end = new Date(2000 + Number(m[2]), Number(m[1]), 1);
        return end <= new Date(now.getFullYear(), now.getMonth(), 1) ? 'This card has expired. Use another card.' : undefined;
      },
      cvc: v => (/^\d{3,4}$/.test(v) ? undefined : 'Enter the 3 digits on the back of the card.'),
      name: requiredRule('Enter the name as it is written on the card.'),
      country: v => (v ? undefined : 'Select a country.'),
      postalCode: postalRule,
    },
  );
  const [busy, setBusy] = React.useState(false);
  const brand = cardBrand(f.values.number);
  return (
    <AuthCard title={title} description={description ?? `You are charged ${amount} today.`} titleAs={titleAs} {...props}>
      <form
        noValidate
        aria-label={title}
        className="@container flex flex-col gap-4"
        onSubmit={f.submit(v => {
          const r = onSubmit?.(v);
          if (r && typeof (r as Promise<unknown>).then === 'function') { setBusy(true); (r as Promise<unknown>).finally(() => setBusy(false)); }
        })}
      >
        <Field label="Card number" required {...f.field('number')}>
          <InputGroup
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 1234 1234 1234"
            value={f.values.number}
            onChange={e => f.set('number', formatCardNumber(e.target.value))}
            onBlur={() => f.blur('number')}
            end={brand ? <span data-slot="card-brand" className="mr-2 self-center rounded-sm border border-border px-1.5 text-xs leading-5 font-medium text-foreground">{brand}</span> : undefined}
          />
        </Field>
        <div className={twoCols}>
          <Field label="Expiry" required {...f.field('expiry')}>
            <Input inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={f.values.expiry} onChange={e => f.set('expiry', formatExpiry(e.target.value, f.values.expiry))} onBlur={() => f.blur('expiry')} />
          </Field>
          <Field label="CVC" required {...f.field('cvc')}>
            <Input inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={f.values.cvc} onChange={e => f.set('cvc', digits(e.target.value))} onBlur={() => f.blur('cvc')} />
          </Field>
        </div>
        <Field label="Name on card" required {...f.field('name')}>
          <Input autoComplete="cc-name" placeholder="ANA POPESCU" {...f.input('name')} />
        </Field>
        <div className={twoCols}>
          <Field label="Country" required {...f.field('country')}>
            <FieldSelect autoComplete="country" placeholder="Select a country" options={COUNTRIES} value={f.values.country} onValueChange={v => f.set('country', v)} />
          </Field>
          <Field label="Postal code" required hint="6 digits" {...f.field('postalCode')}>
            <Input inputMode="numeric" autoComplete="postal-code" placeholder="400001" {...f.input('postalCode')} />
          </Field>
        </div>
        <Button type="submit" className="w-full" loading={busy}>Pay {amount}</Button>
      </form>
    </AuthCard>
  );
}

/* Address */

export type AddressValues = { street: string; city: string; postalCode: string; county: string; country: string };

export interface AddressFormProps extends Omit<React.ComponentProps<'div'>, 'title' | 'onSubmit'> {
  title?: string;
  description?: string;
  defaultValues?: Partial<AddressValues>;
  onSubmit?: (values: AddressValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
  titleAs?: 'h1' | 'h2';
}

export function AddressForm({ title = 'Billing address', description = 'Shown on invoices.', defaultValues, onSubmit, onCancel, submitLabel = 'Save address', titleAs = 'h2', ...props }: AddressFormProps) {
  const f = useBlockForm<AddressValues>(
    { street: '', city: '', postalCode: '', county: '', country: 'RO', ...defaultValues },
    {
      street: requiredRule('Enter the street and number.'),
      city: requiredRule('Enter the city.'),
      postalCode: postalRule,
      county: v => (v ? undefined : 'Select a county.'),
      country: v => (v ? undefined : 'Select a country.'),
    },
  );
  return (
    <AuthCard title={title} description={description} titleAs={titleAs} {...props}>
      <form noValidate aria-label={title} className="@container flex flex-col gap-4" onSubmit={f.submit(v => onSubmit?.(v))}>
        <Field label="Street and number" required {...f.field('street')}>
          <Input autoComplete="address-line1" placeholder="Str. Memorandumului 28" {...f.input('street')} />
        </Field>
        <div className={twoCols}>
          <Field label="City" required {...f.field('city')}>
            <Input autoComplete="address-level2" placeholder="Cluj-Napoca" {...f.input('city')} />
          </Field>
          <Field label="Postal code" required hint="6 digits" {...f.field('postalCode')}>
            <Input inputMode="numeric" autoComplete="postal-code" placeholder="400001" {...f.input('postalCode')} />
          </Field>
        </div>
        <div className={twoCols}>
          <Field label="County" required {...f.field('county')}>
            <FieldSelect autoComplete="address-level1" placeholder="Select a county" options={COUNTIES.map(c => [c, c] as const)} value={f.values.county} onValueChange={v => f.set('county', v)} />
          </Field>
          <Field label="Country" required {...f.field('country')}>
            <FieldSelect autoComplete="country" placeholder="Select a country" options={COUNTRIES} value={f.values.country} onValueChange={v => f.set('country', v)} />
          </Field>
        </div>
        <div data-slot="form-actions" className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </AuthCard>
  );
}

