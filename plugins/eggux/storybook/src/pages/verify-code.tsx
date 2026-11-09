import * as React from 'react';
import { ArrowLeft, ShieldCheck } from '@/components/icons';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputOTP } from '@/components/ui/input-otp';
import { AuthCardPage, AuthHeading } from './site-parts';

/** The code that works in the demo. */
export const demoCode = '123456';

/** Two-factor: six digits, submits on the last one; a recovery code and "trust this device" as the alternatives. */
export function VerifyCodePage({ initialCode = '', initialError = false }: { initialCode?: string; initialError?: boolean }) {
  const [code, setCode] = React.useState(initialCode);
  const [state, setState] = React.useState<'idle' | 'wrong' | 'ok'>(initialError ? 'wrong' : 'idle');

  const complete = (value: string) => setState(value === demoCode ? 'ok' : 'wrong');

  return (
    <AuthCardPage>
      <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-5"><ShieldCheck /></span>
      <AuthHeading title="Enter your code" description="Open your authenticator app and type the 6-digit code for Acme." />
      {state === 'ok' ? (
        <Alert variant="success" title="Code accepted" description="Signing you in…" />
      ) : (
        <div className="flex flex-col gap-4">
          {state === 'wrong' ? <Alert variant="destructive" title="That code is not right" description="Check the code in your app and try again. Codes change every 30 seconds." /> : null}
          <InputOTP
            length={6}
            aria-label="6-digit code"
            autoComplete="one-time-code"
            value={code}
            invalid={state === 'wrong'}
            onValueChange={value => {
              setCode(value);
              if (state === 'wrong') setState('idle');
            }}
            onComplete={complete}
          />
          <Checkbox label="Trust this device for 30 days" />
          <Button type="button" className="w-full" disabled={code.length < 6} onClick={() => complete(code)}>Verify</Button>
        </div>
      )}
      <div className="flex flex-col gap-2 text-sm leading-5">
        <a href="#recovery" className="font-medium text-brand underline-offset-4 hover:underline">Use a recovery code instead</a>
        <a href="#login" className="inline-flex items-center gap-1.5 font-medium text-brand underline-offset-4 hover:underline [&_svg]:size-4">
          <ArrowLeft aria-hidden="true" />
          Back to sign in
        </a>
      </div>
    </AuthCardPage>
  );
}
