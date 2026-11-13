// EGG UI blocks, BLOCKS / Sections page (73:2), Case studies family: Block / Case Study Grid
// (831:7155) and Block / Case Study Header (832:7194). Guide: build-ui/patterns/marketing-pages.md
// (Grid as the customers index or as "More stories" under a story, 3 items; Header as the top of a
// story page: logo, result as the title, 3 figures, company facts. A case study states the result
// in the title and repeats it as numbers; the same numbers appear in the header and the grid card).
// Both sit on background/default, 96 px vertical padding (64 below 768), content in a 1152 container
// (layout/container/6xl) with 24 / 32 px gutters below 1152; layout follows the block's own width.
// Case Study Grid: centered Section Header, 48 above a centered Chip Group of industries (single
// select, filters the grid), 32 above the stories: three columns of 368, 24 apart (two from 576, one
// below). A story is a Post Card (16:9 image, industry Badge and reading time, h3 title, excerpt)
// and, 20 under it, the result row: top border, 16 padding, a Figure (the number) next to the
// customer's Logo Tile (plain). An outline "Show more stories" link closes the grid.
// Case Study Header: the page's h1. Back Link, 48 above the main row: intro (736: Logo Tile, h1 in
// heading/h1, lead, primary + outline Download PDF, 24 apart) 64 left of the facts card (352,
// card-muted, radius xl, 24 padding; label in ui/caption over a Meta Item, 20 apart); then the
// results (top border, 32 padding, three Figures lg, 24 apart) and a 21:9 photo, 48 apart. Stacked
// below 1024; results one per row below 576.
import * as React from 'react';
import { Building, Calendar, Download, MapPin, Package, Users } from '@/components/icons';
import { cn } from '@/lib/utils';
import { BackLink } from './back-link';
import type { BrandLogoName } from './brand-logos';
import { Button } from './button';
import { Chip } from './chip';
import { ChipGroup } from './chip-group';
import { Figure } from './figure';
import { ImagePlaceholder } from './image-placeholder';
import { LogoTile } from './logo-tile';
import { MetaItem } from './meta-item';
import { PostCard } from './post-card';
import { SectionHeader } from './section-header-block';

const shell = '@container w-full bg-background text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col px-6 py-16 @3xl:px-8 @3xl:py-24 @6xl:px-0';

export interface CaseStudyLink { label: string; href: string }
export interface CaseStudyResult { value: string; label: string }

/* Case Study Grid */

export interface CaseStudy {
  /** Customer name; also the logo's accessible name. */
  company: string;
  /** A sample `Logo / *` mark; pass `logoNode` for the client's own logo. */
  logo?: BrandLogoName;
  logoNode?: React.ReactNode;
  /** The result as the title. */
  title: string;
  href: string;
  industry: string;
  readingTime?: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  /** The same number as in the story's header. */
  result: CaseStudyResult;
}

export interface CaseStudyGridProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  description?: string;
  stories?: CaseStudy[];
  /** Figma filters: a single-select Chip Group of industries that filters the grid. */
  showFilters?: boolean;
  /** Label of the "all" chip. */
  allLabel?: string;
  /** Figma Button "Show 12 more stories": a link to the next page; null hides it. */
  moreAction?: CaseStudyLink | null;
}

const caseStudies: CaseStudy[] = [
  { company: 'Kestrel', logo: 'Kestrel', industry: 'Logistics', readingTime: '8 min read', href: '#kestrel', title: 'How Kestrel closes the books in 3 days instead of 7', excerpt: 'Driver invoices used to wait two weeks for a signature. Now approvals happen the same day.', result: { value: '3 days', label: 'month-end close, down from 7' } },
  { company: 'Northwind', logo: 'Northwind', industry: 'Retail', readingTime: '6 min read', href: '#northwind', title: 'Northwind cut overdue invoices by 42% in one quarter', excerpt: "Automatic reminders in the customer's language replaced a weekly round of phone calls.", result: { value: '42%', label: 'fewer overdue invoices' } },
  { company: 'Lumora', logo: 'Lumora', industry: 'Software', readingTime: '7 min read', href: '#lumora', title: 'Lumora matches 9,000 payments a month without a spreadsheet', excerpt: 'Bank feeds and AI matching took reconciliation from three days to one morning.', result: { value: '9,000', label: 'payments matched each month' } },
  { company: 'Halcyon', logo: 'Halcyon', industry: 'Professional services', readingTime: '5 min read', href: '#halcyon', title: 'Halcyon passed its annual audit a week early', excerpt: 'Every approval, edit and export has an audit trail the auditors could read on their own.', result: { value: '1 week', label: 'saved on the annual audit' } },
  { company: 'Tidewater', logo: 'Tidewater', industry: 'Retail', readingTime: '6 min read', href: '#tidewater', title: 'Tidewater collects EUR 1.1M sooner every year', excerpt: 'Card and SEPA payment links on every invoice shortened payment terms by 9 days.', result: { value: 'EUR 1.1M', label: 'cash collected sooner per year' } },
  { company: 'Fieldstone', logo: 'Fieldstone', industry: 'Manufacturing', readingTime: '5 min read', href: '#fieldstone', title: 'Fieldstone approves supplier invoices from the factory floor', excerpt: 'Plant managers approve on their phones, so suppliers are paid on time and keep their discounts.', result: { value: '4 hours', label: 'average approval, down from 3 days' } },
];

