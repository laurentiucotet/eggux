import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { HeaderDetail, HeaderEvent, HeaderListing, HeaderProfile, HeaderReport, HeaderSearchResults, HeaderSimple, HeaderTopic } from './page-header-blocks';

const meta = {
  title: 'Blocks/Page Headers/Page Headers',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The top of an inner page, right under the Navbar, one per page type: Detail (product, dataset, service), Listing (hub with a type switch and search), Search Results (editable query, count, sort, tabs by type), Profile (person), Event (date with time zone, place, speakers, register), Topic (scope, freshness, subtopic chips, follow), Report (three figures with their source), Simple (legal and about, centered at 720). One h1 and one primary action each; landing pages use Hero instead. Figma: BLOCKS / Page Headers. Guide: eggux build-ui/patterns/marketing-pages.md § Page headers' } },
  },
} satisfies Meta;
export default meta;

const text = (name: string, description: string) => ({ name, description, control: 'text' as const, table: { category: 'Content' } });
const toggle = (name: string, description: string) => ({ name, description, control: 'boolean' as const, table: { category: 'Parts' } });

/* Visible stories: one per block, no play function. */

type DetailArgs = { title: string; description: string; peopleLabel: string; primary: string; secondary: string; showBreadcrumb: boolean; showTags: boolean; showPeople: boolean; showMedia: boolean };
export const Detail: StoryObj<DetailArgs> = {
  args: {
    title: 'Quarterly Revenue Forecast',
    description: 'Revenue forecasts by product line and region, updated monthly, with a 36-month outlook for budgeting and planning.',
    peopleLabel: 'Maintained by 3 analysts in Finance and Operations',
    primary: 'Request access',
    secondary: 'Download sample',
    showBreadcrumb: true,
    showTags: true,
    showPeople: true,
    showMedia: true,
  },
  argTypes: {
    title: text('Title', 'What it is; matches the last breadcrumb.'),
    description: text('Description', 'One or two sentences of lead.'),
    peopleLabel: text('People label', 'Who is behind it.'),
    primary: text('Primary action', 'The main action.'),
    secondary: text('Secondary action', 'The alternative.'),
    showBreadcrumb: toggle('Show breadcrumb', 'The path above the title.'),
    showTags: toggle('Show tags', 'Badges for type and scope.'),
    showPeople: toggle('Show people', 'Avatar Group with a label.'),
    showMedia: toggle('Show media', 'The 4:3 image on the right.'),
  },
  render: a => (
    <HeaderDetail
      title={a.title}
      description={a.description}
      peopleLabel={a.peopleLabel}
      primaryAction={{ label: a.primary, href: '#request-access' }}
      secondaryAction={{ label: a.secondary, href: '#download-sample' }}
      breadcrumb={a.showBreadcrumb ? undefined : []}
      tags={a.showTags ? undefined : []}
      people={a.showPeople ? undefined : []}
      showMedia={a.showMedia}
    />
  ),
};

type ListingArgs = { title: string; description: string; searchPlaceholder: string; showTypes: boolean; showSearch: boolean; showMedia: boolean };
export const Listing: StoryObj<ListingArgs> = {
  args: {
    title: 'Resources',
    description: 'Guides, reports and webinars on invoicing, payments and cash flow for finance teams.',
    searchPlaceholder: 'Search resources',
    showTypes: true,
    showSearch: true,
    showMedia: true,
  },
  argTypes: {
    title: text('Title', 'What is here.'),
    description: text('Description', 'One sentence of lead.'),
    searchPlaceholder: text('Search placeholder', 'Names what is searched.'),
    showTypes: toggle('Show type switch', 'Toggle Group that filters the list.'),
    showSearch: toggle('Show search', 'Search Field and Search button; keeps the type.'),
    showMedia: toggle('Show media', 'The 4:3 image on the right.'),
  },
  render: a => <HeaderListing title={a.title} description={a.description} searchPlaceholder={a.searchPlaceholder} types={a.showTypes ? undefined : []} showSearch={a.showSearch} showMedia={a.showMedia} />,
};

