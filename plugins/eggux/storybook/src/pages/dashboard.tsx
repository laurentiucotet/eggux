// Dashboard page of the app. A page, not a component: built only from library parts, inside the shared
// AppShell. One h1 (Page Header); the sections under it are named with a heading each, and the
// numbers, the chart and the distribution follow the date range in the header. The page also has two
// states that are shown by name: loading (Skeleton Presets) and empty (a new workspace).
import * as React from 'react';
import { Download, Plus, Receipt } from '@/components/icons';
import { ActivityFeed, ActivityFeedItem } from '@/components/ui/activity-feed-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartCard, LineChart, type ChartDatum, type ChartSeries } from '@/components/ui/charts';
import { DistributionBar, type DistributionSegment } from '@/components/ui/distribution-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { HealthCheckList, type HealthCheck } from '@/components/ui/health-check-list';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SkeletonPreset } from '@/components/ui/skeleton-preset';
import { StatCard, type StatTrend } from '@/components/ui/stat-card';
import { AppShell } from './app-parts';

export type DashboardState = 'ready' | 'loading' | 'empty';
export type DashboardRange = '7' | '30' | '90';

const ranges: { value: DashboardRange; label: string; days: string }[] = [
  { value: '7', label: 'Last 7 days', days: '7 days' },
  { value: '30', label: 'Last 30 days', days: '30 days' },
  { value: '90', label: 'Last 90 days', days: '90 days' },
];

interface Stat {
  label: string;
  value: string;
  trend: StatTrend;
  change: string;
  /** Overdue money going down is good news: the change badge is green although the trend points down. */
  good?: boolean;
}

interface RangeData {
  stats: Stat[];
  chart: ChartDatum[];
  status: DistributionSegment[];
}

const eur = (n: number) => new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const point = (label: string, revenue: number): ChartDatum => ({ label, values: { revenue } });

const data: Record<DashboardRange, RangeData> = {
  '7': {
    stats: [
      { label: 'Revenue', value: '€11,480', trend: 'up', change: '+6.1%' },
      { label: 'Paid invoices', value: '9', trend: 'up', change: '+12.5%' },
      { label: 'New customers', value: '3', trend: 'down', change: '−25.0%' },
      { label: 'Overdue amount', value: '€6,920', trend: 'down', change: '−4.2%', good: true },
    ],
    chart: [point('Mon', 1200), point('Tue', 2400), point('Wed', 1800), point('Thu', 3100), point('Fri', 1900), point('Sat', 600), point('Sun', 480)],
    status: [
      { label: 'Paid', value: 9 },
      { label: 'Open', value: 4 },
      { label: 'Overdue', value: 3 },
      { label: 'Draft', value: 2 },
    ],
  },
  '30': {
    stats: [
      { label: 'Revenue', value: '€48,250', trend: 'up', change: '+12.5%' },
      { label: 'Paid invoices', value: '38', trend: 'up', change: '+8.1%' },
      { label: 'New customers', value: '14', trend: 'down', change: '−4.2%' },
      { label: 'Overdue amount', value: '€6,920', trend: 'down', change: '−18.0%', good: true },
    ],
    chart: [point('Week 1', 9800), point('Week 2', 12400), point('Week 3', 11200), point('Week 4', 14850)],
    status: [
      { label: 'Paid', value: 38 },
      { label: 'Open', value: 12 },
      { label: 'Overdue', value: 5 },
      { label: 'Draft', value: 7 },
    ],
  },
  '90': {
    stats: [
      { label: 'Revenue', value: '€131,900', trend: 'up', change: '+21.3%' },
      { label: 'Paid invoices', value: '104', trend: 'up', change: '+15.6%' },
      { label: 'New customers', value: '37', trend: 'up', change: '+9.0%' },
      { label: 'Overdue amount', value: '€6,920', trend: 'up', change: '+3.4%' },
    ],
    chart: [point('Aug', 38200), point('Sep', 41600), point('Oct', 52100)],
    status: [
      { label: 'Paid', value: 104 },
      { label: 'Open', value: 21 },
      { label: 'Overdue', value: 9 },
      { label: 'Draft', value: 11 },
    ],
  },
};

const series: ChartSeries[] = [{ key: 'revenue', label: 'Revenue' }];

const attention: HealthCheck[] = [
  { id: 'a1', label: 'Card payment failed', detail: 'Initech · INV-1052 · €6,400', status: 'failed', lastRun: '2 hours ago' },
  { id: 'a2', label: 'INV-1043 is 9 days overdue', detail: 'Globex · €640', status: 'warning', lastRun: 'Reminder 2 days ago' },
  { id: 'a3', label: 'INV-1045 is 22 days overdue', detail: 'Umbrella · €8,800', status: 'warning', lastRun: 'No reminder yet' },
  { id: 'a4', label: '3 drafts older than 30 days', detail: 'Send or delete them', status: 'warning' },
];

