import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { CustomerDetailPage } from './customer-detail';

const meta = {
  title: 'Pages/App/Customer Detail',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Customer detail inside the app shell: a Page Header with a back link, the name, a status badge, a meta line and the actions; Tabs for Overview (four Stat Cards and a Description List), Invoices (a small table) and Activity (Activity Feed Items). A customer without invoices shows an empty state in the Invoices tab; an unknown id shows the not-found state. Guide: eggux build-ui/patterns/detail-pages.md' } },
  },
  render: () => <CustomerDetailPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A new customer: the Invoices tab has nothing yet and offers the first invoice. */
export const NoInvoices: Story = { render: () => <CustomerDetailPage customerId="wayne" defaultTab="invoices" /> };

/** A link to a customer that does not exist. */
export const NotFound: Story = { render: () => <CustomerDetailPage customerId="c-9921" /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Acme Ltd' })).toBeVisible();
    await expect(c.getAllByRole('main')).toHaveLength(1);
    await expect(c.getByRole('link', { name: 'All customers' })).toHaveAttribute('href', '#customers');
    await expect(c.getByText('Active')).toBeVisible();
    await expect(c.getByRole('button', { name: 'New invoice' })).toBeVisible();
    // Overview: four figures and the details.
    await expect(c.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvasElement.querySelectorAll('[data-slot="stat-card"]')).toHaveLength(4);
    await expect(c.getByText('€48,920')).toBeVisible();
    await expect(c.getByText('Net 14')).toBeVisible();
    await expect(c.getByText('Ana Popescu', { selector: 'dd *' })).toBeVisible();
    // Invoices: the table of this customer.
    await userEvent.click(c.getByRole('tab', { name: /Invoices/ }));
    const table = await c.findByRole('table', { name: 'Invoices of Acme Ltd' });
    await expect(within(table).getAllByRole('row')).toHaveLength(5);
    await expect(within(table).getByRole('link', { name: 'INV-1041' })).toBeVisible();
    // Activity: the events, newest first.
    await userEvent.click(c.getByRole('tab', { name: 'Activity' }));
    const feed = await c.findByRole('list', { name: 'Activity of Acme Ltd' });
    await expect(within(feed).getAllByRole('listitem')).toHaveLength(4);
    await expect(within(feed).getAllByRole('listitem')[0]).toHaveTextContent('Ana Popescu');
    await waitFor(() => expect(c.queryByRole('table', { name: 'Invoices of Acme Ltd' })).toBeNull());
  },
};

export const NoInvoicesCheck: Story = {
  tags: ['!dev'],
  render: () => <CustomerDetailPage customerId="wayne" defaultTab="invoices" />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Wayne Logistics' })).toBeVisible();
    await expect(c.getByRole('heading', { name: 'No invoices yet' })).toBeVisible();
    await expect(c.queryByRole('table')).toBeNull();
    await userEvent.click(c.getByRole('tab', { name: 'Overview' }));
    // No phone on file: the Description List says so.
    await expect(await c.findByText('Not set')).toBeVisible();
  },
};

export const NotFoundCheck: Story = {
  tags: ['!dev'],
  render: () => <CustomerDetailPage customerId="c-9921" />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Customer not found' })).toBeVisible();
    await expect(c.getByRole('heading', { level: 2, name: 'There is no customer with this id' })).toBeVisible();
    await expect(c.getByText(/c-9921/)).toBeVisible();
    await expect(c.getByRole('link', { name: 'Back to customers' })).toHaveAttribute('href', '#customers');
    await expect(c.queryByRole('tablist')).toBeNull();
  },
};

/** At 375 px the phone shell shows and the page does not scroll sideways, on each tab. */
export const PhoneCheck: Story = {
  tags: ['!dev'],
  globals: { viewport: { value: 'base', isRotated: false } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getAllByRole('heading', { level: 1, name: 'Acme Ltd' }).length).toBeGreaterThan(0);
    const fits = () => expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
    await waitFor(fits);
    await userEvent.click(c.getByRole('tab', { name: /Invoices/ }));
    await c.findByRole('table', { name: 'Invoices of Acme Ltd' });
    await waitFor(fits);
    await userEvent.click(c.getByRole('tab', { name: 'Activity' }));
    await c.findByRole('list', { name: 'Activity of Acme Ltd' });
    await waitFor(fits);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const NotFoundDark: Story = { ...NotFound, tags: ['!dev'], globals: { theme: 'Dark' } };
export const NoInvoicesBackOffice: Story = { ...NoInvoices, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
