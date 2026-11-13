// EGG UI Activity Feed Item and Activity Feed. Code only (no Figma component yet); family Community.
// One line of "who did what": a 32 avatar, "Actor verb object" (actor in medium weight, the object a
// link), the time under it, an optional attachment preview (a bordered tile with an image or a file
// icon, title and meta) and an unread dot on the right. The feed is a list of items.
// A11y: the feed is a list with a name; the item is a list item; the time is a <time> with a
// datetime; the unread dot is decoration with "Unread" in sr-only text; the attachment is a link
// when it has an href. Text wraps (break-words); the attachment title truncates.
import * as React from 'react';
import { FileText } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';

export interface ActivityActor { name: string; initials?: string; src?: string }
export interface ActivityObject { label: string; href?: string }
export interface ActivityAttachment {
  title: string;
  /** "PDF · 2.4 MB". */
  meta?: string;
  /** A preview image; without it a file icon shows. */
  src?: string;
  href?: string;
}

export interface ActivityFeedItemProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  actor: ActivityActor;
  /** What happened, in the past tense: "commented on", "uploaded", "joined". */
  verb: string;
  /** What it happened to: a link. Leave out for "joined the workspace". */
  object?: ActivityObject;
  /** Text after the object: "in Billing". */
  suffix?: string;
  /** "2 hours ago". */
  time: string;
  /** Machine readable time for the <time> element. */
  dateTime?: string;
  unread?: boolean;
  attachment?: ActivityAttachment;
}

function ActivityFeedItem({ actor, verb, object, suffix, time, dateTime, unread = false, attachment, className, ...props }: ActivityFeedItemProps) {
  const preview = attachment ? (
    <>
      {attachment.src ? (
        <img src={attachment.src} alt="" className="size-10 shrink-0 rounded-md object-cover" />
      ) : (
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-5">
          <FileText />
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm leading-5 font-medium">{attachment.title}</span>
        {attachment.meta ? <span className="truncate text-xs leading-4 text-muted-foreground">{attachment.meta}</span> : null}
      </span>
    </>
  ) : null;
  const previewClass = 'flex min-w-0 max-w-[360px] items-center gap-3 rounded-md border border-border p-2';

  return (
    <li
      data-slot="activity-feed-item"
      data-unread={unread ? 'true' : undefined}
      className={cn('flex w-full min-w-0 items-start gap-3 py-3', className)}
      {...props}
    >
      <Avatar size="default" initials={actor.initials ?? actor.name.slice(0, 2).toUpperCase()} src={actor.src} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="m-0 text-sm leading-5 break-words">
          <span className="font-medium">{actor.name}</span> {verb}
          {object ? (
            <>
              {' '}
              {object.href ? (
                <a href={object.href} className="rounded-sm font-medium text-brand underline-offset-4 outline-none hover:underline focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]">{object.label}</a>
              ) : (
                <span className="font-medium">{object.label}</span>
              )}
            </>
          ) : null}
          {suffix ? ` ${suffix}` : ''}
        </p>
        <time dateTime={dateTime} className="text-xs leading-4 text-muted-foreground">{time}</time>
        {attachment ? (
          attachment.href ? (
            <a
              href={attachment.href}
              data-slot="activity-feed-attachment"
              className={cn(previewClass, 'mt-1 outline-none hover:bg-accent focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]')}
            >
              {preview}
            </a>
          ) : (
            <div data-slot="activity-feed-attachment" className={cn(previewClass, 'mt-1')}>{preview}</div>
          )
        ) : null}
      </div>
      {unread ? (
        <>
          <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
          <span className="sr-only">Unread</span>
        </>
      ) : null}
    </li>
  );
}

export interface ActivityFeedProps extends React.ComponentProps<'ul'> {
  /** The accessible name of the list. */
  'aria-label'?: string;
}

function ActivityFeed({ className, 'aria-label': ariaLabel = 'Recent activity', ...props }: ActivityFeedProps) {
  return <ul data-slot="activity-feed" aria-label={ariaLabel} className={cn('m-0 w-full min-w-0 list-none divide-y divide-border p-0', className)} {...props} />;
}

export { ActivityFeed, ActivityFeedItem };
