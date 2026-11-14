// EGG UI Blocks, Forms page (BLOCKS / Forms, Figma 67:2089), the auth group: Block / Sign In,
// Sign Up, Forgot Password, Check Email, Reset Password, Two-Factor, Accept Invite (the 384 form
// card) and Block / Sign In Split, Sign Up Split (the 1440 x 900 desktop screen around the card).
// Card: Card default, 24 padding and gap; Card Header (title ui h 18/28, description body/small
// muted); content 16 apart; full width buttons. Guides: build-ui/patterns/auth.md and
// form-validation.md. Validation: a field is checked when people leave it (after they typed), then
// on every change once it shows an error; Submit checks every field and moves focus to the first
// wrong one. Errors come from Field (aria-invalid, described by the message). Wrong credentials are
// one destructive Alert at the top, never a per-field hint. Values are never logged.
// useBlockForm is shared by the other Forms page files (form-data-blocks, form-onboarding-blocks).
import * as React from 'react';
import { CircleAlert, Mail } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Alert } from './alert';
import { Button } from './button';
import { Card, CardContent, CardHeader } from './card';
import { Checkbox } from './checkbox';
import { CheckItem } from './form-layout';
import { Field } from './field';
import { IconTile } from './icon-tile';
import { ImagePlaceholder } from './image-placeholder';
import { InputGroup, type InputGroupProps } from './input-group';
import { Input } from './input';
import { InputOTP } from './input-otp';
import { Logo } from './logo';
import { LogoTile } from './logo-tile';
import { PasswordStrength, passwordStrength } from './password-strength';
import type { BrandLogoName } from './brand-logos';
import { TestimonialCard } from './quote';
import { Separator } from './separator';

/* Form state shared by the Forms blocks */

export type FormRules<V> = { [K in keyof V]?: (value: V[K], values: V) => string | undefined };
export type FormErrors<V> = Partial<Record<keyof V, string>>;

export interface BlockFormOptions {
  /** Long forms show an Error Summary that takes focus; otherwise focus goes to the first wrong field. */
  focusFirstError?: boolean;
}

/**
 * Values, errors and handlers of one form. `field(k)` gives Field its id and error; `input(k)` gives
 * a text control its value, onChange and onBlur. The rules run in their key order, which is the order
 * of the fields on screen (the first wrong one takes focus).
 */
