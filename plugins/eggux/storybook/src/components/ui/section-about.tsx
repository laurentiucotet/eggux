// EGG UI blocks, BLOCKS / Sections page (73:2), About family: Block / About Hero (693:127208),
// Mission with Figures (693:127406), Our Story (693:127235), Values (693:127313), Timeline Section
// (831:6905). Guide: build-ui/patterns/marketing-pages.md (the About page, in this order, then Team,
// a testimonial, partners and a CTA; Timeline Section for 3 to 5 milestones).
// Every block is a <section> with 96 px vertical padding (64 below 768) and content in a 1152
// container (layout/container/6xl), 24 / 32 px gutters below 1152; layout follows the block's own
// width (container queries).
// About Hero: the page's h1. Centered header (896: overline, display/lg title, 720 lead, 24 apart),
// 64 above a row of four photos (3:4 232, 4:3 416, 3:4 232, 3:4 200; 24 apart, centered); 2 × 2
// below 768.
// Mission with Figures: overline, h2 in heading/h1, lead and four Figures lg with divider in two
// columns of 256 (32 apart) in a 608 column, 64 left of a 1:1 photo (480); stacked below 1024.
// Our Story: section/muted-background. Text (640: overline, h2, two paragraphs, an Image Figure)
// 64 left of a Milestones card (448, 32 padding, radius xl, border, card background) holding a
// Timeline; the last milestone is primary. Stacked below 1024.
// Values: centered Section Header 48 above six stacked Feature Items with brand Icon Tiles, three
// columns of 362, 32 apart; two from 576, one below.
// Timeline Section: centered Section Header 48 above five milestones in a row (230 each, 24 right
// padding): a year Badge (soft-neutral, the latest default) with a line, then a Timeline Item
// Layout=card. Below 1024 the year row hides (the card shows the date) and the cards stack.
import * as React from 'react';
import { Building, Clock, CreditCard, Heart, Lock, MessageSquare, ShieldCheck, Sparkles, TrendingUp, Users } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { FeatureItem } from './feature-item';
import { Figure } from './figure';
import { ImagePlaceholder, type ImageRatio } from './image-placeholder';
import { ImageFigure } from './imagery';
import { SectionHeader } from './section-header-block';
import { Separator } from './separator';
import { Timeline, TimelineItem, type TimelineTone } from './timeline';

const shell = '@container w-full text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col px-6 py-16 @3xl:px-8 @3xl:py-24 @6xl:px-0';
const overlineCls = 'm-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase';
const titleH1 = 'm-0 text-3xl leading-9 font-extrabold tracking-tight [overflow-wrap:anywhere] @3xl:text-4xl @3xl:leading-10';
const lead = 'm-0 text-lg leading-7 text-muted-foreground @3xl:text-xl';

export interface AboutImage { src?: string; alt?: string; ratio?: ImageRatio }

/* About Hero */

export interface AboutHeroProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  /** The page's h1. */
  title?: string;
  description?: string;
  /** Four photos: people first, then places. */
  images?: AboutImage[];
}

const heroImages: AboutImage[] = [
  { ratio: '3:4', alt: 'Andrei, one of the first engineers at Acme' },
  { ratio: '4:3', alt: 'The corridor of the Acme Bucharest office' },
  { ratio: '3:4', alt: 'A team lunch under pendant lights' },
  { ratio: '3:4', alt: 'The skyline seen from the London office' },
];

