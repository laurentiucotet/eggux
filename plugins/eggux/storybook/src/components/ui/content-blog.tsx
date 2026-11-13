// EGG UI blocks, BLOCKS / Content page (138:2), Blog family: Block / Blog List (138:3), Blog Grid
// (200:987), Blog Featured (200:1069), Blog Post Header (200:1130), News List (200:1151).
// Every block is a <section> named by its title, on background/default, 96 px top and bottom (64 on
// narrow screens), content 1152 wide (News List 896, the post header text 768) with 24 px side
// gutters. Columns follow the block's own width (container queries), so a block in a narrow column
// stacks like on a phone.
// Lists: newest first, the featured post on top, pagination at the end (Blog List). Cards are the
// library Post Card (title link stretched over the card); the post header uses Badge, Byline and an
// Image Placeholder. Images are placeholders here: pass `image` URLs in an app.
// Guide: eggux build-ui/patterns/content-and-docs.md (Blog lists, Article top).
import * as React from 'react';
import { ArrowRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Byline } from './byline';
import { ImagePlaceholder } from './image-placeholder';
import { Pagination } from './pagination';
import { PostCard, type PostCardAuthor } from './post-card';
import { SectionHeader } from './section-header-block';

/* Shared parts */

export interface BlogLink { label: string; href: string }

export interface BlogPost {
  title: string;
  href: string;
  category?: string;
  /** "12 Oct 2026 · 6 min read". */
  meta?: string;
  excerpt?: string;
  author?: PostCardAuthor;
  image?: string;
  imageAlt?: string;
}

type SectionProps = Omit<React.ComponentProps<'section'>, 'title'>;

/** The section band: 96 / 64 vertical padding, content `max` wide, centered column. */
function Band({ titleId, label, max = 'max-w-[1200px]', gap = 'gap-12', className, children, ...props }: SectionProps & { titleId?: string; label?: string; max?: string; gap?: string }) {
  return (
    <section aria-labelledby={label ? undefined : titleId} aria-label={label} className={cn('@container w-full bg-background text-foreground', className)} {...props}>
      <div data-slot="section-container" className={cn('mx-auto flex w-full flex-col px-6 py-16 @3xl:py-24', max, gap)}>{children}</div>
    </section>
  );
}

const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');

/* Blog List */

export interface BlogListProps extends SectionProps {
  overline?: string;
  title?: string;
  description?: string;
  /** Figma featured Post Card Layout=horizontal; it stacks below 768. */
  featured?: BlogPost | null;
  posts?: BlogPost[];
  /** Pagination: current page and page count. Leave pageCount 0 to hide it. */
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}

const blogListFeatured: BlogPost = {
  title: 'How we cut onboarding time in half with checklists',
  href: '#onboarding-checklists',
  category: 'Product',
  meta: '12 Oct 2026 · 6 min read',
  excerpt: 'Three changes to the first-run experience, the data behind them, and what we would do differently next time.',
  author: { name: 'Maria Ilie' },
};

const blogListPosts: BlogPost[] = [
  { title: 'Pricing pages that convert: 9 patterns', href: '#pricing-patterns', category: 'Design', meta: '8 Oct 2026 · 9 min read', excerpt: 'We reviewed 120 pricing pages and found nine patterns that make plans easier to compare and choose.', author: { name: 'Tudor Lazar' } },
  { title: 'Shipping dark mode without breaking contrast', href: '#dark-mode', category: 'Engineering', meta: '1 Oct 2026 · 7 min read', excerpt: 'Token tiers, contrast checks in CI and the three components we had to redraw before launch.', author: { name: 'Ana Popescu' } },
  { title: 'What 200 support tickets taught us about forms', href: '#support-forms', category: 'Research', meta: '24 Sep 2026 · 5 min read', excerpt: 'Most errors came from four fields. Here is how we rewrote labels, hints and validation messages.', author: { name: 'Radu Constantin' } },
  { title: 'Writing empty states people actually read', href: '#empty-states', category: 'Content', meta: '17 Sep 2026 · 4 min read', excerpt: 'One sentence that explains, one action that helps: a short guide with before and after examples.', author: { name: 'Sofia Barbu' } },
  { title: 'Our design tokens, three tiers and why', href: '#design-tokens', category: 'Design', meta: '9 Sep 2026 · 8 min read', excerpt: 'Primitives, semantic roles and component tokens, and how the split lets one file serve five brands.', author: { name: 'Victor Pop' } },
  { title: 'From spreadsheet to dashboard in a week', href: '#spreadsheet-dashboard', category: 'Customers', meta: '2 Sep 2026 · 6 min read', excerpt: 'How a five-person finance team replaced a shared workbook with live reports and fewer meetings.', author: { name: 'Irina Radu' } },
];

