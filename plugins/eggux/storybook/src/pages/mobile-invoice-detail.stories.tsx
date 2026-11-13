import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { MobileInvoiceDetailPage } from './mobile-invoice-detail';
import { phoneGlobals, phoneStory } from './mobile-parts';

const meta = {
  title: 'Pages/Mobile/Mobile Invoice Detail',
  parameters: {
    ...phoneStory,
    docs: { description: { component: 'One invoice on a phone, opened at 375 px. A detail Mobile Header with back and a More button that opens an Action Sheet (Share, Duplicate, Download PDF, Delete). Under it the status, the customer, the line items, the credit and the total. The Bottom Action Bar holds the one decision, "Mark as paid", and a quiet "Send reminder". Delete from the sheet asks again before anything is removed. Guide: eggux build-ui/patterns/mobile.md' } },
  },
  globals: phoneGlobals,
  render: () => <MobileInvoiceDetailPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** After the payment: the badge says Paid and both actions are done. */
export const Paid: Story = { render: () => <MobileInvoiceDetailPage initialStatus="Paid" /> };

/** The More button opened: four actions, Delete last and red. */
export const ActionSheetOpen: Story = { render: () => <MobileInvoiceDetailPage initialSheetOpen /> };

/** Delete asks again: it names the invoice and says it cannot be undone. */
export const ConfirmDelete: Story = { render: () => <MobileInvoiceDetailPage initialConfirmOpen /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await expect(c.getByRole('heading', { level: 1, name: 'INV-2041' })).toBeVisible();
    await expect(c.getAllByRole('banner')).toHaveLength(1);
    await expect(c.getAllByRole('main')).toHaveLength(1);
    await expect(c.getByRole('list', { name: 'Line items' })).toBeVisible();
    await expect(c.getByText('€1,446.00')).toBeVisible();

    // The action sheet: Share confirms with a message and closes.
    await userEvent.click(c.getByRole('button', { name: 'More actions for INV-2041' }));
    const sheet = await screen.findByRole('dialog', { name: 'INV-2041' });
    await expect(within(sheet).getAllByRole('button').map(b => b.textContent)).toEqual(['Share', 'Duplicate', 'Download PDF', 'Delete', 'Cancel']);
    await userEvent.click(within(sheet).getByRole('button', { name: 'Share' }));
    await waitFor(() => expect(c.getByText('Link to INV-2041 copied.')).toBeVisible());
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    // Delete asks again; keeping the invoice leaves the page as it was.
    await userEvent.click(c.getByRole('button', { name: 'More actions for INV-2041' }));
    await userEvent.click(within(await screen.findByRole('dialog', { name: 'INV-2041' })).getByRole('button', { name: 'Delete' }));
    const ask = await screen.findByRole('alertdialog', { name: 'Delete INV-2041?' });
    await userEvent.click(within(ask).getByRole('button', { name: 'Keep invoice' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(c.getByRole('list', { name: 'Line items' })).toBeVisible();

    // Mark as paid.
    await userEvent.click(c.getByRole('button', { name: 'Mark as paid' }));
    await waitFor(() => expect(c.getByText('INV-2041 marked as paid.')).toBeVisible());
    await expect(c.getByRole('button', { name: 'Paid' })).toBeDisabled();
    await expect(c.getByRole('button', { name: 'Send reminder' })).toBeDisabled();

    // Delete for real.
    await userEvent.click(c.getByRole('button', { name: 'More actions for INV-2041' }));
    await userEvent.click(within(await screen.findByRole('dialog', { name: 'INV-2041' })).getByRole('button', { name: 'Delete' }));
    await userEvent.click(within(await screen.findByRole('alertdialog', { name: 'Delete INV-2041?' })).getByRole('button', { name: 'Delete invoice' }));
    await waitFor(() => expect(page.getByRole('heading', { level: 2, name: 'Invoice deleted' })).toBeVisible());
    await expect(c.queryByRole('list', { name: 'Line items' })).toBeNull();
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Corporate Light' } };
export const ActionSheetOpenDark: Story = { ...ActionSheetOpen, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const ConfirmDeleteDark: Story = { ...ConfirmDelete, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
