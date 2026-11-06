// EGG UI Navigation Menu Link. Figma: Navigation Menu Link (Navigation page, "Navigation Menu Panel
// / Component", set 122:58). State (default, hover); Title, Description, Show icon, Icon (default
// chart-column). A link inside a mega menu panel (shadcn NavigationMenuLink): 12 px padding and gap
// (spacing/3), radius md, hover background/accent. Icon box 36 (spacing/9) with a border on
// background/default, radius md, an 18 px icon, decorative. Title ui/label foreground, one line
// with ellipsis; description ui/caption muted, wraps; 2 px between them (spacing/0_5). The title is
// read first in the link name, then the description (axe label-content-name-mismatch rules out
// naming the link by the title alone). Min width 240 in the panel grid.
// Radix NavigationMenu.Link: arrow keys move between links and choosing one closes the menu, so it
// must sit inside a NavigationMenu (navigation-menu.tsx).
import * as React from 'react';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { ChartColumn } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface NavigationMenuLinkProps extends Omit<React.ComponentProps<typeof NavigationMenuPrimitive.Link>, 'title'> {
  /** Figma Title: the link name ("Analytics"). Leave it out to render `children` as they are (a top-level Nav Link with asChild). */
  title?: React.ReactNode;
  /** Figma Description: one line on what the user gets. */
  description?: React.ReactNode;
  /** Figma Icon (instance swap): an icon from `@/components/icons`. Default chart-column. */
  icon?: React.ReactNode;
  /** Figma Show icon. Default true. */
  showIcon?: boolean;
}

const linkClass =
  'group/menu-link flex min-w-60 items-start gap-3 rounded-md p-3 text-foreground no-underline outline-none transition-colors duration-[var(--duration-fast)] hover:bg-accent focus-visible:bg-accent focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] data-[active]:bg-accent';

function NavigationMenuLink({ title, description, icon, showIcon = true, className, children, ...props }: NavigationMenuLinkProps) {
  if (title === undefined) {
    return <NavigationMenuPrimitive.Link data-slot="navigation-menu-link" className={className} {...props}>{children}</NavigationMenuPrimitive.Link>;
  }
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(linkClass, className)}
      {...props}
    >
      {showIcon ? (
        <span
          aria-hidden="true"
          data-slot="navigation-menu-link-icon"
          className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground [&_svg]:size-[18px]"
        >
          {icon ?? <ChartColumn />}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span data-slot="navigation-menu-link-title" className="truncate text-sm font-medium leading-5 text-foreground">{title}</span>
        {description ? (
          <span data-slot="navigation-menu-link-description" className="text-xs leading-4 text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </NavigationMenuPrimitive.Link>
  );
}

export { NavigationMenuLink };
