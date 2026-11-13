// EGG UI blocks, BLOCKS / Content page (138:2), Article and Prose family: Block / Article (138:209),
// Content with Image (812:136113), Legal Page (812:135946), Document with Comments (1023:5577),
// Article Paywall (1110:6533, Type metered, registration, hard).
// Reading column 672 (Legal 720) with Prose (body/default 16/28); one h1 per page, h2 sections.
// Columns follow the block's own width (container queries): the Table of Contents sits on the right
// of an article from 1200, the legal side columns from 1024, the comments panel beside the document
// from 1024; below that they stack.
// Built from Badge, Byline, Image Placeholder, Prose, Quote, Code Block, Alert, Table of Contents,
// Image Figure, Header Simple, Separator, Breadcrumb, Page Header, Presence Bar, the Editor parts
// (Rich Text Editor, Selection Toolbar, Comment Highlight, Comments Panel, Comment Thread, Comment,
// Comment Composer) and the Pricing parts (Paywall Card, Plan Options, Lock Badge, Inline Form).
// Guide: eggux build-ui/patterns/content-and-docs.md (Rules, Paid content, Legal and policy pages).
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Download, MessageSquare, Share2 } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Alert } from './alert';
import { Badge } from './badge';
import { Breadcrumb } from './breadcrumb';
import { Button } from './button';
import { Byline } from './byline';
import { CodeBlock } from './code-block';
import { Comment, CommentComposer, CommentHighlight, CommentsPanel, CommentThread, RichTextEditor, SelectionToolbar } from './editor';
import { ImagePlaceholder } from './image-placeholder';
import { ImageFigure } from './imagery';
import { InlineForm } from './inline-form';
import { HeaderSimple } from './page-header-blocks';
import { PageHeader } from './page-header';
import { PresenceBar, type PresencePerson } from './presence-bar';
import { LockBadge, PaywallCard, PlanFeature, PlanOptions, type PlanOption } from './pricing';
import { Prose, ProseHeading, ProseList, ProseListItem, ProseParagraph } from './prose';
import { Quote } from './quote';
import { SectionHeader } from './section-header-block';
import { Separator } from './separator';
import { TableOfContents, TableOfContentsItem, TableOfContentsList } from './table-of-contents';
import { TooltipProvider } from './tooltip';

const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');

/** Badge (secondary) + "date · reading time" caption: the meta row above an article title. */
function ArticleMeta({ category, date, dateTime, readingTime }: { category?: string; date: string; dateTime?: string; readingTime?: string }) {
  return (
    <p data-slot="article-meta" className="m-0 flex flex-wrap items-center gap-2">
      {category ? <Badge variant="secondary">{category}</Badge> : null}
      <span className="text-xs leading-4 text-muted-foreground"><time dateTime={dateTime}>{date}</time>{readingTime ? ` · ${readingTime}` : null}</span>
    </p>
  );
}

const h1Class = 'm-0 w-full text-4xl leading-10 font-extrabold tracking-[-0.4px] text-foreground [overflow-wrap:anywhere]';
const leadClass = 'm-0 w-full text-xl leading-7 text-pretty text-muted-foreground';

/* Article */

export interface ArticleProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  category?: string;
  date?: string;
  dateTime?: string;
  readingTime?: string;
  title?: string;
  lead?: string;
  author?: { name: string; role?: string; src?: string; href?: string };
  showImage?: boolean;
  image?: string;
  imageAlt?: string;
  /** Figma Table of Contents on the right (from 1200 wide). */
  showToc?: boolean;
}

/**
 * Block / Article: the reading column (672) between a 224 spacer and a 224 Table of Contents.
 * Meta row, h1, lead, Byline lg, a 16:9 cover and the Prose body (h2 sections, a Quote, a list, a
 * Code Block and an info Alert).
 */
