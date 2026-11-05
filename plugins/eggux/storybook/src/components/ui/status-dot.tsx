// EGG UI Status Dot. Figma: Status Dot (COMPONENTS / Badge page, "Status Dot / Component").
// Status (success, warning, error, info, neutral), Label, Show label. A 8 px dot + label in text flow
// and tables. The dot is decorative; with Show label off the label stays as screen reader text.
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const dotVariants = cva('size-2 shrink-0 rounded-full', {
  variants: {
    status: {
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-destructive',
      info: 'bg-info',
      neutral: 'bg-muted-foreground',
    },
  },
  defaultVariants: { status: 'success' },
});

export interface StatusDotProps extends React.ComponentProps<'span'>, VariantProps<typeof dotVariants> {
  /** Figma Label. Always real text, even when hidden. */
  label?: string;
  /** Figma Show label: off only right next to its own label (avatar status). */
  showLabel?: boolean;
}

function StatusDot({ className, status = 'success', label = 'Online', showLabel = true, ...props }: StatusDotProps) {
  return (
    <span data-slot="status-dot" data-status={status} className={cn('inline-flex min-w-0 max-w-full items-center gap-2', className)} {...props}>
      <span aria-hidden="true" className={dotVariants({ status })} />
      <span className={cn(showLabel ? 'min-w-0 truncate text-sm text-foreground' : 'sr-only')}>{label}</span>
    </span>
  );
}

export { StatusDot, dotVariants as statusDotVariants };
