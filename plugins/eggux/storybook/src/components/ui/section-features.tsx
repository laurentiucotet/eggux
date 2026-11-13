// EGG UI blocks, BLOCKS / Sections page (73:2), Features family: Block / Features (73:12), Features
// Split (202:3222), Bento Grid (202:3285), Features with Screenshot (693:104166), Features Tabs
// (693:105905), How It Works (693:106013), Bento Grid 2 (693:108519), Feature Checklist
// (693:113122), Integrations Grid (693:113181), Features with Code (810:135730), Use Cases
// (810:137650), Us vs Them (810:138125).
// Every block is a <section> named by its title (h2, from the Section Header), on background/default
// or section/muted-background, 96 px top and bottom (64 on narrow screens), content 1152 wide
// (layout/container/6xl, 24 px side gutters). Columns follow the block's own width (container
// queries), so a block in a narrow column stacks like on a phone.
// Product screens inside a Device Frame are drawn from library components at 60% (a screenshot):
// they are one image for screen readers (role img with a description) and cannot take focus.
// Guide: eggux build-ui/patterns/marketing-pages.md (Features row).
import * as React from 'react';
import {
  ArrowRight, Bell, Calendar, ChartColumn, Clock, Code, Download, FileText, GitBranch, Globe, History,
  KeyRound, Lock, Mail, Paperclip, ShieldCheck, UserCheck, Users, Zap,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import { ApprovalChain, ApprovalStep } from './approval-step';
import { AiSummary } from './ai-summary';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { Badge } from './badge';
import { Button } from './button';
import { Card } from './card';
import { BarChart, BarChartHorizontal, ChartCard, LineChart, type ChartDatum } from './charts';
import { CodeBlock, CommandSnippet } from './code-block';
import { DescriptionList, DescriptionListItem } from './description-list';
import { FeatureItem } from './feature-item';
import { Checkbox } from './checkbox';
import { CheckItem } from './form-layout';
import { ImagePlaceholder } from './image-placeholder';
import { DeviceFrame } from './imagery';
import { Logo } from './logo';
import { MetaItem } from './meta-item';
import { Progress } from './progress';
import { SectionHeader } from './section-header-block';
import { Separator } from './separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { TableCellCheck } from './table-cell-check';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Textarea } from './textarea';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

/* Shared parts */

export type SectionTone = 'default' | 'muted';
export interface SectionLink { label: string; href: string }
export interface SectionHeading { overline?: string; title?: string; description?: string }

interface ShellProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  tone?: SectionTone;
  titleId: string;
  /** Gap between the header and the content: Figma 48 or 64 (96 for Features Split). */
  gap?: 'md' | 'lg' | 'xl';
}

const gaps = { md: 'gap-10 @3xl:gap-12', lg: 'gap-12 @3xl:gap-16', xl: 'gap-16 @3xl:gap-24' } as const;

/** The section band: tone background, 96 / 64 vertical padding, 1152 content, centered column. */
function Shell({ tone = 'default', titleId, gap = 'md', className, children, ...props }: ShellProps) {
  return (
    <section
      aria-labelledby={titleId}
      data-tone={tone}
      className={cn('@container w-full text-foreground', tone === 'muted' ? 'bg-[var(--section-muted-background)]' : 'bg-background', className)}
      {...props}
    >
      <div data-slot="section-container" className={cn('mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 py-16 @3xl:py-24', gaps[gap])}>{children}</div>
    </section>
  );
}

/** Link Button with the arrow (Figma Button Variant=link, Show trailing icon). */
function ArrowLink({ link, className }: { link: SectionLink; className?: string }) {
  return (
    <Button asChild variant="link" className={className}>
      <a href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></a>
    </Button>
  );
}

