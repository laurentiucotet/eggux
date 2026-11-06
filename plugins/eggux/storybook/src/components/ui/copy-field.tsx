// EGG UI Copy Field. Figma: Copy Field (Input page, "Copy Field / Component", set 430:2214).
// State (default, copied), Value (default "sk_live_51H8xKd2a9f4F2a"). A read-only field (muted
// fill, border/input, pill radius, value in the code style, truncated) and an outline Button "Copy"
// 8 px after it. State=copied lasts 2 s after the click: check icon and "Copied", announced in a
// polite live region, no toast. The full value is what gets copied. When the clipboard fails the
// value is selected and the message says "Press Ctrl+C to copy".
// Secrets (`secret`): all but the last 4 characters are masked until Reveal (a pressed toggle);
// Copy still copies the full value. The input props (id, aria-describedby) go to the read-only
// input, so Field labels it ("Live secret key").
import * as React from 'react';
import { flushSync } from 'react-dom';
import { Check, Copy, Eye, EyeOff } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Input } from './input';

type CopyState = 'default' | 'copied' | 'failed';

export interface CopyFieldProps extends Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'readOnly' | 'size' | 'onCopy'> {
  /** Figma Value: the full value people copy. */
  value: string;
  /** What the value is, read after "Copy" by screen readers: "API key" -> "Copy API key". */
  valueLabel?: string;
  /** Mask all but the last 4 characters until Reveal. */
  secret?: boolean;
  /** Accessible name of the Reveal toggle. */
  revealLabel?: string;
  /** Called after the value is on the clipboard. */
  onCopy?: (value: string) => void;
  /** How long State=copied lasts, in ms. Figma: 2 s. */
  copiedDuration?: number;
  /** Class of the input (className goes to the row). */
  inputClassName?: string;
}

const messages: Record<CopyState, string> = { default: '', copied: 'Copied', failed: 'Press Ctrl+C to copy' };

export function maskSecret(value: string, visible = 4) {
  if (value.length <= visible) return value;
  return '•'.repeat(Math.min(value.length - visible, 16)) + value.slice(-visible);
}

function CopyField({
  value,
  valueLabel,
  secret = false,
  revealLabel = 'Show the full value',
  onCopy,
  copiedDuration = 2000,
  className,
  inputClassName,
  disabled,
  ref,
  ...props
}: CopyFieldProps) {
  const [state, setState] = React.useState<CopyState>('default');
  const [revealed, setRevealed] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Field passes a ref through its Slot: keep ours and forward theirs.
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const shown = secret && !revealed ? maskSecret(value) : value;

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
      onCopy?.(value);
    } catch {
      // Fallback: show the full value selected so Ctrl+C copies it.
      flushSync(() => { setRevealed(true); setState('failed'); });
      const el = inputRef.current;
      if (el) { el.focus(); el.select(); }
    }
    timer.current = window.setTimeout(() => setState('default'), copiedDuration);
  };

  return (
    <div data-slot="copy-field" data-state={state} className={cn('flex w-full min-w-0 items-center gap-2', className)}>
      <Input
        readOnly
        disabled={disabled}
        value={shown}
        spellCheck={false}
        autoComplete="off"
        data-slot="copy-field-input"
        className={cn('min-w-0 flex-1 text-ellipsis px-3 font-mono md:text-sm', inputClassName)}
        {...props}
        ref={inputRef}
      />
      {secret ? (
        <ButtonIcon
          variant="outline"
          icon={revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          label={revealLabel}
          aria-pressed={revealed}
          disabled={disabled}
          onClick={() => setRevealed(r => !r)}
        />
      ) : null}
      <Button variant="outline" disabled={disabled} onClick={copy} data-slot="copy-field-button" leadingIcon={state === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}>
        {state === 'copied' ? 'Copied' : 'Copy'}
        {valueLabel && state !== 'copied' ? <span className="sr-only"> {valueLabel}</span> : null}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">{messages[state]}</span>
    </div>
  );
}

export { CopyField };
