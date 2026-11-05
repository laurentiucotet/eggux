// EGG UI Field. Figma: Field (Input page). State (default, error, disabled), Layout (vertical,
// horizontal). Label + Control slot + hint or error, with Show required / optional / info /
// counter. The control (an Input by default) receives id, aria-describedby, aria-invalid,
// required and disabled through a Slot, so any single control element works. Built from
// Field Counter, Info Tip Trigger and Input.
import * as React from 'react';
import { Slot } from 'radix-ui';
import { CircleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { FieldCounter } from './field-counter';
import { InfoTip, type InfoTipProps } from './info-tip';

export interface FieldProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Label: always visible (see showLabel). */
  label: string;
  /** Figma Hint (Show hint): format help shown before typing. */
  hint?: React.ReactNode;
  /** Figma Error (State=error): replaces the hint, says what is wrong and how to fix it. */
  error?: React.ReactNode;
  /** Figma State=disabled. */
  disabled?: boolean;
  /** Figma Show required: red asterisk; the control gets required. */
  required?: boolean;
  /** Figma Show optional: "Optional" after the label. Mark the minority, never both. */
  optional?: boolean;
  /** Figma Show info: Info Tip after the label. */
  info?: Omit<InfoTipProps, 'label' | 'disabled'>;
  /** Figma Show counter: characters used and the limit. */
  counter?: { value: number; limit: number };
  /** Figma Show label: off only when the control has its own visible label (floating Input). */
  showLabel?: boolean;
  /** Figma Layout: horizontal = 160 px label column, min width 400. */
  layout?: 'vertical' | 'horizontal';
  /** Optional text, translated by the app. */
  optionalText?: string;
  /** Id of the control; generated when not given. */
  id?: string;
  /** Figma Control slot: one control element (Input, Textarea, Select trigger...). */
  children: React.ReactElement;
}

function Field({
  label,
  hint,
  error,
  disabled = false,
  required = false,
  optional = false,
  info,
  counter,
  showLabel = true,
  layout = 'vertical',
  optionalText = 'Optional',
  id: idProp,
  className,
  children,
  ...props
}: FieldProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const hintId = `${id}-hint`;
  const counterId = `${id}-counter`;
  const invalid = Boolean(error);
  const horizontal = layout === 'horizontal';
  const describedBy = [error || hint ? hintId : null, counter ? counterId : null].filter(Boolean).join(' ') || undefined;

  const labelRow = showLabel ? (
    <div
      data-slot="field-label-row"
      className={cn('flex flex-wrap items-center justify-between gap-x-2 gap-y-1', horizontal && 'w-40 shrink-0 pt-2')}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-1">
        <label
          htmlFor={id}
          className={cn(
            'text-sm font-medium',
            horizontal ? 'max-w-36' : 'max-w-64',
            disabled ? 'text-muted-foreground' : invalid ? 'text-destructive' : 'text-foreground',
          )}
        >
          {label}
          {required ? <span aria-hidden="true" className="text-destructive"> *</span> : null}
          {/* The space is a text node outside the span, so the accessible name reads "VAT number Optional". */}
          {optional ? <>{' '}<span className="font-normal text-muted-foreground">{optionalText}</span></> : null}
        </label>
        {info ? <InfoTip label={label} disabled={disabled} {...info} /> : null}
      </div>
      {counter ? <FieldCounter id={counterId} value={counter.value} limit={counter.limit} /> : null}
    </div>
  ) : null;

  // Props merged into the control element (Input, Textarea...), which accepts them natively.
  const controlProps = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    'aria-required': required || undefined,
    required: required || undefined,
    disabled: disabled || undefined,
  } as React.HTMLAttributes<HTMLElement>;
  const control = <Slot.Root {...controlProps}>{children}</Slot.Root>;

  const message = error ? (
    <p id={hintId} data-slot="field-error" className="flex items-start gap-1.5 text-xs text-destructive">
      <span className="flex h-4 shrink-0 items-center"><CircleAlert className="size-3.5" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1">{error}</span>
    </p>
  ) : hint ? (
    <p id={hintId} data-slot="field-hint" className="text-xs text-muted-foreground">{hint}</p>
  ) : null;

  return (
    <div
      data-slot="field"
      data-state={disabled ? 'disabled' : invalid ? 'error' : 'default'}
      data-layout={layout}
      className={cn(
        'flex w-full',
        horizontal ? 'min-w-[400px] items-start gap-4' : 'flex-col gap-2',
        className,
      )}
      {...props}
    >
      {labelRow}
      {horizontal ? (
        <div className="flex min-w-0 flex-1 flex-col gap-2">{control}{message}</div>
      ) : (
        <>{control}{message}</>
      )}
    </div>
  );
}

export { Field };
