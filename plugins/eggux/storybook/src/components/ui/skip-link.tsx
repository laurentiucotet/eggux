// EGG UI Skip Link. Figma: Skip Link (Navigation page, "Skip Link / Component"). Label. The first
// focusable element of every page: visually hidden (sr-only, never display:none) until it gets
// keyboard focus, then shown fixed top left above everything: background/primary,
// foreground/primary, ui/label, 16 x 8 padding, radius md, focus ring (background + border/ring),
// up to 320 wide (spacing/80) where the label wraps to 2 lines, centered. Activating it moves focus
// to the target (the <main> landmark, which gets tabindex="-1"); without JS the hash link still jumps.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkipLinkProps extends React.ComponentProps<'a'> {
  /** Target of the jump: "#main" (default) or the id of the content after a long repeated block. */
  href?: string;
}

function SkipLink({ href = '#main', className, children = 'Skip to main content', onClick, ...props }: SkipLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !href.startsWith('#')) return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    // The target takes focus even when it is not focusable itself (a <main> or a heading).
    // Handled here (not by the browser's hash jump) so it also works under a <base href> and in
    // routers that own the hash.
    event.preventDefault();
    if (!target.hasAttribute('tabindex') && target.tabIndex < 0) target.setAttribute('tabindex', '-1');
    target.focus();
  };
  return (
    <a
      data-slot="skip-link"
      href={href}
      onClick={handleClick}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:inline-flex focus:max-w-80 focus:items-center focus:justify-center focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-center focus:text-sm focus:leading-5 focus:font-medium focus:text-primary-foreground focus:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] focus:outline-none',
        className,
      )}
      {...props}
    >
      <span className="line-clamp-2">{children}</span>
    </a>
  );
}

export { SkipLink };
