import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AuthHeading, AuthSplit, OrDivider, PasswordField, ProviderButtons, emailError } from './site-parts';

export interface LoginPageProps {
  /** Start with the wrong-credentials message showing. */
  initialError?: boolean;
  defaultEmail?: string;
}

/** The demo account: anything else fails with the single "incorrect" message. */
export const demoLogin = { email: 'ana@acme.com', password: 'correct horse battery' };

/** Sign in, desktop: the form left, a brand panel right (from 1024 px); a phone gets the form alone. */
export function LoginPage({ initialError = false, defaultEmail = '' }: LoginPageProps) {
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [failed, setFailed] = React.useState(initialError);
  const [signedIn, setSignedIn] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { email: emailError(email), password: password ? undefined : 'Enter your password.' };
    setErrors(next);
    setFailed(false);
    if (next.email || next.password) return;
    if (email.trim().toLowerCase() === demoLogin.email && password === demoLogin.password) setSignedIn(true);
    else setFailed(true);
  };

  return (
    <AuthSplit
      aside={
        <figure className="m-0 flex max-w-md flex-col gap-6">
          <blockquote className="m-0 text-2xl leading-8 font-medium tracking-[-0.4px]">
            “Acme cut our month-end close from nine days to five, and nobody asked for a training session.”
          </blockquote>
          <figcaption className="flex items-center gap-3 text-sm leading-5">
            <Avatar initials="MI" size="lg" />
            <span><strong className="font-semibold">Maria Ilie</strong><br />Finance lead, Northwind Traders</span>
          </figcaption>
        </figure>
      }
    >
      <AuthHeading title="Sign in" description="Welcome back. Sign in to continue to Acme." />
      {signedIn ? (
        <Alert variant="success" title="You are signed in" description="Taking you to your dashboard…" />
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-col gap-4" aria-label="Sign in">
          {failed ? <Alert variant="destructive" title="Email or password is incorrect" description="After 5 failed attempts we pause sign-in for 15 minutes." /> : null}
          <Field label="Email" error={errors.email} required>
            <Input type="email" autoComplete="username" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </Field>
          <PasswordField value={password} onChange={setPassword} error={errors.password} />
          <div className="flex items-center justify-between gap-3">
            <Checkbox label="Trust this device" />
            <a href="#forgot-password" className="text-sm leading-5 font-medium text-brand underline-offset-4 hover:underline">Forgot password?</a>
          </div>
          <Button type="submit" className="w-full">Sign in</Button>
          <OrDivider />
          <ProviderButtons />
        </form>
      )}
      <p className="m-0 text-sm leading-5 text-muted-foreground">
        New to Acme? <a href="#register" className="font-medium text-brand underline-offset-4 hover:underline">Create an account</a>
      </p>
    </AuthSplit>
  );
}
