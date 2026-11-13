// EGG UI blocks, BLOCKS / Sections page (73:2), Pricing family: Block / Pricing (76:20), Comparison
// Table (139:521), Pricing Single (205:1595), Pricing Calculator (205:1650), Pricing with Comparison
// (693:115421), Pricing Usage-based (810:139231), Pricing Enterprise Banner (810:139394).
// Built from the Pricing page parts (Plan Card, Price, Comparison Table, Check Item as PlanFeature),
// Section Header, Toggle Group, Badge, Slider, Summary Row, Table Cell Text, Separator, Trust Badge.
// Guide: build-ui/patterns/marketing-pages.md (Pricing row, Rules, Related components).
// Every block is a <section> named by its h2, 96 padding, 48 between parts, inside a 1152 container
// (layout/container/6xl) with 24 / 32 px gutters below 1152. Layout follows the block's own width
// (container queries), so it works in any column.
// Pricing: Section Header, a billing Toggle Group (outline) with the success "Save 20%" Badge, then
// 3 Plan Cards 24 apart (middle featured). 3 per row from 1024, one per row below.
// Comparison Table: Section Header above the library Comparison Table; below 1024 the table shows one
// plan at a time, picked with a segmented Toggle Group (guide: "mobile shows one plan at a time").
// Pricing Single: text (overline, h2, lead, two columns of Check Items) 64 from a 400 price card
// (Price lg, billing note, two buttons, caption); stacked below 1024.
// Pricing Calculator: Section Header above a 960 row: a calculator card (seats with a Slider, the
// tiers as Summary Rows) 32 from a summary card on section/muted-background (background/muted
// in Figma fails 4.5:1 for the muted text) (Price, the exact math, CTA, quote link).
// Pricing with Comparison: header and billing switch, 4 Plan Cards, an outline "Hide full comparison"
// button (aria-expanded) that opens the 4-plan Comparison Table, and the note.
// Pricing Usage-based: a tiers table card (720) 32 from an estimate card (400): Slider, graduated
// breakdown in Summary Rows, Price lg, note, CTA and a link. The tier the estimate lands in is
// highlighted with a soft-info "Your estimate" Badge.
// Pricing Enterprise Banner: an inverted card (foreground surface, 48 padding): Badge, h2, lead,
// inverted Check Items next to a 320 contact column; a bordered row of 4 inverted Trust Badges.
import * as React from 'react';
import { ArrowRight, ChevronDown, Globe, KeyRound, Lock, ShieldCheck } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { ComparisonTable, PlanCard, PlanFeature, Price, type ComparisonGroup } from './pricing';
import { SectionHeader } from './section-header-block';
import { Separator } from './separator';
import { Slider } from './slider';
import { SummaryList, SummaryRow } from './summary-row';
import { TableCellText } from './table-cells';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { TrustBadge } from './trust-badge';

/* Shared parts */

const shell = '@container w-full bg-background text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center gap-12 px-6 py-24 @3xl:px-8 @6xl:px-0';
const overlineCls = 'm-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase';
const caption = 'm-0 text-xs leading-4 text-muted-foreground';
const included = { check: 'Included: ', dash: 'Not included: ' };

export interface PricingHeader {
  overline?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export type BillingPeriod = 'monthly' | 'yearly';

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  badge?: string;
  /** Price per month in EUR; leave out for a custom (sales) plan. */
  monthly?: number;
  /** Text after the amount ("/ seat / month"). */
  period?: string;
  features: string[];
  /** Action label; defaults to "Start free trial", or "Contact sales" without a price. */
  action?: string;
  href?: string;
  /** The recommended plan: Plan Card featured and the primary button. */
  featured?: boolean;
}

