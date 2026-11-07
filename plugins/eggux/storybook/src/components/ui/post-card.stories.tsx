import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PostCard } from './post-card';

// A sample cover: a light upper half and a darker lower half, like a real photo under the scrim.
const cover = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cbd5e1"/><stop offset="1" stop-color="#334155"/></linearGradient></defs><rect width="640" height="800" fill="url(#g)"/></svg>');

const base = {
  title: 'How we cut onboarding time in half with checklists',
  href: '#post',
  category: 'Product',
  meta: '12 Oct 2026 · 6 min read',
  excerpt: 'Three changes to the first-run experience, the data behind them, and what we would do differently next time.',
  author: { name: 'Maria Ilie', initials: 'MI' },
};

const meta = {
  title: 'Components/Card/Post Card',
  component: PostCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Article, news or case-study card: 16:9 image, category and date · reading time, title, a 3-line excerpt and the author. vertical for blog grids of 3, horizontal for the featured post, compact for link rows in asides, overlay for one lead story over its photo. Size sm for dense grids. The whole card links to the article. Figma: Card page / Post Card. Guide: eggux build-ui/components/card.md' } },
  },
  args: base,
  render: args => <div className="w-[352px]"><PostCard {...args} /></div>,
} satisfies Meta<typeof PostCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Layout=vertical: 352 wide, 16:9 image (198), the title is the one link and an h3.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="post-card"]')!;
    await expect(Math.round(box(card.querySelector('[data-slot="image-placeholder"]')!).height)).toBe(198);
    const link = canvas.getByRole('link', { name: base.title });
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
    await expect(canvas.getByRole('heading', { level: 3 })).toContainElement(link);
    // The link covers the whole card.
    const cover = getComputedStyle(link, '::after');
    await expect(cover.position).toBe('absolute');
  },
};

// Layouts: horizontal 1152 (image 560 × 315), compact 288 (60 high) with and without image, sm grid.
export const Layouts: Story = {
  render: args => (
    <div className="flex flex-col gap-10">
      <div className="w-[1152px]"><PostCard {...args} layout="horizontal" /></div>
      <div className="flex gap-8">
        <div className="w-[288px]"><PostCard {...args} layout="compact" /></div>
        <div className="w-[288px]"><PostCard {...args} layout="compact" image={cover} /></div>
        <div className="w-[352px]"><PostCard {...args} size="sm" /></div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [horizontal, compact, compactImg, sm] = canvasElement.querySelectorAll('[data-slot="post-card"]');
    await expect(Math.round(box(horizontal!.querySelector('[data-slot="image-placeholder"]')!).height)).toBe(315);
    await expect(Math.round(box(compact!).height)).toBe(60);
    await expect(Math.round(box(compactImg!.querySelector('img')!).width)).toBe(64);
    await expect(Math.round(box(sm!).height)).toBeLessThan(Math.round(box(compact!).height) * 10);
  },
};

// Figma Layout=overlay: 352 × 440 on the photo, white text on the 60% scrim.
export const Overlay: Story = {
  args: { layout: 'overlay', image: cover },
  play: async ({ canvas, canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="post-card"]')!;
    await expect(Math.round(box(card).height)).toBe(440);
    const heading = canvas.getByRole('heading');
    await expect(getComputedStyle(heading).color).toBe('rgb(255, 255, 255)');
  },
};

// Stress: a long title and excerpt clamp the excerpt to 3 lines at 276; compact title to 2 lines. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: {
    title: 'How a five-person finance team cut onboarding time in half with checklists, templates and a lot of patience',
    excerpt: 'Three changes to the first-run experience, the data behind them, what we would do differently next time, and the mistakes we made with reminders, roles and the order of steps that cost us two months.',
  },
  render: args => (
    <div className="flex gap-8">
      <div className="w-[276px]"><PostCard {...args} /></div>
      <div className="w-[240px]"><PostCard {...args} layout="compact" /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    const excerpt = canvas.getByText(/Three changes/);
    await expect(Math.round(box(excerpt).height)).toBe(60);
    const [, compactHeading] = canvas.getAllByRole('heading');
    await expect(Math.round(box(compactHeading!).height)).toBe(40);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, args: { layout: 'overlay', image: cover } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
