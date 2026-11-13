// EGG UI Notification Inbox. Code only (no Figma component yet); family Notifications. It replaces
// the "Notification Center" asked for: notification.tsx already exports NotificationCenter and the
// story title Components/Notifications/Notification Center, so this is the fuller panel under a
// new name. Header (title, "Mark all as read"), line Tabs All / Unread with counts, the list in
// two groups, Today and Earlier, each with a sticky Notification Group Header (a count and a fold
// toggle), a scroll area (`maxHeight`), an empty state per tab and a footer link to settings.
// Groups come from each item's `date` against the `now` prop (same calendar day = Today), so the
// output never depends on the clock; `meta` is written by the caller ("2 h ago . Approvals").
// Read state is kept inside: opening an item or Mark all as read clears its unread mark and calls
// `onItemOpen` / `onMarkAllRead`. Mark all as read stays in the tab order, aria-disabled at 0, so
// focus is never lost; one polite status announces the result. Built from Notification Item, Tabs,
// Button, Empty State and Notification Group Header.
import * as React from 'react';
import { BellOff, Inbox } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { EmptyState } from './empty-state';
import { NotificationGroupHeader } from './notification-group-header';
import { NotificationItem } from './notification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

export interface InboxNotification {
  id: string;
  message: React.ReactNode;
  /** "2 h ago · Approvals". */
  meta?: string;
  /** Local date and time, "2026-03-12T09:30:00" (no zone, so the group does not move with the viewer). */
  date: string;
  unread?: boolean;
  initials?: string;
  href?: string;
}

export interface NotificationInboxProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  items: InboxNotification[];
  /** The moment "Today" is measured from. Required so tests and stories do not use the clock. */
  now: string | Date;
  title?: string;
  /** Starting tab. */
  defaultTab?: 'all' | 'unread';
  onMarkAllRead?: () => void;
  onItemOpen?: (id: string) => void;
  /** Footer link. Without it no footer. */
  settingsHref?: string;
  /** Height of the scroll area in px. Default 360. */
  maxHeight?: number;
}

const fmt = (n: number) => n.toLocaleString('en');

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function NotificationInbox({
  items,
  now,
  title = 'Notifications',
  defaultTab = 'all',
  onMarkAllRead,
  onItemOpen,
  settingsHref,
  maxHeight = 360,
  className,
  ...props
}: NotificationInboxProps) {
  const uid = React.useId();
  const headingId = `${uid}-title`;
  const [tab, setTab] = React.useState<string>(defaultTab);
  const [read, setRead] = React.useState<ReadonlySet<string>>(() => new Set());
  const [folded, setFolded] = React.useState<ReadonlySet<string>>(() => new Set());
  const [announce, setAnnounce] = React.useState('');

  const today = typeof now === 'string' ? new Date(now) : now;
  const isUnread = (n: InboxNotification) => Boolean(n.unread) && !read.has(n.id);
  const unreadCount = items.filter(isUnread).length;
  const visible = tab === 'unread' ? items.filter(isUnread) : items;
  const groups = [
    { key: 'today', label: 'Today', rows: visible.filter(n => sameDay(new Date(n.date), today)) },
    { key: 'earlier', label: 'Earlier', rows: visible.filter(n => !sameDay(new Date(n.date), today)) },
  ].filter(g => g.rows.length > 0);

  const markAll = () => {
    if (unreadCount === 0) return;
    setRead(new Set([...read, ...items.map(n => n.id)]));
    setAnnounce(`${fmt(unreadCount)} ${unreadCount === 1 ? 'notification' : 'notifications'} marked as read.`);
    onMarkAllRead?.();
  };
  const open = (id: string) => {
    setRead(new Set([...read, id]));
    onItemOpen?.(id);
  };
  const toggleGroup = (key: string, collapsed: boolean) => {
    const next = new Set(folded);
    if (collapsed) next.add(key);
    else next.delete(key);
    setFolded(next);
  };

  return (
    <section
      data-slot="notification-inbox"
      aria-labelledby={headingId}
      className={cn('flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md', className)}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2 px-4 py-3">
        <h2 id={headingId} className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-medium">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          aria-disabled={unreadCount === 0 || undefined}
          onClick={markAll}
          className="shrink-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent"
        >
          Mark all as read
        </Button>
      </div>
      <Tabs variant="line" value={tab} onValueChange={setTab} className="min-w-0 gap-0">
        <TabsList aria-label="Filter notifications" className="border-b border-border px-4">
          <TabsTrigger value="all" count={items.length} countLabel={fmt(items.length)}>All</TabsTrigger>
          <TabsTrigger value="unread" count={unreadCount} countLabel={fmt(unreadCount)}>Unread</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="min-w-0">
          <div data-slot="notification-inbox-scroll" style={{ maxHeight }} className="overflow-y-auto overscroll-contain px-2 pb-2">
            {groups.length === 0 ? (
              <EmptyState
                size="sm"
                icon={tab === 'unread' ? <BellOff /> : <Inbox />}
                title={tab === 'unread' ? 'You are all caught up' : 'No notifications yet'}
                description={tab === 'unread' ? 'New ones will show up here.' : 'Updates from your team will show up here.'}
                headingLevel={3}
                className="w-full"
              />
            ) : (
              groups.map(g => {
                const listId = `${uid}-${g.key}`;
                const collapsed = folded.has(g.key);
                return (
                  <div key={g.key} data-slot="notification-inbox-group" className="min-w-0">
                    <NotificationGroupHeader label={g.label} count={g.rows.length} controls={listId} collapsed={collapsed} onCollapsedChange={c => toggleGroup(g.key, c)} />
                    <ul id={listId} aria-label={g.label} hidden={collapsed} className="m-0 flex flex-col gap-1 p-0">
                      {g.rows.map(n => (
                        <NotificationItem key={n.id} message={n.message} meta={n.meta} unread={isUnread(n)} initials={n.initials} href={n.href} onOpen={() => open(n.id)} />
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
      {settingsHref ? (
        <div className="flex justify-center border-t border-border px-4 py-2">
          <Button asChild variant="link" size="sm"><a href={settingsHref}>Notification settings</a></Button>
        </div>
      ) : null}
      <span role="status" className="sr-only">{announce}</span>
    </section>
  );
}

export { NotificationInbox };