function CaseStudyCard({ story }: { story: CaseStudy }) {
  return (
    <li data-slot="case-study" className="flex min-w-0 flex-col gap-5">
      <PostCard
        title={story.title}
        href={story.href}
        category={story.industry}
        meta={story.readingTime}
        excerpt={story.excerpt}
        image={story.image}
        imageAlt={story.imageAlt}
      />
      <div data-slot="case-study-result" className="mt-auto flex min-w-0 items-center gap-4 border-t border-border pt-4">
        <Figure value={story.result.value} label={story.result.label} className="flex-1 [&>span:nth-child(2)]:whitespace-normal" />
        <LogoTile tileStyle="plain" logo={story.logo} title={story.company}>{story.logoNode}</LogoTile>
      </div>
    </li>
  );
}

function CaseStudyGrid({
  overline = 'Customer stories',
  title = 'How finance teams run on Acme',
  description = 'Six companies, six different problems, and the one number that changed for each.',
  stories = caseStudies,
  showFilters = true,
  allLabel = 'All industries',
  moreAction = { label: 'Show 12 more stories', href: '#more-stories' },
  className,
  ...props
}: CaseStudyGridProps) {
  const titleId = React.useId();
  const industries = React.useMemo(() => [...new Set(stories.map(s => s.industry))], [stories]);
  const [industry, setIndustry] = React.useState('all');
  const shown = industry === 'all' ? stories : stories.filter(s => s.industry === industry);
  return (
    <section data-slot="case-study-grid" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'items-center gap-10 @3xl:gap-12')}>
        <SectionHeader titleId={titleId} overline={overline} title={title} description={description} />
        <div data-slot="case-study-grid-body" className="flex w-full flex-col items-center gap-8">
          {showFilters ? (
            <ChipGroup
              type="single"
              aria-label="Filter by industry"
              value={industry}
              onValueChange={v => setIndustry(v[0] ?? 'all')}
              className="w-auto max-w-full justify-center [&>*]:justify-center"
            >
              <Chip value="all" label={allLabel} />
              {industries.map(i => <Chip key={i} value={i} label={i} />)}
            </ChipGroup>
          ) : null}
          <ul data-slot="case-study-list" aria-labelledby={titleId} aria-live="polite" className="m-0 grid w-full list-none grid-cols-1 gap-x-6 gap-y-10 p-0 @xl:grid-cols-2 @4xl:grid-cols-3 @4xl:gap-y-6">
            {shown.map(s => <CaseStudyCard key={s.href} story={s} />)}
          </ul>
          {moreAction ? <Button asChild variant="outline"><a href={moreAction.href}>{moreAction.label}</a></Button> : null}
        </div>
      </div>
    </section>
  );
}

/* Case Study Header */

export interface CaseStudyFact { label: string; value: string; icon: React.ReactNode }

export interface CaseStudyHeaderProps extends Omit<React.ComponentProps<'section'>, 'title' | 'results'> {
  /** Figma Back Link: the customers index. null hides it. */
  back?: CaseStudyLink | null;
  company?: string;
  logo?: BrandLogoName;
  logoNode?: React.ReactNode;
  /** The page's h1: the result. */
  title?: string;
  description?: string;
  primaryAction?: CaseStudyLink | null;
  /** Figma outline Button with the download icon. */
  downloadAction?: CaseStudyLink | null;
  /** Company facts: industry, size, headquarters, products, customer since. */
  facts?: CaseStudyFact[];
  /** Three numbers, the same as on the grid card and any video testimonial. */
  results?: CaseStudyResult[];
  image?: { src?: string; alt?: string } | null;
}

