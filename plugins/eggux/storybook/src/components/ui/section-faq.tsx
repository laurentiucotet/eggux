// EGG UI blocks, BLOCKS / Sections page (73:2), FAQ family: Block / FAQ (76:433), FAQ Grid
// (205:1702), FAQ Centered (205:1726), FAQ with Categories (821:6695).
// Built from Accordion (default and card styles), Section Header, Table of Contents, Badge and
// Button. Guide: build-ui/patterns/marketing-pages.md (FAQ row: grid when answers are 1-2
// sentences, accordion for longer answers, end with a contact option, categories past ten questions).
// Every block is a <section> named by its h2, 96 padding, inside a 1152 container with 24 / 32 px
// gutters below 1152 (container queries).
// FAQ: section/muted-background band; a left Section Header (384) 64 from a default Accordion
// (704, first item open); stacked below 1024.
// FAQ Grid: centered Section Header 48 above questions in two columns (48 apart, 40 between rows):
// a description list: the question (dt) in body/large over the answer (dd) in body/default muted; one column below 768.
// FAQ Centered: a 768 column: Section Header, Accordion, and a "Still have questions?" card with a
// contact button, 40 apart.
// FAQ with Categories: centered Section Header; a 256 column with the topics (Table of Contents,
// the active topic marked) and a help card, 64 from the answers: the topic (h3) with a question
// count Badge over a card Accordion. Picking a topic shows its questions. Topics above below 1024.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionItem } from './accordion';
import { Badge } from './badge';
import { Button } from './button';
import { SectionHeader } from './section-header-block';
import { TableOfContents, TableOfContentsItem, TableOfContentsList } from './table-of-contents';

/* Shared parts */

const shell = '@container w-full text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center gap-12 px-6 py-24 @3xl:px-8 @6xl:px-0';

