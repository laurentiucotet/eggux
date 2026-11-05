// EGG UI Checkbox. Figma: Checkbox (Selection controls page, "Checkbox / Component").
// Checked (false, true, indeterminate) x State (default, focus, error, disabled), Label (Show label),
// Description (Show description). shadcn Checkbox on the radix-ui primitive. With no `label` it renders
// only the 16 px box (use it in tables and give it an aria-label). Focus is the real focus-visible ring.
import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { Check, Minus } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, 'children'> {
  /** Figma Label (Show label): clickable text to the right of the box. Without it, pass `aria-label`. */
  label?: React.ReactNode;
  /** Figma Description (Show description): one sentence under the label, linked with aria-describedby. */
  description?: React.ReactNode;
  /** Figma State=error: marks the box (aria-invalid). The message comes from Field or the group. */
  invalid?: boolean;
  /** Class of the outer wrapper when a label or description is shown. */
  wrapperClassName?: string;
}

function Checkbox({
  className,
  wrapperClassName,
  label,
  description,
  invalid,
  disabled,
  id: idProp,
  'aria-describedby': describedByProp,
  ...props
}: CheckboxProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const descId = `${id}-description`;
  const describedBy = [describedByProp, description ? descId : null].filter(Boolean).join(' ') || undefined;

  const wrapped = Boolean(label || description);
  const box = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      id={id}
      disabled={disabled}
      aria-invalid={invalid || props['aria-invalid'] ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        'peer inline-flex size-4 shrink-0 items-center justify-center overflow-clip rounded-sm border border-input bg-background text-primary-foreground shadow-xs outline-none',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
        'focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        'aria-invalid:border-destructive data-[state=checked]:aria-invalid:border-destructive data-[state=indeterminate]:aria-invalid:border-destructive',
        'disabled:cursor-not-allowed',
        !wrapped && 'disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex size-3.5 items-center justify-center text-current">
        {props.checked === 'indeterminate' ? <Minus className="size-3.5" aria-hidden="true" /> : <Check className="size-3.5" aria-hidden="true" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!wrapped) return box;

  return (
    <div
      data-slot="checkbox-field"
      data-disabled={disabled ? '' : undefined}
      className={cn('flex min-w-0 flex-col', disabled && 'opacity-50', wrapperClassName)}
    >
      <div className="flex min-w-0 items-start gap-2">
        <span className="mt-0.5 flex shrink-0">{box}</span>
        {label ? (
          <label htmlFor={id} data-slot="checkbox-label" className={cn('min-w-0 flex-1 break-words text-sm font-medium leading-5 text-foreground', !disabled && 'cursor-pointer', disabled && 'cursor-not-allowed')}>
            {label}
          </label>
        ) : null}
      </div>
      {description ? (
        <p id={descId} data-slot="checkbox-description" className="line-clamp-3 min-w-[200px] pl-6 text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { Checkbox };