function Article({
  category = 'Product',
  date = '12 Oct 2026',
  dateTime = '2026-10-12',
  readingTime = '6 min read',
  title = 'How we cut onboarding time in half with checklists',
  lead = 'Three changes to the first-run experience, the data behind them, and what we would do differently next time.',
  author = { name: 'Maria Ilie', role: 'Product designer' },
  showImage = true,
  image,
  imageAlt = '',
  showToc = true,
  className,
  ...props
}: ArticleProps) {
  const id = React.useId();
  const h = (s: string) => `${id}-${s}`.replace(/:/g, '');
  const headings = [
    { id: h('why'), label: 'Why checklists work' },
    { id: h('changed'), label: 'What we changed' },
    { id: h('measure'), label: 'How we measured it', level: 2 as const },
  ];
  return (
    <TooltipProvider delayDuration={0}>
      <div className="@container w-full bg-background text-foreground">
        <div
          data-slot="article-layout"
          className={cn(
            'mx-auto grid w-full max-w-[1200px] grid-cols-1 justify-center gap-12 px-6 py-12',
            '@5xl:grid-cols-[minmax(0,672px)_224px] @[75rem]:grid-cols-[224px_672px_224px] @[75rem]:justify-between @[75rem]:gap-0',
          )}
        >
          <div aria-hidden="true" className="hidden @[75rem]:block" />
          <article aria-labelledby={h('title')} data-slot="article" className={cn('mx-auto flex w-full max-w-[672px] min-w-0 flex-col items-start gap-6', className)} {...props}>
            <ArticleMeta category={category} date={date} dateTime={dateTime} readingTime={readingTime} />
            <h1 id={h('title')} className={h1Class}>{title}</h1>
            {lead ? <p className={leadClass}>{lead}</p> : null}
            <Byline size="lg" name={author.name} description={author.role} href={author.href} avatar={{ initials: initialsOf(author.name), src: author.src }} />
            {showImage ? <ImagePlaceholder ratio="16:9" src={image} alt={imageAlt} className="w-full rounded-lg" /> : null}
            <Prose>
              <ProseHeading id={h('why')}>Why checklists work</ProseHeading>
              <ProseParagraph>New users do not read; they try. A checklist turns the first session into a short list of wins, each one teaching a piece of the product by doing it.</ProseParagraph>
              <ProseParagraph>We kept the list to four steps, each finished in under two minutes, and we let people skip any of them.</ProseParagraph>
              <Quote quote="The best onboarding is the product itself, with the next step always visible." by={{ name: 'Maria Ilie', role: 'Head of Finance Operations, Acme', initials: 'MI' }} />
              <ProseHeading id={h('changed')}>What we changed</ProseHeading>
              <ProseList>
                <ProseListItem>One highlighted next step instead of five equal ones.</ProseListItem>
                <ProseListItem>Steps complete automatically when done anywhere in the app.</ProseListItem>
                <ProseListItem>A dismiss button that moves the list to Help.</ProseListItem>
              </ProseList>
              <ProseHeading id={h('measure')} level={3}>How we measured it</ProseHeading>
              <ProseParagraph>Every finished step sends one event with the step and the time it took:</ProseParagraph>
              <CodeBlock language="ts" code="track('onboarding_step_done', { step, ms })" label="Tracking call for a finished step" />
              <Alert variant="info" title="Measure before you change" description="Track time to first value for two weeks before and after, on new accounts only." />
            </Prose>
          </article>
          {showToc ? (
            <aside aria-label="Table of contents" className="hidden @5xl:block">
              <div className="sticky top-20"><TableOfContents items={headings} /></div>
            </aside>
          ) : null}
        </div>
      </div>
    </TooltipProvider>
  );
}

/* Content with Image */

export interface ContentWithImageProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  lead?: string;
  /** Figma pull Quote (one at most). */
  showQuote?: boolean;
  caption?: string;
  credit?: string;
  image?: string;
  imageAlt?: string;
  /** Image on the left instead of the right. */
  imageFirst?: boolean;
}

