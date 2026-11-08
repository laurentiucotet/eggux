import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Calendar, ChartColumn, FileText, House, LogOut, Plus, Settings, Users } from '@/components/icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Sidebar, SidebarGroup, SidebarItem, SidebarUser, SidebarWorkspace, type SidebarVariant } from './sidebar';

const meta = {
  title: 'Components/Sidebar/Sidebar',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'App navigation (shadcn Sidebar on sidebar/* tokens): Sidebar Workspace in the header, Sidebar Groups of Sidebar Items, Sidebar User in the footer. Expanded 256 (min 240), collapsed 48 with icons and tooltips. Variant sidebar (right border), floating (inset panel with border and shadow, on a muted canvas) or inset (no border). One active item; on phones open it as a left Sheet. Default has every option in Controls: label and action are set on each Sidebar Group, icon, badge and disabled on each Sidebar Item; the switches turn them on for all. Figma: Sidebar page / Sidebar, Sidebar Workspace, Sidebar User. Guide: eggux build-ui/components/sidebar.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

type DemoOptions = {
  collapsed?: boolean;
  variant?: SidebarVariant;
  showHeader?: boolean;
  showFooter?: boolean;
  showGroupLabels?: boolean;
  showGroupAction?: boolean;
  showSecondGroup?: boolean;
  showIcons?: boolean;
  showBadges?: boolean;
  disableItem?: boolean;
};
type Playground = Required<DemoOptions> & { height: number };

function Demo({
  collapsed = false,
  variant = 'sidebar',
  showHeader = true,
  showFooter = true,
  showGroupLabels = true,
  showGroupAction = false,
  showSecondGroup = true,
  showIcons = true,
  showBadges = true,
  disableItem = false,
}: DemoOptions) {
  // Icons are required when collapsed (the rail shows only them).
  const icon = (el: React.ReactNode) => (showIcons || collapsed ? el : undefined);
  const groupLabel = (label: string) => (showGroupLabels ? label : undefined);
  return (
    <Sidebar
      variant={variant}
      collapsed={collapsed}
      header={
        showHeader ? <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarWorkspace title="Acme Inc." description="Pro plan" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Acme Inc.</DropdownMenuItem>
            <DropdownMenuItem>Northwind Traders</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> : undefined
      }
      footer={
        showFooter ? <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarUser title="Daniel Pop" description="daniel@acme.com" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuItem icon={<Settings aria-hidden="true" />}>Settings</DropdownMenuItem>
            <DropdownMenuItem icon={<LogOut aria-hidden="true" />}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> : undefined
      }
    >
      <SidebarGroup label={groupLabel('Workspace')} action={showGroupAction ? { label: 'Add project', icon: <Plus /> } : undefined}>
        <SidebarItem href="#dashboard" icon={icon(<House />)} label="Dashboard" active />
        <SidebarItem href="#projects" icon={icon(<Calendar />)} label="Projects" badge={showBadges ? 12 : undefined} badgeLabel={n => `${n} open`} />
        <SidebarItem href="#customers" icon={icon(<Users />)} label="Customers" badge={showBadges ? 3 : undefined} badgeLabel={n => `${n} new`} />
        <SidebarItem href="#invoices" icon={icon(<FileText />)} label="Invoices" disabled={disableItem} />
      </SidebarGroup>
      {showSecondGroup ? (
        <SidebarGroup label={groupLabel('Settings')}>
          <SidebarItem href="#team" icon={icon(<Users />)} label="Team" />
          <SidebarItem href="#billing" icon={icon(<ChartColumn />)} label="Billing" />
          <SidebarItem href="#settings" icon={icon(<Settings />)} label="Settings" />
        </SidebarGroup>
      ) : null}
    </Sidebar>
  );
}

// Figma Mode=expanded, Variant=sidebar: 256 × 720, header and footer 52 buttons, groups, one active item.
export const DefaultCheck: StoryObj<Playground> = {
  tags: ['!dev'],
  argTypes: {
    variant: { name: 'Variant', control: 'inline-radio', options: ['sidebar', 'floating', 'inset'], description: 'floating and inset sit on a muted canvas', table: { category: 'Sidebar' } },
    collapsed: { name: 'Collapsed', control: 'boolean', description: '48 wide: icons with tooltips', table: { category: 'Sidebar' } },
    showHeader: { name: 'Show workspace', control: 'boolean', description: '`header`: Sidebar Workspace', table: { category: 'Sidebar' } },
    showFooter: { name: 'Show user', control: 'boolean', description: '`footer`: Sidebar User', table: { category: 'Sidebar' } },
    height: { name: 'Height', control: { type: 'range', min: 320, max: 900, step: 10 }, description: 'Height of the page, in px', table: { category: 'Sidebar' } },
    showGroupLabels: { name: 'Show group labels', control: 'boolean', description: 'Sidebar Group `label`', table: { category: 'Sidebar Group' } },
    showGroupAction: { name: 'Show group action', control: 'boolean', description: 'Sidebar Group `action`: a + button on the label row (first group)', table: { category: 'Sidebar Group' } },
    showSecondGroup: { name: 'Show second group', control: 'boolean', table: { category: 'Sidebar Group' } },
    showIcons: { name: 'Show icons', control: 'boolean', description: 'Sidebar Item `icon` (always shown when collapsed)', table: { category: 'Sidebar Item' } },
    showBadges: { name: 'Show badges', control: 'boolean', description: 'Sidebar Item `badge` and `badgeLabel`', table: { category: 'Sidebar Item' } },
    disableItem: { name: 'Disable an item', control: 'boolean', description: 'Sidebar Item `disabled` (on Invoices)', table: { category: 'Sidebar Item' } },
  },
  args: { variant: 'sidebar', collapsed: false, showHeader: true, showFooter: true, height: 720, showGroupLabels: true, showGroupAction: false, showSecondGroup: true, showIcons: true, showBadges: true, disableItem: false },
  render: ({ height, ...options }) => (
    <div className={options.variant === 'sidebar' ? 'flex' : 'flex bg-muted'} style={{ height }}>
      {/* key: remount on Collapsed so tooltips and widths start fresh. */}
      <Demo key={String(options.collapsed)} {...options} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const sidebar = canvasElement.querySelector('[data-slot="sidebar"]')!;
    await expect([Math.round(box(sidebar).width), Math.round(box(sidebar).height)]).toEqual([256, 720]);
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(within(nav).getAllByRole('link', { current: 'page' })).toHaveLength(1);
    const workspace = canvas.getByRole('button', { name: /Acme Inc\./ });
    await expect([Math.round(box(workspace).width), Math.round(box(workspace).height)]).toEqual([224, 52]);
    const user = canvas.getByRole('button', { name: /Daniel Pop/ });
    await expect(Math.round(box(user).bottom)).toBe(Math.round(box(sidebar).bottom) - 8);
    // The user menu opens with Settings and Log out; Escape returns focus.
    await userEvent.click(user);
    await expect(await screen.findByRole('menuitem', { name: 'Log out' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(user).toHaveFocus());
  },
};
// Playground: no play function, so changing Controls never shows a failed test. The checks run in DefaultCheck.
export const Default: StoryObj<Playground> = { ...DefaultCheck, tags: [], play: undefined };

// Figma Mode=collapsed: 48 wide, logo mark, 32 icon items with tooltips, the avatar.
export const Collapsed: Story = {
  render: () => <div className="h-[720px]"><Demo collapsed /></div>,
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="sidebar"]')!).width)).toBe(48);
    const dashboard = canvas.getByRole('link', { name: 'Dashboard' });
    await expect(Math.round(box(dashboard).width)).toBe(32);
    await expect(canvas.getByRole('button', { name: 'Acme Inc.' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Daniel Pop' })).toBeInTheDocument();
  },
};

// Figma Variant=floating and inset beside a page: floating on the muted canvas, inset with the page as a card.
export const Variants: Story = {
  render: () => (
    <div className="flex h-[560px] gap-6 bg-muted p-6">
      <Demo variant="floating" />
      <div className="flex">
        <Demo variant="inset" />
        <main className="m-2 ml-0 flex-1 rounded-xl bg-background p-6 shadow-sm">
          <h2 className="m-0 text-lg font-semibold">Page</h2>
        </main>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [floating, inset] = canvasElement.querySelectorAll<HTMLElement>('[data-slot="sidebar"]');
    await expect(getComputedStyle(floating).paddingTop).toBe('8px');
    const panel = floating.querySelector('[data-slot="sidebar-panel"]')!;
    await expect(getComputedStyle(panel).borderTopWidth).toBe('1px');
    await expect(getComputedStyle(panel).boxShadow).not.toBe('none');
    await expect(getComputedStyle(inset).boxShadow).toBe('none');
  },
  parameters: { a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
};

// Keyboard: Tab goes header, items in order, footer.
export const Keyboard: Story = {
  tags: ['!dev'],
  render: () => <div className="h-[720px]"><Demo /></div>,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /Acme Inc\./ })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Dashboard' })).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: /Acme Inc\./ }));
    await expect(await screen.findByRole('menuitem', { name: 'Northwind Traders' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

// Stress: 30 items scroll inside the content, header and footer stay; long names truncate at 240. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="h-[480px]">
      <Sidebar
        className="w-60 min-w-60"
        header={<SidebarWorkspace title="Acme International Holdings Group" description="Enterprise plan, billed yearly" />}
        footer={<SidebarUser title="Alexandra-Maria Constantinescu" description="alexandra.constantinescu@acme-enterprise.com" />}
      >
        <SidebarGroup label="Projects">
          {Array.from({ length: 30 }, (_, i) => <SidebarItem key={i} href={`#p${i}`} icon={<FileText />} label={`Project ${i + 1}`} active={i === 0} />)}
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const content = canvasElement.querySelector<HTMLElement>('[data-slot="sidebar-content"]')!;
    await expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
    const user = canvas.getByRole('button', { name: /Alexandra-Maria/ });
    await expect(Math.round(box(user).height)).toBe(52);
    await expect(user.scrollWidth).toBeLessThanOrEqual(user.clientWidth + 1);
  },
};

// Group action and a disabled item on, labels off (axe in Light and Dark).
const options: DemoOptions = { showGroupAction: true, disableItem: true };
const optionsPlay: Story['play'] = async ({ canvas, canvasElement }) => {
  await expect(canvas.getByRole('button', { name: 'Add project' })).toBeVisible();
  await expect(canvasElement.querySelector('[aria-disabled="true"]')).toHaveTextContent('Invoices');
};
export const GroupActionAndDisabled: Story = { tags: ['!dev'], render: () => <div className="h-[720px]"><Demo {...options} /></div>, play: optionsPlay };
export const GroupActionAndDisabledDark: Story = { ...GroupActionAndDisabled, tags: ['!dev'], globals: { theme: 'Dark' } };

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <div className="h-[720px]"><Demo /></div> };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <div className="h-[720px]"><Demo /></div> };
