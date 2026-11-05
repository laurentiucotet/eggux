// EGG UI Spinner. Figma: Spinner (Spinner / Component, node 303:4553). Size (sm 16, default 20,
// lg 32), Tone (muted, default), Type (default = loader-circle icon rotating 1 s linear;
// dots = three dots pulsing 0.2 s apart at 100/70/40 %). shadcn Spinner per code-mapping.
// Reduced motion: the ring pulses its opacity instead of rotating; the dots stay static.
// With `label` it is a role="status" region with visually hidden text; without it, it is
// decorative (aria-hidden) and the text next to it carries the meaning.
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { LoaderCircle } from '@/components/icons';
import { cn } from '@/lib/utils';

const spinnerVariants = cva('inline-flex shrink-0 items-center justify-center', {
  variants: {
    size: { sm: 'size-4', default: 'size-5', lg: 'size-8' },
    tone: { muted: 'text-muted-foreground', default: 'text-foreground' },
  },
  defaultVariants: { size: 'default', tone: 'default' },
});

export interface SpinnerProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  size?: 'sm' | 'default' | 'lg';
  tone?: 'muted' | 'default';
  type?: 'default' | 'dots';
  /** Accessible text ("Loading invoices"). Without it the spinner is decorative. */
  label?: string;
}

// Written in full so Tailwind can read them. Opacity 100 / 70 / 40 % shows the pulse at rest.
const dotOpacity = ['opacity-100', 'opacity-70', 'opacity-40'] as const;

function Spinner({ size = 'default', tone = 'default', type = 'default', label, className, ...props }: SpinnerProps) {
  const a11y = label ? { role: 'status' as const, 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <span data-slot="spinner" data-type={type} className={cn(spinnerVariants({ size, tone }), type === 'dots' && (size === 'sm' ? 'gap-0.5' : 'gap-1'), className)} {...a11y} {...props}>
      {type === 'dots' ? (
        dotOpacity.map((opacity, i) => (
          <span
            key={i}
            data-slot="spinner-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
            className={cn(
              'shrink-0 rounded-full bg-current animate-pulse [animation-duration:0.6s] motion-reduce:animate-none',
              size === 'lg' ? 'size-2' : 'size-1',
              opacity,
            )}
          />
        ))
      ) : (
        <LoaderCircle size="100%" className="animate-spin [animation-duration:1s] [animation-timing-function:linear] motion-reduce:animate-pulse" />
      )}
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

export { Spinner, spinnerVariants };
