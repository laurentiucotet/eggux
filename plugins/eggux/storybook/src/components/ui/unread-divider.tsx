// EGG UI Unread Divider. Code only (no Figma component yet). The line in a message list where the
// messages you have not read begin: "3 new messages" (or "New messages" with no count) between two
// rules in the primary color, and an optional "Jump to latest" button for when the unread run is
// longer than the screen. The divider itself is static text (it never announces); the button is
// a native button that calls `onJump`. The count is part of the text, so a screen reader gets
// "3 new messages". Goes between the last read message and the first unread one. Not a toast.
import * as React from 'react';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface UnreadDividerProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** How many messages are unread. Omit for "New messages". */
  count?: number;
  /** Replace the text ("New replies"). The count is added in front when set. */
  label?: string;
  /** Shows the Jump to latest button. */
  onJump?: () => void;
  /** Text of the jump button. */
  jumpLabel?: string;
}

function UnreadDivider({ count, label = 'new messages', onJump, jumpLabel = 'Jump to latest', className, ...props }: UnreadDividerProps) {
  const text = count !== undefined ? `${count > 99 ? '99+' : count} ${count === 1 && label === 'new messages' ? 'new message' : label}` : label === 'new messages' ? 'New messages' : label;
  return (
    <div data-slot="unread-divider" role="group" aria-label={text} className={cn('flex w-full min-w-0 items-center gap-2 py-2 text-foreground', className)} {...props}>
      <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-primary" />
      <span className="min-w-0 truncate text-xs leading-4 font-medium">{text}</span>
      <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-primary" />
      {onJump ? (
        <Button type="button" variant="soft" size="xs" trailingIcon={<ChevronDown />} onClick={onJump} className="shrink-0">
          {jumpLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { UnreadDivider };
