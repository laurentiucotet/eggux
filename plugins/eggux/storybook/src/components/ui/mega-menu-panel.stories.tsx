import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ChartColumn, CreditCard, FileText, Globe, Mail, Package, Phone, Receipt, ShieldCheck, Sparkles, Users, Zap } from '@/components/icons';
import { MegaMenu, MegaMenuPanel, type MegaMenuColumn } from './mega-menu-panel';

type Args = {
  columns: number;
  width: number;
  showFeatured: boolean;
  showIcons: boolean;
  showDescriptions: boolean;
  showBadge: boolean;
  showFooter: boolean;
};

const body = within(document.body);

function build({ columns, showIcons, showDescriptions, showBadge }: Pick<Args, 'columns' | 'showIcons' | 'showDescriptions' | 'showBadge'>): MegaMenuColumn[] {
  const i = (node: React.ReactNode) => (showIcons ? node : undefined);
  const d = (text: string) => (showDescriptions ? text : undefined);
  const all: MegaMenuColumn[] = [
    {
      heading: 'Products',
      links: [
        { label: 'Invoicing', href: '#invoicing', icon: i(<Receipt />), description: d('Send invoices and get paid on time.'), current: true },
        { label: 'Payments', href: '#payments', icon: i(<CreditCard />), description: d('Accept cards and bank transfers in EUR.'), badge: showBadge ? 'New' : undefined },
        { label: 'Reporting', href: '#reporting', icon: i(<ChartColumn />), description: d('Revenue, tax and cash flow in one view.') },
        { label: 'Inventory', href: '#inventory', icon: i(<Package />), description: d('Stock levels across every warehouse.') },
      ],
    },
    {
      heading: 'Solutions',
      links: [
        { label: 'For finance teams', href: '#finance', icon: i(<Users />), description: d('Close the month in days, not weeks.') },
        { label: 'For retailers', href: '#retail', icon: i(<Globe />), description: d('One catalogue for shops and web.') },
        { label: 'For agencies', href: '#agencies', icon: i(<Zap />), description: d('Bill clients by project or retainer.') },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Documentation', href: '#docs', icon: i(<FileText />), description: d('Guides and API reference.') },
        { label: 'Security', href: '#security', icon: i(<ShieldCheck />), description: d('How Acme protects your data.') },
        { label: 'Contact sales', href: '#sales', icon: i(<Mail />), description: d('Talk to a person within one day.') },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About Acme', href: '#about' },
        { label: 'Careers', href: '#careers', badge: showBadge ? '3 open' : undefined },
        { label: 'Press', href: '#press' },
        { label: 'Call us', href: '#call', icon: i(<Phone />) },
      ],
    },
  ];
  return all.slice(0, columns);
}

const featured = {
  eyebrow: 'New',
  title: 'Multi-currency invoicing',
  description: 'Bill in 30 currencies and settle in EUR with one fixed fee.',
  href: '#multi-currency',
  cta: 'Read the announcement',
  media: (
    <div className="flex size-full items-center justify-center bg-primary/10 text-primary [&_svg]:size-8">
      <Sparkles aria-hidden="true" />
    </div>
  ),
};