export function useBlockForm<V extends Record<string, unknown>>(initial: V, rules: FormRules<V>, { focusFirstError = true }: BlockFormOptions = {}) {
  const base = React.useId();
  const [values, setValues] = React.useState<V>(initial);
  const [errors, setErrors] = React.useState<FormErrors<V>>({});
  const valuesRef = React.useRef(values);
  const errorsRef = React.useRef(errors);
  const dirty = React.useRef(new Set<keyof V>());
  // Fields that showed an error are checked on every change from then on.
  const live = React.useRef(new Set<keyof V>());
  const id = (k: keyof V) => `${base}-${String(k)}`;
  const check = (k: keyof V, all: V) => rules[k]?.(all[k], all);

  const writeErrors = (next: FormErrors<V>) => {
    for (const k of Object.keys(next) as (keyof V)[]) if (next[k]) live.current.add(k);
    errorsRef.current = next;
    setErrors(next);
  };
  const set = <K extends keyof V>(k: K, v: V[K]) => {
    const next = { ...valuesRef.current, [k]: v };
    valuesRef.current = next;
    dirty.current.add(k);
    setValues(next);
    // Fields that showed an error are checked again on every change, so the message clears once fixed
    // and comes back if it breaks again (a confirm field follows the password it must match).
    const shown = [...live.current];
    if (shown.length) {
      const e = { ...errorsRef.current };
      for (const key of shown) e[key] = check(key, next);
      writeErrors(e);
    }
  };
  const blur = (k: keyof V) => {
    if (!dirty.current.has(k)) return;
    writeErrors({ ...errorsRef.current, [k]: check(k, valuesRef.current) });
  };
  const validate = () => {
    const e: FormErrors<V> = {};
    for (const k of Object.keys(rules) as (keyof V)[]) {
      const msg = check(k, valuesRef.current);
      if (msg) e[k] = msg;
    }
    writeErrors(e);
    return e;
  };
  const submit = (onValid: (values: V) => void) => (event?: React.FormEvent) => {
    event?.preventDefault();
    const e = validate();
    const first = (Object.keys(rules) as (keyof V)[]).find(k => e[k]);
    if (first === undefined) onValid(valuesRef.current);
    else if (focusFirstError) document.getElementById(id(first))?.focus();
  };
  const reset = (next: V = initial) => {
    valuesRef.current = next;
    dirty.current.clear();
    live.current.clear();
    setValues(next);
    writeErrors({});
  };
  const field = (k: keyof V) => ({ id: id(k), error: errors[k] });
  const input = (k: keyof V) => ({
    value: (values[k] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value as V[keyof V]),
    onBlur: () => blur(k),
  });
  /** The errors in field order with their control ids, for the Error Summary. */
  const errorList = (labels: Partial<Record<keyof V, string>> = {}) =>
    (Object.keys(rules) as (keyof V)[])
      .filter(k => errors[k])
      .map(k => ({ fieldId: id(k), message: labels[k] ? `${labels[k]}: ${lower(errors[k]!)}` : errors[k]! }));
  return { values, errors, set, blur, validate, submit, reset, field, input, id, errorList };
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/* Rules (same wording as the auth pages in src/pages) */

export const emailRule = (email: string): string | undefined =>
  !email.trim() ? 'Enter your email address.' : !/^\S+@\S+\.\S+$/.test(email.trim()) ? 'Enter an email address like name@company.com.' : undefined;
export const requiredRule = (message: string) => (value: string) => (value.trim() ? undefined : message);
export const newPasswordRule = (password: string) =>
  !password ? 'Enter a password.' : password.length < 8 ? 'Use at least 8 characters.' : undefined;

/* Controls */

/** Email with the mail icon at the start (Figma Field Preset Type=email). */
export function EmailInput({ inputClassName, ...props }: InputGroupProps) {
  return (
    <InputGroup
      type="email"
      autoComplete="email"
      placeholder="name@example.com"
      start={<span aria-hidden="true" className="flex items-center pl-3 text-muted-foreground [&_svg]:size-4"><Mail /></span>}
      inputClassName={cn('pl-2', inputClassName)}
      {...props}
    />
  );
}

/** Password with a Show / Hide text toggle at the end (Figma Field Preset Type=password). Paste stays allowed. */
export function PasswordInput({ autoComplete = 'current-password', ...props }: InputGroupProps) {
  const [shown, setShown] = React.useState(false);
  return (
    <InputGroup
      type={shown ? 'text' : 'password'}
      autoComplete={autoComplete}
      end={
        <Button type="button" variant="ghost" size="xs" className="mr-1 self-center text-muted-foreground" aria-pressed={shown} onClick={() => setShown(s => !s)}>
          {shown ? 'Hide' : 'Show'}<span className="sr-only"> password</span>
        </Button>
      }
      {...props}
    />
  );
}

/**
 * A new password: the Field, then Password Strength under it. The input is described by the error
 * (or hint) and by the strength message.
 */
export function NewPasswordField({
  label = 'New password',
  id,
  error,
  value,
  onChange,
  onBlur,
}: {
  label?: string;
  id: string;
  error?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: () => void;
}) {
  const strengthId = `${id}-strength`;
  return (
    <div data-slot="new-password" className="flex flex-col gap-2">
      <Field id={id} label={label} error={error} required>
        <PasswordInput autoComplete="new-password" value={value} onChange={onChange} onBlur={onBlur} aria-describedby={[error ? `${id}-hint` : null, strengthId].filter(Boolean).join(' ')} />
      </Field>
      <PasswordStrength level={passwordStrength(value)} messageId={strengthId} />
    </div>
  );
}

/** The error of a control that is not in a Field (a checkbox, the code), styled like the Field error. */
export function ControlError({ id, children, className }: { id: string; children?: React.ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <p id={id} data-slot="field-error" className={cn('m-0 flex items-start gap-1.5 text-xs text-destructive', className)}>
      <span className="flex h-4 shrink-0 items-center"><CircleAlert className="size-3.5" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
}

const textLink = 'font-medium text-brand underline underline-offset-4 rounded-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

/** A link action in the card (Figma Button Variant=link, Size=sm), centered or at the end. */
function CardLink({ href, onClick, align = 'center', children }: { href?: string; onClick?: () => void; align?: 'center' | 'end'; children: React.ReactNode }) {
  return (
    <div className={cn('flex', align === 'center' ? 'justify-center' : 'justify-end')}>
      {href ? (
        <Button asChild variant="link" size="sm"><a href={href}>{children}</a></Button>
      ) : (
        <Button type="button" variant="link" size="sm" onClick={onClick}>{children}</Button>
      )}
    </div>
  );
}

/* The card */

export interface AuthCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The card is the screen's main heading (h1); h2 when it sits under another h1. */
  titleAs?: 'h1' | 'h2';
  /** A 48 icon circle above the title (Check Email). */
  icon?: React.ReactNode;
}

/** Figma Card default (384 wide) with the auth Header and Content slots. */
export function AuthCard({ title, description, titleAs = 'h1', icon, className, children, ...props }: AuthCardProps) {
  return (
    <Card data-slot="auth-card" className={cn('w-96 max-w-full', className)} {...props}>
      <div className="flex flex-col gap-4">
        {icon ? <div className="px-[var(--card-padding)]"><IconTile icon={icon} size="lg" className="rounded-full" /></div> : null}
        {titleAs === 'h2' ? (
          <CardHeader title={title} titleAs="h2" description={description} />
        ) : (
          // Card Header has no h1 option yet (titleAs h2-h6): the same header with an h1, the screen's heading.
          <div data-slot="card-header" className="flex min-w-0 flex-col gap-1.5 px-[var(--card-padding)]">
            <h1 data-slot="card-title" className="m-0 text-lg leading-7 font-semibold">{title}</h1>
            {description ? <p data-slot="card-description" className="m-0 text-sm text-muted-foreground">{description}</p> : null}
          </div>
        )}
      </div>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function useSubmitting() {
  const [busy, setBusy] = React.useState(false);
  const run = (result: unknown) => {
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      setBusy(true);
      (result as Promise<unknown>).finally(() => setBusy(false));
    }
  };
  return [busy, run] as const;
}

/* Sign In */

export type SignInValues = { email: string; password: string };

export interface SignInProps extends Omit<React.ComponentProps<'div'>, 'title' | 'onSubmit'> {
  title?: string;
  description?: string;
  /** Wrong credentials: one destructive Alert at the top, the input kept. */
  error?: string;
  /** The lockout rule under the error. */
  errorDescription?: string;
  defaultEmail?: string;
  /** Called with valid values; a promise shows the button loading until it settles. */
  onSubmit?: (values: SignInValues) => void | Promise<unknown>;
  forgotHref?: string;
  /** Identity provider button under "or"; null hides it. */
  providerLabel?: string | null;
  onProvider?: () => void;
  titleAs?: 'h1' | 'h2';
}

export function SignIn({
  title = 'Sign in',
  description = 'Use your work account.',
  error,
  errorDescription = 'After 5 failed attempts we pause sign-in for 15 minutes.',
  defaultEmail = '',
  onSubmit,
  forgotHref = '#forgot-password',
  providerLabel = 'Continue with Google',
  onProvider,
  titleAs,
  ...props
}: SignInProps) {
  const f = useBlockForm({ email: defaultEmail, password: '' }, { email: emailRule, password: requiredRule('Enter your password.') });
  const [busy, run] = useSubmitting();
  return (
    <AuthCard title={title} description={description} titleAs={titleAs} {...props}>
      <form noValidate aria-label={title} onSubmit={f.submit(v => run(onSubmit?.(v)))} className="flex flex-col gap-4">
        {error ? <Alert variant="destructive" title={error} description={errorDescription} /> : null}
        <Field label="Email" required {...f.field('email')}>
          <EmailInput autoComplete="username" {...f.input('email')} />
        </Field>
        <Field label="Password" required {...f.field('password')}>
          <PasswordInput placeholder="Your password" {...f.input('password')} />
        </Field>
        <CardLink href={forgotHref} align="end">Forgot password?</CardLink>
        <Button type="submit" className="w-full" loading={busy}>{title}</Button>
        {providerLabel ? (
          <>
            <Separator label="or" />
            <Button type="button" variant="outline" className="w-full" onClick={onProvider}>{providerLabel}</Button>
          </>
        ) : null}
      </form>
    </AuthCard>
  );
}

/* Sign Up */

export type SignUpValues = { name: string; email: string; password: string; terms: boolean };

export interface SignUpProps extends Omit<React.ComponentProps<'div'>, 'title' | 'onSubmit'> {
  title?: string;
  description?: string;
  onSubmit?: (values: SignUpValues) => void | Promise<unknown>;
  termsHref?: string;
  privacyHref?: string;
  submitLabel?: string;
  titleAs?: 'h1' | 'h2';
}

export function SignUp({
  title = 'Create your account',
  description = 'Free for 14 days. No card needed.',
  onSubmit,
  termsHref = '#terms',
  privacyHref = '#privacy',
  submitLabel = 'Create account',
  titleAs,
  ...props
}: SignUpProps) {
  const f = useBlockForm<SignUpValues>(
    { name: '', email: '', password: '', terms: false },
    {
      name: requiredRule('Enter your full name.'),
      email: emailRule,
      password: newPasswordRule,
      terms: v => (v ? undefined : 'Accept the terms to create an account.'),
    },
  );
  const [busy, run] = useSubmitting();
  const termsError = `${f.id('terms')}-error`;
  return (
    <AuthCard title={title} description={description} titleAs={titleAs} {...props}>
      <form noValidate aria-label={title} onSubmit={f.submit(v => run(onSubmit?.(v)))} className="flex flex-col gap-4">
        <Field label="Full name" required {...f.field('name')}>
          <Input autoComplete="name" placeholder="Ana Popescu" {...f.input('name')} />
        </Field>
        <Field label="Email" required {...f.field('email')}>
          <EmailInput {...f.input('email')} />
        </Field>
        <NewPasswordField {...f.field('password')} {...f.input('password')} onBlur={() => f.blur('password')} />
        <div className="flex flex-col gap-1.5">
          <Checkbox
            id={f.id('terms')}
            checked={f.values.terms}
            onCheckedChange={v => f.set('terms', v === true)}
            invalid={!!f.errors.terms}
            aria-describedby={f.errors.terms ? termsError : undefined}
            label={<>I agree to the <a href={termsHref} className={textLink}>Terms</a> and the <a href={privacyHref} className={textLink}>Privacy Policy</a></>}
          />
          <ControlError id={termsError} className="pl-6">{f.errors.terms}</ControlError>
        </div>
        <Button type="submit" className="w-full" loading={busy}>{submitLabel}</Button>
      </form>
    </AuthCard>
  );
}

/* Check Email */

export interface CheckEmailProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: string;
  email?: string;
  /** What the link does: "a reset link", "a sign-in link". */
  what?: string;
  expiresIn?: string;
  /** Seconds before Resend is offered. */
  resendAfter?: number;
  onResend?: () => void;
  onOpenEmailApp?: () => void;
  backHref?: string;
  backLabel?: string;
  titleAs?: 'h1' | 'h2';
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** After a reset or sign-in link was sent. Same text for any address: it never says whether an account exists. */
export function CheckEmail({
  title = 'Check your email',
  email = 'ana@example.com',
  what = 'a reset link',
  expiresIn = '30 minutes',
  resendAfter = 45,
  onResend,
  onOpenEmailApp,
  backHref = '#sign-in',
  backLabel = 'Back to sign in',
  titleAs,
  ...props
}: CheckEmailProps) {
  const [left, setLeft] = React.useState(resendAfter);
  React.useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft(l => l - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left]);
  return (
    <AuthCard
      title={title}
      titleAs={titleAs}
      icon={<Mail />}
      description={<>We sent {what} to <span className="font-medium text-foreground">{email}</span>. It expires in {expiresIn}.</>}
      {...props}
    >
      <Button type="button" variant="outline" className="w-full" onClick={onOpenEmailApp}>Open email app</Button>
      <p data-slot="resend" className="m-0 text-center text-sm leading-5 text-muted-foreground">
        {left > 0 ? (
          <>Didn't get it? Check spam or resend in {clock(left)}.</>
        ) : (
          <>Didn't get it? Check spam or{' '}
            <button type="button" className={textLink} onClick={() => { onResend?.(); setLeft(resendAfter); }}>resend the link</button>.
          </>
        )}
      </p>
      <CardLink href={backHref}>{backLabel}</CardLink>
    </AuthCard>
  );
}

/* Forgot Password */

export interface ForgotPasswordProps extends Omit<React.ComponentProps<'div'>, 'title' | 'onSubmit'> {
  title?: string;
  description?: string;
  defaultEmail?: string;
  onSubmit?: (values: { email: string }) => void | Promise<unknown>;
  backHref?: string;
  /** After a valid submit the same card turns into Check Email, so the page does not jump. */
  showCheckEmail?: boolean;
  titleAs?: 'h1' | 'h2';
}

export function ForgotPassword({
  title = 'Reset your password',
  description = 'Enter the email of your account and we will send you a reset link.',
  defaultEmail = '',
  onSubmit,
  backHref = '#sign-in',
  showCheckEmail = true,
  titleAs,
  ...props
}: ForgotPasswordProps) {
  const f = useBlockForm({ email: defaultEmail }, { email: emailRule });
  const [busy, run] = useSubmitting();
  const [sent, setSent] = React.useState<string>();
  if (sent && showCheckEmail) return <CheckEmail email={sent} backHref={backHref} titleAs={titleAs} {...props} />;
  return (
    <AuthCard title={title} description={description} titleAs={titleAs} {...props}>
      <form
        noValidate
        aria-label={title}
        onSubmit={f.submit(v => {
          run(onSubmit?.(v));
          setSent(v.email.trim());
        })}
        className="flex flex-col gap-4"
      >
        <Field label="Email" required {...f.field('email')}>
          <EmailInput {...f.input('email')} />
        </Field>
        <Button type="submit" className="w-full" loading={busy}>Send reset link</Button>
        <CardLink href={backHref}>Back to sign in</CardLink>
      </form>
    </AuthCard>
  );
}

/* Reset Password */

export interface ResetPasswordProps extends Omit<React.ComponentProps<'div'>, 'title' | 'onSubmit'> {
  title?: string;
  description?: string;
  onSubmit?: (values: { password: string }) => void | Promise<unknown>;
  titleAs?: 'h1' | 'h2';
}

export function ResetPassword({
  title = 'Set a new password',
  description = 'Use at least 8 characters. You will be signed in on this device.',
  onSubmit,
  titleAs,
  ...props
}: ResetPasswordProps) {
  const f = useBlockForm(
    { password: '', confirm: '' },
    {
      password: newPasswordRule,
      confirm: (v, all) => (!v ? 'Type the new password again.' : v !== all.password ? 'The passwords do not match. Type the same password twice.' : undefined),
    },
  );
  const [busy, run] = useSubmitting();
  return (
    <AuthCard title={title} description={description} titleAs={titleAs} {...props}>
      <form noValidate aria-label={title} onSubmit={f.submit(v => run(onSubmit?.({ password: v.password })))} className="flex flex-col gap-4">
        <NewPasswordField {...f.field('password')} {...f.input('password')} onBlur={() => f.blur('password')} />
        <Field label="Confirm password" required {...f.field('confirm')}>
          <PasswordInput autoComplete="new-password" {...f.input('confirm')} />
        </Field>
        <Button type="submit" className="w-full" loading={busy}>Update password</Button>
      </form>
    </AuthCard>
  );
}

/* Two-Factor */

export interface TwoFactorProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: string;
  description?: string;
  /** Checks the code (auto-submitted on the last digit). Return false, or a promise of false, for a wrong code. */
  onVerify?: (code: string, trustDevice: boolean) => boolean | void | Promise<boolean | void>;
  recoveryHref?: string;
  /** Start with the wrong-code message. */
  defaultError?: boolean;
  titleAs?: 'h1' | 'h2';
}

