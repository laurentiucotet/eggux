// EGG UI Badge. Figma: Badge (COMPONENTS / Badge). Variant (solid, soft-*, category-1..8), Size
// (sm, default, lg), Shape (rounded, pill), Show dot. shadcn Badge plus the EGG variants from
// references/code-mapping.md. Labels truncate past max-w-64.
import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex max-w-64 shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border border-transparent font-medium [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border-border text-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        info: 'bg-info text-info-foreground',
        // Class names are written out in full: Tailwind only generates classes it can read in the source.
        'soft-success': 'bg-[var(--badge-soft-success-bg)] text-[var(--badge-soft-success-fg)]',
        'soft-warning': 'bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]',
        'soft-destructive': 'bg-[var(--badge-soft-destructive-bg)] text-[var(--badge-soft-destructive-fg)]',
        'soft-info': 'bg-[var(--badge-soft-info-bg)] text-[var(--badge-soft-info-fg)]',
        'soft-neutral': 'bg-[var(--badge-soft-neutral-bg)] text-[var(--badge-soft-neutral-fg)]',
        'category-1': 'bg-[var(--badge-category-1-bg)] text-[var(--badge-category-1-fg)]',
        'category-2': 'bg-[var(--badge-category-2-bg)] text-[var(--badge-category-2-fg)]',
        'category-3': 'bg-[var(--badge-category-3-bg)] text-[var(--badge-category-3-fg)]',
        'category-4': 'bg-[var(--badge-category-4-bg)] text-[var(--badge-category-4-fg)]',
        'category-5': 'bg-[var(--badge-category-5-bg)] text-[var(--badge-category-5-fg)]',
        'category-6': 'bg-[var(--badge-category-6-bg)] text-[var(--badge-category-6-fg)]',
        'category-7': 'bg-[var(--badge-category-7-bg)] text-[var(--badge-category-7-fg)]',
        'category-8': 'bg-[var(--badge-category-8-bg)] text-[var(--badge-category-8-fg)]',
      },
      size: {
        sm: "h-4 px-1.5 text-xs [&>svg:not([class*='size-'])]:size-2.5",
        default: "h-5 px-2 text-xs [&>svg:not([class*='size-'])]:size-3",
        lg: "h-6 px-2.5 text-sm [&>svg:not([class*='size-'])]:size-3.5",
      },
      shape: { rounded: 'rounded-md', pill: 'rounded-full' },
    },
    defaultVariants: { variant: 'default', size: 'default', shape: 'rounded' },
  },
);

export interface BadgeProps extends React.ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /** Figma "Show dot": a dot in the label color before the label. */
  dot?: boolean;
}

function Badge({ className, variant, size, shape, asChild = false, dot = false, children, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant, size, shape }), className)} {...props}>
      {dot && <span aria-hidden="true" className={cn('shrink-0 rounded-full bg-current', size === 'lg' ? 'size-2' : 'size-1.5')} />}
      {asChild ? children : <span className="min-w-0 truncate">{children}</span>}
    </Comp>
  );
}

export { Badge, badgeVariants };
