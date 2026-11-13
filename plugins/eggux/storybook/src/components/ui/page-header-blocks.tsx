// EGG UI blocks, BLOCKS / Page Headers page (361:766): Block / Header Detail (361:767), Header
// Listing (361:919), Header Search Results (361:985), Header Profile (361:1037), Header Event
// (361:1088), Header Topic (361:1190), Header Report (361:1274), Header Simple (361:1313).
// The top of an inner page, right under the Navbar, by page type (guide: build-ui/patterns/
// marketing-pages.md § Page headers). One h1 each, one primary action at most.
// Shared layout: a full-width band (background/default; Report on section/muted-background), 64 px
// top and bottom (Search Results, Profile, Topic 48; 48 on narrow screens), a 1152 container
// centered (1440 frame: 144 each side), 16 / 32 px gutters below that. Detail, Event and Report
// actions are lg Buttons (40) in an Action Bar; Profile and Topic use the default size. Title heading/h1 (36/40
// extra bold, -0.4), lead body/lead (20/28 muted), 12 apart; text column items 24 apart.
// Two-column blocks (Detail 520 media, Listing 400, Event 520, Report 360 figures) sit 48 apart
// from 1024 px of container width and stack under it. Container queries, not viewport media
// queries, so a block follows the column it is put in.
// A11y: each block is a <section> named by its h1 (aria-labelledby). Breadcrumbs are nav landmarks,
// tags are lists, the type switch is a radio group, the query a search landmark, sort a combobox,
// result types tabs. Media is decorative unless an alt text is given.
import * as React from 'react';
import { ArrowRight, Bell, Calendar, Download, Globe, Link as LinkIcon, MapPin, Phone, Plus } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ActionBar } from './action-bar';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { BadgeList } from './badge-list';
import { Breadcrumb, type BreadcrumbEntry } from './breadcrumb';
import { Button } from './button';
import { Chip } from './chip';
import { ChipGroup } from './chip-group';
import { Figure } from './figure';
import { ImagePlaceholder, type ImageRatio } from './image-placeholder';
import { MetaItem } from './meta-item';
import { SearchField } from './search-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

/* Shared parts */

export interface HeaderAction {
  label: string;
  /** A link when set, else a button. */
  href?: string;
  onClick?: () => void;
}

export interface HeaderPerson {
  name: string;
  /** Two letters; taken from the name when left out. */
  initials?: string;
  /** Photo URL (a sample from your own assets; never an external URL in the kit). */
  src?: string;
}

type SectionProps = Omit<React.ComponentProps<'section'>, 'title' | 'children'>;

const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');

function HeaderBand({ titleId, muted, compact, className, children, ...props }: SectionProps & { titleId: string; muted?: boolean; compact?: boolean; children: React.ReactNode }) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn('@container w-full', muted ? 'bg-[var(--section-muted-background)]' : 'bg-background', className)}
      {...props}
    >
      <div data-slot="page-header-band" className={cn('flex w-full justify-center px-4 py-12 @3xl:px-8', !compact && '@3xl:py-16')}>
        <div data-slot="page-header-container" className="flex w-full max-w-[1152px] min-w-0 flex-col">{children}</div>
      </div>
    </section>
  );
}

function HeaderTitle({ id, title, lead, center, className }: { id: string; title: React.ReactNode; lead?: React.ReactNode; center?: boolean; className?: string }) {
  return (
    <div data-slot="page-header-heading" className={cn('flex w-full min-w-0 flex-col gap-3', center && 'items-center text-center', className)}>
      <h1 id={id} className="m-0 w-full text-4xl leading-10 font-extrabold tracking-[-0.4px] text-balance text-foreground [overflow-wrap:anywhere]">{title}</h1>
      {lead ? <p className="m-0 w-full text-xl leading-7 text-pretty text-muted-foreground [overflow-wrap:anywhere]">{lead}</p> : null}
    </div>
  );
}

