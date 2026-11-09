// EGG UI Sidebar types: parts that add more sidebar layouts on top of Sidebar, Sidebar Group and
// Sidebar Item (same sidebar/* tokens, 224 rows, 32 high, radius md). Not separate Figma
// components; they follow the Sidebar page rules.
// - Sidebar Search: a 32 search button that looks like a field with ⌘K (opens the Command menu);
//   collapsed it is a 32 icon button.
// - Sidebar Collapsible Group: the group label is a button (aria-expanded) with a chevron that
//   folds the items; the open state stays with the app.
// - Sidebar Submenu: a parent row with a chevron that opens Level 2 pages under it (aria-expanded).
//   It opens by itself when one of its pages is active.
// - Sidebar Card: a small surface in the footer (plan usage, upgrade, announcement); hidden when
//   the sidebar is collapsed.
// - Sidebar Rail: a 72 wide column of icon-over-label links (Rail Item, 56 square, radius lg) for
//   apps with few top sections; the active one is filled.
import * as React from 'react';
import { ChevronDown, ChevronRight, Search } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Kbd, KbdGroup } from './kbd';
import { LogoMark } from './logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { useSidebar } from './sidebar';

const focusRing = 'outline-none focus-visible:shadow-[0_0_0_2px_var(--sidebar),0_0_0_4px_var(--sidebar-ring)]';

/* Sidebar Search */

export interface SidebarSearchProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  label?: string;
  /** Shortcut keys shown at the end. */
  shortcut?: string[];
}

function SidebarSearch({ label = 'Search', shortcut = ['⌘', 'K'], className, ...props }: SidebarSearchProps) {
  const { collapsed } = useSidebar();
  const keys = shortcut.join('+').replace('⌘', 'Meta');
  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" data-slot="sidebar-search" aria-label={label} aria-keyshortcuts={keys} className={cn('flex size-8 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent [&_svg]:size-4', focusRing, className)} {...props}>
              <Search aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <button
      type="button"
      data-slot="sidebar-search"
      aria-keyshortcuts={keys}
      className={cn('flex h-8 w-full min-w-0 items-center gap-2 rounded-md border border-sidebar-border bg-background px-2 text-sm leading-5 text-muted-foreground shadow-xs hover:bg-sidebar-accent [&_svg]:size-4 [&_svg]:shrink-0', focusRing, className)}
      {...props}
    >
      <Search aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      <KbdGroup aria-hidden="true">
        {shortcut.map((k) => (
          <Kbd key={k}>{k}</Kbd>
        ))}
      </KbdGroup>
    </button>
  );
}

/* Sidebar Collapsible Group */

export interface SidebarCollapsibleGroupProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  label: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Extra control at the end of the label row (Add project). */
  action?: React.ReactNode;
}

