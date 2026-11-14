import * as React from 'react';
import { Lock, UserCheck } from '@/components/icons';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ButtonIcon } from '@/components/ui/button-icon';
import { Logo } from '@/components/ui/logo';
import { PinPad } from '@/components/ui/pin-pad';
import { PhoneScreen } from './mobile-parts';

/** The PIN that works in the demo. */
export const demoPin = '1234';
export const maxPinTries = 3;

type Stage = 'locked' | 'unlocked' | 'password';

/** App lock: a 4-digit PIN on the Pin Pad. A wrong code clears the dots; the third wrong code locks the pad and offers the password. */
export function PinLockPage({ initialTries = 0, initialError = false }: { initialTries?: number; initialError?: boolean }) {
  const [value, setValue] = React.useState('');
  const [tries, setTries] = React.useState(initialTries);
  const [error, setError] = React.useState<string | undefined>(initialError ? `Wrong PIN. ${maxPinTries - Math.max(initialTries, 1)} tries left.` : undefined);
  const [stage, setStage] = React.useState<Stage>('locked');
  const blocked = tries >= maxPinTries;

  const complete = (code: string) => {
    if (code === demoPin) {
      setStage('unlocked');
      return;
    }
    const used = tries + 1;
    setTries(used);
    setValue('');
    setError(used >= maxPinTries ? undefined : `Wrong PIN. ${maxPinTries - used} ${maxPinTries - used === 1 ? 'try' : 'tries'} left.`);
  };

  return (
    <PhoneScreen className="flex flex-col items-center gap-8 px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo type="full" name="Acme" />
        <h1 className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">{stage === 'unlocked' ? 'Unlocked' : 'Acme is locked'}</h1>
        {stage === 'locked' ? <p className="m-0 text-sm leading-5 text-muted-foreground">Enter your PIN to continue.</p> : null}
      </div>
      {stage === 'unlocked' ? (
        <Alert variant="success" title="Welcome back, Ana" description="Opening your dashboard…" className="w-full" />
      ) : stage === 'password' ? (
        <Alert title="Sign in with your password" description="Taking you to the sign-in screen…" className="w-full" />
      ) : blocked ? (
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-muted [&_svg]:size-6"><Lock /></span>
          <Alert variant="destructive" title="Too many wrong codes" description="The PIN is locked on this device. Use your password to get back in." className="w-full text-left" />
          <Button type="button" size="touch" className="w-full" onClick={() => setStage('password')}>Use password instead</Button>
        </div>
      ) : (
        <>
          <PinPad
            length={4}
            title="Enter your PIN"
            value={value}
            error={error}
            onValueChange={next => {
              setValue(next);
              if (next) setError(undefined);
            }}
            onComplete={complete}
            extraKey={<ButtonIcon variant="ghost" icon={<UserCheck />} label="Use Face ID" showTooltip={false} className="size-16 rounded-full [&_svg]:size-6" onClick={() => setStage('unlocked')} />}
          />
          <Button type="button" variant="ghost" size="touch" onClick={() => setStage('password')}>Forgot PIN? Use password instead</Button>
        </>
      )}
    </PhoneScreen>
  );
}