function AboutHero({
  overline = 'About Acme',
  title = 'We help finance teams get paid on time',
  description = 'Acme started in 2017 in a Bucharest accounting office. Today 140 people in Bucharest, Berlin and London build the tools 1,200 companies use to send invoices, approve spend and chase late payments, kindly.',
  images = heroImages,
  className,
  ...props
}: AboutHeroProps) {
  const titleId = React.useId();
  return (
    <section data-slot="about-hero" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={cn(inner, 'items-center gap-12 @3xl:gap-16')}>
        <div data-slot="about-hero-header" className="flex w-full max-w-[896px] flex-col items-center gap-6 text-center">
          {overline ? <p className={overlineCls}>{overline}</p> : null}
          <h1 id={titleId} className="m-0 text-4xl leading-10 font-extrabold tracking-[-0.4px] text-balance [overflow-wrap:anywhere] @3xl:text-6xl @3xl:leading-[60px]">{title}</h1>
          {description ? <p className={cn(lead, 'max-w-[720px] text-pretty')}>{description}</p> : null}
        </div>
        <div data-slot="about-hero-images" className="grid w-full grid-cols-2 items-center gap-4 @3xl:grid-cols-[232fr_416fr_232fr_200fr] @3xl:gap-6">
          {images.map((img, i) => (
            <ImagePlaceholder key={i} ratio={img.ratio ?? '3:4'} src={img.src} alt={img.alt ?? ''} showCaption={false} className="rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Mission with Figures */

export interface AboutFigure { value: string; label: string; source?: string }

export interface MissionWithFiguresProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  description?: string;
  /** Four figures; give each a source when it is a claim. */
  figures?: AboutFigure[];
  image?: AboutImage | null;
}

const missionFigures: AboutFigure[] = [
  { value: '1,200', label: 'companies in 38 countries' },
  { value: '€2.4 bn', label: 'invoiced through Acme in 2025' },
  { value: '18 days', label: 'faster payment on average' },
  { value: '140', label: 'people in Bucharest, Berlin and London' },
];

function MissionWithFigures({
  overline = 'Our mission',
  title = 'Every invoice paid on time, without a single awkward email',
  description = 'Late payments sink more small companies than bad products. We build the reminders, approvals and reports that keep cash coming in, so finance teams can spend Friday on something else.',
  figures = missionFigures,
  image = { ratio: '1:1', alt: 'A busy city street with taxis between office towers' },
  className,
  ...props
}: MissionWithFiguresProps) {
  const titleId = React.useId();
  return (
    <section data-slot="mission-with-figures" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <div data-slot="mission-row" className="grid w-full grid-cols-1 items-center gap-12 @5xl:grid-cols-[608fr_480fr] @5xl:gap-16">
          <div data-slot="mission-text" className="flex min-w-0 flex-col gap-6">
            {overline ? <p className={overlineCls}>{overline}</p> : null}
            <h2 id={titleId} className={titleH1}>{title}</h2>
            {description ? <p className={lead}>{description}</p> : null}
            <ul data-slot="mission-figures" aria-label="Acme in figures" className="m-0 grid list-none grid-cols-1 gap-8 p-0 @xl:grid-cols-2 @5xl:max-w-[544px]">
              {figures.map(f => (
                <li key={f.label} className="min-w-0"><Figure size="lg" divider value={f.value} label={f.label} source={f.source} className="[&>span:nth-child(2)]:whitespace-normal" /></li>
              ))}
            </ul>
          </div>
          {image ? <ImagePlaceholder ratio={image.ratio ?? '1:1'} src={image.src} alt={image.alt ?? ''} showCaption={false} className="rounded-xl" /> : null}
        </div>
      </div>
    </section>
  );
}

/* Our Story */

export interface Milestone {
  title: string;
  /** Shown date ("2017", "March 2017"). */
  time: string;
  /** Machine date for <time datetime> ("2017", "2017-03"). */
  dateTime?: string;
  description?: string;
  tone?: TimelineTone;
  icon?: React.ReactNode;
}

export interface OurStoryProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  /** One or two paragraphs. */
  paragraphs?: string[];
  image?: (AboutImage & { caption: string }) | null;
  milestonesTitle?: string;
  /** Three to six; the latest uses tone primary. */
  milestones?: Milestone[];
}

const storyMilestones: Milestone[] = [
  { time: '2017', title: 'Founded in Bucharest', description: 'Elena and Mark build a reminder tool for her accounting clients.' },
  { time: '2019', title: 'First 100 customers', description: 'Agencies and studios in Romania and Poland move their invoicing to Acme.' },
  { time: '2022', title: 'Series A, EUR 18 million', description: 'Approvals, bank sync and EU data residency ship the same year.' },
  { time: '2024', title: '1,000 customers in 30 countries', description: 'E-invoicing for Italy, Poland and Germany goes live.' },
  { time: '2026', title: 'Acme Business', description: 'Multi-entity books for groups with several companies.', tone: 'primary' },
];

function OurStory({
  overline = 'Our story',
  title = 'Started in an accounting office tired of chasing invoices',
  paragraphs = [
    'In 2017 Elena Popa ran a small accounting office in Bucharest and spent every Friday writing payment reminders by hand. With Mark Schulz, an engineer and old friend, she built a tool for her own clients, and the clients asked to use it for their customers.',
    'Nine years later the idea is the same: send the invoice, follow up politely and show everyone where the money is.',
  ],
  image = { ratio: '4:3', caption: 'The Bucharest office, where Acme started, in 2024', alt: 'An empty meeting room with a long table and tall windows' },
  milestonesTitle = 'Milestones',
  milestones = storyMilestones,
  className,
  ...props
}: OurStoryProps) {
  const titleId = React.useId();
  const msId = React.useId();
  return (
    <section data-slot="our-story" aria-labelledby={titleId} className={cn(shell, 'bg-[var(--section-muted-background)]', className)} {...props}>
      <div className={inner}>
        <div data-slot="our-story-row" className="grid w-full grid-cols-1 items-start gap-12 @5xl:grid-cols-[640fr_448fr] @5xl:gap-16">
          <div data-slot="our-story-text" className="flex min-w-0 flex-col gap-6">
            {overline ? <p className={overlineCls}>{overline}</p> : null}
            <h2 id={titleId} className={titleH1}>{title}</h2>
            <div className="flex flex-col gap-6">
              {paragraphs.map((p, i) => <p key={i} className="m-0 text-base leading-7 text-muted-foreground">{p}</p>)}
            </div>
            {image ? <ImageFigure ratio={image.ratio ?? '4:3'} src={image.src} alt={image.alt ?? ''} caption={image.caption} /> : null}
          </div>
          <div data-slot="our-story-milestones" className="flex min-w-0 flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground @3xl:p-8">
            <h3 id={msId} className="m-0 text-xl leading-7 font-semibold">{milestonesTitle}</h3>
            <Timeline aria-labelledby={msId}>
              {milestones.map((m, i) => (
                <TimelineItem
                  key={m.title}
                  title={m.title}
                  time={m.time}
                  dateTime={m.dateTime ?? m.time}
                  description={m.description}
                  tone={m.tone}
                  icon={m.icon}
                  connector={i < milestones.length - 1}
                />
              ))}
            </Timeline>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Values */

export interface AboutValue { title: string; description: string; icon: React.ReactNode }

export interface ValuesProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  description?: string;
  /** Three or six values. */
  values?: AboutValue[];
}

const aboutValues: AboutValue[] = [
  { icon: <CreditCard />, title: "Customers' money comes first", description: 'We never hold, delay or sell payment data. Every feature is judged by how fast it gets someone paid.' },
  { icon: <MessageSquare />, title: 'Plain words', description: 'Invoices, emails and our own docs use words a client understands on the first read.' },
  { icon: <Users />, title: 'Small teams, full ownership', description: 'Teams of five own a problem from the first customer interview to the support reply.' },
  { icon: <Heart />, title: 'Calm by default', description: 'No dark patterns, no fake urgency and no meeting without an agenda.' },
  { icon: <Lock />, title: 'Private by design', description: 'Data stays in the EU and encrypted; we ask only for what we need.' },
  { icon: <TrendingUp />, title: 'Measured, then shipped', description: 'We ship small, measure days to payment and remove what does not help.' },
];

function Values({
  overline = 'Our values',
  title = 'What we hold ourselves to',
  description = 'Six habits that decide how we build, support and sell Acme.',
  values = aboutValues,
  className,
  ...props
}: ValuesProps) {
  const titleId = React.useId();
  return (
    <section data-slot="values" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={cn(inner, 'items-center gap-10 @3xl:gap-12')}>
        <SectionHeader titleId={titleId} overline={overline} title={title} description={description} />
        <ul data-slot="values-grid" className="m-0 grid w-full list-none grid-cols-1 gap-8 p-0 @xl:grid-cols-2 @5xl:grid-cols-3">
          {values.map(v => (
            <li key={v.title} className="min-w-0"><FeatureItem icon={v.icon} tileStyle="brand" title={v.title} description={v.description} /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Timeline Section */

export interface TimelineSectionProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  description?: string;
  /** Three to five milestones, oldest first; `year` labels the row above each card. */
  milestones?: (Milestone & { year: string })[];
}

const journey: (Milestone & { year: string })[] = [
  { year: '2017', time: 'March 2017', dateTime: '2017-03', title: 'Founded in Bucharest', description: 'Elena Popa and Mark Schulz send the first invoice reminders for 12 local studios.', icon: <Building /> },
  { year: '2019', time: 'October 2019', dateTime: '2019-10', title: 'First 100 customers', description: 'Studios in Romania, Germany and Austria send their invoices with Acme.', icon: <TrendingUp /> },
  { year: '2021', time: 'October 2021', dateTime: '2021-10', title: 'Series A, EUR 12M', description: 'The Berlin office opens; SEPA Direct Debit and multi-currency invoices ship.', icon: <TrendingUp /> },
  { year: '2024', time: 'February 2024', dateTime: '2024-02', title: 'SOC 2 Type II', description: 'Enterprise plan with SSO, SCIM and audit log; the London office opens.', icon: <ShieldCheck />, tone: 'success' },
  { year: '2026', time: 'September 2026', dateTime: '2026-09', title: '1,200 customers', description: 'EUR 2.4B invoiced this year across 30 countries; AI reconciliation in beta.', icon: <Sparkles />, tone: 'primary' },
];

function TimelineSection({
  overline = 'Our journey',
  title = 'Nine years of getting finance teams paid',
  description = 'From a two-person studio in Bucharest to 1,200 customers in 30 countries.',
  milestones = journey,
  className,
  ...props
}: TimelineSectionProps) {
  const titleId = React.useId();
  const last = milestones.length - 1;
  const cols = { gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` };
  return (
    <section data-slot="timeline-section" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={cn(inner, 'items-center gap-10 @3xl:gap-12')}>
        <SectionHeader titleId={titleId} overline={overline} title={title} description={description} />
        <div data-slot="timeline-section-track" className="flex w-full flex-col gap-4">
          <div data-slot="timeline-section-years" aria-hidden="true" className="hidden @5xl:grid" style={cols}>
            {milestones.map((m, i) => (
              <div key={m.year} className="flex min-w-0 items-center gap-3 pr-6">
                <Badge shape="pill" variant={i === last ? 'default' : 'soft-neutral'}>{m.year}</Badge>
                <Separator className="min-w-0 flex-1" />
              </div>
            ))}
          </div>
          <Timeline aria-labelledby={titleId} className="grid gap-0 @5xl:[grid-template-columns:var(--cols)]" style={{ '--cols': cols.gridTemplateColumns } as React.CSSProperties}>
            {milestones.map(m => (
              <TimelineItem
                key={m.year}
                layout="card"
                connector={false}
                title={m.title}
                time={m.time}
                dateTime={m.dateTime}
                description={m.description}
                tone={m.tone}
                icon={m.icon ?? <Clock />}
                className="@5xl:pr-6"
              />
            ))}
          </Timeline>
        </div>
      </div>
    </section>
  );
}

export { AboutHero, MissionWithFigures, OurStory, TimelineSection, Values };
