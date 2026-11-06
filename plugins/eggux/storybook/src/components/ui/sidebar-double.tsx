// EGG UI Sidebar Double. Figma: Sidebar Double (Sidebar page, "Sidebar Double / Component", 351:5350).
// Mode (expanded, collapsed), Panel title; slots Rail header, Rail, Rail footer, Panel actions, Panel.
// Two-level navigation: an icon rail (48) for sections and a panel (240) for the pages of the
// active section. 288 × full height, sidebar/background, right border. Rail: header (Sidebar
// Workspace collapsed), Sidebar Items collapsed 4 apart with 8 px padding, footer (Sidebar User
// collapsed). Panel: left border, header 52 high (16 / 8 px sides) with the title (ui/label, the
// rail item's name, truncates) and one or two section actions, then Sidebar Groups. Collapsed shows
// the rail only. Two nav landmarks: "Sections" and the section name; one active rail item and one
// active panel item (aria-current); Up / Down arrows move between the rail items.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { SidebarContext } from './sidebar';

export interface SidebarDoubleProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Mode=collapsed: the rail only. */
  collapsed?: boolean;
  /** Figma Rail header slot: a SidebarWorkspace. */
  railHeader?: React.ReactNode;
  /** Figma Rail slot: SidebarItems, one per section (they render collapsed). */
  rail: React.ReactNode;
  /** Figma Rail footer slot: a SidebarUser. */
  railFooter?: React.ReactNode;
  railLabel?: string;
  /** Figma Panel title: the active section's name. */
  panelTitle: string;
  /** Figma Panel actions slot: one or two section ButtonIcons. */
  panelActions?: React.ReactNode;
  /** Figma Panel slot: SidebarGroups of the section's pages. */
  children?: React.ReactNode;
}

const collapsedCtx = { collapsed: true };
const expandedCtx = { collapsed: false };

function SidebarDouble({ collapsed = false, railHeader, rail, railFooter, railLabel = 'Sections', panelTitle, panelActions, className, children, ...props }: SidebarDoubleProps) {
  const titleId = React.useId();
  // Up / Down move between the rail links, like a toolbar of sections.
  const onRailKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)'));
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    links[(i + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length]?.focus();
  };
  return (
    <div
      data-slot="sidebar-double"
      data-state={collapsed ? 'collapsed' : 'expanded'}
      className={cn('flex h-full shrink-0 bg-sidebar text-sidebar-foreground shadow-[inset_-1px_0_0_var(--sidebar-border)]', collapsed ? 'w-12' : 'w-72 min-w-72', className)}
      {...props}
    >
      <SidebarContext.Provider value={collapsedCtx}>
        <div data-slot="sidebar-double-rail" className="flex h-full w-12 shrink-0 flex-col items-center">
          {railHeader ? <div className="flex w-full flex-col items-center p-2">{railHeader}</div> : null}
          <nav aria-label={railLabel} onKeyDown={onRailKeyDown} className="flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto p-2">
            <ul className="m-0 flex list-none flex-col gap-1 p-0">{rail}</ul>
          </nav>
          {railFooter ? <div className="flex w-full flex-col items-center p-2">{railFooter}</div> : null}
        </div>
      </SidebarContext.Provider>
      {collapsed ? null : (
        <SidebarContext.Provider value={expandedCtx}>
          <div data-slot="sidebar-double-panel" className="flex h-full min-w-0 flex-1 flex-col border-l border-sidebar-border">
            <div data-slot="sidebar-double-header" className="flex h-13 shrink-0 items-center gap-1 py-2 pr-2 pl-4">
              <h2 id={titleId} title={panelTitle} className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-medium text-sidebar-foreground">{panelTitle}</h2>
              {panelActions ? <div className="flex shrink-0 items-center gap-1">{panelActions}</div> : null}
            </div>
            <nav aria-labelledby={titleId} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              {children}
            </nav>
          </div>
        </SidebarContext.Provider>
      )}
    </div>
  );
}

export { SidebarDouble };
