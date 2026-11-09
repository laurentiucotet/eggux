// EGG UI Sidebar and its parts. Figma: Sidebar, Sidebar Item, Sidebar Group Label, Sidebar Group,
// Sidebar Workspace, Sidebar User (Sidebar page, "Sidebar / Component"). shadcn Sidebar on the
// sidebar/* tokens, written as plain parts (no provider): the app keeps the collapsed state.
// Sidebar: Mode expanded 256 (min 240) / collapsed 48 (icons only, labels in tooltips); Variant
// sidebar (full height, right border), floating (inside 8 px, full border, radius lg, shadow sm, on
// a muted or brand canvas), inset (no border; the page beside it is the raised card). Header,
// Content and Footer slots, 8 px padding; the content scrolls.
// Sidebar Group: 8 px padding, optional Group Label (32 high, 8 px sides, ui/label-small muted,
// Show action: ghost xs Button Icon "Add project"), items 4 px apart.
// Sidebar Item: 224 × 32, 8 px sides, 8 gap, radius md, 16 px icon, body/small label that
// truncates; hover sidebar/accent; active sidebar/accent with ui/label and aria-current="page";
// disabled 50 %; Badge Count (secondary) and Chevron at the end; Level=2 has no icon and a 32 px
// start padding; Show action: a ghost xs Button Icon (ellipsis) after the link, shown on hover, on
// focus and on the active item. Collapsed: 32 square, icon only, the label as hidden text + Tooltip.
// Sidebar Workspace / Sidebar User: 224 × 52 buttons (8 px padding, radius md) with Logo Mark or
// Avatar 32, title ui/label, description ui/caption muted, chevrons-up-down; collapsed 36 square.
// They open a menu: pass them as the trigger of a DropdownMenu (or Org Switcher).
import * as React from 'react';
import { ChevronRight, ChevronsUpDown, Ellipsis, Plus } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar, type AvatarProps } from './avatar';
import { BadgeCount } from './badge-count';
import { ButtonIcon } from './button-icon';
import { LogoMark } from './logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export type SidebarVariant = 'sidebar' | 'floating' | 'inset';

const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false });
const useSidebar = () => React.useContext(SidebarContext);

export interface SidebarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Variant (one per product). */
  variant?: SidebarVariant;
  /** Figma Mode=collapsed: icons only. */
  collapsed?: boolean;
  /** Figma Header slot: Sidebar Workspace. */
  header?: React.ReactNode;
  /** Figma Content slot: Sidebar Groups. */
  children?: React.ReactNode;
  /** Figma Footer slot: Sidebar User. */
  footer?: React.ReactNode;
  /** Name of the nav landmark. */
  label?: string;
}

