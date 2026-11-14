// EGG UI Blocks, Forms page (BLOCKS / Forms, Figma 67:2089), the data group: Block / Payment,
// Address, Multi-step Form, Account Settings Form and Waitlist. Same card and validation as the auth
// blocks (form-auth-blocks.tsx, useBlockForm): checked on blur after typing, again on every change
// once wrong, everything on submit with focus on the first wrong field; long forms (Account Settings)
// show an Error Summary that takes focus instead. Guides: build-ui/patterns/form-validation.md,
// multi-step-form.md, auth.md (Waitlist).
// Payment: plain inputs with the cc-* autocomplete tokens and no payment provider. Card values stay
// in the form state and go only to onSubmit; nothing is logged.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { AuthCard, PasswordInput, emailRule, requiredRule, useBlockForm } from './form-auth-blocks';
import { ActionBar } from './action-bar';
import { AddressAutocomplete, type AddressSuggestion } from './address-autocomplete';
import { Alert } from './alert';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader } from './card';
import { Checkbox } from './checkbox';
import { CopyField } from './copy-field';
import { CurrencyInput } from './currency-input';
import { DateInput } from './date-input';
import { DatePicker } from './date-picker';
import { DescriptionList, DescriptionListItem } from './description-list';
import { Field } from './field';
import { CheckItem, ErrorSummary, Fieldset, FormSection, RequirementList, type CheckMark } from './form-layout';
import { InlineForm } from './inline-form';
import { Input } from './input';
import { Logo } from './logo';
import { Separator } from './separator';
import { InputGroup } from './input-group';
import { PHONE_COUNTRIES, PhoneInput } from './phone-input';
import { Progress } from './progress';
import { RecurrencePicker, type Recurrence } from './recurrence-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Stepper, type StepData } from './stepper';
import { Textarea } from './textarea';

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


/* Phone rule: the national number has 9 digits in Romania, 6 to 12 elsewhere (no libphonenumber). */
export function phoneRule(e164: string, country = 'RO') {
  if (!e164) return 'Enter a phone number.';
  const dial = PHONE_COUNTRIES.find(c => c.code === country)?.dial ?? '';
  const national = e164.replace(/\D/g, '').slice(dial.length);
  if (country === 'RO') return national.length === 9 ? undefined : 'Enter a phone number with 9 digits.';
  return national.length >= 6 && national.length <= 12 ? undefined : 'Enter the full phone number, with the area code.';
}

/* Multi-step Form */

export type MultiStepValues = {
  name: string;
  email: string;
  phone: string;
  owner: string;
  date: Date | undefined;
  meetingType: string;
  notes: string;
};

const OWNERS = [['andrei', 'Andrei Pop · Solutions engineer'], ['ioana', 'Ioana Marin · Account manager'], ['radu', 'Radu Stan · Support lead']] as const;
const MEETING_TYPES = [['intro', 'Introduction · 15 min'], ['checkup', 'Check-up · 30 min'], ['workshop', 'Workshop · 60 min']] as const;
const labelOf = (list: readonly (readonly [string, string])[], v: string) => list.find(([k]) => k === v)?.[1] ?? '';

export interface MultiStepFormProps extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  /** Step to start on (0 Customer, 1 Details, 2 Confirm). Earlier steps start filled with defaultValues. */
  defaultStep?: number;
  defaultValues?: Partial<MultiStepValues>;
  onSubmit?: (values: MultiStepValues) => void;
  /** Earliest date people can choose; also "today" of the calendar. */
  today?: Date;
  locale?: string;
}

const STEPS: StepData[] = [
  { id: 'customer', title: 'Customer', description: 'Name and contact' },
  { id: 'details', title: 'Details', description: 'Owner, date and topic' },
  { id: 'confirm', title: 'Confirm', description: 'Review and send' },
];

/**
 * Figma Block / Multi-step Form (768): the Stepper on top, one Card per step, Back (outline) and
 * Continue (names the next step) in the card footer; the last step is a review with Edit per
 * section. A step is checked on Continue; Back never checks. Data stays across steps. Below a 640
 * container the Stepper becomes "Step 2 of 3 · Details" and a progress bar.
 */
