import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Archive, Calendar, ChartColumn, CreditCard, FileText, Users } from '@/components/icons';
import { AppLauncher, type AppLauncherApp } from './app-launcher';

const apps: AppLauncherApp[] = [
  { id: 'invoices', name: 'Invoices', href: '#invoices', icon: <FileText /> },
  { id: 'payments', name: 'Payments', href: '#payments', icon: <CreditCard /> },
  { id: 'reports', name: 'Reports', href: '#reports', icon: <ChartColumn /> },
  { id: 'people', name: 'People', href: '#people', icon: <Users /> },
  { id: 'calendar', name: 'Calendar', href: '#calendar', icon: <Calendar /> },
  { id: 'files', name: 'Files', href: '#files', icon: <Archive />, external: true },
];

const meta = {
  title: 'Components/Popover/App Launcher',
  component: AppLauncher,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Grid of the products in a suite, opened from a layout-grid Button Icon in the Top Bar: 3 per row, the current app highlighted (aria-current="page"), names of one or two words. Only for suites with 4 or more apps. Arrows move in the grid, Escape closes and returns focus to the trigger. Figma: Popover page / App Launcher. Guide: eggux build-ui/components/popover.md' } },
  },
  // The stories stay on the page: the handler stops the navigation, as a client router would.
  args: { apps, currentAppId: 'invoices', title: 'Acme apps', onNavigate: fn((_app: AppLauncherApp, event: React.MouseEvent) => event.preventDefault()) },
} satisfies Meta<typeof AppLauncher>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

// The Apps button opens it with focus on the current app; Escape returns focus to the button.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Apps' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const dialog = await screen.findByRole('dialog', { name: 'Acme apps' });
    // Figma: 320 x 214, radius lg; tiles 76 high, icon tile 36 with an 18 px icon.
    await expect(box(dialog)).toEqual([320, 214]);
    const current = within(dialog).getByRole('link', { name: 'Invoices' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await waitFor(() => expect(current).toHaveFocus());
    await expect(box(current)[1]).toBe(76);
    const tile = current.querySelector('span[aria-hidden="true"]')!;
    await expect(box(tile)).toEqual([36, 36]);
    await expect(box(tile.querySelector('svg')!)).toEqual([18, 18]);
    const accent = document.createElement('span');
    accent.className = 'bg-accent';
    document.body.append(accent);
    await expect(getComputedStyle(current).backgroundColor).toBe(getComputedStyle(accent).backgroundColor);
    accent.remove();
    // 3 per row.
    const links = within(dialog).getAllByRole('link');
    await expect(Math.round(links[3].getBoundingClientRect().left)).toBe(Math.round(links[0].getBoundingClientRect().left));
    await userEvent.click(links[1]);
    await expect(args.onNavigate).toHaveBeenCalledWith(apps[1], expect.anything());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// Arrows move in the grid (one tab stop); Home / End jump; the external app says so.
export const Keyboard: Story = {
  args: { currentAppId: 'reports' },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Apps' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog');
    const link = (name: string | RegExp) => within(dialog).getByRole('link', { name });
    await waitFor(() => expect(link('Reports')).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(link(/Files/)).toHaveFocus();
    await expect(link(/Files/)).toHaveAccessibleName('Files (opens in a new tab)');
    await expect(link(/Files/)).toHaveAttribute('target', '_blank');
    await userEvent.keyboard('{ArrowLeft}');
    await expect(link('Calendar')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(link('Invoices')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(link('Invoices')).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(link(/Files/)).toHaveFocus();
    // One tab stop: only the focused app is in the tab order.
    await expect(within(dialog).getAllByRole('link').filter(a => a.tabIndex === 0)).toHaveLength(1);
  },
};

// Long names wrap (never truncate) and nine apps make three rows inside 320.
export const Stress: Story = {
  tags: ['!dev'],
  args: {
    defaultOpen: true,
    apps: [
      ...apps,
      { id: 'procurement', name: 'Procurement', href: '#procurement', icon: <FileText /> },
      { id: 'expenses', name: 'Expense reports', href: '#expenses', icon: <CreditCard /> },
      { id: 'analytics', name: 'Analytics', href: '#analytics', icon: <ChartColumn />, external: true },
    ],
  },
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await expect(box(dialog)[0]).toBe(320);
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
    const names = Array.from(dialog.querySelectorAll<HTMLElement>('[data-slot="app-launcher-app"] > span:last-child'));
    for (const name of names) await expect(name.scrollWidth).toBeLessThanOrEqual(name.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...Keyboard, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Keyboard, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
