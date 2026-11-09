// EGG UI Range Input. Figma: Range Input (Input page, "Range Input / Component"). State (default,
// error), Min ("100"), Max ("2,500"), Unit ("€"). Two fields for a minimum and a maximum that share
// the width (each min-w-0 flex-1), 8 px apart with a muted dash between them. Each field: unit
// (muted, hugs up to 32 and truncates) and the value (one line with an ellipsis). Either side may
// stay empty ("from 100"). Values are formatted on blur in the locale ("2,500"); when the minimum
// is above the maximum both fields turn to State=error and the rule is said once under the pair,
// linked to both inputs. onCommit fires on blur or Enter, the moment filters apply.
// The unit is rendered inside each field here; switch it to Input Addon once that exists.
// Inside a Field: the Field id goes on the minimum input (the label focuses it), the Field label
// names the group, and the hint, error and disabled state reach both inputs.
import * as React from 'react';
import { CircleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { DEFAULT_LOCALE } from './calendar-date';

export interface RangeValue {
  min?: number;
  max?: number;
}

export interface RangeInputProps
  extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Figma Min and Max. Controlled when given; either side may be undefined. */
  value?: RangeValue;
  defaultValue?: RangeValue;
  /** Every change of a parsed value (while typing). */
  onValueChange?: (value: RangeValue) => void;
  /** Blur or Enter: the moment a filter applies. */
  onCommit?: (value: RangeValue) => void;
  /** Figma Unit: same unit on both sides ("€", "kg"). Empty string hides it. */
  unit?: string;
  /** Name of the pair ("Price") when no Field label names it. */
  label?: string;
  /** Names of each input: "Minimum price", "Maximum price". Default: "Minimum"/"Maximum" + label. */
  minLabel?: string;
  maxLabel?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  /** Figma State=error, set by the app (for example a Field error). Min above max sets it too. */
  invalid?: boolean;
  disabled?: boolean;
  /** Set by a Field with Show required: the minimum input gets aria-required. */
  required?: boolean;
  /** Text said once under the pair when min is above max. */
  orderErrorText?: string;
  locale?: string;
}

/** The Field label (label[for=id]) names the group: a label cannot name a div by itself. */
function useFieldLabelId(id: string | undefined) {
  const [labelId, setLabelId] = React.useState<string>();
  React.useLayoutEffect(() => {
    if (!id) return;
    const label = document.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(id)}"]`);
    if (!label) return;
    if (!label.id) label.id = `${id}-label`;
    setLabelId(label.id);
  }, [id]);
  return labelId;
}

function separators(locale: string) {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  return {
    group: parts.find(p => p.type === 'group')?.value ?? ',',
    decimal: parts.find(p => p.type === 'decimal')?.value ?? '.',
  };
}

/** "2,500" -> 2500, "1.234,5" (ro-RO) -> 1234.5, "" -> undefined. */
export function parseNumber(text: string, locale = DEFAULT_LOCALE): number | undefined {
  const { group, decimal } = separators(locale);
  const cleaned = text.split(group).join('').replace(/\s/g, '').split(decimal).join('.').replace(/[^0-9.-]/g, '');
  if (!cleaned || cleaned === '-' || cleaned === '.') return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

export function formatNumber(n: number | undefined, locale = DEFAULT_LOCALE) {
  return n === undefined ? '' : new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n);
}

const fieldClass =
  'flex h-[var(--control-height)] min-w-0 flex-1 cursor-text items-center gap-2 rounded-input border border-input bg-background px-3 shadow-xs transition-[color,box-shadow,border-color] duration-[var(--duration-fast)] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50';
const inputClass =
  'w-full min-w-0 flex-1 truncate bg-transparent text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed';

function RangeInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  onCommit,
  unit = '€',
  label,
  minLabel,
  maxLabel,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
  invalid: invalidProp,
  disabled,
  orderErrorText = 'Minimum must be lower than the maximum',
  locale = DEFAULT_LOCALE,
  id,
  className,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  required,
  ...rest
}: RangeInputProps) {
  const autoId = React.useId();
  const baseId = id ?? autoId;
  const errorId = `${baseId}-order-error`;
  const fieldLabelId = useFieldLabelId(id);
  const minRef = React.useRef<HTMLInputElement>(null);
  const maxRef = React.useRef<HTMLInputElement>(null);

  const [inner, setInner] = React.useState<RangeValue>(defaultValue ?? {});
  const value = valueProp ?? inner;
  const [text, setText] = React.useState({ min: formatNumber(value.min, locale), max: formatNumber(value.max, locale) });
  const [focused, setFocused] = React.useState<'min' | 'max' | null>(null);

  // A controlled value changed from outside: show it, unless that side is being typed in.
  React.useEffect(() => {
    if (valueProp === undefined) return;
    setText(t => ({
      min: focused === 'min' ? t.min : formatNumber(valueProp.min, locale),
      max: focused === 'max' ? t.max : formatNumber(valueProp.max, locale),
    }));
  }, [valueProp?.min, valueProp?.max, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const outOfOrder = value.min !== undefined && value.max !== undefined && value.min > value.max;
  const invalid = Boolean(invalidProp || outOfOrder || ariaInvalid === true || ariaInvalid === 'true');
  const describedBy = [describedByProp, outOfOrder ? errorId : null].filter(Boolean).join(' ') || undefined;

  const change = (side: 'min' | 'max', t: string) => {
    setText(prev => ({ ...prev, [side]: t }));
    const next = { ...value, [side]: parseNumber(t, locale) };
    setInner(next);
    onValueChange?.(next);
  };
  const commit = (side: 'min' | 'max') => {
    setText(prev => ({ ...prev, [side]: formatNumber(value[side], locale) }));
    onCommit?.(value);
  };

  const field = (side: 'min' | 'max') => {
    const ref = side === 'min' ? minRef : maxRef;
    const name = side === 'min'
      ? minLabel ?? (label ? `Minimum ${label.toLowerCase()}` : 'Minimum')
      : maxLabel ?? (label ? `Maximum ${label.toLowerCase()}` : 'Maximum');
    return (
      <div
        data-slot={`range-input-${side}`}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={fieldClass}
        onMouseDown={e => {
          // A click on the unit or the padding puts the caret in the input, like one control.
          if (e.target !== ref.current) {
            e.preventDefault();
            ref.current?.focus();
          }
        }}
      >
        {unit ? (
          <span data-slot="range-input-unit" aria-hidden="true" className="max-w-8 shrink-0 truncate text-sm leading-5 text-muted-foreground">
            {unit}
          </span>
        ) : null}
        <input
          ref={ref}
          id={side === 'min' ? id : undefined}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          aria-label={unit ? `${name} (${unit})` : name}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-required={side === 'min' && (required || ariaRequired) ? true : undefined}
          disabled={disabled}
          placeholder={side === 'min' ? minPlaceholder : maxPlaceholder}
          value={text[side]}
          onChange={e => change(side, e.target.value)}
          onFocus={() => setFocused(side)}
          onBlur={() => {
            setFocused(null);
            commit(side);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') commit(side);
          }}
          className={inputClass}
        />
      </div>
    );
  };

  return (
    <div data-slot="range-input" data-state={invalid ? 'error' : 'default'} className={cn('flex w-80 min-w-0 flex-col gap-2', className)} {...rest}>
      <div
        role="group"
        aria-label={fieldLabelId ? undefined : label}
        aria-labelledby={fieldLabelId}
        className="flex w-full min-w-0 items-center gap-2"
      >
        {field('min')}
        <span aria-hidden="true" className="shrink-0 text-sm leading-5 text-muted-foreground">–</span>
        {field('max')}
      </div>
      {outOfOrder ? (
        <p id={errorId} data-slot="range-input-error" className="flex items-start gap-1.5 text-xs text-destructive">
          <span className="flex h-4 shrink-0 items-center"><CircleAlert className="size-3.5" aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">{orderErrorText}</span>
        </p>
      ) : null}
    </div>
  );
}

export { RangeInput };