function ActionButton({ action, variant, size, leadingIcon, trailingIcon }: { action: HeaderAction; variant?: 'default' | 'outline'; size?: 'default' | 'lg'; leadingIcon?: React.ReactNode; trailingIcon?: React.ReactNode }) {
  if (action.href) {
    return (
      <Button asChild variant={variant} size={size}>
        <a href={action.href} onClick={action.onClick}>
          {leadingIcon}
          {action.label}
          {trailingIcon}
        </a>
      </Button>
    );
  }
  return <Button variant={variant} size={size} leadingIcon={leadingIcon} trailingIcon={trailingIcon} onClick={action.onClick}>{action.label}</Button>;
}

function People({ people, label, labelText }: { people: HeaderPerson[]; label?: string; labelText?: React.ReactNode }) {
  return (
    <AvatarGroup aria-label={label} label={labelText}>
      {people.map(p => <Avatar key={p.name} type={p.src ? 'image' : 'initials'} src={p.src} initials={p.initials ?? initialsOf(p.name)} name={p.name} />)}
    </AvatarGroup>
  );
}

function Media({ media, ratio, alt, className }: { media?: React.ReactNode; ratio: ImageRatio; alt?: string; className: string }) {
  return (
    <div data-slot="page-header-media" className={cn('w-full min-w-0 @5xl:shrink-0', className)}>
      {media ?? <ImagePlaceholder ratio={ratio} alt={alt} className="rounded-xl" />}
    </div>
  );
}

const twoColumns = 'flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:items-center';
const textColumn = 'flex w-full min-w-0 flex-1 flex-col items-start gap-6';

/* Header Detail */

export interface HeaderDetailProps extends SectionProps {
  breadcrumb?: BreadcrumbEntry[];
  /** Badges for type and scope (Badge List, 2 to 4). */
  tags?: string[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Who is behind it: Avatar Group with a label. */
  people?: HeaderPerson[];
  peopleLabel?: string;
  primaryAction?: HeaderAction;
  secondaryAction?: HeaderAction;
  /** Replaces the 4:3 Image Placeholder on the right (a Device Frame, a photo). */
  media?: React.ReactNode;
  /** Alt text of the default image; empty = decorative. */
  mediaAlt?: string;
  /** Figma Show media. */
  showMedia?: boolean;
}

function HeaderDetail({
  breadcrumb = [{ label: 'Data products', href: '#data-products' }, { label: 'Finance', href: '#finance' }, { label: 'Quarterly Revenue Forecast' }],
  tags = ['Dataset', 'Monthly', 'Europe'],
  title = 'Quarterly Revenue Forecast',
  description = 'Revenue forecasts by product line and region, updated monthly, with a 36-month outlook for budgeting and planning.',
  people = [{ name: 'Ana Popescu' }, { name: 'Mihai Ionescu' }, { name: 'Daniel Pop' }],
  peopleLabel = 'Maintained by 3 analysts in Finance and Operations',
  primaryAction = { label: 'Request access', href: '#request-access' },
  secondaryAction = { label: 'Download sample', href: '#download-sample' },
  media,
  mediaAlt,
  showMedia = true,
  ...props
}: HeaderDetailProps) {
  const id = React.useId();
  return (
    <HeaderBand data-slot="header-detail" titleId={id} {...props}>
      <div className={twoColumns}>
        <div className={textColumn}>
          {breadcrumb.length ? <Breadcrumb items={breadcrumb} /> : null}
          {tags.length ? <BadgeList items={tags.map(label => ({ label, variant: 'secondary' as const }))} max={4} label="Tags" /> : null}
          <HeaderTitle id={id} title={title} lead={description} />
          {people.length ? <People people={people} label="Maintainers" labelText={peopleLabel} /> : null}
          <ActionBar align="start">
            <ActionButton size="lg" action={primaryAction} trailingIcon={<ArrowRight aria-hidden="true" />} />
            {secondaryAction ? <ActionButton size="lg" action={secondaryAction} variant="outline" leadingIcon={<Download aria-hidden="true" />} /> : null}
          </ActionBar>
        </div>
        {showMedia ? <Media media={media} ratio="4:3" alt={mediaAlt} className="@5xl:w-[520px]" /> : null}
      </div>
    </HeaderBand>
  );
}

/* Header Listing */

export interface HeaderListingProps extends SectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** The type switch (Toggle Group outline); the first is "All". */
  types?: string[];
  type?: string;
  defaultType?: string;
  onTypeChange?: (type: string) => void;
  /** Name of the type switch. */
  typeLabel?: string;
  searchPlaceholder?: string;
  searchLabel?: string;
  /** Called on submit with the query and the selected type (search keeps the type). */
  onSearch?: (query: string, type: string) => void;
  showSearch?: boolean;
  media?: React.ReactNode;
  mediaAlt?: string;
  showMedia?: boolean;
}