const card = (p: BlogPost) => ({
  title: p.title, href: p.href, category: p.category, meta: p.meta, excerpt: p.excerpt, image: p.image, imageAlt: p.imageAlt,
  author: p.author ? { initials: initialsOf(p.author.name), ...p.author } : undefined,
});

/** Block / Blog List: Section Header, the featured post (horizontal Post Card), a 3-column grid of Post Cards, Pagination. */
function BlogList({
  overline = 'Blog',
  title = 'Notes from the team',
  description = 'Product updates, guides and lessons from building Acme.',
  featured = blogListFeatured,
  posts = blogListPosts,
  page: pageProp,
  pageCount = 25,
  onPageChange,
  ...props
}: BlogListProps) {
  const id = React.useId();
  const [pageState, setPage] = React.useState(pageProp ?? 2);
  const page = pageProp ?? pageState;
  return (
    <Band titleId={id} data-slot="blog-list" {...props}>
      <SectionHeader titleId={id} align="left" overline={overline} title={title} description={description} className="max-w-none" />
      {featured ? (
        <div data-slot="blog-list-featured">
          {/* One card per width: horizontal from 768, stacked below (the hidden one is display:none). */}
          <PostCard {...card(featured)} layout="horizontal" headingLevel={3} className="hidden @3xl:flex" />
          <PostCard {...card(featured)} layout="vertical" headingLevel={3} className="@3xl:hidden" />
        </div>
      ) : null}
      <ul data-slot="blog-list-grid" className="m-0 grid list-none grid-cols-1 gap-12 p-0 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {posts.map(p => <li key={p.href} className="flex min-w-0"><PostCard {...card(p)} className="w-full" /></li>)}
      </ul>
      {pageCount > 1 ? (
        <Pagination
          className="self-center"
          page={page}
          pageCount={pageCount}
          labels={{ nav: 'Blog pages' }}
          onPageChange={p => { setPage(p); onPageChange?.(p); }}
        />
      ) : null}
    </Band>
  );
}

/* Blog Grid */

export interface BlogGridProps extends SectionProps {
  overline?: string;
  title?: string;
  description?: string;
  /** Figma Button outline "View all posts" with the arrow. */
  link?: BlogLink | null;
  posts?: BlogPost[];
}

const blogGridPosts: BlogPost[] = [
  { title: 'How we cut month-end close from nine days to five', href: '#month-end-close', category: 'Product', meta: 'Oct 21, 2026', excerpt: 'Approval chains, audit logs and one source of truth for invoices.', author: { name: 'Elena Popa' } },
  { title: 'Designing permission models that scale to 4,000 people', href: '#permission-models', category: 'Product', meta: 'Oct 14, 2026', excerpt: 'Roles, resources and the exceptions nobody plans for.', author: { name: 'Aisha Khan' } },
  { title: 'Reports people actually read: five rules', href: '#reports-rules', category: 'Product', meta: 'Oct 7, 2026', excerpt: 'Fixed periods, comparisons and one chart that matters.', author: { name: 'Mark Schulz' } },
];

/** Block / Blog Grid: Section Header with "View all posts" on the right, three Post Cards 32 apart. */
function BlogGrid({
  overline = 'Blog',
  title = 'From the blog',
  description = 'Product updates, guides and stories from finance and operations teams.',
  link = { label: 'View all posts', href: '#blog' },
  posts = blogGridPosts,
  ...props
}: BlogGridProps) {
  const id = React.useId();
  return (
    <Band titleId={id} data-slot="blog-grid" {...props}>
      <div data-slot="blog-grid-header" className="flex w-full flex-wrap items-end gap-x-8 gap-y-4">
        <SectionHeader titleId={id} align="left" overline={overline} title={title} description={description} className="max-w-none min-w-60 flex-1" />
        {link ? (
          <Button asChild variant="outline" className="shrink-0">
            <a href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></a>
          </Button>
        ) : null}
      </div>
      <ul data-slot="blog-grid-posts" className="m-0 grid list-none grid-cols-1 gap-8 p-0 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {posts.map(p => <li key={p.href} className="flex min-w-0"><PostCard {...card(p)} className="w-full" /></li>)}
      </ul>
    </Band>
  );
}

