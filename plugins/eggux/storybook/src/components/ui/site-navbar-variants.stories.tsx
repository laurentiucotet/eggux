import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Building, Calendar, ChartColumn, FileText, Globe, Inbox, Settings, ShieldCheck, UserCheck, Users } from '@/components/icons';
import { ButtonIcon } from './button-icon';
import { SiteNavbar, type SiteLink, type SiteMenu } from './site-navigation';

const flyout: SiteMenu = {
  type: 'flyout',
  links: [
    { label: 'Analytics', href: '#analytics', description: 'Dashboards and reports for every team.', icon: <ChartColumn /> },
    { label: 'Automations', href: '#automations', description: 'Run repetitive work on a schedule.', icon: <Settings /> },
    { label: 'Inbox', href: '#inbox', description: 'Every message from every channel in one place.', icon: <Inbox /> },
    { label: 'Calendar', href: '#calendar', description: 'Plan, book and sync with your team.', icon: <Calendar /> },
    { label: 'Contacts', href: '#contacts', description: 'People and companies with full history.', icon: <Users /> },
    { label: 'Documents', href: '#documents', description: 'Contracts and files, signed online.', icon: <FileText /> },
  ],
  actions: [{ label: 'Watch the 3-minute demo', href: '#demo-video' }, { label: 'Contact sales', href: '#sales' }],
  more: { label: 'All features', href: '#features' },
  featured: { badge: 'New in 4.2', title: 'Dashboards you can share', description: 'Send a live, read-only link to clients and investors.', action: { label: 'See what is new', href: '#new' } },
};
const mega: SiteMenu = {
  type: 'mega',
  groups: [
    { title: 'Platform', links: [
      { label: 'Invoicing', href: '#invoicing', description: 'Create, send and track invoices in any currency.', icon: <FileText /> },
      { label: 'Approvals', href: '#approvals', description: 'Multi-step approval chains with limits and delegation.', icon: <UserCheck /> },
      { label: 'Reports', href: '#reports', description: 'Dashboards, scheduled exports and audit-ready reports.', icon: <ChartColumn /> },
    ] },
    { title: 'For teams', links: [
      { label: 'Finance', href: '#finance', description: 'Close the month faster with shared workflows.', icon: <Building /> },
      { label: 'Operations', href: '#operations', description: 'Purchase orders, vendors and spend control.', icon: <Settings /> },
      { label: 'Security', href: '#security', description: 'SSO, roles, audit log and data residency.', icon: <ShieldCheck /> },
    ] },
  ],
  featured: { eyebrow: 'New in 2.4', title: 'Approvals now support delegation', description: 'Route requests to a deputy while someone is away, with a full audit trail.', action: { label: 'Read more', href: '#delegation' } },
};
const solutions: SiteMenu = { type: 'dropdown', links: [
  { label: 'Finance teams', href: '#s-finance' },
  { label: 'Agencies', href: '#s-agencies' },
  { label: 'Procurement', href: '#s-procurement' },
  { label: 'Enterprise', href: '#s-enterprise', description: 'SSO, SLA and a named contact' },
] };
const resources: SiteMenu = { type: 'dropdown', links: [
  { label: 'Docs', href: '#docs', icon: <FileText /> },
  { label: 'Webinars', href: '#webinars', icon: <Calendar /> },
  { label: 'Customers', href: '#customers', icon: <Users /> },
] };

const cta = { label: 'Start free trial', href: '#trial' };
const signIn = { href: '#signin' };
const flyoutLinks: SiteLink[] = [
  { label: 'Product', menu: flyout },
  { label: 'Solutions', menu: solutions },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
  { label: 'Docs', href: '#docs' },
];
const megaLinks: SiteLink[] = [
  { label: 'Product', menu: mega },
  { label: 'Solutions', menu: solutions },
  { label: 'Resources', menu: resources },
  { label: 'Pricing', href: '#pricing' },
];

