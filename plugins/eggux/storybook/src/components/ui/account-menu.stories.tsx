import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { ChevronsUpDown } from '@/components/icons';
import { AccountMenu, type AccountTheme } from './account-menu';
import { Avatar } from './avatar';
import { Button } from './button';

const meta = {
  title: 'Components/Menu/Account Menu',
  component: AccountMenu,
  parameters: {
    docs: { description: { component: "The menu behind the signed-in person's avatar (Top Bar or Sidebar User): name and email, Profile, Settings, Theme, Keyboard shortcuts, then Log out last after a separator. Personal items only; workspace switching goes in Org Switcher. Log out never asks for confirmation unless there are unsaved changes. Figma: Menu page / Account Menu. Guide: eggux build-ui/components/dropdown-menu.md" } },
  },
  args: { name: 'Daniel Pop', email: 'daniel@acme.com' },
} satisfies Meta<typeof AccountMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const rect = (el: Element) => el.getBoundingClientRect();

const handlers = { onProfile: fn(), onSettings: fn(), onKeyboardShortcuts: fn(), onLogOut: fn() };

// Figma Account Menu: 260 x 254. Header 52 high (Avatar 32 with initials, 8 px padding and gap),
// name ui/label, email ui/caption muted; 2 px between rows; Log out last after a separator.
export const Default: Story = {
  args: handlers,
  render: args => <div className="flex justify-end"><AccountMenu {...args} /></div>,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Account menu' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(trigger).toHaveTextContent('DP');
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    // The header names the menu and is not focusable.
    await expect(menu).toHaveAccessibleName(/Daniel Pop/);
    await expect([Math.round(rect(menu).width), Math.round(rect(menu).height)]).toEqual([260, 254]);
    const header = menu.querySelector('[data-slot="account-menu-header"]')!;
    await expect(Math.round(rect(header).height)).toBe(52);
    await expect(header.querySelector('[tabindex]')).toBeNull();
    const avatar = header.querySelector('[data-slot="avatar"]')!;
    await expect(Math.round(rect(avatar).width)).toBe(32);
    await expect(avatar).toHaveTextContent('DP');
    const name = screen.getByText('Daniel Pop');
    const email = screen.getByText('daniel@acme.com');
    await expect([getComputedStyle(name).fontSize, getComputedStyle(name).fontWeight]).toEqual(['14px', '500']);
    await expect([getComputedStyle(email).fontSize, getComputedStyle(email).lineHeight]).toEqual(['12px', '16px']);
    const muted = probe('text-muted-foreground');
    await expect(getComputedStyle(email).color).toBe(muted.style.color);
    muted.remove();
    await expect(Math.round(rect(name).left - rect(avatar).right)).toBe(8);
    // Items in order; Log out last after the second separator.
    const items = screen.getAllByRole('menuitem');
    await expect(items.map(i => i.textContent)).toEqual(['Profile', 'Settings⌘,', 'Theme', 'Keyboard shortcuts?', 'Log out']);
    await expect(items.map(i => Math.round(rect(i).height))).toEqual([32, 32, 32, 32, 32]);
    await expect(Math.round(rect(items[1]).top - rect(items[0]).bottom)).toBe(2);
    const separators = screen.getAllByRole('separator');
    await expect(separators).toHaveLength(2);
    await expect(rect(separators[1]).bottom).toBeLessThanOrEqual(rect(items[4]).top);
    // Separators stay inside the 4 px menu padding (Figma).
    await expect(Math.round(rect(separators[0]).left - rect(menu).left)).toBe(5);
    // Log out runs at once, no confirmation; the menu closes.
    await userEvent.click(items[4]);
    await expect(handlers.onLogOut).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};

const onThemeChange = fn();

