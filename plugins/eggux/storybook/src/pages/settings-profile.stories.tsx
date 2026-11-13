import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { SettingsProfilePage } from './settings-profile';

const meta = {
  title: 'Pages/App/Settings Profile',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Settings, Profile: a Page Header and three tabs. Profile is a form (photo, name, email, job title, language, time zone); any edit shows the Save Bar with Save changes and Discard, and Save validates. Security holds the password change and two Toggle Cards; Notifications holds Toggle Cards that apply as you switch them.' } },
  },
  render: () => <SettingsProfilePage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** An edited form: the Save Bar waits at the bottom. */
export const UnsavedChanges: Story = { render: () => <SettingsProfilePage edited /> };

/** Save pressed with a missing name and a broken email. */
export const WithErrors: Story = { render: () => <SettingsProfilePage showErrors /> };

export const Security: Story = { render: () => <SettingsProfilePage tab="security" /> };

export const Notifications: Story = { render: () => <SettingsProfilePage tab="notifications" /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();
    await expect(c.queryByRole('region', { name: 'Unsaved changes' })).toBeNull();

    // Edit: the Save Bar appears; Discard restores.
    const job = c.getByLabelText(/^Job title/);
    await userEvent.type(job, ' EMEA');
    const bar = await c.findByRole('region', { name: 'Unsaved changes' });
    await expect(within(bar).getByText('1 unsaved change')).toBeVisible();
    await userEvent.click(within(bar).getByRole('button', { name: 'Discard' }));
    await waitFor(() => expect(c.queryByRole('region', { name: 'Unsaved changes' })).toBeNull());
    await expect(c.getByLabelText(/^Job title/)).toHaveValue('Finance lead');

    // Validation: an empty name cannot be saved.
    await userEvent.clear(c.getByLabelText(/^Full name/));
    await userEvent.click(await c.findByRole('button', { name: 'Save changes' }));
    await expect(await c.findByText('Enter your name.')).toBeVisible();
    await userEvent.type(c.getByLabelText(/^Full name/), 'Daniel Popescu');
    await userEvent.click(c.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(c.getByText('Profile saved')).toBeVisible());
    await waitFor(() => expect(c.queryByRole('region', { name: 'Unsaved changes' })).toBeNull());

    // Security: password validation, then two-step.
    await userEvent.click(c.getByRole('tab', { name: 'Security' }));
    await userEvent.click(await c.findByRole('button', { name: 'Update password' }));
    await expect(await c.findByText('Enter your current password.')).toBeVisible();
    await userEvent.type(c.getByLabelText(/^Current password/), 'old-password');
    await userEvent.type(c.getByLabelText(/^New password/), 'new-password-1');
    await userEvent.type(c.getByLabelText(/^Confirm new password/), 'different');
    await userEvent.click(c.getByRole('button', { name: 'Update password' }));
    await expect(await c.findByText('The passwords do not match.')).toBeVisible();
    await userEvent.clear(c.getByLabelText(/^Confirm new password/));
    await userEvent.type(c.getByLabelText(/^Confirm new password/), 'new-password-1');
    await userEvent.click(c.getByRole('button', { name: 'Update password' }));
    await waitFor(() => expect(c.getByText('Password updated')).toBeVisible());
    const twoStep = c.getByRole('switch', { name: 'Two-step sign in' });
    await expect(twoStep).not.toBeChecked();
    await userEvent.click(twoStep);
    await waitFor(() => expect(c.getByRole('switch', { name: 'Two-step sign in' })).toBeChecked());

    // Notifications.
    await userEvent.click(c.getByRole('tab', { name: 'Notifications' }));
    const news = await c.findByRole('switch', { name: 'Product news' });
    await userEvent.click(news);
    await waitFor(() => expect(c.getByRole('switch', { name: 'Product news' })).toBeChecked());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const UnsavedChangesDark: Story = { ...UnsavedChanges, tags: ['!dev'], globals: { theme: 'Dark' } };
export const WithErrorsBackOffice: Story = { ...WithErrors, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const SecurityDark: Story = { ...Security, tags: ['!dev'], globals: { theme: 'Dark' } };
export const NotificationsBackOffice: Story = { ...Notifications, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const PhoneWidth: Story = {
  ...UnsavedChanges,
  tags: ['!dev'],
  globals: { viewport: { value: 'base', isRotated: false } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(await c.findByRole('region', { name: 'Unsaved changes' })).toBeVisible();
    await waitFor(() => expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth));
  },
};
