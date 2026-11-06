// EGG UI Navigation Menu and Navigation Menu Panel. Figma: Navigation Menu Panel (Navigation page,
// "Navigation Menu Panel / Component", 122:59), opened by a Nav Link with Show chevron. shadcn
// NavigationMenu on the radix-ui primitive: NavigationMenu (nav, aria-label "Main") > List > Item >
// Trigger (styled as a Nav Link with its chevron, navLinkClassName) + Content (the panel, under
// its trigger). Opens on hover after a short delay (200 ms) and on click or Enter; Escape closes
// and returns focus to the trigger; Tab and the arrow keys move through the links.
// Panel: popover surface with border, radius md, shadow md, 8 px padding and gap (spacing/2).
// Links slot: Navigation Menu Links in a grid of columns at least 240 wide (2 columns at 834, 1
// below about 800), 8 px column gap and 4 px row gap. Featured slot (Show featured): a 240 card
// (spacing/60) on background/muted, radius md, 16 px padding, 4 px gap, content at the bottom:
// title ui/label (2 lines), text ui/caption muted (3 lines), a link Button sm. Min width 640
// (layout/breakpoint/sm); on phones put the links in a Sheet.
import * as React from 'react';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { NavLinkChevron, navLinkClassName } from './nav-link';
import { NavigationMenuLink } from './navigation-menu-link';

function NavigationMenu({ className, children, 'aria-label': ariaLabel = 'Main', ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root data-slot="navigation-menu" aria-label={ariaLabel} className={cn('relative flex max-w-max flex-1 items-center', className)} {...props}>
      {children}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return <NavigationMenuPrimitive.List data-slot="navigation-menu-list" className={cn('m-0 flex list-none items-center gap-1 p-0', className)} {...props} />;
}

/** One top-level entry. Content opens under it, aligned to its start. */
function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" className={cn('relative', className)} {...props} />;
}

/** Figma Nav Link with Show chevron: the button that opens a panel (aria-expanded, chevron turns). */
function NavigationMenuTrigger({ className, children, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger data-slot="navigation-menu-trigger" className={navLinkClassName(cn('cursor-pointer border-0 bg-transparent', className))} {...props}>
      {children}
      <NavLinkChevron />
    </NavigationMenuPrimitive.Trigger>
  );
}

/** The panel's place: under its trigger, 8 px below, above the page. Put a NavigationMenuPanel inside. */
function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn('absolute top-full left-0 z-50 mt-2 w-max', className)}
      {...props}
    />
  );
}

export interface NavigationMenuPanelProps extends React.ComponentProps<'div'> {
  /** Figma Featured slot (Show featured): a NavigationMenuFeatured card. Leave it out to hide it. */
  featured?: React.ReactNode;
}

/** Figma Navigation Menu Panel: the Links slot (children: NavigationMenuLinks) and the Featured slot. */
function NavigationMenuPanel({ featured, className, children, ...props }: NavigationMenuPanelProps) {
  return (
    <div
      data-slot="navigation-menu-panel"
      className={cn('flex w-[834px] max-w-[calc(100vw-2rem)] min-w-[640px] gap-2 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md', className)}
      {...props}
    >
      <ul data-slot="navigation-menu-panel-links" className="m-0 grid min-w-0 flex-1 list-none grid-cols-[repeat(auto-fill,minmax(240px,1fr))] content-start gap-x-2 gap-y-1 p-0">
        {React.Children.map(children, child => (child == null || child === false ? null : <li className="min-w-0">{child}</li>))}
      </ul>
      {featured ?? null}
    </div>
  );
}

export interface NavigationMenuFeaturedProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Card title ("New: AI summaries"), up to 2 lines. */
  title: React.ReactNode;
  /** One sentence, up to 3 lines. */
  description?: React.ReactNode;
  /** The card action: a link Button sm ("Learn more"), wrapped in NavigationMenuLink asChild so it closes the menu. */
  action?: React.ReactNode;
}

/** Figma Featured slot default: a highlight (launch, case study, guide) on a muted card. */
function NavigationMenuFeatured({ title, description, action, className, ...props }: NavigationMenuFeaturedProps) {
  return (
    <div data-slot="navigation-menu-featured" className={cn('flex w-60 shrink-0 flex-col justify-end gap-1 rounded-md bg-muted p-4', className)} {...props}>
      <p className="m-0 line-clamp-2 text-sm font-medium leading-5 text-foreground">{title}</p>
      {description ? <p className="m-0 line-clamp-3 text-xs leading-4 text-muted-foreground">{description}</p> : null}
      {action ? <div className="flex">{action}</div> : null}
    </div>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPanel,
  NavigationMenuFeatured,
};
