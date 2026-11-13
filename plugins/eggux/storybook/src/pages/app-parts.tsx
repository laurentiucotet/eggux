// Shared shell of the app pages (platform and back office). From 1024 px: a Sidebar on the left, a Top
// Bar with the breadcrumb and global actions, the page under it. Below 1024 px the Sidebar is replaced
// by a Mobile Header (menu, page title, notifications) and a Bottom Nav with the four daily
// destinations, so every app page also shows at phone width. Only one of the two shells is in the
// accessibility tree at a time (the other is display: none).
import * as React from 'react';
import { Bell, Building, Receipt, House, Settings, Users } from '@/components/icons';
import { Avatar } from '@/components/ui/avatar';
import { BottomNav, BottomNavItem } from '@/components/ui/bottom-nav';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ButtonIcon } from '@/components/ui/button-icon';
import { MobileHeader } from '@/components/ui/mobile-header';
import { Sidebar, SidebarGroup, SidebarItem, SidebarUser, SidebarWorkspace } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TopBar } from '@/components/ui/top-bar';

export interface Destination {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const destinations: Destination[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <House /> },
  { id: 'invoices', label: 'Invoices', icon: <Receipt />, badge: 3 },
  { id: 'customers', label: 'Customers', icon: <Users /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> },
];

export interface AppShellProps {
  /** The current destination id (one of `destinations`). */
  active: string;
  /** Page name for the phone header and the last crumb. */
  title: string;
  /** Crumbs before the page title, e.g. [{ label: 'Customers', href: '#customers' }]. */
  trail?: { label: string; href?: string }[];
  children: React.ReactNode;
}

/** Sidebar + Top Bar from 1024 px, Mobile Header + Bottom Nav below. */
export function AppShell({ active, title, trail = [], children }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const crumbs = [{ label: 'Home', href: '#dashboard' }, ...trail, { label: title }];
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen bg-background text-foreground">
        <div className={`hidden shrink-0 border-r border-sidebar-border bg-sidebar lg:block ${collapsed ? 'w-16' : 'w-60'}`}>
          <div className="sticky top-0 h-screen">
            <Sidebar
              collapsed={collapsed}
              header={<SidebarWorkspace title="Acme Inc." description="Pro plan" mark={<Building aria-hidden="true" />} />}
              footer={<SidebarUser title="Daniel Pop" description="daniel@acme.com" />}
            >
              <SidebarGroup label="Workspace">
                {destinations.map(d => (
                  <SidebarItem key={d.id} href={`#${d.id}`} icon={d.icon} label={d.label} active={d.id === active} badge={d.badge} />
                ))}
              </SidebarGroup>
            </Sidebar>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="hidden lg:block">
            <TopBar
              onToggleSidebar={() => setCollapsed(c => !c)}
              sidebarOpen={!collapsed}
              breadcrumb={<Breadcrumb items={crumbs} />}
              actions={
                <>
                  <ButtonIcon variant="ghost" icon={<Bell />} label="Notifications" />
                  <Avatar initials="DP" aria-label="Daniel Pop" role="img" size="sm" />
                </>
              }
            />
          </div>
          <div className="lg:hidden">
            <MobileHeader
              type="app"
              title={title}
              titleAs="p"
              trailing={<ButtonIcon variant="ghost" icon={<Bell />} label="Notifications" className="min-h-11 min-w-11" showTooltip={false} />}
            />
          </div>
          <main className="min-w-0 flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-8">{children}</main>
          <div className="sticky bottom-0 z-20 lg:hidden">
            <BottomNav>
              {destinations.map(d => (
                <BottomNavItem key={d.id} href={`#${d.id}`} icon={d.icon} label={d.label} active={d.id === active} badge={d.badge} />
              ))}
            </BottomNav>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