export function TwoFactor({
  title = 'Two-step verification',
  description = 'Enter the 6-digit code from your authenticator app.',
  onVerify,
  recoveryHref = '#recovery-code',
  defaultError = false,
  titleAs,
  ...props
}: TwoFactorProps) {
  const wrong = 'That code is not right. Check your app and try again; codes change every 30 seconds.';
  const [code, setCode] = React.useState('');
  const [trust, setTrust] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(defaultError ? wrong : undefined);
  const [busy, setBusy] = React.useState(false);
  const id = React.useId();
  const verify = async (value: string) => {
    if (value.length < 6) {
      setError('Enter the 6-digit code.');
      document.getElementById(id)?.focus();
      return;
    }
    const result = onVerify?.(value, trust);
    let ok: boolean | void = result as boolean | void;
    if (result && typeof (result as Promise<boolean | void>).then === 'function') {
      setBusy(true);
      ok = await (result as Promise<boolean | void>).finally(() => setBusy(false));
    }
    if (ok === false) setError(wrong);
  };
  return (
    <AuthCard title={title} description={description} titleAs={titleAs} {...props}>
      <form noValidate aria-label={title} onSubmit={e => { e.preventDefault(); verify(code); }} className="flex flex-col gap-4">
        <Field id={id} label="6-digit code" showLabel={false} error={error}>
          <InputOTP
            length={6}
            aria-label="6-digit code"
            value={code}
            onValueChange={v => { setCode(v); if (error) setError(undefined); }}
            onComplete={verify}
            className="self-start"
          />
        </Field>
        <Checkbox label="Trust this device for 30 days" checked={trust} onCheckedChange={v => setTrust(v === true)} />
        <Button type="submit" className="w-full" loading={busy}>Verify</Button>
        <CardLink href={recoveryHref}>Use a recovery code instead</CardLink>
      </form>
    </AuthCard>
  );
}

