// EGG UI blocks, BLOCKS / Sections page (73:2), Logos family: Block / Logo Cloud (139:244), Logo
// Grid (693:105390), Logos Split (693:105468), Logo Marquee (693:105531), Press Mentions
// (810:138355). Built from Logo Tile and the sample brand marks (Brand page: `Logo / *`,
// `Logo / Press / *`), Section Header, Quote, Button and Button Icon. Guide:
// build-ui/patterns/marketing-pages.md (Logo Cloud row; logos in one muted color, real customers
// only, with permission; press quotes true, dated and linked).
// Every block is a <section> named by its h2, or by its caption when it has none, inside a 1152
// container with 24 / 32 px gutters below 1152 (container queries).
// Logo Cloud: section/muted-background, 64 padding; caption (ui/label muted) 32 above two rows of 4
// plain tiles (288), 16 between rows; 2 per row below 768.
// Logo Grid: Section Header 48 above 8 bordered tiles (276, 16 apart, 4 per row from 768, 2 below)
// and a link 40 under them.
// Logos Split: text (overline, h2 in heading/h2, body, link; 448) 64 from a card/muted panel (640,
// 32 padding) of 6 plain tiles, 3 per row (2 below 576); stacked below 1024.
// Logo Marquee: caption 32 above a full-width track of plain tiles (192) that scrolls slowly, with
// fades on both ends. It stops with prefers-reduced-motion, on hover and focus, and with its
// pause button (WCAG 2.2.2); the repeated copy is aria-hidden.
// Press Mentions: Section Header 48 above 3 cards (32 apart, 32 padding): the publication's
// masthead, a Quote default without avatar (writer; publication and month), the link to the
// article (external icon); then "Also featured in" with 3 mastheads.
import * as React from 'react';
import { ArrowRight, ExternalLink, Pause, Play } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { BrandLogo, brandLogos, type BrandLogoName } from './brand-logos';
import { Logo } from './logo';
import { LogoTile } from './logo-tile';
import { Quote } from './quote';
import { SectionHeader } from './section-header-block';

/* Shared parts */

const shell = '@container w-full text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center px-6 @3xl:px-8 @6xl:px-0';
const captionCls = 'm-0 text-center text-sm leading-5 font-medium text-muted-foreground';
const overlineCls = 'm-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase';

export interface CustomerLogoProps extends Omit<React.ComponentProps<'svg'>, 'name'> {
  /** The customer: one of the sample brand marks (Figma `Logo / *`); any other name gets a lettered stand-in. */
  name: BrandLogoName | (string & {});
  /** Accessible name; default the customer's name. */
  title?: string;
}

/**
 * A customer's logo outside a tile (testimonials, case studies): the sample brand mark, named by the
 * brand. A name without a sample mark falls back to the library Logo with the name's initial.
 */
function CustomerLogo({ name, title, ...props }: CustomerLogoProps) {
  if (name in brandLogos) return <BrandLogo data-customer-logo="" name={name as BrandLogoName} title={title ?? name} {...props} />;
  return <Logo data-customer-logo="" name={name} mark={name.charAt(0)} className="[&_[data-slot=logo-mark]]:bg-foreground [&_[data-slot=logo-mark]]:text-background" />;
}

function LinkAction({ link }: { link: { label: string; href: string } }) {
  return (
    <Button asChild variant="link">
      <a href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></a>
    </Button>
  );
}

const cloudLogos: BrandLogoName[] = ['Northwind', 'Lumora', 'Kestrel', 'Fieldstone', 'Corvid', 'Halcyon', 'Meridian', 'Tidewater'];

/* Logo Cloud */

export interface LogoCloudProps extends React.ComponentProps<'section'> {
  /** The line above the logos; also names the section. */
  caption?: string;
  /** Customer names, one logo each; 8 for two rows. */
  logos?: BrandLogoName[];
}

function LogoCloud({ caption = 'Trusted by 1,200 finance teams in 38 countries, from startups to listed companies', logos = cloudLogos, className, ...props }: LogoCloudProps) {
  const captionId = React.useId();
  return (
    <section data-slot="logo-cloud" aria-labelledby={captionId} className={cn(shell, 'bg-[var(--section-muted-background)]', className)} {...props}>
      <div className={cn(inner, 'gap-8 py-16')}>
        <p id={captionId} className={captionCls}>{caption}</p>
        <ul aria-label="Customers" className="m-0 grid w-full list-none grid-cols-2 gap-y-4 p-0 @3xl:grid-cols-4">
          {logos.map(name => <LogoTile key={name} as="li" tileStyle="plain" logo={name} className="w-full" />)}
        </ul>
      </div>
    </section>
  );
}

