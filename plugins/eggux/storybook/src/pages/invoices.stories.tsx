import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { InvoicesPage } from './invoices';

const meta = {
  title: 'Pages/App/Invoices',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Invoices inside the app shell: a Page Header with New invoice, a Filter Bar (search and the chips Status, Owner and Due date), a sortable table with row selection, a Bulk Action Bar while rows are selected, pagination and an empty-results state. Search, filters and sorting work on 12 demo invoices; any change goes back to page 1. Select rows to mark them paid or archive them. Guide: eggux build-ui/components/table.md' } },
  },
  render: () => <InvoicesPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A search that matches nothing: the table says so and offers to clear the filters. */
export const NoResults: Story = { render: () => <InvoicesPage initialQuery="zzz" /> };

/* Hidden checks */

const bodyRows = (c: ReturnType<typeof within>) => within(c.getByRole('table', { name: 'Invoices' })).getAllByRole('row').slice(1);

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Invoices' })).toBeVisible();
    await expect(c.getAllByRole('main')).toHaveLength(1);
    await expect(c.getByRole('button', { name: 'New invoice' })).toBeVisible();
    // Page 1 of 3, oldest due date first.
    await expect(bodyRows(c)).toHaveLength(5);
    await expect(c.getByText('Showing 1-5 of 12 invoices')).toBeVisible();
    await expect(bodyRows(c)[0]).toHaveTextContent('INV-1050');
    await expect(c.getByRole('columnheader', { name: /Due date/ })).toHaveAttribute('aria-sort', 'ascending');

    // Sorting: Amount ascending, then descending.
    await userEvent.click(c.getByRole('button', { name: 'Amount' }));
    await waitFor(() => expect(c.getByRole('columnheader', { name: /Amount/ })).toHaveAttribute('aria-sort', 'ascending'));
    await expect(bodyRows(c)[0]).toHaveTextContent('INV-1050');
    await userEvent.click(c.getByRole('button', { name: 'Amount' }));
    await waitFor(() => expect(bodyRows(c)[0]).toHaveTextContent('INV-1041'));
    await expect(c.getByRole('columnheader', { name: /Due date/ })).toHaveAttribute('aria-sort', 'none');

    // Next page.
    await userEvent.click(c.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(c.getByText('Showing 6-10 of 12 invoices')).toBeVisible());

    // Search goes back to page 1.
    await userEvent.type(c.getByRole('searchbox', { name: 'Search invoices…' }), 'globex');
    await waitFor(() => expect(bodyRows(c)).toHaveLength(2));
    await expect(c.getByText('Showing 1-2 of 2 invoices')).toBeVisible();
    await userEvent.clear(c.getByRole('searchbox', { name: 'Search invoices…' }));
    await waitFor(() => expect(c.getByText('Showing 1-5 of 12 invoices')).toBeVisible());

    // Status chip: Overdue only.
    const chips = within(c.getByRole('search', { name: 'Filters' }));
    await userEvent.click(chips.getByRole('button', { name: /Status/ }));
    await userEvent.click(await screen.findByRole('checkbox', { name: /Overdue/ }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(c.getByText('Showing 1-3 of 3 invoices')).toBeVisible());
    for (const row of bodyRows(c)) await expect(row).toHaveTextContent('Overdue');

    // Owner chip on top: only Ana's overdue invoice.
    await userEvent.click(chips.getByRole('button', { name: /Owner/ }));
    await userEvent.click(await screen.findByRole('checkbox', { name: /Ana Popescu/ }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(bodyRows(c)).toHaveLength(1));
    await expect(bodyRows(c)[0]).toHaveTextContent('INV-1045');

    // Due date chip that excludes it: the empty state, then Clear filters.
    await userEvent.click(chips.getByRole('button', { name: /Due date/ }));
    await userEvent.click(await screen.findByRole('checkbox', { name: /Later/ }));
    await userEvent.keyboard('{Escape}');
    await expect(await c.findByRole('heading', { level: 2, name: 'No invoices match' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Clear filters' }));
    await waitFor(() => expect(c.getByText('Showing 1-5 of 12 invoices')).toBeVisible());
  },
};

export const SelectionCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryByRole('toolbar', { name: 'Bulk actions' })).toBeNull();
    await userEvent.click(c.getByRole('checkbox', { name: 'Select INV-1050' }));
    await expect(await c.findByText('1 selected')).toBeVisible();
    // Select all on this page.
    await userEvent.click(c.getByRole('checkbox', { name: 'Select all invoices on this page' }));
    await expect(await c.findByText('5 selected')).toBeVisible();
    // Mark paid: the status changes and the bar goes away.
    await userEvent.click(c.getByRole('button', { name: 'Mark paid' }));
    await waitFor(() => expect(c.queryByRole('toolbar', { name: 'Bulk actions' })).toBeNull());
    for (const row of bodyRows(c)) await expect(row).toHaveTextContent('Paid');
    // Archive one row: it leaves the list and the count follows.
    await userEvent.click(c.getByRole('checkbox', { name: 'Select INV-1050' }));
    await userEvent.click(await c.findByRole('button', { name: 'Archive' }));
    await waitFor(() => expect(c.getByText('Showing 1-5 of 11 invoices')).toBeVisible());
    await expect(c.queryByText('INV-1050')).toBeNull();
    // Clear selection with the x.
    await userEvent.click(c.getByRole('checkbox', { name: 'Select INV-1043' }));
    await userEvent.click(await c.findByRole('button', { name: 'Clear selection' }));
    await waitFor(() => expect(c.queryByRole('toolbar', { name: 'Bulk actions' })).toBeNull());
  },
};

export const NoResultsCheck: Story = {
  tags: ['!dev'],
  render: () => <InvoicesPage initialQuery="zzz" />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'No invoices match' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Clear filters' }));
    await waitFor(() => expect(bodyRows(c)).toHaveLength(5));
    await expect(c.getByRole('searchbox', { name: 'Search invoices…' })).toHaveValue('');
  },
};

/** At 375 px the phone shell shows and the page does not scroll sideways, also with rows selected. */
export const PhoneCheck: Story = {
  tags: ['!dev'],
  globals: { viewport: { value: 'base', isRotated: false } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getAllByRole('heading', { level: 1, name: 'Invoices' }).length).toBeGreaterThan(0);
    await userEvent.click(c.getByRole('checkbox', { name: 'Select INV-1050' }));
    await expect(await c.findByText('1 selected')).toBeVisible();
    await waitFor(() => expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth));
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const NoResultsDark: Story = { ...NoResults, tags: ['!dev'], globals: { theme: 'Dark' } };