/** Block / Content with Image: one idea explained with a picture. Text column (544: overline, h2, lead, paragraphs, a pull Quote) and an Image Figure (4:3, caption and credit), 64 apart. */
function ContentWithImage({
  overline = 'Our approach',
  title = 'Built in small teams, shipped every week',
  lead = 'Every part of Acme is owned by a team of five or six people: a designer, engineers and someone who talks to customers every week.',
  showQuote = true,
  caption = 'Planning the spring release in the Lisbon office',
  credit = 'Photo: Acme',
  image,
  imageAlt = 'Six people around a table with laptops, planning the spring release',
  imageFirst = false,
  className,
  ...props
}: ContentWithImageProps) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} data-slot="content-with-image" className={cn('@container w-full bg-background text-foreground', className)} {...props}>
      <div data-slot="section-container" className="mx-auto w-full max-w-[1200px] px-6 py-16 @3xl:py-24">
        <div data-slot="content-with-image-row" className="grid grid-cols-1 items-start gap-12 @5xl:grid-cols-2 @5xl:gap-16">
          <div data-slot="content-with-image-text" className="flex min-w-0 flex-col gap-6">
            <SectionHeader titleId={id} align="left" overline={overline} title={title} className="max-w-none" />
            {lead ? <p className={leadClass}>{lead}</p> : null}
            <p className="m-0 text-base leading-7">Teams plan in two-week cycles and ship behind feature flags, so a change reaches 5% of workspaces first. We watch support tickets and error rates for three days before we open it to everyone.</p>
            {showQuote ? (
              <Quote
                variant="pull"
                quote="We would rather ship a small thing on Tuesday than a big thing next quarter. Customers tell us what is missing faster than any roadmap can."
                by={{ name: 'Ioana Marin', role: 'Head of Product, Acme', initials: 'IM' }}
              />
            ) : null}
            <p className="m-0 text-base leading-7">The result last year: 48 releases, a median of 2 days from merge to production, and fewer than 0.2% of releases rolled back.</p>
          </div>
          <ImageFigure ratio="4:3" src={image} alt={imageAlt} caption={caption} credit={credit} className={cn(imageFirst && '@5xl:order-first')} />
        </div>
      </div>
    </section>
  );
}

/* Legal Page */

export interface LegalSection { id: string; title: string; body: React.ReactNode }

export interface LegalPageProps extends React.ComponentProps<'div'> {
  title?: string;
  description?: string;
  updated?: string;
  updatedDateTime?: string;
  /** The short-version Alert at the top. */
  summary?: string;
  sections?: LegalSection[];
  /** Footer note: contact and previous version. */
  note?: React.ReactNode;
  /** Figma "Other policies" Table of Contents on the right. */
  otherPolicies?: { label: string; href: string }[];
  onDownload?: () => void;
}

const legalSections: LegalSection[] = [
  { id: 'who-we-are', title: 'Who we are', body: <ProseParagraph>Acme Software SRL, Strada Lipscani 12, 030031 Bucharest, Romania, is the controller of the personal data described in this policy. Our data protection officer is reachable at <a href="mailto:privacy@acme.com">privacy@acme.com</a>.</ProseParagraph> },
  {
    id: 'data-we-collect', title: 'Data we collect', body: (
      <>
        <ProseParagraph>We collect three kinds of data:</ProseParagraph>
        <ProseList>
          <ProseListItem>Account data: name, work email, company and role, given when you sign up.</ProseListItem>
          <ProseListItem>Usage data: pages viewed, features used and device type, collected with the cookies you accept.</ProseListItem>
          <ProseListItem>Customer data: projects, invoices and files you store in Acme. We process it only on your instructions.</ProseListItem>
        </ProseList>
      </>
    ),
  },
  { id: 'how-we-use-data', title: 'How we use your data', body: <ProseParagraph>We use account and usage data to provide the service, keep it secure, send service emails and, only if you opt in, product news. Our legal bases are the contract with you, our legitimate interest in a secure service, and your consent for marketing.</ProseParagraph> },
  { id: 'sharing', title: 'Sharing and transfers', body: <ProseParagraph>We share data only with the subprocessors listed on our <a href="#subprocessors">Subprocessors</a> page, for example hosting in Frankfurt (EU) and email delivery. Every subprocessor signs a data processing agreement. We do not sell personal data.</ProseParagraph> },
  { id: 'retention', title: 'Retention', body: <ProseParagraph>We keep account data while your account is active and for 30 days after you close it. Invoices are kept for 10 years, as accounting law requires. Backups are deleted after 35 days.</ProseParagraph> },
  { id: 'your-rights', title: 'Your rights', body: <ProseParagraph>You can access, correct, export or delete your data, object to processing and withdraw consent at any time. Most of this works in Settings, Privacy and data; for the rest, write to <a href="mailto:privacy@acme.com">privacy@acme.com</a> and we reply within 30 days. You can also complain to your national data protection authority.</ProseParagraph> },
  { id: 'changes', title: 'Changes to this policy', body: <ProseParagraph>When we change this policy we update the date above and, for material changes, email account owners 30 days in advance.</ProseParagraph> },
];