function HeaderListing({
  title = 'Resources',
  description = 'Guides, reports and webinars on invoicing, payments and cash flow for finance teams.',
  types = ['All', 'Guides', 'Reports', 'Webinars'],
  type: typeProp,
  defaultType,
  onTypeChange,
  typeLabel = 'Resource type',
  searchPlaceholder = 'Search resources',
  searchLabel,
  onSearch,
  showSearch = true,
  media,
  mediaAlt,
  showMedia = true,
  ...props
}: HeaderListingProps) {
  const id = React.useId();
  const [innerType, setInnerType] = React.useState(defaultType ?? types[0] ?? '');
  const type = typeProp ?? innerType;
  const [query, setQuery] = React.useState('');
  return (
    <HeaderBand data-slot="header-listing" titleId={id} {...props}>
      <div className={twoColumns}>
        <div className={textColumn}>
          <HeaderTitle id={id} title={title} lead={description} />
          {types.length ? (
            <ToggleGroup
              type="single"
              variant="outline"
              aria-label={typeLabel}
              value={type}
              onValueChange={v => { if (!v) return; setInnerType(v); onTypeChange?.(v); }}
              className="max-w-full flex-wrap"
            >
              {types.map(t => <ToggleGroupItem key={t} value={t} label={t} />)}
            </ToggleGroup>
          ) : null}
          {showSearch ? (
            <form
              data-slot="page-header-search"
              className="flex w-full min-w-0 items-start gap-2"
              onSubmit={e => { e.preventDefault(); onSearch?.(query, type); }}
            >
              <SearchField placeholder={searchPlaceholder} label={searchLabel} value={query} onValueChange={setQuery} className="min-w-0 flex-1" />
              <Button type="submit" className="shrink-0">Search</Button>
            </form>
          ) : null}
        </div>
        {showMedia ? <Media media={media} ratio="4:3" alt={mediaAlt} className="@5xl:w-[400px]" /> : null}
      </div>
    </HeaderBand>
  );
}

/* Header Search Results */

export interface SearchResultType {
  value: string;
  label: string;
  count: number;
}

export interface HeaderSearchResultsProps extends SectionProps {
  /** The query, still editable. */
  query?: string;
  /** Total results, shown under the title. */
  count?: number;
  types?: SearchResultType[];
  type?: string;
  defaultType?: string;
  onTypeChange?: (type: string) => void;
  sortOptions?: { value: string; label: string }[];
  sort?: string;
  defaultSort?: string;
  onSortChange?: (sort: string) => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  /** The results list, rendered in the panel of the selected tab. */
  children?: React.ReactNode;
}

