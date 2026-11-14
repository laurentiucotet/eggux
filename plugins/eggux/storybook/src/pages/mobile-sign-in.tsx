import * as React from 'react';
import { UserCheck } from '@/components/icons';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MobileHeader } from '@/components/ui/mobile-header';
import { PhoneScreen } from './mobile-parts';
import { AuthHeading, OrDivider, PasswordField, ProviderButtons, emailError } from './site-parts';

/** The demo account: anything else fails with the single "incorrect" message. */
export const demoMobileLogin = { email: 'ana@acme.com', password: 'correct horse battery' };

/** Sign in on a phone: brand header, email and password with a Show toggle, Face ID as the secondary way in, providers below. */
export function MobileSignInPage({ initialError = false, defaultEmail = '' }: { initialError?: boolean; defaultEmail?: string }) {
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [failed, setFailed] = React.useState(initialError);
  const [signedIn, setSignedIn] = React.useState<null | 'password' | 'biometrics'>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { email: emailError(email), password: password ? undefined : 'Enter your password.' };
    setErrors(next);
    setFailed(false);
    if (next.email || next.password) return;
    if (email.trim().toLowerCase() === demoMobileLogin.email && password === demoMobileLogin.password) setSignedIn('password');
    else setFailed(true);
  };

  return (
    <PhoneScreen header={<MobileHeader type="brand" />} className="flex flex-col gap-6 px-4 py-6">
      <AuthHeading title="Sign in" description="Welcome back. Sign in to continue to Acme." />
      {signedIn ? (
        <Alert variant="success" title="You are signed in" description={signedIn === 'biometrics' ? 'Face ID recognised you. Taking you to your dashboard…' : 'Taking you to your dashboard…'} />
      ) : (
        <>
          <form noValidate onSubmit={submit} className="flex flex-col gap-4" aria-label="Sign in with email">
            {failed ? <Alert variant="destructive" title="Email or password is incorrect" description="After 5 failed attempts we pause sign-in for 15 minutes." /> : null}
            <Field label="Email" error={errors.email} required>
              <Input type="email" autoComplete="username" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} className="h-11" />
            </Field>
            <PasswordField value={password} onChange={setPassword} error={errors.password} />
            <a href="#forgot-password" className="inline-flex min-h-11 items-center self-start text-sm leading-5 font-medium text-brand underline-offset-4 hover:underline">Forgot password?</a>
            <Button type="submit" size="touch" className="w-full">Sign in</Button>
          </form>
          <Button type="button" variant="outline" size="touch" className="w-full" leadingIcon={<UserCheck />} onClick={() => setSignedIn('biometrics')}>Sign in with Face ID</Button>
          <OrDivider />
          <ProviderButtons size="touch" />
        </>
      )}
      <p className="m-0 text-sm leading-5 text-muted-foreground">
        New to Acme? <a href="#register" className="inline-flex min-h-6 font-medium text-brand underline-offset-4 hover:underline">Create an account</a>
      </p>
    </PhoneScreen>
  );
}
