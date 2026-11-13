// EGG UI blocks, BLOCKS / Sections page (73:2), CTA family: Block / CTA (73:74), CTA Split
// (198:1810), CTA Card (198:1835), CTA with Screenshot (693:109008), CTA with Form (810:138689),
// CTA App Download (810:138722). Guide: build-ui/patterns/marketing-pages.md (CTA row): Card once
// per page near the end; Split with a product shot mid-page; with Screenshot when the product is
// the argument; with Form when the next step is an email; App Download to close a mobile app page.
// Every block is a <section> named by its h2 (heading/h1 style), on a 1152 container
// (layout/container/6xl), 96 px above and below, 24 / 32 px gutters below 1152; layout follows the
// block's own width (container queries). Each CTA has one primary action, a secondary one and a
// proof row (Avatar Group of 5 and a Rating sm with its count).
// CTA: card-muted band, radius xl, 48 padding; text left, Action Bar (outline + primary, lg) right
// from 768, under the text below. CTA Split: a bordered card (radius xl, clips): text column (48
// padding, overline, h2, lead, Action Bar start, proof) and a muted media half (396 high, 40 inset)
// with a browser Device Frame of the invoices screen cropped at the right and bottom; stacked
// below 896. CTA Card: primary card, 64 padding, centered, soft white glow on top (Show
// decoration), secondary Button + link, proof, note. CTA with Screenshot: primary card, text 560
// (64 padding) and a browser Device Frame of the dashboard cropped at the right and bottom (64
// from the top); stacked below 896. CTA with Form: muted band, centered 672 text column, Inline Form
// (480), 2-3 Check Items in a row, privacy note (560). CTA App Download: primary card (64 left and
// top), text, store buttons, QR tile with its title and caption (from 768), and a phone Device Frame
// of the customers screen cropped at the bottom (456 column).
// Device screens are pictures of the product: one image (role img, named) whose inside is inert.
// TODO Store Badge and QR Code (Mobile page, on hold): store links are Buttons with an icon and
// the QR is an Image Placeholder in a card tile until those components are in code.
import * as React from 'react';
import { Bell, ChevronRight, Menu, Play, Smartphone } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ActionBar } from './action-bar';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { Badge } from './badge';
import { Button } from './button';
import { BarChartHorizontal, ChartCard, DistributionBar } from './charts';
import { CheckItem } from './form-layout';
import { ImagePlaceholder } from './image-placeholder';
import { DeviceFrame } from './imagery';
import { InlineForm } from './inline-form';
import { ListItem } from './list';
import { Rating } from './rating';
import { SearchField } from './search-field';
import { StatCard } from './stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

/* Shared parts */

const shell = '@container w-full';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col px-6 py-24 @3xl:px-8 @6xl:px-0';
const titleH1 = 'm-0 text-3xl leading-9 font-extrabold tracking-tight @3xl:text-4xl @3xl:leading-10';
const lead = 'm-0 text-lg leading-7 @3xl:text-xl';
const overlineCls = 'm-0 text-xs leading-4 font-semibold tracking-widest uppercase';

export interface CTAAction {
  label: string;
  href: string;
}

export interface CTAProof {
  /** Initials of the five faces in the Avatar Group (photos in a real page). */
  people?: string[];
  /** Average rating, 0 to 5. */
  rating?: number;
  /** The count line next to the stars: "4.8 from 1,200 reviews". */
  count?: string;
}

const defaultProof: Required<CTAProof> = { people: ['AP', 'MI', 'ED', 'RC', 'IS'], rating: 4.8, count: '4.8 from 1,200 reviews' };

/** Proof row: Avatar Group, Rating sm and its count. `onPrimary` sets the count in primary-foreground. */
function ProofRow({ proof, onPrimary = false, className }: { proof?: CTAProof; onPrimary?: boolean; className?: string }) {
  const p = { ...defaultProof, ...proof };
  return (
    <div data-slot="cta-proof" className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      <AvatarGroup aria-label="Acme customers">
        {p.people.map(i => <Avatar key={i} initials={i} />)}
      </AvatarGroup>
      <span className="inline-flex items-center gap-1">
        <Rating size="sm" value={p.rating} />
        <span className={cn('text-xs leading-4', onPrimary ? 'text-primary-foreground' : 'text-muted-foreground')}>{p.count}</span>
      </span>
    </div>
  );
}

