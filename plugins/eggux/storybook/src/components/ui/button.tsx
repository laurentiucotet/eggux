// EGG UI Button and the base of Button Icon. Figma: Button and Button Icon (Button page,
// "Button / Component", "Button Icon / Component"). Variant, Size and State match the Figma
// properties; the base is shadcn/ui Button with the EGG changes from references/code-mapping.md
// (soft variant, xs and xl sizes, link in text-brand, pill radius through --button-radius).
// Figma State=focus: a 2 px background gap plus a 2 px --ring band (the shadow is replaced), the
// same ring on every variant. Outline draws its border in --input. Button Icon sizes are icon-xs 28
// (14 px icon), icon-sm 32, icon 36 (density), icon-lg 40; ButtonIcon in button-icon.tsx adds the
// label and the tooltip.
import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from '@/components/icons';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-button text-sm font-medium transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-[var(--button-primary-hover)]',
        destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-[var(--button-destructive-hover)]',
        outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-[var(--button-secondary-hover)]',
        soft: 'bg-[var(--button-soft-bg)] text-brand hover:bg-[var(--button-soft-hover)]',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'h-auto px-0 text-brand underline-offset-4 hover:underline',
      },
      size: {
        // Figma Size=xs: 28, ui/label-small (12/16), 14 px icons, 10 px sides, 4 px gap.
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: 'h-8 gap-1.5 px-3',
        default: 'h-[var(--control-height)] px-4',
        lg: 'h-10 px-6',
        // Figma Size=xl: 48, 32 px sides, 10 px gap, the same ui/label (14/20) as the other sizes.
        xl: 'h-12 gap-2.5 px-8',
        // Figma Button Icon: square, icon only. xs 28 (14 px icon), sm 32, default 36 (density), lg 40 (16 px icon).
        'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': 'size-8',
        icon: 'size-[var(--control-height)]',
        'icon-lg': 'size-10',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** Render the child element (a link) with button styles. */
  asChild?: boolean;
  /** Figma "Leading icon" (Show leading icon + swap): an icon from `@/components/icons` before the label. */
  leadingIcon?: React.ReactNode;
  /** Figma "Trailing icon": an icon from `@/components/icons` after the label. */
  trailingIcon?: React.ReactNode;
  /**
   * Figma State=loading: a spinner replaces the leading icon (on icon sizes it replaces the icon),
   * the label stays, repeat clicks are blocked.
   */
  loading?: boolean;
}

function Button({ className, variant, size, asChild = false, loading = false, disabled, leadingIcon, trailingIcon, children, onClick, ...props }: ButtonProps) {
  if (asChild) {
    return <Slot.Root data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props}>{children}</Slot.Root>;
  }
  // Button Icon (icon sizes): the spinner takes the place of the icon, so the size never changes.
  const iconOnly = typeof size === 'string' && size.startsWith('icon');
  const spinner = <LoaderCircle className="animate-spin" aria-hidden="true" data-slot="button-spinner" />;
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
      {loading ? spinner : leadingIcon}
      {loading && iconOnly ? null : children}
      {trailingIcon}
    </button>
  );
}

export { Button, buttonVariants };
