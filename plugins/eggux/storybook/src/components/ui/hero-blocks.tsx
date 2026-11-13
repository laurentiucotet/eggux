// EGG UI blocks, Hero page (Figma BLOCKS / Hero, page 72:79): Block / Hero Centered (72:80), Hero with
// Screenshot (202:3402), Hero Prompt (581:95707), Hero with Logo Cloud (693:103733), Hero with Form
// (693:104067), Hero with Phone (693:106153), Hero Full-bleed Image (693:106516), Hero with Video
// (693:109239), Hero with Stats (693:109524), Hero Image Collage (693:111983), Hero Split (810:135361,
// Media=screenshot | image) and Block / Mobile Paywall (1110:29613, Style=list | comparison).
// Every hero: one h1 in display/lg (60/60 extrabold, 36/40 under 768) with one accent phrase in
// foreground/brand, a body/lead line in foreground/muted, an Action Bar of one primary and one
// outline Button (links), 96 px top and bottom, content 1152 wide. Centered heroes stack at gap 24
// with the media 64 below; split heroes put the text and the media in two 544 columns 64 apart from
// 896 px of container width and stack below it. Breakpoints are container queries, so a hero
// follows the width it is given, not the window.
// Product screens inside a Device Frame are drawn from library components and read as one image
// (role img with a label; the drawing itself is inert and hidden from screen readers), as the
// Figma `Image / Screenshot / *` they stand in for.
import * as React from 'react';
import { ChevronRight, Paperclip, Search, Smartphone, Sparkles, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ActionBar } from './action-bar';
import { AnnouncementPill } from './announcement-pill';
import { ApprovalChain, ApprovalStep } from './approval-step';
import { AssistantMessage } from './assistant-message';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { Badge } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { BarChart, ChartCard, ChartLegend, ChartLegendItem, DistributionBar, LineChart } from './charts';
import { BulletChart, DashboardWidget } from './charts-extra';
import { DescriptionList, DescriptionListItem } from './description-list';
import { CheckItem } from './form-layout';
import { DeviceFrame } from './imagery';
import { ImagePlaceholder, type ImageRatio } from './image-placeholder';
import { InlineForm } from './inline-form';
import { ListItem } from './list';
import { Logo } from './logo';
import { VideoPlayer } from './media';
import { Countdown, LeaderboardRow, MetricStrip, MetricStripItem, TrendIndicator } from './metrics';
import { PlanOptions, Price, type PlanOption } from './pricing';
import { PromptInput } from './prompt-input';
import { PromptSuggestion } from './prompt-suggestion';
import { Rating } from './rating';
import { Scrim } from './scrim';
import { SiteNavbar, type SiteLink } from './site-navigation';
import { StatCard } from './stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { TableCellUser } from './table-cells-rich';
import { TableCellAmount } from './table-cells';
import { TableCellStatus } from './table-cell-status';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { TrustBadge } from './trust-badge';
import { UserMessage } from './user-message';

export type HeroLink = { label: string; href: string };

/* Shared parts */

interface HeroTextProps {
  /** Announcement Pill above the title: the newest launch. */
  announcement?: { tag?: string; label: string; href: string };
  /** ui/overline eyebrow in foreground/brand (split heroes). */
  eyebrow?: string;
  title?: string;
  /** The accent phrase after the title, in foreground/brand. */
  accent?: string;
  lead?: string;
  primaryAction?: HeroLink;
  secondaryAction?: HeroLink;
}

const rootClass = '@container relative isolate w-full bg-background text-foreground';
const bodyClass = 'flex w-full flex-col items-center px-6 py-16 @3xl:px-12 @3xl:py-24';
const innerClass = 'flex w-full max-w-[1152px] flex-col';
const headlineClass = 'm-0 text-4xl leading-10 font-extrabold tracking-[-0.4px] @3xl:text-6xl @3xl:leading-[60px]';
const leadClass = 'm-0 text-xl leading-7 text-muted-foreground';
const eyebrowClass = 'm-0 text-xs leading-4 font-semibold tracking-[1.6px] text-brand uppercase';
const splitClass = 'grid w-full grid-cols-1 gap-12 @4xl:grid-cols-2 @4xl:gap-16';

function Headline({ id, title, accent, className, accentClass = 'text-brand' }: { id: string; title?: string; accent?: string; className?: string; accentClass?: string }) {
  return (
    <h1 id={id} className={cn(headlineClass, className)}>
      {title}
      {accent ? <>{' '}<span className={accentClass}>{accent}</span></> : null}
    </h1>
  );
}

function Actions({ primary, secondary, align, size = 'default' }: { primary?: HeroLink; secondary?: HeroLink; align: 'start' | 'center'; size?: 'default' | 'lg' }) {
  if (!primary && !secondary) return null;
  return (
    <ActionBar align={align} className="[&_[data-slot=action-bar-actions]]:flex-wrap">
      {primary ? <Button asChild size={size}><a href={primary.href}>{primary.label}</a></Button> : null}
      {secondary ? <Button asChild size={size} variant="outline"><a href={secondary.href}>{secondary.label}</a></Button> : null}
    </ActionBar>
  );
}

/** Centered stack: pill, h1, lead, actions, note. */
function CenteredText({ id, announcement, title, accent, lead, primaryAction, secondaryAction, note, maxWidth = 'max-w-[896px]', buttonSize = 'default' }: HeroTextProps & { id: string; note?: string; maxWidth?: string; buttonSize?: 'default' | 'lg' }) {
  return (
    <div data-slot="hero-content" className={cn('flex w-full flex-col items-center gap-6 text-center', maxWidth)}>
      {announcement ? <AnnouncementPill tag={announcement.tag ?? 'New'} label={announcement.label} href={announcement.href} /> : null}
      <Headline id={id} title={title} accent={accent} />
      {lead ? <p className={leadClass}>{lead}</p> : null}
      <div className="w-full"><Actions primary={primaryAction} secondary={secondaryAction} align="center" size={buttonSize} /></div>
      {note ? <p className="m-0 text-xs leading-4 text-muted-foreground">{note}</p> : null}
    </div>
  );
}

