import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './button';
import { ExportDialog, type ExportColumn, type ExportFormat } from './export-dialog';

type Args = { open: boolean; busy: boolean; format: ExportFormat; filteredCount: number; selectedCount: number; columnCount: number };

const allColumns: ExportColumn[] = [
  { id: 'email', label: 'Email' },
  { id: 'full_name', label: 'Full name' },
  { id: 'company', label: 'Company' },
  { id: 'plan', label: 'Plan' },
  { id: 'monthly_budget_eur', label: 'Monthly budget (EUR)' },
  { id: 'signed_up_on', label: 'Signed up on' },
];

const onExport = fn();

const meta = {
  title: 'Components/Data Transfer/Export Dialog',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A Dialog for exporting rows: format radios (CSV, XLSX, JSON), a range (all, filtered, selected; a range with no rows is disabled), a column checklist with Select all and a Start export button with a busy state. Start export calls onExport({ format, range, columns }); the parent runs the job and sets busy. Code only (no Figma component yet).',
      },
    },
  },
  args: { open: true, busy: false, format: 'csv', filteredCount: 86, selectedCount: 0, columnCount: 6 },
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Start with the dialog open.', table: { category: 'Dialog' } },
    busy: { name: 'Busy', control: 'boolean', description: 'The export is running: options lock and the button shows a spinner.', table: { category: 'Dialog' } },
    format: { name: 'Format', control: 'inline-radio', options: ['csv', 'xlsx', 'json'], description: 'The format chosen at first.', table: { category: 'Dialog' } },
    filteredCount: { name: 'Filtered rows', control: { type: 'range', min: 0, max: 1240, step: 1 }, description: 'Rows that match the current filter. Zero disables the range.', table: { category: 'Counts' } },
    selectedCount: { name: 'Selected rows', control: { type: 'range', min: 0, max: 1240, step: 1 }, description: 'Rows ticked in the table. Zero disables the range.', table: { category: 'Counts' } },
    columnCount: { name: 'Columns', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'Columns in the checklist.', table: { category: 'Counts' } },
  },
  render: ({ open, busy, format, filteredCount, selectedCount, columnCount }) => (
    <ExportDialog
      key={String(open)}
      defaultOpen={open}
      trigger={<Button variant="outline">Export</Button>}
      columns={allColumns.slice(0, columnCount)}
      counts={{ all: 1240, filtered: filteredCount, selected: selectedCount }}
      defaultFormat={format}
      busy={busy}
      onExport={onExport}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  args: { open: false },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Export' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Export customers' });
    const d = within(dialog);
    await expect(d.getByRole('radio', { name: /^CSV/ })).toBeChecked();
    await expect(d.getByRole('radio', { name: /^All rows/ })).toBeChecked();
    // A range with no rows is disabled and says why.
    await expect(d.getByRole('radio', { name: /^Selected rows/ })).toBeDisabled();
    await expect(d.getByText('No rows are selected.')).toBeVisible();
    // Select all is mixed once one column is off.
    const all = d.getByRole('checkbox', { name: 'Select all' });
    await expect(all).toBeChecked();
    await userEvent.click(d.getByRole('checkbox', { name: 'Plan' }));
    await waitFor(() => expect(all).toHaveAttribute('aria-checked', 'mixed'));
    await userEvent.click(d.getByRole('radio', { name: /^XLSX/ }));
    await userEvent.click(d.getByRole('radio', { name: /^Filtered rows/ }));
    await userEvent.click(d.getByRole('button', { name: 'Start export' }));
    await waitFor(() =>
      expect(onExport).toHaveBeenLastCalledWith({ format: 'xlsx', range: 'filtered', columns: ['email', 'full_name', 'company', 'monthly_budget_eur', 'signed_up_on'] }),
    );
    // Escape closes; focus goes back to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** The export is running: options are locked and Start export shows a spinner. */
export const Busy: Story = { args: { busy: true } };

export const BusyCheck: Story = {
  tags: ['!dev'],
  args: { busy: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Export customers' });
    const d = within(dialog);
    const start = d.getByRole('button', { name: 'Start export' });
    await expect(start).toHaveAttribute('aria-busy', 'true');
    await expect(d.getByRole('radio', { name: /^CSV/ })).toBeDisabled();
    await expect(d.getByRole('checkbox', { name: 'Select all' })).toBeDisabled();
    await expect(d.getByRole('status')).toHaveTextContent('Preparing your export');
    onExport.mockClear();
    await userEvent.click(start);
    await expect(onExport).not.toHaveBeenCalled();
  },
};

export const NoColumnsCheck: Story = {
  tags: ['!dev'],
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Export customers' });
    const d = within(dialog);
    await userEvent.click(d.getByRole('checkbox', { name: 'Select all' }));
    await waitFor(() => expect(d.getByRole('button', { name: 'Start export' })).toBeDisabled());
    await expect(d.getByText('Choose at least one column.')).toBeVisible();
    // Keyboard: Tab can still reach Select all again; Space turns every column back on.
    d.getByRole('checkbox', { name: 'Select all' }).focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(d.getByRole('button', { name: 'Start export' })).toBeEnabled());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <ExportDialog
      defaultOpen
      contentClassName="w-[276px]"
      title="Export the quarterly customer and subscription file"
      columns={[
        { id: 'a', label: 'Subscription renewal date in the local time zone of the office' },
        ...allColumns,
      ]}
      counts={{ all: 1_234_567, filtered: 12_345, selected: 0 }}
    />
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth + 1);
    await expect(Math.round(dialog.getBoundingClientRect().width)).toBeLessThanOrEqual(276);
    await expect(within(dialog).getByRole('button', { name: 'Start export' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...NoColumnsCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...NoColumnsCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
