// EGG UI Back Link. Figma: Back Link (Navigation page, "Back Link / Component"). State (default,
// hover); Label. The way back to the list a record came from, above the page title: "← All
// invoices". A real link to a fixed URL (never history.back()), arrow-left 16 aria-hidden, 6 px
// gap (spacing/1_5), ui/label, foreground/muted, foreground on hover. Name the destination, never
// "Back". Long labels wrap; the arrow never shrinks.
import * as React from 'react';
import { Slot } from 'radix-ui';
import { ArrowLeft } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface BackLinkProps extends React.ComponentProps<'a'> {
  /** Render your router's link as the only child instead of <a>; the arrow is added before its text. */
  asChild?: boolean;
}

const backLinkClass =
  'inline-flex max-w-full items-center gap-1.5 rounded-sm text-sm font-medium leading-5 text-muted-foreground transition-colors duration-[var(--duration-fast)] outline-none hover:text-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] [&_svg]:size-4 [&_svg]:shrink-0';

function BackLink({ asChild, className, children, ...props }: BackLinkProps) {
  if (asChild && React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return (
      <Slot.Root data-slot="back-link" className={cn(backLinkClass, className)} {...props}>
        {React.cloneElement(children, undefined, <><ArrowLeft aria-hidden="true" /><span className="min-w-0">{children.props.children}</span></>)}
      </Slot.Root>
    );
  }
  return (
    <a data-slot="back-link" className={cn(backLinkClass, className)} {...props}>
      <ArrowLeft aria-hidden="true" />
      <span className="min-w-0">{children ?? 'All invoices'}</span>
    </a>
  );
}

export { BackLink };
