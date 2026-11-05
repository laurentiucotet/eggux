// EGG UI Progress (continuous bar only). Figma: Progress (Progress page), built here as a
// dependency of Progress Card. Size (sm 4, default 8, lg 12), Tone (default, success, warning,
// error), Show label (a row above the bar: the label, 1 line, and the value text on the right).
// shadcn Progress on the radix-ui primitive: role="progressbar" with aria-valuenow and a name.
// Not built here: Type=segmented, Value=indeterminate.
import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type ProgressSize = 'sm' | 'default' | 'lg';
export type ProgressTone = 'default' | 'success' | 'warning' | 'error';

const trackSize = cva('relative w-full overflow-hidden rounded-full bg-muted', {
  variants: { size: { sm: 'h-1', default: 'h-2', lg: 'h-3' } },
  defaultVariants: { size: 'default' },
});

const toneClass: Record<ProgressTone, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
};

export interface ProgressProps extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, 'value'> {
  /** Figma Value: 0 to 100. */
  value?: number;
  size?: ProgressSize;
  tone?: ProgressTone;
  /** Figma Show label + Label: what is progressing. Without it pass `aria-label`. */
  label?: React.ReactNode;
  /** The value text on the right of the label row ("40%", "3 of 5"). Defaults to the percent. */
  valueText?: React.ReactNode;
}

function Progress({ value = 0, size = 'default', tone = 'default', label, valueText, className, ...props }: ProgressProps) {
  const labelId = React.useId();
  const bar = (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      aria-labelledby={label ? labelId : undefined}
      className={cn(trackSize({ size }), !label && className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn('h-full w-full flex-1 rounded-full transition-transform duration-[var(--duration-fast)]', toneClass[tone])}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
  if (!label) return bar;
  return (
    <div data-slot="progress-field" className={cn('flex w-full min-w-0 flex-col gap-2', className)}>
      <div className="flex items-center gap-3 text-sm">
        <span id={labelId} className="min-w-0 flex-1 truncate font-medium text-foreground">{label}</span>
        <span className="shrink-0 text-muted-foreground">{valueText ?? `${value}%`}</span>
      </div>
      {bar}
    </div>
  );
}

export { Progress };
