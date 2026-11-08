import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Archive, Download, Ellipsis, Mail, Package, Search, Send, Trash2, UserPlus } from '@/components/icons';
import { BulkActionBar } from './bulk-action-bar';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import { EmptyState } from './empty-state';
import { FacetedFilter, type FacetValue } from './filters';
import { Pagination } from './pagination';
import { SearchField } from './search-field';
import { StatusDot } from './status-dot';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableHeaderLabel, TableRow, type TableSort } from './table';
import { TableCellSelect } from './table-cell-check';
import { TableCellStatus } from './table-cell-status';
import { TableCellAmount, TableCellDate, TableCellLink, TableCellStack, TableCellText } from './table-cells';
import { TableCellBadges, TableCellMedia, TableCellUser } from './table-cells-rich';
import { TableCellTree } from './table-cell-tree';
import { TableColumnFilter, TableRangeFilter, TableTextFilter, rangeCount, type TableRange } from './table-filter';

const meta = {
  title: 'Components/Table/Examples',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: { description: { component: 'Complete tables built from the Table parts: sorting and filtering in the column headers (Table Column Filter: a list of values, a range or a text search), row selection with the Bulk Action Bar, row actions, status cells, a total, pagination, an empty state when filters match nothing, expandable rows and a sticky header. Filters apply at once; the result count is announced. Guide: eggux build-ui/components/table.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/* Shared helpers */

type Dir = 'ascending' | 'descending';
type SortState<K extends string> = { key: K; dir: Dir } | null;

function useSort<K extends string>(initial: SortState<K>) {
  const [sort, setSort] = React.useState<SortState<K>>(initial);
  const toggle = (key: K) => setSort(s => ({ key, dir: s?.key === key && s.dir === 'ascending' ? 'descending' : 'ascending' }));
  const label = (key: K): TableSort => (sort?.key === key ? sort.dir : 'sortable');
  const aria = (key: K) => (sort?.key === key ? sort.dir : 'none');
  return { sort, toggle, label, aria };
}

function sortRows<T, K extends string>(rows: T[], sort: SortState<K>, value: (row: T, key: K) => string | number) {
  if (!sort) return rows;
  const s = sort.dir === 'ascending' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = value(a, sort.key);
    const y = value(b, sort.key);
    return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * s;
  });
}

/** Facet values with their count in the data. */
function facets<T>(rows: T[], pick: (row: T) => string): FacetValue[] {
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(pick(r), (counts.get(pick(r)) ?? 0) + 1);
  return [...counts].map(([value, count]) => ({ value, label: value, count }));
}

const inRange = (n: number, r: TableRange) => (r.min === undefined || n >= r.min) && (r.max === undefined || n <= r.max);

function RowActions({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <ButtonIcon variant="ghost" size="xs" icon={<Ellipsis />} label={`Actions for ${name}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label={`Actions for ${name}`}>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Announces the result count after each filter change. */
const results = (root: HTMLElement) => root.querySelector<HTMLElement>('[data-slot="table-results"]')!;
const Results = ({ children }: { children: React.ReactNode }) => (
  <p role="status" data-slot="table-results" className="m-0 text-sm leading-5 text-muted-foreground">{children}</p>
);

function NoMatch({ colSpan, what, onClear }: { colSpan: number; what: string; onClear: () => void }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <EmptyState
          size="sm"
          icon={<Search />}
          title={`No ${what} match these filters`}
          description="Change or clear the filters to see more."
          actions={<Button variant="outline" size="sm" onClick={onClear}>Clear filters</Button>}
          headingLevel={3}
        />
      </TableCell>
    </TableRow>
  );
}

/* 1. Invoices */

type InvoiceStatus = 'Paid' | 'Open' | 'Overdue' | 'Draft';
interface Invoice { id: string; customer: string; detail: string; date: string; day: number; amount: number; status: InvoiceStatus }
const statusVariant: Record<InvoiceStatus, 'soft-success' | 'soft-info' | 'soft-destructive' | 'soft-neutral'> = { Paid: 'soft-success', Open: 'soft-info', Overdue: 'soft-destructive', Draft: 'soft-neutral' };

const invoices: Invoice[] = [
  { id: 'INV-1041', customer: 'Acme Ltd', detail: 'Website redesign', date: '12 Nov 2026', day: 316, amount: 12450, status: 'Open' },
  { id: 'INV-1042', customer: 'Northwind Traders', detail: 'Hosting, annual', date: '10 Nov 2026', day: 314, amount: 1890.5, status: 'Paid' },
  { id: 'INV-1043', customer: 'Globex', detail: 'Support plan', date: '04 Nov 2026', day: 308, amount: 640, status: 'Overdue' },
  { id: 'INV-1044', customer: 'Initech', detail: 'Audit workshop', date: '29 Oct 2026', day: 302, amount: 3200, status: 'Paid' },
  { id: 'INV-1045', customer: 'Umbrella', detail: 'Data migration', date: '22 Oct 2026', day: 295, amount: 8800, status: 'Overdue' },
  { id: 'INV-1046', customer: 'Hooli', detail: 'Training, 2 days', date: '18 Oct 2026', day: 291, amount: 2150, status: 'Paid' },
  { id: 'INV-1047', customer: 'Stark Retail', detail: 'Licences, 40 seats', date: '11 Oct 2026', day: 284, amount: 4790.25, status: 'Open' },
  { id: 'INV-1048', customer: 'Wayne Logistics', detail: 'Consulting', date: '02 Oct 2026', day: 275, amount: 990, status: 'Draft' },
  { id: 'INV-1049', customer: 'Acme Ltd', detail: 'Maintenance, Q4', date: '28 Sep 2026', day: 271, amount: 2400, status: 'Paid' },
  { id: 'INV-1050', customer: 'Globex', detail: 'Extra seats', date: '20 Sep 2026', day: 263, amount: 560, status: 'Overdue' },
  { id: 'INV-1051', customer: 'Northwind Traders', detail: 'API add-on', date: '14 Sep 2026', day: 257, amount: 1200, status: 'Paid' },
  { id: 'INV-1052', customer: 'Initech', detail: 'Design sprint', date: '05 Sep 2026', day: 248, amount: 6400, status: 'Draft' },
];

const eur = (n: number) => new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' }).format(n);
const PAGE = 5;

function InvoicesTable() {
  const [customer, setCustomer] = React.useState('');
  const [status, setStatus] = React.useState<string[]>([]);
  const [amount, setAmount] = React.useState<TableRange>({});
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const { sort, toggle, label, aria } = useSort<'id' | 'date' | 'amount'>({ key: 'date', dir: 'descending' });

  const filtered = invoices.filter(
    i => i.customer.toLowerCase().includes(customer.toLowerCase()) && (!status.length || status.includes(i.status)) && inRange(i.amount, amount),
  );
  const rows = sortRows(filtered, sort, (i, k) => (k === 'id' ? i.id : k === 'date' ? i.day : i.amount));
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const current = Math.min(page, pageCount);
  const shown = rows.slice((current - 1) * PAGE, current * PAGE);
  const total = filtered.reduce((s, i) => s + i.amount, 0);
  // Changing a filter goes back to page 1.
  const filter = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };
  const clearAll = () => { setCustomer(''); setStatus([]); setAmount({}); setPage(1); };
  const pageIds = shown.map(i => i.id);
  const allOnPage = pageIds.length > 0 && pageIds.every(id => selected.includes(id));
  const someOnPage = pageIds.some(id => selected.includes(id));

  return (
    <div className="flex w-[880px] max-w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-lg leading-7 font-semibold">Invoices</h2>
        <Button variant="outline" size="sm" leadingIcon={<Download />}>Export</Button>
      </div>
      {selected.length ? (
        <BulkActionBar selection={`${selected.length} selected`} onClear={() => setSelected([])}>
          <Button variant="outline" size="sm" leadingIcon={<Send />}>Send reminder</Button>
          <Button variant="outline" size="sm" leadingIcon={<Archive />}>Archive</Button>
        </BulkActionBar>
      ) : null}
      <Table aria-label="Invoices">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <TableCellSelect
                all
                name="invoices on this page"
                checked={allOnPage ? true : someOnPage ? 'indeterminate' : false}
                onCheckedChange={c => setSelected(s => (c === true ? [...new Set([...s, ...pageIds])] : s.filter(id => !pageIds.includes(id))))}
              />
            </TableHead>
            <TableHead sort={aria('id')}><TableHeaderLabel label="Invoice" sort={label('id')} onSortClick={() => toggle('id')} /></TableHead>
            <TableHead>
              <TableHeaderLabel label="Customer" filter={<TableColumnFilter label="Customer" active={customer ? 1 : 0}><TableTextFilter label="Customer" value={customer} onValueChange={filter(setCustomer)} /></TableColumnFilter>} />
            </TableHead>
            <TableHead>
              <TableHeaderLabel label="Status" filter={<TableColumnFilter label="Status" active={status.length}><FacetedFilter field="Status" options={facets(invoices, i => i.status)} value={status} onValueChange={filter(setStatus)} /></TableColumnFilter>} />
            </TableHead>
            <TableHead sort={aria('date')}><TableHeaderLabel label="Date" sort={label('date')} onSortClick={() => toggle('date')} /></TableHead>
            <TableHead sort={aria('amount')} className="text-right">
              <TableHeaderLabel
                label="Amount"
                align="right"
                sort={label('amount')}
                onSortClick={() => toggle('amount')}
                filter={<TableColumnFilter label="Amount" align="end" active={rangeCount(amount)}><TableRangeFilter label="Amount" unit="EUR" value={amount} onValueChange={filter(setAmount)} /></TableColumnFilter>}
              />
            </TableHead>
            <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.length ? shown.map(i => {
            const isSelected = selected.includes(i.id);
            return (
              <TableRow key={i.id} selected={isSelected}>
                <TableCell><TableCellSelect name={i.id} checked={isSelected} onCheckedChange={c => setSelected(s => (c === true ? [...s, i.id] : s.filter(x => x !== i.id)))} /></TableCell>
                <TableCell><TableCellLink href={`#${i.id}`}>{i.id}</TableCellLink></TableCell>
                <TableCell><TableCellStack title={i.customer} description={i.detail} /></TableCell>
                <TableCell><TableCellStatus label={i.status} variant={statusVariant[i.status]} showNote={i.status === 'Overdue'} note={`${316 - i.day} days late`} /></TableCell>
                <TableCell><TableCellDate date={i.date} /></TableCell>
                <TableCell><TableCellAmount amount={i.amount} /></TableCell>
                <TableCell>
                  <RowActions name={i.id}>
                    <DropdownMenuItem icon={<Send aria-hidden="true" />}>Send reminder</DropdownMenuItem>
                    <DropdownMenuItem icon={<Download aria-hidden="true" />}>Download PDF</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" icon={<Trash2 aria-hidden="true" />}>Delete</DropdownMenuItem>
                  </RowActions>
                </TableCell>
              </TableRow>
            );
          }) : <NoMatch colSpan={7} what="invoices" onClear={clearAll} />}
        </TableBody>
        {filtered.length ? (
          <TableFooter>
            <TableRow>
              <TableCell type="footer" colSpan={5}><TableCellText textStyle="strong">{`Total, ${filtered.length} invoices`}</TableCellText></TableCell>
              <TableCell type="footer"><TableCellAmount amount={total} /></TableCell>
              <TableCell type="footer" />
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Results>{filtered.length === invoices.length ? `${invoices.length} invoices` : `${filtered.length} of ${invoices.length} invoices, ${eur(total)}`}</Results>
        {pageCount > 1 ? <Pagination page={current} pageCount={pageCount} onPageChange={setPage} paginationStyle="simple" /> : null}
      </div>
    </div>
  );
}