/* Accept Invite */

export interface AcceptInviteProps extends Omit<React.ComponentProps<'div'>, 'title' | 'onSubmit'> {
  workspace?: string;
  inviter?: string;
  role?: string;
  /** Fixed from the invite: read only. */
  email?: string;
  /** An expired invite: explain and offer to ask for a new one. */
  expired?: boolean;
  onSubmit?: (values: { name: string; password: string }) => void | Promise<unknown>;
  onRequestNew?: () => void;
  otherAccountHref?: string;
  titleAs?: 'h1' | 'h2';
}

export function AcceptInvite({
  workspace = 'Northwind Studio',
  inviter = 'Maria Ilie',
  role = 'Editor',
  email = 'ana@example.com',
  expired = false,
  onSubmit,
  onRequestNew,
  otherAccountHref = '#sign-in',
  titleAs,
  ...props
}: AcceptInviteProps) {
  const f = useBlockForm({ name: '', password: '' }, { name: requiredRule('Enter your full name.'), password: newPasswordRule });
  const [busy, run] = useSubmitting();
  const title = `Join ${workspace}`;
  return (
    <AuthCard title={title} description={`${inviter} invited you to the workspace as ${role}.`} titleAs={titleAs} {...props}>
      {expired ? (
        <>
          <Alert variant="warning" title="This invitation has expired" description={`Invitations last 7 days. Ask ${inviter} for a new one; it goes to ${email}.`} />
          <Button type="button" className="w-full" onClick={onRequestNew}>Ask for a new invite</Button>
        </>
      ) : (
        <form noValidate aria-label={title} onSubmit={f.submit(v => run(onSubmit?.(v)))} className="flex flex-col gap-4">
          <Field label="Email" hint="From the invitation">
            <EmailInput value={email} readOnly className="bg-muted" />
          </Field>
          <Field label="Full name" required {...f.field('name')}>
            <Input autoComplete="name" placeholder="Ana Popescu" {...f.input('name')} />
          </Field>
          <NewPasswordField label="Create a password" {...f.field('password')} {...f.input('password')} onBlur={() => f.blur('password')} />
          <Button type="submit" className="w-full" loading={busy}>Accept invitation</Button>
        </form>
      )}
      <CardLink href={otherAccountHref}>Not you? Use another account</CardLink>
    </AuthCard>
  );
}