const otherPoliciesDefault = [
  { label: 'Terms of service', href: '#terms' },
  { label: 'Cookie policy', href: '#cookies' },
  { label: 'Subprocessors', href: '#subprocessors' },
  { label: 'Security', href: '#security' },
  { label: 'Acceptable use', href: '#acceptable-use' },
];

/**
 * Block / Legal Page: Header Simple (breadcrumb, h1, description, last updated), then a 192 Table of
 * Contents with "Download PDF", the 720 reading column (short-version Alert, numbered h2 sections,
 * the contact note) and a 192 "Other policies" list, 24 apart.
 */
function LegalPage({
  title = 'Privacy policy',
  description = 'How Acme collects, uses and protects your data.',
  updated = '21 Oct 2026',
  updatedDateTime = '2026-10-21',
  summary = 'We collect only what we need to run Acme, we never sell your data, and you can export or delete it any time in Settings, Privacy and data.',
  sections = legalSections,
  note = <>Questions about this policy? Write to <a href="mailto:privacy@acme.com">privacy@acme.com</a>. Previous version: 3 March 2026.</>,
  otherPolicies = otherPoliciesDefault,
  onDownload,
  className,
  ...props
}: LegalPageProps) {
  const id = React.useId().replace(/:/g, '');
  const sid = (s: string) => `${id}-${s}`;
  const toc = sections.map(s => ({ id: sid(s.id), label: s.title }));
  return (
    <TooltipProvider delayDuration={0}>
      <div data-slot="legal-page" className={cn('@container w-full bg-background pb-24 text-foreground', className)} {...props}>
        <HeaderSimple
          title={title}
          description={description}
          updated={updated}
          updatedDateTime={updatedDateTime}
          breadcrumb={[{ label: 'Home', href: '#home' }, { label: 'Legal', href: '#legal' }, { label: title }]}
        />
        <div data-slot="legal-body" className="mx-auto mt-8 grid w-full max-w-[1200px] grid-cols-1 gap-12 px-6 @5xl:grid-cols-[192px_minmax(0,720px)_192px] @5xl:justify-between @5xl:gap-6">
          <div data-slot="legal-toc" className="flex min-w-0 flex-col items-start gap-6">
            <TableOfContents items={toc} className="@5xl:sticky @5xl:top-20" />
            <Button variant="outline" size="sm" leadingIcon={<Download />} onClick={onDownload}>Download PDF</Button>
          </div>
          <article aria-label={title} data-slot="legal-content" className="flex min-w-0 flex-col gap-8">
            <div className="flex flex-col gap-6">
              {summary ? <Alert variant="info" alertStyle="soft" title="The short version" description={summary} /> : null}
              <Prose>
                {sections.map((s, i) => (
                  <React.Fragment key={s.id}>
                    <ProseHeading id={sid(s.id)}>{i + 1}. {s.title}</ProseHeading>
                    {s.body}
                  </React.Fragment>
                ))}
              </Prose>
            </div>
            {note ? (
              <div className="flex flex-col gap-4">
                <Separator />
                <p data-slot="legal-note" className="m-0 text-sm leading-5 text-muted-foreground [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4">{note}</p>
              </div>
            ) : null}
          </article>
          {otherPolicies.length ? (
            <TableOfContents data-slot="legal-related" title="Other policies" className="h-fit">
              <TableOfContentsList>
                {otherPolicies.map(p => <TableOfContentsItem key={p.href} href={p.href}>{p.label}</TableOfContentsItem>)}
              </TableOfContentsList>
            </TableOfContents>
          ) : null}
        </div>
      </div>
    </TooltipProvider>
  );
}

/* Document with Comments */