export function MultiStepForm({ defaultStep = 0, defaultValues, onSubmit, today, locale = 'en-GB', className, ...props }: MultiStepFormProps) {
  const [step, setStep] = React.useState(defaultStep);
  const [sent, setSent] = React.useState(false);
  const f = useBlockForm<MultiStepValues>(
    { name: '', email: '', phone: '', owner: '', date: undefined, meetingType: '', notes: '', ...defaultValues },
    {
      name: v => (step === 0 ? requiredRule('Enter the customer name.')(v) : undefined),
      email: v => (step === 0 ? emailRule(v) : undefined),
      phone: v => (step === 0 ? phoneRule(v) : undefined),
      owner: v => (step === 1 && !v ? 'Choose who the customer meets.' : undefined),
      date: v => (step === 1 && !v ? 'Choose a day for the meeting.' : undefined),
      meetingType: v => (step === 1 && !v ? 'Choose a meeting type.' : undefined),
      notes: v => (step === 1 && v.length > 500 ? 'Keep it under 500 characters.' : undefined),
    },
  );
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const go = (next: number) => {
    setStep(next);
    // The new step's heading takes focus, so screen readers hear where they are.
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const v = f.values;
  const titles = [
    { title: 'Customer', description: 'Who is the meeting for and how do we reach them.' },
    { title: 'Details', description: 'Choose who you will meet, the day, and tell us what you want to cover.' },
    { title: 'Confirm', description: 'Check the request before you send it.' },
  ][step];
  const fmt = (d?: Date) => (d ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(d) : '');
  const edit = (to: number, section: string) => (
    <Button type="button" variant="link" size="sm" onClick={() => go(to)}>Edit<span className="sr-only"> {section}</span></Button>
  );
  return (
    <div data-slot="multi-step-form" className={cn('@container flex w-full max-w-3xl flex-col gap-8', className)} {...props}>
      <Stepper steps={STEPS} current={sent ? STEPS.length : step} onStepClick={i => i < step && go(i)} className="hidden @min-[640px]:flex" />
      <div data-slot="step-progress" className="flex flex-col gap-2 @min-[640px]:hidden">
        <p className="m-0 text-sm leading-5 font-medium">Step {Math.min(step + 1, 3)} of 3 · {STEPS[step].title}</p>
        <Progress value={((step + 1) / 3) * 100} size="sm" aria-label="Progress" />
      </div>
      <Card>
        <CardHeader titleAs="h2" title={<span ref={headingRef} tabIndex={-1} className="outline-none">{sent ? 'Request sent' : titles.title}</span>} description={sent ? undefined : titles.description} />
        {sent ? (
          <CardContent>
            <Alert variant="success" title="Your meeting request is on its way" description={`${labelOf(OWNERS, v.owner).split(' · ')[0]} will confirm ${fmt(v.date)} by email to ${v.email}.`} />
          </CardContent>
        ) : (
          <form
            noValidate
            aria-label={titles.title}
            className="flex flex-col gap-[var(--card-gap)]"
            onSubmit={f.submit(values => {
              if (step < 2) go(step + 1);
              else { onSubmit?.(values); setSent(true); }
            })}
          >
            <CardContent>
              {step === 0 ? (
                <>
                  <Field label="Customer name" required {...f.field('name')}>
                    <Input autoComplete="name" placeholder="Maria Ilie" {...f.input('name')} />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 @min-[640px]:grid-cols-2">
                    <Field label="Work email" required {...f.field('email')}>
                      <Input type="email" autoComplete="email" placeholder="name@company.com" {...f.input('email')} />
                    </Field>
                    <Field label="Phone" required hint="We call only if the meeting moves." {...f.field('phone')}>
                      <PhoneInput value={v.phone} onValueChange={e => f.set('phone', e)} onBlur={() => f.blur('phone')} />
                    </Field>
                  </div>
                </>
              ) : step === 1 ? (
                <>
                  <Field label="Owner" required {...f.field('owner')}>
                    <FieldSelect placeholder="Choose a person" options={OWNERS} value={v.owner} onValueChange={o => f.set('owner', o)} />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 @min-[640px]:grid-cols-2">
                    {/* No required on the date trigger: aria-required is not allowed on a button. */}
                    <Field label="Date" {...f.field('date')}>
                      <DatePicker value={v.date} onValueChange={d => f.set('date', d)} today={today} locale={locale} placeholder="Choose a day" calendarProps={today ? { disabled: d => d < today } : undefined} />
                    </Field>
                    <Field label="Meeting type" required {...f.field('meetingType')}>
                      <FieldSelect placeholder="Choose a type" options={MEETING_TYPES} value={v.meetingType} onValueChange={o => f.set('meetingType', o)} />
                    </Field>
                  </div>
                  <Field label="What would you like to cover?" optional counter={{ value: v.notes.length, limit: 500 }} {...f.field('notes')}>
                    <Textarea placeholder="Goals, questions, links to previous work…" {...f.input('notes')} />
                  </Field>
                </>
              ) : (
                <DescriptionList>
                  <DescriptionListItem label="Customer" action={edit(0, 'customer')}>{v.name} · {v.email} · {v.phone}</DescriptionListItem>
                  <DescriptionListItem label="Meeting" action={edit(1, 'meeting')}>{labelOf(OWNERS, v.owner)} · {fmt(v.date)} · {labelOf(MEETING_TYPES, v.meetingType)}</DescriptionListItem>
                  <DescriptionListItem label="Topics" action={edit(1, 'topics')} emptyLabel="None">{v.notes || undefined}</DescriptionListItem>
                </DescriptionList>
              )}
            </CardContent>
            <CardFooter className="justify-between">
              {step > 0 ? <Button type="button" variant="outline" onClick={() => go(step - 1)}>Back</Button> : <span />}
              <Button type="submit">{step === 0 ? 'Continue to details' : step === 1 ? 'Continue to confirm' : 'Send request'}</Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}

/* Account Settings Form */

export type AccountValues = {
  name: string;
  birthDate: Date | null;
  password: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  vat: string;
  limit: number | undefined;
  notifications: string[];
  schedule?: Recurrence;
};

const PASSWORD_NEEDS: { label: string; test: (p: string) => boolean; message: string }[] = [
  { label: 'At least 12 characters', test: p => p.length >= 12, message: 'Use at least 12 characters.' },
  { label: 'One uppercase letter', test: p => /[A-Z]/.test(p), message: 'Add at least one uppercase letter.' },
  { label: 'One number or symbol', test: p => /[^A-Za-z]/.test(p), message: 'Add at least one number or symbol.' },
];

const NOTIFICATIONS = [['invoice-paid', 'Invoice paid'], ['payment-failed', 'Payment failed'], ['weekly-summary', 'Weekly summary'], ['product-updates', 'Product updates']] as const;

const SAMPLE_ADDRESSES: AddressSuggestion[] = [
  { id: 'a1', line1: '12 Market Street', line2: 'Springfield, United Kingdom' },
  { id: 'a2', line1: '12 Market Square', line2: 'Leeds, United Kingdom' },
  { id: 'a3', line1: 'Strada Memorandumului 28', line2: 'Cluj-Napoca, Romania' },
  { id: 'a4', line1: 'Strada Victoriei 12', line2: 'Sector 1, Bucharest, Romania' },
];
const sampleSearch = (q: string) => SAMPLE_ADDRESSES.filter(a => `${a.line1} ${a.line2}`.toLowerCase().includes(q.toLowerCase()));

export interface AccountSettingsFormProps extends Omit<React.ComponentProps<'div'>, 'onSubmit' | 'title'> {
  title?: string;
  description?: string;
  defaultValues?: Partial<AccountValues>;
  onSubmit?: (values: AccountValues) => void;
  onCancel?: () => void;
  /** Address suggestions (a places service); a sample list by default. */
  searchAddress?: (query: string) => AddressSuggestion[] | Promise<AddressSuggestion[]>;
  /** Report schedule start; pass a fixed date in tests. */
  today?: Date;
  locale?: string;
}

/**
 * Figma Block / Account Settings Form (1024): Form Sections (Profile, Contact, Billing, Preferences)
 * with the heading in a 280 column, then the Action Bar. A failed save shows the Error Summary at
 * the top (it takes focus, each link moves to its field) and the same messages under the fields.
 * The new password is optional; its Requirement List turns items to check as people type and to x
 * only after a save.
 */
export function AccountSettingsForm({
  title = 'Account settings',
  description = 'Manage your profile, contact details, billing and notifications.',
  defaultValues,
  onSubmit,
  onCancel,
  searchAddress = sampleSearch,
  today = new Date(),
  locale = 'en-GB',
  className,
  ...props
}: AccountSettingsFormProps) {
  const f = useBlockForm<AccountValues>(
    {
      name: 'Alex Morgan',
      birthDate: new Date(1990, 2, 14),
      password: '',
      email: 'alex.morgan@acme.com',
      phone: '+40712345678',
      address: '12 Market Street, Springfield',
      company: 'Acme Inc.',
      vat: 'DE123456789',
      limit: 250000,
      notifications: ['invoice-paid', 'payment-failed'],
      ...defaultValues,
    },
    {
      name: requiredRule('Enter your full name.'),
      birthDate: v => (v ? (v > today ? 'Enter a date of birth in the past.' : undefined) : 'Enter your date of birth as DD / MM / YYYY.'),
      password: v => (v ? PASSWORD_NEEDS.find(n => !n.test(v))?.message : undefined),
      email: emailRule,
      phone: v => phoneRule(v),
      address: requiredRule('Enter your address and pick it from the list.'),
      vat: v => (!v || /^[A-Z]{2}[0-9A-Z]{8,12}$/.test(v.replace(/\s/g, '')) ? undefined : 'Enter the VAT number with the country code, like DE123456789.'),
      limit: v => (v === undefined || v > 0 ? undefined : 'Enter a limit above 0, or leave it empty for no limit.'),
    },
    { focusFirstError: false },
  );
  const [attempts, setAttempts] = React.useState(0);
  const [saved, setSaved] = React.useState(false);
  const v = f.values;
  const errors = f.errorList({ name: 'Full name', birthDate: 'Date of birth', password: 'New password', email: 'Email', phone: 'Phone', address: 'Address', vat: 'VAT number', limit: 'Monthly spending limit' });
  const mark = (ok: boolean): CheckMark => (ok ? 'check' : attempts > 0 && v.password ? 'x' : 'dash');
  return (
    <div data-slot="account-settings-form" className={cn('flex w-full max-w-5xl flex-col gap-8 text-foreground', className)} {...props}>
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">{title}</h1>
        <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p>
      </div>
      {errors.length ? <ErrorSummary key={attempts} errors={errors} title={`Fix ${errors.length} ${errors.length === 1 ? 'field' : 'fields'} to save your changes`} /> : null}
      {saved && !errors.length ? <Alert variant="success" title="Changes saved" description="Your profile and preferences are up to date." /> : null}
      <form
        noValidate
        aria-label={title}
        className="flex flex-col gap-8"
        onSubmit={e => {
          setAttempts(a => a + 1);
          setSaved(false);
          f.submit(values => { onSubmit?.(values); setSaved(true); })(e);
        }}
      >
        <FormSection title="Profile" description="How you appear to teammates and on the invoices you send.">
          <Field label="Full name" required {...f.field('name')}>
            <Input autoComplete="name" {...f.input('name')} />
          </Field>
          <Field label="Date of birth" hint="Used to verify your identity. Never shown to others." {...f.field('birthDate')}>
            <DateInput value={v.birthDate} onValueChange={d => f.set('birthDate', d)} onBlur={() => f.blur('birthDate')} maxDate={today} locale={locale} className="w-fit" />
          </Field>
          <Field label="New password" optional hint="Leave it empty to keep your password." {...f.field('password')}>
            <PasswordInput autoComplete="new-password" {...f.input('password')} />
          </Field>
          <RequirementList title="Your password needs">
            {PASSWORD_NEEDS.map(n => <CheckItem key={n.label} mark={mark(n.test(v.password))}>{n.label}</CheckItem>)}
            <CheckItem mark="dash">Not used on another Acme account</CheckItem>
          </RequirementList>
        </FormSection>
        <FormSection title="Contact" description="Where we send receipts, security alerts and delivery updates.">
          <Field label="Email" required hint="We send receipts and account notices here." {...f.field('email')}>
            <Input type="email" autoComplete="email" {...f.input('email')} />
          </Field>
          <Field label="Phone" required {...f.field('phone')}>
            <PhoneInput value={v.phone} onValueChange={p => f.set('phone', p)} onBlur={() => f.blur('phone')} className="max-w-[212px]" />
          </Field>
          <Field label="Address" required hint="Start typing and pick your address from the list." {...f.field('address')}>
            <AddressAutocomplete search={searchAddress} value={v.address} onValueChange={q => f.set('address', q)} onSelect={s => f.set('address', `${s.line1}, ${s.line2?.split(',')[0] ?? ''}`)} className="w-full" />
          </Field>
        </FormSection>
        <FormSection title="Billing" description="Shown on every invoice. Changes apply to the next invoice.">
          <div className="grid grid-cols-1 gap-4 @min-[480px]:grid-cols-2">
            <Field label="Company name" optional {...f.field('company')}>
              <Input autoComplete="organization" {...f.input('company')} />
            </Field>
            <Field label="VAT number" optional info={{ children: 'The EU VAT number of your company, with the country code. It goes on every invoice.' }} {...f.field('vat')}>
              <Input {...f.input('vat')} />
            </Field>
          </div>
          <Field label="Monthly spending limit" optional hint="We email you when invoices reach 80% of this limit." {...f.field('limit')}>
            <CurrencyInput value={v.limit ?? null} onValueChange={m => f.set('limit', m)} onBlur={() => f.blur('limit')} locale={locale} className="max-w-[180px]" />
          </Field>
        </FormSection>
        <FormSection title="Preferences" description="Choose what we email you about and when reports arrive." divider={false}>
          <Fieldset legend="Email notifications" description="Security alerts are always sent.">
            {NOTIFICATIONS.map(([key, label]) => (
              <Checkbox
                key={key}
                label={label}
                checked={v.notifications.includes(key)}
                onCheckedChange={c => f.set('notifications', c === true ? [...v.notifications, key] : v.notifications.filter(n => n !== key))}
              />
            ))}
          </Fieldset>
          <Fieldset legend="Report schedule">
            <RecurrencePicker
              startDate={today}
              locale={locale}
              defaultValue={{ frequency: 'weekly', interval: 1, weekdays: [1, 3, 5], end: { type: 'on', date: new Date(today.getFullYear(), 11, 31) } }}
              onValueChange={r => f.set('schedule', r)}
              className="w-full"
            />
            <p className="m-0 text-xs leading-4 text-muted-foreground">Reports go to {v.email || 'your email'}.</p>
          </Fieldset>
        </FormSection>
        <ActionBar align="end" showDivider>
          <Button type="button" variant="outline" onClick={() => { f.reset(); setAttempts(0); setSaved(false); onCancel?.(); }}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </ActionBar>
      </form>
    </div>
  );
}

/* Waitlist */

export interface WaitlistProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma State: default (the form) or joined (the position and the referral link). */
  defaultState?: 'default' | 'joined';
  badge?: string;
  title?: string;
  description?: string;
  /** People already on the list: a real count from the app, never a made-up one. Hidden when undefined. */
  total?: number;
  /** Joined: the real position. */
  position?: number;
  email?: string;
  /** First name for the joined title. */
  name?: string;
  batchText?: string;
  estimate?: string;
  referralLink?: string;
  /** Adds the email to the list; may resolve with the real position and total. */
  onJoin?: (email: string) => void | Promise<{ position: number; total: number } | void>;
  onShare?: (channel: 'linkedin' | 'email') => void;
  locale?: string;
}

/**
 * Figma Block / Waitlist (1440, a whole page): the pre-launch page with the email Inline Form and
 * the people already on the list; after joining (State=joined) the real position, the estimate and
 * a referral link. The email is checked on blur and on submit; a wrong email keeps the text and
 * takes focus.
 */
export function Waitlist({
  defaultState = 'default',
  badge = 'Private beta · opens March 2027',
  title,
  description,
  total = 9320,
  position = 1248,
  email: emailProp = 'ana@acme.com',
  name = 'Ana',
  batchText = 'Spots open in batches of 500 every Monday.',
  estimate = 'Estimated invite: week of 16 November 2026',
  referralLink = 'acme.com/waitlist?ref=ana7',
  onJoin,
  onShare,
  locale = 'en-GB',
  className,
  ...props
}: WaitlistProps) {
  const [state, setState] = React.useState(defaultState);
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string>();
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState({ position, total, email: emailProp });
  const inputId = React.useId();
  const n = (x: number) => x.toLocaleString(locale === 'en-GB' ? 'en-US' : locale);
  const join = async (value: string) => {
    const problem = emailRule(value);
    setError(problem);
    if (problem) {
      document.getElementById(inputId)?.focus();
      return;
    }
    const r = onJoin?.(value.trim());
    let next: { position: number; total: number } | void = undefined;
    if (r && typeof (r as Promise<unknown>).then === 'function') {
      setPending(true);
      next = await (r as Promise<{ position: number; total: number } | void>).finally(() => setPending(false));
    }
    setResult({ position: next ? next.position : position, total: next ? next.total : total, email: value.trim() });
    setState('joined');
  };
  const joined = state === 'joined';
  return (
    <div data-slot="waitlist" data-state={state} className={cn('@container flex w-full justify-center bg-[var(--section-muted-background)] px-6 py-24 text-foreground @min-[768px]:py-32', className)} {...props}>
      <div className="flex w-full max-w-[620px] flex-col items-center gap-6 text-center">
        <Logo type="full" name="Acme" />
        {badge ? <Badge variant="soft-info" shape="pill">{badge}</Badge> : null}
        <div className="flex flex-col gap-4">
          <h1 className="m-0 text-4xl leading-tight font-bold tracking-[-1px] @min-[768px]:text-5xl">{title ?? (joined ? `You are on the list${name ? `, ${name}` : ''}` : 'Be first to try Acme Projects')}</h1>
          <p className="m-0 text-lg leading-7 text-muted-foreground">
            {description ?? (joined ? `We sent a confirmation to ${result.email}. We will email you again when your spot opens.` : 'Plan work, track hours and send invoices from one place. We open the beta in small batches so every team gets a proper onboarding call.')}
          </p>
        </div>
        {joined ? (
          <section aria-labelledby={`${inputId}-position`} className="flex w-full max-w-[480px] flex-col gap-5 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xs">
            <div className="flex flex-col items-center gap-1">
              <h2 id={`${inputId}-position`} className="m-0 text-xs leading-4 font-medium tracking-widest text-muted-foreground uppercase">Your position</h2>
              <p data-slot="waitlist-position" className="m-0 text-5xl leading-tight font-bold tracking-[-1px]">#{n(result.position)}</p>
              <p className="m-0 text-sm leading-5 text-muted-foreground">of {n(result.total)} people. {batchText}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Progress value={Math.max(0, Math.min(100, (1 - result.position / result.total) * 100))} size="sm" aria-label="Place in the queue" />
              <p className="m-0 text-xs leading-4 text-muted-foreground">{estimate}</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-3 text-left">
              <h3 className="m-0 text-sm leading-5 font-medium">Move up the list</h3>
              <p className="m-0 text-sm leading-5 text-muted-foreground">Every friend who joins with your link moves you up 100 places.</p>
              <CopyField value={referralLink} aria-label="Your referral link" />
              <div className="grid grid-cols-1 gap-2 @min-[400px]:grid-cols-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onShare?.('linkedin')}>Share on LinkedIn</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => onShare?.('email')}>Email a friend</Button>
              </div>
            </div>
          </section>
        ) : (
          <>
            <InlineForm
              className="w-full max-w-[480px] text-left"
              label="Work email"
              placeholder="you@company.com"
              buttonLabel="Join the waitlist"
              hint="One email when your spot opens. No spam."
              error={error}
              pending={pending}
              value={email}
              onValueChange={v => { setEmail(v); if (error) setError(emailRule(v)); }}
              onSubmit={v => join(v)}
              inputProps={{ id: inputId, type: 'email', autoComplete: 'email', onBlur: () => { if (email) setError(emailRule(email)); } }}
            />
            {total ? (
              <AvatarGroup size="sm" more={3} moreLabel="And 3 more" label={`Join ${n(total)} people already on the list`}>
                <Avatar initials="MI" />
                <Avatar initials="DP" />
                <Avatar initials="RS" />
              </AvatarGroup>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
