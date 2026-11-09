// EGG UI Input OTP and OTP Slot. Figma: Input OTP (Input OTP page, 99:55) and OTP Slot (99:27).
// Length 4, or 6 as 3 + 3 with a minus separator (32 wide). Slots are 36 squares joined into
// groups: first has the left border and radius, middle and last the top, right and bottom borders,
// last the right radius. States: empty, filled (body/large semibold), active (ring border and a
// caret), error (destructive border on every slot). Paste fills all slots; onComplete fires on the
// last digit (auto-submit or enable Verify).
// A11y: one real input for the whole code (autocomplete one-time-code, inputmode numeric) with a
// name; aria-invalid and the error message by aria-describedby; the slots are decorative.
import * as React from 'react';
import { Minus } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface InputOTPProps extends Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'maxLength' | 'size'> {
  length?: 4 | 6;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  invalid?: boolean;
}

export interface OTPSlotProps extends React.ComponentProps<'span'> {
  position?: 'first' | 'middle' | 'last';
  char?: string;
  active?: boolean;
  invalid?: boolean;
}

function OTPSlot({ position = 'middle', char, active = false, invalid = false, className, ...props }: OTPSlotProps) {
  return (
    <span
      data-slot="otp-slot"
      data-active={active || undefined}
      className={cn(
        'relative flex size-[var(--control-height)] items-center justify-center border-y border-r border-input bg-background text-lg leading-7 font-semibold text-foreground shadow-xs',
        position === 'first' && 'rounded-l-md border-l',
        position === 'last' && 'rounded-r-md',
        active && 'z-10 border-ring ring-[3px] ring-ring/50',
        invalid && 'border-destructive',
        className,
      )}
      {...props}
    >
      {char}
      {active && !char ? <span aria-hidden="true" className="h-4 w-px animate-pulse bg-foreground" /> : null}
    </span>
  );
}

function InputOTP({ length = 6, value: valueProp, defaultValue = '', onValueChange, onComplete, invalid = false, className, onFocus, onBlur, disabled, ...props }: InputOTPProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = (valueProp ?? inner).slice(0, length);
  const [focused, setFocused] = React.useState(false);
  const set = (raw: string) => {
    const next = raw.replace(/\D/g, '').slice(0, length);
    setInner(next);
    onValueChange?.(next);
    if (next.length === length) onComplete?.(next);
  };
  const groups = length === 6 ? [[0, 1, 2], [3, 4, 5]] : [[0, 1, 2, 3]];
  const activeIndex = focused ? Math.min(value.length, length - 1) : -1;
  return (
    <div data-slot="input-otp" className={cn('relative inline-flex items-center', disabled && 'opacity-50', className)}>
      <input
        data-slot="input-otp-input"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d*"
        maxLength={length}
        value={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={e => set(e.target.value)}
        onFocus={e => { setFocused(true); e.currentTarget.setSelectionRange(value.length, value.length); onFocus?.(e); }}
        onBlur={e => { setFocused(false); onBlur?.(e); }}
        className="absolute inset-0 z-20 h-full w-full cursor-text bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent"
        {...props}
      />
      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          {gi > 0 ? <span aria-hidden="true" className="flex w-8 justify-center text-muted-foreground [&_svg]:size-4"><Minus /></span> : null}
          <span aria-hidden="true" className="flex">
            {g.map((i, k) => (
              <OTPSlot key={i} position={k === 0 ? 'first' : k === g.length - 1 ? 'last' : 'middle'} char={value[i]} active={i === activeIndex} invalid={invalid} />
            ))}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export { InputOTP, OTPSlot };