export interface DocumentWithCommentsProps extends React.ComponentProps<'section'> {
  title?: string;
  description?: string;
  /** Figma Comments Panel (Show close: the panel can be closed and reopened from the header). */
  showComments?: boolean;
  /** The Selection Toolbar over the selected words. */
  showSelectionToolbar?: boolean;
}

const presence: PresencePerson[] = [
  { name: 'Ana Popescu', location: 'editing Scope' },
  { name: 'Radu Marin', location: 'reading Timeline' },
  { name: 'Mara Ionescu', location: 'commenting in Payment terms' },
  { name: 'Sofia Barbu', location: 'reading Scope', idle: true },
];

const documentHtml = renderToStaticMarkup(
  <>
    <p>Owner: Ana Popescu · Reviewers: Radu Marin, you</p>
    <p><CommentHighlight state="selected">Launch the new invoicing flow</CommentHighlight> to all Acme workspaces in Q4. Customers create, send and track invoices in one place, and finance teams get paid faster.</p>
    <h2>2. Scope</h2>
    <p>The release covers recurring invoices, payment reminders and the new PDF template. <CommentHighlight>Multi-currency stays in beta</CommentHighlight> and ships to selected workspaces only.</p>
    <ul>
      <li>Recurring invoices with monthly and yearly schedules</li>
      <li>Automatic reminders 3 and 7 days after the due date</li>
      <li>New PDF template with the workspace logo</li>
    </ul>
    <h2>3. Timeline</h2>
    <p>The beta starts on 16 September with 40 workspaces. <CommentHighlight state="active">The launch moves to 14 October</CommentHighlight>, after the help center and the support training are ready.</p>
    <p>Marketing announces the release in the product newsletter on launch day and in a webinar the week after.</p>
    <h2>4. Payment terms</h2>
    <p>Invoices created in the new flow default to <CommentHighlight>payment within 30 days of the invoice date</CommentHighlight>. Workspaces can change the default in Settings, Billing.</p>
    <h2>5. Success and risks</h2>
    <p>Success means 60% of active workspaces send at least one invoice with the new flow in the first month, with fewer than 2% of invoices reported as wrong.</p>
    <p>Support load may grow in the first two weeks. We add a banner with a link to the guide and two more people on the chat.</p>
  </>,
);

/**
 * Block / Document with Comments: Breadcrumb and Page Header (h1, "Edited … · Saved", Presence Bar,
 * comments count and Share), the document in a Rich Text Editor (800 max, 32 padding) with a
 * Selection Toolbar over the selected words and Comment Highlights, and the 360 Comments Panel.
 */
