// EGG UI Switch. Figma: Switch (Selection controls page, "Switch / Component").
// Checked (false, true) x Size (default, sm, lg) x State (default, focus, disabled), Label (Show label),
// Description (Show description). shadcn Switch on the radix-ui primitive (role="switch", Space toggles).
// Track: default 36 x 20, sm 28 x 16, lg 44 x 24, 2 px padding, input when off and primary when on.
// Thumb: 16 / 12 / 20, switch/thumb-unchecked when off and background when on. With no `label` it renders
// only the track (give it an aria-label or aria-labelledby). Focus is the real focus-visible ring.
// Disabled fades the control and the label; the description keeps its muted color, because it says why
// the setting is unavailable and a faded description fails the 4.5:1 contrast.
import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type SwitchSize = 'default' | 'sm' | 'lg';

export interface SwitchProps extends Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, 'children'> {
  /** Figma Size: default 36 x 20 (settings pages), sm 28 x 16 (dense tables, toolbars), lg 44 x 24 (touch). */
  size?: SwitchSize;
  /** Figma Label (Show label): names the setting, not the action. Without it, pass `aria-label`. */
  label?: React.ReactNode;
  /** Figma Description (Show description): what the setting does, linked with aria-describedby. */
  description?: React.ReactNode;
  /** Class of the outer wrapper when a label or description is shown. */
  wrapperClassName?: string;
}

const trackSize: Record<SwitchSize, string> = {
  default: 'h-5 w-9',
  sm: 'h-4 w-7',
  lg: 'h-6 w-11',
};
const thumbSize: Record<SwitchSize, string> = {
  default: 'size-4 data-[state=checked]:translate-x-4',
  sm: 'size-3 data-[state=checked]:translate-x-3',
  lg: 'size-5 data-[state=checked]:translate-x-5',
};
// ui/label (14/20) at default and lg, ui/label-small (12/16) at sm; lg adds 2 px so the label centers on the 24 px track.
const labelText: Record<SwitchSize, string> = {
  default: 'text-sm leading-5',
  sm: 'text-xs leading-4',
  lg: 'pt-0.5 text-sm leading-5',
};
// body/small (14/20) at default and lg, ui/caption (12/16) at sm.
const descriptionText: Record<SwitchSize, string> = {
  default: 'text-sm leading-5',
  sm: 'text-xs leading-4',
  lg: 'text-sm leading-5',
};

function Switch({
  size = 'default',
  label,
  description,
  className,
  wrapperClassName,
  disabled,
  id: idProp,
  'aria-describedby': describedByProp,
  ...props
}: SwitchProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const descId = `${id}-description`;
  const describedBy = [describedByProp, description ? descId : null].filter(Boolean).join(' ') || undefined;
  const wrapped = Boolean(label || description);

  const control = (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      id={id}
      disabled={disabled}
      aria-describedby={describedBy}
      className={cn(
        'peer inline-flex shrink-0 items-center rounded-full bg-input p-0.5 shadow-xs outline-none transition-colors duration-[var(--duration-fast)]',
        'data-[state=checked]:bg-primary',
        'focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        'disabled:cursor-not-allowed',
        !wrapped && 'disabled:opacity-50',
        trackSize[size],
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full bg-[var(--switch-thumb-unchecked)] shadow-sm transition-transform duration-[var(--duration-fast)]',
          'translate-x-0 data-[state=checked]:bg-background',
          thumbSize[size],
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!wrapped) return control;

  return (
    <div
      data-slot="switch-field"
      data-size={size}
      data-disabled={disabled ? '' : undefined}
      className={cn('flex min-w-0 items-start gap-2', wrapperClassName)}
    >
      <span className={cn('flex shrink-0', disabled && 'opacity-50')}>{control}</span>
      <div className="flex min-w-0 flex-1 flex-col">
        {label ? (
          <label
            htmlFor={id}
            data-slot="switch-label"
            className={cn(
              'line-clamp-2 break-words font-medium text-foreground',
              labelText[size],
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            )}
          >
            {label}
          </label>
        ) : null}
        {description ? (
          <p id={descId} data-slot="switch-description" className={cn('line-clamp-3 break-words text-muted-foreground', descriptionText[size])}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { Switch };
