// Invoices page of the app: a Page Header with the one primary action, a Filter Bar (search plus
// Status, Owner and Due date as chips), a sortable Table with row selection, a Bulk Action Bar while rows
// are selected, Table Pagination and an empty-results state. Search, filters and sorting work on demo
// data (12 invoices); a change of filter or search goes back to page 1 and the result count is announced.
import * as React from 'react';
import { Archive, Check, Plus, Search } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { BulkActionBar } from '@/components/ui/bulk-action-bar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterBar, type FacetValue } from '@/components/ui/filters';
import { PageHeader } from '@/components/ui/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderLabel, TableRow, type TableSort } from '@/components/ui/table';
import { TableCellSelect } from '@/components/ui/table-cell-check';
import { TableCellAmount, TableCellDate, TableCellLink, TableCellStack } from '@/components/ui/table-cells';
import { TableCellUser } from '@/components/ui/table-cells-rich';
import { TablePagination } from '@/components/ui/table-pagination';
import { AppShell } from './app-parts';

export type InvoiceStatus = 'Paid' | 'Open' | 'Overdue' | 'Draft';
export interface DemoInvoice {
  id: string;
  customer: string;
  detail: string;
  owner: string;
  /** ISO date. */
  due: string;
  amount: number;
  status: InvoiceStatus;
}

export const demoInvoices: DemoInvoice[] = [
  { id: 'INV-1041', customer: 'Acme Ltd', detail: 'Website redesign', owner: 'Ana Popescu', due: '2026-11-26', amount: 12450, status: 'Open' },
  { id: 'INV-1042', customer: 'Northwind Traders', detail: 'Hosting, annual', owner: 'Mihai Ionescu', due: '2026-11-24', amount: 1890.5, status: 'Paid' },
  { id: 'INV-1043', customer: 'Globex', detail: 'Support plan', owner: 'Mihai Ionescu', due: '2026-11-04', amount: 640, status: 'Overdue' },
  { id: 'INV-1044', customer: 'Initech', detail: 'Audit workshop', owner: 'Dana Constantin', due: '2026-11-12', amount: 3200, status: 'Paid' },
  { id: 'INV-1045', customer: 'Umbrella', detail: 'Data migration', owner: 'Ana Popescu', due: '2026-10-22', amount: 8800, status: 'Overdue' },
  { id: 'INV-1046', customer: 'Hooli', detail: 'Training, 2 days', owner: 'Dana Constantin', due: '2026-11-18', amount: 2150, status: 'Open' },
  { id: 'INV-1047', customer: 'Stark Retail', detail: 'Licences, 40 seats', owner: 'Mihai Ionescu', due: '2026-12-11', amount: 4790.25, status: 'Open' },
  { id: 'INV-1048', customer: 'Wayne Logistics', detail: 'Consulting', owner: 'Ana Popescu', due: '2026-12-20', amount: 990, status: 'Draft' },
  { id: 'INV-1049', customer: 'Acme Ltd', detail: 'Maintenance, Q4', owner: 'Ana Popescu', due: '2026-10-28', amount: 2400, status: 'Paid' },
  { id: 'INV-1050', customer: 'Globex', detail: 'Extra seats', owner: 'Dana Constantin', due: '2026-10-20', amount: 560, status: 'Overdue' },
  { id: 'INV-1051', customer: 'Northwind Traders', detail: 'API add-on', owner: 'Mihai Ionescu', due: '2026-11-19', amount: 1200, status: 'Open' },
  { id: 'INV-1052', customer: 'Initech', detail: 'Design sprint', owner: 'Dana Constantin', due: '2027-01-05', amount: 6400, status: 'Draft' },
];

const statusVariant: Record<InvoiceStatus, 'soft-success' | 'soft-info' | 'soft-destructive' | 'soft-neutral'> = {
  Paid: 'soft-success',
  Open: 'soft-info',
  Overdue: 'soft-destructive',
  Draft: 'soft-neutral',
};

/** The demo "today": fixed so the Due date chip gives the same result on every day. */
const TODAY = new Date('2026-11-13T00:00:00');
const dayMs = 86_400_000;
const dueBucket = (iso: string) => {
  const days = Math.round((new Date(`${iso}T00:00:00`).getTime() - TODAY.getTime()) / dayMs);
  return days < 0 ? 'Past' : days <= 7 ? 'Next 7 days' : 'Later';
};
const dueText = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const facets = <T,>(rows: T[], pick: (r: T) => string, order?: string[]): FacetValue[] => {
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(pick(r), (counts.get(pick(r)) ?? 0) + 1);
  const values = order ?? [...counts.keys()].sort();
  return values.map(v => ({ value: v, label: v, count: counts.get(v) ?? 0 }));
};

type SortKey = 'id' | 'customer' | 'due' | 'amount';
type Dir = 'ascending' | 'descending';

const FIELDS = ['Status', 'Owner', 'Due date'] as const;
const emptyFilters = (): Record<string, string[]> => Object.fromEntries(FIELDS.map(f => [f, []]));

export interface InvoicesPageProps {
  /** Rows per page at the start. */
  pageSize?: number;
  /** Start with a search that matches nothing (the empty-results state). */
  initialQuery?: string;
}

