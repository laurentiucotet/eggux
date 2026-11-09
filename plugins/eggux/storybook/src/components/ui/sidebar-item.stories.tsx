import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Calendar, FileText, House, LayoutGrid, Users } from '@/components/icons';
import { Sidebar, SidebarGroup, SidebarItem, SidebarItemAction } from './sidebar';

const meta = {
  title: 'Components/Sidebar/Sidebar Item',
  component: SidebarItem,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One row of the Sidebar (shadcn SidebarMenuButton): icon, label, optional Badge Count (something to act on) and Chevron (a section with sub-pages). Active = the current page, aria-current="page", one per sidebar. Level 2 is a sub-page row without icon. Show action adds an ellipsis button after the link, on hover, focus and the active item. Collapsed: icon only with the label as name and tooltip. Sidebar Group holds the items under a Group Label (optional add action). Figma: Sidebar page / Sidebar Item, Sidebar Group, Sidebar Group Label. Guide: eggux build-ui/components/sidebar.md' } },
  },
  args: { label: 'Dashboard', href: '#dashboard', icon: <House /> },
  render: args => (
    <div className="h-auto w-64"><Sidebar label="Main"><SidebarGroup label="Workspace"><SidebarItem {...args} /></SidebarGroup></Sidebar></div>
  ),
} satisfies Meta<typeof SidebarItem>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Level=1 states in one group: default, active (accent, medium, aria-current), disabled,
// badge, chevron; 224 × 32, 8 px sides, 8 gap, items 4 apart; group label 32 high.
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-64">
      <Sidebar label="Main">
        <SidebarGroup label="Workspace">
          <SidebarItem href="#dashboard" icon={<House />} label="Dashboard" active />
          <SidebarItem href="#projects" icon={<Calendar />} label="Projects" badge={12} badgeLabel={n => `${n} open`} />
          <SidebarItem href="#customers" icon={<Users />} label="Customers" chevron />
          <SidebarItem href="#invoices" icon={<FileText />} label="Invoices" disabled />
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvas }) => {
    const dashboard = canvas.getByRole('link', { name: 'Dashboard' });
    await expect(dashboard).toHaveAttribute('aria-current', 'page');
    await expect([Math.round(box(dashboard).width), Math.round(box(dashboard).height)]).toEqual([224, 32]);
    const s = getComputedStyle(dashboard);
    await expect([s.paddingLeft, s.columnGap, s.fontWeight]).toEqual(['8px', '8px', '500']);
    await expect(getComputedStyle(canvas.getByRole('link', { name: /^Projects/ })).fontWeight).toBe('400');
    await expect(canvas.getByRole('link', { name: 'Projects 12 open' })).toBeInTheDocument();
    const projects = canvas.getByRole('link', { name: /^Projects/ });
    await expect(Math.round(box(projects).top - box(dashboard).bottom)).toBe(4);
    const invoices = canvas.getByText('Invoices').closest('a')!;
    await expect(invoices).toHaveAttribute('aria-disabled', 'true');
    await expect(invoices).not.toHaveAttribute('href');
    const group = canvas.getByRole('group', { name: 'Workspace' });
    await expect(Math.round(box(group.querySelector('[data-slot="sidebar-group-label"]')!).height)).toBe(32);
  },
};

// Figma Level=2: sub-pages under an expanded parent with a chevron, label aligned with the parent's.
export const SubPages: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-64">
      <Sidebar label="Main">
        <SidebarGroup label="Settings">
          <SidebarItem href="#settings" icon={<LayoutGrid />} label="Settings" chevron expanded />
          <SidebarItem href="#general" label="General" level={2} />
          <SidebarItem href="#members" label="Members" level={2} active />
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvas }) => {
    const parentLabel = canvas.getByText('Settings', { selector: 'a span' });
    const child = canvas.getByText('General');
    await expect(Math.round(box(child).left)).toBe(Math.round(box(parentLabel).left));
    await expect(canvas.getByRole('link', { name: 'General' }).querySelector('svg')).toBeNull();
    await expect(canvas.getByRole('link', { name: 'Members' })).toHaveAttribute('aria-current', 'page');
  },
};

// Figma Show action on the label and on items: add to the group, more actions per item.
const onAdd = fn();
const onMore = fn();
export const Actions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-64">
      <Sidebar label="Main">
        <SidebarGroup label="Projects" action={{ label: 'Add project', onClick: onAdd }}>
          <SidebarItem href="#web" icon={<LayoutGrid />} label="Website redesign" active action={<SidebarItemAction label="More actions for Website redesign" onClick={onMore} />} />
          <SidebarItem href="#mobile" icon={<LayoutGrid />} label="Mobile app" action={<SidebarItemAction label="More actions for Mobile app" />} />
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add project' }));
    await expect(onAdd).toHaveBeenCalled();
    const more = canvas.getByRole('button', { name: 'More actions for Website redesign' });
    await expect(Math.round(box(more).width)).toBe(28);
    // On the active item the action shows at rest; on others it waits for hover or focus.
    await expect(getComputedStyle(more.closest('[data-slot="sidebar-item-action"]')!).opacity).toBe('1');
    const other = canvas.getByRole('button', { name: 'More actions for Mobile app' });
    await expect(getComputedStyle(other.closest('[data-slot="sidebar-item-action"]')!).opacity).toBe('0');
    other.focus();
    await expect(getComputedStyle(other.closest('[data-slot="sidebar-item-action"]')!).opacity).toBe('1');
    // The action is a separate button after the link, in Tab order.
    canvas.getByRole('link', { name: 'Website redesign' }).focus();
    await userEvent.tab();
    await expect(more).toHaveFocus();
    await userEvent.click(more);
    await expect(onMore).toHaveBeenCalled();
  },
};

// Figma Mode=collapsed: 32 square, icon only, the label is the name and the tooltip.
export const Collapsed: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="h-auto">
      <Sidebar label="Main" collapsed>
        <SidebarGroup label="Workspace">
          <SidebarItem href="#dashboard" icon={<House />} label="Dashboard" active />
          <SidebarItem href="#projects" icon={<Calendar />} label="Projects" badge={3} />
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvas }) => {
    const dashboard = canvas.getByRole('link', { name: 'Dashboard' });
    await expect([Math.round(box(dashboard).width), Math.round(box(dashboard).height)]).toEqual([32, 32]);
    await expect(dashboard.querySelector('.truncate')).toBeNull();
    await expect(canvas.getByRole('group', { name: 'Workspace' })).toBeInTheDocument();
    dashboard.focus();
    await expect(await within(document.body).findByRole('tooltip')).toHaveTextContent('Dashboard');
  },
};

// Stress: a long label truncates on one line at the 240 minimum, the badge keeps its place. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="w-60">
      <Sidebar label="Main" className="w-60 min-w-60">
        <SidebarGroup label="A very long group label that does not fit in the sidebar">
          <SidebarItem href="#long" icon={<FileText />} label="Quarterly revenue reconciliation for every subsidiary" badge={128} />
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link');
    await expect(Math.round(box(link).height)).toBe(32);
    const text = link.querySelector('span')!;
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
    await expect(within(link).getByText('99+')).toBeInTheDocument();
  },
};

export const StatesDark: Story = { ...States, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StatesCorporate: Story = { ...States, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
