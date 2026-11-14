// EGG UI Mark All Read Bar. Code only (no Figma component yet); family Notifications.
// A bar above a notification list: how many are unread ("12 unread notifications") and one button,
// "Mark all as read". After the click the same button becomes "Undo" and the text says what
// happened ("12 marked as read"), so a slip is one click to fix. It is one button that changes its
// name, so keyboard focus stays where it was. With nothing unread it reads "You are all caught up"
// and the button is aria-disabled (not removed from the tab order, so focus is never lost).
// The parent owns the count: call `onMarkAllRead` to zero it and `onUndo` to restore it; the undo
// state shows while `unreadCount` is 0 after a click. Live region: one polite status, written only
// after a click (the visible count is not live, so new notifications do not talk). `sticky` pins it.
// Not for one notification (that is the item's own action).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface MarkAllReadBarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Unread notifications right now. */
  unreadCount: number;
  /** Mark everything read: the parent sets the count to 0. */
  onMarkAllRead?: () => void;
  /** Undo the last Mark all as read: the parent restores the count. */
  onUndo?: () => void;
  /** Pin to the top of the scroll area. Default false. */
  sticky?: boolean;
}

const fmt = (n: number) => n.toLocaleString('en');

function MarkAllReadBar({ unreadCount, onMarkAllRead, onUndo, sticky = false, className, ...props }: MarkAllReadBarProps) {
  const [marked, setMarked] = React.useState<number | null>(null);
  const [announce, setAnnounce] = React.useState('');
  const undoing = marked !== null && unreadCount === 0;
  const empty = !undoing && unreadCount === 0;

  const onClick = () => {
    if (undoing) {
      setAnnounce(`${fmt(marked)} notifications are unread again.`);
      setMarked(null);
      onUndo?.();
      return;
    }
    if (empty) return;
    setMarked(unreadCount);
    setAnnounce(`${fmt(unreadCount)} ${unreadCount === 1 ? 'notification' : 'notifications'} marked as read. Undo is available.`);
    onMarkAllRead?.();
  };

  const text = undoing
    ? `${fmt(marked)} marked as read`
    : empty
      ? 'You are all caught up'
      : `${fmt(unreadCount)} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`;

  return (
    <div
      data-slot="mark-all-read-bar"
      data-state={undoing ? 'undo' : empty ? 'empty' : 'unread'}
      className={cn(
        'z-10 flex w-full min-w-0 items-center gap-3 border-b border-border bg-popover px-4 py-2 text-popover-foreground',
        sticky && 'sticky top-0',
        className,
      )}
      {...props}
    >
      <p className="m-0 min-w-0 flex-1 truncate text-sm leading-5 text-foreground">{text}</p>
      <Button
        variant="ghost"
        size="sm"
        aria-disabled={empty || undefined}
        onClick={onClick}
        className="shrink-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent"
      >
        {undoing ? 'Undo' : 'Mark all as read'}
      </Button>
      <span role="status" className="sr-only">{announce}</span>
    </div>
  );
}

export { MarkAllReadBar };
