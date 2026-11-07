// EGG UI Post Card. Figma: Post Card (Card page, "Post Card / Component", 136:558). Layout
// (vertical, horizontal, compact, overlay), Size (default, sm), Show excerpt, Show author, Show image.
// An article, news or case-study card: a 16:9 image (radius lg), a meta row (category Badge
// secondary + "date · reading time" ui/caption muted), the title, a 3-line excerpt and the author
// (24 avatar + ui/label).
// vertical: 16 gap, text 12 gap, h4 title (sm: 12 and 8 gaps). horizontal: 32 gap, the image half
// the width (160-640), h2 title and body/default excerpt (sm: the image a third, 120-240, h4 title).
// compact: a link row, title ui/label on 2 lines and the meta, optional 64 square image (sm 48 and
// ui/label-small). overlay: 440 tall (sm 320), the photo full bleed, a 64 fade and a media/scrim
// panel with the meta, title and author in media/foreground (no excerpt).
// A11y: the whole card links to the article through the title link, stretched over the card; the
// title is a heading; the image is decorative unless it says something the title does not.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge, type BadgeProps } from './badge';
import { ImagePlaceholder } from './image-placeholder';

export type PostCardLayout = 'vertical' | 'horizontal' | 'compact' | 'overlay';

export interface PostCardAuthor { name: string; initials?: string; src?: string }

export interface PostCardProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  title: string;
  href: string;
  layout?: PostCardLayout;
  size?: 'default' | 'sm';
  /** "Product". */
  category?: string;
  categoryVariant?: BadgeProps['variant'];
  /** "12 Oct 2026 · 6 min read". */
  meta?: string;
  excerpt?: string;
  author?: PostCardAuthor;
  /** Cover image URL; the placeholder shows without it. Compact shows it only when given. */
  image?: string;
  imageAlt?: string;
  headingLevel?: 2 | 3 | 4;
}

function PostCard({ title, href, layout = 'vertical', size = 'default', category, categoryVariant = 'secondary', meta, excerpt, author, image, imageAlt = '', headingLevel = 3, className, ...props }: PostCardProps) {
  const Heading = `h${headingLevel}` as 'h3';
  const sm = size === 'sm';
  const overlay = layout === 'overlay';
  const link = (
    <a href={href} className="outline-none after:absolute after:inset-0 after:z-0 after:content-['']">{title}</a>
  );
  const metaRow = category || meta ? (
    <div className="flex w-full min-w-0 items-center gap-2">
      {category ? <Badge variant={categoryVariant}>{category}</Badge> : null}
      {meta ? <span className={cn('min-w-0 flex-1 truncate text-xs leading-4', overlay ? 'text-[var(--media-foreground)]' : 'text-muted-foreground')}>{meta}</span> : null}
    </div>
  ) : null;
  const authorRow = author ? (
    <div className="flex w-full min-w-0 items-center gap-2">
      <Avatar size="sm" initials={author.initials} src={author.src} />
      <span className={cn('min-w-0 flex-1 truncate text-sm leading-5 font-medium', overlay ? 'text-[var(--media-foreground)]' : 'text-foreground')}>{author.name}</span>
    </div>
  ) : null;
  const root = cn(
    'group/post relative flex min-w-0 rounded-lg outline-none has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/50',
    className,
  );

  if (layout === 'compact') {
    return (
      <article data-slot="post-card" data-layout={layout} className={cn(root, 'items-start gap-3')} {...props}>
        {image ? <img src={image} alt={imageAlt} className={cn('shrink-0 rounded-md bg-muted object-cover', sm ? 'size-12' : 'size-16')} /> : null}
        <div className={cn('flex min-w-0 flex-1 flex-col', sm ? 'gap-0.5' : 'gap-1')}>
          <Heading className={cn('m-0 line-clamp-2 font-medium text-foreground group-hover/post:underline', sm ? 'text-xs leading-4' : 'text-sm leading-5')}>{link}</Heading>
          {meta ? <p className="m-0 text-xs leading-4 text-muted-foreground">{meta}</p> : null}
        </div>
      </article>
    );
  }

  if (overlay) {
    return (
      <article data-slot="post-card" data-layout={layout} className={cn(root, 'flex-col justify-end overflow-hidden rounded-xl bg-muted', sm ? 'h-80' : 'h-[440px]')} {...props}>
        {image ? <img src={image} alt={imageAlt} className="absolute inset-0 size-full object-cover" /> : null}
        <div aria-hidden="true" className="relative h-16 w-full bg-gradient-to-b from-[var(--media-scrim-fade)] to-[var(--media-scrim)]" />
        <div className={cn('relative flex w-full flex-col bg-[var(--media-scrim)]', sm ? 'gap-2 px-4 pb-4' : 'gap-3 px-6 pb-6')}>
          {metaRow}
          <Heading className={cn('m-0 font-semibold tracking-tight text-[var(--media-foreground)] group-hover/post:underline', sm ? 'text-lg leading-7' : 'text-xl leading-7')}>{link}</Heading>
          {authorRow}
        </div>
      </article>
    );
  }

  const horizontal = layout === 'horizontal';
  return (
    <article
      data-slot="post-card"
      data-layout={layout}
      className={cn(root, horizontal ? (sm ? 'items-start gap-6' : 'items-start gap-8') : (sm ? 'flex-col gap-3' : 'flex-col gap-4'))}
      {...props}
    >
      <ImagePlaceholder
        ratio="16:9"
        src={image}
        alt={imageAlt}
        showCaption={false}
        className={cn('rounded-lg', horizontal ? (sm ? 'w-1/3 max-w-60 min-w-30 shrink-0' : 'max-w-160 min-w-40 flex-1') : 'w-full')}
      />
      <div className={cn('flex min-w-0 flex-col', horizontal ? 'flex-1 justify-center self-center' : 'w-full', sm ? 'gap-2' : 'gap-3')}>
        {metaRow}
        <Heading
          className={cn(
            'm-0 font-semibold tracking-tight text-foreground group-hover/post:underline',
            horizontal && !sm ? 'text-3xl leading-9' : 'text-xl leading-7',
          )}
        >
          {link}
        </Heading>
        {excerpt ? <p className={cn('m-0 line-clamp-3 text-muted-foreground', horizontal && !sm ? 'text-base leading-7' : 'text-sm leading-5')}>{excerpt}</p> : null}
        {authorRow}
      </div>
    </article>
  );
}

export { PostCard };
