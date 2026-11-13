import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Input } from '@/components/ui/input';
import { MobileHeader } from '@/components/ui/mobile-header';
import { ScanFrame, type ScanState } from '@/components/ui/scan-frame';
import { PhoneScreen } from './mobile-parts';

/** The pairing code that works in the demo. */
export const demoPairCode = 'AB12CD';

const hints: Record<ScanState, string> = {
  scanning: 'Point the camera at the QR code on your screen',
  success: 'Paired with Acme Desktop',
  error: 'That code is not valid. Check it and try again.',
};

/** Pair a device by scanning a QR code; "Enter the code instead" reveals a 6 character field for people who cannot scan. */
export function ScanToPairPage({ initialState = 'scanning', initialManual = false, initialCode = '' }: { initialState?: ScanState; initialManual?: boolean; initialCode?: string }) {
  const [state, setState] = React.useState<ScanState>(initialState);
  const [manual, setManual] = React.useState(initialManual);
  const [code, setCode] = React.useState(initialCode);
  const [fieldError, setFieldError] = React.useState<string | undefined>();
  const [cancelled, setCancelled] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = code.trim().toUpperCase();
    if (value.length !== 6) {
      setFieldError('The code has 6 characters.');
      return;
    }
    setFieldError(undefined);
    setState(value === demoPairCode ? 'success' : 'error');
  };

  return (
    <PhoneScreen
      header={<MobileHeader type="detail" title="Scan to pair" leading={<Button type="button" variant="ghost" className="min-h-11" onClick={() => setCancelled(true)}>Cancel</Button>} />}
      className="flex flex-col items-center gap-6 px-4 py-6"
    >
      {cancelled ? (
        <Alert title="Pairing cancelled" description="Nothing was connected. You can pair again from Settings." className="w-full" />
      ) : (
        <>
          <ScanFrame state={state} hint={hints[state]} size={256}>
            <ImagePlaceholder ratio="1:1" showCaption={false} aria-hidden="true" className="h-full rounded-none bg-foreground/90 text-background" />
          </ScanFrame>
          {state === 'success' ? <Alert variant="success" title="Device paired" description="Acme Desktop can now sync with this phone." className="w-full" /> : null}
          {state === 'error' ? (
            <Alert variant="destructive" title="Pairing failed" description="The code did not match. Make sure the QR code on your screen is up to date." className="w-full" />
          ) : null}
          {state === 'error' ? <Button type="button" variant="outline" className="h-11 w-full" onClick={() => { setState('scanning'); setCode(''); }}>Try again</Button> : null}
          {state !== 'success' ? (
            <div className="flex w-full flex-col gap-4">
              {!manual ? (
                <Button type="button" variant="outline" className="h-11 w-full" aria-expanded={false} aria-controls="pair-code-form" onClick={() => setManual(true)}>Enter the code instead</Button>
              ) : (
                <form id="pair-code-form" noValidate onSubmit={submit} className="flex flex-col gap-4" aria-label="Enter the pairing code">
                  <Field label="6 character code" hint="Shown under the QR code on your screen." error={fieldError} required>
                    <Input
                      autoFocus
                      autoComplete="one-time-code"
                      autoCapitalize="characters"
                      spellCheck={false}
                      maxLength={6}
                      placeholder="AB12CD"
                      value={code}
                      onChange={e => {
                        setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                        setFieldError(undefined);
                      }}
                      className="h-11 font-mono tracking-widest uppercase"
                    />
                  </Field>
                  <Button type="submit" className="h-11 w-full">Pair device</Button>
                </form>
              )}
            </div>
          ) : null}
        </>
      )}
    </PhoneScreen>
  );
}
