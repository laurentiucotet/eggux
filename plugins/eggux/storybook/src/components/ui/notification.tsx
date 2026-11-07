// EGG UI Notifications page: Notification Item (435:801) and Notification Center (435:802).
// Notification Item: a 32 Avatar, the message (body/small, 2 lines), meta ("2 h ago · Approvals",
// ui/caption) and optional actions (sm outline Buttons); 12 padding, radius md. Unread: muted
// background and an 8 px primary dot; "Unread" in text for screen readers. The whole row opens
// the object: the message is a link stretched over the row; actions sit above it.
// Notification Center: the panel behind the bell (popover surface, border, radius lg, shadow md,
// min 288): title with "Mark all as read" (ghost sm), optional line Tabs by type, items 4 apart in
// 8 padding, "View all notifications" (link) in the footer. Empty: "You are all caught up."
// On the muted unread row the muted meta falls under 4.5:1, so it uses foreground (D-001).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Button } from './button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

export interface NotificationItemProps extends Omit<React.ComponentProps<'li'>, 'onClick'> {
  message: React.ReactNode;
  meta?: string;
  unread?: boolean;
  initials?: string;
  avatar?: string;
  /** Opens the object (and marks it read). */
  href?: string;
  onOpen?: () => void;
  /** Buttons people can use from the list: Approve, View invoice. */
  actions?: React.ReactNode;
}

function NotificationItem({ message, meta, unread = false, initials, avatar, href, onOpen, actions, className, ...props }: NotificationItemProps) {
  return (
    <li
      data-slot="notification-item"
      data-unread={unread || undefined}
      className={cn(
        'relative flex w-full min-w-0 list-none items-start gap-3 rounded-md p-3 hover:bg-accent has-[a[data-slot=notification-link]:focus-visible]:ring-[3px] has-[a[data-slot=notification-link]:focus-visible]:ring-ring/50',
        unread && 'bg-muted',
        className,
      )}
      {...props}
    >
      <Avatar initials={initials} src={avatar} />
      <div className="flex min-w-32 flex-1 flex-col gap-1">
        <p className="m-0 line-clamp-2 text-sm leading-5 text-foreground">
          {href ? (
            <a data-slot="notification-link" href={href} onClick={onOpen} className="outline-none after:absolute after:inset-0 after:content-['']">
              {unread ? <span className="sr-only">Unread: </span> : null}
              {message}
            </a>
          ) : (
            <>
              {unread ? <span className="sr-only">Unread: </span> : null}
              {message}
            </>
          )}
        </p>
        {meta ? <p className={cn('m-0 truncate text-xs leading-4', unread ? 'text-foreground' : 'text-muted-foreground')}>{meta}</p> : null}
        {actions ? <div className="relative z-10 flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {unread ? <span aria-hidden="true" data-slot="notification-dot" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" /> : null}
    </li>
  );
}

export interface NotificationTab { value: string; label: string }

export interface NotificationCenterProps extends React.ComponentProps<'section'> {
  title?: string;
  /** Figma Show tabs: tabs by type; leave out when there is one kind. */
  tabs?: NotificationTab[];
  tab?: string;
  onTabChange?: (value: string) => void;
  onMarkAllRead?: () => void;
  /** Disables Mark all as read when nothing is unread. */
  unreadCount?: number;
  viewAllHref?: string;
  emptyText?: string;
}

function NotificationCenter({
  title = 'Notifications',
  tabs,
  tab,
  onTabChange,
  onMarkAllRead,
  unreadCount,
  viewAllHref,
  emptyText = 'You are all caught up.',
  className,
  children,
  ...props
}: NotificationCenterProps) {
  const id = React.useId();
  const empty = React.Children.toArray(children).length === 0;
  const list = empty ? (
    <p role="status" className="m-0 px-3 py-6 text-center text-sm leading-5 text-muted-foreground">{emptyText}</p>
  ) : (
    <ul aria-labelledby={id} className="m-0 flex flex-col gap-1 p-0">{children}</ul>
  );
  return (
    <section
      data-slot="notification-center"
      aria-labelledby={id}
      className={cn('flex w-full min-w-72 flex-col rounded-lg border border-border bg-popover text-popover-foreground shadow-md', className)}
      {...props}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <h2 id={id} className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-medium">{title}</h2>
        {onMarkAllRead ? (
          <Button variant="ghost" size="sm" disabled={unreadCount === 0} onClick={onMarkAllRead}>Mark all as read</Button>
        ) : null}
      </div>
      {tabs?.length ? (
        <Tabs variant="line" value={tab ?? tabs[0]!.value} onValueChange={onTabChange} className="gap-0">
          <TabsList className="border-b border-border px-4">
            {tabs.map(t => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
          </TabsList>
          <TabsContent value={tab ?? tabs[0]!.value} className="p-2">{list}</TabsContent>
        </Tabs>
      ) : (
        <div className="p-2">{list}</div>
      )}
      {viewAllHref ? (
        <div className="flex justify-center border-t border-border px-4 py-2">
          <Button asChild variant="link" size="sm"><a href={viewAllHref}>View all notifications</a></Button>
        </div>
      ) : null}
    </section>
  );
}

export { NotificationCenter, NotificationItem };
