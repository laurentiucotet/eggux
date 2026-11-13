import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { phoneGlobals, phoneStory } from './mobile-parts';
import { MobileSettingsPage } from './mobile-settings';

const meta = {
  title: 'Pages/Mobile/Mobile Settings',
  parameters: {
    ...phoneStory,
    docs: { description: { component: 'Settings on a phone, opened at 375 px. A large title, the profile row, the notifications as Toggle Cards (the whole card flips), a Language Switcher, and "Daily reminder time", which opens a bottom sheet with a Wheel Picker for hours and minutes and keeps the change only on Save. Sign out asks first. The Bottom Nav has Settings active. Guide: eggux build-ui/patterns/mobile.md' } },
  },
  globals: phoneGlobals,
  render: () => <MobileSettingsPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The reminder time sheet open: two wheels under one selection band, Save and Cancel. */
export const ReminderTimeSheet: Story = { render: () => <MobileSettingsPage initialTimeOpen /> };

/** Sign out asks before it does anything. */
export const ConfirmSignOut: Story = { render: () => <MobileSettingsPage initialConfirmOpen /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await expect(c.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
    await expect(c.getAllByRole('banner')).toHaveLength(1);
    await expect(c.getAllByRole('main')).toHaveLength(1);
    await expect(c.getAllByRole('navigation')).toHaveLength(1);
    await expect(c.getByRole('link', { name: 'Settings', current: 'page' })).toBeVisible();

    // A Toggle Card is one switch; clicking the card flips it.
    const digest = c.getByRole('switch', { name: 'Weekly email digest' });
    await expect(digest).not.toBeChecked();
    await userEvent.click(digest);
    await waitFor(() => expect(c.getByRole('switch', { name: 'Weekly email digest' })).toBeChecked());
    await userEvent.click(c.getByText('Push notifications'));
    await waitFor(() => expect(c.getByRole('switch', { name: 'Push notifications' })).not.toBeChecked());

    // Language.
    await userEvent.click(c.getByRole('button', { name: /Language: English/ }));
    await userEvent.click(await screen.findByRole('option', { name: /Deutsch/ }));
    await waitFor(() => expect(c.getByRole('button', { name: /Language: Deutsch/ })).toBeVisible());

    // Reminder time: cancel keeps 08:30, save keeps the new value.
    await userEvent.click(c.getByRole('button', { name: '08:30' }));
    const sheet = await screen.findByRole('dialog', { name: 'Daily reminder time' });
    await userEvent.click(within(within(sheet).getByRole('listbox', { name: 'Hours' })).getByRole('option', { name: '11' }));
    await userEvent.click(within(sheet).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(c.getByRole('button', { name: '08:30' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: '08:30' }));
    const again = await screen.findByRole('dialog', { name: 'Daily reminder time' });
    await userEvent.click(within(within(again).getByRole('listbox', { name: 'Hours' })).getByRole('option', { name: '09' }));
    await userEvent.click(within(within(again).getByRole('listbox', { name: 'Minutes' })).getByRole('option', { name: '45' }));
    await userEvent.click(within(again).getByRole('button', { name: 'Save time' }));
    await waitFor(() => expect(c.getByRole('button', { name: '09:45' })).toBeVisible());

    // Sign out asks; staying keeps the page, confirming leaves it.
    await userEvent.click(c.getByRole('button', { name: 'Sign out' }));
    const ask = await screen.findByRole('alertdialog', { name: 'Sign out of Acme?' });
    await userEvent.click(within(ask).getByRole('button', { name: 'Stay signed in' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(c.getByRole('button', { name: 'Sign out' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Sign out' }));
    await userEvent.click(within(await screen.findByRole('alertdialog', { name: 'Sign out of Acme?' })).getByRole('button', { name: 'Sign out' }));
    await waitFor(() => expect(page.getByRole('heading', { level: 2, name: 'You are signed out' })).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Corporate Light' } };
export const ReminderTimeSheetDark: Story = { ...ReminderTimeSheet, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const ConfirmSignOutDark: Story = { ...ConfirmSignOut, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