const linkOnPrimary = 'text-primary-foreground underline-offset-4 hover:underline';

/** A product screen in a Device Frame: one named image, its inside inert. */
function Screen({ label, device, address, className, children }: { label: string; device: 'browser' | 'phone'; address?: string; className?: string; children: React.ReactNode }) {
  return (
    <DeviceFrame role="img" aria-label={label} device={device} address={address} className={cn('max-w-none', className)}>
      <div aria-hidden="true" inert className="w-full text-foreground">{children}</div>
    </DeviceFrame>
  );
}

/* Sample screens (replace with the client's own product screens) */

const invoices = [
  { initials: 'NT', name: 'Northwind Traders', email: 'billing@northwind.example', id: 'INV-1041', status: 'Overdue', variant: 'soft-warning', note: '12 days' },
  { initials: 'KE', name: 'Kestrel', email: 'ap@kestrel.example', id: 'INV-1043', status: 'Sent', variant: 'soft-info', note: 'due Nov 2' },
  { initials: 'FI', name: 'Fieldstone', email: 'finance@fieldstone.example', id: 'INV-1046', status: 'Paid', variant: 'soft-success', note: 'Oct 18' },
  { initials: 'QU', name: 'Quintra', email: 'accounts@quintra.example', id: 'INV-1047', status: 'Overdue', variant: 'soft-warning', note: '4 days' },
  { initials: 'BR', name: 'Brightpath', email: 'pay@brightpath.example', id: 'INV-1049', status: 'Draft', variant: 'soft-neutral', note: '' },
] as const;

