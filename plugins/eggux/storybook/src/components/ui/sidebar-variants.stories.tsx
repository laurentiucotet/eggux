import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Bell, Building, Calendar, ChartColumn, CreditCard, FileText, Folder, Globe, Hash, House, Inbox, KeyRound, MessageSquare, Palette, Plus, Settings, ShieldCheck, Sparkles, Star, User, Users, Zap } from '@/components/icons';
import { Avatar } from './avatar';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Progress } from './progress';
import { Sidebar, SidebarGroup, SidebarItem, SidebarUser, SidebarWorkspace } from './sidebar';
import { SidebarCard, SidebarCollapsibleGroup, SidebarRail, SidebarRailItem, SidebarSearch, SidebarSubmenu } from './sidebar-variants';

const meta = {
  title: 'Components/Sidebar/Sidebar types',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'More sidebar layouts built from Sidebar, Sidebar Group and Sidebar Item plus Sidebar Search, Sidebar Collapsible Group, Sidebar Submenu, Sidebar Card and Sidebar Rail: search and folding groups, nested pages, a usage card in the footer, an icon rail with a section sidebar, a settings nav, and a dark sidebar on a light app. Guide: eggux build-ui/components/sidebar.md' } },
    a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const header = <SidebarWorkspace title="Acme Inc." description="Pro plan" />;
const user = <SidebarUser title="Daniel Pop" description="daniel@acme.com" />;

function SearchAndGroups({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Sidebar
      collapsed={collapsed}
      header={
        <div className={collapsed ? 'flex flex-col items-center gap-2' : 'flex flex-col gap-2'}>
          {header}
          <SidebarSearch />
        </div>
      }
      footer={user}
    >
      <SidebarGroup>
        <SidebarItem href="#home" icon={<House />} label="Home" active />
        <SidebarItem href="#inbox" icon={<Inbox />} label="Inbox" badge={4} badgeLabel={(n) => `${n} unread`} />
        <SidebarItem href="#ai" icon={<Sparkles />} label="Ask AI" />
      </SidebarGroup>
      <SidebarCollapsibleGroup label="Favorites" action={collapsed ? null : <ButtonIcon variant="ghost" size="xs" icon={<Plus />} label="Add a favorite" />}>
        <SidebarItem href="#q4" icon={<Star />} label="Q4 planning" />
        <SidebarItem href="#brand" icon={<Star />} label="Brand refresh" />
      </SidebarCollapsibleGroup>
      <SidebarCollapsibleGroup label="Channels" defaultOpen={false}>
        <SidebarItem href="#general" icon={<Hash />} label="general" />
        <SidebarItem href="#design" icon={<Hash />} label="design" />
      </SidebarCollapsibleGroup>
    </Sidebar>
  );
}