/** Start-aligned stack for split heroes: eyebrow, h1, lead, then the rest. */
function SplitText({ id, eyebrow, announcement, title, accent, lead, children }: HeroTextProps & { id: string; children?: React.ReactNode }) {
  return (
    <div data-slot="hero-content" className="flex min-w-0 flex-col items-start gap-6">
      {announcement ? <AnnouncementPill tag={announcement.tag ?? 'New'} label={announcement.label} href={announcement.href} /> : null}
      {eyebrow ? <p className={eyebrowClass}>{eyebrow}</p> : null}
      <Headline id={id} title={title} accent={accent} />
      {lead ? <p className={leadClass}>{lead}</p> : null}
      {children}
    </div>
  );
}

export type ProofPerson = { initials: string; name?: string; src?: string };
const defaultPeople: ProofPerson[] = [
  { initials: 'AP', name: 'Ana Popescu' },
  { initials: 'MI', name: 'Mihai Ionescu' },
  { initials: 'ED', name: 'Elena Dumitru' },
];

/** Avatar Group with a label, and an optional Rating with its count. */
function SocialProof({ label, people = defaultPeople, rating, ratingCount }: { label?: string; people?: ProofPerson[]; rating?: number; ratingCount?: number }) {
  if (!label && rating == null) return null;
  return (
    <div data-slot="hero-proof" className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {label ? (
        <AvatarGroup label={label}>
          {people.map(p => <Avatar key={p.initials} initials={p.initials} src={p.src} />)}
        </AvatarGroup>
      ) : null}
      {rating != null ? <Rating value={rating} size="sm" showValue count={ratingCount} /> : null}
    </div>
  );
}

/** A product screen drawn with library components, read as one image. */
function Screen({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="img" aria-label={label} data-slot="hero-screen" className="@container relative w-full overflow-clip">
      <div aria-hidden="true" inert className={cn('w-full bg-background', className)}>{children}</div>
    </div>
  );
}

/* Sample screens (stand-ins for Image / Screenshot / *) */

const k = (v: number) => `${Math.round(v / 1000)}k`;

function DashboardScreen() {
  return (
    <div className="grid grid-cols-1 gap-4 p-6 @3xl:grid-cols-6">
      <DashboardWidget title="Plan vs actual" period="Q4 2026 to date" updated="Updated 5 min ago" className="@3xl:col-span-3">
        <div className="flex flex-col gap-4">
          <BulletChart title="Revenue" unit="EUR, this quarter" value={412000} target={480000} ranges={[300000, 400000, 500000]} max={500000} formatValue={k} />
          <BulletChart title="New ARR" unit="EUR, this quarter" value={96000} target={120000} ranges={[60000, 100000, 125000]} max={125000} formatValue={k} />
          <BulletChart title="Gross margin" unit="percent" value={71} target={70} ranges={[50, 65, 80]} max={80} formatValue={v => `${v}%`} />
        </div>
      </DashboardWidget>
      <DashboardWidget title="Where the money is" period="Open invoices and pipeline" updated="Updated 5 min ago" className="@3xl:col-span-3">
        <div className="flex flex-col gap-6">
          <DistributionBar title="Invoices by status" total="1,284 total" data={[{ label: 'Paid', value: 62 }, { label: 'Pending', value: 21 }, { label: 'Overdue', value: 11 }, { label: 'Draft', value: 6 }]} />
          <DistributionBar title="Pipeline by stage" total="EUR 2.4M total" data={[{ label: 'Qualified', value: 45 }, { label: 'Proposal', value: 30 }, { label: 'Negotiation', value: 15 }, { label: 'Won', value: 10 }]} />
        </div>
      </DashboardWidget>
      <DashboardWidget title="Top accounts" period="Revenue, Q4 to date" updated="Updated 1 h ago" className="@3xl:col-span-2">
        <ol className="m-0 flex flex-col p-0">
          {[['Northwind Traders', 'NT', '€182,400'], ['Kestrel', 'KE', '€156,900'], ['Fieldstone', 'FI', '€121,300'], ['Halcyon', 'HA', '€98,750'], ['Quintra', 'QU', '€74,200']].map(([name, initials, value], i) => (
            <LeaderboardRow key={name} rank={i + 1} name={name!} initials={initials} value={value!} />
          ))}
        </ol>
      </DashboardWidget>
      <DashboardWidget title="Quarter close" period="Q4 2026" updated="Updated just now" className="@3xl:col-span-2">
        <Countdown to="2026-12-31T21:59:00Z" now="2026-10-23T21:59:00Z" endLabel="Closes Wed, 31 Dec 2026, 23:59 EET" />
        <p className="m-0 text-sm leading-5 text-muted-foreground">Closes Wed, 31 Dec 2026, 23:59 EET. Deals signed after that count for Q1.</p>
      </DashboardWidget>
      <DashboardWidget title="Key changes" period="vs Q3 2026" updated="Updated 5 min ago" className="@3xl:col-span-2">
        {([['Bookings', 'up', '+8.2%', undefined], ['Churn', 'down', '-0.4 pt', 'positive'], ['Operating costs', 'up', '+5.1%', 'negative'], ['Average deal size', 'flat', '0.0%', undefined]] as const).map(([label, trend, value, tone]) => (
          <div key={label} className="flex items-center justify-between gap-3 py-1 text-sm leading-5">
            <span>{label}</span>
            <TrendIndicator trend={trend} tone={tone} value={value} comparison="" />
          </div>
        ))}
      </DashboardWidget>
    </div>
  );
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const revenue = [32, 41, 48, 44, 53, 58];
const costs = [24, 27, 31, 30, 33, 35];

function AnalyticsScreen() {
  const series = [{ key: 'revenue', label: 'Revenue' }, { key: 'costs', label: 'Costs' }, { key: 'profit', label: 'Profit' }];
  const data = months.map((label, i) => ({ label, values: { revenue: revenue[i]! * 1000, costs: costs[i]! * 1000, profit: (revenue[i]! - costs[i]!) * 1000 } }));
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @4xl:grid-cols-4">
        <StatCard label="Revenue this month" value="€48,250" trend="up" showChange={false} trendText="12.5% vs last month" footnote="Compared to October 2026" showSparkline />
        <StatCard label="Paid invoices" value="1,128" trend="up" showChange={false} trendText="8.1% vs last month" footnote="Compared to October 2026" showSparkline />
        <StatCard label="Overdue amount" value="€6,410" trend="down" showChange={false} trendText="4.2% less than last month" footnote="Compared to October 2026" showSparkline />
        <StatCard label="Days to get paid" value="18" trend="neutral" showChange={false} trendText="Same as last month" footnote="Compared to October 2026" />
      </div>
      <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-2">
        <ChartCard
          title="Revenue vs costs"
          description="January - June 2026"
          legend={<ChartLegend>{series.map((s, i) => <ChartLegendItem key={s.key} series={i} label={s.label} />)}</ChartLegend>}
          insight={{ text: 'Profit up 21% vs last half-year', trend: 'up' }}
          note="Costs grew slower than revenue every month since March."
        >
          <BarChart label="Revenue, costs and profit, January to June 2026" series={series} data={data} formatValue={k} />
        </ChartCard>
        <ChartCard title="Revenue" description="January - June 2026" insight={{ text: 'Revenue up 81% since January', trend: 'up' }} note="May and June were the best months on record.">
          <LineChart type="area" label="Revenue, January to June 2026" series={series.slice(0, 1)} data={data} formatValue={k} />
        </ChartCard>
      </div>
    </div>
  );
}