const meta = {
  title: 'Blocks/Navigation/Navbar Variants',
  component: SiteNavbar,
  parameters: {
    layout: 'fullscreen',
    // Radix focus guard next to an open trigger (as in Navigation Menu stories).
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', selector: '[data-slot="navigation-menu-item"] > span[aria-hidden="true"]', enabled: false }] } },
    docs: { description: { component: 'Navbar with menus and layouts. A link with `menu` opens a dropdown (short list), a flyout (icon links in two columns, footer row, featured card, under its trigger) or a mega menu (groups and a featured item across the container). Menus open on hover after 200 ms or on click / Enter, close on Escape or outside click, and turn into disclosures in the mobile Sheet. Layouts: centered (logo in the middle) and search (docs and help centers: product badge, Search Field with ⌘K). Figma: BLOCKS / Navigation (Navbar Flyout, Mega Menu, Centered, Search). Guide: eggux build-ui/patterns/navigation.md' } },
  },
  args: { links: flyoutLinks, signIn, cta },
  render: args => <div className="h-[480px] w-[1440px]"><SiteNavbar {...args} /></div>,
} satisfies Meta<typeof SiteNavbar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const openMenu = async (canvas: { getByRole: (r: string, o: object) => HTMLElement }, name: string) => {
  const trigger = canvas.getByRole('button', { name });
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
  return trigger;
};

// Figma Navbar Flyout: Product opens a 746 panel 8 under the bar with 6 links, footer row, featured card.
export const Flyout: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.round(box(canvas.getByRole('banner')).height)).toBe(61);
    const trigger = await openMenu(canvas, 'Product');
    const panel = canvasElement.querySelector('[data-slot="site-menu-flyout"]')!;
    await expect(Math.round(box(panel).width)).toBe(746);
    await expect(Math.round(box(panel).top - box(canvas.getByRole('banner')).bottom)).toBeGreaterThanOrEqual(7);
    await expect(within(panel as HTMLElement).getAllByRole('link', { name: /Analytics|Automations|Inbox|Calendar|Contacts|Documents/ })).toHaveLength(6);
    await expect(within(panel as HTMLElement).getByRole('link', { name: 'All features' })).toHaveAttribute('href', '#features');
    await expect(within(panel as HTMLElement).getByRole('link', { name: 'See what is new' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await expect(trigger).toHaveFocus();
  },
};

// Dropdown: a short list under Solutions; links have a description when they need one.
export const Dropdown: Story = {
  play: async ({ canvas, canvasElement }) => {
    await openMenu(canvas, 'Solutions');
    const list = canvasElement.querySelector('[data-slot="site-menu-dropdown"]') as HTMLElement;
    await expect(Math.round(box(list).width)).toBe(240);
    await expect(within(list).getAllByRole('link')).toHaveLength(4);
    await expect(within(list).getByRole('link', { name: /Enterprise/ })).toHaveTextContent('SSO, SLA and a named contact');
    await expect(canvas.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '#pricing');
  },
};

// Figma Navbar Mega Menu: groups with an overline title and a featured item, 1152 wide under the bar.
export const MegaMenu: Story = {
  args: { links: megaLinks },
  play: async ({ canvas, canvasElement }) => {
    await openMenu(canvas, 'Product');
    const panel = canvasElement.querySelector('[data-slot="site-menu-mega"]') as HTMLElement;
    await expect(Math.round(box(panel).width)).toBe(1152);
    await expect(within(panel).getByRole('list', { name: 'Platform' })).toBeInTheDocument();
    await expect(within(panel).getAllByRole('link')).toHaveLength(7);
    await expect(within(panel).getByRole('link', { name: /Approvals/ })).toHaveTextContent('Multi-step approval chains');
    // Another trigger replaces the open menu.
    await openMenu(canvas, 'Resources');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="site-menu-mega"]')).toBeNull());
  },
};

