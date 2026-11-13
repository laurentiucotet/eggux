// EGG UI blocks, BLOCKS / Sections page (73:2), Testimonials family: Block / Testimonials (76:301),
// Testimonial Single (198:1291), Testimonial Grid (198:1304), Testimonial Split (198:1448),
// Testimonial Carousel (198:1482), Testimonial Wall (811:41749), Testimonial Video (811:42160).
// Built from Testimonial Card and Quote (Quote page), Carousel, Video Thumbnail / Video Player,
// Byline, Figure, Rating, Image Placeholder, Section Header and the sample brand marks (Logo Tile).
// Guide: build-ui/patterns/marketing-pages.md (Testimonials row and rules: real name, role and
// company; specific results beat praise; one featured card above a grid; carousel only past six).
// Every block is a <section> (named by its h2, or by `label` when it has no title), 96 padding, 48
// between parts, inside a 1152 container with 24 / 32 px gutters below 1152 (container queries).
// Testimonials: Section Header above 3 Testimonial Cards (default, with rating), 24 apart; 3 per row
// from 1024, one per row below. Grid: the same on section/muted-background with 6 cards (2 rows).
// Single: a customer logo 32 above a Quote pull (896 wide), centered.
// Split: a 4:3 image (544) 64 from the story: overline, quote (heading/h3), Byline, 3 Figures, link.
// Carousel: a left Section Header 32 above a Carousel Type=multiple (3 slides of 368 at 1152, 2 from
// 576, 1 below) with outline arrows and dots.
// Wall: muted band; Section Header, the overall Rating, a highlight row (Testimonial Card featured
// next to a minimal one), then a 3-column masonry of default and logo cards and an outline button.
// Video: a 640 Video Thumbnail (opens the Video Player in place) 64 from the story: customer logo,
// Quote default, 3 Figures with dividers (the result numbers) and a link.
import * as React from 'react';
import { ArrowRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Byline } from './byline';
import { Carousel } from './carousel';
import { Figure } from './figure';
import { ImagePlaceholder } from './image-placeholder';
import { VideoPlayer, VideoThumbnail } from './media';
import { Quote, TestimonialCard, type QuotePerson } from './quote';
import { Rating } from './rating';
import { SectionHeader } from './section-header-block';
import { type BrandLogoName } from './brand-logos';
import { LogoTile } from './logo-tile';
import { CustomerLogo } from './section-logos';

/* Shared parts */

const shell = '@container w-full text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center gap-12 px-6 py-24 @3xl:px-8 @6xl:px-0';
const overlineCls = 'm-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase';

export interface TestimonialsHeader {
  overline?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface Testimonial {
  quote: string;
  by: QuotePerson;
  rating?: number;
  /** Customer name: shows its logo (Testimonial Card Variant=logo). */
  company?: BrandLogoName;
}

export interface ResultFigure {
  value: string;
  label: string;
}

/** Quote and Testimonial Card fall back to sample initials: give every person their own. */
const person = (p: QuotePerson): QuotePerson => ({
  ...p,
  initials: p.initials ?? p.name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join(''),
});

const card = (t: Testimonial, variant?: 'default' | 'logo') => (
  <TestimonialCard
    variant={variant ?? (t.company ? 'logo' : 'default')}
    quote={t.quote}
    by={person(t.by)}
    rating={t.rating}
    logo={t.company ? <CustomerLogo name={t.company} /> : undefined}
  />
);

function CardGrid({ items }: { items: Testimonial[] }) {
  return (
    <ul data-slot="testimonial-grid" className="m-0 grid w-full list-none grid-cols-1 items-start gap-6 p-0 @xl:grid-cols-2 @5xl:grid-cols-3">
      {items.map(t => <li key={t.by.name} className="flex min-w-0">{card(t, 'default')}</li>)}
    </ul>
  );
}

/* Testimonials */

export interface TestimonialsProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: TestimonialsHeader;
  /** 3 quotes. */
  testimonials?: Testimonial[];
}

const threeQuotes: Testimonial[] = [
  { quote: '“Late payments dropped by a third. The reminders paid for the subscription in the first month.”', by: { name: 'Irina Constantin', role: 'Managing director, Vitalis Clinics' }, rating: 5 },
  { quote: '“Our account managers stopped juggling three tools. Projects, invoices and clients are finally one screen.”', by: { name: 'Mihai Pop', role: 'Operations, Nord Digital Agency' }, rating: 5 },
  { quote: '“The import took one afternoon. Clients started paying online the same week.”', by: { name: 'Andreea Vasile', role: 'Founder, DermaCare' }, rating: 5 },
];

function Testimonials({
  header = { overline: 'Customers', title: 'Teams that run on Acme', description: 'What changed after the first three months.' },
  testimonials = threeQuotes,
  className,
  ...props
}: TestimonialsProps) {
  const titleId = React.useId();
  return (
    <section data-slot="testimonials" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <CardGrid items={testimonials} />
      </div>
    </section>
  );
}