function InvoicesScreen() {
  return (
    <div className="flex w-full flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-lg leading-7 font-semibold">Invoices</p>
        <p className="m-0 text-xs leading-4 text-muted-foreground">1,284 invoices · €2.4M outstanding</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(r => (
            <TableRow key={r.id}>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Avatar size="sm" initials={r.initials} />
                  <span className="flex flex-col">
                    <span className="text-sm leading-5 font-medium">{r.name}</span>
                    <span className="text-xs leading-4 text-muted-foreground">{r.email}</span>
                  </span>
                </span>
              </TableCell>
              <TableCell>{r.id}</TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Badge variant={r.variant} dot>{r.status}</Badge>
                  <span className="text-xs text-muted-foreground">{r.note}</span>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="grid w-full grid-cols-2 gap-4 p-5">
      <StatCard className="w-auto" showChange={false} label="Revenue this quarter" value="€412,000" trendText="86% of the €480k target" footnote="Q4 2026 to date" />
      <StatCard className="w-auto" showChange={false} label="Open invoices" value="€96,300" trend="down" trendText="Fewer overdue than in Q3" footnote="Updated 5 min ago" />
      <ChartCard title="Where the money is" description="Open invoices by status">
        <DistributionBar title="Invoices by status" data={[{ label: 'Paid', value: 62 }, { label: 'Pending', value: 21 }, { label: 'Overdue', value: 11 }, { label: 'Draft', value: 6 }]} />
      </ChartCard>
      <ChartCard title="Top accounts" description="Revenue, Q4 to date">
        <BarChartHorizontal label="Revenue by account" formatValue={v => `€${v.toLocaleString('en-GB')}`} data={[{ label: 'Northwind Traders', value: 182400 }, { label: 'Kestrel', value: 156900 }, { label: 'Fieldstone', value: 121300 }]} />
      </ChartCard>
    </div>
  );
}

const customers = [
  { initials: 'AP', name: 'Ana Popescu', next: 'Next: Tue 22 Oct, 10:30' },
  { initials: 'MI', name: 'Mihai Ionescu', next: 'Next: Wed 23 Oct, 09:00' },
  { initials: 'ED', name: 'Elena Dumitru', next: 'No upcoming visit' },
  { initials: 'RC', name: 'Radu Constantin', next: 'Next: Fri 25 Oct, 14:00' },
  { initials: 'IS', name: 'Ioana Stan', next: 'No upcoming visit' },
  { initials: 'GM', name: 'George Marin', next: 'Next: Mon 28 Oct, 11:30' },
];

function CustomersPhoneScreen() {
  return (
    <div className="flex h-[812px] w-full flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-border px-4 pt-6 pb-3">
        <Menu aria-hidden="true" className="size-5 text-muted-foreground" />
        <p className="m-0 flex-1 text-xl leading-7 font-semibold">Customers</p>
        <Bell aria-hidden="true" className="size-5 text-muted-foreground" />
        <Avatar initials="DP" />
      </div>
      <div className="px-4 py-3">
        <SearchField placeholder="Search customers" />
      </div>
      <ul className="m-0 flex flex-col p-0 px-2">
        {customers.map(c => (
          <ListItem key={c.name} title={c.name} description={c.next} leading={<Avatar initials={c.initials} size="lg" />} trailing={<ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />} />
        ))}
      </ul>
    </div>
  );
}

/* CTA */

export interface CTABaseProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: CTAAction;
  secondaryAction?: CTAAction;
  /** Figma Show proof: the Avatar Group and Rating row; null hides it. */
  proof?: CTAProof | null;
}

function CTA({
  title = 'Run your first month on Acme, free',
  description = 'We import your clients and projects for you. Cancel anytime.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Talk to sales', href: '#sales' },
  proof = defaultProof,
  className,
  ...props
}: CTABaseProps) {
  const titleId = React.useId();
  return (
    <section data-slot="cta" aria-labelledby={titleId} className={cn(shell, 'bg-background text-foreground', className)} {...props}>
      <div className={inner}>
        <div data-slot="cta-band" className="flex w-full min-w-0 flex-col gap-8 rounded-xl bg-[var(--card-muted)] p-6 @3xl:flex-row @3xl:items-center @3xl:p-12">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <h2 id={titleId} className={titleH1}>{title}</h2>
            {description ? <p className={cn(lead, 'text-muted-foreground')}>{description}</p> : null}
            {proof ? <ProofRow proof={proof} /> : null}
          </div>
          <ActionBar align="start" className="w-auto shrink-0 @3xl:[&_[data-slot=action-bar-actions]]:justify-end">
            {secondaryAction ? <Button asChild variant="outline" size="lg"><a href={secondaryAction.href}>{secondaryAction.label}</a></Button> : null}
            <Button asChild size="lg"><a href={primaryAction.href}>{primaryAction.label}</a></Button>
          </ActionBar>
        </div>
      </div>
    </section>
  );
}

/* CTA Split */

export interface CTASplitProps extends CTABaseProps {
  overline?: React.ReactNode;
  /** The product shot; default: the invoices screen in a browser Device Frame. */
  media?: React.ReactNode;
}