function DocumentWithComments({
  title = 'Q4 launch brief',
  description = 'Edited 5 min ago by Ana Popescu · Saved',
  showComments: showProp = true,
  showSelectionToolbar = true,
  className,
  ...props
}: DocumentWithCommentsProps) {
  const id = React.useId();
  const [open, setOpen] = React.useState(showProp);
  const [filter, setFilter] = React.useState<'open' | 'resolved'>('open');
  React.useEffect(() => setOpen(showProp), [showProp]);
  return (
    <TooltipProvider delayDuration={0}>
      <section aria-labelledby={id} data-slot="document-with-comments" className={cn('@container flex w-full flex-col bg-background text-foreground', className)} {...props}>
        <div data-slot="document-header" className="flex flex-col gap-3 border-b border-border px-4 py-6 @3xl:px-8">
          <Breadcrumb items={[{ label: 'Documents', href: '#documents' }, { label: 'Launch', href: '#launch' }, { label: title }]} />
          <PageHeader
            title={<span id={id}>{title}</span>}
            description={description}
            actions={(
              <>
                <PresenceBar people={presence} className="hidden @3xl:flex" />
                <Button variant="outline" leadingIcon={<MessageSquare />} aria-label="3 open comments" aria-pressed={open} onClick={() => setOpen(o => !o)}>3</Button>
                <Button leadingIcon={<Share2 />}>Share</Button>
              </>
            )}
          />
        </div>
        <div data-slot="document-body" className="flex flex-col @5xl:flex-row">
          <div data-slot="document-area" className="flex min-w-0 flex-1 justify-center p-4 @3xl:p-8">
            <div className="relative w-full max-w-[800px]">
              <RichTextEditor
                label={title}
                defaultValue={documentHtml}
                showFooter={false}
                className={cn(
                  'w-full',
                  '[&_[data-slot=rich-text-editor-content]]:gap-4 [&_[data-slot=rich-text-editor-content]]:p-6 [&_[data-slot=rich-text-editor-content]]:text-base [&_[data-slot=rich-text-editor-content]]:leading-7',
                  '[&_[data-slot=rich-text-editor-content]_h2]:m-0 [&_[data-slot=rich-text-editor-content]_h2]:text-xl [&_[data-slot=rich-text-editor-content]_h2]:leading-7 [&_[data-slot=rich-text-editor-content]_h2]:font-semibold',
                )}
              />
              {showSelectionToolbar ? <SelectionToolbar className="absolute top-[92px] left-6 z-10 hidden @3xl:flex" /> : null}
            </div>
          </div>
          {open ? (
            <CommentsPanel
              openCount={3}
              resolvedCount={1}
              filter={filter}
              onFilterChange={setFilter}
              onFilterMenu={() => {}}
              onClose={() => setOpen(false)}
              className="h-auto w-full border-t border-l-0 @5xl:w-90 @5xl:shrink-0 @5xl:border-t-0 @5xl:border-l"
            >
              {filter === 'open' ? (
                <>
                  <CommentThread quote="Multi-currency stays in beta">
                    <Comment name="Sofia Barbu" time="3 h ago" dateTime="2026-11-13T09:10" showActions={false}>Which workspaces get the beta? Can we list them in this section?</Comment>
                  </CommentThread>
                  <CommentThread quote="The launch moves to 14 October" state="active" composer={<CommentComposer initials="EM" />}>
                    <Comment name="Radu Marin" time="20 min ago" dateTime="2026-11-13T11:50" showActions={false}>Can we keep 7 October and ship the help center a week later?</Comment>
                  </CommentThread>
                  <CommentThread quote="payment within 30 days of the invoice date">
                    <Comment name="Mara Ionescu" time="yesterday" dateTime="2026-11-12T15:00" showActions={false}>Finance asked for 14 days for new customers. Should the default depend on the plan?</Comment>
                    <Comment name="Ana Popescu" type="reply" time="2 h ago" dateTime="2026-11-13T10:05" showActions={false}>Plan based defaults sound good. I will draft the rule.</Comment>
                    <Comment name="Sofia Barbu" type="reply" time="1 h ago" dateTime="2026-11-13T11:02" showActions={false}><a href="#elena-marin">@Elena Marin</a> can you confirm with finance before Friday?</Comment>
                  </CommentThread>
                </>
              ) : (
                <CommentThread quote="New PDF template with the workspace logo" state="resolved" resolvedBy="Resolved by Ana Popescu · 2 d ago" />
              )}
            </CommentsPanel>
          ) : null}
        </div>
      </section>
    </TooltipProvider>
  );
}

/* Article Paywall */

export type ArticlePaywallType = 'metered' | 'registration' | 'hard';

export interface ArticlePaywallProps extends React.ComponentProps<'div'> {
  /** Figma Type: metered (free reads used up), registration (free account), hard (subscribers only). */
  type?: ArticlePaywallType;
  /** The publication's wordmark in the card. */
  publication?: string;
  onSubscribe?: () => void;
  onSignIn?: () => void;
  onRegister?: (email: string) => void;
}

const paywallPlans: PlanOption[] = [
  { value: 'yearly', name: 'Yearly', price: '€49.99 per year', equivalent: '€4.17 per month', saving: 'Save 36%' },
  { value: 'monthly', name: 'Monthly', price: '€6.49 per month' },
];

