import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordStrength, passwordStrength } from '@/components/ui/password-strength';
import { AuthHeading, AuthSplit, CheckboxField, OrDivider, PasswordField, ProviderButtons, emailError } from './site-parts';

type Errors = { name?: string; email?: string; password?: string; terms?: string };

/** Sign up: one task, the least a new account needs. Same split layout as sign in. */
export function RegisterPage({ showErrors = false }: { showErrors?: boolean }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [terms, setTerms] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>(
    showErrors ? { name: 'Enter your name.', email: 'Enter your email address.', password: 'Use at least 8 characters.', terms: 'Accept the terms to create an account.' } : {},
  );
  const [created, setCreated] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {
      name: name.trim() ? undefined : 'Enter your name.',
      email: emailError(email),
      password: password.length >= 8 ? undefined : 'Use at least 8 characters.',
      terms: terms ? undefined : 'Accept the terms to create an account.',
    };
    setErrors(next);
    if (!next.name && !next.email && !next.password && !next.terms) setCreated(true);
  };

  return (
    <AuthSplit
      aside={
        <div className="flex max-w-md flex-col gap-6">
          <h2 className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">Close the month in days, not weeks.</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-base leading-6">
            <li>14 days free, no card needed.</li>
            <li>Invite your team and your accountant.</li>
            <li>Cancel any time; your data stays yours.</li>
          </ul>
          <p className="m-0 flex items-center gap-3 text-sm leading-5">
            <Avatar initials="DP" size="lg" />
            <span>Used by 2,400 finance teams across Europe.</span>
          </p>
        </div>
      }
    >
      <AuthHeading title="Create your account" description="Start your 14-day free trial. No credit card needed." />
      {created ? (
        <Alert variant="success" title="Check your email" description={`We sent a link to ${email} to confirm your address.`} />
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-col gap-4" aria-label="Create account">
          <Field label="Full name" error={errors.name} required>
            <Input autoComplete="name" placeholder="Ana Popescu" value={name} onChange={e => setName(e.target.value)} />
          </Field>
          <Field label="Work email" error={errors.email} required>
            <Input type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </Field>
          <div className="flex flex-col gap-2">
            <PasswordField label="Password" autoComplete="new-password" value={password} onChange={setPassword} error={errors.password} />
            <PasswordStrength level={passwordStrength(password)} />
          </div>
          <CheckboxField
            checked={terms}
            onCheckedChange={v => setTerms(v === true)}
            error={errors.terms}
            label={<>I agree to the <a href="#terms" className="underline underline-offset-4">Terms</a> and the <a href="#privacy" className="underline underline-offset-4">Privacy Policy</a></>}
          />
          <Button type="submit" className="w-full">Create account</Button>
          <OrDivider />
          <ProviderButtons verb="Sign up" />
        </form>
      )}
      <p className="m-0 text-sm leading-5 text-muted-foreground">
        Already have an account? <a href="#login" className="font-medium text-brand underline-offset-4 hover:underline">Sign in</a>
      </p>
    </AuthSplit>
  );
}