type SearchArgs = { query: string; count: number; showTabs: boolean; showSort: boolean };
export const SearchResults: StoryObj<SearchArgs> = {
  name: 'Search Results',
  args: { query: 'invoice reminders', count: 128, showTabs: true, showSort: true },
  argTypes: {
    query: text('Query', 'The search, still editable.'),
    count: { name: 'Count', description: 'Total results.', control: { type: 'number', min: 0 }, table: { category: 'Content' } },
    showTabs: toggle('Show tabs', 'Result types with counts.'),
    showSort: toggle('Show sort', 'Sort select on the right.'),
  },
  render: a => <HeaderSearchResults key={a.query} query={a.query} count={a.count} types={a.showTabs ? undefined : []} sortOptions={a.showSort ? undefined : []} />,
};

type ProfileArgs = { name: string; role: string; bio: string; showFacts: boolean; showCounts: boolean };
export const Profile: StoryObj<ProfileArgs> = {
  args: {
    name: 'Maria Ilie',
    role: 'Head of Finance Operations · Acme',
    bio: 'Leads the order-to-cash team. Writes about invoicing, collections and closing the books faster.',
    showFacts: true,
    showCounts: true,
  },
  argTypes: {
    name: text('Name', 'The person.'),
    role: text('Role', 'Role and organization.'),
    bio: text('Bio', 'One or two sentences.'),
    showFacts: toggle('Show facts', 'Place, since when, website.'),
    showCounts: toggle('Show counts', 'Three counts.'),
  },
  render: a => <HeaderProfile name={a.name} role={a.role} bio={a.bio} facts={a.showFacts ? undefined : []} counts={a.showCounts ? undefined : []} />,
};

type EventArgs = { title: string; description: string; when: string; where: string; past: boolean; showSpeakers: boolean; showMedia: boolean };
export const Event: StoryObj<EventArgs> = {
  args: {
    title: 'Close the books in five days',
    description: 'A practical session on month-end close: reconciliations, accruals and the checks that catch errors early.',
    when: '12 Nov 2026 · 15:00–16:00 CET',
    where: 'Online, the link arrives after you register',
    past: false,
    showSpeakers: true,
    showMedia: true,
  },
  argTypes: {
    title: text('Title', 'The event.'),
    description: text('Description', 'What people learn.'),
    when: text('When', 'Date and time with the time zone.'),
    where: text('Where', 'Place, or how to join online.'),
    past: { name: 'After the date', description: 'Watch the recording replaces Register and Add to calendar.', control: 'boolean', table: { category: 'State' } },
    showSpeakers: toggle('Show speakers', 'Avatar Group with the names.'),
    showMedia: toggle('Show media', 'The 16:9 image on the right.'),
  },
  render: a => <HeaderEvent title={a.title} description={a.description} when={a.when} where={a.where} past={a.past} speakers={a.showSpeakers ? undefined : []} showMedia={a.showMedia} />,
};

type TopicArgs = { title: string; description: string; stats: string; showBreadcrumb: boolean; showSubtopics: boolean };
export const Topic: StoryObj<TopicArgs> = {
  args: {
    title: 'Accounts receivable',
    description: 'Invoicing, collections and credit control: how to get paid on time without chasing.',
    stats: '128 articles · updated daily',
    showBreadcrumb: true,
    showSubtopics: true,
  },
  argTypes: {
    title: text('Title', 'The topic.'),
    description: text('Description', 'Scope in one line.'),
    stats: text('Stats', 'How much and how fresh.'),
    showBreadcrumb: toggle('Show breadcrumb', 'The path above the title.'),
    showSubtopics: toggle('Show subtopics', 'Chips that narrow the list.'),
  },
  render: a => <HeaderTopic title={a.title} description={a.description} stats={a.stats} breadcrumb={a.showBreadcrumb ? undefined : []} subtopics={a.showSubtopics ? undefined : []} />,
};

