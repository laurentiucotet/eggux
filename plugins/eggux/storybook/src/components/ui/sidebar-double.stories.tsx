import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Calendar, ChartColumn, FileText, House, Inbox, Plus, Settings, Users } from '@/components/icons';
import { ButtonIcon } from './button-icon';
import { SidebarGroup, SidebarItem, SidebarUser, SidebarWorkspace } from './sidebar';
import { SidebarDouble } from './sidebar-double';

const onAdd = fn();
const rail = (
  <>
    <SidebarItem href="#home" icon={<House />} label="Home" />
    <SidebarItem href="#projects" icon={<Calendar />} label="Projects" active />
    <SidebarItem href="#customers" icon={<Users />} label="Customers" />
    <SidebarItem href="#invoices" icon={<FileText />} label="Invoices" />
    <SidebarItem href="#reports" icon={<ChartColumn />} label="Reports" />
    <SidebarItem href="#settings" icon={<Settings />} label="Settings" />
  </>
);

const meta = {
  title: 'Components/Sidebar/Sidebar Double',
  component: SidebarDouble,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Two-level app navigation: an icon rail for sections and a panel with the pages of the active section (title, one or two section actions, Sidebar Groups). Collapsed shows the rail only. Use it when sections have 5+ pages each; one level fits in Sidebar. Two nav landmarks ("Sections" and the section name), one active rail item and one active page. Figma: Sidebar page / Sidebar Double. Guide: eggux build-ui/components/sidebar.md' } },
  },
  args: {
    rail,
    railHeader: <SidebarWorkspace title="Acme Inc." />,
    railFooter: <SidebarUser title="Daniel Pop" />,
    panelTitle: 'Projects',
    panelActions: <ButtonIcon variant="ghost" icon={<Plus />} label="New project" onClick={onAdd} />,
    children: (
      <>
        <SidebarGroup label="Active">
          <SidebarItem href="#web" icon={<FileText />} label="Website redesign" active />
          <SidebarItem href="#mobile" icon={<FileText />} label="Mobile app" />
          <SidebarItem href="#billing" icon={<FileText />} label="Billing migration" />
        </SidebarGroup>
        <SidebarGroup label="Archived">
          <SidebarItem href="#brand" icon={<Inbox />} label="Brand refresh 2025" />
        </SidebarGroup>
      </>
    ),
  },
  render: args => <div className="h-[720px]"><SidebarDouble {...args} /></div>,
} satisfies Meta<typeof SidebarDouble>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Mode=expanded: 288 (rail 48 + panel 240), panel header 52, two navs, one active in each.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="sidebar-double"]')!;
    await expect(Math.round(box(root).width)).toBe(288);
    const sections = canvas.getByRole('navigation', { name: 'Sections' });
    const pages = canvas.getByRole('navigation', { name: 'Projects' });
    await expect(within(sections).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
    await expect(within(pages).getByRole('link', { name: 'Website redesign' })).toHaveAttribute('aria-current', 'page');
    await expect(Math.round(box(within(sections).getByRole('link', { name: 'Home' })).width)).toBe(32);
    const header = canvasElement.querySelector('[data-slot="sidebar-double-header"]')!;
    await expect(Math.round(box(header).height)).toBe(52);
    await expect(Math.round(box(within(pages).getByRole('link', { name: 'Website redesign' })).width)).toBe(223);
    await userEvent.click(canvas.getByRole('button', { name: 'New project' }));
    await expect(onAdd).toHaveBeenCalled();
    // Up / Down move between the rail items.
    within(sections).getByRole('link', { name: 'Home' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(within(sections).getByRole('link', { name: 'Projects' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(within(sections).getByRole('link', { name: 'Settings' })).toHaveFocus();
  },
};

// Figma Mode=collapsed: the rail only, 48 wide.
export const Collapsed: Story = {
  args: { collapsed: true },
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="sidebar-double"]')!).width)).toBe(48);
    await expect(canvas.queryByRole('navigation', { name: 'Projects' })).toBeNull();
    await expect(canvas.getByRole('button', { name: 'Acme Inc.' })).toBeInTheDocument();
  },
};

// Stress: a long section title truncates, 40 pages scroll in the panel. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: {
    panelTitle: 'Customer success and onboarding programs',
    children: <SidebarGroup label="Pages">{Array.from({ length: 40 }, (_, i) => <SidebarItem key={i} href={`#p${i}`} icon={<FileText />} label={`Page ${i + 1}`} />)}</SidebarGroup>,
  },
  play: async ({ canvas }) => {
    const title = canvas.getByRole('heading', { name: /Customer success/ });
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    const nav = canvas.getByRole('navigation', { name: /Customer success/ });
    await expect(nav.scrollHeight).toBeGreaterThan(nav.clientHeight);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
