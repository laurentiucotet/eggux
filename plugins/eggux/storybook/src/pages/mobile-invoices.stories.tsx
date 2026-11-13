import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MobileInvoicesPage } from './mobile-invoices';
import { phoneGlobals, phoneStory } from './mobile-parts';

const meta = {
  title: 'Pages/Mobile/Mobile Invoices',
  parameters: {
    ...phoneStory,
    docs: { description: { component: 'The invoice list on a phone, opened at 375 px. A Mobile Header with a large title and a search button, a list of Swipe Rows (swipe left, or focus a row and press the Left arrow, for Archive and Delete), status badges, an extended FAB for "New invoice" and the Bottom Nav with Invoices active. Pull the list down, or use the Refresh button that appears on keyboard focus, and a new invoice comes in. Search opens the search header and filters by number or customer; Cancel brings the list back. Archive and Delete can be undone. Guide: eggux build-ui/patterns/mobile.md' } },
  },
  globals: phoneGlobals,
  render: () => <MobileInvoicesPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Search open with a query: the header turns into the search field and the list is filtered. */
export const Searching: Story = { render: () => <MobileInvoicesPage initialSearching initialQuery="bright" /> };

/** Nothing matches the query. */
export const NoResults: Story = { render: () => <MobileInvoicesPage initialSearching initialQuery="zzz" /> };

/** A new account: no invoices yet. */
export const Empty: Story = { render: () => <MobileInvoicesPage initialInvoices={[]} /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  render: () => <MobileInvoicesPage refreshDelay={20} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Invoices' })).toBeVisible();
    await expect(c.getAllByRole('banner')).toHaveLength(1);
    await expect(c.getAllByRole('main')).toHaveLength(1);
    await expect(c.getAllByRole('navigation')).toHaveLength(1);
    await expect(c.getByRole('link', { name: /Invoices/, current: 'page' })).toBeVisible();
    await expect(c.getByRole('button', { name: 'New invoice' })).toBeVisible();
    await expect(c.getAllByRole('group', { name: /^Invoice INV-/ })).toHaveLength(5);

    // Pull to refresh (the keyboard button does the same): a new invoice on top.
    await userEvent.click(c.getByRole('button', { name: 'Refresh' }));
    await waitFor(() => expect(c.getByRole('group', { name: 'Invoice INV-2042' })).toBeVisible());
    await expect(c.getAllByRole('group', { name: /^Invoice INV-/ })).toHaveLength(6);

    // Swipe by keyboard, archive, undo.
    const row = c.getByRole('group', { name: 'Invoice INV-2040' });
    row.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.click(await c.findByRole('button', { name: 'Archive' }));
    await waitFor(() => expect(c.queryByRole('group', { name: 'Invoice INV-2040' })).toBeNull());
    await expect(c.getByText(/INV-2040 archived./)).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Undo' }));
    await waitFor(() => expect(c.getByRole('group', { name: 'Invoice INV-2040' })).toBeVisible());

    // Search filters; Cancel restores the list and the large title.
    await userEvent.click(c.getByRole('button', { name: 'Search invoices' }));
    const field = await c.findByRole('searchbox');
    await userEvent.type(field, 'north');
    await waitFor(() => expect(c.getAllByRole('group', { name: /^Invoice INV-/ })).toHaveLength(1));
    await expect(c.getByRole('group', { name: 'Invoice INV-2041' })).toBeVisible();
    await expect(c.getByRole('heading', { level: 1, name: 'Invoices' })).toBeInTheDocument();
    await userEvent.clear(field);
    await userEvent.type(field, 'zzz');
    await expect(await c.findByText(/No invoices match/)).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(c.getAllByRole('group', { name: /^Invoice INV-/ })).toHaveLength(6));
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Corporate Light' } };
export const SearchingDark: Story = { ...Searching, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