/* Split screens */

function SplitFormPanel({ children, legal }: { children: React.ReactNode; legal: React.ReactNode }) {
  return (
    <div data-slot="split-form-panel" className="flex min-h-svh min-w-0 flex-col justify-between gap-10 p-6 @min-[640px]:p-10 @min-[1024px]:min-h-[900px]">
      <header>
        <a href="#home" className="inline-flex rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"><Logo type="full" name="Acme" /></a>
      </header>
      <main className="flex justify-center">{children}</main>
      <footer className="text-xs leading-4 text-muted-foreground">{legal}</footer>
    </div>
  );
}

const defaultLegal = (
  <p className="m-0">
    © 2026 Acme · <a href="#privacy" className="underline-offset-4 hover:underline">Privacy</a> · <a href="#terms" className="underline-offset-4 hover:underline">Terms</a>
  </p>
);

export interface SignInSplitProps extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  /** The card in the Form slot; put the next step (code, check email) here so the page does not jump. */
  form?: React.ReactNode;
  quote?: string;
  author?: { name: string; role: string; initials: string };
  /** Photo of the brand panel (decorative); a placeholder without it. */
  image?: string;
  legal?: React.ReactNode;
}

/** Desktop sign in: the form left (752), a photo with a testimonial right; below 1024 the photo goes. */
export function SignInSplit({
  form = <SignIn />,
  quote = '“We moved every client project into one workspace and cut our month-end invoicing from three days to one afternoon.”',
  author = { name: 'Elena Popa', role: 'CFO, Northwind Traders', initials: 'EP' },
  image,
  legal = defaultLegal,
  className,
  ...props
}: SignInSplitProps) {
  return (
    <div data-slot="sign-in-split" className={cn('@container w-full bg-background text-foreground', className)} {...props}>
      <div className="grid @min-[1024px]:grid-cols-[752fr_688fr]">
      <SplitFormPanel legal={legal}>{form}</SplitFormPanel>
      <aside aria-label="What customers say" className="hidden min-w-0 py-4 pr-4 @min-[1024px]:flex">
        <div data-slot="split-visual" className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-xl p-10">
          <ImagePlaceholder ratio="3:4" src={image} alt="" showCaption={false} className="absolute inset-0 h-full rounded-none [aspect-ratio:auto]" />
          <TestimonialCard className="relative w-[420px] max-w-full" quote={quote} rating={5} by={{ name: author.name, role: author.role, initials: author.initials }} />
        </div>
      </aside>
      </div>
    </div>
  );
}

