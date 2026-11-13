// EGG UI blocks, BLOCKS / Sections page (73:2), Stats family: Block / Stats (73:54), Stats Cards
// (205:1810), Stats Split (205:1836), Stats Brand Band (693:109208), Stats with Image (812:13162).
// Real numbers with their period and source (guide: build-ui/patterns/marketing-pages.md).
// Every block is a <section> named by its title (h2; Stats without header is named by `label`),
// inside a 1152 container (layout/container/6xl) with 24 / 32 px gutters below 1152. Layout follows
// the block's own width (container queries), so it works in any column.
// Stats: section-muted band, 64 padding, optional centered Section Header 64 above a Metric Strip
// (values in heading/h1, label, Trend Indicator) and the source caption 16 under it. 4 in a row
// from 768, 2 per row below.
// Stats Cards: Section Header 48 above four Stat Cards (vertical, no change badge), 24 apart:
// 4 per row from 1024, 2 from 576, 1 below.
// Stats Split: text (overline, h2 in heading/h1, lead, a link Button) next to four Metric Strip
// Items in two columns, each with its divider, 64 apart from 1024; stacked below.
// Stats Brand Band: primary band, 80 padding, centered title and lead, four Figure Size=lg
// Tone=on-primary (values in display) and the source; 4 per row from 1024, 2 from 576.
// Stats with Image: a 3:4 Image Placeholder (480) next to overline, h2, lead, four Figures lg with
// source and divider (2 per row) and a note; 64 apart from 1024; image on top below.
import * as React from 'react';
import { ArrowRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Figure } from './figure';
import { ImagePlaceholder } from './image-placeholder';
import { MetricStrip, MetricStripItem, TrendIndicator, type TrendDirection, type TrendTone } from './metrics';
import { SectionHeader } from './section-header-block';
import { StatCard, type StatTrend } from './stat-card';

/* Shared parts */

const shell = '@container w-full';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col px-6 @3xl:px-8 @6xl:px-0';
const titleH1 = 'm-0 text-3xl leading-9 font-extrabold tracking-tight @3xl:text-4xl @3xl:leading-10';
const lead = 'm-0 text-lg leading-7 @3xl:text-xl';
const overlineCls = 'm-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase';
const caption = 'm-0 text-xs leading-4 text-muted-foreground';

export interface StatsHeader {
  overline?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface StatsTrend {
  direction: TrendDirection;
  /** Good, bad or neither; defaults follow the direction. "Less admin time" is down and positive. */
  tone?: TrendTone;
  value: string;
  comparison?: string;
}

export interface StatsMetric {
  label: string;
  value: string;
  trend?: StatsTrend;
}

const trendEl = (t?: StatsTrend) =>
  t ? <TrendIndicator trend={t.direction} tone={t.tone} value={t.value} comparison={t.comparison ?? ''} /> : undefined;

/* Stats */

export interface StatsProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Figma Show header: a centered Section Header above the numbers. */
  header?: StatsHeader;
  /** Name of the section when there is no header. */
  label?: string;
  /** 3 to 5 numbers in the Metric Strip. */
  metrics?: StatsMetric[];
  /** Where the numbers come from, with the period. Keep it. */
  source?: React.ReactNode;
}

const statsMetrics: StatsMetric[] = [
  { label: 'active teams on Acme', value: '12,400', trend: { direction: 'up', value: '18%', comparison: 'vs 2025' } },
  { label: 'less admin time after 3 months', value: '38%', trend: { direction: 'down', tone: 'positive', value: '6 pts', comparison: 'vs 2025' } },
  { label: 'average rating from finance staff', value: '4.8 / 5', trend: { direction: 'up', value: '0.2', comparison: 'since January' } },
  { label: 'saved on every invoice', value: '12 min', trend: { direction: 'up', value: '4 min', comparison: 'vs 2025' } },
];

function Stats({
  header,
  label = 'Acme in numbers',
  metrics = statsMetrics,
  source = 'Source: Acme customer survey, 1,240 finance teams, March 2026. Figures are medians.',
  className,
  ...props
}: StatsProps) {
  const titleId = React.useId();
  return (
    <section
      data-slot="stats"
      aria-labelledby={header ? titleId : undefined}
      aria-label={header ? undefined : label}
      className={cn(shell, 'bg-[var(--section-muted-background)] text-foreground', className)}
      {...props}
    >
      <div className={cn(inner, 'items-center gap-16 py-16')}>
        {header ? <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} /> : null}
        <div className="flex w-full min-w-0 flex-col gap-4">
          <MetricStrip className="gap-y-6">
            {metrics.map(m => (
              <MetricStripItem
                key={m.label}
                className="basis-1/2 nth-3:before:hidden @3xl:basis-0 @3xl:nth-3:before:block"
                label={m.label}
                value={<span className="block text-3xl leading-9 font-extrabold tracking-tight @3xl:text-4xl @3xl:leading-10">{m.value}</span>}
                trend={trendEl(m.trend)}
              />
            ))}
          </MetricStrip>
          {source ? <p className={caption}>{source}</p> : null}
        </div>
      </div>
    </section>
  );
}

