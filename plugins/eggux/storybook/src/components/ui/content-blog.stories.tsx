import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { BlogFeatured, BlogGrid, BlogList, BlogPostHeader, NewsList } from './content-blog';

interface Args {
  overline: string;
  title: string;
  description: string;
  showOverline: boolean;
  showDescription: boolean;
  showFeatured?: boolean;
  showPagination?: boolean;
  showLink?: boolean;
  showImage?: boolean;
  category?: string;
}

const meta: Meta<Args> = {
  title: 'Blocks/Content/Blog',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Blog and news sections, each a region named by its title. Blog List: the blog index (featured post, 3-column grid, pagination). Blog Grid: three recent posts on another page with "View all posts". Blog Featured: one lead story and a "More stories" list. Blog Post Header: the top of an article (category, h1, lead, author and date, cover). News List: dated announcements. Newest first. Columns follow the block width. Figma: BLOCKS / Content (Blog). Guide: eggux build-ui/patterns/content-and-docs.md' } },
  },
  argTypes: {
    overline: { name: 'Overline', control: 'text', table: { category: 'Section Header' } },
    title: { name: 'Title', control: 'text', table: { category: 'Section Header' } },
    description: { name: 'Description', control: 'text', table: { category: 'Section Header' } },
    showOverline: { name: 'Show overline', control: 'boolean', table: { category: 'Section Header' } },
    showDescription: { name: 'Show description', control: 'boolean', table: { category: 'Section Header' } },
  },
};
export default meta;
type Story = StoryObj<Args>;

const head = (a: Args) => ({ overline: a.showOverline ? a.overline : '', title: a.title, description: a.showDescription ? a.description : '' });
const heading = (overline: string, title: string, description: string) => ({ overline, title, description, showOverline: true, showDescription: true });

export const List: Story = {
  name: 'Blog List',
  args: { ...heading('Blog', 'Notes from the team', 'Product updates, guides and lessons from building Acme.'), showFeatured: true, showPagination: true },
  argTypes: {
    showFeatured: { name: 'Show featured post', control: 'boolean', description: 'The newest post on top, as a horizontal Post Card.', table: { category: 'Posts' } },
    showPagination: { name: 'Show pagination', control: 'boolean', table: { category: 'Posts' } },
  },
  render: a => <BlogList {...head(a)} featured={a.showFeatured ? undefined : null} pageCount={a.showPagination ? 25 : 0} />,
};

export const Grid: Story = {
  name: 'Blog Grid',
  args: { ...heading('Blog', 'From the blog', 'Product updates, guides and stories from finance and operations teams.'), showLink: true },
  argTypes: { showLink: { name: 'Show "View all posts"', control: 'boolean', table: { category: 'Section Header' } } },
  render: a => <BlogGrid {...head(a)} link={a.showLink ? undefined : null} />,
};

export const Featured: Story = {
  name: 'Blog Featured',
  args: { title: 'More stories' },
  argTypes: { overline: { table: { disable: true } }, description: { table: { disable: true } }, showOverline: { table: { disable: true } }, showDescription: { table: { disable: true } }, title: { name: 'Side list title', control: 'text', table: { category: 'More stories' } } },
  render: a => <BlogFeatured moreTitle={a.title} />,
};

export const PostHeader: Story = {
  name: 'Blog Post Header',
  args: { title: 'Inside our new approvals engine: rules, delegation and escalation', description: 'How we rebuilt approvals so finance teams can model any policy without code, and what we learned from 40 customer interviews.', category: 'Product', showDescription: true, showImage: true },
  argTypes: {
    overline: { table: { disable: true } }, showOverline: { table: { disable: true } },
    title: { name: 'Title', control: 'text', table: { category: 'Article' } },
    description: { name: 'Lead', control: 'text', table: { category: 'Article' } },
    showDescription: { name: 'Show lead', control: 'boolean', table: { category: 'Article' } },
    category: { name: 'Category', control: 'text', table: { category: 'Article' } },
    showImage: { name: 'Show cover image', control: 'boolean', table: { category: 'Article' } },
  },
  render: a => <BlogPostHeader title={a.title} lead={a.showDescription ? a.description : ''} category={a.category} showImage={a.showImage} />,
};

export const News: Story = {
  name: 'News List',
  args: { ...heading('Newsroom', 'Latest news', 'Announcements, releases and company updates.'), showLink: true },
  argTypes: { showLink: { name: 'Show "All news"', control: 'boolean', table: { category: 'Section Header' } } },
  render: a => <NewsList {...head(a)} link={a.showLink ? undefined : null} />,
};

/* Hidden checks */

const All = ({ width }: { width: number }) => (
  <div style={{ width }} className="flex flex-col">
    <BlogList />
    <BlogGrid />
    <BlogFeatured />
    <NewsList />
  </div>
);

const box = (el: Element) => el.getBoundingClientRect();
const columns = (el: Element | null) => new Set(Array.from(el!.children).map(c => Math.round(box(c).left))).size;
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;

async function common(canvasElement: HTMLElement, width: number) {
  const c = within(canvasElement);
  await expect(c.queryAllByRole('heading', { level: 1 })).toHaveLength(0);
  for (const name of ['Notes from the team', 'From the blog', 'Latest news']) {
    const region = c.getByRole('region', { name });
    await expect(within(region).getByRole('heading', { level: 2, name })).toBeInTheDocument();
  }
  const featured = c.getByRole('region', { name: 'Featured stories' });
  await expect(within(featured).getAllByRole('heading', { level: 2 })).toHaveLength(2);
  for (const r of c.getAllByRole('region')) {
    await expect(Math.round(box(r).width)).toBe(width);
    await expect(r.scrollWidth).toBeLessThanOrEqual(width);
  }
  for (const el of [...c.getAllByRole('link'), ...c.getAllByRole('button')]) await expect(el).toHaveAccessibleName();
}