const meta = {
  title: 'Components/Layout/Mega Menu Panel',
  parameters: {
    docs: {
      description: {
        component:
          'The wide panel a site navbar opens under one top level item: columns of links with headings, icons, descriptions and badges, and a featured card. It is a named <nav> with real headings and links, and it lays out by its own width (1, 2 or 3 columns, the card beside them when wide), so it also fits a 276 px side panel. MegaMenu is the finished navbar item: a button plus the panel in a Popover. Not for fewer than six links, not hover-only. Code only (no Figma component yet).',
      },
    },
  },
  args: { columns: 3, width: 960, showFeatured: true, showIcons: true, showDescriptions: true, showBadge: true, showFooter: true },
  argTypes: {
    columns: { name: 'Columns', control: { type: 'range', min: 1, max: 4, step: 1 }, description: 'Number of link columns.', table: { category: 'Panel' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 960, step: 12 }, description: 'Width of the panel in px; the layout follows it.', table: { category: 'Panel' } },
    showFeatured: { name: 'Show featured card', control: 'boolean', description: 'The card with media, text and a link.', table: { category: 'Parts' } },
    showIcons: { name: 'Show icons', control: 'boolean', description: 'A 16 px icon before each link.', table: { category: 'Parts' } },
    showDescriptions: { name: 'Show descriptions', control: 'boolean', description: 'A line of text under each link.', table: { category: 'Parts' } },
    showBadge: { name: 'Show badges', control: 'boolean', description: 'A short tag after a label.', table: { category: 'Parts' } },
    showFooter: { name: 'Show footer', control: 'boolean', description: 'A row under the columns.', table: { category: 'Parts' } },
  },
  render: ({ columns, width, showFeatured, showIcons, showDescriptions, showBadge, showFooter }) => (
    <div style={{ width }} className="max-w-full">
      <MegaMenuPanel
        aria-label="Products menu"
        columns={build({ columns, showIcons, showDescriptions, showBadge })}
        featured={showFeatured ? featured : undefined}
        footer={showFooter ? <>Not sure where to start? <a href="#all" className="font-medium text-brand underline-offset-4 hover:underline">Browse everything Acme offers</a></> : undefined}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Products menu' });
    await expect(canvas.getAllByRole('heading')).toHaveLength(3);
    await expect(canvas.getByRole('heading', { name: 'Solutions' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: /Invoicing/ })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: /Payments.*New/ })).toBeVisible();
    // The featured card is one link: title and call to action are its name.
    await expect(canvas.getByRole('link', { name: /Multi-currency invoicing.*Read the announcement/ })).toHaveAttribute('href', '#multi-currency');
    // Wide: three columns side by side, the card to the right of them.
    const heads = canvas.getAllByRole('heading').map(h => h.getBoundingClientRect().left);
    await expect(heads[1]).toBeGreaterThan(heads[0] + 100);
    await expect(heads[2]).toBeGreaterThan(heads[1] + 100);
    const card = canvas.getByRole('link', { name: /Multi-currency/ }).getBoundingClientRect();
    await expect(card.left).toBeGreaterThan(heads[2]);
    await expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth + 1);
    // Keyboard: Tab walks the links in reading order.
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /Invoicing/ })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /Payments/ })).toHaveFocus();
  },
};

/** The finished navbar item: a button that opens the panel in a popover. */
export const InNavbar: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex h-[420px] w-[960px] max-w-full flex-col"><Story /></div>],
  render: () => (
    <header className="flex items-center gap-1 rounded-lg border border-border bg-background p-2">
      <span className="px-3 text-sm font-semibold text-foreground">Acme</span>
      <MegaMenu
        label="Products"
        columns={build({ columns: 3, showIcons: true, showDescriptions: true, showBadge: true })}
        featured={featured}
      />
      <a href="#pricing" className="inline-flex h-9 items-center rounded-button px-4 text-sm font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">Pricing</a>
    </header>
  ),
};

/* Hidden checks */

export const InNavbarCheck: Story = {
  ...InNavbar,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Products' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    const panel = await body.findByRole('navigation', { name: 'Products menu' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(body.getByRole('dialog', { name: 'Products' })).toBeVisible();
    // Escape closes and focus returns to the button.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('navigation', { name: 'Products menu' })).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
    // Enter opens it again from the keyboard.
    await userEvent.keyboard('{Enter}');
    await body.findByRole('navigation', { name: 'Products menu' });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('navigation', { name: 'Products menu' })).toBeNull());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  args: { columns: 4, width: 960 },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Products menu' });
    // 276 px: one column, the card under the links, nothing sticks out.
    await expect(nav.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth + 1);
    const heads = canvas.getAllByRole('heading').map(h => h.getBoundingClientRect());
    await expect(heads[1].top).toBeGreaterThan(heads[0].bottom);
    await expect(Math.abs(heads[1].left - heads[0].left)).toBeLessThan(2);
    const card = canvas.getByRole('link', { name: /Multi-currency/ }).getBoundingClientRect();
    await expect(card.top).toBeGreaterThan(heads[3].bottom);
  },
};

export const Medium: Story = {
  tags: ['!dev'],
  args: { columns: 4, width: 520 },
  play: async ({ canvas }) => {
    // 520 px: two columns.
    const heads = canvas.getAllByRole('heading').map(h => h.getBoundingClientRect());
    await expect(heads[1].left).toBeGreaterThan(heads[0].left + 100);
    await expect(heads[2].top).toBeGreaterThan(heads[0].top + 20);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
