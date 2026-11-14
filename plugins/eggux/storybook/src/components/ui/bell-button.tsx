// EGG UI Bell Button. Code only (no Figma component yet); family Notifications.
// The bell in a header: a ghost icon button with an unread count badge on its corner (99+ above
// 99, nothing at 0) that opens a Popover holding the notification panel (`children`, usually a
// Notification Inbox). The button is named by the count, "Notifications, 3 unread", and "Notifications, 99+ unread"
// above 99 (the spoken number matches the badge text); the badge itself is hidden from screen readers so the
// number is not read twice. aria-haspopup and aria-expanded come from the Popover trigger; Escape
// closes and returns focus to the bell. No live region: the name is read when the bell is
// focused, a new notification does not interrupt anyone. Not for a toast (that is Toast).
import * as React from 'react';
import { Bell } from '@/components/icons';
import { cn } from '@/lib/utils';
import { BadgeCount } from './badge-count';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface BellButtonProps extends Omit<React.ComponentProps<'button'>, 'children' | 'aria-label'> {
  /** Unread notifications. 0 hides the badge. */
  count?: number;
  /** Highest number shown before "99+". */
  max?: number;
  /** Names the button and the panel. Default "Notifications". */
  label?: string;
  /** The panel: a Notification Inbox or any content. Empty shows a plain message. */
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  /** Class of the panel container (width). */
  contentClassName?: string;
}

function BellButton({
  count = 0,
  max = 99,
  label = 'Notifications',
  children,
  open,
  defaultOpen,
  onOpenChange,
  align = 'end',
  contentClassName,
  className,
  ...props
}: BellButtonProps) {
  // The spoken number matches the badge (axe: visible text must be in the name).
  const shown = count > max ? `${max}+` : count.toLocaleString('en');
  const name = count > 0 ? `${label}, ${shown} unread` : label;
  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button data-slot="bell-button" data-count={count} variant="ghost" size="icon" aria-label={name} className={cn('relative shrink-0', className)} {...props}>
          <Bell aria-hidden="true" />
          {count > 0 ? <BadgeCount aria-hidden="true" count={count} max={max} className="pointer-events-none absolute -top-1 -right-1 ring-2 ring-background" /> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label={label} align={align} className={cn('w-96 max-w-[calc(100vw-1rem)] border-0 bg-transparent p-0 shadow-none', contentClassName)}>
        {children ?? (
          <p className="m-0 rounded-lg border border-border bg-popover px-4 py-6 text-center text-sm leading-5 text-foreground shadow-md">You are all caught up.</p>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { BellButton };
