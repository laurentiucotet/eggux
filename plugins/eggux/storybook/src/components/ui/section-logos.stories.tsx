import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { LogoCloud, LogoGrid, LogoMarquee, LogosSplit, PressMentions } from './section-logos';

const meta = {
  title: 'Blocks/Sections/Logos',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Customer, partner and press proof, logos in one muted color (real customers only, with permission). Logo Cloud: two rows under a caption. Logo Grid: its own customers section. Logos Split: partners or investors with one sentence of context. Logo Marquee: right under the hero; it stops with reduced motion, on hover and with its pause button. Press Mentions: real articles with a short quote, writer, publication, month and a link. Figma: BLOCKS / Sections (Logo Cloud). Guide: eggux build-ui/patterns/marketing-pages.md',
      },
    },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

export const Default: StoryObj<{ caption: string }> = {
  name: 'Logo Cloud',
  args: { caption: 'Trusted by 1,200 finance teams in 38 countries, from startups to listed companies' },
  argTypes: { caption: text('Caption', 'Who the logos are: count and scope.') },
  render: a => <LogoCloud caption={a.caption} />,
};

type GridArgs = { overline: string; title: string; description: string; showLink: boolean };
export const Grid: StoryObj<GridArgs> = {
  name: 'Logo Grid',
  args: {
    overline: 'Customers',
    title: 'Finance teams in 38 countries run on Acme',
    description: 'From five-person agencies to listed companies, 1,200 teams send their invoices and approvals through Acme.',
    showLink: true,
  },
  argTypes: {
    overline: text('Overline', 'Section Header overline.', 'Section Header'),
    title: text('Title', 'Section Header title.', 'Section Header'),
    description: text('Description', 'Section Header description.', 'Section Header'),
    showLink: bool('Show link', 'Link to the customer stories.'),
  },
  render: a => <LogoGrid header={{ overline: a.overline, title: a.title, description: a.description }} link={a.showLink ? undefined : null} />,
};

type SplitArgs = { overline: string; title: string; description: string; showLink: boolean };
export const Split: StoryObj<SplitArgs> = {
  name: 'Logos Split',
  args: {
    overline: 'Partners',
    title: 'Built with the partners your finance team already uses',
    description: 'Acme connects to the accounting, banking and payroll tools on the right, so invoices, payments and approvals stay in sync without exports.',
    showLink: true,
  },
  argTypes: {
    overline: text('Overline', 'Short label above the title.'),
    title: text('Title', 'Section title (h2).'),
    description: text('Description', 'One sentence of context.'),
    showLink: bool('Show link', 'Link to all partners or integrations.'),
  },
  render: a => <LogosSplit overline={a.overline} title={a.title} description={a.description} link={a.showLink ? undefined : null} />,
};

type MarqueeArgs = { caption: string; duration: number };
export const Marquee: StoryObj<MarqueeArgs> = {
  name: 'Logo Marquee',
  args: { caption: 'Trusted by product and finance teams at 1,200 companies', duration: 40 },
  argTypes: {
    caption: text('Caption', 'Who the logos are.'),
    duration: { name: 'Duration', control: { type: 'range', min: 10, max: 120 }, description: 'Seconds for one full pass.', ...cat('Content') },
  },
  render: a => <LogoMarquee key={a.duration} caption={a.caption} duration={a.duration} />,
};

type PressArgs = { overline: string; title: string; showAlso: boolean };
export const Press: StoryObj<PressArgs> = {
  name: 'Press Mentions',
  args: { overline: 'In the press', title: 'Finance teams are talking about Acme', showAlso: true },
  argTypes: {
    overline: text('Overline', 'Section Header overline.', 'Section Header'),
    title: text('Title', 'Section Header title.', 'Section Header'),
    showAlso: bool('Show also featured', 'More publications, mastheads only.'),
  },
  render: a => <PressMentions header={{ overline: a.overline, title: a.title }} alsoFeatured={a.showAlso ? undefined : []} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];