/** Invoices: sort, filters in the headers (text, values, amount range), selection, bulk actions, total, pagination. */
export const Invoices: Story = {
  render: () => <InvoicesTable />,
  play: async ({ canvas, canvasElement }) => {
    const table = canvas.getByRole('table', { name: 'Invoices' });
    await expect(within(table).getAllByRole('row')).toHaveLength(1 + PAGE + 1);
    // Status filter: a list of values with counts; applies at once.
    await userEvent.click(canvas.getByRole('button', { name: 'Filter Status' }));
    const overdue = await screen.findByRole('checkbox', { name: /Overdue/ });
    await userEvent.click(overdue);
    await expect(canvas.getByRole('button', { name: 'Filter Status, 1 active' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(results(canvasElement)).toHaveTextContent('3 of 12 invoices'));
    const body = within(table).getAllByRole('rowgroup')[1]!;
    for (const row of within(body).getAllByRole('row')) await expect(row).toHaveTextContent('Overdue');
    // Amount range on top: only invoices of 600 EUR or more.
    await userEvent.click(canvas.getByRole('button', { name: 'Filter Amount' }));
    await userEvent.type(await screen.findByRole('textbox', { name: 'Min (EUR)' }), '600');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(results(canvasElement)).toHaveTextContent('2 of 12 invoices'));
    await expect(canvas.getByRole('button', { name: 'Filter Amount, 1 active' })).toBeVisible();
    // Select a row: the Bulk Action Bar shows.
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select INV-1043' }));
    await expect(canvas.getByText('1 selected')).toBeVisible();
    // A filter that matches nothing shows the empty state; Clear filters brings every row back.
    await userEvent.click(canvas.getByRole('button', { name: 'Filter Customer' }));
    await userEvent.type(await screen.findByRole('searchbox', { name: 'Customer contains' }), 'zzz');
    await userEvent.keyboard('{Escape}');
    await expect(await canvas.findByRole('heading', { name: 'No invoices match these filters' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await waitFor(() => expect(results(canvasElement)).toHaveTextContent('12 invoices'));
  },
};

/* 2. Team */

type Role = 'Owner' | 'Admin' | 'Member' | 'Viewer';
type MemberStatus = 'Active' | 'Invited' | 'Suspended';
interface Member { name: string; email: string; role: Role; status: MemberStatus; teams: string[]; lastActive: string; days: number }
const memberDot: Record<MemberStatus, 'success' | 'warning' | 'neutral'> = { Active: 'success', Invited: 'warning', Suspended: 'neutral' };

const members: Member[] = [
  { name: 'Ana Popescu', email: 'ana@acme.com', role: 'Owner', status: 'Active', teams: ['Finance', 'Leadership'], lastActive: 'Today', days: 0 },
  { name: 'Mihai Ionescu', email: 'mihai@acme.com', role: 'Admin', status: 'Active', teams: ['Support'], lastActive: 'Yesterday', days: 1 },
  { name: 'Dana Constantin', email: 'dana@acme.com', role: 'Member', status: 'Active', teams: ['Engineering', 'Design', 'Platform'], lastActive: '3 days ago', days: 3 },
  { name: 'Radu Marin', email: 'radu@acme.com', role: 'Member', status: 'Invited', teams: ['Engineering'], lastActive: 'Never', days: 999 },
  { name: 'Sofia Barbu', email: 'sofia@acme.com', role: 'Viewer', status: 'Active', teams: ['Sales'], lastActive: '2 weeks ago', days: 14 },
  { name: 'Ioana Georgescu', email: 'ioana@acme.com', role: 'Admin', status: 'Suspended', teams: ['Sales', 'Marketing'], lastActive: '3 months ago', days: 90 },
  { name: 'Victor Stan', email: 'victor@acme.com', role: 'Member', status: 'Active', teams: ['Product'], lastActive: 'Today', days: 0 },
];

function TeamTable() {
  const [name, setName] = React.useState('');
  const [roles, setRoles] = React.useState<string[]>([]);
  const [statuses, setStatuses] = React.useState<string[]>([]);
  const { sort, toggle, label, aria } = useSort<'name' | 'active'>({ key: 'name', dir: 'ascending' });
  const filtered = members.filter(
    m => (m.name + m.email).toLowerCase().includes(name.toLowerCase()) && (!roles.length || roles.includes(m.role)) && (!statuses.length || statuses.includes(m.status)),
  );
  const rows = sortRows(filtered, sort, (m, k) => (k === 'name' ? m.name : m.days));
  const clearAll = () => { setName(''); setRoles([]); setStatuses([]); };
  return (
    <div className="flex w-[880px] max-w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <h2 className="m-0 text-lg leading-7 font-semibold">Team members</h2>
          <Results>{filtered.length === members.length ? `${members.length} people` : `${filtered.length} of ${members.length} people`}</Results>
        </div>
        <Button size="sm" leadingIcon={<UserPlus />}>Invite people</Button>
      </div>
      <Table aria-label="Team members">
        <TableHeader>
          <TableRow>
            <TableHead sort={aria('name')}>
              <TableHeaderLabel
                label="Name"
                sort={label('name')}
                onSortClick={() => toggle('name')}
                filter={<TableColumnFilter label="Name" active={name ? 1 : 0}><TableTextFilter label="Name" value={name} onValueChange={setName} /></TableColumnFilter>}
              />
            </TableHead>
            <TableHead><TableHeaderLabel label="Role" filter={<TableColumnFilter label="Role" active={roles.length}><FacetedFilter field="Role" options={facets(members, m => m.role)} value={roles} onValueChange={setRoles} /></TableColumnFilter>} /></TableHead>
            <TableHead><TableHeaderLabel label="Status" filter={<TableColumnFilter label="Status" active={statuses.length}><FacetedFilter field="Status" options={facets(members, m => m.status)} value={statuses} onValueChange={setStatuses} /></TableColumnFilter>} /></TableHead>
            <TableHead><TableHeaderLabel label="Teams" /></TableHead>
            <TableHead sort={aria('active')}><TableHeaderLabel label="Last active" sort={label('active')} onSortClick={() => toggle('active')} /></TableHead>
            <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? rows.map(m => (
            <TableRow key={m.email}>
              <TableCell><TableCellUser name={m.name} email={m.email} /></TableCell>
              <TableCell><TableCellText>{m.role}</TableCellText></TableCell>
              <TableCell><StatusDot status={memberDot[m.status]} label={m.status} showLabel /></TableCell>
              <TableCell><TableCellBadges items={m.teams} max={2} label={`Teams of ${m.name}`} /></TableCell>
              <TableCell><TableCellText textStyle="muted">{m.lastActive}</TableCellText></TableCell>
              <TableCell>
                <RowActions name={m.name}>
                  <DropdownMenuItem icon={<Mail aria-hidden="true" />}>{m.status === 'Invited' ? 'Resend invite' : 'Send email'}</DropdownMenuItem>
                  <DropdownMenuItem>Change role</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" icon={<Trash2 aria-hidden="true" />}>Remove from workspace</DropdownMenuItem>
                </RowActions>
              </TableCell>
            </TableRow>
          )) : <NoMatch colSpan={6} what="people" onClear={clearAll} />}
        </TableBody>
      </Table>
    </div>
  );
}

/** Team: people with role, status and teams; filters on Name, Role and Status; sort by name or last activity. */
export const Team: Story = {
  render: () => <TeamTable />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filter Role' }));
    await userEvent.click(await screen.findByRole('checkbox', { name: /Admin/ }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(results(canvasElement)).toHaveTextContent('2 of 7 people'));
    await userEvent.click(canvas.getByRole('button', { name: 'Filter Status' }));
    await userEvent.click(await screen.findByRole('checkbox', { name: /Active/ }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(results(canvasElement)).toHaveTextContent('1 of 7 people'));
    await expect(canvas.getByText('Mihai Ionescu')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Actions for Mihai Ionescu' })).toBeVisible();
  },
};

/* 3. Orders with expandable rows */

type Fulfilment = 'Unfulfilled' | 'Shipped' | 'Delivered' | 'Returned';
interface Order { id: string; customer: string; date: string; day: number; fulfilment: Fulfilment; lines: { item: string; qty: number; price: number }[] }
const fulfilmentVariant: Record<Fulfilment, 'soft-warning' | 'soft-info' | 'soft-success' | 'soft-neutral'> = { Unfulfilled: 'soft-warning', Shipped: 'soft-info', Delivered: 'soft-success', Returned: 'soft-neutral' };
const orderTotal = (o: Order) => o.lines.reduce((s, l) => s + l.qty * l.price, 0);

const orders: Order[] = [
  { id: '#3021', customer: 'Elena Pavel', date: '12 Nov 2026', day: 316, fulfilment: 'Unfulfilled', lines: [{ item: 'Desk lamp, brass', qty: 1, price: 89 }, { item: 'LED bulb E27', qty: 3, price: 6.5 }] },
  { id: '#3020', customer: 'Andrei Neagu', date: '11 Nov 2026', day: 315, fulfilment: 'Shipped', lines: [{ item: 'Office chair', qty: 1, price: 249 }] },
  { id: '#3019', customer: 'Maria Ilie', date: '10 Nov 2026', day: 314, fulfilment: 'Delivered', lines: [{ item: 'Notebook A5, dotted', qty: 5, price: 7.9 }, { item: 'Fountain pen', qty: 1, price: 34 }, { item: 'Ink, blue', qty: 2, price: 9 }] },
  { id: '#3018', customer: 'Cristian Dobre', date: '08 Nov 2026', day: 312, fulfilment: 'Returned', lines: [{ item: 'Standing desk', qty: 1, price: 529 }] },
  { id: '#3017', customer: 'Ioana Rusu', date: '07 Nov 2026', day: 311, fulfilment: 'Delivered', lines: [{ item: 'Monitor arm', qty: 2, price: 79 }] },
  { id: '#3016', customer: 'Paul Stoica', date: '05 Nov 2026', day: 309, fulfilment: 'Shipped', lines: [{ item: 'Keyboard, low profile', qty: 1, price: 119 }, { item: 'Wrist rest', qty: 1, price: 19 }] },
];

function OrdersTable() {
  const [open, setOpen] = React.useState<string[]>(['#3019']);
  const [fulfilment, setFulfilment] = React.useState<string[]>([]);
  const [total, setTotal] = React.useState<TableRange>({});
  const { sort, toggle, label, aria } = useSort<'date' | 'total'>({ key: 'date', dir: 'descending' });
  const filtered = orders.filter(o => (!fulfilment.length || fulfilment.includes(o.fulfilment)) && inRange(orderTotal(o), total));
  const rows = sortRows(filtered, sort, (o, k) => (k === 'date' ? o.day : orderTotal(o)));
  const clearAll = () => { setFulfilment([]); setTotal({}); };
  return (
    <div className="flex w-[800px] max-w-full flex-col gap-3">
      <div className="flex flex-col">
        <h2 className="m-0 text-lg leading-7 font-semibold">Orders</h2>
        <Results>{filtered.length === orders.length ? `${orders.length} orders` : `${filtered.length} of ${orders.length} orders`}</Results>
      </div>
      <Table aria-label="Orders">
        <TableHeader>
          <TableRow>
            <TableHead><TableHeaderLabel label="Order" /></TableHead>
            <TableHead><TableHeaderLabel label="Customer" /></TableHead>
            <TableHead sort={aria('date')}><TableHeaderLabel label="Date" sort={label('date')} onSortClick={() => toggle('date')} /></TableHead>
            <TableHead><TableHeaderLabel label="Fulfilment" filter={<TableColumnFilter label="Fulfilment" active={fulfilment.length}><FacetedFilter field="Fulfilment" options={facets(orders, o => o.fulfilment)} value={fulfilment} onValueChange={setFulfilment} /></TableColumnFilter>} /></TableHead>
            <TableHead sort={aria('total')} className="text-right">
              <TableHeaderLabel
                label="Total"
                align="right"
                sort={label('total')}
                onSortClick={() => toggle('total')}
                filter={<TableColumnFilter label="Total" align="end" active={rangeCount(total)}><TableRangeFilter label="Total" unit="EUR" value={total} onValueChange={setTotal} /></TableColumnFilter>}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? rows.flatMap(o => {
            const expanded = open.includes(o.id);
            const row = (
              <TableRow key={o.id}>
                <TableCell>
                  <TableCellTree
                    label={o.id}
                    showIcon={false}
                    expander={expanded ? 'expanded' : 'collapsed'}
                    onExpandedChange={e => setOpen(s => (e ? [...s, o.id] : s.filter(x => x !== o.id)))}
                  />
                </TableCell>
                <TableCell><TableCellText textStyle="strong">{o.customer}</TableCellText></TableCell>
                <TableCell><TableCellDate date={o.date} /></TableCell>
                <TableCell><TableCellStatus label={o.fulfilment} variant={fulfilmentVariant[o.fulfilment]} showNote={false} /></TableCell>
                <TableCell><TableCellAmount amount={orderTotal(o)} /></TableCell>
              </TableRow>
            );
            if (!expanded) return [row];
            return [
              row,
              <TableRow key={`${o.id}-lines`}>
                <TableCell type="expanded" colSpan={5}>
                  <ul aria-label={`Items in order ${o.id}`} className="m-0 flex list-none flex-col gap-1.5 py-1 pr-1 pl-7">
                    {o.lines.map(l => (
                      <li key={l.item} className="flex items-center gap-3 text-sm leading-5">
                        <Package aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1 truncate">{l.item}</span>
                        <span className="text-muted-foreground">{`${l.qty} × ${eur(l.price)}`}</span>
                        <span className="w-24 text-right tabular-nums">{eur(l.qty * l.price)}</span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>,
            ];
          }) : <NoMatch colSpan={5} what="orders" onClear={clearAll} />}
        </TableBody>
      </Table>
    </div>
  );
}

/** Orders: rows expand to their items; filters on Fulfilment and Total; sort by date or total. */
export const Orders: Story = {
  render: () => <OrdersTable />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('list', { name: 'Items in order #3019' })).toBeVisible();
    const body = within(canvas.getByRole('table', { name: 'Orders' })).getAllByRole('rowgroup')[1]!;
    const expand = within(body).getAllByRole('button', { expanded: false })[0]!;
    await userEvent.click(expand);
    await expect(expand).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByRole('list', { name: /^Items in order/ })).toHaveLength(2);
    await userEvent.click(canvas.getByRole('button', { name: 'Filter Fulfilment' }));
    await userEvent.click(await screen.findByRole('checkbox', { name: /Shipped/ }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(results(canvasElement)).toHaveTextContent('2 of 6 orders'));
  },
};

/* 4. Inventory with a sticky header */

type StockState = 'In stock' | 'Low stock' | 'Out of stock';
interface Product { name: string; sku: string; category: string; stock: number; price: number }
const stockState = (n: number): StockState => (n === 0 ? 'Out of stock' : n < 20 ? 'Low stock' : 'In stock');
const stockVariant: Record<StockState, 'soft-success' | 'soft-warning' | 'soft-destructive'> = { 'In stock': 'soft-success', 'Low stock': 'soft-warning', 'Out of stock': 'soft-destructive' };

const products: Product[] = [
  { name: 'Desk lamp, brass', sku: 'LMP-001', category: 'Lighting', stock: 42, price: 89 },
  { name: 'LED bulb E27', sku: 'LMP-014', category: 'Lighting', stock: 380, price: 6.5 },
  { name: 'Office chair', sku: 'FRN-110', category: 'Furniture', stock: 12, price: 249 },
  { name: 'Standing desk', sku: 'FRN-120', category: 'Furniture', stock: 0, price: 529 },
  { name: 'Monitor arm', sku: 'ACC-031', category: 'Accessories', stock: 64, price: 79 },
  { name: 'Keyboard, low profile', sku: 'ACC-040', category: 'Accessories', stock: 18, price: 119 },
  { name: 'Wrist rest', sku: 'ACC-041', category: 'Accessories', stock: 95, price: 19 },
  { name: 'Notebook A5, dotted', sku: 'STN-201', category: 'Stationery', stock: 640, price: 7.9 },
  { name: 'Fountain pen', sku: 'STN-210', category: 'Stationery', stock: 7, price: 34 },
  { name: 'Ink, blue', sku: 'STN-211', category: 'Stationery', stock: 0, price: 9 },
  { name: 'Bookshelf, oak', sku: 'FRN-150', category: 'Furniture', stock: 25, price: 189 },
  { name: 'Cable tray', sku: 'ACC-060', category: 'Accessories', stock: 33, price: 24 },
];

function InventoryTable() {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<string[]>([]);
  const [state, setState] = React.useState<string[]>([]);
  const [stock, setStock] = React.useState<TableRange>({});
  const { sort, toggle, label, aria } = useSort<'name' | 'stock' | 'price'>({ key: 'name', dir: 'ascending' });
  const filtered = products.filter(
    p => (p.name + p.sku).toLowerCase().includes(query.toLowerCase()) && (!category.length || category.includes(p.category)) && (!state.length || state.includes(stockState(p.stock))) && inRange(p.stock, stock),
  );
  const rows = sortRows(filtered, sort, (p, k) => (k === 'name' ? p.name : k === 'stock' ? p.stock : p.price));
  const clearAll = () => { setQuery(''); setCategory([]); setState([]); setStock({}); };
  return (
    <div className="flex w-[880px] max-w-full flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h2 className="m-0 text-lg leading-7 font-semibold">Inventory</h2>
          <Results>{filtered.length === products.length ? `${products.length} products` : `${filtered.length} of ${products.length} products`}</Results>
        </div>
        <SearchField placeholder="Search name or SKU…" label="Search products" value={query} onValueChange={setQuery} debounce={0} showShortcut={false} className="w-64" />
      </div>
      {/* The header stays in view while the body scrolls inside 360 px. */}
      <Table aria-label="Inventory" containerClassName="max-h-[360px] overflow-y-auto rounded-md border border-border">
        <TableHeader className="sticky top-0 z-10">
          <TableRow>
            <TableHead sort={aria('name')}><TableHeaderLabel label="Product" sort={label('name')} onSortClick={() => toggle('name')} /></TableHead>
            <TableHead><TableHeaderLabel label="Category" filter={<TableColumnFilter label="Category" active={category.length}><FacetedFilter field="Category" options={facets(products, p => p.category)} value={category} onValueChange={setCategory} /></TableColumnFilter>} /></TableHead>
            <TableHead><TableHeaderLabel label="Availability" filter={<TableColumnFilter label="Availability" active={state.length}><FacetedFilter field="Availability" options={facets(products, p => stockState(p.stock))} value={state} onValueChange={setState} /></TableColumnFilter>} /></TableHead>
            <TableHead sort={aria('stock')} className="text-right">
              <TableHeaderLabel
                label="Stock"
                align="right"
                sort={label('stock')}
                onSortClick={() => toggle('stock')}
                filter={<TableColumnFilter label="Stock" align="end" active={rangeCount(stock)}><TableRangeFilter label="Stock" unit="units" value={stock} onValueChange={setStock} /></TableColumnFilter>}
              />
            </TableHead>
            <TableHead sort={aria('price')} className="text-right"><TableHeaderLabel label="Price" align="right" sort={label('price')} onSortClick={() => toggle('price')} /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? rows.map((p, i) => (
            <TableRow key={p.sku}>
              <TableCell striped={i % 2 === 1}><TableCellMedia title={p.name} meta={p.sku} icon={<Package />} /></TableCell>
              <TableCell striped={i % 2 === 1}><TableCellText>{p.category}</TableCellText></TableCell>
              <TableCell striped={i % 2 === 1}><TableCellStatus label={stockState(p.stock)} variant={stockVariant[stockState(p.stock)]} showNote={false} /></TableCell>
              <TableCell striped={i % 2 === 1}><TableCellText align="right">{p.stock.toLocaleString('en')}</TableCellText></TableCell>
              <TableCell striped={i % 2 === 1}><TableCellAmount amount={p.price} /></TableCell>
            </TableRow>
          )) : <NoMatch colSpan={5} what="products" onClear={clearAll} />}
        </TableBody>
      </Table>
    </div>
  );
}

/** Inventory: thumbnails, availability, a search above, filters on Category, Availability and Stock; the header stays while the body scrolls. */
export const Inventory: Story = {
  render: () => <InventoryTable />,
  play: async ({ canvas, canvasElement }) => {
    const container = canvasElement.querySelector<HTMLElement>('[data-slot="table-container"]')!;
    await expect(container.scrollHeight).toBeGreaterThan(container.clientHeight);
    const header = canvasElement.querySelector<HTMLElement>('[data-slot="table-header"]')!;
    const top = header.getBoundingClientRect().top;
    container.scrollTop = 200;
    await waitFor(() => expect(Math.round(header.getBoundingClientRect().top)).toBe(Math.round(top)));
    await userEvent.click(canvas.getByRole('button', { name: 'Filter Availability' }));
    await userEvent.click(await screen.findByRole('checkbox', { name: /Out of stock/ }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(results(canvasElement)).toHaveTextContent('2 of 12 products'));
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search products' }), 'ink');
    await waitFor(() => expect(results(canvasElement)).toHaveTextContent('1 of 12 products'));
  },
};

/* Hidden checks */

// Open filters: the popover content is named after the column (axe on the open popovers).
export const OpenStatusFilter: Story = {
  tags: ['!dev'],
  render: () => <InvoicesTable />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filter Status' }));
    await expect(await screen.findByRole('dialog', { name: 'Filter Status' })).toBeVisible();
  },
};
export const OpenRangeFilter: Story = {
  tags: ['!dev'],
  render: () => <InvoicesTable />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filter Amount' }));
    await userEvent.type(await screen.findByRole('textbox', { name: 'Min (EUR)' }), '9000');
    await userEvent.type(screen.getByRole('textbox', { name: 'Max (EUR)' }), '100');
    await expect(screen.getByText('Min is higher than Max.')).toBeVisible();
  },
};
export const InvoicesDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <InvoicesTable /> };
export const TeamDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <TeamTable /> };
export const OrdersCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <OrdersTable /> };
export const InventoryDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <InventoryTable /> };