type ReportArgs = { overline: string; title: string; description: string; source: string; showFigures: boolean };
export const Report: StoryObj<ReportArgs> = {
  args: {
    overline: 'Report 2026',
    title: 'State of B2B payments in Europe',
    description: 'Survey of 1,200 finance leaders on payment terms, late payments and the tools they use to get paid.',
    source: 'Source: Acme survey, September 2026',
    showFigures: true,
  },
  argTypes: {
    overline: text('Overline', 'Kind and year.'),
    title: text('Title', 'The report.'),
    description: text('Description', 'What was studied.'),
    source: text('Source', 'Where the figures come from.'),
    showFigures: toggle('Show figures', 'Three headline figures.'),
  },
  render: a => <HeaderReport overline={a.overline} title={a.title} description={a.description} source={a.source} figures={a.showFigures ? undefined : []} />,
};

type SimpleArgs = { title: string; description: string; updated: string; showBreadcrumb: boolean };
export const Simple: StoryObj<SimpleArgs> = {
  args: { title: 'Privacy policy', description: 'How Acme collects, uses and protects your data.', updated: '21 Oct 2026', showBreadcrumb: true },
  argTypes: {
    title: text('Title', 'The page.'),
    description: text('Description', 'One sentence.'),
    updated: text('Last updated', 'Date of the last change; empty hides the line.'),
    showBreadcrumb: toggle('Show breadcrumb', 'The path above the title.'),
  },
  render: a => <HeaderSimple title={a.title} description={a.description} updated={a.updated} breadcrumb={a.showBreadcrumb ? undefined : []} />,
};

/* Hidden checks: each block at 1440, 768 and 390. */

const box = (el: Element) => el.getBoundingClientRect();
const WIDTHS = [1440, 768, 390] as const;
// Three copies of one block: the same landmark names repeat on purpose.
const multi = { a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } }, controls: { disable: true } };

function AtWidths({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      {WIDTHS.map(w => <div key={w} data-width={w} style={{ width: w }}>{children}</div>)}
    </div>
  );
}

const frames = (root: HTMLElement) => WIDTHS.map(w => root.querySelector<HTMLElement>(`[data-width="${w}"]`)!);

/** Landmark named by its only h1, every link and button named, images with alt, no sideways scroll. */
async function common(root: HTMLElement) {
  for (const frame of frames(root)) {
    const section = frame.querySelector('section')!;
    const h1s = section.querySelectorAll('h1');
    await expect(h1s).toHaveLength(1);
    await expect(within(frame).getByRole('region', { name: h1s[0]!.textContent! })).toBe(section);
    await expect(section.querySelectorAll('h2, h3')).toHaveLength(0);
    for (const el of section.querySelectorAll('a, button')) {
      const name = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim();
      await expect(name, el.outerHTML.slice(0, 80)).not.toBe('');
    }
    for (const img of section.querySelectorAll('img')) await expect(img.hasAttribute('alt')).toBe(true);
    await expect(section.scrollWidth).toBeLessThanOrEqual(frame.offsetWidth);
  }
}

/** At 1440 the 1152 container sits 144 from each side. */
async function container1440(root: HTMLElement, height?: number) {
  const frame = frames(root)[0]!;
  const c = box(frame.querySelector('[data-slot="page-header-container"]')!);
  await expect(Math.round(c.width)).toBe(1152);
  await expect(Math.round(c.left - box(frame).left)).toBe(144);
  if (height) await expect(Math.round(box(frame.querySelector('section')!).height)).toBe(height);
}

/** Two columns 48 apart at 1440 (text first, media of `mediaWidth` second); stacked at 768 and 390. */
async function columns(root: HTMLElement, side: string, mediaWidth: number) {
  const [wide, mid, narrow] = frames(root);
  const text = (f: HTMLElement) => f.querySelector('[data-slot="page-header-heading"]')!.parentElement!;
  const media = (f: HTMLElement) => f.querySelector(`[data-slot="${side}"]`)!;
  await expect(Math.round(box(media(wide!)).width)).toBe(mediaWidth);
  await expect(Math.round(box(media(wide!)).left - box(text(wide!)).right)).toBe(48);
  for (const f of [mid!, narrow!]) {
    await expect(box(media(f)).top).toBeGreaterThanOrEqual(box(text(f)).bottom);
    await expect(Math.round(box(media(f)).width)).toBe(Math.round(box(f.querySelector('[data-slot="page-header-container"]')!).width));
  }
}

