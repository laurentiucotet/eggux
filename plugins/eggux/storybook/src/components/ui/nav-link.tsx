// EGG UI Nav Link. Figma: Nav Link (Navigation page, "Nav Link / Component"). State (default,
// hover, active); Label, Show chevron. Top-level link of a marketing Navbar (shadcn
// NavigationMenuLink / NavigationMenuTrigger look): control height (density), 16 px sides
// (spacing/4), gap 4, radius md, ui/label, foreground; hover and active = background/accent with
// foreground/accent. Active = the current section, aria-current="page". Show chevron: a 12 px
// chevron-down for a trigger that opens a Navigation Menu Panel; it turns when aria-expanded or
// data-state="open". `navLinkClassName` styles a NavigationMenuTrigger the same way.
import * as React from 'react';
import { Slot } from 'radix-ui';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';

const navLinkBase =
  "group/nav-link inline-flex h-[var(--control-height)] shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-4 text-sm font-medium leading-5 text-foreground transition-colors duration-[var(--duration-fast)] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0";

/** Classes of a Nav Link, for a NavigationMenuTrigger or another element that must look the same. */
function navLinkClassName(className?: string) {
  return cn(navLinkBase, className);
}

/** Figma chevron: 12 px chevron-down, turns while its panel is open. */
function NavLinkChevron({ className }: { className?: string }) {
  return (
    <ChevronDown
      aria-hidden="true"
      data-slot="nav-link-chevron"
      className={cn('size-3 transition-transform duration-[var(--duration-fast)] group-aria-expanded/nav-link:rotate-180 group-data-[state=open]/nav-link:rotate-180', className)}
    />
  );
}

export interface NavLinkProps extends React.ComponentProps<'a'> {
  /** Figma State=active: the current section; sets aria-current="page". */
  active?: boolean;
  /** Figma Show chevron: the link opens a Navigation Menu Panel. */
  showChevron?: boolean;
  /** Render your router's link (or a menu trigger) as the only child instead of <a>. */
  asChild?: boolean;
}

function NavLink({ active, showChevron = false, asChild, className, children, ...props }: NavLinkProps) {
  const shared = { 'data-slot': 'nav-link', 'aria-current': active ? ('page' as const) : undefined, className: navLinkClassName(className), ...props };
  if (asChild && React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return (
      <Slot.Root {...shared}>
        {showChevron ? React.cloneElement(children, undefined, <>{children.props.children}<NavLinkChevron /></>) : children}
      </Slot.Root>
    );
  }
  return (
    <a {...shared}>
      {children}
      {showChevron ? <NavLinkChevron /> : null}
    </a>
  );
}

export { NavLink, NavLinkChevron, navLinkClassName };
