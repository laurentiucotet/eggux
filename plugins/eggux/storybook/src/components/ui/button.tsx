// EGG UI Button. Figma: Button (COMPONENTS / Button). Variant, Size and State match the Figma
// properties; the base is shadcn/ui Button with the EGG changes from references/code-mapping.md
// (soft variant, xs and xl sizes, link in text-brand, pill radius through --button-radius).
import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from '@/components/icons';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-button text-sm font-medium transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-[var(--button-primary-hover)]',
        destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-[var(--button-destructive-hover)] focus-visible:ring-destructive/30',
        outline: 'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-[var(--button-secondary-hover)]',
        soft: 'bg-[var(--button-soft-bg)] text-brand hover:bg-[var(--button-soft-hover)]',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'h-auto px-0 text-brand underline-offset-4 hover:underline',
      },
      size: {
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: 'h-8 gap-1.5 px-3',
        default: 'h-[var(--control-height)] px-4',
        lg: 'h-10 px-6',
        xl: 'h-12 px-8 text-base',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** Render the child element (a link) with button styles. */
  asChild?: boolean;
  /** Figma "Leading icon" (Show leading icon + swap): an icon from `@/components/icons` before the label. */
  leadingIcon?: React.ReactNode;
  /** Figma "Trailing icon": an icon from `@/components/icons` after the label. */
  trailingIcon?: React.ReactNode;
  /** Figma State=loading: a spinner replaces the leading icon, the label stays, repeat clicks are blocked. */
  loading?: boolean;
}

function Button({ className, variant, size, asChild = false, loading = false, disabled, leadingIcon, trailingIcon, children, onClick, ...props }: ButtonProps) {
  if (asChild) {
    return <Slot.Root data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props}>{children}</Slot.Root>;
  }
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      // Loading keeps its look (Figma State=loading is not faded) but ignores clicks and Enter.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={loading ? e => e.preventDefault() : onClick}
      {...props}
    >
      {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}

export { Button, buttonVariants };
