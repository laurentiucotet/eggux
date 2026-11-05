// EGG UI Event Card. Figma: Event Card (Card page, "Event Card / Component"). Layout (horizontal,
// vertical) x Date position (text, image), Tags slot, Title (2 lines), Meta slot (Meta Items),
// Actions slot, Show image. One link for the card (the title link is stretched over it) and the
// action is the only other control, a separate button that names the event. Built on Card, Date
// Tile, Badge, Meta Item, Image Placeholder and Button.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { DateTile, type DateTileProps } from './date-tile';

export type EventLayout = 'horizontal' | 'vertical';
export type EventDatePosition = 'text' | 'image';

export interface EventCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  layout?: EventLayout;
  /** Figma Date position (vertical): text = next to the title; image = over the top-left corner of the image (needs `image`). */
  datePosition?: EventDatePosition;
  /** Figma Date Tile: month, day, dateTime and label (the full date for screen readers). */
  date: Pick<DateTileProps, 'month' | 'day' | 'dateTime' | 'label'>;
  /** Figma Title: 2 lines. It is the link text. */
  title: string;
  /** Where the whole card goes (the event page). */
  href: string;
  /** Figma Tags slot (Show tags): format Badges (Webinar, Online). */
  tags?: React.ReactNode;
  /** Figma Meta slot: Meta Items for time with time zone and place. */
  meta?: React.ReactNode;
  /** Figma Actions slot (Show actions): one action. Its label names the event. */
  actions?: React.ReactNode;
  /** Figma Show image + Image (vertical): an Image Placeholder. */
  image?: React.ReactNode;
}

function EventCard({ layout = 'horizontal', datePosition = 'text', date, title, href, tags, meta, actions, image, className, ...props }: EventCardProps) {
  const vertical = layout === 'vertical';
  const dateOnImage = vertical && datePosition === 'image' && Boolean(image);
  const text = (
    <div data-slot="event-card-text" className="flex min-w-0 flex-1 flex-col gap-2">
      {tags ? <div data-slot="event-card-tags" className="flex flex-wrap items-start gap-1.5">{tags}</div> : null}
      <h3 className="text-xl leading-7 font-semibold tracking-tight">
        <a
          href={href}
          className="line-clamp-2 rounded-sm outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
        >
          {title}
        </a>
      </h3>
      {!vertical && meta ? <div data-slot="event-card-meta" className="flex min-w-0 flex-col gap-1.5">{meta}</div> : null}
    </div>
  );
  return (
    <Card
      data-slot="event-card"
      data-layout={layout}
      data-date-position={datePosition}
      interactive
      className={cn('gap-[var(--card-gap-sm)] p-[var(--card-padding-sm)]', vertical ? 'w-88 max-w-full' : 'w-160 max-w-full flex-row items-start', className)}
      {...props}
    >
      {vertical && image ? (
        <div data-slot="event-card-image" className="relative w-full overflow-clip rounded-lg">
          {image}
          {dateOnImage ? (
            <DateTile {...date} size="sm" className="absolute top-3 left-3 bg-background" />
          ) : null}
        </div>
      ) : null}
      {vertical && !dateOnImage ? (
        <div className="flex min-w-0 items-start gap-3">
          <DateTile {...date} />
          {text}
        </div>
      ) : vertical ? (
        text
      ) : (
        <>
          <DateTile {...date} />
          {text}
        </>
      )}
      {vertical && meta ? <div data-slot="event-card-meta" className="flex min-w-0 flex-col gap-1.5">{meta}</div> : null}
      {actions ? <div data-slot="event-card-actions" className="relative z-10 flex shrink-0 items-start gap-2">{actions}</div> : null}
    </Card>
  );
}

export { EventCard };