function AssistantScreen() {
  return (
    <div className="mx-auto flex w-full max-w-[768px] flex-col gap-6 px-6 py-8">
      <UserMessage>Which invoices for Acme are still open?</UserMessage>
      <AssistantMessage>
        <p className="m-0">Acme has 3 open invoices, €4,820 in total. The oldest one, INV-1024, is 12 days overdue; payment terms are 30 days.</p>
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
          <li>INV-1024: €2,400, due Oct 7</li>
          <li>INV-1031: €1,620, due Oct 15</li>
          <li>INV-1038: €800, due Oct 28</li>
        </ul>
        <p className="m-0">Want me to draft a reminder for INV-1024?</p>
      </AssistantMessage>
      <div className="flex flex-wrap gap-2">
        <PromptSuggestion label="Draft the reminder" />
        <PromptSuggestion label="Show paid invoices too" />
      </div>
    </div>
  );
}

const invoiceRows = [
  { name: 'Northwind Traders', email: 'billing@northwind.example', initials: 'NT', id: 'INV-1041', status: 'Overdue', variant: 'warning', note: '12 days', amount: '€12,450.00', amountNote: '3 invoices' },
  { name: 'Kestrel', email: 'ap@kestrel.example', initials: 'KE', id: 'INV-1043', status: 'Sent', variant: 'info', note: 'due Nov 2', amount: '€4,800.00', amountNote: '1 invoice' },
  { name: 'Fieldstone', email: 'finance@fieldstone.example', initials: 'FI', id: 'INV-1046', status: 'Paid', variant: 'success', note: 'Oct 18', amount: '€2,150.00', amountNote: '1 invoice' },
  { name: 'Quintra', email: 'accounts@quintra.example', initials: 'QU', id: 'INV-1047', status: 'Overdue', variant: 'warning', note: '4 days', amount: '€9,320.50', amountNote: '2 invoices' },
  { name: 'Brightpath', email: 'pay@brightpath.example', initials: 'BR', id: 'INV-1049', status: 'Draft', variant: 'secondary', note: '', amount: '€18,000.00', amountNote: '2 invoices' },
  { name: 'Lumora', email: 'billing@lumora.example', initials: 'LU', id: 'INV-1052', status: 'Paid', variant: 'success', note: 'Oct 12', amount: '€6,700.00', amountNote: '1 invoice' },
] as const;

function InvoicesScreen() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px]">Invoices</p>
          <p className="m-0 text-xs leading-4 text-muted-foreground">1,284 invoices · €2.4M outstanding</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button size="sm">New invoice</Button>
        </div>
      </div>
      <Table containerClassName="rounded-lg border border-border">
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceRows.map(r => (
            <TableRow key={r.id}>
              <TableCell><TableCellUser name={r.name} email={r.email} initials={r.initials} /></TableCell>
              <TableCell>{r.id}</TableCell>
              <TableCell><TableCellStatus label={r.status} variant={r.variant} note={r.note} showNote={!!r.note} /></TableCell>
              <TableCell><TableCellAmount amount={r.amount} note={r.amountNote} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PhoneScreen() {
  const people = [['Ana Popescu', 'AP', 'Next: Tue 22 Oct, 10:30'], ['Mihai Ionescu', 'MI', 'Next: Wed 23 Oct, 09:00'], ['Elena Dumitru', 'ED', 'No upcoming visit'], ['Radu Constantin', 'RC', 'Next: Fri 25 Oct, 14:00'], ['Ioana Stan', 'IS', 'No upcoming visit'], ['George Marin', 'GM', 'Next: Mon 28 Oct, 11:30']];
  return (
    <div className="flex h-[812px] w-full flex-col overflow-clip">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px]">Customers</p>
        <Avatar initials="DP" size="sm" />
      </div>
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="flex h-9 flex-1 items-center gap-2 rounded-full border border-input px-3 text-sm text-muted-foreground"><Search className="size-4" />Search customers</span>
      </div>
      <ul className="m-0 flex flex-col p-0 px-2">
        {people.map(([name, initials, next]) => (
          <ListItem key={name} title={name!} description={next} leading={<Avatar initials={initials} />} trailing={<ChevronRight className="size-4 text-muted-foreground" />} />
        ))}
      </ul>
    </div>
  );
}

function ApprovalScreen() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="m-0 text-sm leading-5 font-semibold">Purchase request PR-2041</p>
          <Badge variant="soft-warning">Pending approval</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="xs">Reject</Button>
          <Button size="xs">Approve</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-[3fr_2fr]">
        <div className="rounded-lg border border-border p-3">
          <DescriptionList>
            <DescriptionListItem label="Vendor" divider>Cloudline Hosting</DescriptionListItem>
            <DescriptionListItem label="Amount" divider>€18,400.00 per year</DescriptionListItem>
            <DescriptionListItem label="Cost center" divider>ENG-204 · Platform</DescriptionListItem>
            <DescriptionListItem label="Needed by">15 Nov 2026</DescriptionListItem>
          </DescriptionList>
        </div>
        <div className="rounded-lg border border-border p-3">
          <ApprovalChain>
            <ApprovalStep name="Mihai Ionescu" role="Engineering manager" status="approved" time="20 Oct 2026, 14:05" />
            <ApprovalStep name="Elena Dumitru (you)" role="Finance manager · approves over €10,000" status="current" time="Assigned 2 h ago · due tomorrow" />
            <ApprovalStep name="Ana Popescu" role="Director · approves over €15,000" />
          </ApprovalChain>
        </div>
      </div>
    </div>
  );
}

/* Hero Centered */

