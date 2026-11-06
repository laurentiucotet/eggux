// EGG UI Breadcrumb Item. Figma: Breadcrumb Item (Navigation page, "Breadcrumb / Component").
// Type (link, current, ellipsis) x State (default, hover); Label, Show separator. shadcn
// BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis.
// body/small; link = foreground/muted, foreground on hover; current = foreground, not a link,
// aria-current="page"; separator = 14 px chevron-right, muted, 6 px after the label (spacing/1_5);
// ellipsis = a 16 px icon in a button named "Show path" that opens the collapsed levels.
// EGG change from shadcn: the separator sits inside its item (Figma Show separator), so it wraps
// with its label and never starts a line; it is a hidden span, not a presentational <li>.
import * as React from 'react';
import { Slot } from 'radix-ui';
import { ChevronRight, Ellipsis } from '@/components/icons';
import { cn } from '@/lib/utils';

const focusRing = 'outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]';

/** One level of the path: an <li> holding a link (or the current page) and its separator. */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="breadcrumb-item" className={cn('inline-flex min-w-0 items-center gap-1.5', className)} {...props} />;
}

export interface BreadcrumbLinkProps extends React.ComponentProps<'a'> {
  /** Render your router's link (Next.js Link, React Router Link) as the child instead of <a>. */
  asChild?: boolean;
}

/** Figma Type=link: an ancestor page, muted, foreground on hover. */
function BreadcrumbLink({ asChild, className, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot.Root : 'a';
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        'whitespace-nowrap rounded-sm text-sm leading-5 text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:text-foreground',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

/** Figma Type=current: this page; not a link, aria-current="page". Leave out the separator. */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn('whitespace-nowrap text-sm leading-5 text-foreground', className)} {...props} />;
}

/** Figma Show separator: chevron-right 14, muted, hidden from screen readers. Put it inside the item, after the link. */
function BreadcrumbSeparator({ className, children, ...props }: React.ComponentProps<'span'>) {
  return (
    <span data-slot="breadcrumb-separator" aria-hidden="true" className={cn("inline-flex shrink-0 text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5", className)} {...props}>
      {children ?? <ChevronRight />}
    </span>
  );
}

/**
 * Figma Type=ellipsis: collapsed middle levels. A button named "Show path" (16 icon, 24 hit
 * area); use it as the trigger of a DropdownMenu that lists the hidden levels.
 */
function BreadcrumbEllipsis({ className, 'aria-label': ariaLabel = 'Show path', ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      data-slot="breadcrumb-ellipsis"
      aria-label={ariaLabel}
      className={cn(
        '-m-1 inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:text-foreground data-[state=open]:text-foreground [&_svg]:size-4',
        focusRing,
        className,
      )}
      {...props}
    >
      <Ellipsis aria-hidden="true" />
    </button>
  );
}

export { BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