const section = (root: HTMLElement, name: string) => root.querySelector(`section[data-slot="${name}"]`) as HTMLElement;

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <LogoCloud />
    <LogoGrid />
    <LogosSplit />
    <LogoMarquee />
    <PressMentions />
  </div>
);

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  const sections = [...root.querySelectorAll(':scope > div > section')];
  await expect(sections).toHaveLength(5);
  for (const s of sections) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  // Logo Cloud and Logo Marquee are named by their caption; the others have an h2.
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(3);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  // Every logo shown is named by its brand (the marquee copy is hidden).
  for (const logo of root.querySelectorAll('[data-slot="brand-logo"]')) if (!logo.closest('[aria-hidden="true"]')) await expect(logo).toHaveAccessibleName();
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    // Logo Cloud: 64 padding, caption 32 above two rows of four 288 x 72 tiles, 16 between rows.
    const cloud = section(canvasElement, 'logo-cloud');
    await expect(cloud).toHaveAccessibleName('Trusted by 1,200 finance teams in 38 countries, from startups to listed companies');
    await expect(r(box(cloud.querySelector('p')!).top - box(cloud).top)).toBe(64);
    const tiles = items(cloud, 'logo-tile');
    await expect(tiles).toHaveLength(8);
    await expect(tops(tiles)).toBe(2);
    await expect(r(box(tiles[0]!).width)).toBe(288);
    await expect(r(box(tiles[0]!).height)).toBe(72);
    await expect(r(box(tiles[4]!).top - box(tiles[0]!).bottom)).toBe(16);
    // Logo Grid: bordered 276 tiles, 16 apart; link 40 under them.
    const grid = section(canvasElement, 'logo-grid');
    const gridTiles = items(grid, 'logo-tile');
    await expect(r(box(gridTiles[0]!).width)).toBe(276);
    await expect(r(box(gridTiles[1]!).left - box(gridTiles[0]!).right)).toBe(16);
    const link = within(grid).getByRole('link', { name: 'Read customer stories' });
    await expect(r(box(link).top - box(gridTiles[7]!).bottom)).toBe(40);
    // Logos Split: 448 text, 64 from the 640 panel; 3 tiles per row.
    const split = section(canvasElement, 'logos-split');
    const row = slot(split, 'logos-split-row');
    await expect(r(box(row.children[0]!).width)).toBe(448);
    await expect(r(box(row.children[1]!).width)).toBe(640);
    await expect(r(box(row.children[1]!).left - box(row.children[0]!).right)).toBe(64);
    await expect(tops(items(split, 'logo-tile'))).toBe(2);
    // Marquee: full-width track, tiles 192; the copy is hidden; the pause button stops it.
    const marquee = section(canvasElement, 'logo-marquee');
    const viewport = slot(marquee, 'logo-marquee-viewport');
    await expect(r(box(viewport).width)).toBe(1440);
    await expect(r(box(items(marquee, 'logo-tile')[0]!).width)).toBe(192);
    const lists = marquee.querySelectorAll('ul');
    await expect(lists).toHaveLength(2);
    await expect(lists[1]).toHaveAttribute('aria-hidden', 'true');
    await expect(within(marquee).getAllByRole('list')).toHaveLength(1);
    await expect(viewport).toHaveAttribute('data-moving', 'true');
    const pause = within(marquee).getByRole('button', { name: 'Pause logo animation' });
    await userEvent.click(pause);
    await waitFor(() => expect(within(marquee).getByRole('button', { name: 'Play logo animation' })).toHaveAttribute('aria-pressed', 'true'));
    await expect(viewport).not.toHaveAttribute('data-moving');
    await userEvent.click(within(marquee).getByRole('button', { name: 'Play logo animation' }));
    await userEvent.pointer({ target: document.body, coords: { x: 0, y: 0 } });
    // Press: three cards 32 apart in a row, equal heights; links name the publication.
    const press = section(canvasElement, 'press-mentions');
    const cards = items(press, 'press-mention');
    await expect(tops(cards)).toBe(1);
    await expect(r(box(cards[1]!).left - box(cards[0]!).right)).toBe(32);
    await expect(r(box(cards[0]!).height)).toBe(r(box(cards[1]!).height));
    await expect(within(press).getByRole('link', { name: 'Read the article in The Ledger Review' })).toHaveAttribute('href', '#ledger-review');
    await expect(within(press).getByText('The Ledger Review, March 2026')).toBeVisible();
    await expect(within(press).getByRole('img', { name: 'Margin Weekly' })).toBeVisible();
    await expect(within(section(canvasElement, 'logo-grid')).getByRole('img', { name: 'Brightpath' })).toBeVisible();
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    // Cloud and grid keep 4 per row; split stacks; press keeps 3.
    await expect(tops(items(section(canvasElement, 'logo-cloud'), 'logo-tile'))).toBe(2);
    await expect(tops(items(section(canvasElement, 'logo-grid'), 'logo-tile'))).toBe(2);
    const row = slot(section(canvasElement, 'logos-split'), 'logos-split-row');
    await expect(box(row.children[1]!).top).toBeGreaterThan(box(row.children[0]!).bottom);
    await expect(tops(items(section(canvasElement, 'press-mentions'), 'press-mention'))).toBe(1);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    // Two logos per row, 24 px gutters; press cards stack.
    const cloud = section(canvasElement, 'logo-cloud');
    const tiles = items(cloud, 'logo-tile');
    await expect(tops(tiles)).toBe(4);
    await expect(r(box(tiles[0]!).left - box(cloud).left)).toBe(24);
    await expect(tops(items(section(canvasElement, 'logos-split'), 'logo-tile'))).toBe(3);
    await expect(tops(items(section(canvasElement, 'press-mentions'), 'press-mention'))).toBe(3);
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
