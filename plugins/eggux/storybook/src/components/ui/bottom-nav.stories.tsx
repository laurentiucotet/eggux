import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { House, MessageSquare, Receipt, Settings, User } from '@/components/icons';
import { BottomNav, BottomNavItem } from './bottom-nav';

type Args = { navStyle: 'default' | 'floating'; items: number; active: number; showBadge: boolean };

const all = [
  { icon: <House />, label: 'Home' },
  { icon: <Receipt />, label: 'Invoices' },
  { icon: <MessageSquare />, label: 'Messages' },
  { icon: <User />, label: 'Customers' },
  { icon: <Settings />, label: 'Settings' },
];

const frame = (Story: React.ComponentType) => (
  <div className="flex h-40 w-[390px] max-w-full flex-col justify-end overflow-hidden rounded-lg border border-border bg-muted/40">
    <Story />
  </div>
);

const meta = {
  title: 'Components/Mobile/Bottom Nav',
  decorators: [frame],
  parameters: {
    docs: {
      description: {
        component:
          'Bottom navigation for 3 to 5 daily destinations. default is a full-width bar with a top border; floating is an inset pill with a shadow for full-bleed content. Each item shows an icon and a visible label, the active one has aria-current="page", and the whole cell is the touch target (at least 48 x 48). Hide it on detail pages and while typing. Figma: Mobile page / Bottom Nav. Guide: eggux build-ui/patterns/mobile.md',
      },
    },
  },
  args: { navStyle: 'default', items: 4, active: 0, showBadge: false },
  argTypes: {
    navStyle: { name: 'Style', control: 'inline-radio', options: ['default', 'floating'], description: 'Full-width bar or floating pill.', table: { category: 'Bar' } },
    items: { name: 'Items', control: { type: 'range', min: 3, max: 5, step: 1 }, description: 'Destinations, 3 to 5.', table: { category: 'Bar' } },
    active: { name: 'Active item', control: { type: 'range', min: 0, max: 4, step: 1 }, description: 'Index of the current destination.', table: { category: 'Bar' } },
    showBadge: { name: 'Show badge', control: 'boolean', description: 'An unread count on Messages.', table: { category: 'Parts' } },
  },
  render: ({ navStyle, items, active, showBadge }) => (
    <BottomNav navStyle={navStyle}>
      {all.slice(0, items).map((it, i) => (
        <BottomNavItem key={it.label} icon={it.icon} label={it.label} active={i === Math.min(active, items - 1)} badge={showBadge && it.label === 'Messages' ? 3 : undefined} />
      ))}
    </BottomNav>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(canvas.getAllByRole('link')).toHaveLength(4);
    // One current page, the others not.
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: 'Invoices' })).not.toHaveAttribute('aria-current');
    // Whole cell is the touch target: 48 x 48 or more.
    for (const link of canvas.getAllByRole('link')) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(48);
      await expect(link.getBoundingClientRect().width).toBeGreaterThanOrEqual(48);
    }
    await expect(getComputedStyle(nav).borderTopWidth).toBe('1px');
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveFocus();
  },
};

/** Both styles side by side. */
export const Styles: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex flex-col gap-6"><Story /></div>],
  render: () => (
    <>
      {(['default', 'floating'] as const).map(s => (
        <div key={s} className="flex h-28 w-[390px] max-w-full flex-col justify-end overflow-hidden rounded-lg border border-border bg-muted/40">
          <BottomNav navStyle={s} aria-label={`Main, ${s}`}>
            {all.slice(0, 4).map((it, i) => <BottomNavItem key={it.label} icon={it.icon} label={it.label} active={i === 1} />)}
          </BottomNav>
        </div>
      ))}
    </>
  ),
};

/* Hidden checks */

export const FloatingCheck: Story = {
  tags: ['!dev'],
  args: { navStyle: 'floating' },
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(nav).toHaveAttribute('data-style', 'floating');
    await expect(getComputedStyle(nav).boxShadow).not.toBe('none');
    // Inset 16 px from the sides.
    await expect(Math.round(nav.getBoundingClientRect().left - nav.parentElement!.getBoundingClientRect().left)).toBe(16 + 1);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <BottomNav>
      {all.map((it, i) => <BottomNavItem key={it.label} icon={it.icon} label={i === 3 ? 'Customers and companies' : it.label} badge={i === 2 ? 120 : undefined} active={i === 3} />)}
    </BottomNav>
  ),
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    // Five items in 276 px: nothing sticks out, long labels are cut.
    await expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth + 1);
    await expect(canvas.getByText('99+')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