function Sidebar({ variant = 'sidebar', collapsed = false, header, children, footer, label = 'Main', className, ...props }: SidebarProps) {
  const ctx = React.useMemo(() => ({ collapsed }), [collapsed]);
  const panel = (
    <div
      data-slot="sidebar-panel"
      className={cn(
        'flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground',
        variant !== 'floating' && 'bg-transparent',
        variant === 'floating' && 'rounded-lg border border-sidebar-border shadow-sm',
      )}
    >
      {header ? <div data-slot="sidebar-header" className={cn('flex shrink-0 flex-col p-2', collapsed ? 'items-center' : 'px-4')}>{header}</div> : null}
      <nav aria-label={label} data-slot="sidebar-content" className={cn('flex min-h-0 flex-1 flex-col overflow-y-auto', collapsed ? 'items-center' : 'px-2')}>
        {children}
      </nav>
      {footer ? <div data-slot="sidebar-footer" className={cn('flex shrink-0 flex-col p-2', collapsed ? 'items-center' : 'px-4')}>{footer}</div> : null}
    </div>
  );
  return (
    <SidebarContext.Provider value={ctx}>
      <div
        data-slot="sidebar"
        data-variant={variant}
        data-state={collapsed ? 'collapsed' : 'expanded'}
        className={cn(
          'h-full shrink-0',
          variant !== 'floating' && 'bg-sidebar',
          variant === 'floating' ? 'p-2' : '',
          // The right border is an inset shadow so it takes no width: items stay 224 in a 256 sidebar.
          variant === 'sidebar' && 'shadow-[inset_-1px_0_0_var(--sidebar-border)]',
          collapsed ? (variant === 'floating' ? 'w-16' : 'w-12') : 'w-64 min-w-60',
          className,
        )}
        {...props}
      >
        {panel}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SidebarGroupLabelProps extends React.ComponentProps<'div'> {
  /** Figma Show action: the group action ("Add project"). */
  action?: { label: string; onClick?: () => void; icon?: React.ReactNode };
}

/** Figma Sidebar Group Label: 32 high, ui/label-small muted; optional add action. */
function SidebarGroupLabel({ action, className, children, ...props }: SidebarGroupLabelProps) {
  return (
    <div data-slot="sidebar-group-label" className={cn('flex h-8 min-w-0 items-center gap-2 px-2', className)} {...props}>
      <span className="min-w-0 flex-1 truncate text-xs leading-4 font-medium text-muted-foreground">{children}</span>
      {action ? <ButtonIcon variant="ghost" size="xs" icon={action.icon ?? <Plus />} label={action.label} onClick={action.onClick} /> : null}
    </div>
  );
}

export interface SidebarGroupProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Show label: the group label text. Hidden when collapsed (it still names the group). */
  label?: string;
  /** Figma Group Label Show action. */
  action?: SidebarGroupLabelProps['action'];
}

/** Figma Sidebar Group: optional label + the Items slot (SidebarItems). */
function SidebarGroup({ label, action, className, children, ...props }: SidebarGroupProps) {
  const { collapsed } = useSidebar();
  const id = React.useId();
  return (
    <div data-slot="sidebar-group" role="group" aria-labelledby={label ? `${id}-label` : undefined} className={cn('flex w-full flex-col p-2', collapsed && 'items-center', className)} {...props}>
      {label ? (
        collapsed ? <span id={`${id}-label`} className="sr-only">{label}</span> : <SidebarGroupLabel id={`${id}-label`} action={action}>{label}</SidebarGroupLabel>
      ) : null}
      <ul data-slot="sidebar-group-items" className={cn('m-0 flex list-none flex-col gap-1 p-0', !collapsed && 'w-full')}>
        {children}
      </ul>
    </div>
  );
}

export interface SidebarItemProps extends Omit<React.ComponentProps<'a'>, 'children'> {
  /** Figma Label. */
  label: string;
  /** Figma Icon: a 16 px icon from `@/components/icons`. Level 2 items have none. */
  icon?: React.ReactNode;
  /** Figma State=active: the current page (one per sidebar). */
  active?: boolean;
  /** Figma State=disabled. */
  disabled?: boolean;
  /** Figma Show badge: something to act on (unread, pending). */
  badge?: number;
  /** Name read with the badge: "12 open". Default "<count> new". */
  badgeLabel?: (count: number) => string;
  /** Figma Show chevron: a section with sub-pages. Turns down while `expanded`. */
  chevron?: boolean;
  expanded?: boolean;
  /** Figma Level=2: a sub-page row under an expanded parent. */
  level?: 1 | 2;
  /** Figma Show action: the item menu trigger ("More actions for …"). Pass a ButtonIcon or a DropdownMenuTrigger around one. */
  action?: React.ReactNode;
}

const itemClass =
  'group/item-link flex h-8 min-w-0 items-center gap-2 rounded-md text-sm leading-5 text-sidebar-foreground no-underline outline-none transition-colors duration-[var(--duration-fast)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--sidebar),0_0_0_4px_var(--sidebar-ring)] aria-[current=page]:bg-sidebar-accent aria-[current=page]:font-medium aria-[current=page]:text-sidebar-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0';

/** Figma Sidebar Item: a link row (shadcn SidebarMenuButton), with an optional action after it. */
function SidebarItem({ label, icon, active, disabled, badge, badgeLabel = n => `${n} new`, chevron, expanded, level = 1, action, href, className, ...props }: SidebarItemProps) {
  const { collapsed } = useSidebar();
  const link = (
    <a
      data-slot="sidebar-item"
      data-level={level}
      href={disabled ? undefined : href}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      className={cn(itemClass, collapsed ? 'size-8 justify-center px-0' : cn('w-full pr-2', level === 2 ? 'pl-8' : 'pl-2', action && 'pr-9'), className)}
      {...props}
    >
      {level === 1 ? icon : null}
      {collapsed ? (
        <span className="sr-only">{label}</span>
      ) : (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {badge != null && badge > 0 ? <BadgeCount variant="secondary" count={badge} label={badgeLabel(badge)} /> : null}
          {chevron ? <ChevronRight aria-hidden="true" className={cn('transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', expanded && 'rotate-90')} /> : null}
        </>
      )}
    </a>
  );
  return (
    <li data-slot="sidebar-menu-item" data-active={active || undefined} className="group/menu-item relative m-0 list-none">
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        link
      )}
      {action && !collapsed ? (
        <div
          data-slot="sidebar-item-action"
          className="absolute top-0.5 right-0.5 opacity-0 transition-opacity group-hover/menu-item:opacity-100 group-data-[active]/menu-item:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100"
        >
          {action}
        </div>
      ) : null}
    </li>
  );
}