function HeaderSearchResults({
  query: queryProp = 'invoice reminders',
  count = 128,
  types = [
    { value: 'all', label: 'All', count: 128 },
    { value: 'guides', label: 'Guides', count: 64 },
    { value: 'help', label: 'Help articles', count: 40 },
    { value: 'templates', label: 'Templates', count: 24 },
  ],
  type: typeProp,
  defaultType,
  onTypeChange,
  sortOptions = [{ value: 'relevance', label: 'Most relevant' }, { value: 'newest', label: 'Newest first' }, { value: 'popular', label: 'Most read' }],
  sort,
  defaultSort = 'relevance',
  onSortChange,
  searchPlaceholder = 'Search the site',
  onSearch,
  children,
  ...props
}: HeaderSearchResultsProps) {
  const id = React.useId();
  const [query, setQuery] = React.useState(queryProp);
  React.useEffect(() => setQuery(queryProp), [queryProp]);
  const [innerType, setInnerType] = React.useState(defaultType ?? types[0]?.value ?? '');
  const type = typeProp ?? innerType;
  const nf = new Intl.NumberFormat('en-GB');
  return (
    <HeaderBand data-slot="header-search-results" titleId={id} compact {...props}>
      <div className="flex w-full min-w-0 flex-col gap-6">
        <form data-slot="page-header-search" className="flex w-full min-w-0 items-start gap-2" onSubmit={e => { e.preventDefault(); onSearch?.(query); }}>
          <SearchField placeholder={searchPlaceholder} label="Search the site" value={query} onValueChange={setQuery} className="min-w-0 flex-1" />
          <Button type="submit" className="shrink-0">Search</Button>
        </form>
        <div data-slot="page-header-summary" className="flex w-full min-w-0 flex-wrap items-end gap-4">
          <div className="flex min-w-60 flex-1 flex-col gap-1">
            <h1 id={id} className="m-0 text-3xl leading-9 font-semibold tracking-[-0.4px] text-foreground [overflow-wrap:anywhere]">Results for “{queryProp}”</h1>
            <p className="m-0 text-sm leading-5 text-muted-foreground">{nf.format(count)} {count === 1 ? 'result' : 'results'}</p>
          </div>
          {sortOptions.length ? (
            <Select value={sort} defaultValue={defaultSort} onValueChange={onSortChange}>
              <SelectTrigger aria-label="Sort results" className="w-60 max-w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : null}
        </div>
        {types.length ? (
          <Tabs variant="line" value={type} onValueChange={v => { setInnerType(v); onTypeChange?.(v); }}>
            <TabsList aria-label="Result types" overflow>
              {types.map(t => <TabsTrigger key={t.value} value={t.value} count={nf.format(t.count)} countLabel={`${nf.format(t.count)} results`}>{t.label}</TabsTrigger>)}
            </TabsList>
            <TabsContent value={type} tabIndex={children ? undefined : -1}>{children}</TabsContent>
          </Tabs>
        ) : null}
      </div>
    </HeaderBand>
  );
}

/* Header Profile */

export interface HeaderProfileFact {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

export interface HeaderProfileProps extends SectionProps {
  name?: string;
  /** Role and organization: "Head of Finance Operations · Acme". */
  role?: string;
  bio?: React.ReactNode;
  photo?: string;
  facts?: HeaderProfileFact[];
  /** Three counts (Figure inline). */
  counts?: { value: React.ReactNode; label: string }[];
  followAction?: HeaderAction;
  contactAction?: HeaderAction;
}

function HeaderProfile({
  name = 'Maria Ilie',
  role = 'Head of Finance Operations · Acme',
  bio = 'Leads the order-to-cash team. Writes about invoicing, collections and closing the books faster.',
  photo,
  facts = [
    { icon: <MapPin />, label: 'Berlin' },
    { icon: <Calendar />, label: 'Joined March 2021' },
    { icon: <LinkIcon />, label: 'acme.com/maria', href: '#maria' },
  ],
  counts = [{ value: 42, label: 'articles' }, { value: 18, label: 'talks' }, { value: 6, label: 'reports' }],
  followAction = { label: 'Follow' },
  contactAction = { label: 'Contact', href: '#contact' },
  ...props
}: HeaderProfileProps) {
  const id = React.useId();
  return (
    <HeaderBand data-slot="header-profile" titleId={id} compact {...props}>
      <div className="flex w-full min-w-0 flex-col items-start gap-6 @3xl:flex-row @3xl:gap-12">
        <Avatar size="xl" type={photo ? 'image' : 'initials'} src={photo} initials={initialsOf(name)} className="shrink-0" />
        <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-4">
          <h1 id={id} className="m-0 w-full text-4xl leading-10 font-extrabold tracking-[-0.4px] text-foreground [overflow-wrap:anywhere]">{name}</h1>
          {role ? <p className="m-0 text-lg leading-7 font-semibold text-foreground">{role}</p> : null}
          {bio ? <p className="m-0 max-w-3xl text-base leading-7 text-muted-foreground">{bio}</p> : null}
          {facts.length ? (
            <ul aria-label="Details" className="m-0 flex max-w-full list-none flex-wrap items-center gap-x-6 gap-y-2 p-0">
              {facts.map(f => (
                <li key={f.label} className="flex min-w-0">
                  {f.href ? (
                    <a href={f.href} className="min-w-0 rounded-sm outline-none hover:underline focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]">
                      <MetaItem icon={f.icon}>{f.label}</MetaItem>
                    </a>
                  ) : <MetaItem icon={f.icon}>{f.label}</MetaItem>}
                </li>
              ))}
            </ul>
          ) : null}
          {counts.length ? (
            <ul aria-label="Activity" className="m-0 flex list-none flex-wrap items-center gap-x-8 gap-y-2 p-0">
              {counts.map(c => <li key={c.label}><Figure layout="inline" value={c.value} label={c.label} /></li>)}
            </ul>
          ) : null}
        </div>
        <ActionBar align="start" className="w-auto shrink-0">
          {followAction ? <ActionButton action={followAction} leadingIcon={<Plus aria-hidden="true" />} /> : null}
          {contactAction ? <ActionButton action={contactAction} variant="outline" leadingIcon={<Phone aria-hidden="true" />} /> : null}
        </ActionBar>
      </div>
    </HeaderBand>
  );
}

/* Header Event */

export interface HeaderEventProps extends SectionProps {
  /** Format and price: "Webinar", "Online", "Free". */
  tags?: string[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Date and time with the time zone. */
  when?: string;
  /** Machine-readable start for <time>. */
  dateTime?: string;
  /** Place, or how to join online. */
  where?: string;
  online?: boolean;
  speakers?: HeaderPerson[];
  /** Names of the speakers as a line; built from `speakers` when left out. */
  speakersLabel?: string;
  /** After the date: the primary action becomes Watch the recording, no calendar button. */
  past?: boolean;
  registerAction?: HeaderAction;
  calendarAction?: HeaderAction;
  recordingAction?: HeaderAction;
  media?: React.ReactNode;
  mediaAlt?: string;
  showMedia?: boolean;
}

const joinNames = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);

function HeaderEvent({
  tags = ['Webinar', 'Online', 'Free'],
  title = 'Close the books in five days',
  description = 'A practical session on month-end close: reconciliations, accruals and the checks that catch errors early.',
  when = '12 Nov 2026 · 15:00–16:00 CET',
  dateTime = '2026-11-12T15:00+01:00',
  where = 'Online, the link arrives after you register',
  online = true,
  speakers = [{ name: 'Maria Ilie' }, { name: 'Ana Popescu' }, { name: 'Daniel Pop' }],
  speakersLabel,
  past = false,
  registerAction = { label: 'Register', href: '#register' },
  calendarAction = { label: 'Add to calendar', href: '#calendar.ics' },
  recordingAction = { label: 'Watch the recording', href: '#recording' },
  media,
  mediaAlt,
  showMedia = true,
  ...props
}: HeaderEventProps) {
  const id = React.useId();
  return (
    <HeaderBand data-slot="header-event" titleId={id} {...props}>
      <div className={twoColumns}>
        <div className={textColumn}>
          {tags.length ? <BadgeList items={tags.map(label => ({ label, variant: 'secondary' as const }))} max={4} label="Event type" /> : null}
          <HeaderTitle id={id} title={title} lead={description} />
          <ul aria-label="When and where" className="m-0 flex max-w-full list-none flex-col items-start gap-2 p-0">
            <li className="flex min-w-0"><MetaItem icon={<Calendar />}><time dateTime={dateTime}>{when}</time></MetaItem></li>
            <li className="flex min-w-0"><MetaItem icon={online ? <Globe /> : <MapPin />}>{where}</MetaItem></li>
          </ul>
          {speakers.length ? <People people={speakers} label="Speakers" labelText={speakersLabel ?? joinNames(speakers.map(s => s.name))} /> : null}
          <ActionBar align="start">
            {past ? (
              <ActionButton size="lg" action={recordingAction} trailingIcon={<ArrowRight aria-hidden="true" />} />
            ) : (
              <>
                <ActionButton size="lg" action={registerAction} trailingIcon={<ArrowRight aria-hidden="true" />} />
                {calendarAction ? <ActionButton size="lg" action={calendarAction} variant="outline" leadingIcon={<Calendar aria-hidden="true" />} /> : null}
              </>
            )}
          </ActionBar>
        </div>
        {showMedia ? <Media media={media} ratio="16:9" alt={mediaAlt} className="@5xl:w-[520px]" /> : null}
      </div>
    </HeaderBand>
  );
}

/* Header Topic */

export interface HeaderTopicProps extends SectionProps {
  breadcrumb?: BreadcrumbEntry[];
  title?: React.ReactNode;
  /** Scope in one line. */
  description?: React.ReactNode;
  /** How much and how fresh: "128 articles · updated daily". */
  stats?: string;
  /** Subtopics as Chips; picking them narrows the list below. */
  subtopics?: string[];
  onSubtopicsChange?: (selected: string[]) => void;
  followLabel?: string;
  following?: boolean;
  onFollowChange?: (following: boolean) => void;
}

function HeaderTopic({
  breadcrumb = [{ label: 'Topics', href: '#topics' }, { label: 'Finance', href: '#finance' }, { label: 'Accounts receivable' }],
  title = 'Accounts receivable',
  description = 'Invoicing, collections and credit control: how to get paid on time without chasing.',
  stats = '128 articles · updated daily',
  subtopics = ['Invoicing', 'Collections', 'Credit control', 'Cash forecasting', 'Disputes', 'E-invoicing'],
  onSubtopicsChange,
  followLabel = 'Follow topic',
  following: followingProp,
  onFollowChange,
  ...props
}: HeaderTopicProps) {
  const id = React.useId();
  const [innerFollowing, setFollowing] = React.useState(false);
  const following = followingProp ?? innerFollowing;
  return (
    <HeaderBand data-slot="header-topic" titleId={id} compact {...props}>
      <div className="flex w-full min-w-0 flex-col items-start gap-6">
        {breadcrumb.length ? <Breadcrumb items={breadcrumb} /> : null}
        <div className="flex w-full min-w-0 flex-wrap items-end gap-6">
          <div className="flex min-w-60 flex-1 flex-col gap-3">
            <HeaderTitle id={id} title={title} lead={description} />
            {stats ? <p className="m-0 text-xs leading-4 text-muted-foreground">{stats}</p> : null}
          </div>
          <Button
            variant={following ? 'secondary' : 'outline'}
            aria-pressed={following}
            leadingIcon={<Bell aria-hidden="true" />}
            onClick={() => { setFollowing(!following); onFollowChange?.(!following); }}
            className="shrink-0"
          >
            {followLabel}
          </Button>
        </div>
        {subtopics.length ? (
          <ChipGroup type="multiple" aria-label="Subtopics" onValueChange={onSubtopicsChange} className="w-full">
            {subtopics.map(s => <Chip key={s} value={s} label={s} />)}
          </ChipGroup>
        ) : null}
      </div>
    </HeaderBand>
  );
}

/* Header Report */

export interface HeaderReportProps extends SectionProps {
  /** Overline (foreground/brand): "Report 2026". */
  overline?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Three headline figures (Figure stacked lg with a divider). */
  figures?: { value: React.ReactNode; label: string }[];
  /** Where the figures come from. */
  source?: string;
  downloadAction?: HeaderAction;
  readAction?: HeaderAction;
}

function HeaderReport({
  overline = 'Report 2026',
  title = 'State of B2B payments in Europe',
  description = 'Survey of 1,200 finance leaders on payment terms, late payments and the tools they use to get paid.',
  figures = [
    { value: '47 days', label: 'average time to get paid' },
    { value: '€18,500', label: 'overdue per €1M of revenue' },
    { value: '62%', label: 'plan to automate reminders in 2027' },
  ],
  source = 'Source: Acme survey, September 2026',
  downloadAction = { label: 'Download report', href: '#report.pdf' },
  readAction = { label: 'Read online', href: '#read' },
  ...props
}: HeaderReportProps) {
  const id = React.useId();
  return (
    <HeaderBand data-slot="header-report" titleId={id} muted {...props}>
      <div className={twoColumns}>
        <div className={textColumn}>
          {overline ? <p className="m-0 text-xs leading-4 font-semibold tracking-[1.6px] text-brand uppercase">{overline}</p> : null}
          <HeaderTitle id={id} title={title} lead={description} />
          <ActionBar align="start">
            <ActionButton size="lg" action={downloadAction} leadingIcon={<Download aria-hidden="true" />} />
            {readAction ? <ActionButton size="lg" action={readAction} variant="outline" trailingIcon={<ArrowRight aria-hidden="true" />} /> : null}
          </ActionBar>
        </div>
        {figures.length ? (
          <div data-slot="page-header-figures" className="flex w-full min-w-0 flex-col gap-6 @5xl:w-[360px] @5xl:shrink-0">
            <ul aria-label="Key figures" className="m-0 flex list-none flex-col gap-6 p-0">
              {figures.map(f => <li key={f.label} className="min-w-0"><Figure size="lg" value={f.value} label={f.label} divider /></li>)}
            </ul>
            {source ? <p className="m-0 text-xs leading-4 text-muted-foreground">{source}</p> : null}
          </div>
        ) : null}
      </div>
    </HeaderBand>
  );
}

/* Header Simple */

export interface HeaderSimpleProps extends SectionProps {
  breadcrumb?: BreadcrumbEntry[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** "21 Oct 2026". */
  updated?: string;
  /** Machine-readable date for <time>. */
  updatedDateTime?: string;
}

function HeaderSimple({
  breadcrumb = [{ label: 'Home', href: '#home' }, { label: 'Legal', href: '#legal' }, { label: 'Privacy policy' }],
  title = 'Privacy policy',
  description = 'How Acme collects, uses and protects your data.',
  updated = '21 Oct 2026',
  updatedDateTime = '2026-10-21',
  ...props
}: HeaderSimpleProps) {
  const id = React.useId();
  return (
    <HeaderBand data-slot="header-simple" titleId={id} {...props}>
      <div className="mx-auto flex w-full max-w-[720px] min-w-0 flex-col items-center gap-4 text-center">
        {breadcrumb.length ? <Breadcrumb items={breadcrumb} className="w-fit max-w-full [&_ol]:justify-center" /> : null}
        <HeaderTitle id={id} title={title} lead={description} center />
        {updated ? <p className="m-0 text-xs leading-4 text-muted-foreground">Last updated <time dateTime={updatedDateTime}>{updated}</time></p> : null}
      </div>
    </HeaderBand>
  );
}

export { HeaderDetail, HeaderEvent, HeaderListing, HeaderProfile, HeaderReport, HeaderSearchResults, HeaderSimple, HeaderTopic };
