// EGG UI Radio. Figma: Radio (Selection controls page), built here as a dependency of Option Card.
// shadcn RadioGroup on the radix-ui primitive. RadioGroupItem is the 16 px control; with `label`
// (and `description`) it renders the Figma Radio row. Arrow keys move between options, Space picks.
// Not built here: the error state. Disabled fades the control and the label; the description keeps
// its muted color (a faded description fails the 4.5:1 contrast).
import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid gap-3', className)} {...props} />;
}

export interface RadioGroupItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  /** Figma Show label + Label: clickable text to the right of the control. Without it pass `aria-label`. */
  label?: React.ReactNode;
  /** Figma Show description: one sentence under the label, linked with aria-describedby. */
  description?: React.ReactNode;
  wrapperClassName?: string;
}

function RadioGroupItem({ className, wrapperClassName, label, description, id: idProp, disabled, 'aria-describedby': describedByProp, ...props }: RadioGroupItemProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const descId = `${id}-description`;
  const control = (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      id={id}
      disabled={disabled}
      aria-describedby={[describedByProp, description ? descId : null].filter(Boolean).join(' ') || undefined}
      className={cn(
        'peer relative aspect-square size-4 shrink-0 rounded-full border border-input bg-background text-primary shadow-xs outline-none transition-[box-shadow,border-color] duration-[var(--duration-fast)]',
        'focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        'data-[state=checked]:border-primary disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="absolute inset-0 flex items-center justify-center">
        <span className="size-2 rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
  if (!label && !description) return control;
  return (
    <div data-slot="radio" className={cn('flex flex-col', wrapperClassName)}>
      <div className="flex items-center gap-2">
        {control}
        {label ? <label htmlFor={id} className={cn('text-sm font-medium text-foreground', disabled && 'opacity-50')}>{label}</label> : null}
      </div>
      {description ? <p id={descId} className="pl-6 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export { RadioGroup, RadioGroupItem };
