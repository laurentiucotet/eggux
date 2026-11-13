// EGG UI Message Reply Preview. Code only (no Figma component yet). The quoted message of a reply.
// variant=composer: sits above the composer while you write a reply: a primary bar on the left,
// "Replying to Ana", one line of the original and a Cancel button (aria-label "Cancel reply").
// variant=thread: sits above a sent reply inside the thread: the author and one line of the
// original; with `href` or `onSelect` the whole quote is a link or button that goes to the
// original ("Go to message from Ana: ..."). A deleted original shows "Original message was
// deleted" and is not a link. The excerpt is one line and truncates; the full text is the name of
// the link. Sits on a card surface so it reads on any bubble. Not for a forwarded message.
import * as React from 'react';
import { Reply, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';

export interface MessageReplyPreviewProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onSelect'> {
  variant?: 'composer' | 'thread';
  /** Who wrote the original. */
  author: string;
  /** The original text; shown on one line. */
  text: string;
  /** The original no longer exists. */
  deleted?: boolean;
  /** composer: called by the Cancel button. Without it no button is shown. */
  onCancel?: () => void;
  /** thread: link to the original message ("#message-41"). */
  href?: string;
  /** thread: called when the quote is activated, for apps that scroll to the message. */
  onSelect?: () => void;
}

function MessageReplyPreview({ variant = 'composer', author, text, deleted = false, onCancel, href, onSelect, className, ...props }: MessageReplyPreviewProps) {
  const excerpt = deleted ? 'Original message was deleted' : text;
  const goto = variant === 'thread' && !deleted && Boolean(href || onSelect);
  const body = (
    <>
      {goto ? <span className="sr-only">Go to message from </span> : null}
      <span className="flex min-w-0 items-center gap-1 text-xs leading-4 font-medium text-foreground">
        <Reply aria-hidden="true" className="size-3.5 shrink-0" />
        <span className="truncate">{variant === 'composer' ? `Replying to ${author}` : author}</span>
      </span>
      <span className={cn('block min-w-0 truncate text-sm leading-5 text-foreground', deleted && 'italic')}>{excerpt}</span>
    </>
  );
  const shell = 'flex min-w-0 flex-1 flex-col border-l-2 border-primary pl-2 text-left';

  if (variant === 'composer') {
    return (
      <div
        data-slot="message-reply-preview"
        data-variant="composer"
        role="group"
        aria-label={`Replying to ${author}`}
        className={cn('flex w-full min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2', className)}
        {...props}
      >
        <div className={shell}>{body}</div>
        {onCancel ? <ButtonIcon variant="ghost" size="xs" icon={<X />} label="Cancel reply" onClick={onCancel} className="shrink-0" /> : null}
      </div>
    );
  }

  const link = 'rounded-md outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]';
  const inner = !deleted && href ? (
    <a href={href} className={cn(shell, link)}>{body}</a>
  ) : !deleted && onSelect ? (
    <button type="button" onClick={onSelect} className={cn(shell, link)}>{body}</button>
  ) : (
    <div className={shell}>{body}</div>
  );
  return (
    <div
      data-slot="message-reply-preview"
      data-variant="thread"
      className={cn('flex w-full min-w-0 max-w-[440px] rounded-lg border border-border bg-card px-3 py-2', className)}
      {...props}
    >
      {inner}
    </div>
  );
}

export { MessageReplyPreview };
