// EGG UI Message Status. Code only (no Figma component yet). Where one of your own messages is in
// its delivery: Sending (clock), Sent (one tick), Delivered (two ticks), Read (two ticks in brand)
// and Failed (alert icon, "Not sent" and a Retry button). The state is always text, never only a
// glyph: the label is visible, or in sr-only text when `showLabel` is off. Quiet by default (a
// list of messages must not talk); `announce` makes it a polite status for the one message that
// is being sent right now. Sits under or beside a Chat Message bubble. Not for a read receipt
// with names (that is a list of Avatars).
import * as React from 'react';
import { Check, CircleAlert, Clock } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type MessageStatusValue = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

const text: Record<MessageStatusValue, string> = {
  sending: 'Sending',
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  failed: 'Not sent',
};

export interface MessageStatusProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  status: MessageStatusValue;
  /** Show the word next to the glyph. Off: the word stays for screen readers. */
  showLabel?: boolean;
  /** Time of the message ("10:42"), shown before the status. */
  time?: string;
  /** Failed only: called by the Retry button. Without it no button is shown. */
  onRetry?: () => void;
  /** Accessible name of the Retry button, name the message when several can fail. Default "Retry". */
  retryLabel?: string;
  /** Make the status a polite live region (for the message being sent now). */
  announce?: boolean;
}

function Glyph({ status }: { status: MessageStatusValue }) {
  if (status === 'sending') return <Clock aria-hidden="true" className="size-3.5" />;
  if (status === 'failed') return <CircleAlert aria-hidden="true" className="size-3.5" />;
  if (status === 'sent') return <Check aria-hidden="true" className="size-3.5" />;
  return (
    <span aria-hidden="true" className="relative inline-flex h-3.5 w-5 shrink-0">
      <Check className="absolute left-0 size-3.5" />
      <Check className="absolute left-1.5 size-3.5" />
    </span>
  );
}

function MessageStatus({ status, showLabel = true, time, onRetry, retryLabel = 'Retry', announce = false, className, ...props }: MessageStatusProps) {
  const tone = status === 'failed' ? 'text-destructive' : status === 'read' ? 'text-brand' : 'text-muted-foreground';
  return (
    <span
      data-slot="message-status"
      data-status={status}
      role={announce ? 'status' : undefined}
      className={cn('inline-flex min-w-0 items-center gap-1 text-xs leading-4', tone, className)}
      {...props}
    >
      {time ? <time className="shrink-0 text-muted-foreground">{time}</time> : null}
      <Glyph status={status} />
      <span className={cn(showLabel ? 'truncate' : 'sr-only')}>{text[status]}</span>
      {status === 'failed' && onRetry ? (
        <Button type="button" variant="link" size="xs" className="h-auto min-h-6 px-1 text-xs" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </span>
  );
}

export { MessageStatus };