function CTASplit({
  overline = 'Get started',
  title = 'See your own data in Acme in 30 minutes',
  description = 'A product specialist sets up a workspace with your invoices and approval rules, then walks your team through it.',
  primaryAction = { label: 'Book a demo', href: '#demo' },
  secondaryAction = { label: 'Talk to sales', href: '#sales' },
  proof = { count: '4.9 from 860 onboarding calls', rating: 4.9 },
  media,
  className,
  ...props
}: CTASplitProps) {
  const titleId = React.useId();
  return (
    <section data-slot="cta-split" aria-labelledby={titleId} className={cn(shell, 'bg-background text-foreground', className)} {...props}>
      <div className={inner}>
        <div data-slot="cta-split-card" className="flex w-full min-w-0 flex-col overflow-clip rounded-xl border border-border bg-card text-card-foreground @4xl:flex-row @4xl:items-center">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6 p-6 @3xl:p-12">
            {overline ? <p className={cn(overlineCls, 'text-brand')}>{overline}</p> : null}
            <h2 id={titleId} className={titleH1}>{title}</h2>
            {description ? <p className={cn(lead, 'text-muted-foreground')}>{description}</p> : null}
            <ActionBar align="start">
              <Button asChild><a href={primaryAction.href}>{primaryAction.label}</a></Button>
              {secondaryAction ? <Button asChild variant="outline"><a href={secondaryAction.href}>{secondaryAction.label}</a></Button> : null}
            </ActionBar>
            {proof ? <ProofRow proof={proof} /> : null}
          </div>
          <div data-slot="cta-split-media" className="relative h-72 w-full min-w-0 shrink-0 overflow-clip bg-muted @4xl:h-[396px] @4xl:flex-1">
            {media ?? (
              <Screen label="The Acme invoices screen: invoices by customer with their status" device="browser" address="app.acme.com/invoices" className="absolute top-6 left-6 w-[720px] @4xl:top-10 @4xl:left-10">
                <InvoicesScreen />
              </Screen>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* CTA Card */

export interface CTACardProps extends CTABaseProps {
  /** Figma Show decoration: the soft glow on top. Turn it off when the page has a Background. */
  showDecoration?: boolean;
  note?: React.ReactNode;
}

function CTACard({
  title = 'Ready to move approvals out of email?',
  description = 'Start a 30-day trial with your team. Your data stays in the EU.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Talk to sales', href: '#sales' },
  proof = defaultProof,
  showDecoration = true,
  note = 'No credit card required',
  className,
  ...props
}: CTACardProps) {
  const titleId = React.useId();
  return (
    <section data-slot="cta-card" aria-labelledby={titleId} className={cn(shell, 'bg-background text-foreground', className)} {...props}>
      <div className={inner}>
        <div data-slot="cta-card-panel" className="relative isolate flex w-full min-w-0 flex-col items-center gap-6 overflow-clip rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground @3xl:p-16">
          {showDecoration ? (
            <div aria-hidden="true" data-slot="cta-card-glow" className="pointer-events-none absolute top-[-140px] left-1/2 -z-10 h-[280px] w-[720px] max-w-full -translate-x-1/2 rounded-full bg-primary-foreground/20 blur-3xl forced-colors:hidden" />
          ) : null}
          <h2 id={titleId} className={titleH1}>{title}</h2>
          {description ? <p className={lead}>{description}</p> : null}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="secondary"><a href={primaryAction.href}>{primaryAction.label}</a></Button>
            {secondaryAction ? <Button asChild variant="link" className={linkOnPrimary}><a href={secondaryAction.href}>{secondaryAction.label}</a></Button> : null}
          </div>
          {proof ? <ProofRow proof={proof} onPrimary className="justify-center" /> : null}
          {note ? <p className="m-0 text-xs leading-4">{note}</p> : null}
        </div>
      </div>
    </section>
  );
}

/* CTA with Screenshot */

export interface CTAWithScreenshotProps extends CTABaseProps {
  /** Figma Show eyebrow + Eyebrow. */
  eyebrow?: React.ReactNode;
  /** Figma Show note + Note. */
  note?: React.ReactNode;
  /** The product screen; default: the dashboard in a browser Device Frame. */
  media?: React.ReactNode;
}

function CTAWithScreenshot({
  eyebrow = 'Start in one afternoon',
  title = 'Close the month in days, not weeks',
  description = 'Import your clients and open invoices, connect your bank and send the first reminder before the day ends. Your data stays in the EU.',
  primaryAction = { label: 'Start free trial', href: '#trial' },
  secondaryAction = { label: 'Book a demo', href: '#demo' },
  proof = defaultProof,
  note = 'No credit card required. Cancel anytime.',
  media,
  className,
  ...props
}: CTAWithScreenshotProps) {
  const titleId = React.useId();
  return (
    <section data-slot="cta-with-screenshot" aria-labelledby={titleId} className={cn(shell, 'bg-background text-foreground', className)} {...props}>
      <div className={inner}>
        <div data-slot="cta-with-screenshot-panel" className="flex w-full min-w-0 flex-col overflow-clip rounded-xl bg-primary text-primary-foreground @4xl:flex-row">
          <div className="flex min-w-0 flex-col justify-center gap-6 p-6 @3xl:p-16 @4xl:w-[560px] @4xl:shrink-0">
            {eyebrow ? <p className={overlineCls}>{eyebrow}</p> : null}
            <h2 id={titleId} className={titleH1}>{title}</h2>
            {description ? <p className={lead}>{description}</p> : null}
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="secondary"><a href={primaryAction.href}>{primaryAction.label}</a></Button>
              {secondaryAction ? <Button asChild variant="link" className={linkOnPrimary}><a href={secondaryAction.href}>{secondaryAction.label}</a></Button> : null}
            </div>
            {proof ? <ProofRow proof={proof} onPrimary /> : null}
            {note ? <p className="m-0 text-xs leading-4">{note}</p> : null}
          </div>
          <div data-slot="cta-with-screenshot-media" className="relative h-80 w-full min-w-0 shrink-0 overflow-clip @4xl:h-auto @4xl:flex-1">
            {media ?? (
              <Screen label="The Acme dashboard: revenue, open invoices, invoices by status and top accounts" device="browser" address="app.acme.com/dashboard" className="absolute top-0 left-6 w-[760px] @4xl:top-16 @4xl:left-0">
                <DashboardScreen />
              </Screen>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* CTA with Form */

export interface CTAWithFormProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onSubmit'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Inline Form: the button names the result. */
  buttonLabel?: string;
  placeholder?: string;
  /** The trial terms under the field. */
  hint?: React.ReactNode;
  /** What happens next, after a valid email. */
  successMessage?: React.ReactNode;
  /** Figma Show benefits: 2-3 facts as Check Items; [] hides them. */
  benefits?: string[];
  /** Figma Show note: names the Terms and Privacy Policy and what the email is for; null hides it. */
  note?: React.ReactNode;
  /** A valid email was sent. The block shows the success message. */
  onSubmit?: (email: string) => void;
}

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

function CTAWithForm({
  title = 'Send your first invoice before lunch',
  description = 'Create your workspace in two minutes, import customers from a spreadsheet and get paid in EUR from day one.',
  buttonLabel = 'Start free trial',
  placeholder = 'Work email',
  hint = '30 days free on the Business plan. No credit card required.',
  successMessage = 'Check your inbox: we sent you a link to open your workspace.',
  benefits = ['Set up in 2 minutes', 'Import from Excel or CSV', 'Cancel anytime'],
  note = (
    <>
      By signing up you agree to the <a href="#terms" className="underline underline-offset-4">Terms</a> and the{' '}
      <a href="#privacy" className="underline underline-offset-4">Privacy Policy</a>. We use your email for your account and product updates only.
    </>
  ),
  onSubmit,
  className,
  ...props
}: CTAWithFormProps) {
  const titleId = React.useId();
  const [error, setError] = React.useState<string>();
  const [done, setDone] = React.useState(false);
  return (
    <section data-slot="cta-with-form" aria-labelledby={titleId} className={cn(shell, 'bg-[var(--section-muted-background)] text-foreground', className)} {...props}>
      <div className={cn(inner, 'items-center gap-8 text-center')}>
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <h2 id={titleId} className={titleH1}>{title}</h2>
          {description ? <p className={cn(lead, 'text-muted-foreground')}>{description}</p> : null}
        </div>
        <InlineForm
          className="w-120 text-left"
          label="Work email"
          placeholder={placeholder}
          buttonLabel={buttonLabel}
          hint={hint}
          error={error}
          success={done ? successMessage : undefined}
          inputProps={{ type: 'email', name: 'email', autoComplete: 'email' }}
          onValueChange={() => { setError(undefined); setDone(false); }}
          onSubmit={value => {
            if (!isEmail(value)) { setError('Enter an email address like name@company.com.'); return; }
            setDone(true);
            onSubmit?.(value.trim());
          }}
        />
        {benefits.length ? (
          <ul data-slot="cta-with-form-benefits" className="m-0 flex flex-wrap justify-center gap-x-6 gap-y-2 p-0">
            {benefits.map(b => <CheckItem key={b} stateText={{ check: '' }}>{b}</CheckItem>)}
          </ul>
        ) : null}
        {note ? <p className="m-0 max-w-[560px] text-xs leading-4 text-muted-foreground">{note}</p> : null}
      </div>
    </section>
  );
}

/* CTA App Download */

export interface CTAAppDownloadProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Figma Show eyebrow + Eyebrow. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** The real store pages; keep both. */
  appStoreHref?: string;
  googlePlayHref?: string;
  /** Figma Show QR (from 768 only: desktop visitors scan it). */
  showQr?: boolean;
  qrTitle?: React.ReactNode;
  qrCaption?: React.ReactNode;
  /** The phone screen; default: the customers list. */
  screen?: React.ReactNode;
}

function CTAAppDownload({
  eyebrow = 'Acme for iPhone and Android',
  title = 'Your customers and invoices in your pocket',
  description = 'See every customer, upcoming visit and unpaid invoice on iPhone and Android, and approve spend on the go. Free with every plan.',
  appStoreHref = '#app-store',
  googlePlayHref = '#google-play',
  showQr = true,
  qrTitle = 'Scan to get the app',
  qrCaption = 'Point your phone camera at the code. It opens the right store for your phone.',
  screen,
  className,
  ...props
}: CTAAppDownloadProps) {
  const titleId = React.useId();
  return (
    <section data-slot="cta-app-download" aria-labelledby={titleId} className={cn(shell, 'bg-background text-foreground', className)} {...props}>
      <div className={inner}>
        <div data-slot="cta-app-download-panel" className="flex w-full min-w-0 flex-col gap-10 overflow-clip rounded-xl bg-primary px-6 pt-10 text-primary-foreground @3xl:px-16 @3xl:pt-16 @4xl:flex-row @4xl:gap-16 @4xl:pr-0">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6 @4xl:pb-16">
            {eyebrow ? <p className={overlineCls}>{eyebrow}</p> : null}
            <h2 id={titleId} className={titleH1}>{title}</h2>
            {description ? <p className={lead}>{description}</p> : null}
            <div data-slot="cta-app-download-stores" className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" size="lg">
                <a href={appStoreHref}><Smartphone aria-hidden="true" />Download on the App Store</a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href={googlePlayHref}><Play aria-hidden="true" />Get it on Google Play</a>
              </Button>
            </div>
            {showQr ? (
              <div data-slot="cta-app-download-qr" className="hidden items-center gap-4 pt-2 @3xl:flex">
                <div role="img" aria-label="QR code that opens the Acme app in your phone's store" className="shrink-0 rounded-lg bg-card p-3">
                  <ImagePlaceholder ratio="1:1" className="w-26" />
                </div>
                <div className="flex w-60 flex-col gap-1">
                  <p className="m-0 text-sm leading-5 font-medium">{qrTitle}</p>
                  <p className="m-0 text-xs leading-4">{qrCaption}</p>
                </div>
              </div>
            ) : null}
          </div>
          <div data-slot="cta-app-download-visual" className="relative h-80 min-w-0 shrink-0 overflow-clip @4xl:h-auto @4xl:w-[456px]">
            <Screen label="The Acme app on a phone: the customers list with upcoming visits" device="phone" className="absolute top-0 left-1/2 w-[300px] -translate-x-1/2 @4xl:w-[390px]">
              {screen ?? <CustomersPhoneScreen />}
            </Screen>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CTA, CTAAppDownload, CTACard, CTASplit, CTAWithForm, CTAWithScreenshot };
