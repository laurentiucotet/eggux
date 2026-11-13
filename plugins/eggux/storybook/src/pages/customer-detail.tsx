// Customer detail page of the app: a Page Header with a back link to the list, the customer name, a status
// Badge, a meta line and the page actions; Tabs for Overview (Stat Cards and a Description List),
// Invoices (a small table, or an empty state) and Activity (Activity Feed Items). An id that matches no
// customer shows the not-found state in the same shell. Demo data lives in this file.
import * as React from 'react';
import { Clock, Mail, MapPin, Plus, Receipt, UserPlus } from '@/components/icons';
import { ActivityFeed, ActivityFeedItem } from '@/components/ui/activity-feed-item';
import { BackLink } from '@/components/ui/back-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DescriptionList, DescriptionListItem } from '@/components/ui/description-list';
import { EmptyState } from '@/components/ui/empty-state';
import { MetaItem } from '@/components/ui/meta-item';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderLabel, TableRow } from '@/components/ui/table';
import { TableCellAmount, TableCellDate, TableCellLink } from '@/components/ui/table-cells';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppShell } from './app-parts';

type InvoiceStatus = 'Paid' | 'Open' | 'Overdue' | 'Draft';
interface CustomerInvoice { id: string; status: InvoiceStatus; due: string; dueText: string; amount: number }
interface CustomerEvent { actor: string; verb: string; object?: string; suffix?: string; time: string }

export interface DemoCustomer {
  id: string;
  name: string;
  status: 'Active' | 'Trial';
  email: string;
  phone: string;
  city: string;
  owner: string;
  since: string;
  terms: string;
  revenue: string;
  balance: string;
  avgDays: string;
  invoices: CustomerInvoice[];
  activity: CustomerEvent[];
}

export const demoCustomers: DemoCustomer[] = [
  {
    id: 'acme',
    name: 'Acme Ltd',
    status: 'Active',
    email: 'billing@acme.com',
    phone: '+40 21 555 0142',
    city: 'Bucharest, Romania',
    owner: 'Ana Popescu',
    since: 'March 2024',
    terms: 'Net 14',
    revenue: '€48,920',
    balance: '€12,450',
    avgDays: '11 days',
    invoices: [
      { id: 'INV-1041', status: 'Open', due: '2026-11-26', dueText: '26 Nov 2026', amount: 12450 },
      { id: 'INV-1049', status: 'Paid', due: '2026-10-28', dueText: '28 Oct 2026', amount: 2400 },
      { id: 'INV-1033', status: 'Paid', due: '2026-09-14', dueText: '14 Sep 2026', amount: 8900 },
      { id: 'INV-1021', status: 'Paid', due: '2026-07-30', dueText: '30 Jul 2026', amount: 6200 },
    ],
    activity: [
      { actor: 'Ana Popescu', verb: 'sent', object: 'INV-1041', suffix: 'to billing@acme.com', time: '1 hour ago' },
      { actor: 'Acme Ltd', verb: 'paid', object: 'INV-1049', time: '2 weeks ago' },
      { actor: 'Mihai Ionescu', verb: 'updated the payment terms to', object: 'Net 14', time: '2 months ago' },
      { actor: 'Ana Popescu', verb: 'added', object: 'Acme Ltd', suffix: 'as a customer', time: 'March 2024' },
    ],
  },
  {
    id: 'northwind',
    name: 'Northwind Traders',
    status: 'Active',
    email: 'accounts@northwind.example',
    phone: '+44 20 7946 0958',
    city: 'London, United Kingdom',
    owner: 'Mihai Ionescu',
    since: 'June 2025',
    terms: 'Net 30',
    revenue: '€7,240',
    balance: '€0',
    avgDays: '18 days',
    invoices: [
      { id: 'INV-1042', status: 'Paid', due: '2026-11-24', dueText: '24 Nov 2026', amount: 1890.5 },
      { id: 'INV-1051', status: 'Open', due: '2026-11-19', dueText: '19 Nov 2026', amount: 1200 },
    ],
    activity: [
      { actor: 'Northwind Traders', verb: 'paid', object: 'INV-1042', time: '12 minutes ago' },
      { actor: 'Mihai Ionescu', verb: 'created', object: 'INV-1051', time: '3 days ago' },
    ],
  },
  {
    id: 'wayne',
    name: 'Wayne Logistics',
    status: 'Trial',
    email: 'finance@wayne.example',
    phone: '',
    city: 'Cluj-Napoca, Romania',
    owner: 'Ana Popescu',
    since: 'November 2026',
    terms: 'Net 14',
    revenue: '€0',
    balance: '€0',
    avgDays: '-',
    invoices: [],
    activity: [{ actor: 'Dana Constantin', verb: 'added', object: 'Wayne Logistics', suffix: 'as a customer', time: '3 hours ago' }],
  },
];

const statusVariant: Record<InvoiceStatus, 'soft-success' | 'soft-info' | 'soft-destructive' | 'soft-neutral'> = {
  Paid: 'soft-success',
  Open: 'soft-info',
  Overdue: 'soft-destructive',
  Draft: 'soft-neutral',
};

export type CustomerTab = 'overview' | 'invoices' | 'activity';

export interface CustomerDetailPageProps {
  /** One of the demo customers: acme, northwind, wayne. Anything else shows the not-found state. */
  customerId?: string;
  defaultTab?: CustomerTab;
}

