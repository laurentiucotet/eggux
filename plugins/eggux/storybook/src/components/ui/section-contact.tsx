// EGG UI blocks, BLOCKS / Sections page (73:2), Contact family: Block / Contact (139:335), Contact
// Cards (197:1127), Contact with Map (197:1191), Offices (197:1319), Map Section (197:1428), Book a
// Demo (821:7086). Guide: build-ui/patterns/marketing-pages.md: the reply time, direct channels, a
// short form (name, email, topic, message) with an inline success that says what happens next; a
// map never alone, always with the written address, directions and hours.
// Every block is a <section> named by its title (h2), inside a 1152 container
// (layout/container/6xl) with 24 / 32 px gutters below 1152; layout follows the block's own width
// (container queries). 96 padding top and bottom except Map Section (full bleed).
// Contact: intro (overline, h2 in heading/h1, body, three channels as Icon Tile + label + detail,
// 24 apart) next to a form Card (Field: full name, email, topic Select, message Textarea, privacy
// Checkbox, full-width Button), 64 apart; stacked below 1024.
// Contact Cards: centered Section Header 48 above four Cards holding a Feature Item (icon, title,
// description, link), 24 apart; 4 per row from 1024, 2 from 576, 1 below.
// Contact with Map: left Section Header and a form (name and company side by side, work email,
// message, Send) next to a Map (360 high) with address, phone and hours rows; stacked below 1024.
// Offices: left Section Header 48 above three Location Cards with a Map (180 high), address, phone
// and Get directions; 3 per row from 1024, 2 from 576, 1 below.
// Map Section: a 560 high Map across the page with a 360 wide popover card (overline, h2, three
// Meta Items, Get directions and Call us) at the container start; below 768 the card sits under a
// 320 high map.
// Book a Demo: muted band; pitch (overline, h2, lead, four Check Items, a logo Testimonial Card,
// "Trusted by" and six customer logos, 3 per row) next to an elevated 480 Card with the form (first
// and last name, work email, company, size and country Selects, an optional message, a recording
// Checkbox, Book my demo, the reply promise); 64 apart, stacked below 1024.
import * as React from 'react';
import { ArrowRight, Clock, Info, Mail, MapPin, Phone } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ActionBar } from './action-bar';
import { Alert } from './alert';
import { Button } from './button';
import { Card, CardContent, CardHeader } from './card';
import { Checkbox } from './checkbox';
import { FeatureItem } from './feature-item';
import { Field } from './field';
import { CheckItem } from './form-layout';
import { IconTile } from './icon-tile';
import { MapView } from './imagery';
import { Input } from './input';
import { InputGroup } from './input-group';
import { LocationCard } from './location-card';
import { MetaItem } from './meta-item';
import { TestimonialCard, type QuotePerson } from './quote';
import { SectionHeader } from './section-header-block';
import { CustomerLogo } from './section-logos';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { Textarea } from './textarea';

/* Shared parts */

const shell = '@container w-full text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-12 px-6 py-24 @3xl:px-8 @6xl:px-0';
const overlineCls = 'm-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase';
const titleH1 = 'm-0 text-3xl leading-9 font-extrabold tracking-tight @3xl:text-4xl @3xl:leading-10';
const split = 'flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:gap-16';

export interface ContactHeader {
  overline?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface ContactLink {
  label: string;
  href: string;
}

/** The inline success that replaces a sent form: what happens next. */
function useSent(onSubmit?: (data: FormData) => void) {
  const [sent, setSent] = React.useState(false);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(new FormData(e.currentTarget));
    setSent(true);
  };
  return { sent, submit };
}

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/* Contact */

export interface ContactChannel {
  icon: React.ReactNode;
  label: string;
  detail: string;
  /** mailto:, tel: or a maps link; empty for plain text. */
  href?: string;
}

export interface ContactProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onSubmit'> {
  overline?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Two to four direct channels. */
  channels?: ContactChannel[];
  /** Topics of the Select. */
  topics?: string[];
  /** Called with the form data; the block then shows the inline success. */
  onSubmit?: (data: FormData) => void;
  /** What happens next, shown after sending. */
  successText?: string;
}

