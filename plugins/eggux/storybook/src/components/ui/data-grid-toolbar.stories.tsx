import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { ChevronDown, ChevronsUpDown, Columns3, Download } from '@/components/icons';
import { Button } from './button';
import { ColumnSettings, type ColumnDef } from './column-settings';
import { DataGridFiltersButton, DataGridToolbar } from './data-grid-toolbar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { SearchField } from './search-field';
import { TablePagination } from './table-pagination';

const columns: ColumnDef[] = [
  { id: 'customer', label: 'Customer', locked: true },
  { id: 'status', label: 'Status' },
  { id: 'amount', label: 'Amount' },
  { id: 'due', label: 'Due date' },
  { id: 'owner', label: 'Owner' },
  { id: 'created', label: 'Created' },
];

function Toolbar({ onApply = fn() }: { onApply?: (s: { order: string[]; visible: string[] }) => void }) {
  return (
    <DataGridToolbar
      start={
        <>
          <Button variant="outline" size="sm">All invoices<ChevronsUpDown aria-hidden="true" /></Button>
          <SearchField placeholder="Search invoices" className="w-[260px]" />
          <DataGridFiltersButton count={3} />
        </>
      }
      end={
        <>
          <Popover>
            <PopoverTrigger asChild><Button variant="ghost" size="sm"><Columns3 aria-hidden="true" />Columns</Button></PopoverTrigger>
            <PopoverContent align="end" aria-label="Columns" className="w-auto p-0">
              <ColumnSettings columns={columns} defaultVisible={['customer', 'status', 'amount', 'due']} onApply={onApply} />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="sm">Group: Status<ChevronDown aria-hidden="true" /></Button>
          <Button variant="outline" size="sm"><Download aria-hidden="true" />Export</Button>
        </>
      }
    />
  );
}

const meta = {
  title: 'Components/Table/Data Grid Toolbar',
  component: DataGridToolbar,
  parameters: { controls: { disable: true },
    layout: 'padded',
    docs: { description: { component: 'Above a data grid: saved view, search, filters with the active count (Start), then columns, group by and export (End). The End slot wraps under the Start slot when both do not fit (min 512). While rows are selected, Table Toolbar takes its place. Columns opens Column Settings; Table Pagination sits under the table. Figma: Table page / Data Grid Toolbar, Column Settings, Column Settings Item, Table Pagination. Guide: eggux build-ui/components/table.md' } },
  },
  render: () => <div className="w-[1200px]"><Toolbar /></div>,
} satisfies Meta<typeof DataGridToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 1200 × 36 in one row; Filters named with the count; Columns opens Column Settings (288).
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const bar = canvasElement.querySelector('[data-slot="data-grid-toolbar"]')!;
    await expect(Math.round(box(bar).height)).toBe(36);
    await expect(canvas.getByRole('button', { name: /Filters.*3 active/ })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
    const dialog = await screen.findByRole('dialog', { name: 'Columns' });
    await expect(Math.round(box(dialog.querySelector('[data-slot="column-settings"]')!).width)).toBe(288);
  },
};