/* Testimonial Single */

export interface TestimonialSingleProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Name of the section (it has no visible title). */
  label?: string;
  quote?: string;
  by?: QuotePerson;
  /** The customer's logo above the quote; null hides it. */
  company?: BrandLogoName | null;
}

function TestimonialSingle({
  label = 'Customer quote',
  quote = 'We closed the books four days faster in the first quarter. Approvals no longer live in email, and our auditors see every change.',
  by = { name: 'Elena Popa', role: 'CFO, Northwind Traders' },
  company = 'Northwind',
  className,
  ...props
}: TestimonialSingleProps) {
  return (
    <section data-slot="testimonial-single" aria-label={label} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={cn(inner, 'gap-8')}>
        {company ? <CustomerLogo name={company} /> : null}
        <Quote variant="pull" quote={quote} by={person(by)} className="max-w-224" />
      </div>
    </section>
  );
}

/* Testimonial Grid */

export interface TestimonialGridProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: TestimonialsHeader;
  /** 6 quotes (two rows of three). */
  testimonials?: Testimonial[];
}

const sixQuotes: Testimonial[] = [
  { quote: '“We closed the books four days faster in the first quarter. Approvals no longer live in email.”', by: { name: 'Elena Popa', role: 'CFO, Northwind Traders' }, rating: 5 },
  { quote: '“Our sales team finally trusts the numbers. Reports refresh every morning and nobody exports to Excel anymore.”', by: { name: 'Mark Schulz', role: 'VP Sales, Lumora' }, rating: 5 },
  { quote: '“Rolling it out to 400 people took two weeks. Roles and permissions just matched how we work.”', by: { name: 'Aisha Khan', role: 'IT Director, Orbitly' }, rating: 5 },
  { quote: '“Support answers in minutes, not days. That alone paid for the switch.”', by: { name: 'Tom Reyes', role: 'Operations lead, Fieldstone Logistics' }, rating: 5 },
  { quote: '“The audit log saved us during our ISO review. Every change is there, with who and when.”', by: { name: 'Laura Becker', role: 'Compliance manager, Halcyon' }, rating: 5 },
  { quote: '“Onboarding new clients went from a week of spreadsheets to one afternoon.”', by: { name: 'Dan Ionescu', role: 'Founder, Quintra' }, rating: 5 },
];

function TestimonialGrid({
  header = { overline: 'Customers', title: 'Teams that run on Acme', description: 'From 10-person agencies to 4,000-person enterprises.' },
  testimonials = sixQuotes,
  className,
  ...props
}: TestimonialGridProps) {
  const titleId = React.useId();
  return (
    <section data-slot="testimonial-grid-section" aria-labelledby={titleId} className={cn(shell, 'bg-[var(--section-muted-background)]', className)} {...props}>
      <div className={inner}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <CardGrid items={testimonials} />
      </div>
    </section>
  );
}

/* Testimonial Split */

export interface TestimonialSplitProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  label?: string;
  overline?: string;
  quote?: string;
  by?: QuotePerson;
  /** 3 result numbers; the same as in the case study. */
  figures?: ResultFigure[];
  /** null hides it. */
  link?: { label: string; href: string } | null;
  /** Figma Show image: the photo URL; without it the placeholder shows. */
  imageSrc?: string;
  imageAlt?: string;
}

