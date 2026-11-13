import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { BillingPage } from './billing';

const meta = {
  title: 'Pages/App/Billing',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Billing: the current plan with usage meters (Progress turns amber at 80% and red at the limit), a plan change, the next invoice, the saved payment methods and the invoice history with a download per row and paging. When the last payment fails, an Alert says so with a way to retry.' } },
  },
  render: () => <BillingPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The last payment failed: Alert on top, the card and the invoice are marked. */
export const PaymentFailed: Story = { render: () => <BillingPage paymentFailed /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(document.body);
    await expect(c.getByRole('heading', { level: 1, name: 'Billing' })).toBeVisible();
    await expect(c.getByRole('heading', { level: 2, name: 'Current plan: Pro' })).toBeVisible();
    await expect(c.getByRole('progressbar', { name: 'Seats' })).toHaveAttribute('aria-valuenow', '80');
    await expect(c.getByRole('button', { name: 'Change plan' })).toBeDisabled();

    // Plan change.
    await userEvent.click(c.getByRole('combobox', { name: /^Plan/ }));
    await userEvent.click(await body.findByRole('option', { name: /Business/ }));
    await userEvent.click(await c.findByRole('button', { name: 'Change plan' }));
    await waitFor(() => expect(c.getByRole('heading', { level: 2, name: 'Current plan: Business' })).toBeVisible());
    await expect(c.getByText(/Your plan changes to Business/)).toBeVisible();

    // Payment methods.
    await userEvent.click(c.getByRole('button', { name: /Make default Mastercard ending 4444/ }));
    await waitFor(() => expect(c.getByText('Mastercard ending 4444 is now your default card.')).toBeVisible());

    // History: download and paging.
    await expect(c.getAllByRole('row')).toHaveLength(6);
    await userEvent.click(c.getAllByRole('button', { name: /^Download invoice/ })[0]!);
    await waitFor(() => expect(c.getByText(/^Preparing INV-2026-012\.pdf/)).toBeVisible());
    await userEvent.click(c.getByRole('button', { name: /^Next/ }));
    await waitFor(() => expect(c.getByText('Showing 6-10 of 12 invoices')).toBeVisible());
  },
};
export const PaymentFailedCheck: Story = {
  ...PaymentFailed,
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText('Your last payment failed')).toBeVisible();
    await expect(c.getByText('Declined')).toBeVisible();
    await expect(c.getByText('Failed')).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Retry payment' }));
    await waitFor(() => expect(c.queryByText('Your last payment failed')).toBeNull());
    await expect(c.getByText(/Payment received/)).toBeVisible();
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const PaymentFailedDark: Story = { ...PaymentFailed, tags: ['!dev'], globals: { theme: 'Dark' } };
export const PaymentFailedBackOffice: Story = { ...PaymentFailed, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const PhoneWidth: Story = {
  ...PaymentFailed,
  tags: ['!dev'],
  globals: { viewport: { value: 'base', isRotated: false } },
  play: async ({ canvasElement }) => {
    await expect((await within(canvasElement).findAllByRole('heading', { level: 1, name: 'Billing' })).length).toBeGreaterThan(0);
    await waitFor(() => expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth));
  },
};