export interface HeroCenteredProps extends HeroTextProps, Omit<React.ComponentProps<'section'>, 'title'> {
  /** Line under the actions: the trial terms. */
  note?: string;
  /** Figma Show background fill: off when a Background sits behind the hero. */
  showBackgroundFill?: boolean;
  /** Address in the Device Frame. */
  address?: string;
  /** Figma Media: the product screen. Default a sample dashboard; null hides the frame. */
  screen?: React.ReactNode | null;
  /** Name of the screen for screen readers. */
  screenLabel?: string;
  /** Decorative layer (Background Grid, Glow...) placed first, behind the content. */
  background?: React.ReactNode;
}

function HeroCentered({
  announcement = { tag: 'New', label: 'Automations for every team', href: '#automations' },
  title = 'Work that runs',
  accent = 'on time',
  lead = 'Projects, clients and billing in one place, so your team spends the day on work, not admin.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Book a demo', href: '#demo' },
  note = '14-day trial. No card needed.',
  showBackgroundFill = true,
  address = 'app.acme.com/dashboard',
  screen,
  screenLabel = 'Acme dashboard: plan vs actual, invoices by status, top accounts and key changes for Q4 2026',
  background,
  className,
  ...props
}: HeroCenteredProps) {
  const id = React.useId();
  return (
    <section data-slot="hero-centered" aria-labelledby={id} className={cn(rootClass, !showBackgroundFill && 'bg-transparent', className)} {...props}>
      {background}
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, 'items-center gap-16')}>
          <CenteredText id={id} announcement={announcement} title={title} accent={accent} lead={lead} primaryAction={primaryAction} secondaryAction={secondaryAction} note={note} maxWidth="max-w-[768px]" buttonSize="lg" />
          {screen !== null ? (
            <DeviceFrame address={address} className="w-full max-w-[1152px]">
              {screen ?? <Screen label={screenLabel}><DashboardScreen /></Screen>}
            </DeviceFrame>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Hero with Screenshot */

export interface HeroWithScreenshotProps extends HeroTextProps, Omit<React.ComponentProps<'section'>, 'title'> {
  address?: string;
  /** The product screen in the Device Frame. Default a sample analytics page. */
  screen?: React.ReactNode;
  screenLabel?: string;
}

function HeroWithScreenshot({
  announcement = { tag: 'New', label: 'Approvals and audit log', href: '#approvals' },
  title = 'Close the books faster, with',
  accent = 'every approval on record',
  lead = 'Invoices, approvals, reports and access in one workspace for finance and operations teams.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Book a demo', href: '#demo' },
  address = 'app.acme.com/analytics',
  screen,
  screenLabel = 'Acme analytics: revenue, paid invoices, overdue amount and days to get paid, with revenue and costs from January to June 2026',
  className,
  ...props
}: HeroWithScreenshotProps) {
  const id = React.useId();
  return (
    <section data-slot="hero-with-screenshot" aria-labelledby={id} className={cn(rootClass, className)} {...props}>
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, 'items-center gap-16')}>
          <CenteredText id={id} announcement={announcement} title={title} accent={accent} lead={lead} primaryAction={primaryAction} secondaryAction={secondaryAction} />
          <DeviceFrame address={address} className="w-full max-w-[1184px] @7xl:-mx-4 @7xl:w-[calc(100%+32px)] @7xl:max-w-none">
            {screen ?? <Screen label={screenLabel}><AnalyticsScreen /></Screen>}
          </DeviceFrame>
        </div>
      </div>
    </section>
  );
}

/* Hero Prompt */

export interface HeroPromptProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onSubmit'> {
  /** Figma Accent: the greeting, on its own line above the title. */
  accent?: string;
  /** Figma Title: stays on two lines with the accent. */
  title?: string;
  /** Badge above the prompt. */
  badge?: string;
  /** Visible label of the prompt. */
  promptLabel?: string;
  placeholder?: string;
  /** Figma Suggestions: 2 to 4 Prompt Suggestions; a click puts the text in the prompt. */
  suggestions?: string[];
  /** Enter, Send, or a suggestion: open the chat or results page with the question. */
  onSubmit?: (question: string) => void;
  /** Figma Show panel fill: off when a Background sits behind the hero. */
  showPanelFill?: boolean;
  /** The answer preview in the Device Frame; null hides it. */
  screen?: React.ReactNode | null;
  address?: string;
  screenLabel?: string;
}