/* Blog Featured */

export interface BlogFeaturedProps extends SectionProps {
  /** Name of the region. */
  label?: string;
  featured?: BlogPost;
  /** "More stories": overline title (an h2) of the side list. */
  moreTitle?: string;
  more?: BlogPost[];
}

const blogFeaturedPost: BlogPost = {
  title: 'Inside our new approvals engine: rules, delegation and escalation',
  href: '#approvals-engine',
  category: 'Product',
  meta: 'Oct 21, 2026',
  excerpt: 'How we rebuilt approvals so finance teams can model any policy without code.',
  author: { name: 'Elena Popa' },
};

const blogFeaturedMore: BlogPost[] = [
  { title: 'Setting up SSO with Okta in 15 minutes', href: '#sso-okta', category: 'Guide', meta: 'Oct 18, 2026 · 6 min read' },
  { title: 'Lumora: one forecast for 12 sales teams', href: '#lumora', category: 'Customer story', meta: 'Oct 15, 2026 · 9 min read' },
  { title: 'October release: heatmaps and import mapping', href: '#october-release', category: 'Product', meta: 'Oct 10, 2026 · 4 min read' },
];

/** A row of the "More stories" list: 144 × 108 image (4:3), category Badge, title (body/large) and the date. */
function StoryRow({ post }: { post: BlogPost }) {
  return (
    <article data-slot="story-row" className="group/story relative flex min-w-0 items-start gap-4 rounded-lg outline-none has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/50">
      <ImagePlaceholder ratio="4:3" src={post.image} alt={post.imageAlt ?? ''} showCaption={false} className="w-28 shrink-0 rounded-lg @sm:w-36" />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        {post.category ? <Badge variant="secondary">{post.category}</Badge> : null}
        <h3 className="m-0 text-lg leading-7 font-medium text-foreground [overflow-wrap:anywhere] group-hover/story:underline">
          <a href={post.href} className="outline-none after:absolute after:inset-0 after:content-['']">{post.title}</a>
        </h3>
        {post.meta ? <p className="m-0 text-xs leading-4 text-muted-foreground">{post.meta}</p> : null}
      </div>
    </article>
  );
}

/** Block / Blog Featured: one big vertical Post Card (656) and a "More stories" list (448), 48 apart. */
function BlogFeatured({
  label = 'Featured stories',
  featured = blogFeaturedPost,
  moreTitle = 'More stories',
  more = blogFeaturedMore,
  ...props
}: BlogFeaturedProps) {
  const moreId = React.useId();
  return (
    <Band label={label} data-slot="blog-featured" {...props}>
      <div data-slot="blog-featured-row" className="grid w-full grid-cols-1 items-start gap-12 @5xl:grid-cols-[minmax(0,1fr)_448px]">
        <PostCard {...card(featured)} headingLevel={2} />
        <div data-slot="blog-featured-more" className="flex min-w-0 flex-col gap-6">
          <h2 id={moreId} className="m-0 text-xs leading-4 font-semibold tracking-widest text-muted-foreground uppercase">{moreTitle}</h2>
          <ul aria-labelledby={moreId} className="m-0 flex list-none flex-col gap-6 p-0">
            {more.map(p => <li key={p.href}><StoryRow post={p} /></li>)}
          </ul>
        </div>
      </div>
    </Band>
  );
}

/* Blog Post Header */

export interface BlogPostHeaderProps extends SectionProps {
  category?: string;
  title?: string;
  lead?: string;
  author?: { name: string; initials?: string; src?: string; href?: string };
  /** Shown date ("Oct 21, 2026") and the machine date. */
  date?: string;
  dateTime?: string;
  readingTime?: string;
  /** Cover image URL; the placeholder shows without it. */
  image?: string;
  imageAlt?: string;
  showImage?: boolean;
}