/* Stats Cards */

export interface StatsCardItem {
  label: string;
  value: string;
  trend?: StatTrend;
  /** What changed, with the icon of the trend ("+640 since January"). */
  trendText?: string;
  /** Over which period. */
  footnote?: string;
}

export interface StatsCardsProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: StatsHeader;
  cards?: StatsCardItem[];
}

const statsCards: StatsCardItem[] = [
  { label: 'companies', value: '4,200+', trend: 'up', trendText: '+640 since January', footnote: 'from 10 to 40,000 employees' },
  { label: 'invoices processed', value: '€18B', trend: 'up', trendText: '+€3.1B vs 2025', footnote: 'in the last 12 months' },
  { label: 'time to close', value: '−44%', trend: 'up', trendText: '2 days faster', footnote: 'median after six months' },
  { label: 'uptime', value: '99.98%', trend: 'neutral', trendText: '12 months in a row', footnote: 'over the last 12 months' },
];

function StatsCards({
  header = { overline: 'In numbers', title: 'Trusted by finance teams in 40 countries', description: 'Updated every quarter from customer data.' },
  cards = statsCards,
  className,
  ...props
}: StatsCardsProps) {
  const titleId = React.useId();
  return (
    <section data-slot="stats-cards" aria-labelledby={titleId} className={cn(shell, 'bg-background text-foreground', className)} {...props}>
      <div className={cn(inner, 'items-center gap-12 py-24')}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <ul data-slot="stats-cards-grid" className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @xl:grid-cols-2 @5xl:grid-cols-4">
          {cards.map(c => (
            <li key={c.label} className="flex min-w-0">
              <StatCard className="w-auto flex-1" showChange={false} trend={c.trend ?? 'up'} label={c.label} value={c.value} trendText={c.trendText} showTrend={!!c.trendText} footnote={c.footnote ?? ''} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Stats Split */

export interface StatsSplitProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** A link to the method or the source; empty hides it. */
  link?: { label: string; href: string };
  /** Four numbers in two columns. */
  metrics?: StatsMetric[];
}

const splitMetrics: StatsMetric[] = [
  { label: 'time to close the books', value: '−44%', trend: { direction: 'down', tone: 'positive', value: '5 days', comparison: 'from 9 days' } },
  { label: 'faster approvals', value: '3×', trend: { direction: 'down', tone: 'positive', value: '8 h', comparison: 'from 26 h per request' } },
  { label: 'late payments', value: '−62%', trend: { direction: 'down', tone: 'positive', value: '7%', comparison: 'of invoices, from 19%' } },
  { label: 'saved per person each month', value: '11 h', trend: { direction: 'up', value: '2 h', comparison: 'more since month 3' } },
];

function StatsSplit({
  overline = 'Results',
  title = 'What changes in the first six months',
  description = 'Median results across 380 customers who moved approvals and reporting to Acme in 2025.',
  link = { label: 'See the methodology', href: '#methodology' },
  metrics = splitMetrics,
  className,
  ...props
}: StatsSplitProps) {
  const titleId = React.useId();
  return (
    <section data-slot="stats-split" aria-labelledby={titleId} className={cn(shell, 'bg-background text-foreground', className)} {...props}>
      <div className={cn(inner, 'py-24')}>
        <div data-slot="stats-split-row" className="flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:items-center @5xl:gap-16">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            {overline ? <p className={overlineCls}>{overline}</p> : null}
            <h2 id={titleId} className={titleH1}>{title}</h2>
            {description ? <p className={cn(lead, 'text-muted-foreground')}>{description}</p> : null}
            {link?.label ? (
              <Button asChild variant="link">
                <a href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></a>
              </Button>
            ) : null}
          </div>
          <dl data-slot="stats-split-numbers" className="m-0 grid min-w-0 flex-1 grid-cols-1 gap-10 @xl:grid-cols-2">
            {metrics.map(m => (
              <MetricStripItem
                key={m.label}
                className="min-w-0 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border"
                label={m.label}
                value={m.value}
                trend={trendEl(m.trend)}
              />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* Stats Brand Band */

export interface StatsFigure {
  value: string;
  label: string;
  /** Where this one number comes from. */
  source?: string;
}

export interface StatsBrandBandProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Figma Show header: title and description. */
  showHeader?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** 3 or 4 figures with units and period. */
  figures?: StatsFigure[];
  /** Figma Show source. Always keep the source. */
  source?: React.ReactNode;
  /** Name of the section when the header is off. */
  label?: string;
}

const brandFigures: StatsFigure[] = [
  { value: '18 days', label: 'faster payment on average' },
  { value: '€2.4 bn', label: 'invoiced through Acme in 2025' },
  { value: '94%', label: 'of invoices approved within a day' },
  { value: '4.8 / 5', label: 'rating from 1,900 reviews' },
];

function StatsBrandBand({
  showHeader = true,
  title = 'The numbers behind 1,200 finance teams',
  description = 'Measured across all customers on Acme for at least six months.',
  figures = brandFigures,
  source = 'Source: Acme product data, January to September 2026; ratings from G2 and Capterra.',
  label = 'Acme in numbers',
  className,
  ...props
}: StatsBrandBandProps) {
  const titleId = React.useId();
  return (
    <section
      data-slot="stats-brand-band"
      aria-labelledby={showHeader ? titleId : undefined}
      aria-label={showHeader ? undefined : label}
      className={cn(shell, 'bg-primary text-primary-foreground', className)}
      {...props}
    >
      <div className={cn(inner, 'items-center gap-12 py-20 text-center')}>
        {showHeader ? (
          <div className="flex max-w-3xl flex-col items-center gap-3">
            <h2 id={titleId} className={titleH1}>{title}</h2>
            {description ? <p className={lead}>{description}</p> : null}
          </div>
        ) : null}
        <ul data-slot="stats-brand-band-figures" className="m-0 grid w-full list-none grid-cols-1 gap-8 p-0 @xl:grid-cols-2 @5xl:grid-cols-4">
          {figures.map(f => (
            <li key={f.label} className="min-w-0">
              <Figure
                size="lg"
                tone="on-primary"
                className="items-center text-center [&>span:first-child]:overflow-visible"
                value={<span className="block text-4xl leading-10 font-extrabold @3xl:text-5xl @3xl:leading-12">{f.value}</span>}
                label={f.label}
                source={f.source}
              />
            </li>
          ))}
        </ul>
        {source ? <p className="m-0 text-xs leading-4">{source}</p> : null}
      </div>
    </section>
  );
}

/* Stats with Image */

export interface StatsWithImageProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Figma Show image: the photo URL; without it the placeholder shows. */
  showImage?: boolean;
  imageSrc?: string;
  /** Alt text of the photo; "" when decorative. */
  imageAlt?: string;
  /** Figma Show eyebrow + Eyebrow. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** 2 or 4 figures, each with its source. */
  figures?: StatsFigure[];
  /** Figma Show note + Note. */
  note?: React.ReactNode;
}

const imageFigures: StatsFigure[] = [
  { value: '47%', label: 'less time spent chasing payments', source: 'Acme customer survey, n=412, Sep 2026' },
  { value: '11 days', label: 'faster average payment', source: 'Invoice data, 1,200 workspaces, 2026' },
  { value: 'EUR 2.4B', label: 'invoiced through Acme this year', source: 'Platform data, Jan to Sep 2026' },
  { value: '98.7%', label: 'of reminders sent without manual work', source: 'Platform data, Q3 2026' },
];

function StatsWithImage({
  showImage = true,
  imageSrc,
  imageAlt = '',
  eyebrow = 'By the numbers',
  title = 'What changes after one year on Acme',
  description = 'We measured 1,200 workspaces and asked 412 finance leads what moved. These are the medians, with where each number comes from.',
  figures = imageFigures,
  note = 'Medians for customers on the Business plan for at least 12 months. Your results depend on invoice volume and payment terms.',
  className,
  ...props
}: StatsWithImageProps) {
  const titleId = React.useId();
  return (
    <section data-slot="stats-with-image" aria-labelledby={titleId} className={cn(shell, 'bg-background text-foreground', className)} {...props}>
      <div className={cn(inner, 'py-24')}>
        <div data-slot="stats-with-image-row" className="flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:items-center @5xl:gap-16">
          {showImage ? (
            <ImagePlaceholder ratio="3:4" src={imageSrc} alt={imageAlt} className="max-w-[480px] shrink-0 rounded-lg @5xl:w-[480px]" />
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-10">
            <div className="flex flex-col gap-4">
              {eyebrow ? <p className={overlineCls}>{eyebrow}</p> : null}
              <h2 id={titleId} className="m-0 text-3xl leading-9 font-semibold tracking-tight text-balance">{title}</h2>
              {description ? <p className={cn(lead, 'text-muted-foreground')}>{description}</p> : null}
            </div>
            <ul data-slot="stats-with-image-figures" className="m-0 grid list-none grid-cols-1 gap-8 p-0 @xl:grid-cols-2">
              {figures.map(f => (
                <li key={f.label} className="min-w-0">
                  <Figure size="lg" divider value={f.value} label={f.label} source={f.source} />
                </li>
              ))}
            </ul>
            {note ? <p className={caption}>{note}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export { Stats, StatsBrandBand, StatsCards, StatsSplit, StatsWithImage };
