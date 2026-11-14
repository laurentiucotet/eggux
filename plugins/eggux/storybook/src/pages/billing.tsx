import * as React from 'react';
import { Download } from '@/components/icons';
import { Alert } from '@/components/ui/alert';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonIcon } from '@/components/ui/button-icon';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { PageHeader } from '@/components/ui/page-header';
import { UsageMeter } from '@/components/ui/metrics';
import { PaymentMethodCard } from '@/components/ui/commerce';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SummaryList, SummaryRow } from '@/components/ui/summary-row';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableCellAmount, TableCellDate, TableCellText } from '@/components/ui/table-cells';
import { TablePagination } from '@/components/ui/table-pagination';
import { AppShell } from './app-parts';

type PlanId = 'starter' | 'pro' | 'business';
const plans: Record<PlanId, { name: string; price: number; seats: number; invoices: number; storage: number; blurb: string }> = {
  starter: { name: 'Starter', price: 19, seats: 3, invoices: 100, storage: 2, blurb: 'For one small team getting started.' },
  pro: { name: 'Pro', price: 49, seats: 10, invoices: 500, storage: 10, blurb: 'For growing teams with several clients.' },
  business: { name: 'Business', price: 129, seats: 50, invoices: 5000, storage: 100, blurb: 'For finance teams with approvals and audit needs.' },
};
const usage = { seats: 8, invoices: 412, storage: 6.2 };
const eur = (n: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(n);
const VAT = 0.19;
/** The demo date: cards that expire this or next month are flagged. */
const billingNow = '2026-11-14T10:00:00Z';

interface Card_ {
  id: string;
  brand: string;
  last4: string;
  expires: string;
}
const demoCards: Card_[] = [
  { id: 'c1', brand: 'Visa', last4: '4242', expires: '08/28' },
  { id: 'c2', brand: 'Mastercard', last4: '4444', expires: '01/27' },
  { id: 'c3', brand: 'Visa', last4: '1881', expires: '11/26' },
];

type InvoiceStatus = 'paid' | 'failed' | 'refunded';
interface Invoice {
  id: string;
  date: string;
  dateTime: string;
  amount: number;
  status: InvoiceStatus;
}
const months = ['Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan', 'Dec'];
const history = (failed: boolean): Invoice[] =>
  months.map((m, i) => ({
    id: `INV-${2026 - (i > 10 ? 1 : 0)}-${String(12 - i).padStart(3, '0')}`,
    date: `1 ${m} ${i > 10 ? 2025 : 2026}`,
    dateTime: `${i > 10 ? 2025 : 2026}-${String(((10 - i + 12) % 12) + 1).padStart(2, '0')}-01`,
    amount: i === 4 ? 58.31 : 58.31 + (i % 3) * 0,
    status: i === 0 && failed ? 'failed' : i === 7 ? 'refunded' : 'paid',
  }));
const statusBadge: Record<InvoiceStatus, { label: string; variant: NonNullable<BadgeProps['variant']> }> = {
  paid: { label: 'Paid', variant: 'soft-success' },
  failed: { label: 'Failed', variant: 'soft-destructive' },
  refunded: { label: 'Refunded', variant: 'soft-neutral' },
};

export interface BillingPageProps {
  /** Show the failed payment alert and mark the latest invoice and the card. */
  paymentFailed?: boolean;
}

/** Billing: current plan with usage meters, plan change, next invoice, payment methods and invoice history. */
export function BillingPage({ paymentFailed = false }: BillingPageProps) {
  const [failed, setFailed] = React.useState(paymentFailed);
  const [plan, setPlan] = React.useState<PlanId>('pro');
  const [choice, setChoice] = React.useState<PlanId>('pro');
  const [notice, setNotice] = React.useState<string | null>(null);
  const [cards, setCards] = React.useState(demoCards);
  const [defaultId, setDefaultId] = React.useState('c1');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [download, setDownload] = React.useState('');
  const [retrying, setRetrying] = React.useState(false);

  const p = plans[plan];
  const invoices = React.useMemo(() => history(failed), [failed]);
  const rows = invoices.slice((page - 1) * pageSize, page * pageSize);
  const net = p.price;
  const vat = net * VAT;
  const meters = [
    { label: 'Seats', value: usage.seats, max: p.seats, unit: 'seats' },
    { label: 'Invoices this month', value: usage.invoices, max: p.invoices, unit: undefined },
    { label: 'Storage', value: usage.storage, max: p.storage, unit: 'GB' },
  ];
  const over = usage.seats > p.seats || usage.invoices > p.invoices || usage.storage > p.storage;

  const changePlan = () => {
    setPlan(choice);
    setNotice(`Your plan changes to ${plans[choice].name} on your next invoice date, 1 Dec 2026.`);
  };
  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => {
      setRetrying(false);
      setFailed(false);
      setNotice('Payment received. Thank you, your account is up to date.');
    }, 400);
  };

  return (
    <AppShell active="settings" title="Billing" trail={[{ label: 'Settings', href: '#settings' }]}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <PageHeader title="Billing" description="Your plan, what you have used, how you pay and every invoice we sent." />

        {failed ? (
          <Alert
            variant="destructive"
            title="Your last payment failed"
            description="We could not charge the Visa ending 4242 for the invoice of 1 Nov 2026. Update the card or try again. Your workspace stays active until 8 Nov."
            actions={<Button size="sm" loading={retrying} onClick={retry}>Retry payment</Button>}
          />
        ) : null}
        {notice ? <Alert variant="success" title={notice} onDismiss={() => setNotice(null)} /> : null}

        <section aria-labelledby="plan-title" className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <Card className="gap-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <h2 id="plan-title" className="m-0 text-xl leading-7 font-semibold">Current plan: {p.name}</h2>
                <p className="m-0 text-sm leading-5 text-muted-foreground">{p.blurb}</p>
              </div>
              <p className="m-0 text-2xl leading-8 font-semibold tabular-nums">{eur(p.price)}<span className="text-sm font-normal text-muted-foreground"> / month</span></p>
            </div>
            <div className="flex flex-col gap-4">
              {meters.map(m => (
                <UsageMeter key={m.label} label={m.label} used={m.value} limit={m.max} unit={m.unit} />
              ))}
            </div>
            {over ? <Alert variant="warning" title="You use more than this plan includes" description="Pick a larger plan or remove people before the next invoice." /> : null}
            <form
              aria-label="Change plan"
              className="flex flex-wrap items-end gap-3 border-t border-border pt-5"
              onSubmit={e => { e.preventDefault(); if (choice !== plan) changePlan(); }}
            >
              <Field label="Plan" className="w-56">
                <Select value={choice} onValueChange={v => setChoice(v as PlanId)}>
                  <SelectTrigger />
                  <SelectContent>
                    {(Object.keys(plans) as PlanId[]).map(id => (
                      <SelectItem key={id} value={id} description={`${eur(plans[id].price)} / month`}>{plans[id].name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Button type="submit" disabled={choice === plan}>Change plan</Button>
            </form>
          </Card>

          <Card className="gap-4 p-6">
            <h2 className="m-0 text-base leading-6 font-semibold">Next invoice</h2>
            <p className="m-0 text-sm leading-5 text-muted-foreground">Due 1 Dec 2026, charged to the Visa ending 4242.</p>
            <SummaryList aria-label="Next invoice amounts">
              <SummaryRow label={`${p.name} plan`} value={eur(net)} />
              <SummaryRow label="VAT (19%)" value={eur(vat)} />
              <SummaryRow label="Total (EUR)" value={eur(net + vat)} variant="total" />
            </SummaryList>
          </Card>
        </section>

        <section aria-labelledby="payments-title" className="flex flex-col gap-3">
          <h2 id="payments-title" className="m-0 text-xl leading-7 font-semibold">Payment methods</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {cards.map(c => {
              const isDefault = c.id === defaultId;
              const declined = failed && c.id === 'c1';
              return (
                <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <PaymentMethodCard
                    className="min-w-64 flex-1"
                    now={billingNow}
                    brand={c.brand === 'Mastercard' ? 'MC' : c.brand.toUpperCase()}
                    label={`${c.brand} ending ${c.last4}`}
                    expiry={`Expires ${c.expires}`}
                    isDefault={isDefault}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    {declined ? <Badge variant="soft-destructive" dot>Declined</Badge> : null}
                    {isDefault ? null : (
                      <Button variant="outline" size="sm" onClick={() => { setDefaultId(c.id); setNotice(`${c.brand} ending ${c.last4} is now your default card.`); }}>
                        Make default<span className="sr-only"> {c.brand} ending {c.last4}</span>
                      </Button>
                    )}
                    {isDefault ? null : (
                      <Button variant="ghost" size="sm" onClick={() => { setCards(x => x.filter(y => y.id !== c.id)); setNotice(`${c.brand} ending ${c.last4} was removed.`); }}>
                        Remove<span className="sr-only"> {c.brand} ending {c.last4}</span>
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="history-title" className="flex flex-col gap-3">
          <h2 id="history-title" className="m-0 text-xl leading-7 font-semibold">Invoice history</h2>
          <Card className="overflow-hidden p-0">
            <Table aria-labelledby="history-title">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-36">Invoice</TableHead>
                  <TableHead className="min-w-32">Date</TableHead>
                  <TableHead className="min-w-28 text-right">Amount</TableHead>
                  <TableHead className="min-w-28">Status</TableHead>
                  <TableHead className="w-16"><span className="sr-only">Download</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(i => (
                  <TableRow key={i.id}>
                    <TableCell><TableCellText textStyle="strong">{i.id}</TableCellText></TableCell>
                    <TableCell><TableCellDate date={i.date} dateTime={i.dateTime} /></TableCell>
                    <TableCell><TableCellAmount amount={i.amount} /></TableCell>
                    <TableCell><Badge variant={statusBadge[i.status].variant} dot>{statusBadge[i.status].label}</Badge></TableCell>
                    <TableCell>
                      <ButtonIcon variant="ghost" icon={<Download />} label={`Download invoice ${i.id}`} onClick={() => setDownload(`Preparing ${i.id}.pdf (demo, nothing is downloaded).`)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <div className="overflow-x-auto">
            <TablePagination page={page} pageSize={pageSize} total={invoices.length} noun="invoices" pageSizes={[5, 10]} onPageChange={setPage} onPageSizeChange={s => { setPageSize(s); setPage(1); }} />
          </div>
          <p role="status" aria-live="polite" className="m-0 min-h-5 text-sm leading-5 text-muted-foreground">{download}</p>
        </section>
      </div>
    </AppShell>
  );
}