// Figma Navbar Centered: links left, logo in the middle, Docs, Sign in and the CTA right.
export const Centered: Story = {
  args: {
    layout: 'centered',
    links: [{ label: 'Product', href: '#product' }, { label: 'Solutions', menu: solutions }, { label: 'Pricing', href: '#pricing' }],
    endLinks: [{ label: 'Docs', href: '#docs' }],
    cta: { label: 'Book a demo', href: '#demo' },
  },
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner');
    await expect(Math.round(box(header).height)).toBe(61);
    const logo = box(canvas.getByRole('link', { name: 'Acme' }));
    await expect(Math.abs(logo.left + logo.width / 2 - 720)).toBeLessThanOrEqual(1);
    await expect(canvas.getByRole('navigation', { name: 'More' })).toHaveTextContent('Docs');
  },
};

// Figma Navbar Search: product badge, links, Search Field with ⌘K filling the rest, language, outline CTA.
export const Search: Story = {
  args: {
    layout: 'search',
    badge: 'Docs',
    links: [{ label: 'Guides', href: '#guides', active: true }, { label: 'API reference', href: '#api' }, { label: 'Help center', href: '#help' }, { label: 'Changelog', href: '#changelog' }],
    search: { placeholder: 'Search docs…' },
    actions: <ButtonIcon variant="ghost" icon={<Globe aria-hidden="true" />} label="Language" />,
    signIn: undefined,
    cta: { label: 'Contact support', href: '#support' },
    ctaVariant: 'outline',
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.round(box(canvas.getByRole('banner')).height)).toBe(61);
    const field = canvas.getByRole('searchbox', { name: /Search docs/ });
    await expect(box(field).width).toBeGreaterThan(180);
    await expect(canvas.getByText('Docs')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Guides' })).toHaveAttribute('aria-current', 'page');
    await expect(canvasElement.querySelector('kbd')).not.toBeNull();
  },
};

// Mobile: menus become disclosures in the Sheet.
export const MobileMenus: Story = {
  args: { links: megaLinks },
  render: args => <div className="w-[390px]"><SiteNavbar {...args} /></div>,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Menu' }));
    const dialog = await within(document.body).findByRole('dialog', { name: 'Menu' });
    const product = within(dialog).getByRole('button', { name: 'Product' });
    await expect(product).toHaveAttribute('aria-expanded', 'false');
    await expect(within(dialog).queryByRole('link', { name: 'Invoicing' })).toBeNull();
    await userEvent.click(product);
    await expect(product).toHaveAttribute('aria-expanded', 'true');
    await expect(within(dialog).getByRole('list', { name: 'For teams' })).toBeInTheDocument();
    await expect(within(dialog).getByRole('link', { name: 'Invoicing' })).toHaveAttribute('href', '#invoicing');
    await expect(Math.round(box(within(dialog).getByRole('link', { name: 'Pricing' })).height)).toBe(48);
    await userEvent.keyboard('{Escape}');
  },
};

// Stress: on-image with menus, long labels, narrow 800 container. Tests only.
export const OnImageMenus: Story = {
  tags: ['!dev'],
  args: { links: megaLinks, variant: 'on-image' },
  render: args => <div className="h-[520px] w-[1440px] bg-[linear-gradient(135deg,#1e3a8a,#0f172a)]"><SiteNavbar {...args} /></div>,
  play: async ({ canvas, canvasElement }) => {
    await openMenu(canvas, 'Solutions');
    await expect(canvasElement.querySelector('[data-slot="site-menu-dropdown"]')).not.toBeNull();
  },
};

export const FlyoutDark: Story = { ...Flyout, tags: ['!dev'], globals: { theme: 'Dark' }, play: async ({ canvas }) => { await openMenu(canvas, 'Product'); } };
export const MegaCorporate: Story = { ...MegaMenu, tags: ['!dev'], globals: { theme: 'Corporate Light' }, play: async ({ canvas }) => { await openMenu(canvas, 'Product'); } };
export const SearchDark: Story = { ...Search, tags: ['!dev'], globals: { theme: 'Dark' }, play: undefined };