const paywallCopy: Record<ArticlePaywallType, { title: string; description: string; benefits: string[]; finePrint: string }> = {
  metered: {
    title: 'You have read your 3 free articles this month',
    description: 'Subscribe for unlimited reading, or come back on 1 December for 3 more free articles.',
    benefits: ['Unlimited articles on web and app', 'The morning briefing and all newsletters', 'The full archive since 1998'],
    finePrint: 'Yearly €49.99 per year or monthly €6.49 per month, VAT included. Renews automatically until you cancel. Cancel anytime in Account settings.',
  },
  registration: {
    title: 'Create a free account to keep reading',
    description: 'Free accounts get 5 articles a month and the morning briefing. No card needed.',
    benefits: ['5 free articles every month', 'The morning briefing by email', 'Save articles to read later'],
    finePrint: 'Free account, no card needed. By continuing you agree to the Terms and the Privacy Policy.',
  },
  hard: {
    title: 'This article is for subscribers',
    description: 'Subscribe to read the full story and everything else in Northbeam Daily.',
    benefits: ['Unlimited articles on web and app', 'The morning briefing and all newsletters', 'The full archive since 1998'],
    finePrint: 'Yearly €49.99 per year or monthly €6.49 per month, VAT included. Renews automatically until you cancel. Cancel anytime in Account settings.',
  },
};

/**
 * Block / Article Paywall: the free preview of a paid article (meta, h1, lead, Byline and two
 * paragraphs fading into the page, 672 column) and the Paywall Card (560) for its Type.
 */
function ArticlePaywall({ type = 'metered', publication = 'Northbeam Daily', onSubscribe, onSignIn, onRegister, className, ...props }: ArticlePaywallProps) {
  const id = React.useId();
  const [plan, setPlan] = React.useState('yearly');
  const copy = paywallCopy[type];
  const logo = <span className="font-serif text-2xl leading-8 text-card-foreground">{publication}</span>;
  return (
    <div data-slot="article-paywall" data-type={type} className={cn('@container w-full bg-background text-foreground', className)} {...props}>
      <div className="mx-auto flex w-full max-w-[704px] flex-col items-center gap-6 px-4 pt-16 pb-24">
        <article aria-labelledby={id} data-slot="article-paywall-preview" className="flex w-full min-w-0 flex-col items-start gap-6">
          <ArticleMeta category="Cities" date="28 Oct 2026" dateTime="2026-10-28" readingTime="7 min read" />
          <h1 id={id} className={h1Class}>How four cities cut summer heat by redesigning their streets</h1>
          <p className={leadClass}>Pale stone, canvas sails and fountains that switch on at 35 degrees: what the first year of data shows.</p>
          <Byline name="Lena Hart" description="Climate reporter" />
          <div className="relative w-full">
            <Prose className="max-w-none">
              <ProseParagraph>When the temperature in Seville passed 44 degrees last July, the coolest street in the old town was not the one with the most trees. It was a narrow lane where the city had replaced dark asphalt with pale stone and stretched canvas sails between the rooftops.</ProseParagraph>
              <ProseParagraph>Across Europe, city planners are borrowing these old ideas and testing them with new sensors. The results from four pilot projects, shared ahead of publication, suggest that small changes can lower street temperatures by up to 6 degrees on the hottest afternoons.</ProseParagraph>
            </Prose>
            <div aria-hidden="true" data-slot="article-paywall-fade" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
          </div>
        </article>
        <PaywallCard
          type={type}
          className="max-w-[560px] min-w-0"
          logo={type === 'hard' ? <>{logo}<LockBadge label="Subscribers" tone="brand" /></> : logo}
          title={copy.title}
          description={copy.description}
          benefits={copy.benefits.map(b => <PlanFeature key={b} stateText={{ check: 'Included: ' }}>{b}</PlanFeature>)}
          plans={type === 'registration' ? (
            <div className="flex flex-col gap-4">
              <InlineForm label="Email address" placeholder="name@company.com" buttonLabel="Continue" hint="We email you a sign-in link. No password needed." onSubmit={v => onRegister?.(v)} />
              <Separator label="or" />
            </div>
          ) : (
            <PlanOptions label="Billing" value={plan} onValueChange={setPlan} options={paywallPlans} />
          )}
          action={type === 'registration' ? <Button variant="outline" size="lg">Continue with Google</Button> : <Button size="lg" onClick={onSubscribe}>Subscribe</Button>}
          onSignIn={onSignIn ?? (() => {})}
          finePrint={copy.finePrint}
        />
      </div>
    </div>
  );
}

export { Article, ArticlePaywall, ContentWithImage, DocumentWithComments, LegalPage };
