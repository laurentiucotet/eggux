import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stats, StatsBrandBand, StatsCards, StatsSplit, StatsWithImage } from './section-stats';

const meta = {
  title: 'Blocks/Sections/Stats',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Proof numbers for marketing pages, always with their period and source. Stats: a Metric Strip on the muted band (optional Section Header). Stats Cards: four Stat Cards under a Section Header. Stats Split: the story behind the numbers next to them. Stats Brand Band: once per page, white figures on primary. Stats with Image: four sourced figures next to a tall photo. Figma: BLOCKS / Sections (Stats). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

type StatsArgs = { showHeader: boolean; overline: string; title: string; description: string; source: string };
export const Default: StoryObj<StatsArgs> = {
  name: 'Stats',
  args: {
    showHeader: false,
    overline: 'By the numbers',
    title: 'Teams close faster with Acme',
    description: 'What 1,240 finance teams changed in their first year.',
    source: 'Source: Acme customer survey, 1,240 finance teams, March 2026. Figures are medians.',
  },
  argTypes: {
    showHeader: bool('Show header', 'A centered Section Header above the numbers.', 'Section Header'),
    overline: text('Overline', 'Section Header overline.', 'Section Header'),
    title: text('Title', 'Section Header title: says the answer, not the topic.', 'Section Header'),
    description: text('Description', 'Section Header description.', 'Section Header'),
    source: text('Source', 'Where the numbers come from, with the period. Keep it.'),
  },
  render: a => <Stats header={a.showHeader ? { overline: a.overline, title: a.title, description: a.description } : undefined} source={a.source} />,
};

type CardsArgs = { overline: string; title: string; description: string };
export const Cards: StoryObj<CardsArgs> = {
  name: 'Stats Cards',
  args: { overline: 'In numbers', title: 'Trusted by finance teams in 40 countries', description: 'Updated every quarter from customer data.' },
  argTypes: {
    overline: text('Overline', 'Section Header overline.', 'Section Header'),
    title: text('Title', 'Section Header title.', 'Section Header'),
    description: text('Description', 'Section Header description.', 'Section Header'),
  },
  render: a => <StatsCards header={{ overline: a.overline, title: a.title, description: a.description }} />,
};

type SplitArgs = { overline: string; title: string; description: string; showLink: boolean; linkLabel: string };
export const Split: StoryObj<SplitArgs> = {
  name: 'Stats Split',
  args: {
    overline: 'Results',
    title: 'What changes in the first six months',
    description: 'Median results across 380 customers who moved approvals and reporting to Acme in 2025.',
    showLink: true,
    linkLabel: 'See the methodology',
  },
  argTypes: {
    overline: text('Overline', 'Short label above the title.'),
    title: text('Title', 'Section title (h2).'),
    description: text('Description', 'Who was measured, how many, when.'),
    showLink: bool('Show link', 'A link to the method or the source.'),
    linkLabel: text('Link label', 'Names where it goes.'),
  },
  render: a => <StatsSplit overline={a.overline} title={a.title} description={a.description} link={a.showLink ? { label: a.linkLabel, href: '#methodology' } : undefined} />,
};

type BandArgs = { showHeader: boolean; title: string; description: string; showSource: boolean; source: string };
export const BrandBand: StoryObj<BandArgs> = {
  name: 'Stats Brand Band',
  args: {
    showHeader: true,
    title: 'The numbers behind 1,200 finance teams',
    description: 'Measured across all customers on Acme for at least six months.',
    showSource: true,
    source: 'Source: Acme product data, January to September 2026; ratings from G2 and Capterra.',
  },
  argTypes: {
    showHeader: bool('Show header', 'Title and description above the figures.'),
    title: text('Title', 'Section title (h2).'),
    description: text('Description', 'What was measured and over which period.'),
    showSource: bool('Show source', 'Always keep the source on a real page.'),
    source: text('Source', 'Where the figures come from.'),
  },
  render: a => <StatsBrandBand showHeader={a.showHeader} title={a.title} description={a.description} source={a.showSource ? a.source : undefined} />,
};

type ImageArgs = { showImage: boolean; showEyebrow: boolean; eyebrow: string; title: string; description: string; showNote: boolean; note: string };
export const WithImage: StoryObj<ImageArgs> = {
  name: 'Stats with Image',
  args: {
    showImage: true,
    showEyebrow: true,
    eyebrow: 'By the numbers',
    title: 'What changes after one year on Acme',
    description: 'We measured 1,200 workspaces and asked 412 finance leads what moved. These are the medians, with where each number comes from.',
    showNote: true,
    note: 'Medians for customers on the Business plan for at least 12 months. Your results depend on invoice volume and payment terms.',
  },
  argTypes: {
    showImage: bool('Show image', 'The 3:4 photo (office or customer).'),
    showEyebrow: bool('Show eyebrow', 'Short label above the title.'),
    eyebrow: text('Eyebrow', 'Short label above the title.'),
    title: text('Title', 'Section title (h2).'),
    description: text('Description', 'Who was measured and how.'),
    showNote: bool('Show note', 'Conditions behind the numbers.'),
    note: text('Note', 'Conditions behind the numbers.'),
  },
  render: a => <StatsWithImage showImage={a.showImage} eyebrow={a.showEyebrow ? a.eyebrow : undefined} title={a.title} description={a.description} note={a.showNote ? a.note : undefined} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <Stats />
    <Stats header={{ overline: 'By the numbers', title: 'Teams close faster with Acme', description: 'What 1,240 finance teams changed in their first year.' }} />
    <StatsCards />
    <StatsSplit />
    <StatsBrandBand />
    <StatsWithImage />
  </div>
);

/** Shared checks at every width: landmarks, headings, names, no sideways scroll. */
async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(6);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(5);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const img of root.querySelectorAll('img')) await expect(img).toHaveAttribute('alt');
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;
const slot = (root: HTMLElement, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Stats: 289 high (64 padding, strip 129, 16, source 16), four in a row in 1152.
    const stats = c.getByRole('region', { name: 'Acme in numbers' });
    await expect(r(box(stats).height)).toBe(289);
    const strip = slot(stats, 'metric-strip');
    await expect(r(box(strip).width)).toBe(1152);
    await expect(r(box(strip).top - box(stats).top)).toBe(64);
    const statItems = items(stats, 'metric-strip-item');
    await expect(tops(statItems)).toBe(1);
    await expect(r(box(statItems[0]!).width)).toBe(288);
    await expect(r(box(statItems[0]!).height)).toBe(96);
    // Stats with header: Section Header 64 above the strip.
    const withHeader = c.getByRole('region', { name: 'Teams close faster with Acme' });
    await expect(r(box(slot(withHeader, 'metric-strip')).top - box(slot(withHeader, 'section-header')).bottom)).toBe(64);
    // Stats Cards: four 270 wide cards, 172 high, 24 apart, 48 under the header.
    const cards = c.getByRole('region', { name: 'Trusted by finance teams in 40 countries' });
    const statCards = items(cards, 'stat-card');
    await expect(statCards).toHaveLength(4);
    await expect(tops(statCards)).toBe(1);
    await expect(r(box(statCards[0]!).width)).toBe(270);
    await expect(r(box(statCards[0]!).height)).toBe(172);
    await expect(r(box(statCards[1]!).left - box(statCards[0]!).right)).toBe(24);
    await expect(r(box(statCards[0]!).top - box(slot(cards, 'section-header')).bottom)).toBe(48);
    await expect(r(box(statCards[0]!).top - box(cards).top - box(slot(cards, 'section-header')).height)).toBe(96 + 48);
    // Stats Split: text and numbers side by side, 64 apart; numbers 2 × 2, 40 gap.
    const split = c.getByRole('region', { name: 'What changes in the first six months' });
    const row = slot(split, 'stats-split-row');
    const [text, numbers] = [row.children[0]!, row.children[1]!];
    await expect(r(box(text).width)).toBe(544);
    await expect(r(box(numbers).left - box(text).right)).toBe(64);
    const splitItems = items(split, 'metric-strip-item');
    await expect(tops(splitItems)).toBe(2);
    await expect(r(box(splitItems[0]!).height)).toBe(88);
    await expect(c.getByRole('link', { name: 'See the methodology' })).toHaveAttribute('href', '#methodology');
    // Brand Band: primary, 80 padding, four figures in a row, 48 tall values.
    const band = c.getByRole('region', { name: 'The numbers behind 1,200 finance teams' });
    await expect(r(box(band.querySelector('h2')!).top - box(band).top)).toBe(80);
    const figures = items(band, 'figure');
    await expect(tops(figures)).toBe(1);
    await expect(r(box(figures[0]!).height)).toBe(72);
    // Stats with Image: 480 × 640 image, content 64 to the right, figures 2 per row.
    const withImage = c.getByRole('region', { name: 'What changes after one year on Acme' });
    const img = slot(withImage, 'image-placeholder');
    await expect(r(box(img).width)).toBe(480);
    await expect(r(box(img).height)).toBe(640);
    const imgFigures = items(withImage, 'figure');
    await expect(tops(imgFigures)).toBe(2);
    await expect(r(box(imgFigures[0]!).width)).toBe(288);
    await expect(r(box(withImage).height)).toBe(832);
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    // Strip keeps 4 in a row; cards 2 per row; split, image stack; brand band 2 per row.
    await expect(tops(items(c.getByRole('region', { name: 'Acme in numbers' }), 'metric-strip-item'))).toBe(1);
    await expect(tops(items(c.getByRole('region', { name: 'Trusted by finance teams in 40 countries' }), 'stat-card'))).toBe(2);
    const row = slot(c.getByRole('region', { name: 'What changes in the first six months' }), 'stats-split-row');
    await expect(box(row.children[1]!).top).toBeGreaterThan(box(row.children[0]!).bottom);
    await expect(tops(items(c.getByRole('region', { name: 'The numbers behind 1,200 finance teams' }), 'figure'))).toBe(2);
    const imgRow = slot(c.getByRole('region', { name: 'What changes after one year on Acme' }), 'stats-with-image-row');
    await expect(box(imgRow.children[1]!).top).toBeGreaterThan(box(imgRow.children[0]!).bottom);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    // Strip 2 per row with 24 px side gutters; cards and figures one per row.
    const stats = c.getByRole('region', { name: 'Acme in numbers' });
    await expect(tops(items(stats, 'metric-strip-item'))).toBe(2);
    await expect(r(box(slot(stats, 'metric-strip')).left - box(stats).left)).toBe(24);
    await expect(tops(items(c.getByRole('region', { name: 'Trusted by finance teams in 40 countries' }), 'stat-card'))).toBe(4);
    await expect(tops(items(c.getByRole('region', { name: 'The numbers behind 1,200 finance teams' }), 'figure'))).toBe(4);
    await expect(tops(items(c.getByRole('region', { name: 'What changes after one year on Acme' }), 'figure'))).toBe(4);
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
