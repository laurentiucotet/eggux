// EGG UI Badge Count. Figma: Badge Count (Badge page, "Badge Count / Component").
// Variant (default, secondary, destructive, outline) x Type (count, dot), Count text.
// Numeric counter on an icon button corner or at the end of a sidebar item. Numbers above 99 show
// "99+". Type=dot is an 8 px dot with no number; its meaning comes from `label` (sr-only text).
// Custom component built from shadcn Badge styling (references/code-mapping.md).
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeCountVariants = cva('inline-flex shrink-0 items-center justify-center rounded-full', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border border-border bg-background text-foreground',
    },
    type: {
      count: 'h-5 min-w-5 whitespace-nowrap px-1.5 text-xs font-medium leading-4',
      dot: 'size-2 min-w-2',
    },
  },
  defaultVariants: { variant: 'default', type: 'count' },
});

export type BadgeCountVariant = NonNullable<VariantProps<typeof badgeCountVariants>['variant']>;

export interface BadgeCountProps extends Omit<React.ComponentProps<'span'>, 'children'>, VariantProps<typeof badgeCountVariants> {
  /** Figma Count: digits. A number above `max` shows "max+"; a string is shown as given. Ignored when type="dot". */
  count?: number | string;
  /** Highest number shown before "99+". */
  max?: number;
  /** Text equivalent for assistive technology: "2 active filters", "Notifications, unread". Required for a dot. */
  label?: string;
}

function BadgeCount({ variant, type = 'count', count = 3, max = 99, label, className, ...props }: BadgeCountProps) {
  const text = typeof count === 'number' && count > max ? `${max}+` : String(count);
  return (
    <span data-slot="badge-count" data-variant={variant ?? 'default'} data-type={type} className={cn(badgeCountVariants({ variant, type }), className)} {...props}>
      {type === 'dot' ? (
        <span className="sr-only">{label ?? 'unread'}</span>
      ) : label ? (
        <>
          <span aria-hidden="true">{text}</span>
          <span className="sr-only">{label}</span>
        </>
      ) : (
        text
      )}
    </span>
  );
}

export { BadgeCount, badgeCountVariants };