/** The item action button: ghost xs ellipsis, named after the item. */
function SidebarItemAction({ label, ...props }: Omit<React.ComponentProps<typeof ButtonIcon>, 'icon' | 'variant' | 'size'>) {
  return <ButtonIcon variant="ghost" size="xs" icon={<Ellipsis />} label={label} {...props} />;
}

interface SidebarSwitchProps extends Omit<React.ComponentProps<'button'>, 'title'> {
  title: string;
  description?: string;
}

const switchClass =
  'flex min-w-0 items-center gap-2 rounded-md text-left text-sidebar-foreground outline-none transition-colors duration-[var(--duration-fast)] hover:bg-sidebar-accent focus-visible:shadow-[0_0_0_2px_var(--sidebar),0_0_0_4px_var(--sidebar-ring)] data-[state=open]:bg-sidebar-accent';

function SwitchText({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm leading-5 font-medium">{title}</span>
        {description ? <span className="truncate text-xs leading-4 text-muted-foreground">{description}</span> : null}
      </span>
      <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0" />
    </>
  );
}

export interface SidebarWorkspaceProps extends SidebarSwitchProps {
  /** The workspace symbol for the Logo Mark (inline SVG). */
  mark?: React.ReactNode;
}

/** Figma Sidebar Workspace: the organization switcher button (header). */
function SidebarWorkspace({ title, description, mark, className, ref, ...props }: SidebarWorkspaceProps) {
  const { collapsed } = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      data-slot="sidebar-workspace"
      className={cn(switchClass, collapsed ? 'size-9 justify-center p-0.5' : 'w-full p-2', className)}
      {...props}
    >
      <LogoMark>{mark}</LogoMark>
      {collapsed ? <span className="sr-only">{title}</span> : <SwitchText title={title} description={description} />}
    </button>
  );
}

export interface SidebarUserProps extends SidebarSwitchProps {
  avatar?: Omit<AvatarProps, 'size'>;
}

/** Figma Sidebar User: the signed-in user button (footer), opens Settings and Log out. */
function SidebarUser({ title, description, avatar, className, ref, ...props }: SidebarUserProps) {
  const { collapsed } = useSidebar();
  const initials = title.split(/\s+/).slice(0, 2).map(p => p[0]?.toLocaleUpperCase()).join('');
  return (
    <button
      ref={ref}
      type="button"
      data-slot="sidebar-user"
      className={cn(switchClass, collapsed ? 'size-9 justify-center p-0.5' : 'w-full p-2', className)}
      {...props}
    >
      <Avatar initials={initials} {...avatar} aria-hidden="true" />
      {collapsed ? <span className="sr-only">{title}</span> : <SwitchText title={title} description={description} />}
    </button>
  );
}

export { Sidebar, SidebarContext, SidebarGroup, SidebarGroupLabel, SidebarItem, SidebarItemAction, SidebarWorkspace, SidebarUser, useSidebar };
