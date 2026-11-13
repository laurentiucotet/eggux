import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { CaseStudyGrid, CaseStudyHeader } from './section-case-study';

const meta = {
  title: 'Blocks/Sections/Case Studies',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Customer stories. Case Study Grid: the customers index, or "More stories" (3 items) under a story; each card states the result in the title and repeats it as a number next to the logo; industries filter the grid. Case Study Header: the top of a story page (h1): logo, result as the title, company facts, three figures and a photo. The same numbers appear in the header and the grid card. Figma: BLOCKS / Sections (Case studies). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

type GridArgs = { overline: string; title: string; description: string; showFilters: boolean; showMore: boolean; moreLabel: string };
export const Grid: StoryObj<GridArgs> = {
  name: 'Case Study Grid',
  args: {
    overline: 'Customer stories',
    title: 'How finance teams run on Acme',
    description: 'Six companies, six different problems, and the one number that changed for each.',
    showFilters: true,
    showMore: true,
    moreLabel: 'Show 12 more stories',
  },
  argTypes: {
    overline: text('Overline', 'Section Header overline.', 'Section Header'),
    title: text('Title', 'Section Header title (h2).', 'Section Header'),
    description: text('Description', 'Section Header description.', 'Section Header'),
    showFilters: bool('Show filters', 'The industry Chip Group that filters the grid.'),
    showMore: bool('Show more link', 'The outline link to the next stories.'),
    moreLabel: text('More label', 'Says how many more.'),
  },
  render: a => (
    <CaseStudyGrid
      overline={a.overline}
      title={a.title}
      description={a.description}
      showFilters={a.showFilters}
      moreAction={a.showMore ? { label: a.moreLabel, href: '#more-stories' } : null}
    />
  ),
};

type HeaderArgs = { showBack: boolean; title: string; description: string; showDownload: boolean; showFacts: boolean; showImage: boolean };
export const Header: StoryObj<HeaderArgs> = {
  name: 'Case Study Header',
  args: {
    showBack: true,
    title: 'How Kestrel closes the books in 3 days instead of 7',
    description: 'Kestrel Logistics moves freight for 2,300 shippers across the Benelux. Its finance team of six replaced email approvals and a shared spreadsheet with Acme in five weeks.',
    showDownload: true,
    showFacts: true,
    showImage: true,
  },
  argTypes: {
    showBack: bool('Show back link', 'Back Link to the customers index.'),
    title: text('Title', 'The page h1: the result, in numbers.'),
    description: text('Description', 'Who the customer is and what they changed.'),
    showDownload: bool('Show download', 'The outline Download PDF button.'),
    showFacts: bool('Show facts', 'The company facts card.'),
    showImage: bool('Show image', 'The 21:9 photo under the results.'),
  },
  render: a => (
    <CaseStudyHeader
      back={a.showBack ? undefined : null}
      title={a.title}
      description={a.description}
      downloadAction={a.showDownload ? undefined : null}
      facts={a.showFacts ? undefined : []}
      image={a.showImage ? undefined : null}
    />
  ),
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];
const lefts = (els: Element[]) => new Set(els.map(e => r(box(e).left))).size;

const GRID = 'How finance teams run on Acme';
const HEADER = 'How Kestrel closes the books in 3 days instead of 7';

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <CaseStudyHeader />
    <CaseStudyGrid />
  </div>
);

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  const h1 = c.getAllByRole('heading', { level: 1 });
  await expect(h1).toHaveLength(1);
  await expect(h1[0]).toHaveTextContent(HEADER);
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  await expect(c.getAllByRole('heading', { level: 3 })).toHaveLength(6);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(2);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button'), ...c.queryAllByRole('radio')]) await expect(el).toHaveAccessibleName();
  for (const img of root.querySelectorAll('img')) await expect(img).toHaveAttribute('alt');
  // Customer logos are named images.
  await expect(c.getAllByRole('img', { name: 'Kestrel' }).length).toBeGreaterThanOrEqual(2);
  await expect(c.getByRole('link', { name: 'All customer stories' })).toHaveAttribute('href', '#customers');
  await expect(c.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('download');
  await expect(c.getByRole('link', { name: 'Show 12 more stories' })).toHaveAttribute('href', '#more-stories');
  await expect(c.getByRole('link', { name: 'How Kestrel closes the books in 3 days instead of 7' })).toHaveAttribute('href', '#kestrel');
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Header: intro 736, 64 gap, facts 352; results three 368 wide, 24 apart; 21:9 photo 1152.
    const header = c.getByRole('region', { name: HEADER });
    const intro = slot(header, 'case-study-header-intro');
    const facts = slot(header, 'case-study-facts');
    await expect(r(box(intro).width)).toBe(736);
    await expect(r(box(facts).width)).toBe(352);
    await expect(r(box(facts).left - box(intro).right)).toBe(64);
    await expect(r(box(slot(header, 'back-link')).top - box(header).top)).toBe(96);
    await expect(r(box(slot(header, 'case-study-header-main')).top - box(slot(header, 'back-link')).bottom)).toBe(48);
    const results = items(header, 'figure');
    await expect(results).toHaveLength(3);
    await expect(r(box(results[0]!).width)).toBe(368);
    await expect(r(box(results[1]!).left - box(results[0]!).right)).toBe(24);
    const photo = [...header.querySelectorAll('[data-slot="image-placeholder"]')].pop()!;
    await expect(r(box(photo).width)).toBe(1152);
    await expect(r(box(photo).height)).toBe(494);
    // Grid: three columns of 368, 24 apart; result row 20 under each Post Card.
    const grid = c.getByRole('region', { name: GRID });
    const stories = items(grid, 'case-study');
    await expect(stories).toHaveLength(6);
    await expect(lefts(stories)).toBe(3);
    await expect(r(box(stories[0]!).width)).toBe(368);
    await expect(r(box(stories[1]!).left - box(stories[0]!).right)).toBe(24);
    await expect(r(box(slot(stories[0]!, 'case-study-result')).top - box(slot(stories[0]!, 'post-card')).bottom)).toBe(20);
    await expect(r(box(slot(grid, 'case-study-grid-body')).top - box(slot(grid, 'section-header')).bottom)).toBe(48);
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    const header = c.getByRole('region', { name: HEADER });
    await expect(box(slot(header, 'case-study-facts')).top).toBeGreaterThan(box(slot(header, 'case-study-header-intro')).bottom);
    await expect(lefts(items(header, 'figure'))).toBe(3);
    await expect(lefts(items(c.getByRole('region', { name: GRID }), 'case-study'))).toBe(2);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    const header = c.getByRole('region', { name: HEADER });
    await expect(lefts(items(header, 'figure'))).toBe(1);
    const grid = c.getByRole('region', { name: GRID });
    await expect(lefts(items(grid, 'case-study'))).toBe(1);
    await expect(r(box(items(grid, 'case-study')[0]!).left - box(grid).left)).toBe(24);
  },
};

/** Industry chips filter the grid (single select); All industries brings every story back. */
export const FilterCheck: StoryObj = {
  tags: ['!dev'],
  render: () => <CaseStudyGrid />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const group = c.getByRole('radiogroup', { name: 'Filter by industry' });
    await expect(within(group).getByRole('radio', { name: 'All industries' })).toBeChecked();
    await userEvent.click(within(group).getByRole('radio', { name: 'Retail' }));
    await waitFor(() => expect(items(canvasElement, 'case-study')).toHaveLength(2));
    await expect(c.getByRole('link', { name: 'Tidewater collects EUR 1.1M sooner every year' })).toBeVisible();
    await userEvent.click(within(group).getByRole('radio', { name: 'All industries' }));
    await waitFor(() => expect(items(canvasElement, 'case-study')).toHaveLength(6));
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
