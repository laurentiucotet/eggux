import * as React from 'react';
import { ArrowLeft, Mail } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AuthCardPage, AuthHeading, emailError } from './site-parts';

/**
 * Reset by email, two steps in the same card so the page does not jump. The second step says the
 * same thing for any address: it never tells whether an account exists.
 */
export function ForgotPasswordPage({ initialStep = 'request', defaultEmail = '', resendAfter = 30 }: { initialStep?: 'request' | 'sent'; defaultEmail?: string; resendAfter?: number }) {
  const [step, setStep] = React.useState(initialStep);
  const [email, setEmail] = React.useState(defaultEmail);
  const [error, setError] = React.useState<string>();
  // Seconds until the link can be sent again; counts down while the second step shows.
  const [wait, setWait] = React.useState(resendAfter);
  React.useEffect(() => {
    if (step !== 'sent' || wait <= 0) return;
    const t = window.setTimeout(() => setWait(w => w - 1), 1000);
    return () => window.clearTimeout(t);
  }, [step, wait]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const problem = emailError(email);
    setError(problem);
    if (!problem) {
      setWait(resendAfter);
      setStep('sent');
    }
  };

  return (
    <AuthCardPage>
      {step === 'request' ? (
        <>
          <AuthHeading title="Forgot your password?" description="Enter the email you use for Acme and we will send you a link to choose a new one." />
          <form noValidate onSubmit={submit} className="flex flex-col gap-4" aria-label="Reset password">
            <Field label="Email" error={error} required>
              <Input type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            </Field>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        </>
      ) : (
        <>
          <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-5"><Mail /></span>
          <AuthHeading
            title="Check your email"
            description={
              <>
                If there is an account for <strong className="font-medium text-foreground">{email || 'that address'}</strong>, we sent a link to reset the password. It expires in 30 minutes.
              </>
            }
          />
          <div className="flex flex-col gap-2">
            <Button type="button" className="w-full" onClick={() => setStep('request')}>Use a different email</Button>
            <Button type="button" variant="ghost" className="w-full" disabled={wait > 0} onClick={() => setWait(resendAfter)}>
              {wait > 0 ? `Resend link in 0:${String(wait).padStart(2, '0')}` : 'Resend link'}
            </Button>
          </div>
        </>
      )}
      <a href="#login" className="inline-flex items-center gap-1.5 self-start text-sm leading-5 font-medium text-brand underline-offset-4 hover:underline [&_svg]:size-4">
        <ArrowLeft aria-hidden="true" />
        Back to sign in
      </a>
    </AuthCardPage>
  );
}
