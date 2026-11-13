// EGG UI Stepper Slider. Code only (no Figma component yet). One number chosen two ways: a Slider for
// "about this much" and a number Input beside it for "exactly this", kept in sync. Dragging or arrow
// keys on the slider update the input; typing in the input moves the slider as soon as the number is
// inside min and max, and when the field is left (or Enter is pressed) the number is rounded to the
// step and clamped, so the two never disagree. An out of range number while typing marks the input
// invalid. The unit ("EUR", "%", "days") sits inside the input at the end and is read as its
// description; the slider reads "250 EUR" as its value text. Pass `label` (the slider's name, the same
// as the Field label). Works in a Field: id goes to the number input, aria-describedby, aria-invalid,
// required and disabled are applied. For a range with two thumbs use Range Input; for a value with
// no slider use Number Input.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Slider } from './slider';

export interface StepperSliderProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'id'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Unit shown in the input and in the slider's value text: "EUR", "%". */
  unit?: string;
  /** Name of the control: the slider reads "<label> slider", the input "<label>". */
  label?: string;
  /** Show min, middle and max under the slider. */
  showMarks?: boolean;
  /** Input size, from Input. */
  size?: 'sm' | 'default' | 'lg';
  name?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Id of the number input (a Field's label points at it). */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}

const decimals = (n: number) => (String(n).split('.')[1] ?? '').length;

function StepperSlider({
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  unit,
  label = 'Value',
  showMarks = false,
  size = 'default',
  name,
  disabled,
  required,
  invalid,
  id,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  className,
  ...props
}: StepperSliderProps) {
  const [inner, setInner] = React.useState(defaultValue ?? min);
  const value = valueProp ?? inner;
  const unitId = `${React.useId()}-unit`;
  const places = Math.max(decimals(step), decimals(min));

  // Round to the step from min, clamp, and drop float noise (0.1 + 0.2).
  const snap = React.useCallback(
    (n: number) => {
      const stepped = min + Math.round((n - min) / step) * step;
      return Number(Math.min(max, Math.max(min, stepped)).toFixed(places));
    },
    [min, max, step, places],
  );
  const set = (n: number) => {
    if (valueProp === undefined) setInner(n);
    onValueChange?.(n);
  };

  // The text in the input while it is being typed; null = show the value.
  const [draft, setDraft] = React.useState<string | null>(null);
  const draftNumber = draft === null || draft.trim() === '' ? NaN : Number(draft);
  const outOfRange = draft !== null && (Number.isNaN(draftNumber) || draftNumber < min || draftNumber > max);

  const commitDraft = () => {
    if (draft !== null && !Number.isNaN(draftNumber)) set(snap(draftNumber));
    setDraft(null);
  };

  const describedBy = [describedByProp, unit ? unitId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div data-slot="stepper-slider" className={cn('flex w-full min-w-0 items-center gap-4', className)} {...props}>
      <div className={cn('min-w-0 flex-1', showMarks && 'pb-6')}>
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([v]) => {
            setDraft(null);
            set(v!);
          }}
          disabled={disabled}
          thumbLabels={[`${label} slider`]}
          formatValue={v => (unit ? `${v} ${unit}` : String(v))}
          marks={showMarks ? [min, snap((min + max) / 2), max] : undefined}
        />
      </div>
      <div className="relative w-28 shrink-0">
        <Input
          id={id}
          type="number"
          inputMode={places > 0 ? 'decimal' : 'numeric'}
          name={name}
          size={size}
          min={min}
          max={max}
          step={step}
          value={draft ?? String(value)}
          disabled={disabled}
          required={required}
          aria-label={id ? undefined : label}
          aria-describedby={describedBy}
          aria-invalid={invalid || ariaInvalid || outOfRange || undefined}
          className={cn('tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none', unit && 'pr-12')}
          onChange={e => {
            const text = e.target.value;
            setDraft(text);
            const n = text.trim() === '' ? NaN : Number(text);
            if (!Number.isNaN(n) && n >= min && n <= max) set(snap(n));
          }}
          onBlur={commitDraft}
          onKeyDown={e => {
            if (e.key === 'Enter') commitDraft();
          }}
        />
        {unit ? (
          <span id={unitId} className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export { StepperSlider };
