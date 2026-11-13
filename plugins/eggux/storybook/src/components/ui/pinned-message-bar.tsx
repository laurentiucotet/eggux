// EGG UI Pinned Message Bar. Code only (no Figma component yet). The bar under a conversation
// header that shows a pinned message: a pin glyph, "Pinned message 2 of 3" over the author and
// one line of the text, previous and next buttons that wrap around, and an Unpin button. The
// message part is a button (`onSelect`) that scrolls to the message in the thread. With one pin
// the counter and arrows go away. Moving between pins is announced politely ("Pinned message 2
// of 3, Ana: ..."), never on the first render. The list is data: unpinning calls `onUnpin` and
// the app removes it; the index then stays inside the list. Not for a banner about the whole chat.
import * as React from 'react';
import { ChevronDown, ChevronUp, Pin, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';

export interface PinnedMessage {
  id: string;
  author: string;
  text: string;
}

export interface PinnedMessageBarProps extends Omit<React.ComponentProps<'section'>, 'children' | 'onSelect'> {
  messages: PinnedMessage[];
  /** Controlled index (0-based). */
  index?: number;
  /** Start index when uncontrolled. */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** The message part was activated: scroll to it. */
  onSelect?: (message: PinnedMessage) => void;
  /** Unpin was pressed. Without it no Unpin button is shown. */
  onUnpin?: (message: PinnedMessage) => void;
}

function PinnedMessageBar({ messages, index, defaultIndex = 0, onIndexChange, onSelect, onUnpin, className, ...props }: PinnedMessageBarProps) {
  const [inner, setInner] = React.useState(defaultIndex);
  const [announcement, setAnnouncement] = React.useState('');
  const count = messages.length;
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(count - 1, 0));
  if (!count) return null;
  const message = messages[current]!;
  const many = count > 1;

  const go = (to: number) => {
    const next = (to + count) % count;
    setInner(next);
    onIndexChange?.(next);
    const m = messages[next]!;
    setAnnouncement(`Pinned message ${next + 1} of ${count}, ${m.author}: ${m.text}`);
  };

  const heading = many ? `Pinned message ${current + 1} of ${count}` : 'Pinned message';
  const content = (
    <>
      {onSelect ? <span className="sr-only">Go to </span> : null}
      <span className="block truncate text-xs leading-4 font-medium text-foreground">{heading}</span>
      <span className="block truncate text-sm leading-5 text-foreground">
        <span className="font-medium">{message.author}: </span>
        {message.text}
      </span>
    </>
  );
  const part = 'flex min-w-0 flex-1 flex-col rounded-md border-l-2 border-primary pl-2 text-left outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]';

  return (
    <section data-slot="pinned-message-bar" aria-label="Pinned messages" className={cn('flex w-full min-w-0 items-center gap-2 border-b border-border bg-card px-3 py-2', className)} {...props}>
      <Pin aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      {onSelect ? (
        <button type="button" onClick={() => onSelect(message)} className={part}>{content}</button>
      ) : (
        <div className={part}>{content}</div>
      )}
      {many ? (
        <div className="flex shrink-0 items-center">
          <ButtonIcon variant="ghost" size="xs" icon={<ChevronUp />} label="Previous pinned message" onClick={() => go(current - 1)} />
          <span className="min-w-8 text-center text-xs leading-4 text-muted-foreground tabular-nums" aria-hidden="true">{current + 1}/{count}</span>
          <ButtonIcon variant="ghost" size="xs" icon={<ChevronDown />} label="Next pinned message" onClick={() => go(current + 1)} />
        </div>
      ) : null}
      {onUnpin ? <ButtonIcon variant="ghost" size="xs" icon={<X />} label="Unpin message" onClick={() => onUnpin(message)} className="shrink-0" /> : null}
      <span role="status" className="sr-only">{announcement}</span>
    </section>
  );
}

export { PinnedMessageBar };