/* Logo Grid */

export interface LogoGridProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: { overline?: React.ReactNode; title: React.ReactNode; description?: React.ReactNode };
  /** 8 customers (two rows of four). */
  logos?: BrandLogoName[];
  /** null hides it. */
  link?: { label: string; href: string } | null;
}

function LogoGrid({
  header = { overline: 'Customers', title: 'Finance teams in 38 countries run on Acme', description: 'From five-person agencies to listed companies, 1,200 teams send their invoices and approvals through Acme.' },
  logos = ['Northwind', 'Lumora', 'Orbitly', 'Fieldstone', 'Kestrel', 'Quintra', 'Halcyon', 'Brightpath'],
  link = { label: 'Read customer stories', href: '#customers' },
  className,
  ...props
}: LogoGridProps) {
  const titleId = React.useId();
  return (
    <section data-slot="logo-grid" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={cn(inner, 'gap-12 py-24')}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <div className="flex w-full flex-col items-center gap-10">
          <ul aria-label="Customers" className="m-0 grid w-full list-none grid-cols-2 gap-4 p-0 @3xl:grid-cols-4">
            {logos.map(name => <LogoTile key={name} as="li" tileStyle="bordered" logo={name} className="w-full" />)}
          </ul>
          {link ? <LinkAction link={link} /> : null}
        </div>
      </div>
    </section>
  );
}

/* Logos Split */

export interface LogosSplitProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: React.ReactNode;
  /** One sentence of context: who they are and why they are here. */
  description?: React.ReactNode;
  /** 6 partners or investors. */
  logos?: BrandLogoName[];
  link?: { label: string; href: string } | null;
}