// Figma at 1440: 96 padding, 1152 content (News 896); grids of 3; featured 656 + 448.
export const Desktop: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const [list, grid, featured, news] = Array.from(canvasElement.querySelectorAll<HTMLElement>('section')) as HTMLElement[];
    for (const s of [list!, grid!, featured!]) {
      const inner = slot(s, 'section-container');
      await expect(getComputedStyle(inner).paddingTop).toBe('96px');
      await expect(Math.round(box(inner).width - 48)).toBe(1152);
    }
    await expect(Math.round(box(slot(news!, 'section-container')).width - 48)).toBe(896);
    await expect(columns(slot(list!, 'blog-list-grid'))).toBe(3);
    await expect(Math.round(box(slot(list!, 'blog-list-grid').children[0]!).width)).toBe(352);
    await expect(slot(list!, 'blog-list-featured').querySelector('[data-layout="horizontal"]')).toBeVisible();
    await expect(columns(slot(grid!, 'blog-grid-posts'))).toBe(3);
    await expect(Math.round(box(slot(grid!, 'blog-grid-posts').children[0]!).width)).toBe(363);
    await expect(Math.round(box(slot(featured!, 'blog-featured-more')).width)).toBe(448);
    await expect(Math.round(box(featured!.querySelector('[data-slot="post-card"]')!).width)).toBe(656);
    await expect(Math.round(box(featured!.querySelector('[data-slot="story-row"] [data-slot="image-placeholder"]') ?? featured!.querySelector('[data-slot="story-row"] > div')!).width)).toBe(144);
    // News rows: date column 120, 24 vertical padding.
    const row = slot(news!, 'news-item');
    await expect(Math.round(box(row.querySelector('time')!).width)).toBe(120);
    await expect(getComputedStyle(row).paddingTop).toBe('24px');
    await expect(within(news!).getAllByRole('listitem')).toHaveLength(4);
    // Pagination named, current page marked.
    await expect(within(list!).getByRole('navigation', { name: 'Blog pages' })).toBeInTheDocument();
  },
};

// 768: grids drop to 2, the featured row stacks, the horizontal card stays.
export const Tablet: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const [list, grid, featured] = Array.from(canvasElement.querySelectorAll<HTMLElement>('section')) as HTMLElement[];
    await expect(columns(slot(list!, 'blog-list-grid'))).toBe(2);
    await expect(columns(slot(grid!, 'blog-grid-posts'))).toBe(2);
    await expect(columns(slot(featured!, 'blog-featured-row'))).toBe(1);
  },
};

// 390: one column, 64 padding, the featured post stacks, news dates sit above the title.
export const Phone: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const [list, grid, , news] = Array.from(canvasElement.querySelectorAll<HTMLElement>('section')) as HTMLElement[];
    await expect(getComputedStyle(slot(list!, 'section-container')).paddingTop).toBe('64px');
    await expect(columns(slot(list!, 'blog-list-grid'))).toBe(1);
    await expect(columns(slot(grid!, 'blog-grid-posts'))).toBe(1);
    await expect(slot(list!, 'blog-list-featured').querySelector('[data-layout="vertical"]')).toBeVisible();
    await expect(slot(list!, 'blog-list-featured').querySelector('[data-layout="horizontal"]')).not.toBeVisible();
    const row = slot(news!, 'news-item');
    await expect(box(row.querySelector('time')!).bottom).toBeLessThanOrEqual(box(row.querySelector('h3')!).top);
  },
};

const widths = [1440, 768, 390];
const postTitle = 'Inside our new approvals engine';

// Post header: one h1, Byline with the date in <time>, 768 text column and 1152 cover at 1440; no overflow at 390.
export const PostHeaderCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {widths.map(w => <div key={w} style={{ width: w }}><BlogPostHeader title={`${postTitle} (${w})`} /></div>)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    for (const w of widths) {
      const r = c.getByRole('region', { name: `${postTitle} (${w})` });
      await expect(within(r).getAllByRole('heading', { level: 1 })).toHaveLength(1);
      await expect(r.scrollWidth).toBeLessThanOrEqual(w);
      await expect(r.querySelector('time')).toHaveAttribute('datetime', '2026-10-21');
    }
    const wide = c.getByRole('region', { name: `${postTitle} (1440)` });
    await expect(Math.round(box(slot(wide, 'blog-post-header-text')).width)).toBe(768);
    await expect(Math.round(box(slot(wide, 'blog-post-header-image')).width)).toBe(1152);
    await expect(Math.round(box(slot(wide, 'blog-post-header-image')).height)).toBe(648);
  },
};

// Pagination moves the page; the featured story row is one link.
export const Interactions: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div style={{ width: 1440 }}><BlogList /><BlogFeatured /></div>,
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Blog pages' });
    await userEvent.click(within(nav).getByRole('button', { name: /Next/ }));
    await waitFor(() => expect(within(nav).getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page'));
    await expect(canvas.getByRole('link', { name: 'Setting up SSO with Okta in 15 minutes' })).toHaveAttribute('href', '#sso-okta');
  },
};

export const AllDark: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, globals: { theme: 'Dark' }, render: () => <div className="w-[1440px]"><All width={1440} /><BlogPostHeader /></div> };
export const AllCorporate: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, globals: { theme: 'Corporate Light' }, render: () => <div className="w-[1440px]"><All width={1440} /><BlogPostHeader /></div> };