function HeroPrompt({
  accent = 'Welcome back',
  title = 'Ask about your invoices',
  badge = 'AI Assistant',
  promptLabel = 'Ask a question or start a task',
  placeholder = 'e.g. Which invoices are overdue this month?',
  suggestions = ['Overdue invoices', 'Revenue by customer', 'Draft a payment reminder'],
  onSubmit,
  showPanelFill = true,
  screen,
  address = 'app.acme.com/assistant',
  screenLabel = 'Acme assistant answering which invoices for Acme are still open: 3 invoices, €4,820 in total',
  className,
  ...props
}: HeroPromptProps) {
  const id = React.useId();
  const labelId = React.useId();
  const [value, setValue] = React.useState('');
  return (
    <section data-slot="hero-prompt" aria-labelledby={id} className={cn(rootClass, className)} {...props}>
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, 'relative isolate items-center overflow-hidden rounded-xl')}>
          {showPanelFill ? <span aria-hidden="true" data-slot="hero-panel-fill" className="absolute inset-0 -z-10 bg-accent" /> : null}
          <div className="flex w-full max-w-[864px] flex-col items-center gap-8 px-6 py-12 @3xl:px-12">
            <h1 id={id} className={cn(headlineClass, 'flex flex-col text-center')}>
              <span className="text-brand">{accent}</span>
              <span>{title}</span>
            </h1>
            <div className="flex w-full max-w-[768px] flex-col items-center gap-3">
              {badge ? <Badge variant="info"><Sparkles aria-hidden="true" className="mr-1 inline size-3 align-[-2px]" />{badge}</Badge> : null}
              <p id={labelId} className="m-0 text-sm leading-5 font-medium">{promptLabel}</p>
              <PromptInput
                className="w-full"
                label={promptLabel}
                placeholder={placeholder}
                value={value}
                onValueChange={setValue}
                onSubmit={q => onSubmit?.(q)}
                tools={<ButtonIcon variant="ghost" size="sm" icon={<Paperclip aria-hidden="true" />} label="Attach a file" />}
              />
              {suggestions.length ? (
                <ul aria-label="Suggestions" className="m-0 flex w-full list-none flex-wrap justify-center gap-2 p-0">
                  {suggestions.map(s => <li key={s}><PromptSuggestion label={s} onClick={() => setValue(s)} /></li>)}
                </ul>
              ) : null}
            </div>
          </div>
          {screen !== null ? (
            <div className="flex w-full justify-center px-6 pb-12 @3xl:px-12">
              <DeviceFrame address={address} className="w-full max-w-[960px]">
                {screen ?? <Screen label={screenLabel}><AssistantScreen /></Screen>}
              </DeviceFrame>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Hero with Logo Cloud */

export interface HeroWithLogoCloudProps extends HeroTextProps, Omit<React.ComponentProps<'section'>, 'title'> {
  address?: string;
  screen?: React.ReactNode;
  screenLabel?: string;
  /** Line above the logos. */
  logosCaption?: string;
  /** Customer names, one logo each (Logo Tile, one muted color). */
  logos?: string[];
}

function HeroWithLogoCloud({
  announcement = { tag: 'New', label: 'New: bank feeds in 14 countries', href: '#bank-feeds' },
  title = 'Get paid faster with invoices that',
  accent = 'chase themselves',
  lead = 'Send invoices, collect card and bank payments and reconcile everything in one workspace. Teams save 11 hours a month on average.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Book a demo', href: '#demo' },
  address = 'app.acme.com/invoices',
  screen,
  screenLabel = 'Acme invoices list: 1,284 invoices, €2.4M outstanding, with customer, status and amount',
  logosCaption = 'Trusted by 2,400 finance teams in 30 countries',
  logos = ['Northwind', 'Orbitly', 'Kestrel', 'Quintra', 'Halcyon', 'Meridian'],
  className,
  ...props
}: HeroWithLogoCloudProps) {
  const id = React.useId();
  return (
    <section data-slot="hero-with-logo-cloud" aria-labelledby={id} className={cn(rootClass, className)} {...props}>
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, 'items-center gap-16')}>
          <CenteredText id={id} announcement={announcement} title={title} accent={accent} lead={lead} primaryAction={primaryAction} secondaryAction={secondaryAction} />
          <DeviceFrame address={address} className="w-full max-w-[1184px] @7xl:-mx-4 @7xl:w-[calc(100%+32px)] @7xl:max-w-none">
            {screen ?? <Screen label={screenLabel}><InvoicesScreen /></Screen>}
          </DeviceFrame>
          {logos.length ? (
            <div data-slot="hero-logos" className="flex w-full flex-col items-center gap-6">
              <p className="m-0 text-center text-sm leading-5 text-muted-foreground">{logosCaption}</p>
              <ul aria-label="Customers" className="m-0 grid w-full list-none grid-cols-2 p-0 @xl:grid-cols-3 @4xl:grid-cols-6">
                {logos.map(name => (
                  <li key={name} data-slot="logo-tile" className="flex h-[72px] items-center justify-center px-6 grayscale">
                    <Logo name={name} mark={name.charAt(0)} className="[&_[data-slot=logo-mark]]:bg-foreground [&_[data-slot=logo-mark]]:text-background" />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Hero with Form */

export interface HeroWithFormProps extends Omit<HeroTextProps, 'primaryAction' | 'secondaryAction'>, Omit<React.ComponentProps<'section'>, 'title' | 'onSubmit'> {
  /** Inline Form: accessible name of the email field. */
  formLabel?: string;
  placeholder?: string;
  buttonLabel?: string;
  /** Under the field: the trial terms. */
  hint?: string;
  /** Inline success after a valid submit: what happens next. */
  successMessage?: string;
  onSubmit?: (email: string) => void;
  proofLabel?: string;
  rating?: number;
  ratingCount?: number;
  /** Photo URL; without it the Image Placeholder shows. */
  image?: string;
  imageAlt?: string;
}

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

function HeroWithForm({
  eyebrow = 'Invoicing for small teams',
  title = 'Invoices sent',
  accent = 'in two minutes',
  lead = 'Create, send and track invoices in EUR and 30 other currencies. Free for your first 20 invoices every month.',
  formLabel = 'Work email',
  placeholder = 'Work email',
  buttonLabel = 'Start free',
  hint = 'Free for 14 days. No credit card needed.',
  successMessage = 'Check your inbox: we sent a link to set up your account.',
  onSubmit,
  proofLabel = 'Join 1,200 finance teams',
  rating = 4.9,
  ratingCount = 860,
  image,
  imageAlt = '',
  className,
  ...props
}: HeroWithFormProps) {
  const id = React.useId();
  const [error, setError] = React.useState<string>();
  const [done, setDone] = React.useState(false);
  return (
    <section data-slot="hero-with-form" aria-labelledby={id} className={cn(rootClass, className)} {...props}>
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, splitClass, 'items-center')}>
          <SplitText id={id} eyebrow={eyebrow} title={title} accent={accent} lead={lead}>
            <InlineForm
              className="w-full max-w-[464px]"
              label={formLabel}
              placeholder={placeholder}
              buttonLabel={buttonLabel}
              hint={hint}
              error={error}
              success={done ? successMessage : undefined}
              inputProps={{ type: 'email', autoComplete: 'email', name: 'email' }}
              onSubmit={v => {
                if (!isEmail(v)) { setError('Enter an email address like name@company.com.'); return; }
                setError(undefined);
                setDone(true);
                onSubmit?.(v.trim());
              }}
            />
            <SocialProof label={proofLabel} rating={rating} ratingCount={ratingCount} />
          </SplitText>
          <ImagePlaceholder ratio="4:3" src={image} alt={imageAlt} showCaption={false} className="rounded-xl" />
        </div>
      </div>
    </section>
  );
}

/* Hero with Phone */

export interface StoreLink { store: 'app-store' | 'google-play'; href: string }

export interface HeroWithPhoneProps extends Omit<HeroTextProps, 'primaryAction' | 'secondaryAction'>, Omit<React.ComponentProps<'section'>, 'title'> {
  /** Store links. TODO Store Badge: the Mobile component is not in code yet; outline Buttons stand in. */
  stores?: StoreLink[];
  rating?: number;
  ratingCount?: number;
  /** The phone screen; default a customer list. */
  screen?: React.ReactNode;
  screenLabel?: string;
}

const storeText = { 'app-store': ['Download on the', 'App Store'], 'google-play': ['Get it on', 'Google Play'] } as const;

function HeroWithPhone({
  eyebrow = 'Acme for iPhone and Android',
  title = 'Approve spend',
  accent = 'from anywhere',
  lead = 'Snap receipts, approve invoices and see your cash position in real time. Everything syncs with your Acme workspace.',
  stores = [{ store: 'app-store', href: '#app-store' }, { store: 'google-play', href: '#google-play' }],
  rating = 4.8,
  ratingCount = 12400,
  screen,
  screenLabel = 'Acme mobile app: the customer list with the next visit of each customer',
  className,
  ...props
}: HeroWithPhoneProps) {
  const id = React.useId();
  return (
    <section data-slot="hero-with-phone" aria-labelledby={id} className={cn(rootClass, className)} {...props}>
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, splitClass, 'items-center')}>
          <SplitText id={id} eyebrow={eyebrow} title={title} accent={accent} lead={lead}>
            {stores.length ? (
              <ul aria-label="Download the app" className="m-0 flex list-none flex-wrap gap-3 p-0">
                {stores.map(s => (
                  <li key={s.store}>
                    <Button asChild variant="outline" size="xl" className="h-[58px] px-4">
                      <a href={s.href} data-slot="store-link">
                        <Smartphone aria-hidden="true" className="size-6" />
                        <span className="flex flex-col items-start text-left">
                          <span className="text-xs leading-4 font-normal">{storeText[s.store][0]}</span>
                          <span className="text-lg leading-6 font-semibold">{storeText[s.store][1]}</span>
                        </span>
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
            {rating != null ? <Rating value={rating} size="sm" showValue count={ratingCount} countLabel={n => `${n.toLocaleString('en-GB')} ratings`} /> : null}
          </SplitText>
          <div data-slot="hero-visual" className="flex h-[560px] items-start justify-center overflow-hidden rounded-xl bg-[var(--section-muted-background)] px-6 pt-16">
            <DeviceFrame device="phone" className="w-[390px] shrink-0">
              {screen ?? <Screen label={screenLabel}><PhoneScreen /></Screen>}
            </DeviceFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Hero Full-bleed Image */

export interface HeroFullBleedImageProps extends HeroTextProps, Omit<React.ComponentProps<'section'>, 'title'> {
  /** Photo URL. Without it the dark video background shows (no gray box behind white text). */
  image?: string;
  imageAlt?: string;
  /** Block / Navbar Style=on-image over the photo; null hides it. */
  navLinks?: SiteLink[] | null;
}

const defaultNavLinks: SiteLink[] = ['Features', 'Pricing', 'Customers', 'Docs'].map(l => ({ label: l, href: `#${l.toLowerCase()}` }));

function HeroFullBleedImage({
  announcement = { tag: 'New', label: 'Spring collection, out now', href: '#spring' },
  title = 'Made for the long way home',
  accent,
  lead = 'Weatherproof jackets, packs and boots, tested on 2,000 km of coastal trails. Free returns within 60 days.',
  primaryAction = { label: 'Shop the collection', href: '#shop' },
  secondaryAction = { label: 'Find a store', href: '#stores' },
  image,
  imageAlt = '',
  navLinks = defaultNavLinks,
  className,
  ...props
}: HeroFullBleedImageProps) {
  const id = React.useId();
  return (
    <section data-slot="hero-full-bleed-image" aria-labelledby={id} className={cn('@container relative isolate flex min-h-[720px] w-full flex-col items-center overflow-hidden bg-[var(--video-background)] text-[var(--video-foreground)]', className)} {...props}>
      {image ? <ImagePlaceholder ratio="21:9" src={image} alt={imageAlt} showCaption={false} className="absolute inset-0 -z-10 aspect-auto size-full" /> : null}
      <Scrim tone="media" className="-z-10" />
      {navLinks ? <SiteNavbar variant="on-image" links={navLinks} signIn={{ href: '#signin' }} cta={{ label: 'Book a demo', href: '#demo' }} className="px-6 @3xl:px-12" /> : null}
      <div className={cn(innerClass, 'flex-1 justify-end px-6 pt-16 pb-16 @3xl:px-12 @7xl:px-0')}>
        <div data-slot="hero-content" className="flex w-full max-w-[720px] flex-col items-start gap-6">
          {announcement ? <AnnouncementPill tag={announcement.tag ?? 'New'} label={announcement.label} href={announcement.href} /> : null}
          <Headline id={id} title={title} accent={accent} accentClass="" />
          {lead ? <p className="m-0 text-xl leading-7">{lead}</p> : null}
          <ActionBar align="start" className="[&_[data-slot=action-bar-actions]]:flex-wrap">
            {primaryAction ? <Button asChild size="lg"><a href={primaryAction.href}>{primaryAction.label}</a></Button> : null}
            {secondaryAction ? <Button asChild size="lg" variant="secondary"><a href={secondaryAction.href}>{secondaryAction.label}</a></Button> : null}
          </ActionBar>
        </div>
      </div>
    </section>
  );
}

/* Hero with Video */

export interface HeroWithVideoProps extends HeroTextProps, Omit<React.ComponentProps<'section'>, 'title'> {
  videoTitle?: string;
  /** Length in seconds. */
  duration?: number;
  videoSrc?: string;
  poster?: string;
  captionsSrc?: string;
}

function HeroWithVideo({
  announcement = { tag: 'New', label: 'Watch the 3 minute tour', href: '#tour' },
  title = 'See your whole month-end close',
  accent = 'in one place',
  lead = 'Watch a finance team of four close October in three days: bank feeds, approvals, reconciliation and the board report.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Book a demo', href: '#demo' },
  videoTitle = 'Product tour: month-end close in Acme',
  duration = 192,
  videoSrc,
  poster,
  captionsSrc,
  className,
  ...props
}: HeroWithVideoProps) {
  const id = React.useId();
  return (
    <section data-slot="hero-with-video" aria-labelledby={id} className={cn(rootClass, className)} {...props}>
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, 'items-center gap-16')}>
          <CenteredText id={id} announcement={announcement} title={title} accent={accent} lead={lead} primaryAction={primaryAction} secondaryAction={secondaryAction} />
          <VideoPlayer size="lg" title={videoTitle} duration={duration} src={videoSrc} poster={poster} captionsSrc={captionsSrc} className="shadow-xl" />
        </div>
      </div>
    </section>
  );
}

/* Hero with Stats */

export interface HeroStat { value: string; label: string }

export interface HeroWithStatsProps extends HeroTextProps, Omit<React.ComponentProps<'section'>, 'title'> {
  image?: string;
  imageAlt?: string;
  /** Metric Strip: 4 figures, each with its period in the label. */
  stats?: HeroStat[];
}

function HeroWithStats({
  eyebrow = 'Finance operations platform',
  title = 'The numbers behind',
  accent = '38,000 finance teams',
  lead = 'Acme runs invoicing, approvals and reporting for businesses in 30 countries, from two-person studios to listed companies.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Book a demo', href: '#demo' },
  image,
  imageAlt = '',
  stats = [
    { value: '€2.4B', label: 'Invoices sent in 2025' },
    { value: '38,000', label: 'Businesses on Acme' },
    { value: '11 h', label: 'Saved per person each month' },
    { value: '99.99%', label: 'Uptime, last 12 months' },
  ],
  className,
  ...props
}: HeroWithStatsProps) {
  const id = React.useId();
  return (
    <section data-slot="hero-with-stats" aria-labelledby={id} className={cn(rootClass, className)} {...props}>
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, 'gap-16')}>
          <div className={cn(splitClass, 'items-end')}>
            <div className="flex min-w-0 flex-col items-start gap-6">
              {eyebrow ? <p className={eyebrowClass}>{eyebrow}</p> : null}
              <Headline id={id} title={title} accent={accent} />
            </div>
            <div className="flex min-w-0 flex-col items-start gap-6">
              {lead ? <p className={leadClass}>{lead}</p> : null}
              <div className="w-full"><Actions primary={primaryAction} secondary={secondaryAction} align="start" size="lg" /></div>
            </div>
          </div>
          <ImagePlaceholder ratio="21:9" src={image} alt={imageAlt} showCaption={false} className="rounded-xl @4xl:aspect-auto @4xl:h-[440px]" />
          {stats.length ? (
            <MetricStrip aria-label="Acme in numbers" className="gap-y-4">
              {stats.map(s => <MetricStripItem key={s.label} label={s.label} value={s.value} className="basis-40 @4xl:basis-0" />)}
            </MetricStrip>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Hero Image Collage */

export interface CollageImage { src?: string; alt?: string; ratio?: ImageRatio }

export interface HeroImageCollageProps extends HeroTextProps, Omit<React.ComponentProps<'section'>, 'title'> {
  proofLabel?: string;
  rating?: number;
  ratingCount?: number;
  /** Five photos in three staggered columns (2, 2, 1): people first. */
  images?: CollageImage[];
}

const collageDefault: CollageImage[] = [{ ratio: '3:4' }, { ratio: '1:1' }, { ratio: '1:1' }, { ratio: '3:4' }, { ratio: '3:4' }];

function HeroImageCollage({
  eyebrow = 'Studio management',
  title = 'Where client work',
  accent = 'comes together',
  lead = 'Briefs, files, approvals and invoices for creative studios, in one shared space your clients actually enjoy using.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Book a demo', href: '#demo' },
  proofLabel = 'Used by 4,000 studios',
  rating = 4.9,
  ratingCount = 2150,
  images = collageDefault,
  className,
  ...props
}: HeroImageCollageProps) {
  const id = React.useId();
  const columns = [images.slice(0, 2), images.slice(2, 4), images.slice(4, 5)];
  const offsets = ['pt-[72px]', '', 'pt-[136px]'];
  return (
    <section data-slot="hero-image-collage" aria-labelledby={id} className={cn(rootClass, className)} {...props}>
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, splitClass, 'items-center')}>
          <SplitText id={id} eyebrow={eyebrow} title={title} accent={accent} lead={lead}>
            <div className="w-full"><Actions primary={primaryAction} secondary={secondaryAction} align="start" size="lg" /></div>
            <SocialProof label={proofLabel} rating={rating} ratingCount={ratingCount} />
          </SplitText>
          <div data-slot="hero-collage" className="grid grid-cols-3 items-start gap-4">
            {columns.map((col, c) => (
              <div key={c} className={cn('flex flex-col gap-4', offsets[c])}>
                {col.map((img, i) => <ImagePlaceholder key={i} ratio={img.ratio ?? '3:4'} src={img.src} alt={img.alt ?? ''} showCaption={false} className="rounded-xl" />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Hero Split */

export interface HeroSplitProps extends HeroTextProps, Omit<React.ComponentProps<'section'>, 'title'> {
  /** Figma Media: a photo (image) or a product screen in a Device Frame (screenshot). */
  media?: 'image' | 'screenshot';
  image?: string;
  imageAlt?: string;
  address?: string;
  screen?: React.ReactNode;
  screenLabel?: string;
  /** Figma Show trust: Trust Badges under the actions. */
  showTrust?: boolean;
  proofLabel?: string;
}

function HeroSplit({
  eyebrow = 'For growing teams',
  title = 'Less admin,',
  accent = 'more done',
  lead = 'Automatic reminders, approvals and invoices that run themselves while you work.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Book a demo', href: '#demo' },
  media = 'screenshot',
  image,
  imageAlt = '',
  address = 'app.acme.com/approvals/PR-2041',
  screen,
  screenLabel = 'Acme purchase request PR-2041 for €18,400, waiting for the finance manager in a three-step approval chain',
  showTrust = false,
  proofLabel = 'Trusted by 1,200 teams in 30 countries',
  className,
  ...props
}: HeroSplitProps) {
  const id = React.useId();
  return (
    <section data-slot="hero-split" data-media={media} aria-labelledby={id} className={cn(rootClass, className)} {...props}>
      <div data-slot="hero-body" className={bodyClass}>
        <div className={cn(innerClass, splitClass, 'items-center')}>
          <SplitText id={id} eyebrow={eyebrow} title={title} accent={accent} lead={lead}>
            <div className="w-full"><Actions primary={primaryAction} secondary={secondaryAction} align="start" size="lg" /></div>
            {showTrust ? (
              <ul aria-label="Certifications" className="m-0 flex list-none flex-wrap gap-3 p-0">
                <li><TrustBadge name="SOC 2 Type II" description="Audited every year" /></li>
                <li><TrustBadge name="GDPR ready" description="Data stored in the EU" /></li>
              </ul>
            ) : null}
            <SocialProof label={proofLabel} />
          </SplitText>
          {media === 'image' ? (
            <ImagePlaceholder ratio="4:3" src={image} alt={imageAlt} showCaption={false} className="rounded-xl" />
          ) : (
            <DeviceFrame address={address} className="w-full">
              {screen ?? <Screen label={screenLabel}><ApprovalScreen /></Screen>}
            </DeviceFrame>
          )}
        </div>
      </div>
    </section>
  );
}

/* Mobile Paywall */

export interface PaywallFeatureRow { feature: string; free: string; pro: string }

export interface MobilePaywallProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onSubmit'> {
  /** Figma Style: list (benefits and plan rows) or comparison (Free vs Pro table and a period switch). */
  paywallStyle?: 'list' | 'comparison';
  productName?: string;
  title?: string;
  description?: string;
  benefits?: string[];
  plans?: PlanOption[];
  defaultPlan?: string;
  rows?: PaywallFeatureRow[];
  /** Fine print: what happens after the trial, renewal and how to cancel. */
  terms?: string;
  ctaLabel?: string;
  onSubmit?: (plan: string) => void;
  onClose?: () => void;
  onRestore?: () => void;
  image?: string;
}

const paywallPlans: PlanOption[] = [
  { value: 'yearly', name: 'Yearly', price: '€59.99 per year', equivalent: '€1.15 per week', saving: 'Save 58%', trial: '7-day free trial' },
  { value: 'monthly', name: 'Monthly', price: '€11.99 per month', equivalent: '€2.77 per week' },
];

const paywallRows: PaywallFeatureRow[] = [
  { feature: 'Chats per day', free: '20', pro: 'Unlimited' },
  { feature: 'Newest models', free: 'no', pro: 'yes' },
  { feature: 'Image generation', free: '3 a day', pro: 'Unlimited' },
  { feature: 'Voice mode', free: '10 min', pro: 'Unlimited' },
  { feature: 'File uploads', free: '5 a day', pro: 'Unlimited' },
  { feature: 'Priority access', free: 'no', pro: 'yes' },
];

function Mark({ value }: { value: string }) {
  if (value === 'yes') return <><span aria-hidden="true">✓</span><span className="sr-only">Included</span></>;
  if (value === 'no') return <><span aria-hidden="true" className="text-muted-foreground">—</span><span className="sr-only">Not included</span></>;
  return <>{value}</>;
}

function MobilePaywall({
  paywallStyle = 'list',
  productName = 'Lumora',
  title = 'Unlock Lumora Pro',
  description = 'Unlimited chats, HD images and voice on all your devices.',
  benefits = ['Unlimited chats with the newest models', 'HD image generation', 'Voice mode with no daily limit', 'Priority access at busy times'],
  plans = paywallPlans,
  defaultPlan = 'yearly',
  rows = paywallRows,
  terms = 'Free for 7 days, then €59.99 per year. Renews automatically unless you cancel at least 24 hours before the period ends. Manage or cancel in your App Store settings.',
  ctaLabel = 'Start 7-day free trial',
  onSubmit,
  onClose,
  onRestore,
  image,
  className,
  ...props
}: MobilePaywallProps) {
  const id = React.useId();
  const [plan, setPlan] = React.useState(defaultPlan);
  const current = plans.find(p => p.value === plan) ?? plans[0]!;
  const [amount, ...periodWords] = current.price.split(' ');
  return (
    <section data-slot="mobile-paywall" data-style={paywallStyle} aria-labelledby={id} className={cn('@container flex w-full max-w-[390px] flex-col bg-background text-foreground', className)} {...props}>
      <div className="flex h-[52px] items-center p-2">
        <ButtonIcon variant="ghost" icon={<X aria-hidden="true" />} label="Close" onClick={onClose} />
      </div>
      <div className="flex flex-1 flex-col items-center gap-5 px-4">
        {paywallStyle === 'list' ? (
          <ImagePlaceholder ratio="21:9" src={image} showCaption={false} className="rounded-xl" />
        ) : (
          <Logo type="wordmark" name={productName.toLowerCase()} className="[&_[data-slot=logo-name]]:text-2xl" />
        )}
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h2 id={id} className="m-0 text-3xl leading-9 font-semibold tracking-[-0.4px]">{title}</h2>
          <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p>
        </div>
        {paywallStyle === 'list' ? (
          <>
            <ul aria-label={`${productName} Pro includes`} className="m-0 flex w-full flex-col gap-2 p-0">
              {benefits.map(b => <CheckItem key={b} tone="default">{b}</CheckItem>)}
            </ul>
            <PlanOptions options={plans} value={plan} onValueChange={setPlan} label="Billing period" />
          </>
        ) : (
          <>
            <table className="w-full border-collapse text-sm leading-5">
              <caption className="sr-only">Free and Pro compared</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="px-3 py-2 text-left font-normal text-muted-foreground">Features</th>
                  <th scope="col" className="w-20 px-2 py-2 text-center font-medium">Free</th>
                  <th scope="col" className="w-24 rounded-t-lg bg-muted px-2 py-2 text-center"><Badge shape="pill">Pro</Badge></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.feature} className={cn(i < rows.length - 1 && 'border-b border-border')}>
                    <th scope="row" className="px-3 py-3 text-left font-normal">{r.feature}</th>
                    <td className="px-2 py-3 text-center"><Mark value={r.free} /></td>
                    <td className={cn('bg-muted px-2 py-3 text-center', i === rows.length - 1 && 'rounded-b-lg')}><Mark value={r.pro} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ToggleGroup type="single" variant="segmented" fullWidth value={plan} onValueChange={v => v && setPlan(v)} aria-label="Billing period">
              {plans.map(p => <ToggleGroupItem key={p.value} value={p.value} label={p.name} className="flex-1" />)}
            </ToggleGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <Price amount={amount!} period={periodWords.join(' ')} size="lg" />
              <p className="m-0 text-xs leading-4 text-muted-foreground">{[current.equivalent, current.saving ? `${current.saving} compared with monthly` : null].filter(Boolean).join('. ')}.</p>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-center gap-3 px-4 pt-4 pb-8">
        <Button size="xl" className="w-full" onClick={() => onSubmit?.(plan)}>{ctaLabel}</Button>
        <p className="m-0 text-center text-xs leading-4 text-muted-foreground">{terms}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="link" size="sm" onClick={onRestore}>Restore purchases</Button>
          <Button asChild variant="link" size="sm"><a href="#terms">Terms</a></Button>
          <Button asChild variant="link" size="sm"><a href="#privacy">Privacy</a></Button>
        </div>
      </div>
    </section>
  );
}

export {
  HeroCentered,
  HeroFullBleedImage,
  HeroImageCollage,
  HeroPrompt,
  HeroSplit,
  HeroWithForm,
  HeroWithLogoCloud,
  HeroWithPhone,
  HeroWithScreenshot,
  HeroWithStats,
  HeroWithVideo,
  MobilePaywall,
};