export interface SignUpSplitProps extends Omit<React.ComponentProps<'div'>, 'onSubmit' | 'title'> {
  form?: React.ReactNode;
  title?: string;
  description?: string;
  benefits?: string[];
  trustLine?: string;
  logos?: BrandLogoName[];
  legal?: React.ReactNode;
}

/** Desktop sign up: the form left (696), benefits, proof and customer logos on a muted panel right. */
export function SignUpSplit({
  form = <SignUp />,
  title = 'Everything your team needs to deliver client work',
  description = 'Plan projects, track hours and send invoices from one workspace. Set up takes about five minutes.',
  benefits = ['Free for 14 days, no card needed', 'Unlimited projects, clients and guests', 'Import from spreadsheets or your old tool in minutes', 'Cancel any time from Settings, your data stays yours'],
  trustLine = 'Trusted by 2,300 teams in 41 countries',
  logos = ['Northwind', 'Lumora', 'Kestrel', 'Quintra', 'Halcyon', 'Meridian'],
  legal = defaultLegal,
  className,
  ...props
}: SignUpSplitProps) {
  const titleId = React.useId();
  return (
    <div data-slot="sign-up-split" className={cn('@container w-full bg-background text-foreground', className)} {...props}>
      <div className="grid @min-[1024px]:grid-cols-[696fr_744fr]">
      <SplitFormPanel legal={legal}>{form}</SplitFormPanel>
      <aside aria-labelledby={titleId} className="hidden min-w-0 flex-col justify-center gap-10 bg-[var(--section-muted-background)] p-16 @min-[1024px]:flex">
        <div className="flex flex-col gap-3">
          <h2 id={titleId} className="m-0 text-3xl leading-9 font-semibold tracking-[-0.6px]">{title}</h2>
          <p className="m-0 text-lg leading-7 text-muted-foreground">{description}</p>
        </div>
        <ul aria-label="What you get" className="m-0 flex flex-col gap-3 p-0">
          {benefits.map(b => <CheckItem key={b} stateText={{ check: 'Included: ' }}>{b}</CheckItem>)}
        </ul>
        <div className="flex flex-col gap-4">
          <p className="m-0 text-xs leading-4 text-muted-foreground">{trustLine}</p>
          <ul aria-label="Customers" className="m-0 flex flex-wrap gap-2 p-0">
            {logos.map(l => <LogoTile key={l} as="li" logo={l} tileStyle="plain" />)}
          </ul>
        </div>
      </aside>
      </div>
    </div>
  );
}