function SidebarCollapsibleGroup({ label, open: openProp, defaultOpen = true, onOpenChange, action, className, children, ...props }: SidebarCollapsibleGroupProps) {
  const { collapsed } = useSidebar();
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const id = React.useId();
  const toggle = () => {
    setInner(!open);
    onOpenChange?.(!open);
  };
  if (collapsed) {
    return (
      <div data-slot="sidebar-group" role="group" aria-label={label} className={cn('flex w-full flex-col items-center p-2', className)} {...props}>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">{children}</ul>
      </div>
    );
  }
  return (
    <div data-slot="sidebar-collapsible-group" data-state={open ? 'open' : 'closed'} role="group" aria-labelledby={`${id}-label`} className={cn('flex w-full flex-col p-2', className)} {...props}>
      <div className="flex h-8 items-center gap-1">
        <button
          id={`${id}-label`}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-items`}
          onClick={toggle}
          className={cn('flex h-8 min-w-0 flex-1 items-center gap-1 rounded-md px-2 text-xs leading-4 font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&_svg]:size-3.5', focusRing)}
        >
          <span className="min-w-0 truncate">{label}</span>
          <ChevronDown aria-hidden="true" className={cn('shrink-0 transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', !open && '-rotate-90')} />
        </button>
        {action}
      </div>
      <ul id={`${id}-items`} hidden={!open} className="m-0 flex w-full list-none flex-col gap-1 p-0">
        {children}
      </ul>
    </div>
  );
}

/* Sidebar Submenu */

export interface SidebarSubmenuProps extends Omit<React.ComponentProps<'li'>, 'title'> {
  label: string;
  icon?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Level 2 SidebarItems. */
  children: React.ReactNode;
}

function hasActive(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((c) => React.isValidElement<{ active?: boolean }>(c) && Boolean(c.props.active));
}

function SidebarSubmenu({ label, icon, open: openProp, defaultOpen, onOpenChange, className, children, ...props }: SidebarSubmenuProps) {
  const { collapsed } = useSidebar();
  const [inner, setInner] = React.useState(defaultOpen ?? hasActive(children));
  const open = openProp ?? inner;
  const id = React.useId();
  const current = hasActive(children);
  if (collapsed) {
    // Collapsed: the first page stands for the section (its icon and tooltip).
    return (
      <li data-slot="sidebar-submenu" className="m-0 list-none" {...props}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={label}
                className={cn('flex size-8 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent [&_svg]:size-4', current && 'bg-sidebar-accent text-sidebar-accent-foreground', focusRing)}
              >
                {icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    );
  }
  return (
    <li data-slot="sidebar-submenu" data-state={open ? 'open' : 'closed'} className={cn('m-0 flex list-none flex-col gap-1', className)} {...props}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-pages`}
        onClick={() => {
          setInner(!open);
          onOpenChange?.(!open);
        }}
        className={cn(
          'flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-2 text-sm leading-5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
          current && !open && 'font-medium',
          focusRing,
        )}
      >
        {icon}
        <span className="min-w-0 flex-1 truncate text-left">{label}</span>
        <ChevronRight aria-hidden="true" className={cn('transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', open && 'rotate-90')} />
      </button>
      <ul id={`${id}-pages`} hidden={!open} className="relative m-0 flex list-none flex-col gap-1 p-0 before:absolute before:inset-y-1 before:left-4 before:w-px before:bg-sidebar-border">
        {children}
      </ul>
    </li>
  );
}

/* Sidebar Card */

function SidebarCard({ className, ...props }: React.ComponentProps<'div'>) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return <div data-slot="sidebar-card" className={cn('flex w-full flex-col gap-3 rounded-lg border border-sidebar-border bg-background p-3 text-sm leading-5 text-foreground', className)} {...props} />;
}

/* Sidebar Rail */

export interface SidebarRailProps extends React.ComponentProps<'div'> {
  label?: string;
  /** Logo Mark at the top. */
  mark?: React.ReactNode;
  /** Rail Items at the bottom (Settings); wrap anything else in an li. */
  footer?: React.ReactNode;
}

function SidebarRail({ label = 'Main', mark, footer, className, children, ...props }: SidebarRailProps) {
  return (
    <div data-slot="sidebar-rail" className={cn('flex h-full w-18 shrink-0 flex-col items-center gap-4 bg-sidebar py-3 text-sidebar-foreground shadow-[inset_-1px_0_0_var(--sidebar-border)]', className)} {...props}>
      {mark !== undefined ? mark : <LogoMark />}
      <nav aria-label={label} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">{children}</ul>
      </nav>
      {footer ? <ul className="m-0 flex list-none flex-col items-center gap-1 p-0">{footer}</ul> : null}
    </div>
  );
}

export interface SidebarRailItemProps extends Omit<React.ComponentProps<'a'>, 'children'> {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  /** A small count dot with its text ("3 unread"). */
  badge?: string;
}

function SidebarRailItem({ label, icon, active, badge, className, ...props }: SidebarRailItemProps) {
  return (
    <li className="m-0 list-none">
      <a
        data-slot="sidebar-rail-item"
        aria-current={active ? 'page' : undefined}
        className={cn(
          'relative flex size-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] leading-[14px] font-medium text-sidebar-foreground no-underline hover:bg-sidebar-accent aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-accent-foreground [&_svg]:size-5',
          focusRing,
          className,
        )}
        {...props}
      >
        {icon}
        <span className="max-w-full truncate px-1">{label}</span>
        {badge ? (
          <span className="absolute top-1.5 right-3 size-2 rounded-full bg-destructive ring-2 ring-sidebar">
            <span className="sr-only">, {badge}</span>
          </span>
        ) : null}
      </a>
    </li>
  );
}

export { SidebarCard, SidebarCollapsibleGroup, SidebarRail, SidebarRailItem, SidebarSearch, SidebarSubmenu };
