// EGG UI Pin Pad. Code only (no Figma component yet). The numeric keypad for a PIN or passcode on
// mobile: dots that fill as digits go in, a 3 x 4 keypad (1 to 9, a free slot for biometrics, 0,
// delete) and a message. 64 px round keys, so a thumb never misses. Digits also come from a hardware
// keyboard (0 to 9, Backspace). The dots are one status ("2 of 4 digits entered"); the digits are
// never read out or shown. When the last digit goes in `onComplete` runs; a wrong code is shown with
// `error` (the dots clear in the parent). For longer or alphanumeric codes use an Input OTP or a
// Password field.
import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface PinPadProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Digits in the code, 4 or 6. Default 4. */
  length?: 4 | 6;
  /** Controlled value (digits only). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Runs when the last digit is entered. */
  onComplete?: (value: string) => void;
  /** What the code is for ("Enter your PIN"). */
  title?: string;
  /** Wrong code message; announced as an alert. */
  error?: string;
  /** The free slot left of 0: a biometrics or "Forgot" button. */
  extraKey?: React.ReactNode;
}

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const key =
  'flex size-16 items-center justify-center rounded-full bg-muted text-2xl leading-8 font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 active:bg-accent [&_svg]:size-6';

function PinPad({ length = 4, value: valueProp, defaultValue = '', onValueChange, onComplete, title = 'Enter your PIN', error, extraKey, className, ...props }: PinPadProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;

  const set = (next: string) => {
    const clean = next.replace(/\D/g, '').slice(0, length);
    if (valueProp === undefined) setInner(clean);
    onValueChange?.(clean);
    if (clean.length === length && clean !== value) onComplete?.(clean);
  };
  const add = (d: string) => set(value + d);
  const remove = () => set(value.slice(0, -1));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      add(e.key);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      remove();
    }
  };

  return (
    <div data-slot="pin-pad" role="group" aria-label={title} tabIndex={-1} onKeyDown={onKeyDown} className={cn('flex w-full max-w-xs flex-col items-center gap-6', className)} {...props}>
      <h2 className="m-0 text-lg leading-7 font-semibold">{title}</h2>
      <div role="status" aria-label={`${value.length} of ${length} digits entered`} className="flex gap-4">
        {Array.from({ length }, (_, i) => (
          <span key={i} aria-hidden="true" className={cn('size-3.5 rounded-full border-2', i < value.length ? (error ? 'border-destructive bg-destructive' : 'border-primary bg-primary') : 'border-muted-foreground/60')} />
        ))}
      </div>
      <p role="alert" className="m-0 min-h-5 text-center text-sm leading-5 text-destructive">
        {error}
      </p>
      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        {digits.map(d => (
          <button key={d} type="button" className={key} onClick={() => add(d)}>
            {d}
          </button>
        ))}
        <span className="flex size-16 items-center justify-center">{extraKey}</span>
        <button type="button" className={key} onClick={() => add('0')}>
          0
        </button>
        <button type="button" className={cn(key, 'bg-transparent')} aria-label="Delete last digit" disabled={value.length === 0} onClick={remove}>
          <X aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export { PinPad };