function TestimonialSplit({
  label = 'Northwind Traders case study',
  overline = 'Case study',
  quote = '“Month-end used to take nine days. With approvals and reports in one place, we close in five.”',
  by = { name: 'Elena Popa', role: 'CFO, Northwind Traders' },
  figures = [{ value: '−44%', label: 'time to close the books' }, { value: '3,200', label: 'approvals per month' }, { value: '0', label: 'audit findings in 2026' }],
  link = { label: 'Read the case study', href: '#case-study' },
  imageSrc,
  imageAlt = '',
  className,
  ...props
}: TestimonialSplitProps) {
  return (
    <section data-slot="testimonial-split" aria-label={label} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <div data-slot="testimonial-split-row" className="flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:items-center @5xl:gap-16">
          <ImagePlaceholder ratio="4:3" src={imageSrc} alt={imageAlt} className="w-full rounded-xl @5xl:w-auto @5xl:min-w-0 @5xl:flex-1" />
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            {overline ? <p className={overlineCls}>{overline}</p> : null}
            <figure className="m-0 flex flex-col gap-6">
              <blockquote className="m-0 text-2xl leading-8 font-semibold tracking-tight text-balance [overflow-wrap:anywhere]">{quote}</blockquote>
              <figcaption><Byline name={by.name} description={by.role} avatar={{ initials: person(by).initials, src: by.avatar }} /></figcaption>
            </figure>
            {figures.length ? (
              <ul data-slot="testimonial-results" className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @sm:grid-cols-3 @sm:gap-8">
                {figures.map(r => <li key={r.label} className="min-w-0"><Figure value={r.value} label={r.label} /></li>)}
              </ul>
            ) : null}
            {link ? (
              <Button asChild variant="link">
                <a href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Testimonial Carousel */

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export interface TestimonialCarouselProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: TestimonialsHeader;
  /** More than six quotes; fewer belong in a grid. */
  testimonials?: Testimonial[];
}

const carouselQuotes: Testimonial[] = [
  sixQuotes[0]!,
  { ...sixQuotes[1]!, by: { name: 'Mark Schulz', role: 'VP Sales, Kestrel' } },
  { ...sixQuotes[2]!, by: { name: 'Aisha Khan', role: 'IT Director, Fieldstone' } },
  sixQuotes[3]!,
  sixQuotes[4]!,
  sixQuotes[5]!,
  { quote: '“We approve spend from our phones. Nothing waits for someone to be back at a desk.”', by: { name: 'Oliver Grant', role: 'Head of Finance, Corvid' }, rating: 5 },
];

function TestimonialCarousel({
  header = { overline: 'Customers', title: 'What our customers say', description: 'Stories from finance, sales and operations teams.' },
  testimonials = carouselQuotes,
  className,
  ...props
}: TestimonialCarouselProps) {
  const titleId = React.useId();
  const [ref, width] = useWidth<HTMLDivElement>();
  // 3 per view from 1024, 2 from 576, 1 below (Figma: 368 slides 24 apart in 1152).
  const perView = width >= 1024 - 64 ? 3 : width >= 576 - 48 ? 2 : 1;
  const slideWidth = Math.max(1, Math.floor((width - 24 * (perView - 1)) / perView));
  return (
    <section data-slot="testimonial-carousel" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={cn(inner, 'items-stretch gap-8')}>
        <SectionHeader align="left" titleId={titleId} overline={header.overline} title={header.title} description={header.description} className="max-w-none" />
        <div ref={ref} className="w-full min-w-0">
          {width ? (
            <Carousel label="Customer quotes" type="multiple" slideWidth={slideWidth} gap={24}>
              {testimonials.map(t => <div key={t.by.name} className="flex h-full">{card(t, 'default')}</div>)}
            </Carousel>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Testimonial Wall */

export interface TestimonialWallProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: TestimonialsHeader;
  /** The overall score and how many reviews it comes from. */
  score?: { value: number; count: number } | null;
  /** The featured story: a photo, the customer's logo and a long quote. */
  featured?: Testimonial & { imageSrc?: string };
  /** A short minimal quote next to the featured one. */
  aside?: Testimonial;
  /** 7 cards in the masonry. */
  testimonials?: Testimonial[];
  action?: { label: string; href: string } | null;
}

const wallQuotes: Testimonial[] = [
  { company: 'Lumora', quote: '“Month-end used to mean three late nights. Now reconciliations run while we sleep and the team leaves at six.”', by: { name: 'Ines Duarte', role: 'Controller, Lumora' } },
  { quote: '“Setup took an afternoon. The invoice templates already matched our brand, and clients pay through the link in the email.”', by: { name: 'Jonas Weber', role: 'Founder, Fieldstone Studio' }, rating: 5 },
  { quote: '“Reminders go out on their own, politely, in the client’s language. Overdue invoices dropped by a third.”', by: { name: 'Priya Nair', role: 'Operations Manager, Vireo' }, rating: 5 },
  { quote: '“We approve spend from our phones. Nothing waits for someone to be back at a desk.”', by: { name: 'Oliver Grant', role: 'Head of Finance, Corvid' }, rating: 5 },
  { company: 'Halcyon', quote: '“The audit trail answered every question our auditors asked. That alone saved us a week in March, and nobody had to dig through shared drives to find a signed approval.”', by: { name: 'Carla Mendes', role: 'CFO, Halcyon' } },
  { company: 'Orbitly', quote: '“SSO, SCIM and roles were live on day one. Security signed off after a single review.”', by: { name: 'Andrei Toma', role: 'IT Director, Orbitly' } },
  { quote: '“Exports land in our accounting tool exactly as our accountant wants them. No more fixing columns by hand.”', by: { name: 'Lena Fischer', role: 'Accountant, Vireo' }, rating: 5 },
];

function TestimonialWall({
  header = { overline: 'Customer stories', title: 'Loved by 1,200 finance teams', description: 'Real quotes from customers who moved invoicing, approvals and reporting to Acme.' },
  score = { value: 4.8, count: 1240 },
  featured = {
    company: 'Northwind',
    quote: '“We closed the books four days faster in the first quarter. Approvals no longer live in email, and our auditors get one export instead of forty attachments.”',
    by: { name: 'Sofia Marin', role: 'CFO, Northwind Traders' },
  },
  aside = { quote: '“Acme paid for itself in the first month. We stopped losing €3,000 a month to invoices nobody chased.”', by: { name: 'Radu Stan', role: 'Finance Lead, Quintra' } },
  testimonials = wallQuotes,
  action = { label: 'Read all 1,240 reviews', href: '#reviews' },
  className,
  ...props
}: TestimonialWallProps) {
  const titleId = React.useId();
  return (
    <section data-slot="testimonial-wall" aria-labelledby={titleId} className={cn(shell, 'bg-[var(--section-muted-background)]', className)} {...props}>
      <div className={inner}>
        <div className="flex w-full flex-col items-center gap-6">
          <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
          {score ? <Rating value={score.value} showValue count={score.count} countLabel={n => `from ${n.toLocaleString('en-IE')} reviews`} /> : null}
        </div>
        <div className="flex w-full min-w-0 flex-col gap-6">
          <div data-slot="testimonial-wall-highlight" className="flex w-full min-w-0 flex-col gap-6 @5xl:flex-row @5xl:items-center">
            <TestimonialCard
              variant="featured"
              className="@5xl:min-w-0 @5xl:flex-1 max-@xl:[&>[data-slot=image-placeholder]]:hidden"
              quote={featured.quote}
              by={person(featured.by)}
              image={featured.imageSrc ?? ''}
              logo={featured.company ? <CustomerLogo name={featured.company} /> : undefined}
            />
            {aside ? <TestimonialCard variant="minimal" className="@5xl:w-92 @5xl:shrink-0 @5xl:px-4" quote={aside.quote} by={person(aside.by)} /> : null}
          </div>
          <ul data-slot="testimonial-wall-masonry" className="m-0 w-full list-none columns-1 gap-6 p-0 @xl:columns-2 @5xl:columns-3">
            {testimonials.map(t => <li key={t.by.name} className="mb-6 break-inside-avoid">{card(t)}</li>)}
          </ul>
        </div>
        {action ? (
          <Button asChild variant="outline">
            <a href={action.href}>{action.label}<ArrowRight aria-hidden="true" /></a>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

/* Testimonial Video */

export interface TestimonialVideoProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  label?: string;
  /** The customer's logo above the quote; null hides it. */
  company?: BrandLogoName | null;
  /** A line from the video. */
  quote?: string;
  by?: QuotePerson;
  /** 3 results, the same numbers as in the case study. */
  figures?: ResultFigure[];
  video?: { title: string; duration: number; poster?: string; src?: string };
  link?: { label: string; href: string } | null;
}

function TestimonialVideo({
  label = 'Kestrel Logistics customer story',
  company = 'Kestrel',
  quote = '“Our drivers’ invoices used to wait two weeks for a signature. Now approvals happen the same day, and we know our cash position every morning.”',
  by = { name: 'Pieter de Vries', role: 'Finance Director, Kestrel Logistics' },
  figures = [{ value: '3 days', label: 'month-end close, down from 7' }, { value: '42%', label: 'fewer overdue invoices' }, { value: '€1.8M', label: 'cash collected sooner in 2026' }],
  video = { title: 'How Kestrel Logistics approves invoices the same day', duration: 760 },
  link = { label: 'Read the full Kestrel story', href: '#kestrel' },
  className,
  ...props
}: TestimonialVideoProps) {
  const [playing, setPlaying] = React.useState(false);
  return (
    <section data-slot="testimonial-video" aria-label={label} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <div data-slot="testimonial-video-row" className="flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:items-center @5xl:gap-16">
          <div data-slot="testimonial-video-media" className="w-full min-w-0 @5xl:w-auto @5xl:flex-1">
            {playing ? (
              <VideoPlayer title={video.title} duration={video.duration} src={video.src} poster={video.poster} defaultState="playing" />
            ) : (
              <VideoThumbnail title={video.title} duration={video.duration} poster={video.poster} onClick={() => setPlaying(true)} className="w-full shadow-lg" />
            )}
          </div>
          <div className="flex min-w-0 flex-col items-start gap-8 @5xl:w-112 @5xl:shrink-0">
            {company ? <LogoTile tileStyle="plain" logo={company} className="-ml-6 min-w-0" /> : null}
            <Quote quote={quote} by={person(by)} />
            {figures.length ? (
              <ul data-slot="testimonial-results" className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @sm:grid-cols-3">
                {figures.map(r => <li key={r.label} className="min-w-0"><Figure value={r.value} label={r.label} divider /></li>)}
              </ul>
            ) : null}
            {link ? (
              <Button asChild variant="link">
                <a href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export { TestimonialCarousel, TestimonialGrid, Testimonials, TestimonialSingle, TestimonialSplit, TestimonialVideo, TestimonialWall };