// Column Settings: locked Customer, hide Status, show Owner, Alt+Down moves Amount, Apply returns the state.
export const ColumnSettingsFlow: Story = {
  render: function Render() {
    const [state, setState] = React.useState<string>('');
    return (
      <div className="w-[1200px]">
        <Toolbar onApply={s => setState(s.visible.join(','))} />
        <p className="mt-4 text-sm">Visible: {state}</p>
      </div>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
    const dialog = await screen.findByRole('dialog', { name: 'Columns' });
    const customer = within(dialog).getByRole('checkbox', { name: /Customer/ });
    await expect(customer).toBeDisabled();
    await expect(customer).toBeChecked();
    const rows = dialog.querySelectorAll('[data-slot="column-settings-item"]');
    await expect(Math.round(box(rows[1]!).height)).toBe(32);
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Status' }));
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Owner' }));
    within(dialog).getByRole('checkbox', { name: 'Amount' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    await waitFor(() => expect(within(dialog).getByRole('checkbox', { name: 'Amount' })).toHaveFocus());
    await userEvent.click(within(dialog).getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(canvas.getByText('Visible: customer,due,amount,owner')).toBeInTheDocument());
  },
};


const fire = (el: Element, type: string, y: number) =>
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: el.getBoundingClientRect().left + 4, clientY: y, button: 0, pointerId: 1, isPrimary: true, pointerType: 'mouse' }));
const frame = () => new Promise(r => requestAnimationFrame(() => r(null)));
/** Pointer drag of a grip to a y position; checks the drop line while over the target. */
async function dragTo(grip: Element, toY: number, root: Element) {
  const r = grip.getBoundingClientRect();
  const y0 = r.top + r.height / 2;
  fire(grip, 'pointerdown', y0);
  fire(grip, 'pointermove', y0 + (toY > y0 ? 8 : -8));
  await frame();
  fire(grip, 'pointermove', toY);
  await frame();
  await expect(root.querySelector('[data-slot="drop-indicator"]')).not.toBeNull();
  fire(grip, 'pointerup', toY);
  await frame();
}

// Column Settings pointer drag: Owner moves above Status; it cannot pass the locked Customer.
export const ColumnSettingsDrag: Story = {
  render: function Render() {
    const [order, setOrder] = React.useState('');
    return (
      <div className="flex flex-col gap-4">
        <Popover><ColumnSettings columns={columns} defaultVisible={["customer", "status", "amount", "due"]} showFooter={false} onApply={s => setOrder(s.order.join(","))} className="rounded-lg border border-border" /></Popover>
        <p className="text-sm">Order: {order}</p>
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="column-settings"]')!;
    const rows = () => Array.from(root.querySelectorAll('[data-slot="column-settings-item"]'));
    const grip = (id: string) => root.querySelector(`[data-column-id="${id}"] [data-slot="column-grip"]`)!;
    await dragTo(grip('owner'), rows()[1]!.getBoundingClientRect().top + 4, root);
    await waitFor(() => expect(canvas.getByText('Order: customer,owner,status,amount,due,created')).toBeInTheDocument());
    // Dropping above the locked first column lands right after it.
    await dragTo(grip('created'), rows()[0]!.getBoundingClientRect().top + 2, root);
    await waitFor(() => expect(canvas.getByText('Order: customer,created,owner,status,amount,due')).toBeInTheDocument());
  },
};

// Table Pagination under a table: range, rows per page, numbered pagination.
export const Pagination: Story = {
  render: function Render() {
    const [page, setPage] = React.useState(1);
    const [size, setSize] = React.useState(20);
    return <div className="w-[1040px]"><TablePagination page={page} pageSize={size} total={1284} noun="invoices" onPageChange={setPage} onPageSizeChange={setSize} /></div>;
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Showing 1-20 of 1,284 invoices')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Page 2' }));
    await expect(canvas.getByText('Showing 21-40 of 1,284 invoices')).toBeInTheDocument();
    await expect(canvas.getByRole('combobox', { name: 'Rows per page' })).toHaveTextContent('20');
  },
};

// Stress: at 512 the End slot wraps under Start; a single page shows only the range. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-[512px]"><Toolbar /></div>
      <div className="w-[600px]"><TablePagination page={1} pageSize={20} total={12} noun="invoices" /></div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const start = canvasElement.querySelector('[data-slot="data-grid-toolbar-start"]')!;
    const end = canvasElement.querySelector('[data-slot="data-grid-toolbar-end"]')!;
    await expect(box(end).top).toBeGreaterThanOrEqual(box(start).bottom);
    await expect(canvas.getByText('Showing 1-12 of 12 invoices')).toBeInTheDocument();
    await expect(canvas.queryByRole('navigation', { name: 'Pagination' })).toBeNull();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