export const DetailCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><HeaderDetail /></AtWidths>,
  play: async ({ canvasElement }) => {
    await common(canvasElement);
    await container1440(canvasElement, 518);
    await columns(canvasElement, 'page-header-media', 520);
    const wide = within(frames(canvasElement)[0]!);
    await expect(wide.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    await expect(wide.getByRole('list', { name: 'Tags' })).toHaveTextContent('DatasetMonthlyEurope');
    await expect(wide.getByRole('link', { name: 'Request access' })).toHaveAttribute('href', '#request-access');
    await expect(wide.getByRole('link', { name: 'Download sample' })).toBeInTheDocument();
    await expect(wide.getByRole('group', { name: 'Maintainers' })).toHaveTextContent('Maintained by 3 analysts');
  },
};

const onSearch = fn();
export const ListingCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><HeaderListing onSearch={onSearch} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await common(canvasElement);
    await container1440(canvasElement, 428);
    await columns(canvasElement, 'page-header-media', 400);
    const wide = within(frames(canvasElement)[0]!);
    const guides = wide.getByRole('radio', { name: 'Guides' });
    await userEvent.click(guides);
    await waitFor(() => expect(guides).toHaveAttribute('aria-checked', 'true'));
    await userEvent.type(wide.getByRole('searchbox'), 'late fees');
    await userEvent.click(wide.getByRole('button', { name: 'Search' }));
    await expect(onSearch).toHaveBeenCalledWith('late fees', 'Guides');
  },
};

export const SearchResultsCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><HeaderSearchResults /></AtWidths>,
  play: async ({ canvasElement }) => {
    await common(canvasElement);
    await container1440(canvasElement, 277);
    const wide = within(frames(canvasElement)[0]!);
    await expect(wide.getByRole('heading', { level: 1 })).toHaveTextContent('Results for “invoice reminders”');
    await expect(wide.getByRole('searchbox')).toHaveValue('invoice reminders');
    await expect(wide.getByRole('combobox', { name: 'Sort results' })).toHaveTextContent('Most relevant');
    const tabs = wide.getAllByRole('tab');
    await expect(tabs).toHaveLength(4);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(wide.getByRole('tab', { name: /Guides/ }));
    await waitFor(() => expect(wide.getByRole('tab', { name: /Guides/ })).toHaveAttribute('aria-selected', 'true'));
    // Sort sits at the right end of the title row at 1440 and is 240 wide.
    const sort = box(wide.getByRole('combobox', { name: 'Sort results' }));
    await expect(Math.round(sort.width)).toBe(240);
    await expect(Math.round(sort.right)).toBe(Math.round(box(frames(canvasElement)[0]!.querySelector('[data-slot="page-header-container"]')!).right));
  },
};

export const ProfileCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><HeaderProfile /></AtWidths>,
  play: async ({ canvasElement }) => {
    await common(canvasElement);
    await container1440(canvasElement, 304);
    const [wide, , narrow] = frames(canvasElement);
    const w = within(wide!);
    // Avatar 48, then the text 48 to the right; actions at the right end on one row.
    const avatar = box(wide!.querySelector('[data-slot="avatar"]')!);
    await expect(Math.round(avatar.width)).toBe(48);
    await expect(Math.round(box(w.getByRole('heading', { level: 1 })).left - avatar.right)).toBe(48);
    await expect(Math.round(box(w.getByRole('button', { name: 'Follow' })).top)).toBe(Math.round(avatar.top));
    await expect(w.getByRole('list', { name: 'Activity' })).toHaveTextContent('42articles18talks6reports');
    await expect(w.getByRole('link', { name: 'acme.com/maria' })).toBeInTheDocument();
    // 390: stacked, the actions under the text.
    const n = within(narrow!);
    await expect(box(n.getByRole('button', { name: 'Follow' })).top).toBeGreaterThan(box(n.getByRole('list', { name: 'Activity' })).bottom);
  },
};