function LogosSplit({
  overline = 'Partners',
  title = 'Built with the partners your finance team already uses',
  description = 'Acme connects to the accounting, banking and payroll tools on the right, so invoices, payments and approvals stay in sync without exports.',
  logos = ['Meridian', 'Tidewater', 'Vireo', 'Corvid', 'Halcyon', 'Kestrel'],
  link = { label: 'See all 60 integrations', href: '#integrations' },
  className,
  ...props
}: LogosSplitProps) {
  const titleId = React.useId();
  return (
    <section data-slot="logos-split" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={cn(inner, 'py-24')}>
        <div data-slot="logos-split-row" className="flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:items-center @5xl:gap-16">
          <div className="flex min-w-0 flex-col items-start gap-4 @5xl:w-112 @5xl:shrink-0">
            {overline ? <p className={overlineCls}>{overline}</p> : null}
            <h2 id={titleId} className="m-0 text-3xl leading-9 font-semibold tracking-tight text-balance">{title}</h2>
            {description ? <p className="m-0 text-base leading-7 text-muted-foreground">{description}</p> : null}
            {link ? <LinkAction link={link} /> : null}
          </div>
          <div data-slot="logos-split-panel" className="min-w-0 flex-1 rounded-xl bg-[var(--card-muted)] p-6 @3xl:p-8">
            <ul aria-label="Partners" className="m-0 grid list-none grid-cols-2 gap-y-4 p-0 @xl:grid-cols-3">
              {logos.map(name => <LogoTile key={name} as="li" tileStyle="plain" logo={name} className="w-full" />)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Logo Marquee */

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export interface LogoMarqueeProps extends React.ComponentProps<'section'> {
  caption?: string;
  /** 8 to 12 customers; the row repeats to scroll without a gap. */
  logos?: BrandLogoName[];
  /** Seconds for one full pass. Default 40. */
  duration?: number;
}

function LogoMarquee({
  caption = 'Trusted by product and finance teams at 1,200 companies',
  logos = ['Northwind', 'Lumora', 'Orbitly', 'Fieldstone', 'Kestrel', 'Quintra', 'Halcyon', 'Brightpath', 'Corvid', 'Meridian'],
  duration = 40,
  className,
  ...props
}: LogoMarqueeProps) {
  const captionId = React.useId();
  const reduced = useReducedMotion();
  const track = React.useRef<HTMLDivElement>(null);
  const animation = React.useRef<Animation | null>(null);
  const [paused, setPaused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const moving = !reduced && !paused && !hovered;

  React.useEffect(() => {
    const el = track.current;
    if (!el || reduced || typeof el.animate !== 'function') return;
    const a = el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: duration * 1000, iterations: Infinity, easing: 'linear' });
    animation.current = a;
    return () => {
      a.cancel();
      animation.current = null;
    };
  }, [reduced, duration]);

  React.useEffect(() => {
    const a = animation.current;
    if (!a) return;
    if (moving) a.play();
    else a.pause();
  }, [moving]);

  const row = (hidden: boolean) => (
    <ul aria-label={hidden ? undefined : 'Customers'} aria-hidden={hidden || undefined} className="m-0 flex shrink-0 list-none p-0">
      {logos.map(name => <LogoTile key={name} as="li" tileStyle="plain" logo={name} title={hidden ? '' : undefined} className="w-48" />)}
    </ul>
  );

  return (
    <section data-slot="logo-marquee" aria-labelledby={captionId} className={cn('@container w-full bg-background py-16 text-foreground', className)} {...props}>
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex items-center gap-2 px-6">
          <p id={captionId} className={captionCls}>{caption}</p>
          {!reduced ? (
            <ButtonIcon
              variant="ghost"
              size="xs"
              icon={paused ? <Play /> : <Pause />}
              label={paused ? 'Play logo animation' : 'Pause logo animation'}
              aria-pressed={paused}
              onClick={() => setPaused(p => !p)}
            />
          ) : null}
        </div>
        <div
          data-slot="logo-marquee-viewport"
          data-moving={moving || undefined}
          className={cn('relative w-full overflow-hidden', reduced && 'overflow-x-auto')}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          <div ref={track} data-slot="logo-marquee-track" className={cn('flex w-max', reduced && 'mx-auto')}>
            {row(false)}
            {reduced ? null : row(true)}
          </div>
          {!reduced ? (
            <>
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent" />
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent" />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Press Mentions */

export interface PressMention {
  /** One of the sample press mastheads (Figma `Logo / Press / *`). */
  publication: BrandLogoName;
  /** A short quote from the article, without quote marks. */
  quote: string;
  writer: string;
  /** Month and year of the article. */
  date: string;
  href: string;
}

export interface PressMentionsProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: { overline?: React.ReactNode; title: React.ReactNode; description?: React.ReactNode };
  /** 3 real articles. */
  mentions?: PressMention[];
  /** More publications, mastheads only; empty hides the row. */
  alsoFeatured?: BrandLogoName[];
}

const mentions: PressMention[] = [
  { publication: 'The Ledger Review', quote: 'Acme turns the month-end close from a week of spreadsheets into an afternoon of approvals.', writer: 'Ioana Marin', date: 'March 2026', href: '#ledger-review' },
  { publication: 'Northbeam Daily', quote: 'The rare finance tool that operations teams actually open on their phones.', writer: 'Daniel Weber', date: 'May 2026', href: '#northbeam-daily' },
  { publication: 'Margin Weekly', quote: 'Bank matching that just works, and pricing a small team can read on one screen.', writer: 'Clara Jensen', date: 'August 2026', href: '#margin-weekly' },
];

function Masthead({ name }: { name: BrandLogoName }) {
  return <BrandLogo name={name} title={name} />;
}

function PressMentions({
  header = { overline: 'In the press', title: 'Finance teams are talking about Acme' },
  mentions: items = mentions,
  alsoFeatured = ['Tallyline', 'Counting House', 'Fieldnote Business'],
  className,
  ...props
}: PressMentionsProps) {
  const titleId = React.useId();
  const alsoId = React.useId();
  return (
    <section data-slot="press-mentions" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={cn(inner, 'gap-12 py-24')}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <ul className="m-0 grid w-full list-none grid-cols-1 gap-8 p-0 @3xl:grid-cols-3">
          {items.map(m => (
            <li key={m.publication} data-slot="press-mention" className="flex min-w-0 flex-col items-start gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground @5xl:p-8">
              <div className="flex h-8 items-center"><Masthead name={m.publication} /></div>
              <Quote quote={m.quote} by={{ name: m.writer, role: `${m.publication}, ${m.date}` }} showAvatar={false} className="[&_blockquote]:font-medium" />
              <div aria-hidden="true" className="flex-1" />
              <Button asChild variant="link">
                <a href={m.href} aria-label={`Read the article in ${m.publication}`}>Read the article<ExternalLink aria-hidden="true" /></a>
              </Button>
            </li>
          ))}
        </ul>
        {alsoFeatured.length ? (
          <div data-slot="press-also" className="flex flex-col items-center gap-4 @3xl:flex-row @3xl:gap-10">
            <p id={alsoId} className={cn(captionCls, 'shrink-0')}>Also featured in</p>
            <ul aria-labelledby={alsoId} className="m-0 flex list-none flex-wrap justify-center gap-2 p-0">
              {alsoFeatured.map(name => <LogoTile key={name} as="li" tileStyle="plain" logo={name} />)}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export { CustomerLogo, LogoCloud, LogoGrid, LogoMarquee, LogosSplit, PressMentions };