/** Primary Button and an arrow link, 12 apart (Figma "actions"). */
function Actions({ primary, secondary, secondaryStyle = 'link', align = 'start' }: { primary?: SectionLink; secondary?: SectionLink; secondaryStyle?: 'link' | 'outline'; align?: 'start' | 'center' }) {
  if (!primary && !secondary) return null;
  return (
    <div data-slot="section-actions" className={cn('flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>
      {primary ? <Button asChild><a href={primary.href}>{primary.label}</a></Button> : null}
      {secondary ? (secondaryStyle === 'outline' ? <Button asChild variant="outline"><a href={secondary.href}>{secondary.label}</a></Button> : <ArrowLink link={secondary} />) : null}
    </div>
  );
}

const checkText = { check: '' };

export interface ScreenshotProps extends React.ComponentProps<'div'> {
  /** Address bar of the Device Frame. */
  address: string;
  /** What the screen shows, for screen readers. */
  label: string;
  /** Width the screen is laid out at; it is scaled to fit the frame (1064 → 640 is Figma's 60%). */
  screenWidth?: number;
  /** Visible height at that width; the rest is cropped (720 → 432 in a 640 frame). */
  screenHeight?: number;
}

/**
 * A product screen in a browser Device Frame, laid out at `screenWidth` and scaled to the frame
 * width like a screenshot (60% in Figma). One image for screen readers (role img + label); the
 * controls inside are inert.
 */
function Screenshot({ address, label, screenWidth = 1064, screenHeight = 720, className, children, ...props }: ScreenshotProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(0.6);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => { if (el.clientWidth) setZoom(el.clientWidth / screenWidth); };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [screenWidth]);
  return (
    <div role="img" aria-label={label} data-slot="screenshot" className={cn('flex w-full min-w-0', className)} {...props}>
      <DeviceFrame address={address} className="w-full shadow-lg">
        <div ref={ref} inert data-slot="screenshot-screen" className="w-full overflow-hidden text-left" style={{ aspectRatio: `${screenWidth} / ${screenHeight}` }}>
          <div style={{ width: screenWidth, zoom }}>{children}</div>
        </div>
      </DeviceFrame>
    </div>
  );
}

/* Sample screens (library components at full size, zoomed by Screenshot) */

function ScreenTitle({ title, sub, badge, actions }: { title: string; sub: string; badge?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">{title}</p>
          {badge}
        </div>
        <p className="m-0 text-sm leading-5 text-muted-foreground">{sub}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

function ApprovalScreen() {
  return (
    <div className="flex flex-col gap-6 bg-background p-7">
      <ScreenTitle
        title="Purchase request PR-2041"
        badge={<Badge variant="soft-warning" shape="pill">Pending approval</Badge>}
        sub="Submitted by Radu Georgescu on 20 Oct 2026 · Engineering"
        actions={<><Button variant="ghost" size="sm" leadingIcon={<UserCheck />}>Delegate</Button><Button variant="outline" size="sm">Reject</Button><Button size="sm">Approve</Button></>}
      />
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <Card className="gap-4 px-6">
          <p className="m-0 text-base leading-6 font-semibold">Details</p>
          <DescriptionList>
            <DescriptionListItem label="Vendor">Cloudline Hosting</DescriptionListItem>
            <DescriptionListItem label="Amount">€18,400.00 per year</DescriptionListItem>
            <DescriptionListItem label="Cost center">ENG-204 · Platform</DescriptionListItem>
            <DescriptionListItem label="Budget left">€42,000 of €120,000</DescriptionListItem>
            <DescriptionListItem label="Needed by">15 Nov 2026</DescriptionListItem>
          </DescriptionList>
        </Card>
        <Card className="gap-4 px-6">
          <div className="flex flex-col gap-1">
            <p className="m-0 text-base leading-6 font-semibold">Approval chain</p>
            <p className="m-0 text-sm leading-5 text-muted-foreground">Over €15,000 needs a director</p>
          </div>
          <ApprovalChain>
            <ApprovalStep name="Mihai Ionescu" role="Engineering manager" time="20 Oct 2026, 16:05" status="approved" comment="Needed for the platform roadmap." />
            <ApprovalStep name="Elena Dumitru (you)" role="Finance manager · approves over €10,000" time="Assigned 2 h ago · due tomorrow" status="current" statusLabel="Waiting for you" />
            <ApprovalStep name="Ana Popescu" role="Director · approves over €15,000" time="After Finance" />
          </ApprovalChain>
        </Card>
        <Card className="gap-4 px-6">
          <p className="m-0 text-base leading-6 font-semibold">Line items</p>
          <Table>
            <TableHeader><TableRow><TableHead>Item</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
            <TableBody>
              <TableRow><TableCell>Production cluster, 12 months</TableCell><TableCell className="text-right">1</TableCell><TableCell className="text-right">€14,200.00</TableCell></TableRow>
              <TableRow><TableCell>Managed backups</TableCell><TableCell className="text-right">1</TableCell><TableCell className="text-right">€2,600.00</TableCell></TableRow>
              <TableRow><TableCell>Support plan</TableCell><TableCell className="text-right">1</TableCell><TableCell className="text-right">€1,600.00</TableCell></TableRow>
            </TableBody>
          </Table>
        </Card>
        <Card className="gap-4 px-6">
          <p className="m-0 text-base leading-6 font-semibold">Your decision</p>
          <Textarea aria-label="Comment" placeholder="Add a comment (required to reject)" rows={2} />
          <div className="flex justify-end gap-2"><Button variant="outline" size="sm">Reject</Button><Button size="sm">Approve</Button></div>
        </Card>
      </div>
    </div>
  );
}

const auditRows = [
  ['22 Oct 2026, 10:32', 'Elena Dumitru', 'ED', 'request.approved', 'PR-2041', 'Web · Bucharest, RO'],
  ['22 Oct 2026, 09:58', 'Mihai Ionescu', 'MI', 'invoice.updated', 'INV-1024', 'Web · Cluj, RO'],
  ['21 Oct 2026, 17:12', 'Ana Popescu', 'AP', 'role.changed', 'Radu Georgescu', 'Web · Bucharest, RO'],
  ['21 Oct 2026, 15:45', 'System', 'SY', 'invoice.reminder_sent', 'INV-1029', 'Scheduled job'],
  ['21 Oct 2026, 11:03', 'Radu Georgescu', 'RG', 'export.created', 'Invoices, Q3', 'Web · Iasi, RO'],
  ['20 Oct 2026, 18:20', 'Clara Weber', 'CW', 'sso.settings_updated', 'SSO provider', 'Web · Bucharest, RO'],
  ['20 Oct 2026, 09:14', 'Jonas Berg', 'JB', 'user.signed_in', 'Jonas Berg', 'Chrome · macOS'],
];

function AuditScreen() {
  return (
    <div className="flex flex-col gap-5 bg-background p-7">
      <ScreenTitle title="Audit log" sub="Every change in the workspace, kept for 400 days. Read only." actions={<Button variant="outline" size="sm" leadingIcon={<Download />}>Export</Button>} />
      <Table>
        <TableHeader>
          <TableRow>{['Time', 'Actor', 'Action', 'Object', 'Source'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {auditRows.map(([time, actor, initials, action, object, source]) => (
            <TableRow key={time}>
              <TableCell className="text-muted-foreground">{time}</TableCell>
              <TableCell><span className="flex items-center gap-2"><Avatar size="sm" initials={initials} />{actor}</span></TableCell>
              <TableCell><Badge variant="outline">{action}</Badge></TableCell>
              <TableCell>{object}</TableCell>
              <TableCell className="text-muted-foreground">{source}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const invoiceRows = [
  ['Northwind Traders', 'NT', 'INV-1041', 'Overdue', '12 days', '€12,450.00', 25],
  ['Kestrel', 'K', 'INV-1043', 'Sent', 'due Nov 2', '€4,800.00', 0],
  ['Fieldstone', 'F', 'INV-1046', 'Paid', 'Oct 18', '€2,150.00', 100],
  ['Quintra', 'QU', 'INV-1047', 'Overdue', '4 days', '€9,320.50', 50],
  ['Brightpath', 'BR', 'INV-1049', 'Draft', '', '€18,000.00', 0],
  ['Lumora', 'LU', 'INV-1052', 'Paid', 'Oct 12', '€6,700.00', 100],
] as const;
const statusVariant = { Overdue: 'soft-warning', Sent: 'soft-info', Paid: 'soft-success', Draft: 'soft-neutral' } as const;

function InvoicesScreen() {
  return (
    <div className="flex gap-8 bg-background p-7">
      <div className="flex w-56 shrink-0 flex-col gap-3 pt-2">
        <p className="m-0 text-sm leading-5 font-medium">Status</p>
        {[['Draft', false], ['Sent', false], ['Overdue', true], ['Pending', true]].map(([l, on]) => <Checkbox key={l as string} label={l as string} defaultChecked={on as boolean} />)}
        <Separator />
        <p className="m-0 text-sm leading-5 font-medium">Customer</p>
        <Separator />
        <p className="m-0 text-sm leading-5 font-medium">Owner</p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-5">
      <ScreenTitle
        title="Invoices"
        sub="1,284 invoices · €2.4M outstanding"
        actions={<><Button variant="outline" size="sm">Export</Button><Button size="sm">New invoice</Button></>}
      />
      <Table>
        <TableHeader>
          <TableRow>{['Customer', 'Invoice', 'Status', 'Amount', 'Paid'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {invoiceRows.map(([name, initials, id, status, when, amount, paid]) => (
            <TableRow key={id}>
              <TableCell><span className="flex items-center gap-2"><Avatar size="sm" initials={initials} />{name}</span></TableCell>
              <TableCell>{id}</TableCell>
              <TableCell><span className="flex items-center gap-2"><Badge variant={statusVariant[status]}>{status}</Badge><span className="text-muted-foreground">{when}</span></span></TableCell>
              <TableCell className="text-right">{amount}</TableCell>
              <TableCell><span className="flex items-center gap-2"><Progress value={paid} className="w-24" aria-label={`${id} paid`} /><span className="text-muted-foreground">{paid}%</span></span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}

const months: ChartDatum[] = [
  { label: 'Jan', values: { revenue: 32000, costs: 24000 } },
  { label: 'Feb', values: { revenue: 41000, costs: 27000 } },
  { label: 'Mar', values: { revenue: 48000, costs: 31000 } },
  { label: 'Apr', values: { revenue: 44000, costs: 30000 } },
  { label: 'May', values: { revenue: 53000, costs: 33000 } },
  { label: 'Jun', values: { revenue: 58000, costs: 35000 } },
];
const eurCompact = (v: number) => `€${new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)}`;

function ReportsScreen() {
  return (
    <div className="flex flex-col gap-5 bg-background p-7">
      <ScreenTitle title="Reports" sub="Revenue and costs per month, refreshed every morning" actions={<Button variant="outline" size="sm" leadingIcon={<Download />}>Export</Button>} />
      <ChartCard title="Revenue and costs" description="January - June 2026, EUR" insight={{ text: 'Margin up 6 points since January', trend: 'up' }}>
        <BarChart label="Revenue and costs by month, January to June 2026" series={[{ key: 'revenue', label: 'Revenue' }, { key: 'costs', label: 'Costs' }]} data={months} formatValue={eurCompact} />
      </ChartCard>
    </div>
  );
}

const projects = [
  ['Website relaunch', 'Northwind Traders', 72, '14 Nov 2026'],
  ['Q4 retainer', 'Kestrel', 45, '31 Dec 2026'],
  ['Brand refresh', 'Fieldstone', 90, '8 Nov 2026'],
  ['Mobile app', 'Quintra', 20, '15 Feb 2027'],
  ['Data migration', 'Lumora', 60, '30 Nov 2026'],
] as const;

function ProjectsScreen() {
  return (
    <div className="flex flex-col gap-5 bg-background p-7">
      <ScreenTitle title="Projects" sub="5 active projects · 412 billable hours this month" actions={<Button size="sm">New project</Button>} />
      <Table>
        <TableHeader>
          <TableRow>{['Project', 'Client', 'Progress', 'Due'].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(([name, client, done, due]) => (
            <TableRow key={name}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell>{client}</TableCell>
              <TableCell><span className="flex items-center gap-2"><Progress value={done} className="w-32" aria-label={`${name} progress`} /><span className="text-muted-foreground">{done}%</span></span></TableCell>
              <TableCell className="text-muted-foreground">{due}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* Features */

export interface FeatureEntry { icon?: React.ReactNode; title: string; description?: string }

export interface FeaturesProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  /** 3 to 6 short benefits (Figma shows 9). */
  items?: FeatureEntry[];
  /** Icon Tile style for every item: neutral, brand for one accent grid. */
  tileStyle?: 'neutral' | 'brand' | 'gradient';
  tone?: SectionTone;
}

const featureItems: FeatureEntry[] = [
  { icon: <Globe />, title: 'Client portal', description: 'Clients follow progress, approve work and pay invoices from one secure link.' },
  { icon: <Bell />, title: 'Reminders', description: 'Polite emails go out 3 days before and after each due date, so fewer invoices slip past 30 days.' },
  { icon: <Users />, title: 'Client records', description: 'History, documents and notes for every client in one timeline, searchable in seconds by the whole team.' },
  { icon: <FileText />, title: 'Invoices', description: 'Turn tracked time and expenses into an invoice in two clicks, then send it in EUR or 30 other currencies.' },
  { icon: <ChartColumn />, title: 'Reports', description: 'Revenue, margin and utilisation per person and project, refreshed every morning and ready to export.' },
  { icon: <Clock />, title: 'Waiting list', description: 'Unassigned work is offered to the next free person automatically, with a deadline everyone can see.' },
  { icon: <ShieldCheck />, title: 'Approvals', description: 'Spend above a limit goes to the right approver, with a record of who signed off, when and why.' },
  { icon: <Zap />, title: 'Integrations', description: 'Connect your bank, accounting tool and calendar in minutes. Changes sync both ways every 15 minutes.' },
  { icon: <Lock />, title: 'Roles and access', description: 'Give each person the access they need, from read only to admin, with single sign-on on every plan.' },
];

/** Block / Features: Section Header, then a 3-column grid of stacked Feature Items, 48 apart. */
function Features({
  overline = 'FEATURES',
  title = 'Everything your team runs on',
  description = 'From the first lead to the last invoice, in one place your whole team can use.',
  items = featureItems,
  tileStyle,
  tone,
  ...props
}: FeaturesProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} gap="lg" data-slot="features" {...props}>
      <SectionHeader titleId={id} overline={overline} title={title} description={description} />
      <div data-slot="features-grid" className="grid w-full grid-cols-1 gap-10 @2xl:grid-cols-2 @5xl:grid-cols-3 @5xl:gap-12">
        {items.map(f => <FeatureItem key={f.title} icon={f.icon} tileStyle={tileStyle} title={f.title} description={f.description} />)}
      </div>
    </Shell>
  );
}

/* Features Split */

export interface SplitRow {
  overline?: string;
  title: string;
  description?: string;
  checks?: string[];
  link?: SectionLink;
  /** The product screen (a Screenshot) or an image. */
  media: React.ReactNode;
}

export interface FeaturesSplitProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  /** Figma Section Header (hidden by default): a header over the rows; the row titles become h3. */
  showHeader?: boolean;
  rows?: SplitRow[];
  tone?: SectionTone;
}

const splitRows: SplitRow[] = [
  {
    overline: 'APPROVALS',
    title: 'Every request, one approval chain',
    description: 'Rules route each request to the right people. Everyone sees who it waits for and why.',
    checks: ['Rules by amount, department and vendor', 'Delegation and escalation', 'Mobile approvals in one tap', 'Reminders after 24 hours without a decision', 'Budget check before every approval'],
    link: { label: 'Learn more about approvals', href: '#approvals' },
    media: <Screenshot address="app.acme.com/approvals/PR-2041" label="Screenshot: purchase request PR-2041 with its details and a three-step approval chain, waiting for the finance manager."><ApprovalScreen /></Screenshot>,
  },
  {
    overline: 'AUDIT',
    title: 'Proof for every change',
    description: 'Each edit, approval and export is logged with who, when and from where.',
    checks: ['Field-level history', '400 days of retention', 'Export for auditors', 'Sign-in history with device and location', 'Read-only access for external reviewers'],
    link: { label: 'Learn more about the audit log', href: '#audit' },
    media: <Screenshot address="app.acme.com/audit-log" label="Screenshot: the audit log, a table of recent changes with time, person, action, object and source." screenHeight={610}><AuditScreen /></Screenshot>,
  },
];

/**
 * Block / Features Split: rows of text (448: overline, heading/h1 title, lead, Check Items, link)
 * and a 640 product screen, 64 apart, the side alternating; rows 96 apart.
 */
function FeaturesSplit({
  showHeader = false,
  overline = 'FEATURES',
  title = 'Approvals and audit in one place',
  description = 'Route every request to the right people and keep proof of every change.',
  rows = splitRows,
  tone,
  ...props
}: FeaturesSplitProps) {
  const id = React.useId();
  const RowHeading = showHeader ? 'h3' : 'h2';
  return (
    <Shell titleId={showHeader ? id : `${id}-0`} tone={tone} gap="xl" data-slot="features-split" {...props}>
      {showHeader ? <SectionHeader titleId={id} overline={overline} title={title} description={description} /> : null}
      {rows.map((r, i) => (
        <div key={r.title} data-slot="features-split-row" className="flex w-full flex-col gap-10 @5xl:flex-row @5xl:items-center @5xl:gap-16">
          <div data-slot="features-split-text" className={cn('flex min-w-0 flex-col items-start gap-6 @5xl:w-[448px] @5xl:shrink-0', i % 2 === 1 && '@5xl:order-2')}>
            {r.overline ? <p className="m-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase">{r.overline}</p> : null}
            <RowHeading id={`${id}-${i}`} className="m-0 text-3xl leading-9 font-semibold tracking-tight text-balance @3xl:text-4xl @3xl:leading-10">{r.title}</RowHeading>
            {r.description ? <p className="m-0 text-xl leading-7 text-muted-foreground">{r.description}</p> : null}
            {r.checks?.length ? <ul className="m-0 flex w-full flex-col gap-3 p-0">{r.checks.map(c => <CheckItem key={c} stateText={checkText}>{c}</CheckItem>)}</ul> : null}
            {r.link ? <ArrowLink link={r.link} /> : null}
          </div>
          <div data-slot="features-split-media" className="flex min-w-0 flex-1">{r.media}</div>
        </div>
      ))}
    </Shell>
  );
}

/* Bento Grid */

export interface BentoGridProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  tone?: SectionTone;
  /** The three small tiles (Feature Item in a card). */
  items?: FeatureEntry[];
}

const bentoItems: FeatureEntry[] = [
  { icon: <ShieldCheck />, title: 'SSO and roles', description: 'Okta, Entra ID and Google; roles per entity.' },
  { icon: <History />, title: 'Audit log', description: 'Every change with who, when and where.' },
  { icon: <Download />, title: 'Exports', description: 'CSV and XLSX of any view, scheduled or on demand.' },
];

const tile = 'gap-4 px-6';
function TileText({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="m-0 text-lg leading-7 font-semibold text-card-foreground">{title}</h3>
      <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

/**
 * Block / Bento Grid: a wide card with a ranked bar chart and a card with an Approval Step, then
 * three cards with a Feature Item; 24 apart.
 */
function BentoGrid({
  overline = 'PLATFORM',
  title = 'Everything finance and operations need',
  description = 'One workspace for invoices, approvals, reports and access.',
  items = bentoItems,
  tone,
  ...props
}: BentoGridProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} data-slot="bento-grid" {...props}>
      <SectionHeader titleId={id} overline={overline} title={title} description={description} />
      <div className="flex w-full flex-col gap-6">
        <div data-slot="bento-row" className="grid w-full grid-cols-1 gap-6 @4xl:grid-cols-[minmax(0,15fr)_minmax(0,8fr)]">
          <Card className={tile}>
            <TileText title="Know who to call first" description="Top customers by overdue amount, refreshed every morning." />
            <BarChartHorizontal
              label="Top customers by overdue amount"
              formatValue={v => `€${v.toLocaleString('en')}`}
              data={[{ label: 'Northwind Traders', value: 24800 }, { label: 'Kestrel', value: 20150 }, { label: 'Fieldstone', value: 13900 }, { label: 'Halcyon', value: 10600 }, { label: 'Quintra', value: 7000 }, { label: 'Brightpath', value: 4150 }]}
            />
          </Card>
          <Card className={tile}>
            <TileText title="Approvals in context" description="See who approved, who is next and why." />
            <ApprovalChain>
              <ApprovalStep name="Elena Dumitru" role="Finance manager · approves over €10,000" time="Assigned 2 h ago · due tomorrow" status="current" statusLabel="Waiting for you" comment="Within budget, vendor is approved." connector={false} />
            </ApprovalChain>
          </Card>
        </div>
        <div data-slot="bento-row" className="grid w-full grid-cols-1 gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {items.map(f => (
            <Card key={f.title} className={tile}>
              <FeatureItem icon={f.icon} title={f.title} description={f.description} />
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* Features with Screenshot */

export interface FeaturesWithScreenshotProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  items?: FeatureEntry[];
  primaryAction?: SectionLink;
  secondaryAction?: SectionLink;
  /** The product screen; default the approval screen. */
  screenshot?: React.ReactNode;
  tone?: SectionTone;
}

const screenshotItems: FeatureEntry[] = [
  { icon: <GitBranch />, title: 'Route by amount and team', description: 'Invoices over €10,000 go to finance, the rest to the budget owner. Rules change in one place.' },
  { icon: <Mail />, title: 'Approve from your inbox', description: 'Approvers see the PDF, the purchase order and the budget left, then approve in one click.' },
  { icon: <ChartColumn />, title: 'Budgets checked before you say yes', description: 'Each request shows what is already committed this quarter, so overspend is caught early.' },
  { icon: <History />, title: 'A full trail for your auditors', description: 'Who approved, when, from where and with which comment, exported to CSV in seconds.' },
];

/** Block / Features with Screenshot: left 448 (Section Header left, inline Feature Items, actions), right a 640 screen. */
function FeaturesWithScreenshot({
  overline = 'APPROVALS',
  title = 'Approvals that never stall a payment',
  description = 'Every invoice reaches the right person with the context to decide, and nothing gets paid without a record of who said yes.',
  items = screenshotItems,
  primaryAction = { label: 'Start free trial', href: '#signup' },
  secondaryAction = { label: 'See how approvals work', href: '#approvals' },
  screenshot,
  tone,
  ...props
}: FeaturesWithScreenshotProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} data-slot="features-with-screenshot" {...props}>
      <div className="flex w-full flex-col gap-12 @5xl:flex-row @5xl:items-center @5xl:gap-16">
        <div data-slot="features-split-text" className="flex min-w-0 flex-col gap-10 @5xl:w-[448px] @5xl:shrink-0">
          <SectionHeader titleId={id} align="left" overline={overline} title={title} description={description} />
          <div className="flex flex-col gap-6">
            {items.map(f => <FeatureItem key={f.title} layout="inline" icon={f.icon} title={f.title} description={f.description} />)}
          </div>
          <Actions primary={primaryAction} secondary={secondaryAction} />
        </div>
        <div data-slot="features-split-media" className="flex min-w-0 flex-1">
          {screenshot ?? <Screenshot address="app.acme.com/approvals" label="Screenshot: purchase request PR-2041 with its details and a three-step approval chain, waiting for the finance manager."><ApprovalScreen /></Screenshot>}
        </div>
      </div>
    </Shell>
  );
}

/* Features Tabs */

export interface FeatureTab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: SectionLink;
  address: string;
  /** Screen reader description of the screen. */
  screenLabel: string;
  screen: React.ReactNode;
}

export interface FeaturesTabsProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  tabs?: FeatureTab[];
  defaultValue?: string;
  tone?: SectionTone;
}

const featureTabs: FeatureTab[] = [
  { value: 'invoices', label: 'Invoices', icon: <FileText />, title: 'Invoices in two clicks', description: 'Turn tracked time and expenses into an invoice, send it in EUR or 30 other currencies and see the moment it is opened.', action: { label: 'Explore invoicing', href: '#invoicing' }, address: 'app.acme.com/invoices', screenLabel: 'Screenshot: the invoices list with customers, status, amount and how much is paid.', screen: <InvoicesScreen /> },
  { value: 'approvals', label: 'Approvals', icon: <UserCheck />, title: 'Approvals with the context to decide', description: 'Each request shows the vendor, the budget left and who signed off before, so nothing is approved blind.', action: { label: 'Explore approvals', href: '#approvals' }, address: 'app.acme.com/approvals/PR-2041', screenLabel: 'Screenshot: purchase request PR-2041 with its details and approval chain.', screen: <ApprovalScreen /> },
  { value: 'reports', label: 'Reports', icon: <ChartColumn />, title: 'Reports that are ready every morning', description: 'Revenue, costs and margin per month and per client, refreshed overnight and ready to export.', action: { label: 'Explore reports', href: '#reports' }, address: 'app.acme.com/reports', screenLabel: 'Screenshot: a bar chart of revenue and costs per month, January to June 2026.', screen: <ReportsScreen /> },
  { value: 'projects', label: 'Projects', icon: <Calendar />, title: 'Projects that bill themselves', description: 'Hours logged on a project are ready to invoice, and progress shows who is ahead and who is late.', action: { label: 'Explore projects', href: '#projects' }, address: 'app.acme.com/projects', screenLabel: 'Screenshot: the projects list with client, progress and due date.', screen: <ProjectsScreen /> },
];

/**
 * Block / Features Tabs: Section Header, a line Tabs (centered, hug), then the panel: title and
 * description with an outline Button on the right, and the full-width 1152 screen.
 */
function FeaturesTabs({
  overline = 'ONE WORKSPACE',
  title = 'From the first quote to the last payment',
  description = 'Pick an area to see how it works. Every screen shares the same clients, projects and numbers, so nothing is typed twice.',
  tabs = featureTabs,
  defaultValue,
  tone,
  ...props
}: FeaturesTabsProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} data-slot="features-tabs" {...props}>
      <SectionHeader titleId={id} overline={overline} title={title} description={description} />
      <Tabs variant="line" defaultValue={defaultValue ?? tabs[0]?.value} className="flex w-full flex-col items-center gap-8 @3xl:gap-12">
        <div className="flex max-w-full justify-center overflow-x-auto">
          <TabsList aria-label="Product areas" className="w-fit">
            {tabs.map(t => <TabsTrigger key={t.value} value={t.value} icon={t.icon}>{t.label}</TabsTrigger>)}
          </TabsList>
        </div>
        {tabs.map(t => (
          <TabsContent key={t.value} value={t.value} className="mt-0 flex w-full flex-col gap-8">
            <div data-slot="features-tabs-caption" className="flex flex-col items-start gap-4 @3xl:flex-row @3xl:items-center @3xl:gap-8">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="m-0 text-lg leading-7 font-semibold">{t.title}</h3>
                <p className="m-0 text-base leading-7 text-muted-foreground">{t.description}</p>
              </div>
              {t.action ? <Button asChild variant="outline"><a href={t.action.href}>{t.action.label}<ArrowRight aria-hidden="true" /></a></Button> : null}
            </div>
            <Screenshot address={t.address} label={t.screenLabel} screenWidth={1600} screenHeight={798}>{t.screen}</Screenshot>
          </TabsContent>
        ))}
      </Tabs>
    </Shell>
  );
}

/* How It Works */

export interface HowItWorksStep { title: string; description: string; example?: React.ReactNode }

export interface HowItWorksProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  /** 3 or 4 steps. */
  steps?: HowItWorksStep[];
  primaryAction?: SectionLink;
  secondaryAction?: SectionLink;
  tone?: SectionTone;
}

const exampleBox = 'flex flex-wrap gap-2 rounded-lg bg-[var(--card-muted)] p-4';
const howSteps: HowItWorksStep[] = [
  {
    title: 'Connect your bank and books',
    description: 'Link your bank feed and accounting tool in about 10 minutes. Clients, projects and rates come across on their own.',
    example: <>{['Bank feed', 'Kestrel Ledger', 'Quintra Pay', 'CSV import', 'Calendar'].map(l => <Badge key={l} variant="outline">{l}</Badge>)}</>,
  },
  {
    title: 'Send the first invoice',
    description: 'Pick a client, add tracked hours or a fixed fee and send. Reminders go out 3 days before and after the due date.',
    example: <><Badge variant="outline">INV-1052 · €6,700.00</Badge><Badge variant="soft-info">Sent 12 Oct</Badge><Badge variant="soft-warning">Due in 14 days</Badge><Badge variant="soft-neutral">Reminder on 23 Oct</Badge></>,
  },
  {
    title: 'Get paid and reconcile',
    description: 'Clients pay by card or bank transfer from the invoice link. Each payment is matched to its bank line automatically.',
    example: <><Badge variant="soft-success">Paid €6,700.00</Badge><Badge variant="soft-success">Matched to bank line</Badge><Badge variant="soft-neutral">Synced to Kestrel Ledger</Badge></>,
  },
];

/** Block / How It Works: muted band, 3 step cards (Feature Item Marker=number and an example), centered actions. */
function HowItWorks({
  overline = 'HOW IT WORKS',
  title = 'Paid on time in three steps',
  description = 'No setup project and no consultants. Most teams send their first invoice the same afternoon they sign up.',
  steps = howSteps,
  primaryAction = { label: 'Start free trial', href: '#signup' },
  secondaryAction = { label: 'Book a 20-minute demo', href: '#demo' },
  tone = 'muted',
  ...props
}: HowItWorksProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} gap="lg" data-slot="how-it-works" {...props}>
      <SectionHeader titleId={id} overline={overline} title={title} description={description} />
      <ol data-slot="how-it-works-steps" className={cn('m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @4xl:gap-8', steps.length === 4 ? '@4xl:grid-cols-2 @5xl:grid-cols-4' : '@4xl:grid-cols-3')}>
        {steps.map((s, i) => (
          <li key={s.title} className="flex">
            <Card className="w-full gap-6 px-8 py-8">
              <FeatureItem number={i + 1} title={s.title} description={s.description} />
              {s.example ? <div className={exampleBox}>{s.example}</div> : null}
            </Card>
          </li>
        ))}
      </ol>
      <Actions primary={primaryAction} secondary={secondaryAction} align="center" />
    </Shell>
  );
}

/* Bento Grid 2 */

export interface BentoGrid2Props extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  tone?: SectionTone;
}

const cash: ChartDatum[] = [
  { label: 'Jan', values: { net: 32000 } },
  { label: 'Feb', values: { net: 41000 } },
  { label: 'Mar', values: { net: 48000 } },
  { label: 'Apr', values: { net: 44000 } },
  { label: 'May', values: { net: 53000 } },
  { label: 'Jun', values: { net: 58000 } },
];

const stage = 'flex flex-1 flex-col justify-center gap-3 rounded-lg bg-[var(--card-muted)] p-5';

// TODO Kanban Card: not in the code library yet; this is the minimum (labels, title, meta, owner).
function TaskCard({ title, due, dragging }: { title: string; due: string; dragging?: boolean }) {
  return (
    <Card size="sm" elevated={dragging} className={cn('gap-3 px-3 py-3', dragging && '-rotate-1')}>
      <div className="flex gap-1.5"><Badge variant="outline">Design</Badge><Badge variant="destructive">High</Badge></div>
      <p className="m-0 text-sm leading-5 font-medium">{title}</p>
      <div className="flex items-center gap-3">
        <MetaItem icon={<Calendar />}>{due}</MetaItem>
        <MetaItem icon={<Paperclip />}>3</MetaItem>
        <Avatar size="xs" initials="MI" name="Mihai Ionescu" className="ml-auto" />
      </div>
    </Card>
  );
}

function InvoiceLine({ id, amount, status }: { id: string; amount: string; status: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2.5">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm leading-5 font-medium">{id}</span>
        <span className="text-xs leading-4 text-muted-foreground">{amount}</span>
      </div>
      {status}
    </div>
  );
}

/**
 * Block / Bento Grid 2: a Chart Card (area chart, period Toggle Group) and an AI Summary tile, then
 * three tiles (task cards, the team, invoice statuses); every tile shows real components.
 */
function BentoGrid2({
  overline = 'PLATFORM',
  title = 'Your numbers, your work and your team in one place',
  description = 'Every tile below is the real product: charts, boards and AI answers built from the same data your team already keeps.',
  tone,
  ...props
}: BentoGrid2Props) {
  const id = React.useId();
  const [period, setPeriod] = React.useState('6m');
  return (
    <Shell titleId={id} tone={tone} data-slot="bento-grid-2" {...props}>
      <SectionHeader titleId={id} overline={overline} title={title} description={description} />
      <div className="flex w-full flex-col gap-6">
        <div data-slot="bento-row" className="grid w-full grid-cols-1 gap-6 @4xl:grid-cols-3">
          <ChartCard
            className="shadow-none @4xl:col-span-2"
            title="Cash in vs cash out"
            description="January - June 2026, EUR"
            actions={
              <ToggleGroup type="single" variant="segmented" size="sm" value={period} onValueChange={v => v && setPeriod(v)} aria-label="Period">
                <ToggleGroupItem value="7d" label="7 days" />
                <ToggleGroupItem value="30d" label="30 days" />
                <ToggleGroupItem value="6m" label="6 months" />
              </ToggleGroup>
            }
            insight={{ text: 'Net cash up 18% vs last half-year', trend: 'up' }}
            note="Clients pay 9 days faster since reminders went live."
          >
            <LineChart type="area" label="Net cash per month, January to June 2026" series={[{ key: 'net', label: 'Net cash' }]} data={cash} formatValue={eurCompact} plotHeight={200} />
          </ChartCard>
          <Card className={tile}>
            <TileText title="Ask about any client" description="Answers come with the invoices, emails and notes they were built from." />
            <div className={stage}>
              <AiSummary title="Northwind Traders" meta="4 sources · 2 min ago" showDisclaimer={false}>
                Northwind Traders has 3 open invoices, €12,450 in total. INV-1041 is 12 days overdue; this customer usually pays 9 days late. Ana Popescu spoke to their finance team on Oct 14 and they promised payment by Oct 31.
              </AiSummary>
            </div>
          </Card>
        </div>
        <div data-slot="bento-row" className="grid w-full grid-cols-1 gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
          <Card className={tile}>
            <TileText title="Work and billing stay in step" description="Move a task to Done and its hours are ready to invoice." />
            <div className={stage}>
              <TaskCard title="Send Q4 retainer invoices" due="31 Oct" />
              <TaskCard title="Review vendor contract renewals" due="4 Nov" dragging />
            </div>
          </Card>
          <Card className={tile}>
            <TileText title="Built for the whole team" description="Finance, sales and delivery see the same clients and numbers." />
            <div className={cn(stage, 'items-center text-center')}>
              <AvatarGroup size="lg" more={3} moreLabel="Show 3 more people">
                <Avatar initials="AP" name="Ana Popescu" />
                <Avatar initials="MI" name="Mihai Ionescu" />
                <Avatar initials="ED" name="Elena Dumitru" />
              </AvatarGroup>
              <p className="m-0 text-sm leading-5 font-medium">12 people on the Northwind account</p>
              <div className="flex flex-wrap justify-center gap-2">{['Finance', 'Sales', 'Delivery'].map(r => <Badge key={r} variant="outline">{r}</Badge>)}</div>
            </div>
          </Card>
          <Card className={tile}>
            <TileText title="Invoices that chase themselves" description="Status updates the moment a client opens, pays or misses a date." />
            <div className={stage}>
              <InvoiceLine id="INV-1052" amount="€6,700.00" status={<Badge variant="soft-success">Paid</Badge>} />
              <InvoiceLine id="INV-1049" amount="€18,000.00" status={<Badge variant="soft-info">Sent</Badge>} />
              <InvoiceLine id="INV-1041" amount="€12,450.00" status={<Badge variant="soft-warning">Overdue 12 days</Badge>} />
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

/* Feature Checklist */

export interface FeatureChecklistProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  /** What every plan includes: 6 to 10 short lines, in two columns. */
  checks?: string[];
  /** The photo (Image Placeholder Show image); without it the placeholder shows. */
  imageSrc?: string;
  imageAlt?: string;
  primaryAction?: SectionLink;
  secondaryAction?: SectionLink;
  tone?: SectionTone;
}

/** Block / Feature Checklist: a 4:3 image (544) and the content (Section Header left, two columns of Check Items, actions). */
function FeatureChecklist({
  overline = 'EVERY PLAN INCLUDES',
  title = 'Everything you need to bill clients, nothing you have to bolt on',
  description = 'No add-ons and no per-feature pricing. Every workspace gets the full set from day one.',
  checks = ['Unlimited clients and invoices', 'Recurring invoices and retainers', 'Card and bank transfer payments', 'Automatic payment reminders', 'Multi-currency, 30+ currencies', 'VAT and reverse charge rules', 'Time and expense tracking', 'Two-way sync with your books'],
  imageSrc,
  imageAlt = '',
  primaryAction = { label: 'Start free trial', href: '#signup' },
  secondaryAction = { label: 'Compare plans', href: '#pricing' },
  tone,
  ...props
}: FeatureChecklistProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} data-slot="feature-checklist" {...props}>
      <div className="flex w-full flex-col gap-10 @4xl:flex-row @4xl:items-center @4xl:gap-16">
        <ImagePlaceholder ratio="4:3" src={imageSrc} alt={imageAlt} showCaption={false} className="w-full rounded-xl @4xl:w-auto @4xl:min-w-0 @4xl:flex-1" />
        <div data-slot="feature-checklist-content" className="flex min-w-0 flex-col gap-8 @4xl:flex-1">
          <SectionHeader titleId={id} align="left" overline={overline} title={title} description={description} />
          <ul className="m-0 grid grid-cols-1 gap-x-6 gap-y-4 p-0 @md:grid-cols-2">{checks.map(c => <CheckItem key={c} stateText={checkText}>{c}</CheckItem>)}</ul>
          <Actions primary={primaryAction} secondary={secondaryAction} />
        </div>
      </div>
    </Shell>
  );
}

/* Integrations Grid */

export interface IntegrationsGridProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  /** Tool names, one Logo Tile each; only tools the product really integrates with. */
  tools?: string[];
  note?: string;
  primaryAction?: SectionLink;
  secondaryAction?: SectionLink;
  tone?: SectionTone;
}

/** Block / Integrations Grid: muted band, 4 columns of bordered Logo Tiles (72 high, 16 apart), a note and actions. */
function IntegrationsGrid({
  overline = 'INTEGRATIONS',
  title = 'Works with the tools you already pay for',
  description = '40+ connectors for banking, accounting, CRM and messaging, maintained by us, plus an open API and webhooks for the rest.',
  tools = ['Kestrel', 'Quintra', 'Halcyon', 'Corvid', 'Vireo', 'Northwind', 'Fieldstone', 'Brightpath', 'Lumora', 'Orbitly', 'Meridian', 'Tidewater'],
  note = 'Missing a tool? Connect anything with the REST API and webhooks.',
  primaryAction = { label: 'See all 40+ integrations', href: '#integrations' },
  secondaryAction = { label: 'Read the API docs', href: '#api' },
  tone = 'muted',
  ...props
}: IntegrationsGridProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} data-slot="integrations-grid" {...props}>
      <SectionHeader titleId={id} overline={overline} title={title} description={description} />
      <ul aria-label="Integrations" className="m-0 grid w-full list-none grid-cols-2 gap-4 p-0 @2xl:grid-cols-3 @4xl:grid-cols-4">
        {tools.map(t => (
          // TODO Logo Tile and the Logo / * marks: not in the code library yet; a bordered card with the wordmark.
          <li key={t} data-slot="logo-tile" className="flex h-18 items-center justify-center rounded-lg border border-border bg-card px-6">
            <Logo type="wordmark" name={t} />
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center gap-4 text-center">
        {note ? <p className="m-0 text-base leading-7 text-muted-foreground">{note}</p> : null}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryAction ? <Button asChild variant="outline"><a href={primaryAction.href}>{primaryAction.label}</a></Button> : null}
          {secondaryAction ? <ArrowLink link={secondaryAction} /> : null}
        </div>
      </div>
    </Shell>
  );
}

/* Features with Code */

export interface FeaturesWithCodeProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  items?: FeatureEntry[];
  /** The install command (Command Snippet). */
  command?: string;
  /** A sample that runs, under 15 lines. */
  code?: string;
  language?: string;
  primaryAction?: SectionLink;
  secondaryAction?: SectionLink;
  tone?: SectionTone;
}

const sampleCode = `import { Acme } from "@acme/sdk";

const acme = new Acme({ apiKey: process.env.ACME_API_KEY });

const invoice = await acme.invoices.create({
  customer: "cus_northwind",
  currency: "EUR",
  lines: [{ description: "Design retainer, March", amount: 4800 }],
  dueInDays: 30,
});

await acme.invoices.send(invoice.id);
// invoice.status === "sent"`;

/** Block / Features with Code: left 448 (Section Header left, inline Feature Items, actions), right a Command Snippet and a Code Block (640). */
function FeaturesWithCode({
  overline = 'DEVELOPERS',
  title = 'Send your first invoice from code in five minutes',
  description = 'A typed SDK, a REST API and webhooks for every event. Build invoicing into your product without rebuilding accounting.',
  items = [
    { icon: <Code />, title: 'Typed SDKs for TypeScript and Python', description: 'Autocomplete for every field, automatic retries and idempotency keys built in.' },
    { icon: <Zap />, title: 'Webhooks for every event', description: 'Get invoice.paid, invoice.overdue and approval.decided the moment they happen, signed and retried.' },
    { icon: <KeyRound />, title: 'Scoped API keys and a sandbox', description: 'Test with sample customers and EUR payments, then switch one key to go live.' },
  ],
  command = 'npm install @acme/sdk',
  code = sampleCode,
  language = 'TypeScript',
  primaryAction = { label: 'Read the docs', href: '#docs' },
  secondaryAction = { label: 'API reference', href: '#api' },
  tone,
  ...props
}: FeaturesWithCodeProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} data-slot="features-with-code" {...props}>
      <div className="flex w-full flex-col gap-12 @5xl:flex-row @5xl:items-center @5xl:gap-16">
        <div data-slot="features-split-text" className="flex min-w-0 flex-col gap-10 @5xl:w-[448px] @5xl:shrink-0">
          <SectionHeader titleId={id} align="left" overline={overline} title={title} description={description} />
          <div className="flex flex-col gap-6">
            {items.map(f => <FeatureItem key={f.title} layout="inline" icon={f.icon} title={f.title} description={f.description} />)}
          </div>
          <Actions primary={primaryAction} secondary={secondaryAction} />
        </div>
        <div data-slot="features-split-media" className="flex min-w-0 flex-1 flex-col gap-4">
          <CommandSnippet command={command} />
          <CodeBlock code={code} language={language} label="Create and send an invoice with the Acme SDK" />
        </div>
      </div>
    </Shell>
  );
}

/* Use Cases */

export interface UseCase { overline: string; title: string; description: string; link: SectionLink; imageSrc?: string; imageAlt?: string }

export interface UseCasesProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  /** 3 or 4 teams or industries, each linking to its page. */
  cases?: UseCase[];
  tone?: SectionTone;
}

const useCases: UseCase[] = [
  { overline: 'FINANCE TEAMS', title: 'Close the month in days', description: 'Bank sync, automatic matching and an approval trail your auditor can follow.', link: { label: 'For finance teams', href: '#finance' } },
  { overline: 'AGENCIES AND STUDIOS', title: 'Bill every hour you work', description: 'Turn tracked time and retainers into invoices clients pay on time.', link: { label: 'For agencies', href: '#agencies' } },
  { overline: 'OPERATIONS', title: 'Approve spend on the go', description: 'Route purchase requests by amount and approve them from your phone.', link: { label: 'For operations', href: '#operations' } },
  { overline: 'FOUNDERS', title: 'Know your runway every morning', description: 'Cash, receivables and monthly burn in one view, in EUR or your own currency.', link: { label: 'For founders', href: '#founders' } },
];

/** Block / Use Cases: 4 outline Cards (image 4:3, overline, title, description, link pushed to the bottom), 24 apart. */
function UseCases({
  overline = 'USE CASES',
  title = 'Built for every team that touches money',
  description = 'From the first quote to the last payment reminder, each team gets the views and approvals it needs.',
  cases = useCases,
  tone,
  ...props
}: UseCasesProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} data-slot="use-cases" {...props}>
      <SectionHeader titleId={id} overline={overline} title={title} description={description} />
      <ul className={cn('m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @2xl:grid-cols-2', cases.length === 3 ? '@5xl:grid-cols-3' : '@5xl:grid-cols-4')}>
        {cases.map(c => (
          <li key={c.title} className="flex">
            <Card variant="outline" className="w-full gap-6 px-6">
              <ImagePlaceholder ratio="4:3" src={c.imageSrc} alt={c.imageAlt ?? ''} showCaption={false} className="rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <p className="m-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase">{c.overline}</p>
                <h3 className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px]">{c.title}</h3>
                <p className="m-0 text-sm leading-5 text-muted-foreground">{c.description}</p>
              </div>
              <ArrowLink link={c.link} className="self-start" />
            </Card>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

/* Us vs Them */

export type ComparisonValue = boolean | string;
export interface ComparisonRow { feature: string; values: [ComparisonValue, ComparisonValue, ComparisonValue] }

export interface UsVsThemProps extends Omit<React.ComponentProps<'section'>, 'title'>, SectionHeading {
  /** Our product, shown with the Logo in the highlighted column. */
  product?: string;
  /** Categories of tool, never competitor names. */
  alternatives?: [string, string];
  rows?: ComparisonRow[];
  /** Sources and date of the comparison. */
  note?: string;
  primaryAction?: SectionLink;
  secondaryAction?: SectionLink;
  tone?: SectionTone;
}

const comparisonRows: ComparisonRow[] = [
  { feature: 'Invoices, quotes and reminders in one place', values: [true, false, true] },
  { feature: 'Approval routing by amount and team', values: [true, false, true] },
  { feature: 'Bank sync and automatic matching', values: [true, false, 'Paid add-on'] },
  { feature: 'Approve from your phone', values: [true, false, false] },
  { feature: 'Data stored in the EU', values: [true, false, false] },
  { feature: 'Audit log of every change', values: [true, false, true] },
  { feature: 'Time to set up', values: ['1 day', 'Hours', '3 to 6 months'] },
  { feature: 'Price for a team of 20', values: ['€580 / month', 'Free', 'From €2,400 / month'] },
];

const cellValue = (v: ComparisonValue) => (typeof v === 'string' ? <TableCellCheck value="text" text={v} /> : <TableCellCheck value={v ? 'included' : 'excluded'} />);
const usCell = 'bg-[var(--card-muted)]';

/**
 * Block / Us vs Them: muted band, a 1024 comparison card (a real table: features as row headers,
 * the product column highlighted on card/muted), the sources note and actions.
 */
function UsVsThem({
  overline = 'WHY ACME',
  title = 'Acme compared with spreadsheets and legacy suites',
  description = 'What changes when invoices, approvals and payments live in one tool.',
  product = 'Acme',
  alternatives = ['Spreadsheets', 'Legacy AP suite'],
  rows = comparisonRows,
  note = 'Based on public pricing pages and product documentation, October 2026. Acme Business plan, billed yearly.',
  primaryAction = { label: 'Start free trial', href: '#signup' },
  secondaryAction = { label: 'Compare plans', href: '#pricing' },
  tone = 'muted',
  ...props
}: UsVsThemProps) {
  const id = React.useId();
  return (
    <Shell titleId={id} tone={tone} data-slot="us-vs-them" {...props}>
      <SectionHeader titleId={id} overline={overline} title={title} description={description} />
      {/* On a phone the table scrolls sideways inside the card: a focusable, named region. */}
      <div
        data-slot="comparison"
        role="region"
        aria-label={`${product} comparison table`}
        tabIndex={0}
        className="w-full max-w-5xl overflow-x-auto rounded-xl border border-border bg-card text-card-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Table fixed className="min-w-[560px]" containerClassName="overflow-visible">
          <caption className="sr-only">{`${product} compared with ${alternatives.join(' and ')}`}</caption>
          <TableHeader>
            <TableRow>
              <TableHead className="h-[72px] w-[39%] px-6 text-muted-foreground">Compare</TableHead>
              <TableHead className={cn('h-[72px] px-6 text-center', usCell)}><span className="inline-flex justify-center"><Logo name={product} /></span></TableHead>
              {alternatives.map(a => <TableHead key={a} className="h-[72px] px-6 text-center text-foreground">{a}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, ri) => (
              <TableRow key={r.feature}>
                <TableHead scope="row" className={cn('h-[52px] px-6 py-4 font-normal whitespace-normal text-foreground', ri === rows.length - 1 && 'border-b-0')}>{r.feature}</TableHead>
                {r.values.map((v, i) => (
                  <TableCell key={i} className={cn('h-[52px] px-6 py-4', i === 0 && usCell, ri === rows.length - 1 && 'border-b-0')}>
                    <span className="flex justify-center">{cellValue(v)}</span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full max-w-5xl flex-col items-center gap-6 text-center">
        {note ? <p className="m-0 text-xs leading-4 text-muted-foreground">{note}</p> : null}
        <Actions primary={primaryAction} secondary={secondaryAction} secondaryStyle="outline" align="center" />
      </div>
    </Shell>
  );
}

export {
  BentoGrid, BentoGrid2, FeatureChecklist, Features, FeaturesSplit, FeaturesTabs, FeaturesWithCode, FeaturesWithScreenshot,
  HowItWorks, IntegrationsGrid, Screenshot, UseCases, UsVsThem,
};
