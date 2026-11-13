import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { GalleryGrid, GalleryMosaic } from './section-gallery';

const meta = {
  title: 'Blocks/Sections/Gallery',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Photo sections. Gallery Grid: places and events, a masonry of Image Figures with captions under a Section Header; each photo opens the Lightbox. Gallery Mosaic: a property, product or venue detail page, one large photo and four small ones with "Show all" opening the Lightbox. Figma: BLOCKS / Sections (Gallery). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

type GridArgs = { overline: string; title: string; description: string; lightbox: boolean };
export const Grid: StoryObj<GridArgs> = {
  name: 'Gallery Grid',
  args: { overline: 'Gallery', title: 'Inside our offices', description: 'Bucharest, Berlin and London.', lightbox: true },
  argTypes: {
    overline: text('Overline', 'Section Header overline.', 'Section Header'),
    title: text('Title', 'Section Header title (h2).', 'Section Header'),
    description: text('Description', 'Section Header description.', 'Section Header'),
    lightbox: bool('Open in lightbox', 'Each photo opens full screen in the Lightbox.'),
  },
  render: a => <GalleryGrid overline={a.overline} title={a.title} description={a.description} lightbox={a.lightbox} />,
};

type MosaicArgs = { label: string; showAll: boolean };
export const Mosaic: StoryObj<MosaicArgs> = {
  name: 'Gallery Mosaic',
  args: { label: 'Photos of the Acme offices', showAll: true },
  argTypes: {
    label: text('Label', 'Name of the section for screen readers (no visible title).'),
    showAll: bool('Show all button', 'The "Show all N photos" button that opens the Lightbox.'),
  },
  render: a => <GalleryMosaic label={a.label} showAll={a.showAll} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];
const lefts = (els: Element[]) => new Set(els.map(e => r(box(e).left))).size;

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <GalleryGrid />
    <GalleryMosaic />
  </div>
);

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(2);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const img of root.querySelectorAll('img')) await expect(img).toHaveAttribute('alt');
  await expect(items(root, 'image-figure')).toHaveLength(9);
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Grid: 96 padding, header 48 above three 368 columns, 24 apart.
    const grid = c.getByRole('region', { name: 'Inside our offices' });
    const header = slot(grid, 'section-header');
    await expect(r(box(header).top - box(grid).top)).toBe(96);
    const photos = slot(grid, 'gallery-grid-photos');
    await expect(r(box(photos).width)).toBe(1152);
    await expect(r(box(photos).top - box(header).bottom)).toBe(48);
    const figs = items(grid, 'image-figure');
    await expect(lefts(figs)).toBe(3);
    await expect(r(box(figs[0]!).width)).toBe(368);
    await expect(r(box(figs[3]!).left - box(figs[0]!).right)).toBe(24);
    // Column by column: kitchen, team room, reception in the first column.
    await expect(r(box(figs[1]!).left)).toBe(r(box(figs[0]!).left));
    await expect(r(box(figs[1]!).top - box(figs[0]!).bottom)).toBe(24);
    // Mosaic: 572 photo next to the 2 × 2 grid, 8 apart; small photos 282 wide.
    const mosaic = c.getByRole('region', { name: 'Photos of the Acme offices' });
    const tiles = items(mosaic, 'image-placeholder');
    await expect(tiles).toHaveLength(5);
    await expect(r(box(tiles[0]!).width)).toBe(572);
    await expect(r(box(tiles[1]!).width)).toBe(282);
    await expect(r(box(tiles[1]!).left - box(tiles[0]!).right)).toBe(8);
    await expect(r(box(tiles[3]!).top - box(tiles[1]!).bottom)).toBe(8);
    await expect(r(box(slot(mosaic, 'gallery-mosaic-row')).top - box(mosaic).top)).toBe(96);
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    await expect(lefts(items(c.getByRole('region', { name: 'Inside our offices' }), 'image-figure'))).toBe(2);
    // Mosaic keeps the large photo next to the grid from 768.
    const tiles = items(c.getByRole('region', { name: 'Photos of the Acme offices' }), 'image-placeholder');
    await expect(box(tiles[1]!).left).toBeGreaterThan(box(tiles[0]!).right);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    const grid = c.getByRole('region', { name: 'Inside our offices' });
    await expect(lefts(items(grid, 'image-figure'))).toBe(1);
    await expect(r(box(slot(grid, 'gallery-grid-photos')).left - box(grid).left)).toBe(24);
    // Mosaic stacks below 768: the large photo above the grid.
    const tiles = items(c.getByRole('region', { name: 'Photos of the Acme offices' }), 'image-placeholder');
    await expect(box(tiles[1]!).top).toBeGreaterThan(box(tiles[0]!).bottom);
  },
};

/** Lightbox: a photo opens it at that photo; Esc closes and focus returns; Show all opens at the first. */
export const LightboxCheck: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(document.body);
    const trigger = c.getByRole('button', { name: 'Open photo: Berlin, team room' });
    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog');
    await expect(dialog).toHaveTextContent('2 / 9');
    await expect(dialog).toHaveTextContent('Berlin, team room');
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(dialog).toHaveTextContent('London, reception'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
    const showAll = c.getByRole('button', { name: 'Show all 8 photos' });
    await userEvent.click(showAll);
    const dialog2 = await body.findByRole('dialog');
    await expect(dialog2).toHaveTextContent('1 / 8');
    await userEvent.click(within(dialog2).getByRole('button', { name: 'Close viewer' }));
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(showAll).toHaveFocus());
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
