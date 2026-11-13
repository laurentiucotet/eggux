import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ImportPreviewTable, type ImportPreviewColumn, type ImportPreviewRow } from './import-preview-table';

type Args = { errorsOnly: boolean; rowCount: number; columnCount: number; showMoreRows: boolean; width: number };

const allColumns: ImportPreviewColumn[] = [
  { id: 'email', label: 'email' },
  { id: 'full_name', label: 'full_name' },
  { id: 'company', label: 'company' },
  { id: 'plan', label: 'plan' },
  { id: 'monthly_budget_eur', label: 'monthly_budget_eur' },
  { id: 'signed_up_on', label: 'signed_up_on' },
];

const allRows: ImportPreviewRow[] = [
  { number: 1, cells: { email: 'ana@acme.com', full_name: 'Ana Popescu', company: 'Acme Ltd', plan: 'team', monthly_budget_eur: '1200', signed_up_on: '2025-03-14' } },
  { number: 2, cells: { email: 'ion@acme.com', full_name: 'Ion Marin', company: 'Acme Ltd', plan: 'free', monthly_budget_eur: '0', signed_up_on: '2025-03-15' } },
  { number: 3, cells: { email: 'maria@acme', full_name: 'Maria Ene', company: 'Northwind', plan: 'gold', monthly_budget_eur: '800', signed_up_on: '2025-03-16' }, errors: { email: 'Not a valid email address', plan: 'Use free, team or business' } },
  { number: 4, cells: { email: 'radu@northwind.com', full_name: 'Radu Pop', company: 'Northwind', plan: 'business', monthly_budget_eur: '5400', signed_up_on: '2025-03-17' } },
  { number: 5, cells: { email: '', full_name: 'Elena Stan', company: 'Globex', plan: 'team', monthly_budget_eur: '950', signed_up_on: '2025-03-18' }, errors: { email: 'Email is required' } },
  { number: 6, cells: { email: 'dan@globex.com', full_name: 'Dan Avram', company: 'Globex', plan: 'team', monthly_budget_eur: '1,200.50', signed_up_on: '18/03/2025' }, errors: { monthly_budget_eur: 'Whole euros only', signed_up_on: 'Use YYYY-MM-DD' } },
];

const meta = {
  title: 'Components/Data Transfer/Import Preview Table',
  parameters: {
    docs: {
      description: {
        component:
          'The first rows of a file as the import will read them, with row numbers, error cells marked by an icon and a message, a summary ("48 rows ready, 3 with errors") and an Errors only filter. The table scrolls inside its own focusable region. Rows are data; nothing is parsed or checked here. Code only (no Figma component yet).',
      },
    },
  },
  args: { errorsOnly: false, rowCount: 6, columnCount: 6, showMoreRows: true, width: 640 },
  argTypes: {
    errorsOnly: { name: 'Errors only', control: 'boolean', description: 'Start with the filter on.', table: { category: 'Table' } },
    rowCount: { name: 'Rows', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'Rows in the preview.', table: { category: 'Table' } },
    columnCount: { name: 'Columns', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'Columns in the file.', table: { category: 'Table' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 900, step: 4 }, description: 'Container width in px. Narrow widths scroll inside the table.', table: { category: 'Table' } },
    showMoreRows: { name: 'File has more rows', control: 'boolean', description: 'The file is longer than the preview (51 rows in all).', table: { category: 'Parts' } },
  },
  render: ({ errorsOnly, rowCount, columnCount, showMoreRows, width }) => {
    const rows = allRows.slice(0, rowCount);
    const errors = rows.filter(r => r.errors).length;
    return (
      <div style={{ width }} className="max-w-full">
        <ImportPreviewTable
          key={String(errorsOnly)}
          defaultErrorsOnly={errorsOnly}
          columns={allColumns.slice(0, columnCount)}
          rows={rows}
          totalRows={showMoreRows ? 51 : rows.length}
          errorRows={showMoreRows ? 3 : errors}
        />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <ImportPreviewTable columns={allColumns} rows={allRows} totalRows={51} errorRows={3} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('48 rows ready, 3 with errors');
    const table = canvas.getByRole('table', { name: 'Import preview' });
    await expect(within(table).getAllByRole('row')).toHaveLength(7);
    await expect(within(table).getByRole('rowheader', { name: 'Row 3' })).toBeVisible();
    // Error cells carry text, not only color.
    await expect(within(table).getByText('Not a valid email address')).toBeVisible();
    await expect(within(table).getByText('(empty)')).toBeVisible();
    await expect(canvas.getByText('Showing the first 6 of 51 rows.')).toBeVisible();
    // The scroll region is a tab stop.
    await expect(canvas.getByRole('region', { name: 'Import preview, scrollable' })).toHaveAttribute('tabindex', '0');
  },
};

/** The filter on: only the rows with errors stay. */
export const ErrorsOnly: Story = { args: { errorsOnly: true } };

export const FilterCheck: Story = {
  tags: ['!dev'],
  render: () => <ImportPreviewTable columns={allColumns} rows={allRows} totalRows={51} errorRows={3} />,
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: 'Import preview' });
    const box = canvas.getByRole('checkbox', { name: 'Errors only' });
    // Keyboard: focus the checkbox and press Space.
    box.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(within(table).getAllByRole('row')).toHaveLength(4));
    await expect(within(table).queryByRole('rowheader', { name: 'Row 1' })).toBeNull();
    // The summary still counts the whole file.
    await expect(canvas.getByRole('status')).toHaveTextContent('48 rows ready, 3 with errors');
    await userEvent.keyboard(' ');
    await waitFor(() => expect(within(table).getAllByRole('row')).toHaveLength(7));
  },
};

export const NoErrorsCheck: Story = {
  tags: ['!dev'],
  render: () => <ImportPreviewTable columns={allColumns} rows={allRows.filter(r => !r.errors)} defaultErrorsOnly />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('3 rows ready, 0 with errors');
    await expect(canvas.getByText('No rows with errors in this preview.')).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ImportPreviewTable
      columns={[...allColumns, { id: 'notes', label: 'notes_from_the_account_manager_about_this_customer' }]}
      rows={allRows.map(r => ({ ...r, cells: { ...r.cells, notes: 'Asked for a longer trial period and an invoice in two parts' } }))}
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    // The page does not scroll sideways: the table scrolls inside its own container.
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth + 1);
    await expect(region).toHaveAttribute('tabindex', '0');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