export function InvoicesPage({ pageSize: initialPageSize = 5, initialQuery = '' }: InvoicesPageProps) {
  const [rows, setRows] = React.useState<DemoInvoice[]>(demoInvoices);
  const [query, setQuery] = React.useState(initialQuery);
  const [filters, setFilters] = React.useState<Record<string, string[]>>(emptyFilters);
  const [sort, setSort] = React.useState<{ key: SortKey; dir: Dir }>({ key: 'due', dir: 'ascending' });
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const q = query.trim().toLowerCase();
  const filtered = rows.filter(
    i =>
      (!q || `${i.id} ${i.customer} ${i.detail}`.toLowerCase().includes(q)) &&
      (!filters.Status.length || filters.Status.includes(i.status)) &&
      (!filters.Owner.length || filters.Owner.includes(i.owner)) &&
      (!filters['Due date'].length || filters['Due date'].includes(dueBucket(i.due))),
  );
  const dir = sort.dir === 'ascending' ? 1 : -1;
  const sorted = [...filtered].sort((a, b) => {
    if (sort.key === 'amount') return (a.amount - b.amount) * dir;
    if (sort.key === 'customer') return a.customer.localeCompare(b.customer) * dir;
    if (sort.key === 'due') return a.due.localeCompare(b.due) * dir;
    return a.id.localeCompare(b.id) * dir;
  });
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount);
  const shown = sorted.slice((current - 1) * pageSize, current * pageSize);
  const pageIds = shown.map(i => i.id);
  const allOnPage = pageIds.length > 0 && pageIds.every(id => selected.includes(id));
  const someOnPage = pageIds.some(id => selected.includes(id));
  const anyFilter = q !== '' || Object.values(filters).some(v => v.length);

  const toggleSort = (key: SortKey) => setSort(s => ({ key, dir: s.key === key && s.dir === 'ascending' ? 'descending' : 'ascending' }));
  const label = (k: SortKey): TableSort => (sort.key === k ? sort.dir : 'sortable');
  const aria = (k: SortKey) => (sort.key === k ? sort.dir : 'none');
  const clearAll = () => { setQuery(''); setFilters(emptyFilters()); setPage(1); };

  const markPaid = () => {
    setRows(r => r.map(i => (selected.includes(i.id) ? { ...i, status: 'Paid' as const } : i)));
    setSelected([]);
  };
  const archive = () => {
    setRows(r => r.filter(i => !selected.includes(i.id)));
    setSelected([]);
  };
  const newInvoice = () => {
    const next = `INV-${1053 + rows.filter(i => i.customer === 'New customer').length}`;
    setRows(r => [...r, { id: next, customer: 'New customer', detail: 'Draft invoice', owner: 'Ana Popescu', due: '2026-12-13', amount: 0, status: 'Draft' }]);
  };

  const count = `${sorted.length} of ${rows.length} invoices`;

  return (
    <AppShell active="invoices" title="Invoices">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4">
        <PageHeader
          title="Invoices"
          description="Create, send and follow up invoices."
          actions={<Button leadingIcon={<Plus />} onClick={newInvoice}>New invoice</Button>}
        />
        <FilterBar
          searchPlaceholder="Search invoices…"
          query={query}
          onQueryChange={v => { setQuery(v); setPage(1); }}
          fields={[
            { field: 'Status', options: facets(rows, i => i.status, ['Draft', 'Open', 'Overdue', 'Paid']) },
            { field: 'Owner', options: facets(rows, i => i.owner) },
            { field: 'Due date', options: facets(rows, i => dueBucket(i.due), ['Past', 'Next 7 days', 'Later']) },
          ]}
          value={filters}
          onValueChange={v => { setFilters(v); setPage(1); }}
          resultText={anyFilter ? count : `${rows.length} invoices`}
        />
        {selected.length ? (
          <div className="max-w-full overflow-x-auto">
            <BulkActionBar selection={`${selected.length} selected`} onClear={() => setSelected([])}>
              <Button variant="outline" size="sm" leadingIcon={<Check />} onClick={markPaid}>Mark paid</Button>
              <Button variant="outline" size="sm" leadingIcon={<Archive />} onClick={archive}>Archive</Button>
            </BulkActionBar>
          </div>
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
              <TableHead sort={aria('id')}><TableHeaderLabel label="Invoice" sort={label('id')} onSortClick={() => toggleSort('id')} /></TableHead>
              <TableHead sort={aria('customer')}><TableHeaderLabel label="Customer" sort={label('customer')} onSortClick={() => toggleSort('customer')} /></TableHead>
              <TableHead><TableHeaderLabel label="Status" /></TableHead>
              <TableHead><TableHeaderLabel label="Owner" /></TableHead>
              <TableHead sort={aria('due')}><TableHeaderLabel label="Due date" sort={label('due')} onSortClick={() => toggleSort('due')} /></TableHead>
              <TableHead sort={aria('amount')} className="text-right"><TableHeaderLabel label="Amount" align="right" sort={label('amount')} onSortClick={() => toggleSort('amount')} /></TableHead>
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
                  <TableCell><Badge variant={statusVariant[i.status]} dot>{i.status}</Badge></TableCell>
                  <TableCell><TableCellUser name={i.owner} /></TableCell>
                  <TableCell><TableCellDate date={dueText(i.due)} dateTime={i.due} /></TableCell>
                  <TableCell><TableCellAmount amount={i.amount} /></TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState
                    size="sm"
                    icon={<Search />}
                    title="No invoices match"
                    description="Change the search or the filters, or clear them to see every invoice."
                    actions={<Button variant="outline" size="sm" onClick={clearAll}>Clear filters</Button>}
                    headingLevel={2}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          className="min-w-0"
          page={current}
          pageSize={pageSize}
          total={sorted.length}
          noun="invoices"
          pageSizes={[5, 10]}
          onPageChange={setPage}
          onPageSizeChange={n => { setPageSize(n); setPage(1); }}
        />
      </div>
    </AppShell>
  );
}