/** Yearly billing saves 20%. */
const yearlyPrice = (monthly: number) => Math.round(monthly * 0.8);
const eur = (n: number, digits = 0) => `€${n.toLocaleString('en-IE', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

function BillingSwitch({ period, onPeriodChange, saving = 'Save 20%' }: { period: BillingPeriod; onPeriodChange: (p: BillingPeriod) => void; saving?: string }) {
  return (
    <div data-slot="pricing-billing" className="flex flex-wrap items-center justify-center gap-3">
      <ToggleGroup type="single" variant="outline" aria-label="Billing period" value={period} onValueChange={v => onPeriodChange(v as BillingPeriod)}>
        <ToggleGroupItem value="monthly" label="Monthly" />
        <ToggleGroupItem value="yearly" label="Yearly" />
      </ToggleGroup>
      {saving ? <Badge variant="success" shape="pill">{saving}</Badge> : null}
    </div>
  );
}

function PlanGrid({ plans, period, featuresTitle = "What's included" }: { plans: PricingPlan[]; period: BillingPeriod; featuresTitle?: string }) {
  return (
    <ul
      data-slot="pricing-plans"
      className={cn('m-0 grid w-full list-none grid-cols-1 items-start gap-6 p-0', plans.length >= 4 ? '@xl:grid-cols-2 @5xl:grid-cols-4' : '@5xl:grid-cols-3')}
    >
      {plans.map(p => {
        const amount = p.monthly === undefined ? undefined : period === 'yearly' ? yearlyPrice(p.monthly) : p.monthly;
        return (
          <li key={p.id} className="flex min-w-0">
            <PlanCard
              variant={p.featured ? 'featured' : 'default'}
              title={p.name}
              badge={p.badge}
              description={p.description}
              price={<Price amount={amount === undefined ? 'Custom' : eur(amount)} period={amount === undefined ? undefined : `${p.period ?? '/ month'}${period === 'yearly' ? ', billed yearly' : ''}`} />}
              action={
                <Button asChild variant={p.featured ? 'default' : 'outline'}>
                  <a href={p.href ?? (p.monthly === undefined ? '#contact-sales' : '#signup')}>{p.action ?? (p.monthly === undefined ? 'Contact sales' : 'Start free trial')}</a>
                </Button>
              }
              featuresTitle={featuresTitle}
              features={p.features.map(f => <PlanFeature key={f} stateText={included}>{f}</PlanFeature>)}
            />
          </li>
        );
      })}
    </ul>
  );
}

function Header({ header, titleId }: { header: PricingHeader; titleId: string }) {
  return <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />;
}

/* Pricing */

export interface PricingProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: PricingHeader;
  /** 2 to 3 plans; one featured. */
  plans?: PricingPlan[];
  defaultPeriod?: BillingPeriod;
  /** Figma Show billing switch. */
  showBilling?: boolean;
}

const pricingPlans: PricingPlan[] = [
  { id: 'starter', name: 'Starter', description: 'For a single person.', monthly: 149, period: '/ month per location', features: ['1 location', 'Client portal', 'SMS reminders (200/month)', 'Email support'] },
  { id: 'workspace', name: 'Workspace', badge: 'Most popular', featured: true, description: 'For growing teams.', monthly: 390, period: '/ month per location', features: ['Up to 3 locations', 'Everything in Starter', 'E-invoicing', 'Waiting list', 'Priority support'] },
  { id: 'network', name: 'Network', description: 'For multi-site groups.', features: ['Unlimited locations', 'Everything in Workspace', 'SSO and audit log', 'Dedicated manager'] },
];

function Pricing({
  header = { overline: 'Pricing', title: 'Simple pricing per location', description: 'Every plan includes unlimited staff accounts, reminders and support in 6 languages.' },
  plans = pricingPlans,
  defaultPeriod = 'monthly',
  showBilling = true,
  className,
  ...props
}: PricingProps) {
  const titleId = React.useId();
  const [period, setPeriod] = React.useState<BillingPeriod>(defaultPeriod);
  return (
    <section data-slot="pricing" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <Header header={header} titleId={titleId} />
        {showBilling ? <BillingSwitch period={period} onPeriodChange={setPeriod} /> : null}
        <PlanGrid plans={plans} period={showBilling ? period : 'monthly'} />
      </div>
    </section>
  );
}

/* Comparison Table (block) */

export interface ComparisonBlockPlan {
  id: string;
  name: string;
  badge?: string;
  /** Monthly price text ("€29"), or "Custom". */
  price?: string;
  period?: string;
  action?: string;
  href?: string;
  featured?: boolean;
}

const comparisonPlans: ComparisonBlockPlan[] = [
  { id: 'starter', name: 'Starter', price: '€0', period: '/ seat / month', action: 'Get started' },
  { id: 'team', name: 'Team', badge: 'Popular', price: '€29', period: '/ seat / month', action: 'Get started', featured: true },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', action: 'Contact sales', href: '#contact-sales' },
];

const comparisonGroups: ComparisonGroup[] = [
  { label: 'Core', rows: [{ feature: 'Projects', values: ['Unlimited', 'Unlimited', 'Unlimited'] }, { feature: 'Storage', values: ['5 GB', '100 GB', 'Custom'] }, { feature: 'Client portal', values: [false, true, true] }] },
  { label: 'Collaboration', rows: [{ feature: 'Guests', values: [false, '10', 'Unlimited'] }, { feature: 'Approvals', values: [false, true, true] }] },
  { label: 'Security', rows: [{ feature: 'SSO (SAML)', values: [false, false, true] }, { feature: 'Audit log', values: [false, false, true] }, { feature: 'Uptime SLA', values: [false, false, '99.9%'] }] },
];

/**
 * The library Comparison Table at full width from 1024 (4 plans share 80%); below, one plan at a time with a plan
 * picker (the same rows, one value column). `compact` leaves price and action out of the header.
 */
function ResponsiveComparison({ plans, groups, caption, compact = false }: { plans: ComparisonBlockPlan[]; groups: ComparisonGroup[]; caption: string; compact?: boolean }) {
  const [picked, setPicked] = React.useState(plans.find(p => p.featured)?.id ?? plans[0]?.id ?? '');
  const toTable = (p: ComparisonBlockPlan) => ({
    id: p.id,
    name: p.name,
    badge: p.badge,
    price: compact || !p.price ? null : <Price size="sm" amount={p.price} period={p.price === 'Custom' ? undefined : p.period} />,
    action: compact ? null : (
      <Button asChild size="sm" variant={p.featured ? 'default' : 'outline'}>
        <a href={p.href ?? '#signup'} aria-label={`${p.action ?? 'Get started'}, ${p.name}`}>{p.action ?? 'Get started'}</a>
      </Button>
    ),
  });
  const index = Math.max(0, plans.findIndex(p => p.id === picked));
  const one = groups.map(g => ({ label: g.label, rows: g.rows.map(r => ({ feature: r.feature, values: [r.values[index] ?? false] })) }));
  return (
    <div data-slot="pricing-comparison" className="w-full min-w-0">
      <div className="hidden @5xl:block">
        <ComparisonTable caption={caption} plans={plans.map(toTable)} groups={groups} className={plans.length >= 4 ? '[&_col:not(:first-child)]:w-[20%]' : undefined} />
      </div>
      <div className="flex flex-col items-center gap-6 @5xl:hidden">
        <ToggleGroup type="single" variant="segmented" fullWidth aria-label="Plan to compare" value={picked} onValueChange={setPicked} className="max-w-sm">
          {plans.map(p => <ToggleGroupItem key={p.id} value={p.id} label={p.name} />)}
        </ToggleGroup>
        <ComparisonTable caption={`${caption}: ${plans[index]?.name ?? ''}`} plans={plans[index] ? [toTable(plans[index]!)] : []} groups={one} className="[&_col:not(:first-child)]:w-32" />
      </div>
    </div>
  );
}

export interface ComparisonTableSectionProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: PricingHeader;
  /** 3 or 4 plans, in the same order as the plan cards. */
  plans?: ComparisonBlockPlan[];
  groups?: ComparisonGroup[];
}

function ComparisonTableSection({
  header = { overline: 'Compare plans', title: 'Everything in each plan', description: 'All plans include unlimited projects and free updates.' },
  plans = comparisonPlans,
  groups = comparisonGroups,
  className,
  ...props
}: ComparisonTableSectionProps) {
  const titleId = React.useId();
  return (
    <section data-slot="pricing-comparison-table" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <Header header={header} titleId={titleId} />
        <ResponsiveComparison plans={plans} groups={groups} caption="Compare plans" />
      </div>
    </section>
  );
}

/* Pricing Single */

export interface PricingSingleProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Up to 8 short items in two columns. */
  features?: string[];
  amount?: string;
  period?: string;
  /** How it is billed, with the other period's price. */
  billingNote?: string;
  primaryAction?: string;
  secondaryAction?: string;
  /** Fine print under the buttons. */
  note?: string;
}

function PricingSingle({
  overline = 'Pricing',
  title = 'One plan with everything included',
  description = 'No feature gates, no add-ons. Pay per seat and cancel any time.',
  features = ['Unlimited invoices and customers', 'Approvals and audit log', 'Reports and exports', 'SSO with Okta and Entra ID', 'Roles and permissions', 'Priority support'],
  amount = '€29',
  period = 'per seat / month',
  billingNote = 'Billed yearly. €35 when billed monthly.',
  primaryAction = 'Start 30-day trial',
  secondaryAction = 'Talk to sales',
  note = 'No credit card required. Data hosted in the EU.',
  className,
  ...props
}: PricingSingleProps) {
  const titleId = React.useId();
  const half = Math.ceil(features.length / 2);
  return (
    <section data-slot="pricing-single" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <div data-slot="pricing-single-row" className="flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:items-center @5xl:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            {overline ? <p className={overlineCls}>{overline}</p> : null}
            <h2 id={titleId} className="m-0 text-3xl leading-9 font-semibold tracking-tight text-balance @3xl:text-4xl @3xl:leading-10">{title}</h2>
            {description ? <p className="m-0 text-lg leading-7 text-muted-foreground @3xl:text-xl">{description}</p> : null}
            {features.length ? (
              <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @xl:gap-x-8">
                {[features.slice(0, half), features.slice(half)].map((col, i) => (
                  <ul key={i} className="m-0 flex min-w-0 flex-col gap-3 p-0">
                    {col.map(f => <PlanFeature key={f} stateText={included}>{f}</PlanFeature>)}
                  </ul>
                ))}
              </div>
            ) : null}
          </div>
          <div data-slot="pricing-single-card" className="flex w-full min-w-0 flex-col gap-6 rounded-xl border border-border bg-card p-8 text-card-foreground @5xl:w-100 @5xl:shrink-0">
            <Price size="lg" amount={amount} period={period} />
            {billingNote ? <p className="m-0 text-sm leading-5 text-muted-foreground">{billingNote}</p> : null}
            <Button asChild className="w-full"><a href="#signup">{primaryAction}</a></Button>
            {secondaryAction ? <Button asChild variant="outline" className="w-full"><a href="#contact-sales">{secondaryAction}</a></Button> : null}
            {note ? <p className={caption}>{note}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Pricing Calculator */

export interface SeatTier {
  /** First seat count of the tier. */
  from: number;
  /** Price per seat per month, billed yearly. */
  price: number;
}

export interface PricingCalculatorProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: PricingHeader;
  tiers?: SeatTier[];
  defaultSeats?: number;
  /** Seats past this need a quote. */
  maxSeats?: number;
}

const seatTiers: SeatTier[] = [
  { from: 1, price: 29 },
  { from: 50, price: 25 },
  { from: 250, price: 21 },
];

function PricingCalculator({
  header = { overline: 'Pricing', title: 'Pay for the seats you use', description: 'Volume discounts apply automatically from 50 seats.' },
  tiers = seatTiers,
  defaultSeats = 120,
  maxSeats = 500,
  className,
  ...props
}: PricingCalculatorProps) {
  const titleId = React.useId();
  const labelId = React.useId();
  const [seats, setSeats] = React.useState(defaultSeats);
  const tier = [...tiers].reverse().find(t => seats >= t.from) ?? tiers[0]!;
  const base = tiers[0]!.price;
  const monthly = seats * tier.price;
  const saving = seats * (base - tier.price) * 12;
  const tierLabel = (t: SeatTier, i: number) => {
    const next = tiers[i + 1];
    return next ? `${t.from}–${next.from - 1} seats` : `${t.from}+ seats`;
  };
  return (
    <section data-slot="pricing-calculator" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <Header header={header} titleId={titleId} />
        <div data-slot="pricing-calculator-row" className="flex w-full max-w-[960px] min-w-0 flex-col gap-8 @5xl:flex-row @5xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground @3xl:p-8">
            <div className="flex items-start justify-between gap-4">
              <p id={labelId} className="m-0 text-sm leading-5 font-medium">Number of seats</p>
              <p className="m-0 text-2xl leading-8 font-semibold tracking-tight tabular-nums" aria-hidden="true">{seats >= maxSeats ? `${maxSeats}+` : seats}</p>
            </div>
            <Slider
              aria-labelledby={labelId}
              thumbLabels={['Number of seats']}
              formatValue={v => `${v >= maxSeats ? `${maxSeats}+` : v} seats`}
              min={1}
              max={maxSeats}
              value={[seats]}
              onValueChange={v => setSeats(v[0] ?? seats)}
              marks={['1', String(Math.round(maxSeats / 2)), `${maxSeats}+`]}
            />
            <SummaryList className="gap-2">
              {tiers.map((t, i) => <SummaryRow key={t.from} label={tierLabel(t, i)} value={`€${t.price} / seat`} />)}
            </SummaryList>
          </div>
          <div data-slot="pricing-calculator-summary" className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-border bg-[var(--section-muted-background)] p-6 @3xl:p-8 @5xl:w-90 @5xl:shrink-0">
            <p className="m-0 text-xs leading-4 font-semibold tracking-widest text-muted-foreground uppercase">Your price</p>
            {seats >= maxSeats ? (
              <p className="m-0 text-3xl leading-9 font-semibold tracking-[-0.4px]" aria-live="polite">Custom quote</p>
            ) : (
              <>
                <div aria-live="polite"><Price amount={eur(monthly)} period="/ month" /></div>
                <p className="m-0 text-sm leading-5 text-muted-foreground">
                  {seats} seats × €{tier.price}, billed yearly ({eur(monthly * 12)}).{saving > 0 ? ` You save ${eur(saving)} a year.` : ''}
                </p>
              </>
            )}
            <Separator />
            <Button asChild className="w-full"><a href="#signup">Start 30-day trial</a></Button>
            <Button asChild variant="link" size="sm" className="self-start">
              <a href="#contact-sales">Get a quote for {maxSeats}+ seats<ArrowRight aria-hidden="true" /></a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Pricing with Comparison */

export interface PricingWithComparisonProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: PricingHeader;
  /** 4 plans; the comparison columns follow the same order. */
  plans?: PricingPlan[];
  groups?: ComparisonGroup[];
  defaultPeriod?: BillingPeriod;
  /** The full comparison starts open. */
  defaultOpen?: boolean;
  note?: React.ReactNode;
}

const fourPlans: PricingPlan[] = [
  { id: 'free', name: 'Free', description: 'For freelancers sending their first invoices.', monthly: 0, period: '/ month', action: 'Start for free', features: ['1 user', '20 invoices a month', 'Client portal, view only', 'Email support'] },
  { id: 'team', name: 'Team', badge: 'Most popular', featured: true, description: 'For finance teams up to 25 people.', monthly: 29, period: '/ seat / month', features: ['Unlimited invoices', 'Approvals and reminders', 'Bank sync, 2 accounts', 'Client portal', 'Priority support'] },
  { id: 'business', name: 'Business', description: 'For companies with several entities.', monthly: 59, period: '/ seat / month', features: ['Everything in Team', 'Multi-entity books', 'SSO (SAML) and audit log', 'Bank sync, unlimited', '99.5% uptime SLA'] },
  { id: 'enterprise', name: 'Enterprise', description: 'For groups with custom security needs.', features: ['Everything in Business', 'Dedicated success manager', 'Custom contract and DPA', '99.9% uptime SLA', 'Onboarding in 30 days'] },
];

const fourGroups: ComparisonGroup[] = [
  { label: 'Core', rows: [{ feature: 'Projects', values: ['3', 'Unlimited', 'Unlimited', 'Unlimited'] }, { feature: 'Storage', values: ['5 GB', '100 GB', '1 TB', 'Custom'] }, { feature: 'Client portal', values: [false, true, true, true] }] },
  { label: 'Collaboration', rows: [{ feature: 'Guests', values: [false, '10', 'Unlimited', 'Unlimited'] }, { feature: 'Approvals', values: [false, true, true, true] }] },
  { label: 'Security', rows: [{ feature: 'SSO (SAML)', values: [false, false, true, true] }, { feature: 'Audit log', values: [false, false, true, true] }, { feature: 'Uptime SLA', values: [false, false, '99.5%', '99.9%'] }] },
];

function PricingWithComparison({
  header = { overline: 'Pricing', title: 'Plans that grow with your invoice volume', description: 'Every plan includes unlimited clients, EU data residency and email support. Prices in EUR, excluding VAT.' },
  plans = fourPlans,
  groups = fourGroups,
  defaultPeriod = 'monthly',
  defaultOpen = true,
  note = 'Prices in EUR per month, excluding VAT. Yearly billing saves 20%. Seats count only people who send or approve invoices.',
  className,
  ...props
}: PricingWithComparisonProps) {
  const titleId = React.useId();
  const panelId = React.useId();
  const [period, setPeriod] = React.useState<BillingPeriod>(defaultPeriod);
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section data-slot="pricing-with-comparison" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <Header header={header} titleId={titleId} />
        <BillingSwitch period={period} onPeriodChange={setPeriod} />
        <div className="flex w-full min-w-0 flex-col items-center gap-12">
          <PlanGrid plans={plans} period={period} />
          <Button
            variant="outline"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(o => !o)}
            trailingIcon={<ChevronDown aria-hidden="true" className={cn('transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', open && 'rotate-180')} />}
          >
            {open ? 'Hide full comparison' : 'Show full comparison'}
          </Button>
          <div id={panelId} hidden={!open} className="w-full min-w-0">
            <ResponsiveComparison
              compact
              caption="Compare all plans"
              plans={plans.map(p => ({ id: p.id, name: p.name, badge: p.badge ? 'Popular' : undefined, featured: p.featured }))}
              groups={groups}
            />
          </div>
          {note ? <p className={cn(caption, 'text-center')}>{note}</p> : null}
        </div>
      </div>
    </section>
  );
}

/* Pricing Usage-based */

export interface UsageTier {
  /** Last unit of the tier; leave out for the open-ended top tier. */
  upTo?: number;
  /** Price per unit in EUR; 0 is free; leave out for "Volume pricing". */
  price?: number;
}

export interface PricingUsageBasedProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: PricingHeader;
  tiers?: UsageTier[];
  /** What every plan includes, under the tiers. */
  includes?: string[];
  defaultVolume?: number;
  /** Highest value of the estimate slider. */
  maxVolume?: number;
}

const usageTiers: UsageTier[] = [{ upTo: 100, price: 0 }, { upTo: 1000, price: 0.4 }, { upTo: 5000, price: 0.25 }, { upTo: 20000, price: 0.15 }, {}];

function PricingUsageBased({
  header = { overline: 'Pricing', title: 'Pay only for the invoices you send', description: 'Unlimited seats on every plan. The first 100 invoices each month are free, and the rate drops as you grow.' },
  tiers = usageTiers,
  includes = ['Unlimited seats and approvers', 'Bank sync and matching', 'EU data residency', 'Email and chat support'],
  defaultVolume = 2500,
  maxVolume = 5000,
  className,
  ...props
}: PricingUsageBasedProps) {
  const titleId = React.useId();
  const labelId = React.useId();
  const [volume, setVolume] = React.useState(defaultVolume);
  const n = (v: number) => v.toLocaleString('en-IE');
  const rangeLabel = (t: UsageTier, i: number) => {
    const from = i === 0 ? 1 : (tiers[i - 1]!.upTo ?? 0) + 1;
    if (t.upTo === undefined) return `Over ${n(from - 1)}`;
    return i === 0 ? `First ${n(t.upTo)}` : `${n(from)} to ${n(t.upTo)}`;
  };
  // Graduated: each tier bills only the invoices that fall inside it.
  const lines: { label: string; value: number }[] = [];
  let left = volume;
  let prev = 0;
  let current = 0;
  tiers.forEach((t, i) => {
    if (left <= 0 || t.price === undefined) return;
    const size = t.upTo === undefined ? left : Math.min(left, t.upTo - prev);
    lines.push({ label: t.price === 0 ? `First ${n(size)} invoices` : `${n(size)} × ${eur(t.price, 2)}`, value: size * t.price });
    current = i;
    left -= size;
    prev = t.upTo ?? prev;
  });
  const total = lines.reduce((s, l) => s + l.value, 0);
  return (
    <section data-slot="pricing-usage-based" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <Header header={header} titleId={titleId} />
        <div data-slot="pricing-usage-row" className="flex w-full min-w-0 flex-col gap-8 @5xl:flex-row @5xl:items-start">
          <div data-slot="pricing-usage-tiers" className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
            <table className="w-full table-fixed border-collapse">
              <caption className="sr-only">Price per invoice by monthly volume</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="px-6 py-4 text-left text-sm leading-5 font-medium text-muted-foreground">Invoices per month</th>
                  <th scope="col" className="w-40 px-6 py-4 text-right text-sm leading-5 font-medium text-muted-foreground">Price per invoice</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((t, i) => {
                  const mine = i === current;
                  return (
                    <tr key={i} data-slot="usage-tier" data-current={mine || undefined} className={cn('border-b border-border', mine && 'bg-[var(--card-muted)]')}>
                      <th scope="row" className="px-6 py-4 text-left font-normal">
                        <span className="flex min-w-0 items-center justify-between gap-4">
                          <TableCellText textStyle="strong">{rangeLabel(t, i)}</TableCellText>
                          {mine ? <Badge variant="soft-info" shape="pill">Your estimate</Badge> : null}
                        </span>
                      </th>
                      <td className="px-6 py-4">
                        <TableCellText align="right" textStyle={t.price === undefined ? 'muted' : 'default'}>
                          {t.price === undefined ? 'Volume pricing' : t.price === 0 ? 'Free' : eur(t.price, 2)}
                        </TableCellText>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {includes.length ? (
              <div className="flex flex-col gap-4 p-6">
                <p className="m-0 text-sm leading-5 font-medium">Every plan includes</p>
                <ul className="m-0 grid grid-cols-1 gap-x-6 gap-y-3 p-0 @xl:grid-cols-2">
                  {includes.map(f => <PlanFeature key={f} stateText={included}>{f}</PlanFeature>)}
                </ul>
              </div>
            ) : null}
          </div>
          <div data-slot="pricing-usage-estimate" className="flex w-full min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-6 text-card-foreground @3xl:p-8 @5xl:w-100 @5xl:shrink-0">
            <p className="m-0 text-xs leading-4 font-semibold tracking-widest text-muted-foreground uppercase">Estimate your bill</p>
            <div className="flex items-center justify-between gap-4">
              <p id={labelId} className="m-0 text-sm leading-5 font-medium">Invoices per month</p>
              <p className="m-0 text-2xl leading-8 font-semibold tracking-tight tabular-nums" aria-hidden="true">{n(volume)}</p>
            </div>
            <Slider
              aria-labelledby={labelId}
              thumbLabels={['Invoices per month']}
              formatValue={v => `${n(v)} invoices`}
              min={0}
              max={maxVolume}
              step={100}
              value={[volume]}
              onValueChange={v => setVolume(v[0] ?? volume)}
              marks={['0', n(maxVolume / 2), `${n(maxVolume)}+`]}
            />
            <SummaryList className="gap-2 pt-4">
              {lines.map(l => <SummaryRow key={l.label} label={l.label} value={eur(l.value, 2)} />)}
            </SummaryList>
            <Separator />
            <div aria-live="polite"><Price size="lg" amount={eur(Math.round(total))} period="/ month" /></div>
            <p className={caption}>Billed monthly in EUR, VAT excluded. Change or cancel anytime.</p>
            <Button asChild className="w-full"><a href="#signup">Start free</a></Button>
            <Button asChild variant="link" className="w-full"><a href="#contact-sales">Talk to sales about volume pricing</a></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Pricing Enterprise Banner */

export interface EnterpriseCertification {
  name: string;
  description: string;
  icon?: React.ReactNode;
}

export interface PricingEnterpriseBannerProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  badge?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  features?: string[];
  priceTitle?: string;
  priceNote?: string;
  primaryAction?: string;
  secondaryAction?: string;
  /** Figma Show trust: certifications you hold, with what backs them. */
  certifications?: EnterpriseCertification[];
}

const certifications: EnterpriseCertification[] = [
  { name: 'SOC 2 Type II', description: 'Audited September 2026', icon: <ShieldCheck /> },
  { name: 'ISO 27001', description: 'Certified since 2024', icon: <Lock /> },
  { name: 'GDPR', description: 'EU data processing agreement', icon: <Globe /> },
  { name: 'SAML SSO and SCIM', description: 'Okta, Entra ID, Google', icon: <KeyRound /> },
];

function PricingEnterpriseBanner({
  badge = 'Enterprise',
  title = 'Acme Enterprise for finance teams of 200 and more',
  description = 'One contract for every entity, your own approval policies and a team that knows your setup. Rolled out with you in 30 days.',
  features = ['SAML SSO and SCIM provisioning', 'Custom approval policies', 'Multi-entity consolidation', '99.95% uptime SLA', 'EU or US data residency', 'Dedicated success manager'],
  priceTitle = 'Custom pricing',
  priceNote = 'Annual contract, volume pricing from 200 seats, invoiced in EUR.',
  primaryAction = 'Contact sales',
  secondaryAction = 'Book a demo',
  certifications: certs = certifications,
  className,
  ...props
}: PricingEnterpriseBannerProps) {
  const titleId = React.useId();
  return (
    <section data-slot="pricing-enterprise-banner" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <div data-slot="pricing-enterprise-card" className="flex w-full min-w-0 flex-col gap-10 rounded-xl bg-foreground p-6 text-background @3xl:p-12">
          <div data-slot="pricing-enterprise-top" className="flex min-w-0 flex-col gap-10 @5xl:flex-row @5xl:gap-16">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
              {badge ? <Badge variant="secondary" shape="pill">{badge}</Badge> : null}
              <h2 id={titleId} className="m-0 text-3xl leading-9 font-semibold tracking-tight text-balance">{title}</h2>
              {description ? <p className="m-0 text-lg leading-7 text-muted @3xl:text-xl">{description}</p> : null}
              {features.length ? (
                <ul className="m-0 flex flex-wrap gap-x-6 gap-y-3 p-0 pt-2">
                  {features.map(f => <PlanFeature key={f} tone="inverted" stateText={included}>{f}</PlanFeature>)}
                </ul>
              ) : null}
            </div>
            <div className="flex min-w-0 flex-col gap-4 @5xl:w-80 @5xl:shrink-0">
              <p className="m-0 text-2xl leading-8 font-semibold tracking-tight">{priceTitle}</p>
              {priceNote ? <p className="m-0 text-sm leading-5 text-muted">{priceNote}</p> : null}
              <Button asChild className="w-full"><a href="#contact-sales">{primaryAction}</a></Button>
              {secondaryAction ? <Button asChild variant="secondary" className="w-full"><a href="#book-demo">{secondaryAction}</a></Button> : null}
            </div>
          </div>
          {certs.length ? (
            <div data-slot="pricing-enterprise-trust" className="flex flex-col gap-4 border-t border-background/30 pt-8">
              <h3 className="m-0 text-sm leading-5 font-medium">Security and compliance</h3>
              <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 @xl:grid-cols-2 @5xl:grid-cols-4">
                {certs.map(c => (
                  <li key={c.name} className="flex min-w-0">
                    <TrustBadge className="flex-1" tone="inverted" name={c.name} description={c.description} icon={c.icon} />
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

export { ComparisonTableSection, Pricing, PricingCalculator, PricingEnterpriseBanner, PricingSingle, PricingUsageBased, PricingWithComparison };