const kestrelFacts: CaseStudyFact[] = [
  { label: 'Industry', value: 'Logistics and freight', icon: <Building /> },
  { label: 'Company size', value: '450 people in 3 countries', icon: <Users /> },
  { label: 'Headquarters', value: 'Rotterdam, Netherlands', icon: <MapPin /> },
  { label: 'Products used', value: 'Invoices, Approvals, Reports', icon: <Package /> },
  { label: 'Customer since', value: 'March 2025', icon: <Calendar /> },
];

const kestrelResults: CaseStudyResult[] = [
  { value: '3 days', label: 'month-end close, down from 7 days' },
  { value: '42%', label: 'fewer overdue invoices in the first quarter' },
  { value: 'EUR 1.8M', label: 'cash collected sooner in 2026' },
];

function CaseStudyHeader({
  back = { label: 'All customer stories', href: '#customers' },
  company = 'Kestrel',
  logo = 'Kestrel',
  logoNode,
  title = 'How Kestrel closes the books in 3 days instead of 7',
  description = 'Kestrel Logistics moves freight for 2,300 shippers across the Benelux. Its finance team of six replaced email approvals and a shared spreadsheet with Acme in five weeks.',
  primaryAction = { label: 'Book a demo', href: '#demo' },
  downloadAction = { label: 'Download PDF', href: '#kestrel.pdf' },
  facts = kestrelFacts,
  results = kestrelResults,
  image = { alt: 'The Kestrel finance team at an all-hands meeting in their Rotterdam office' },
  className,
  ...props
}: CaseStudyHeaderProps) {
  const titleId = React.useId();
  return (
    <section data-slot="case-study-header" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'gap-10 @3xl:gap-12')}>
        {back ? <div className="flex"><BackLink href={back.href}>{back.label}</BackLink></div> : null}
        <div data-slot="case-study-header-main" className="grid w-full grid-cols-1 items-start gap-10 @5xl:grid-cols-[736fr_352fr] @5xl:gap-16">
          <div data-slot="case-study-header-intro" className="flex min-w-0 flex-col items-start gap-6">
            <LogoTile tileStyle="plain" logo={logo} title={company}>{logoNode}</LogoTile>
            <h1 id={titleId} className="m-0 text-3xl leading-9 font-extrabold tracking-tight text-balance [overflow-wrap:anywhere] @3xl:text-4xl @3xl:leading-10">{title}</h1>
            {description ? <p className="m-0 text-lg leading-7 text-muted-foreground @3xl:text-xl">{description}</p> : null}
            {primaryAction || downloadAction ? (
              <div className="flex flex-wrap items-center gap-3">
                {primaryAction ? <Button asChild><a href={primaryAction.href}>{primaryAction.label}</a></Button> : null}
                {downloadAction ? (
                  <Button asChild variant="outline"><a href={downloadAction.href} download><Download aria-hidden="true" />{downloadAction.label}</a></Button>
                ) : null}
              </div>
            ) : null}
          </div>
          {facts.length ? (
            <dl data-slot="case-study-facts" aria-label={`About ${company}`} className="m-0 flex min-w-0 flex-col gap-5 rounded-xl bg-[var(--card-muted)] p-6">
              {facts.map(f => (
                <div key={f.label} className="flex min-w-0 flex-col gap-1">
                  <dt className="text-xs leading-4 text-muted-foreground">{f.label}</dt>
                  <dd className="m-0 min-w-0"><MetaItem icon={f.icon}>{f.value}</MetaItem></dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {results.length ? (
          <ul data-slot="case-study-results" aria-label="Results" className="m-0 grid w-full list-none grid-cols-1 gap-6 border-t border-border p-0 pt-8 @xl:grid-cols-3">
            {results.map(r => <li key={r.label} className="min-w-0"><Figure size="lg" value={r.value} label={r.label} /></li>)}
          </ul>
        ) : null}
        {image ? <ImagePlaceholder ratio="21:9" src={image.src} alt={image.alt ?? ''} showCaption={false} className="rounded-xl" /> : null}
      </div>
    </section>
  );
}

export { CaseStudyGrid, CaseStudyHeader };