export interface FaqHeader {
  overline?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export interface FaqContact {
  title: string;
  description?: string;
  action: { label: string; href: string };
}

function FaqAccordion({ items, accordionStyle = 'default', openFirst = true, className }: { items: FaqItem[]; accordionStyle?: 'default' | 'card'; openFirst?: boolean; className?: string }) {
  return (
    <Accordion accordionStyle={accordionStyle} defaultValue={openFirst && items.length ? ['q0'] : []} className={className}>
      {items.map((q, i) => (
        <AccordionItem key={q.question} value={`q${i}`} title={q.question}>
          <p className="m-0 leading-5 text-muted-foreground">{q.answer}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/* FAQ */

export interface FaqProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: FaqHeader;
  items?: FaqItem[];
}

const faqItems: FaqItem[] = [
  { question: 'Can I change my plan later?', answer: 'Yes. Upgrade or downgrade at any time; we prorate the difference on your next invoice.' },
  { question: 'Do you integrate with my accounting tool?', answer: 'Acme syncs invoices and payments with the common accounting tools every hour, and exports CSV for the rest.' },
  { question: 'Where is my data stored?', answer: 'In the EU (Frankfurt), encrypted at rest and in transit. We never sell or share it.' },
  { question: 'Can I cancel anytime?', answer: 'Yes. You keep access until the end of the period you paid for, and you can export everything.' },
  { question: 'How long does onboarding take?', answer: 'Most teams send their first invoice the same day. Import projects, clients and open invoices from a CSV in a few minutes.' },
  { question: 'Is there a discount for non-profits?', answer: 'Yes, 30% off every plan. Write to us with your registration number.' },
  { question: 'Who can see our invoices and reports?', answer: 'Only the people you invite, with the role you give them. Every view and change is in the audit log.' },
];

function Faq({
  header = { overline: 'FAQ', title: 'Questions teams ask', description: 'Can’t find the answer? Write to support@acme.com.' },
  items = faqItems,
  className,
  ...props
}: FaqProps) {
  const titleId = React.useId();
  return (
    <section data-slot="faq" aria-labelledby={titleId} className={cn(shell, 'bg-[var(--section-muted-background)]', className)} {...props}>
      <div className={inner}>
        <div data-slot="faq-row" className="flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:items-start @5xl:gap-16">
          <SectionHeader align="left" titleId={titleId} overline={header.overline} title={header.title} description={header.description} className="@5xl:w-96 @5xl:shrink-0" />
          <FaqAccordion items={items} className="min-w-0 flex-1" />
        </div>
      </div>
    </section>
  );
}

/* FAQ Grid */

export interface FaqGridProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: FaqHeader;
  /** Questions with short answers (one or two sentences). */
  items?: FaqItem[];
}

const gridItems: FaqItem[] = [
  { question: 'Can I try it before I buy?', answer: 'Yes. Every plan starts with a 30-day trial with all features and no credit card.' },
  { question: 'Where is my data stored?', answer: 'In the EU (Frankfurt), encrypted at rest and in transit. We never sell or share it.' },
  { question: 'Do you support single sign-on?', answer: 'Yes: Okta, Microsoft Entra ID and Google Workspace, on every plan.' },
  { question: 'Can I import my existing data?', answer: 'Import invoices and customers from CSV or XLSX, or connect your accounting software.' },
  { question: 'How does billing work?', answer: 'Per seat, monthly or yearly. Seats added mid-cycle are prorated on the next invoice.' },
  { question: 'What happens if I cancel?', answer: 'You keep access until the end of the period and can export everything for 90 days.' },
];

function FaqGrid({
  header = { overline: 'FAQ', title: 'Questions we hear often', description: 'Can’t find an answer? Our team replies within one business day.' },
  items = gridItems,
  className,
  ...props
}: FaqGridProps) {
  const titleId = React.useId();
  return (
    <section data-slot="faq-grid" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <dl data-slot="faq-grid-list" className="m-0 grid w-full grid-cols-1 gap-x-12 gap-y-10 @3xl:grid-cols-2">
          {items.map(q => (
            <div key={q.question} data-slot="faq-grid-item" className="flex min-w-0 flex-col gap-2">
              <dt className="text-lg leading-7 font-medium text-foreground [overflow-wrap:anywhere]">{q.question}</dt>
              <dd className="m-0 text-base leading-7 text-muted-foreground [overflow-wrap:anywhere]">{q.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* FAQ Centered */

export interface FaqCenteredProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: FaqHeader;
  items?: FaqItem[];
  /** The contact option at the end; null hides it. */
  contact?: FaqContact | null;
}

const centeredItems: FaqItem[] = [
  { question: 'Can I try it before I buy?', answer: 'Yes. Every plan starts with a 30-day trial with all features and no credit card. You can invite your team during the trial.' },
  { question: 'Where is my data stored?', answer: 'In the EU (Frankfurt), encrypted at rest and in transit. We never sell or share it.' },
  { question: 'Do you support single sign-on?', answer: 'Yes: Okta, Microsoft Entra ID and Google Workspace, on every plan.' },
  { question: 'How does billing work?', answer: 'Per seat, monthly or yearly. Seats added mid-cycle are prorated on the next invoice.' },
  { question: 'What happens if I cancel?', answer: 'You keep access until the end of the period and can export everything for 90 days.' },
  { question: 'Can I import my existing data?', answer: 'Import invoices and customers from CSV or XLSX, or connect your accounting software.' },
  { question: 'Is there a discount for non-profits?', answer: 'Yes, 30% off every plan. Write to us with your registration number.' },
];

function FaqCentered({
  header = { overline: 'FAQ', title: 'Frequently asked questions', description: 'Everything about plans, data and security.' },
  items = centeredItems,
  contact = { title: 'Still have questions?', description: 'Talk to a person, not a bot. We reply within one business day.', action: { label: 'Contact us', href: '#contact' } },
  className,
  ...props
}: FaqCenteredProps) {
  const titleId = React.useId();
  return (
    <section data-slot="faq-centered" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <div data-slot="faq-centered-column" className="flex w-full max-w-3xl min-w-0 flex-col gap-10">
          <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
          <FaqAccordion items={items} />
          {contact ? (
            <div data-slot="faq-contact" className="flex flex-col items-start gap-4 rounded-xl bg-[var(--section-muted-background)] p-6 @xl:flex-row @xl:items-center">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="m-0 text-lg leading-7 font-medium">{contact.title}</h3>
                {contact.description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{contact.description}</p> : null}
              </div>
              <Button asChild variant="outline"><a href={contact.action.href}>{contact.action.label}</a></Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* FAQ with Categories */

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export interface FaqWithCategoriesProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: FaqHeader;
  /** Topics with their questions; use past ten questions. */
  categories?: FaqCategory[];
  defaultCategory?: string;
  /** The help card under the topics; null hides it. */
  help?: FaqContact | null;
}

const categories: FaqCategory[] = [
  {
    id: 'billing',
    title: 'Billing and plans',
    items: [
      { question: 'Can I change plans in the middle of a billing period?', answer: 'Yes. Upgrades apply right away and we charge only for the days left. Downgrades apply at the next renewal, so you keep what you already paid for.' },
      { question: 'Do you charge VAT?', answer: 'Prices are in EUR excluding VAT. We add VAT for customers in the EU without a valid VAT number.' },
      { question: 'Which payment methods do you accept?', answer: 'Cards, SEPA direct debit and bank transfer for yearly plans.' },
      { question: 'What happens if a payment fails?', answer: 'We retry three times over seven days and email the billing contact each time. Nothing is locked during that week.' },
      { question: 'Can I get a refund on an annual plan?', answer: 'Yes, for the unused months, within the first 60 days.' },
    ],
  },
  {
    id: 'invoices',
    title: 'Invoices and payments',
    items: [
      { question: 'Can clients pay by card?', answer: 'Yes. Every invoice email has a payment link for card and bank payments.' },
      { question: 'Can I send invoices in other languages?', answer: 'Yes, in 6 languages, chosen per client.' },
      { question: 'Do reminders go out on their own?', answer: 'Yes, on the schedule you set, and they stop when the invoice is paid.' },
    ],
  },
  {
    id: 'approvals',
    title: 'Approvals',
    items: [
      { question: 'Can approvals depend on the amount?', answer: 'Yes. Set thresholds per entity and per cost center.' },
      { question: 'Can I approve from my phone?', answer: 'Yes, from the email or the mobile app.' },
    ],
  },
  {
    id: 'accounts',
    title: 'Accounts and security',
    items: [
      { question: 'Do you support single sign-on?', answer: 'Yes: Okta, Microsoft Entra ID and Google Workspace.' },
      { question: 'Is there an audit log?', answer: 'Yes, every view and change, kept for seven years.' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    items: [{ question: 'Which accounting tools do you sync with?', answer: 'The common accounting tools in the EU, every hour; CSV export for the rest.' }],
  },
  {
    id: 'data',
    title: 'Data and privacy',
    items: [
      { question: 'Where is my data stored?', answer: 'In the EU (Frankfurt), encrypted at rest and in transit.' },
      { question: 'Can I export everything?', answer: 'Yes, at any time, and for 90 days after you cancel.' },
    ],
  },
];

function FaqWithCategories({
  header = { overline: 'FAQ', title: 'Questions, sorted by topic', description: 'Pick a topic. If your question is not here, our team answers within four hours on weekdays.' },
  categories: cats = categories,
  defaultCategory,
  help = { title: 'Still stuck?', description: 'Chat with a finance specialist, Monday to Friday, 8:00 to 20:00 CET.', action: { label: 'Contact support', href: '#support' } },
  className,
  ...props
}: FaqWithCategoriesProps) {
  const titleId = React.useId();
  const base = React.useId().replace(/:/g, '');
  const [active, setActive] = React.useState(defaultCategory ?? cats[0]?.id ?? '');
  const current = cats.find(c => c.id === active) ?? cats[0];
  const headingId = (id: string) => `${base}-faq-${id}`;
  return (
    <section data-slot="faq-with-categories" aria-labelledby={titleId} className={cn(shell, 'bg-background', className)} {...props}>
      <div className={inner}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <div data-slot="faq-categories-row" className="flex w-full min-w-0 flex-col gap-10 @5xl:flex-row @5xl:items-start @5xl:gap-16">
          <div data-slot="faq-categories-aside" className="flex min-w-0 flex-col gap-6 @5xl:w-64 @5xl:shrink-0">
            <TableOfContents title="Topics">
              <TableOfContentsList>
                {cats.map(c => (
                  <TableOfContentsItem
                    key={c.id}
                    href={`#${headingId(c.id)}`}
                    active={c.id === current?.id}
                    onClick={e => {
                      e.preventDefault();
                      setActive(c.id);
                    }}
                  >
                    {c.title}
                  </TableOfContentsItem>
                ))}
              </TableOfContentsList>
            </TableOfContents>
            {help ? (
              <div data-slot="faq-help" className="flex flex-col items-start gap-3 rounded-xl bg-[var(--card-muted)] p-5">
                <h3 className="m-0 text-sm leading-5 font-medium">{help.title}</h3>
                {help.description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{help.description}</p> : null}
                <Button asChild variant="outline" size="sm"><a href={help.action.href}>{help.action.label}</a></Button>
              </div>
            ) : null}
          </div>
          {current ? (
            <div data-slot="faq-categories-answers" className="flex min-w-0 flex-1 flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <h3 id={headingId(current.id)} tabIndex={-1} className="m-0 text-2xl leading-8 font-semibold tracking-tight outline-none">{current.title}</h3>
                <Badge variant="soft-neutral" shape="pill">{current.items.length} {current.items.length === 1 ? 'question' : 'questions'}</Badge>
              </div>
              <FaqAccordion key={current.id} items={current.items} accordionStyle="card" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export { Faq, FaqCentered, FaqGrid, FaqWithCategories };
