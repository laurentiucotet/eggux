// EGG UI Number Input. Figma: Number Input (Input page, "Number Input / Component", set 112:95).
// Size (default 140 × 36, sm 116 × 32) x State (default, focus, error via aria-invalid, disabled),
// Value (default 2). A small integer with − and + steppers: decrement and increment are square
// cells (36 / 32) with a 1 px border/input divider, the value centred in body/small between them,
// in the Input Group box (pill radius, focus ring around the whole field).
// Behavior (WAI-ARIA spinbutton): typing stays possible and is committed on blur or Enter (clamped,
// a non-number reverts); Arrow Up / Down step, Home / End go to min / max; the buttons are not in
// the Tab order (the arrows do the same) and keep focus where it was; long press repeats the step.
// At min or max the matching button is disabled: the icon turns foreground/muted and clicks are
// blocked. The props are the input's, so Field can pass id, aria-describedby and aria-invalid.
import * as React from 'react';
import { Minus, Plus } from '@/components/icons';
import { cn } from '@/lib/utils';
import { inputGroupFrame } from './input-group';

export type NumberInputSize = 'default' | 'sm';

export interface NumberInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type' | 'min' | 'max' | 'step'> {
  /** Figma Value (controlled). */
  value?: number;
  /** Figma Value (uncontrolled). Default 0, or min when it is higher. */
  defaultValue?: number;
  /** Called with the new value after a step or a committed edit. */
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Figma Size: default 36 (forms), sm 32 (cart lines, dense rows). */
  size?: NumberInputSize;
  /** Accessible name of the − button: say what it changes ("Decrease seats"). */
  decrementLabel?: string;
  /** Accessible name of the + button ("Increase seats"). */
  incrementLabel?: string;
  /** Class of the input (className goes to the box). */
  inputClassName?: string;
}

const REPEAT_DELAY = 400;
const REPEAT_EVERY = 80;

function NumberInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  size = 'default',
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  className,
  inputClassName,
  disabled,
  readOnly,
  onKeyDown,
  onBlur,
  ...props
}: NumberInputProps) {
  const clamp = React.useCallback(
    (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)),
    [min, max],
  );
  const [inner, setInner] = React.useState(() => clamp(defaultValue ?? Math.max(0, min ?? 0)));
  const value = valueProp ?? inner;
  const [draft, setDraft] = React.useState<string | null>(null);
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const commit = React.useCallback(
    (n: number) => {
      const prev = valueRef.current;
      const next = clamp(n);
      if (valueProp === undefined) setInner(next);
      valueRef.current = next;
      if (next !== prev) onValueChange?.(next);
    },
    [clamp, valueProp, onValueChange],
  );
  const stepBy = React.useCallback((dir: 1 | -1) => commit(valueRef.current + dir * step), [commit, step]);

  // Long press: after REPEAT_DELAY the step repeats every REPEAT_EVERY ms until release.
  const timer = React.useRef<number | undefined>(undefined);
  const repeated = React.useRef(false);
  const stop = () => { window.clearTimeout(timer.current); window.clearInterval(timer.current); timer.current = undefined; };
  React.useEffect(() => stop, []);
  const startRepeat = (dir: 1 | -1) => {
    stop();
    repeated.current = false;
    timer.current = window.setTimeout(() => {
      timer.current = window.setInterval(() => { repeated.current = true; stepBy(dir); }, REPEAT_EVERY);
    }, REPEAT_DELAY);
  };

  const atMin = min !== undefined && value <= min;
  const atMax = max !== undefined && value >= max;
  const locked = disabled || readOnly;

  const commitDraft = () => {
    if (draft === null) return;
    const n = Number.parseInt(draft, 10);
    setDraft(null);
    if (!Number.isNaN(n)) commit(n);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || locked) return;
    const actions: Record<string, () => void> = {
      ArrowUp: () => { commitDraft(); stepBy(1); },
      ArrowDown: () => { commitDraft(); stepBy(-1); },
      Home: () => { if (min !== undefined) { setDraft(null); commit(min); } },
      End: () => { if (max !== undefined) { setDraft(null); commit(max); } },
      Enter: commitDraft,
    };
    const action = actions[e.key];
    if (!action) return;
    if ((e.key === 'Home' && min === undefined) || (e.key === 'End' && max === undefined)) return;
    e.preventDefault();
    action();
  };

  const button = (dir: 1 | -1) => {
    const blocked = dir === 1 ? atMax : atMin;
    return (
      <button
        type="button"
        data-slot={dir === 1 ? 'number-input-increment' : 'number-input-decrement'}
        tabIndex={-1}
        aria-label={dir === 1 ? incrementLabel : decrementLabel}
        disabled={disabled || readOnly || blocked}
        // Keep focus where it is (the input, or nowhere) and start the long-press repeat.
        onMouseDown={e => e.preventDefault()}
        onPointerDown={e => { if (e.button === 0) startRepeat(dir); }}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onClick={() => {
          stop();
          if (repeated.current) { repeated.current = false; return; }
          commitDraft();
          stepBy(dir);
        }}
        className={cn(
          'flex h-full shrink-0 items-center justify-center border-input text-foreground outline-none transition-colors duration-[var(--duration-fast)]',
          'hover:bg-muted disabled:pointer-events-none disabled:text-muted-foreground',
          size === 'sm' ? 'w-8' : 'w-[var(--control-height)]',
          dir === 1 ? 'border-l' : 'border-r',
        )}
      >
        {dir === 1 ? <Plus className="size-4" aria-hidden="true" /> : <Minus className="size-4" aria-hidden="true" />}
      </button>
    );
  };

  return (
    <div
      data-slot="number-input"
      data-size={size}
      className={cn(inputGroupFrame, size === 'sm' ? 'h-8 w-29' : 'w-35', className)}
    >
      {button(-1)}
      <input
        data-slot="number-input-input"
        type="text"
        inputMode="numeric"
        role="spinbutton"
        autoComplete="off"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        disabled={disabled}
        readOnly={readOnly}
        value={draft ?? String(value)}
        onChange={e => setDraft(e.target.value.replace(/[^\d-]/g, ''))}
        onKeyDown={handleKeyDown}
        onBlur={e => { commitDraft(); onBlur?.(e); }}
        className={cn(
          'h-full w-full min-w-0 flex-1 border-0 bg-transparent px-1 text-center text-sm tabular-nums text-foreground outline-none disabled:cursor-not-allowed',
          inputClassName,
        )}
        {...props}
      />
      {button(1)}
    </div>
  );
}

export { NumberInput };
