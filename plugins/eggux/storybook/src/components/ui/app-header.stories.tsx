import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Bell, Search } from '@/components/icons';
import { AppHeader } from './app-header';
import { Avatar } from './avatar';
import { ButtonIcon } from './button-icon';
import { NavLink } from './nav-link';

const links = (
  <>
    <NavLink href="#dashboard" active aria-current="page">Dashboard</NavLink>
    <NavLink href="#invoices">Invoices</NavLink>
    <NavLink href="#customers">Customers</NavLink>
    <NavLink href="#reports">Reports</NavLink>
  </>
);
const actions = (
  <>
    <ButtonIcon variant="ghost" icon={<Bell />} label="Notifications" />
    <Avatar initials="DP" role="img" aria-label="Dana Pop" />
  </>
);

const meta = {
  title: 'Components/Navigation/App Header',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Top navigation for apps without a sidebar (client portals, simple admin) with 3 to 6 destinations: logo home, Nav Links (the current page active), a 256 search field and global actions. 64 high with a bottom border. Needs 768; under 1024 drop the search field for a search icon button; under 768 use Mobile Header. More destinations: Sidebar and Top Bar. Figma: Navigation page / App Header. Guide: eggux build-ui/components/navigation.md' } },
  },
  args: { links, actions, search: { placeholder: 'Search Acme', label: 'Search Acme' }, homeHref: '#home' },
  decorators: [Story => <div className="w-[1440px] max-w-full"><Story /></div>],
} satisfies Meta<typeof AppHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma default: 64 high, 24 px sides and gaps; logo, links filling the middle, search 256, actions.
export const Default: Story = {
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner');
    await expect(Math.round(box(header).height)).toBe(64);
    const s = getComputedStyle(header);
    await expect([s.paddingLeft, s.columnGap, s.borderBottomWidth]).toEqual(['24px', '24px', '1px']);
    await expect(canvas.getByRole('link', { name: 'Acme' })).toHaveAttribute('href', '#home');
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(canvas.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    const search = canvas.getByRole('searchbox', { name: 'Search Acme' });
    const field = search.closest('[data-slot="search-field"]') ?? search.parentElement!;
    await expect(Math.round(box(field).width)).toBe(256);
    await expect(box(nav).right).toBeLessThanOrEqual(box(field).left);
    // Tab order: logo, links, search, actions.
    canvas.getByRole('link', { name: 'Acme' }).focus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Dashboard' })).toHaveFocus();
  },
};

// Under 1024: Show search off, search as a Button Icon in Actions.
export const Compact: Story = {
  args: {
    search: undefined,
    actions: (
      <>
        <ButtonIcon variant="ghost" icon={<Search />} label="Search" />
        {actions}
      </>
    ),
  },
  decorators: [Story => <div className="w-[800px]"><Story /></div>],
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('searchbox')).toBeNull();
    await expect(canvas.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    await expect(canvas.getByRole('banner').scrollWidth).toBeLessThanOrEqual(800);
  },
};

// Stress: at the 768 minimum with six links the header keeps its height and does not overflow. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: {
    search: undefined,
    links: (
      <>
        {['Dashboard', 'Invoices', 'Customers', 'Reports', 'Settings', 'Integrations'].map((l, i) => (
          <NavLink key={l} href={`#${l}`} active={i === 0} aria-current={i === 0 ? 'page' : undefined}>{l}</NavLink>
        ))}
      </>
    ),
  },
  decorators: [Story => <div className="w-[768px]"><Story /></div>],
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner');
    await expect(Math.round(box(header).height)).toBe(64);
    await expect(header.scrollWidth).toBeLessThanOrEqual(768);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