export const SearchAndCollapsibleGroups: Story = {
  render: () => (
    <div className="flex h-[720px] gap-8 bg-muted">
      <SearchAndGroups />
      <SearchAndGroups collapsed />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [full] = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="sidebar"]'));
    const c = within(full!);
    const search = c.getByRole('button', { name: /Search/ });
    await expect(box(search).height).toBe(32);
    await expect(search).toHaveAttribute('aria-keyshortcuts', 'Meta+K');
    const channels = c.getByRole('button', { name: 'Channels' });
    await expect(channels).toHaveAttribute('aria-expanded', 'false');
    await expect(c.queryByRole('link', { name: 'general' })).toBeNull();
    await userEvent.click(channels);
    await expect(c.getByRole('link', { name: 'general' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Favorites' }));
    await expect(c.queryByRole('link', { name: 'Q4 planning' })).toBeNull();
    const collapsed = canvasElement.querySelectorAll<HTMLElement>('[data-slot="sidebar"]')[1]!;
    await expect(box(collapsed).width).toBe(48);
    await expect(within(collapsed).getByRole('button', { name: 'Search' })).toBeVisible();
  },
};

export const NestedPages: Story = {
  render: () => (
    <div className="h-[720px]">
      <Sidebar header={header} footer={user}>
        <SidebarGroup label="Workspace">
          <SidebarItem href="#dashboard" icon={<House />} label="Dashboard" />
          <SidebarSubmenu label="Projects" icon={<Folder />}>
            <SidebarItem level={2} href="#active" label="Active" active />
            <SidebarItem level={2} href="#archived" label="Archived" />
            <SidebarItem level={2} href="#templates" label="Templates" />
          </SidebarSubmenu>
          <SidebarSubmenu label="Reports" icon={<ChartColumn />}>
            <SidebarItem level={2} href="#revenue" label="Revenue" />
            <SidebarItem level={2} href="#cash" label="Cash flow" />
          </SidebarSubmenu>
          <SidebarItem href="#customers" icon={<Users />} label="Customers" />
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // The section with the current page is open; the others stay closed.
    await expect(c.getByRole('button', { name: 'Projects' })).toHaveAttribute('aria-expanded', 'true');
    await expect(c.getByRole('link', { name: 'Active' })).toHaveAttribute('aria-current', 'page');
    await expect(c.getByRole('button', { name: 'Reports' })).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(c.getByRole('button', { name: 'Reports' }));
    await expect(c.getByRole('link', { name: 'Cash flow' })).toBeVisible();
    await expect(box(c.getByRole('link', { name: 'Cash flow' })).height).toBe(32);
  },
};

function UsageCard() {
  return (
    <SidebarCard>
      <div className="flex flex-col gap-1">
        <p className="m-0 font-medium">Free plan</p>
        <p className="m-0 text-xs leading-4 text-muted-foreground">8 of 10 projects used</p>
      </div>
      <Progress value={80} aria-label="Projects used" />
      <Button size="sm" variant="soft" className="w-full">
        Upgrade to Pro
      </Button>
    </SidebarCard>
  );
}

export const WithUsageCard: Story = {
  render: () => (
    <div className="flex h-[720px] gap-8 bg-muted">
      <Sidebar
        variant="floating"
        header={header}
        footer={
          <div className="flex flex-col gap-2">
            <UsageCard />
            {user}
          </div>
        }
      >
        <SidebarGroup label="Workspace">
          <SidebarItem href="#dashboard" icon={<House />} label="Dashboard" active />
          <SidebarItem href="#projects" icon={<Folder />} label="Projects" />
          <SidebarItem href="#calendar" icon={<Calendar />} label="Calendar" />
        </SidebarGroup>
      </Sidebar>
      <Sidebar variant="floating" collapsed header={header} footer={<div className="flex flex-col items-center gap-2"><UsageCard />{user}</div>}>
        <SidebarGroup>
          <SidebarItem href="#dashboard" icon={<House />} label="Dashboard" active />
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll('[data-slot="sidebar-card"]');
    await expect(cards).toHaveLength(1);
    await expect(within(cards[0] as HTMLElement).getByRole('progressbar', { name: 'Projects used' })).toBeVisible();
  },
};

export const IconRail: Story = {
  render: () => (
    <div className="flex h-[720px]">
      <SidebarRail label="Apps" footer={<><SidebarRailItem href="#settings" icon={<Settings />} label="Settings" /><li className="mt-2 list-none"><Avatar initials="DP" name="Daniel Pop" /></li></>}>
        <SidebarRailItem href="#home" icon={<House />} label="Home" active />
        <SidebarRailItem href="#inbox" icon={<Inbox />} label="Inbox" badge="3 unread" />
        <SidebarRailItem href="#chat" icon={<MessageSquare />} label="Chat" />
        <SidebarRailItem href="#files" icon={<FileText />} label="Files" />
        <SidebarRailItem href="#activity" icon={<Bell />} label="Activity" />
      </SidebarRail>
      <Sidebar variant="inset" label="Home" header={<p className="m-0 px-2 pt-2 text-lg leading-7 font-semibold">Home</p>}>
        <SidebarGroup>
          <SidebarItem href="#overview" icon={<House />} label="Overview" active />
          <SidebarItem href="#tasks" icon={<Zap />} label="My tasks" badge={6} badgeLabel={(n) => `${n} due`} />
          <SidebarItem href="#starred" icon={<Star />} label="Starred" />
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const rail = canvasElement.querySelector('[data-slot="sidebar-rail"]')!;
    await expect(box(rail).width).toBe(72);
    const home = c.getByRole('link', { name: 'Home' });
    await expect(box(home).width).toBe(56);
    await expect(home).toHaveAttribute('aria-current', 'page');
    await expect(c.getByRole('link', { name: /Inbox.*3 unread/ })).toBeVisible();
    await expect(c.getByRole('navigation', { name: 'Apps' })).toBeVisible();
  },
};

export const SettingsNav: Story = {
  render: () => (
    <div className="flex h-[720px] bg-background">
      <Sidebar variant="inset" label="Settings" header={<p className="m-0 px-2 pt-2 text-lg leading-7 font-semibold">Settings</p>}>
        <SidebarGroup label="Account">
          <SidebarItem href="#profile" icon={<User />} label="Profile" active />
          <SidebarItem href="#notifications" icon={<Bell />} label="Notifications" />
          <SidebarItem href="#appearance" icon={<Palette />} label="Appearance" />
        </SidebarGroup>
        <SidebarGroup label="Workspace">
          <SidebarItem href="#general" icon={<Building />} label="General" />
          <SidebarItem href="#members" icon={<Users />} label="Members" badge={2} badgeLabel={(n) => `${n} pending invites`} />
          <SidebarItem href="#billing" icon={<CreditCard />} label="Billing" />
          <SidebarItem href="#domains" icon={<Globe />} label="Domains" />
        </SidebarGroup>
        <SidebarGroup label="Security">
          <SidebarItem href="#security" icon={<ShieldCheck />} label="Sign-in and security" />
          <SidebarItem href="#api" icon={<KeyRound />} label="API keys" />
          <SidebarItem href="#sso" icon={<ShieldCheck />} label="Single sign-on" disabled />
        </SidebarGroup>
      </Sidebar>
      <div className="flex-1 border-l border-border p-8 text-sm text-muted-foreground">Profile settings</div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getAllByRole('group')).toHaveLength(3);
    await expect(c.getByRole('link', { name: /Members/ })).toHaveAccessibleName(/2 pending invites/);
    await expect(c.getByText('Single sign-on').closest('a')).toHaveAttribute('aria-disabled', 'true');
  },
};

export const DarkOnLight: Story = {
  render: () => (
    <div className="flex h-[720px] bg-background">
      {/* The dark theme tokens apply to the sidebar only. */}
      <div className="dark h-full">
        <SearchAndGroups />
      </div>
      <div className="flex-1 p-8 text-sm text-muted-foreground">Page</div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const sb = canvasElement.querySelector('[data-slot="sidebar"]')!;
    const page = canvasElement.querySelector('.flex-1')!;
    await expect(getComputedStyle(sb).backgroundColor).not.toBe(getComputedStyle(page.parentElement!).backgroundColor);
  },
};

export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex h-[720px] gap-8">
      <Sidebar header={header}>
        <SidebarCollapsibleGroup label="A very long group label that has to truncate in the row">
          <SidebarSubmenu label="A section with a long name that truncates" icon={<Folder />} defaultOpen>
            <SidebarItem level={2} href="#a" label="A page with an extremely long title that truncates" />
          </SidebarSubmenu>
        </SidebarCollapsibleGroup>
      </Sidebar>
      <SidebarRail>
        <SidebarRailItem href="#x" icon={<Inbox />} label="Notifications" />
      </SidebarRail>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const el of Array.from(canvasElement.querySelectorAll('[data-slot="sidebar-content"], [data-slot="sidebar-rail"]'))) {
      await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth + 1);
    }
  },
};

export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <div className="flex h-[720px] gap-8"><SearchAndGroups /><SearchAndGroups collapsed /></div> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <div className="flex h-[720px] gap-8"><SearchAndGroups /></div> };
