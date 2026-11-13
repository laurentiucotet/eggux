import * as React from 'react';
import { Archive, Search, Trash2 } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { BottomNav, BottomNavItem } from '@/components/ui/bottom-nav';
import { Button } from '@/components/ui/button';
import { ButtonIcon } from '@/components/ui/button-icon';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { MobileHeader } from '@/components/ui/mobile-header';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { SwipeRow } from '@/components/ui/swipe-row';
import { destinations } from './app-parts';
import { PhoneScreen } from './mobile-parts';

export type InvoiceStatus = 'Paid' | 'Sent' | 'Overdue' | 'Draft';

export interface InvoiceRecord {
  id: string;
  customer: string;
  /** Amount in cents. */
  amount: number;
  status: InvoiceStatus;
  due: string;
}

export const statusVariant = {
  Paid: 'soft-success',
  Sent: 'soft-info',
  Overdue: 'soft-destructive',
  Draft: 'soft-neutral',
} as const;

export const money = (cents: number) => `€${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const demoInvoices: InvoiceRecord[] = [
  { id: 'INV-2041', customer: 'Northwind Traders', amount: 124000, status: 'Sent', due: 'Due Nov 28' },
  { id: 'INV-2040', customer: 'Brightside Studio', amount: 48050, status: 'Overdue', due: 'Due Nov 02' },
  { id: 'INV-2039', customer: 'Lumen Labs', amount: 310000, status: 'Paid', due: 'Paid Nov 09' },
  { id: 'INV-2038', customer: 'Harbor & Co', amount: 9900, status: 'Draft', due: 'Not sent' },
  { id: 'INV-2037', customer: 'Fieldstone Bakery', amount: 21575, status: 'Paid', due: 'Paid Oct 30' },
];

/** What a pull to refresh brings in, one at a time. */
export const incomingInvoices: InvoiceRecord[] = [
  { id: 'INV-2042', customer: 'Orchard Row', amount: 67200, status: 'Sent', due: 'Due Dec 05' },
  { id: 'INV-2043', customer: 'Kite Analytics', amount: 152000, status: 'Draft', due: 'Not sent' },
  { id: 'INV-2044', customer: 'Pine & Quarry', amount: 18800, status: 'Sent', due: 'Due Dec 12' },
];

export interface MobileInvoicesPageProps {
  /** Start with the search open and this query typed. */
  initialQuery?: string;
  initialSearching?: boolean;
  /** Start with this list (an empty list shows the empty state). */
  initialInvoices?: InvoiceRecord[];
  /** Milliseconds a refresh takes. */
  refreshDelay?: number;
}

/** Invoices on a phone: large title, search, a list you can pull and swipe, a FAB, the Bottom Nav. */
export function MobileInvoicesPage({ initialQuery = '', initialSearching = false, initialInvoices = demoInvoices, refreshDelay = 500 }: MobileInvoicesPageProps) {
  const [invoices, setInvoices] = React.useState(initialInvoices);
  const [searching, setSearching] = React.useState(initialSearching);
  const [query, setQuery] = React.useState(initialQuery);
  const [message, setMessage] = React.useState('');
  const [removed, setRemoved] = React.useState<{ invoice: InvoiceRecord; index: number } | null>(null);
  const next = React.useRef(0);

  const q = query.trim().toLowerCase();
  const shown = q ? invoices.filter(i => i.id.toLowerCase().includes(q) || i.customer.toLowerCase().includes(q)) : invoices;

  const refresh = () =>
    new Promise<void>(resolve => {
      window.setTimeout(() => {
        const fresh = incomingInvoices[next.current];
        if (fresh) {
          next.current += 1;
          setInvoices(list => [fresh, ...list]);
          setMessage(`Updated. 1 new invoice: ${fresh.id}.`);
        } else {
          setMessage('Updated. You are up to date.');
        }
        resolve();
      }, refreshDelay);
    });

  const remove = (invoice: InvoiceRecord, verb: string) => {
    const index = invoices.findIndex(i => i.id === invoice.id);
    setInvoices(list => list.filter(i => i.id !== invoice.id));
    setRemoved({ invoice, index });
    setMessage(`${invoice.id} ${verb}.`);
  };
  const undo = () => {
    if (!removed) return;
    setInvoices(list => {
      const copy = [...list];
      copy.splice(Math.min(removed.index, copy.length), 0, removed.invoice);
      return copy;
    });
    setMessage(`${removed.invoice.id} restored.`);
    setRemoved(null);
  };

  const closeSearch = () => {
    setSearching(false);
    setQuery('');
  };

  const header = searching ? (
    <MobileHeader type="search" searchPlaceholder="Search invoices" query={query} onQueryChange={setQuery} onCancel={closeSearch} backLabel="Close search" onBack={closeSearch} />
  ) : (
    <MobileHeader
      type="app"
      size="large"
      title="Invoices"
      trailing={<ButtonIcon variant="ghost" icon={<Search />} label="Search invoices" className="min-h-11 min-w-11" showTooltip={false} onClick={() => setSearching(true)} />}
    />
  );

  return (
    <PhoneScreen
      header={header}
      className="flex flex-col p-0"
      footer={
        <>
          <Fab fixed fabType="extended" label="New invoice" />
          <BottomNav>
            {destinations.map(d => (
              <BottomNavItem key={d.id} href={`#${d.id}`} icon={d.icon} label={d.label} active={d.id === 'invoices'} badge={d.badge} />
            ))}
          </BottomNav>
        </>
      }
    >
      {searching ? <h1 className="sr-only">Invoices</h1> : null}
      <PullToRefresh onRefresh={refresh} className="flex-1 px-4 pb-24">
        <p role="status" className="m-0 min-h-5 py-1 text-sm leading-5 text-muted-foreground">
          {message}
          {removed ? (
            <>
              {' '}
              <Button type="button" variant="link" className="min-h-11" onClick={undo}>Undo</Button>
            </>
          ) : null}
        </p>
        {shown.length ? (
          <ul aria-label={q ? `Invoices matching ${query.trim()}` : 'Invoices'} className="m-0 flex list-none flex-col divide-y divide-border p-0">
            {shown.map(invoice => (
              <li key={invoice.id}>
                <SwipeRow
                  label={`Invoice ${invoice.id}`}
                  actions={[
                    { label: 'Archive', icon: <Archive />, onSelect: () => remove(invoice, 'archived') },
                    { label: 'Delete', icon: <Trash2 />, destructive: true, onSelect: () => remove(invoice, 'deleted') },
                  ]}
                >
                  <a href="#invoice-detail" className="flex min-h-16 items-center gap-3 px-1 py-3 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm leading-5 font-medium">{invoice.customer}</span>
                      <span className="truncate text-xs leading-4 text-muted-foreground">{invoice.id} · {invoice.due}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm leading-5 font-medium tabular-nums">{money(invoice.amount)}</span>
                      <Badge variant={statusVariant[invoice.status]} dot>{invoice.status}</Badge>
                    </span>
                  </a>
                </SwipeRow>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            size="sm"
            icon={<Search />}
            title={q ? `No invoices match “${query.trim()}”` : 'No invoices yet'}
            description={q ? 'Check the spelling, or search by invoice number.' : 'Create your first invoice with the New invoice button.'}
            headingLevel={2}
          />
        )}
      </PullToRefresh>
    </PhoneScreen>
  );
}