const contactChannels: ContactChannel[] = [
  { icon: <Mail />, label: 'Email', detail: 'hello@acme.example', href: 'mailto:hello@acme.example' },
  { icon: <Phone />, label: 'Phone', detail: '+40 31 000 0000 · Mon-Fri, 9-18', href: 'tel:+40310000000' },
  { icon: <MapPin />, label: 'Office', detail: 'Str. Lalelelor 12, Bucharest' },
];

const contactTopics = ['Plans and pricing', 'Security and compliance', 'Migration', 'Something else'];

function Contact({
  overline = 'Contact',
  title = 'Talk to our team',
  description = 'Questions about plans, security or a migration? We answer within one business day.',
  channels = contactChannels,
  topics = contactTopics,
  onSubmit,
  successText = 'Thank you. We reply to your email within one business day.',
  className,
  ...props
}: ContactProps) {
  const titleId = React.useId();
  const { sent, submit } = useSent(onSubmit);
  return (
    <section data-slot="contact" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <div data-slot="contact-row" className={cn(split, '@5xl:items-start')}>
          <div data-slot="contact-info" className="flex min-w-0 flex-1 flex-col items-start gap-6">
            {overline ? <p className={overlineCls}>{overline}</p> : null}
            <h2 id={titleId} className={titleH1}>{title}</h2>
            {description ? <p className="m-0 text-base leading-7 text-muted-foreground">{description}</p> : null}
            <ul className="m-0 flex list-none flex-col gap-6 p-0">
              {channels.map(ch => (
                <li key={ch.label} className="flex min-w-0 items-center gap-3">
                  <IconTile icon={ch.icon} />
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm leading-5 font-medium text-foreground">{ch.label}</span>
                    {ch.href ? (
                      <a href={ch.href} className="rounded-sm text-xs leading-4 text-muted-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring">{ch.detail}</a>
                    ) : (
                      <span className="text-xs leading-4 text-muted-foreground">{ch.detail}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Card data-slot="contact-form-card" className="min-w-0 flex-1">
            <CardContent>
              {sent ? (
                <Alert variant="success" title="Message sent" description={successText} />
              ) : (
                <form onSubmit={submit} aria-labelledby={titleId} className="flex flex-col gap-4">
                  <Field label="Full name">
                    <Input name="name" autoComplete="name" placeholder="Ana Popescu" required />
                  </Field>
                  <Field label="Email">
                    <InputGroup name="email" type="email" autoComplete="email" placeholder="name@example.com" start={<Mail aria-hidden="true" />} required />
                  </Field>
                  <Field label="Topic">
                    <Select name="topic">
                      <SelectTrigger placeholder="Choose a topic" />
                      <SelectContent>
                        {topics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Message">
                    <Textarea name="message" rows={3} placeholder="How can we help?" required />
                  </Field>
                  <Checkbox name="consent" label="I agree to the privacy policy" required />
                  <Button type="submit" className="w-full">Send message</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* Contact Cards */

export interface ContactCardItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: ContactLink;
}

export interface ContactCardsProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: ContactHeader;
  /** Three or four channels. */
  cards?: ContactCardItem[];
}

const contactCards: ContactCardItem[] = [
  { icon: <Mail />, title: 'Sales', description: 'Plans, volume pricing and procurement questions.', link: { label: 'sales@acme.example', href: 'mailto:sales@acme.example' } },
  { icon: <Info />, title: 'Support', description: 'Help with your account, billing or the product.', link: { label: 'Visit the help center', href: '#help' } },
  { icon: <Phone />, title: 'Phone', description: 'Monday to Friday, 9:00 to 18:00 (EET).', link: { label: '+40 21 555 0100', href: 'tel:+40215550100' } },
  { icon: <MapPin />, title: 'Office', description: 'Strada Exemplu 12, Floor 3, Bucharest.', link: { label: 'Get directions', href: '#directions' } },
];

function ContactCards({
  header = { overline: 'Contact', title: 'Talk to the right team', description: 'Sales, support or a visit: we answer within one business day.' },
  cards = contactCards,
  className,
  ...props
}: ContactCardsProps) {
  const titleId = React.useId();
  return (
    <section data-slot="contact-cards" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={cn(inner, 'items-center')}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <ul data-slot="contact-cards-grid" className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @xl:grid-cols-2 @5xl:grid-cols-4">
          {cards.map(c => (
            <li key={c.title} className="flex min-w-0">
              <Card className="flex-1">
                <CardContent>
                  <FeatureItem
                    icon={c.icon}
                    title={c.title}
                    description={c.description}
                    link={
                      <Button asChild variant="link">
                        <a href={c.link.href}>{c.link.label}<ArrowRight aria-hidden="true" /></a>
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Contact with Map */

export interface ContactWithMapProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onSubmit'> {
  header?: ContactHeader;
  /** The place name on the map pin. */
  placeName?: string;
  address?: string;
  phone?: string;
  hours?: string;
  onSubmit?: (data: FormData) => void;
  successText?: string;
}

function ContactWithMap({
  header = { overline: 'Contact', title: 'Visit or write to us', description: 'Tell us what you need and the right person replies within a day.' },
  placeName = 'Acme HQ',
  address = 'Strada Exemplu 12, Floor 3, 010101 Bucharest, Romania',
  phone = '+40 21 555 0100',
  hours = 'Monday to Friday, 9:00 to 18:00',
  onSubmit,
  successText = 'Thank you. The right person replies to your email within one business day.',
  className,
  ...props
}: ContactWithMapProps) {
  const titleId = React.useId();
  const { sent, submit } = useSent(onSubmit);
  const rows = [
    { icon: <MapPin />, text: <address className="not-italic">{address}</address> },
    { icon: <Phone />, text: <a href={telHref(phone)} className="rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring">{phone}</a> },
    { icon: <Clock />, text: hours },
  ];
  return (
    <section data-slot="contact-with-map" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <div data-slot="contact-with-map-row" className={split}>
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <SectionHeader align="left" titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
            {sent ? (
              <Alert variant="success" title="Message sent" description={successText} />
            ) : (
              <form onSubmit={submit} aria-labelledby={titleId} className="flex flex-col items-start gap-4">
                <div className="grid w-full grid-cols-1 gap-4 @xl:grid-cols-2">
                  <Field label="Full name"><Input name="name" autoComplete="name" placeholder="Ana Popescu" required /></Field>
                  <Field label="Company"><Input name="company" autoComplete="organization" placeholder="Northwind Traders" /></Field>
                </div>
                <Field label="Work email" className="w-full"><Input name="email" type="email" autoComplete="email" placeholder="name@company.com" required /></Field>
                <Field label="How can we help?" className="w-full"><Textarea name="message" rows={3} placeholder="Tell us about your team and what you want to achieve…" required /></Field>
                <Button type="submit">Send message</Button>
              </form>
            )}
          </div>
          <div data-slot="contact-with-map-place" className="flex min-w-0 flex-1 flex-col gap-6">
            <MapView label={placeName} address={address} className="aspect-auto h-[360px] w-full" />
            <ul className="m-0 flex list-none flex-col gap-6 p-0">
              {rows.map((row, i) => (
                <li key={i} className="flex min-w-0 items-start gap-3 text-base leading-7 text-foreground">
                  <span aria-hidden="true" className="flex h-7 shrink-0 items-center text-muted-foreground [&_svg]:size-5">{row.icon}</span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">{row.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Offices */

export interface Office {
  city: string;
  address: string;
  phone?: string;
  directionsHref: string;
}

export interface OfficesProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: ContactHeader;
  offices?: Office[];
}

const officeList: Office[] = [
  { city: 'Bucharest', address: 'Strada Exemplu 12, Floor 3', phone: '+40 21 555 0100', directionsHref: 'https://www.openstreetmap.org/' },
  { city: 'Berlin', address: 'Beispielstraße 8, 10115', phone: '+49 30 555 0100', directionsHref: 'https://www.openstreetmap.org/' },
  { city: 'London', address: '12 Example Street, EC2A', phone: '+44 20 5555 0100', directionsHref: 'https://www.openstreetmap.org/' },
];

function Offices({
  header = { overline: 'Offices', title: 'Find us in three cities', description: 'Walk in or book a meeting with the local team.' },
  offices = officeList,
  className,
  ...props
}: OfficesProps) {
  const titleId = React.useId();
  return (
    <section data-slot="offices" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <SectionHeader align="left" titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <ul data-slot="offices-grid" className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @xl:grid-cols-2 @5xl:grid-cols-3">
          {offices.map(o => (
            <li key={o.city} className="flex min-w-0">
              <LocationCard
                className="w-auto flex-1"
                city={o.city}
                address={o.address}
                directionsHref={o.directionsHref}
                directionsLabel={`the ${o.city} office`}
                map={<MapView label={`Acme ${o.city}`} showLabel={false} showControls={false} className="aspect-auto size-full max-w-none rounded-none" />}
                meta={o.phone ? (
                  <a href={telHref(o.phone)} className="flex min-w-0 self-start rounded-sm text-muted-foreground no-underline outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring">
                    <MetaItem icon={<Phone />}>{o.phone}</MetaItem>
                  </a>
                ) : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Map Section */

export interface MapSectionProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  address?: string;
  hours?: string;
  phone?: string;
  directionsHref?: string;
}

function MapSection({
  overline = 'Headquarters',
  title = 'Acme HQ',
  address = 'Strada Exemplu 12, Floor 3, Bucharest',
  hours = 'Monday to Friday, 9:00 to 18:00',
  phone = '+40 21 555 0100',
  directionsHref = 'https://www.openstreetmap.org/',
  className,
  ...props
}: MapSectionProps) {
  const titleId = React.useId();
  return (
    <section data-slot="map-section" aria-labelledby={titleId} className={cn(shell, 'relative bg-background', className)} {...props}>
      <MapView label={title} address={address} showLabel={false} className="aspect-auto h-[320px] w-full max-w-none rounded-none @3xl:h-[560px]" />
      <div className="px-6 py-6 @3xl:pointer-events-none @3xl:absolute @3xl:inset-x-0 @3xl:top-[72px] @3xl:px-8 @3xl:py-0 @6xl:px-0">
        <div className="mx-auto w-full max-w-6xl">
          <div data-slot="map-section-card" className="flex w-full min-w-0 flex-col gap-4 rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-md @3xl:pointer-events-auto @3xl:w-[360px]">
            <p className="m-0 text-xs leading-4 font-semibold tracking-widest text-muted-foreground uppercase">{overline}</p>
            <h2 id={titleId} className="m-0 text-2xl leading-8 font-semibold tracking-tight">{title}</h2>
            <address className="flex min-w-0 flex-col gap-4 not-italic">
              <MetaItem icon={<MapPin />}>{address}</MetaItem>
              <MetaItem icon={<Clock />}>{hours}</MetaItem>
              <MetaItem icon={<Phone />}>{phone}</MetaItem>
            </address>
            <ActionBar align="start">
              <Button asChild>
                <a href={directionsHref} target="_blank" rel="noopener noreferrer">Get directions<span className="sr-only"> to {title} (opens in a new tab)</span></a>
              </Button>
              <Button asChild variant="outline">
                <a href={telHref(phone)}>Call us</a>
              </Button>
            </ActionBar>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Book a Demo */

export interface BookADemoProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onSubmit'> {
  overline?: string;
  title?: string;
  description?: string;
  /** Three or four benefits of the call. */
  benefits?: string[];
  /** One customer quote; empty hides it. */
  testimonial?: { quote: string; by: QuotePerson; company: string };
  /** Customer names for the logo row; empty hides it. */
  logos?: string[];
  formTitle?: string;
  formDescription?: string;
  sizes?: string[];
  countries?: string[];
  onSubmit?: (data: FormData) => void;
  successText?: string;
}

const demoBenefits = [
  'A walkthrough built around your approval flow',
  'Pricing for your team size and volume, in EUR',
  'A migration plan from your current tool',
  'One call, no follow-up sequence unless you ask',
];

function BookADemo({
  overline = 'Book a demo',
  title = 'See Acme on your own invoices',
  description = 'A 30-minute call with a product specialist. Bring a real invoice run and we set it up with you, live.',
  benefits = demoBenefits,
  testimonial = {
    quote: '"The demo used our own invoices, not a sample account. We signed the same week and were live 10 days later."',
    by: { name: 'Sofia Marin', role: 'CFO, Northwind Traders', initials: 'SM' },
    company: 'Northwind',
  },
  logos = ['Northwind', 'Lumora', 'Orbitly', 'Halcyon', 'Vireo', 'Corvid'],
  formTitle = 'Book a 30-minute demo',
  formDescription = 'Tell us a little about your team. You pick a time on the next step.',
  sizes = ['1-10 people', '11-50 people', '51-200 people', '201-1,000 people', 'More than 1,000'],
  countries = ['Germany', 'France', 'Netherlands', 'Romania', 'United Kingdom', 'Other'],
  onSubmit,
  successText = 'Thank you. Pick a time on the next screen; we also email you the link.',
  className,
  ...props
}: BookADemoProps) {
  const titleId = React.useId();
  const { sent, submit } = useSent(onSubmit);
  return (
    <section data-slot="book-a-demo" aria-labelledby={titleId} className={cn(shell, 'bg-[var(--section-muted-background)]', className)} {...props}>
      <div className={inner}>
        <div data-slot="book-a-demo-row" className={cn(split, '@5xl:items-start')}>
          <div data-slot="book-a-demo-pitch" className="flex min-w-0 flex-1 flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className={overlineCls}>{overline}</p>
              <h2 id={titleId} className={titleH1}>{title}</h2>
              <p className="m-0 text-lg leading-7 text-muted-foreground @3xl:text-xl">{description}</p>
            </div>
            <ul aria-label="What the demo covers" className="m-0 flex flex-col gap-3 p-0">
              {benefits.map(b => <CheckItem key={b} stateText={{ check: '' }} className="[&>span]:whitespace-normal">{b}</CheckItem>)}
            </ul>
            {testimonial ? <TestimonialCard variant="logo" quote={testimonial.quote} by={testimonial.by} logo={<CustomerLogo name={testimonial.company} />} /> : null}
            {logos.length ? (
              <div className="flex flex-col gap-3">
                <p className="m-0 text-xs leading-4 text-muted-foreground">Trusted by finance teams at</p>
                <ul aria-label="Customers" className="m-0 grid list-none grid-cols-2 gap-4 p-0 @xl:grid-cols-3">
                  {logos.map(name => (
                    <li key={name} data-slot="logo-tile" className="flex h-[68px] items-center justify-center px-4">
                      <CustomerLogo name={name} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <Card data-slot="book-a-demo-card" elevated className="min-w-0 @5xl:w-[480px] @5xl:shrink-0">
            <CardHeader title={formTitle} description={formDescription} titleAs="h3" />
            <CardContent>
              {sent ? (
                <Alert variant="success" title="Request sent" description={successText} />
              ) : (
                <form onSubmit={submit} aria-label={formTitle} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                    <Field label="First name"><Input name="firstName" autoComplete="given-name" placeholder="Maria" required /></Field>
                    <Field label="Last name"><Input name="lastName" autoComplete="family-name" placeholder="Ilie" required /></Field>
                  </div>
                  <Field label="Work email">
                    <InputGroup name="email" type="email" autoComplete="email" placeholder="name@example.com" start={<Mail aria-hidden="true" />} required />
                  </Field>
                  <Field label="Company"><Input name="company" autoComplete="organization" placeholder="Acme Ltd" required /></Field>
                  <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
                    <Field label="Company size">
                      <Select name="size">
                        <SelectTrigger placeholder="Select team size" />
                        <SelectContent>{sizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <Field label="Country">
                      <Select name="country">
                        <SelectTrigger placeholder="Select a country" />
                        <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field label="What should we cover?" optional>
                    <Textarea name="topics" rows={2} placeholder="For example: approvals over EUR 5,000, multi-entity reporting" />
                  </Field>
                  <Checkbox name="recording" label="Send me the recording and slides after the call" />
                  <Button type="submit" className="w-full">Book my demo</Button>
                  <p className="m-0 text-xs leading-4 text-muted-foreground">
                    We reply within one business day. Read how we handle your data in our{' '}
                    <a href="#privacy" className="rounded-sm text-foreground underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">privacy policy</a>.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export { BookADemo, Contact, ContactCards, ContactWithMap, MapSection, Offices };
