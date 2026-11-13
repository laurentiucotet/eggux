import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { DashboardPage } from './dashboard';

const meta = {
  title: 'Pages/App/Dashboard',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Dashboard inside the app shell: a Page Header with a date range, four Stat Cards with their trend, a revenue chart, invoices by status as a Distribution Bar, recent activity and a list of what needs attention. The date range changes the numbers, the chart and the distribution. Loading and Empty (a new workspace) are the two states. Below 1024 px the Sidebar becomes a Mobile Header and a Bottom Nav. Guide: eggux build-ui/patterns/dashboards.md' } },
  },
  render: () => <DashboardPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Data on its way: Skeleton Presets in the shape of the page, announced once as loading. */
export const Loading: Story = { render: () => <DashboardPage state="loading" /> };

/** A new workspace with no invoices: one sentence and the one action that fills the page. */
export const Empty: Story = { render: () => <DashboardPage state="empty" /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
    await expect(c.getAllByRole('main')).toHaveLength(1);
    // Four figures, each with its change.
    await expect(canvasElement.querySelectorAll('[data-slot="stat-card"]')).toHaveLength(4);
    await expect(c.getByText('€48,250')).toBeVisible();
    await expect(c.getByRole('figure', { name: 'Revenue, last 30 days' })).toBeVisible();
    await expect(c.getByRole('figure', { name: 'Invoices by status, last 30 days' })).toBeVisible();
    // Activity and attention.
    await expect(within(c.getByRole('list', { name: 'Recent activity feed' })).getAllByRole('listitem')).toHaveLength(5);
    await expect(c.getByRole('region', { name: 'Needs attention' })).toBeVisible();
    await expect(c.getByText('Card payment failed')).toBeVisible();
    // The date range changes the numbers.
    await userEvent.click(c.getByRole('combobox', { name: 'Date range' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Last 7 days' }));
    await waitFor(() => expect(c.getByText('€11,480')).toBeVisible());
    await expect(c.queryByText('€48,250')).toBeNull();
    await expect(c.getByRole('figure', { name: 'Invoices by status, last 7 days' })).toBeVisible();
    await expect(c.getAllByText('Compared to the previous 7 days')).toHaveLength(4);
  },
};

export const LoadingCheck: Story = {
  tags: ['!dev'],
  render: () => <DashboardPage state="loading" />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
    const region = c.getByRole('status', { name: 'Loading the dashboard' });
    await expect(region).toHaveAttribute('aria-busy', 'true');
    await expect(c.getByRole('combobox', { name: 'Date range' })).toBeDisabled();
    await expect(c.queryByText('€48,250')).toBeNull();
  },
};

export const EmptyCheck: Story = {
  tags: ['!dev'],
  render: () => <DashboardPage state="empty" />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'Nothing to show yet' })).toBeVisible();
    await expect(c.getByRole('button', { name: 'New invoice' })).toBeVisible();
    await expect(canvasElement.querySelectorAll('[data-slot="stat-card"]')).toHaveLength(0);
  },
};

/** At 375 px the phone shell shows and the page does not scroll sideways. */
export const PhoneCheck: Story = {
  tags: ['!dev'],
  globals: { viewport: { value: 'base', isRotated: false } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // The phone shell: Mobile Header (its own h1) and Bottom Nav; the desktop Sidebar is out of the tree.
    await expect(c.getAllByRole('heading', { level: 1, name: 'Dashboard' }).length).toBeGreaterThan(0);
    await expect(c.getAllByRole('link', { name: /Invoices/ })).toHaveLength(1);
    await waitFor(() => expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth));
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const LoadingDark: Story = { ...Loading, tags: ['!dev'], globals: { theme: 'Dark' } };
export const EmptyBackOffice: Story = { ...Empty, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