export const EventCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => (
    <div className="flex flex-col gap-8">
      <AtWidths><HeaderEvent /></AtWidths>
      <div data-past style={{ width: 1440 }}><HeaderEvent past title="Close the books in five days (recording)" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await common(canvasElement);
    await container1440(canvasElement, 472);
    await columns(canvasElement, 'page-header-media', 520);
    const wide = within(frames(canvasElement)[0]!);
    await expect(wide.getByRole('list', { name: 'When and where' }).querySelector('time')).toHaveAttribute('dateTime', '2026-11-12T15:00+01:00');
    await expect(wide.getByRole('group', { name: 'Speakers' })).toHaveTextContent('Maria Ilie, Ana Popescu and Daniel Pop');
    await expect(wide.getByRole('link', { name: 'Register' })).toBeInTheDocument();
    await expect(wide.getByRole('link', { name: 'Add to calendar' })).toBeInTheDocument();
    const past = within(canvasElement.querySelector<HTMLElement>('[data-past]')!);
    await expect(past.getByRole('link', { name: 'Watch the recording' })).toBeInTheDocument();
    await expect(past.queryByRole('link', { name: 'Register' })).toBeNull();
    await expect(past.queryByRole('link', { name: 'Add to calendar' })).toBeNull();
  },
};

const onSubtopics = fn();
export const TopicCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><HeaderTopic onSubtopicsChange={onSubtopics} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await common(canvasElement);
    await container1440(canvasElement, 304);
    const wide = within(frames(canvasElement)[0]!);
    const follow = wide.getByRole('button', { name: 'Follow topic' });
    // The follow button sits at the right end of the title row, aligned to its bottom.
    const row = box(follow.parentElement!);
    await expect(Math.round(box(follow).right)).toBe(Math.round(row.right));
    await userEvent.click(follow);
    await waitFor(() => expect(wide.getByRole('button', { name: 'Follow topic' })).toHaveAttribute('aria-pressed', 'true'));
    await userEvent.click(wide.getByRole('button', { name: 'Collections' }));
    await waitFor(() => expect(onSubtopics).toHaveBeenCalledWith(['Collections']));
  },
};

export const ReportCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><HeaderReport /></AtWidths>,
  play: async ({ canvasElement }) => {
    await common(canvasElement);
    await container1440(canvasElement, 411);
    await columns(canvasElement, 'page-header-figures', 360);
    const wide = within(frames(canvasElement)[0]!);
    await expect(wide.getByRole('list', { name: 'Key figures' }).children).toHaveLength(3);
    await expect(wide.getByText('Source: Acme survey, September 2026')).toBeInTheDocument();
    await expect(wide.getByRole('link', { name: 'Download report' })).toBeInTheDocument();
  },
};

export const SimpleCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><HeaderSimple /></AtWidths>,
  play: async ({ canvasElement }) => {
    await common(canvasElement);
    await container1440(canvasElement, 276);
    const frame = frames(canvasElement)[0]!;
    const h1 = box(within(frame).getByRole('heading', { level: 1 }));
    await expect(Math.round(h1.width)).toBe(720);
    await expect(Math.round(h1.left - box(frame).left)).toBe(360);
    // The breadcrumb is centered over the title.
    const crumb = box(within(frame).getByRole('navigation', { name: 'Breadcrumb' }));
    await expect(Math.abs(crumb.left + crumb.width / 2 - 720)).toBeLessThanOrEqual(1);
  },
};

/* Theme copies (axe contrast). */
const Gallery = () => (
  <div className="w-[1440px]">
    <HeaderDetail />
    <HeaderSearchResults />
    <HeaderTopic />
    <HeaderReport />
  </div>
);
export const GalleryDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, parameters: multi, render: () => <Gallery /> };
export const GalleryCorporate: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, parameters: multi, render: () => <Gallery /> };