/** Block / Blog Post Header: the top of an article. Category Badge, h1, lead and Byline in a 768 column, then a 1152 cover (16:9). */
function BlogPostHeader({
  category = 'Product',
  title = 'Inside our new approvals engine: rules, delegation and escalation',
  lead = 'How we rebuilt approvals so finance teams can model any policy without code, and what we learned from 40 customer interviews.',
  author = { name: 'Elena Popa' },
  date = 'Oct 21, 2026',
  dateTime = '2026-10-21',
  readingTime = '8 min read',
  image,
  imageAlt = '',
  showImage = true,
  ...props
}: BlogPostHeaderProps) {
  const id = React.useId();
  return (
    <Band titleId={id} data-slot="blog-post-header" className="[&_[data-slot=section-container]]:items-center" {...props}>
      <div data-slot="blog-post-header-text" className="flex w-full max-w-3xl min-w-0 flex-col items-start gap-6">
        {category ? <Badge variant="outline">{category}</Badge> : null}
        <h1 id={id} className="m-0 w-full text-4xl leading-10 font-extrabold tracking-[-0.4px] text-foreground [overflow-wrap:anywhere]">{title}</h1>
        {lead ? <p className="m-0 w-full text-xl leading-7 text-pretty text-muted-foreground">{lead}</p> : null}
        <Byline
          name={author.name}
          href={author.href}
          avatar={{ initials: author.initials ?? initialsOf(author.name), src: author.src }}
          description={<><time dateTime={dateTime}>{date}</time>{readingTime ? ` · ${readingTime}` : null}</>}
        />
      </div>
      {showImage ? <ImagePlaceholder data-slot="blog-post-header-image" ratio="16:9" src={image} alt={imageAlt} className="w-full rounded-lg" /> : null}
    </Band>
  );
}

/* News List */

export interface NewsItem {
  title: string;
  href: string;
  description?: string;
  /** Shown date and machine date. */
  date: string;
  dateTime?: string;
}

export interface NewsListProps extends SectionProps {
  overline?: string;
  title?: string;
  description?: string;
  items?: NewsItem[];
  /** Figma Button link "All news" with the arrow. */
  link?: BlogLink | null;
}

const newsItems: NewsItem[] = [
  { title: 'Acme opens its Berlin office', href: '#berlin-office', description: 'A local team for customers in Germany, Austria and Switzerland.', date: 'Oct 21, 2026', dateTime: '2026-10-21' },
  { title: 'Acme achieves ISO 27001 certification', href: '#iso-27001', description: 'Independent audit of our information security management.', date: 'Oct 9, 2026', dateTime: '2026-10-09' },
  { title: 'Q3 product release: corporate theme and enterprise pack', href: '#q3-release', description: 'Data grid, approvals, audit log and roles in every plan.', date: 'Sep 30, 2026', dateTime: '2026-09-30' },
  { title: 'Acme named a leader in finance operations software', href: '#leader', description: 'Recognized for ease of use and time to value.', date: 'Sep 12, 2026', dateTime: '2026-09-12' },
];

/** Block / News List: Section Header, rows of date (120) · title and summary · arrow, divided by lines, then "All news". 896 wide. */
function NewsList({
  overline = 'Newsroom',
  title = 'Latest news',
  description = 'Announcements, releases and company updates.',
  items = newsItems,
  link = { label: 'All news', href: '#news' },
  ...props
}: NewsListProps) {
  const id = React.useId();
  return (
    <Band titleId={id} max="max-w-[944px]" gap="gap-8" data-slot="news-list" {...props}>
      <SectionHeader titleId={id} align="left" overline={overline} title={title} description={description} className="max-w-none" />
      <ul data-slot="news-list-items" className="m-0 flex list-none flex-col p-0">
        {items.map(item => (
          <li key={item.href} data-slot="news-item" className="group/news relative flex flex-col gap-2 border-b border-border py-6 @2xl:flex-row @2xl:gap-8">
            <time dateTime={item.dateTime} className="w-30 shrink-0 text-xs leading-4 text-muted-foreground @2xl:pt-1">{item.date}</time>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="m-0 text-lg leading-7 font-medium text-foreground [overflow-wrap:anywhere] group-hover/news:underline">
                <a href={item.href} className="rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-[3px] focus-visible:ring-ring/50">{item.title}</a>
              </h3>
              {item.description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{item.description}</p> : null}
            </div>
            <ArrowRight aria-hidden="true" className="hidden size-5 shrink-0 text-muted-foreground @2xl:block" />
          </li>
        ))}
      </ul>
      {link ? (
        <Button asChild variant="link" className="self-start px-0">
          <a href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></a>
        </Button>
      ) : null}
    </Band>
  );
}

export { BlogFeatured, BlogGrid, BlogList, BlogPostHeader, NewsList };