function Stats({ range }: { range: DashboardRange }) {
  const days = ranges.find(r => r.value === range)!.days;
  return (
    <section aria-label="Key figures" className="flex flex-col gap-3">
      <h2 className="sr-only">Key figures</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data[range].stats.map(s => (
          <StatCard
            key={s.label}
            className="w-full"
            label={s.label}
            value={s.value}
            trend={s.trend}
            changeLabel={s.change}
            changeVariant={s.good ? 'soft-success' : undefined}
            trendText={`${s.change.replace(/^[+−]/, '')} vs previous period`}
            footnote={`Compared to the previous ${days}`}
          />
        ))}
      </div>
    </section>
  );
}

function Charts({ range }: { range: DashboardRange }) {
  const days = ranges.find(r => r.value === range)!.days;
  const d = data[range];
  const total = d.status.reduce((s, x) => s + x.value, 0);
  const revenue = d.chart.reduce((s, x) => s + x.values.revenue, 0);
  return (
    <section aria-label="Revenue and invoices" className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <ChartCard
        className="xl:col-span-2"
        title="Revenue"
        description={`Last ${days}, ${eur(revenue)} in total`}
      >
        <LineChart type="area" label={`Revenue, last ${days}`} series={series} data={d.chart} formatValue={eur} />
      </ChartCard>
      <Card>
        <CardHeader title="Invoices by status" description={`${total} invoices, last ${days}`} />
        <CardContent>
          <DistributionBar label={`Invoices by status, last ${days}`} segments={d.status} />
        </CardContent>
      </Card>
    </section>
  );
}

function Lists() {
  return (
    <section aria-label="Activity and attention" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader title="Recent activity" titleAs="h2" />
        <CardContent>
          <ActivityFeed aria-label="Recent activity feed">
            <ActivityFeedItem actor={{ name: 'Mihai Ionescu' }} verb="marked" object={{ label: 'INV-1042', href: '#invoices' }} suffix="as paid" time="12 minutes ago" />
            <ActivityFeedItem actor={{ name: 'Ana Popescu' }} verb="sent" object={{ label: 'INV-1041', href: '#invoices' }} suffix="to Acme Ltd" time="1 hour ago" unread />
            <ActivityFeedItem actor={{ name: 'Dana Constantin' }} verb="added" object={{ label: 'Hooli', href: '#customers' }} suffix="as a customer" time="3 hours ago" />
            <ActivityFeedItem actor={{ name: 'Mihai Ionescu' }} verb="sent a reminder for" object={{ label: 'INV-1043', href: '#invoices' }} time="Yesterday" />
            <ActivityFeedItem actor={{ name: 'Ana Popescu' }} verb="created" object={{ label: 'INV-1052', href: '#invoices' }} suffix="for Initech" time="2 days ago" />
          </ActivityFeed>
        </CardContent>
      </Card>
      <HealthCheckList className="self-start" title="Needs attention" checks={attention} showSummary={false} />
    </section>
  );
}

function LoadingBody() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading the dashboard" className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map(i => <SkeletonPreset key={i} type="stat" />)}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SkeletonPreset type="chart" className="xl:col-span-2" />
        <SkeletonPreset type="card" />
      </div>
      <div className="rounded-xl border border-border bg-card">
        {[0, 1, 2, 3].map(i => <SkeletonPreset key={i} type="list-row" />)}
      </div>
    </div>
  );
}

export interface DashboardPageProps {
  state?: DashboardState;
  defaultRange?: DashboardRange;
}

export function DashboardPage({ state = 'ready', defaultRange = '30' }: DashboardPageProps) {
  const [range, setRange] = React.useState<DashboardRange>(defaultRange);
  return (
    <AppShell active="dashboard" title="Dashboard">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="How the business is doing, at a glance."
          actions={
            <>
              <Select value={range} onValueChange={v => setRange(v as DashboardRange)} disabled={state !== 'ready'}>
                <SelectTrigger aria-label="Date range" className="w-44" />
                <SelectContent>
                  {ranges.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {state === 'ready' ? <Button variant="outline" leadingIcon={<Download />}>Export</Button> : null}
            </>
          }
        />
        {state === 'loading' ? (
          <LoadingBody />
        ) : state === 'empty' ? (
          <EmptyState
            icon={<Receipt />}
            title="Nothing to show yet"
            description="Create your first invoice and the dashboard fills in with revenue, activity and what needs your attention."
            actions={<Button leadingIcon={<Plus />}>New invoice</Button>}
            headingLevel={2}
          />
        ) : (
          <>
            <Stats range={range} />
            <Charts range={range} />
            <Lists />
          </>
        )}
      </div>
    </AppShell>
  );
}