// Theme opens a submenu (Light, Dark, System) with a check on the current one.
export const Theme: Story = {
  render: args => {
    const [theme, setTheme] = React.useState<AccountTheme>('system');
    return <AccountMenu {...args} theme={theme} onThemeChange={t => { onThemeChange(t); setTheme(t); }} />;
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Account menu' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const profile = await screen.findByRole('menuitem', { name: 'Profile' });
    await waitFor(() => expect(profile).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    const themeItem = screen.getByRole('menuitem', { name: 'Theme' });
    await expect(themeItem).toHaveFocus();
    await expect(themeItem).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.keyboard('{ArrowRight}');
    const options = await screen.findAllByRole('menuitemradio');
    await expect(options.map(o => o.textContent)).toEqual(['Light', 'Dark', 'System']);
    await expect(screen.getByRole('menuitemradio', { name: 'System' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Dark' }));
    await expect(onThemeChange).toHaveBeenCalledWith('dark');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.hover(await screen.findByRole('menuitem', { name: 'Theme' }));
    await expect(await screen.findByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');
  },
};

// Keyboard: arrows move, Enter selects, Escape closes and focus returns to the trigger.
export const Keyboard: Story = {
  args: handlers,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Account menu' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: /Settings/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(handlers.onSettings).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('menu');
    await userEvent.keyboard('{End}');
    await expect(screen.getByRole('menuitem', { name: 'Log out' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await expect(trigger).toHaveFocus();
    await expect(handlers.onLogOut).not.toHaveBeenCalled();
  },
};

// Sidebar User: a custom trigger (avatar, name, chevron) opens the same menu above it; the
// person's visible name names the button (no aria-label that would hide it).
export const SidebarTrigger: Story = {
  render: args => (
    <div className="flex h-80 w-64 items-end">
      <AccountMenu
        {...args}
        side="top"
        align="start"
        trigger={
          <Button variant="ghost" className="h-auto w-full justify-start gap-2 px-2 py-2">
            <Avatar size="default" initials="DP" />
            <span className="min-w-0 flex-1 truncate text-left">Daniel Pop</span>
            <ChevronsUpDown aria-hidden="true" />
          </Button>
        }
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Daniel Pop' });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    await expect(rect(menu).bottom).toBeLessThanOrEqual(rect(trigger).top);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

// Stress (Figma Stress test / Account Menu): a long name wraps, a long email truncates and shows in
// full in a Tooltip; a one-letter name gives one initial; the menu stays 260 wide.
export const Stress: Story = {
  tags: ['!dev'],
  args: {
    name: 'Daniel Pop with a much longer label than planned',
    email: 'daniel.pop.with.a.much.longer.address@acme-corporation-europe.com',
    defaultOpen: true,
  },
  play: async () => {
    const menu = await screen.findByRole('menu');
    await expect(Math.round(rect(menu).width)).toBe(260);
    const name = menu.querySelector('[data-slot="account-menu-name"]')!;
    const email = menu.querySelector('[data-slot="account-menu-email"]') as HTMLElement;
    await expect(Math.round(rect(name).height)).toBeGreaterThan(20);
    await expect(Math.round(rect(email).height)).toBe(16);
    await expect(email.scrollWidth).toBeGreaterThan(email.clientWidth);
    await userEvent.hover(email);
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('daniel.pop.with.a.much.longer.address@acme-corporation-europe.com');
    await userEvent.unhover(email);
    // Items keep their one-line height.
    await expect(screen.getAllByRole('menuitem').map(i => Math.round(rect(i).height))).toEqual([32, 32, 32, 32, 32]);
  },
};

export const ShortName: Story = {
  tags: ['!dev'],
  args: { name: 'A', email: 'a@acme.com', defaultOpen: true },
  play: async () => {
    const menu = await screen.findByRole('menu');
    await expect(menu.querySelector('[data-slot="avatar"]')).toHaveTextContent(/^A$/);
  },
};

export const OpenDark: Story = { args: { defaultOpen: true }, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { args: { defaultOpen: true }, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