export function CustomerDetailPage({ customerId = 'acme', defaultTab = 'overview' }: CustomerDetailPageProps) {
  const customer = demoCustomers.find(c => c.id === customerId);

  if (!customer) {
    return (
      <AppShell active="customers" title="Customer not found" trail={[{ label: 'Customers', href: '#customers' }]}>
        <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6">
          <PageHeader backLink={<BackLink href="#customers">All customers</BackLink>} title="Customer not found" />
          <EmptyState
            icon={<UserPlus />}
            title="There is no customer with this id"
            description={`We could not find a customer called "${customerId}". It may have been deleted, or the link is wrong.`}
            actions={<Button asChild><a href="#customers">Back to customers</a></Button>}
            headingLevel={2}
          />
        </div>
      </AppShell>
    );
  }

  const c = customer;
  return (
    <AppShell active="customers" title={c.name} trail={[{ label: 'Customers', href: '#customers' }]}>
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6">
        <PageHeader
          backLink={<BackLink href="#customers">All customers</BackLink>}
          title={c.name}
          badge={<Badge variant={c.status === 'Active' ? 'soft-success' : 'soft-info'} dot>{c.status}</Badge>}
          meta={
            <>
              <MetaItem icon={<Mail />}>{c.email}</MetaItem>
              <MetaItem icon={<MapPin />}>{c.city}</MetaItem>
              <MetaItem icon={<Clock />}>{`Customer since ${c.since}`}</MetaItem>
            </>
          }
          actions={
            <>
              <Button variant="outline" leadingIcon={<Mail />}>Send email</Button>
              <Button leadingIcon={<Plus />}>New invoice</Button>
            </>
          }
        />
        <Tabs variant="line" defaultValue={defaultTab}>
          <TabsList aria-label="Customer sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices" count={c.invoices.length} countLabel={`${c.invoices.length} invoices`}>Invoices</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex flex-col gap-6 pt-6">
            <section aria-label="Summary" className="flex flex-col gap-3">
              <h2 className="sr-only">Summary</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard className="w-full" label="Lifetime revenue" value={c.revenue} trend={c.invoices.length ? 'up' : 'neutral'} showChange={false} trendText="Across all paid invoices" footnote="Since the first invoice" />
                <StatCard className="w-full" label="Open balance" value={c.balance} trend="neutral" showChange={false} trendText="Not yet paid" footnote="Open and overdue invoices" />
                <StatCard className="w-full" label="Invoices" value={String(c.invoices.length)} trend="neutral" showChange={false} trendText="Sent to this customer" footnote="All time" />
                <StatCard className="w-full" label="Average time to pay" value={c.avgDays} trend="neutral" showChange={false} trendText="From send to payment" footnote="Paid invoices only" />
              </div>
            </section>
            <Card>
              <CardHeader title="Details" titleAs="h2" />
              <CardContent>
                <DescriptionList>
                  <DescriptionListItem label="Company">{c.name}</DescriptionListItem>
                  <DescriptionListItem label="Billing email">{c.email}</DescriptionListItem>
                  <DescriptionListItem label="Phone">{c.phone}</DescriptionListItem>
                  <DescriptionListItem label="Address">{c.city}</DescriptionListItem>
                  <DescriptionListItem label="Account owner">{c.owner}</DescriptionListItem>
                  <DescriptionListItem label="Payment terms">{c.terms}</DescriptionListItem>
                </DescriptionList>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="flex flex-col gap-3 pt-6">
            <h2 className="m-0 text-lg leading-7 font-semibold">Invoices</h2>
            {c.invoices.length ? (
              <Table aria-label={`Invoices of ${c.name}`}>
                <TableHeader>
                  <TableRow>
                    <TableHead><TableHeaderLabel label="Invoice" /></TableHead>
                    <TableHead><TableHeaderLabel label="Status" /></TableHead>
                    <TableHead><TableHeaderLabel label="Due date" /></TableHead>
                    <TableHead className="text-right"><TableHeaderLabel label="Amount" align="right" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.invoices.map(i => (
                    <TableRow key={i.id}>
                      <TableCell><TableCellLink href={`#${i.id}`}>{i.id}</TableCellLink></TableCell>
                      <TableCell><Badge variant={statusVariant[i.status]} dot>{i.status}</Badge></TableCell>
                      <TableCell><TableCellDate date={i.dueText} dateTime={i.due} /></TableCell>
                      <TableCell><TableCellAmount amount={i.amount} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                size="sm"
                icon={<Receipt />}
                title="No invoices yet"
                description={`Create the first invoice for ${c.name}.`}
                actions={<Button size="sm" leadingIcon={<Plus />}>New invoice</Button>}
                headingLevel={3}
              />
            )}
          </TabsContent>

          <TabsContent value="activity" className="flex flex-col gap-3 pt-6">
            <h2 className="m-0 text-lg leading-7 font-semibold">Activity</h2>
            <ActivityFeed aria-label={`Activity of ${c.name}`}>
              {c.activity.map(e => (
                <ActivityFeedItem
                  key={`${e.actor}-${e.verb}-${e.time}`}
                  actor={{ name: e.actor }}
                  verb={e.verb}
                  object={e.object ? { label: e.object, href: e.object.startsWith('INV-') ? `#${e.object}` : undefined } : undefined}
                  suffix={e.suffix}
                  time={e.time}
                />
              ))}
            </ActivityFeed>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
