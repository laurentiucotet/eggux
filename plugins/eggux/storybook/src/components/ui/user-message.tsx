// EGG UI User Message. Figma: User Message (AI Chat / User Message / Component).
// Muted bubble on the right, hugs short text up to 576 px and wraps there. Show actions adds copy
// and edit; they appear on hover and keyboard focus on desktop, always on touch.
import * as React from 'react';
import { Copy, Pencil } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface UserMessageProps extends React.ComponentProps<'div'> {
  /** Figma Show actions: copy, edit and resend under the bubble. */
  showActions?: boolean;
  onCopy?: () => void;
  onEdit?: () => void;
  /** Files sent with the message (Attachment), shown above the bubble. */
  attachments?: React.ReactNode;
  /** In a panel narrower than 600 px the bubble fills the width (Figma: bubble set to Fill). */
  fill?: boolean;
}

function UserMessage({ showActions = false, onCopy, onEdit, attachments, fill = false, className, children, ...props }: UserMessageProps) {
  return (
    <div data-slot="user-message" className={cn('group/message flex w-full flex-col items-end gap-1', className)} {...props}>
      {attachments ? <div className="flex flex-wrap justify-end gap-2">{attachments}</div> : null}
      <div
        data-slot="user-message-bubble"
        className={cn('min-w-0 rounded-xl bg-muted px-4 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] whitespace-pre-wrap', fill ? 'w-full' : 'max-w-[min(576px,100%)]')}
      >
        <span className="sr-only">You: </span>
        {children}
      </div>
      {showActions ? (
        <div
          data-slot="user-message-actions"
          className="flex items-center gap-0.5 opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover/message:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <Button variant="ghost" size="icon" aria-label="Copy" title="Copy" onClick={onCopy}>
            <Copy aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Edit and resend" title="Edit and resend" onClick={onEdit}>
            <Pencil aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export { UserMessage };
