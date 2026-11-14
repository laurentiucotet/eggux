// EGG UI Chat page (people chat, not the AI assistant): Chat Message (145:38), Typing Indicator
// (145:61), Chat Composer (145:67), Mention Chip (444:1991), Reaction (444:1998) and Reaction Bar
// (444:1999), Thread Summary (444:2015), Conversation Item (1101:10302).
// Chat Message: incoming = 24 avatar + muted bubble (12 / 8 padding, radius xl with a 6 px corner
// at the bottom left), outgoing = primary bubble on the right (6 px corner bottom right) with the
// delivery status; bubble max 440 (compact 276 / 300 panels); time and status in ui/caption under
// it; a grouped message hides the avatar and meta. Typing Indicator: three dots in a muted bubble
// that pulse in turn (still with reduced motion) and "Sofia is typing…", announced politely.
// Chat Composer: attach, a 36 high pill textarea that grows to 5 lines (Enter sends, Shift+Enter
// adds a line), Send disabled while empty. Mention Chip: "@Name" on accent; the reader on warning.
// Reaction: a 28 high pill toggle (pressed when the reader reacted, accent with a primary border).
// Reaction Bar: reactions and an add-reaction button that opens the Emoji Picker.
// Thread Summary: a button with up to 3 avatars and +N, "3 replies" and the last reply time.
// Conversation Item: 360 × 66 row button: 40 avatar, name, pin / mute icons, time, last message,
// unread count (a dot when muted); selected = accent and aria-current.
import * as React from 'react';
import { BellOff, Check, Paperclip, Pin, Smile } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { BadgeCount } from './badge-count';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { EmojiPicker, type Emoji } from './emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface ChatPerson { name: string; initials?: string; src?: string }

/* Chat Message */

export interface ChatMessageProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  direction?: 'incoming' | 'outgoing';
  /** compact: bubbles up to 276 for panels and widgets under 480. */
  size?: 'default' | 'compact';
  /** incoming: who wrote it. */
  author?: ChatPerson;
  text: React.ReactNode;
  /** "10:42"; with `dateTime` for the <time> element. */
  time?: string;
  dateTime?: string;
  /** outgoing: Sent, Delivered or Read. */
  status?: 'sent' | 'delivered' | 'read';
  /** A message in a run from the same person: no avatar, no meta (shown on the last). */
  grouped?: boolean;
}

const statusText = { sent: 'Sent', delivered: 'Delivered', read: 'Read' } as const;

function ChatMessage({ direction = 'incoming', size = 'default', author, text, time, dateTime, status, grouped = false, className, ...props }: ChatMessageProps) {
  const out = direction === 'outgoing';
  const compact = size === 'compact';
  return (
    <div
      data-slot="chat-message"
      data-direction={direction}
      className={cn('flex w-full items-end gap-2', out && 'justify-end', compact ? 'min-w-[276px]' : 'min-w-0', className)}
      {...props}
    >
      {!out ? (
        grouped ? <span aria-hidden="true" className="w-6 shrink-0" /> : <Avatar size="sm" name={author?.name} initials={author?.initials} src={author?.src} type={author?.src ? 'image' : 'initials'} aria-hidden="true" />
      ) : null}
      <div className={cn('flex min-w-0 flex-col gap-1', out ? 'items-end' : 'items-start')}>
        <div
          data-slot="chat-bubble"
          className={cn(
            'rounded-xl px-3 py-2 text-sm leading-5 [overflow-wrap:anywhere]',
            compact ? 'max-w-[276px]' : 'max-w-[440px]',
            out ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted text-foreground',
          )}
        >
          <span className="sr-only">{out ? 'You' : (author?.name ?? 'Someone')}: </span>
          {text}
        </div>
        {!grouped && (time || status) ? (
          <div className="flex items-center gap-1 text-xs leading-4 text-muted-foreground">
            {time ? <time dateTime={dateTime}>{time}</time> : null}
            {out && status ? <><Check aria-hidden="true" className="size-3.5" /><span>{statusText[status]}</span></> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* Typing Indicator */

export interface TypingIndicatorProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Who is typing: "Sofia", or a list. */
  names?: string[];
  /** Say who by name for any group size: "Ana is typing", "Ana and Dan are typing", "Ana and 2 others are typing". Off keeps the short text with an ellipsis. */
  listNames?: boolean;
}

function typingText(names: string[], listNames: boolean) {
  if (listNames) {
    if (names.length === 1) return `${names[0]} is typing`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing`;
    const others = names.length - 1;
    return `${names[0]} and ${others} others are typing`;
  }
  if (names.length === 1) return `${names[0]} is typing…`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing…`;
  return 'Several people are typing…';
}

function TypingIndicator({ names = [], listNames = false, className, ...props }: TypingIndicatorProps) {
  if (!names.length) return null;
  return (
    <div data-slot="typing-indicator" role="status" aria-live="polite" className={cn('flex items-center gap-2', className)} {...props}>
      <span aria-hidden="true" className="flex h-[30px] w-[50px] items-center justify-center gap-1 rounded-xl rounded-bl-sm bg-muted">
        {[0, 1, 2].map(i => (
          <span key={i} className="size-1.5 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none" style={{ animationDelay: `${i * 200}ms`, opacity: 1 - i * 0.25 }} />
        ))}
      </span>
      <span className="text-xs leading-4 text-muted-foreground">{typingText(names, listNames)}</span>
    </div>
  );
}

/* Chat Composer */

export interface ChatComposerProps extends Omit<React.ComponentProps<'form'>, 'onSubmit' | 'onChange'> {
  /** Accessible name of the text box: "Message Sofia Bran". */
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend?: (text: string) => void;
  onAttach?: () => void;
  disabled?: boolean;
}

function ChatComposer({ label = 'Message', placeholder = 'Write a message…', value, defaultValue = '', onValueChange, onSend, onAttach, disabled, className, ...props }: ChatComposerProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const text = value ?? inner;
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const set = (v: string) => { setInner(v); onValueChange?.(v); };
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 116)}px`;
  }, [text]);
  const send = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend?.(t);
    set('');
  };
  return (
    <form
      data-slot="chat-composer"
      className={cn('flex w-full items-end gap-2', className)}
      onSubmit={e => { e.preventDefault(); send(); }}
      {...props}
    >
      {onAttach ? <ButtonIcon variant="ghost" icon={<Paperclip aria-hidden="true" />} label="Attach file" onClick={onAttach} disabled={disabled} /> : null}
      <textarea
        ref={ref}
        rows={1}
        aria-label={label}
        placeholder={placeholder}
        value={text}
        disabled={disabled}
        onChange={e => set(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }}
        className="min-h-9 min-w-0 flex-1 resize-none rounded-[18px] border border-input bg-background px-3 py-[7px] text-sm leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Button type="submit" disabled={disabled || !text.trim()}>Send</Button>
    </form>
  );
}

/* Mention Chip */

export interface MentionChipProps extends React.ComponentProps<'span'> {
  /** Shown after "@". */
  name: string;
  /** The reader is mentioned: warning tint. */
  you?: boolean;
}

function MentionChip({ name, you = false, className, ...props }: MentionChipProps) {
  return (
    <span
      data-slot="mention-chip"
      data-you={you || undefined}
      className={cn('inline-flex items-center rounded-sm px-1 py-0.5 text-sm leading-5 font-medium', you ? 'bg-warning text-warning-foreground' : 'bg-accent text-accent-foreground', className)}
      {...props}
    >
      @{name}
    </span>
  );
}

/* Reaction and Reaction Bar */

export interface ReactionData { emoji: string; name: string; count: number; reacted?: boolean }

export interface ReactionProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  emoji: string;
  /** Emoji name for screen readers: "thumbs up". */
  name: string;
  count: number;
  reacted?: boolean;
}

function Reaction({ emoji, name, count, reacted = false, className, ...props }: ReactionProps) {
  return (
    <button
      type="button"
      data-slot="reaction"
      aria-pressed={reacted}
      className={cn(
        'inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2 text-sm leading-5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        reacted ? 'border-primary bg-accent text-foreground' : 'border-border bg-background text-muted-foreground hover:bg-accent/50',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-foreground">{emoji}</span>
      <span className="sr-only">{name}, </span>
      <span className="font-medium">{count}</span>
    </button>
  );
}

export interface ReactionBarProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  reactions: ReactionData[];
  /** The reader toggled an emoji (from a reaction or the picker). */
  onReact?: (emoji: string, name: string) => void;
}

function ReactionBar({ reactions, onReact, className, ...props }: ReactionBarProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div data-slot="reaction-bar" role="group" aria-label="Reactions" className={cn('flex items-center gap-1', className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {reactions.filter(r => r.count > 0).map(r => <Reaction key={r.emoji} emoji={r.emoji} name={r.name} count={r.count} reacted={r.reacted} onClick={() => onReact?.(r.emoji, r.name)} />)}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Add reaction"><Smile aria-hidden="true" /></Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <EmojiPicker onSelect={(e: Emoji) => { onReact?.(e.char, e.name); setOpen(false); }} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Toggle helper: adds or removes the reader's reaction. */
function toggleReaction(list: ReactionData[], emoji: string, name: string): ReactionData[] {
  const found = list.find(r => r.emoji === emoji);
  if (!found) return [...list, { emoji, name, count: 1, reacted: true }];
  return list.map(r => (r.emoji === emoji ? { ...r, reacted: !r.reacted, count: r.count + (r.reacted ? -1 : 1) } : r));
}

/* Thread Summary */

export interface ThreadSummaryProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  repliers: ChatPerson[];
  replies: number;
  /** "Last reply 2 h ago". */
  last?: string;
  /** Unread replies: bold count with a dot. */
  unread?: boolean;
}

function ThreadSummary({ repliers, replies, last, unread = false, className, ...props }: ThreadSummaryProps) {
  const shown = repliers.slice(0, 3);
  const more = repliers.length - shown.length;
  return (
    <button
      type="button"
      data-slot="thread-summary"
      className={cn('inline-flex max-w-full cursor-pointer flex-wrap items-center gap-x-2 gap-y-1 rounded-md bg-transparent p-0 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', className)}
      {...props}
    >
      <span aria-hidden="true" className="flex items-center">
        {shown.map((p, i) => (
          <Avatar key={i} size="sm" name={p.name} initials={p.initials} src={p.src} type={p.src ? 'image' : 'initials'} className="-mr-1.5 ring-2 ring-background" style={{ zIndex: 4 - i }} />
        ))}
        {more > 0 ? <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs leading-4 font-medium text-foreground ring-2 ring-background">+{more}</span> : null}
      </span>
      <span className={cn('flex max-w-[120px] items-center gap-1 truncate text-sm leading-5 text-foreground', unread ? 'font-semibold' : 'font-medium')}>
        {unread ? <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-primary" /> : null}
        {replies} {replies === 1 ? 'reply' : 'replies'}
        {unread ? <span className="sr-only">, unread</span> : null}
      </span>
      {last ? <span className="max-w-[120px] truncate text-xs leading-4 text-muted-foreground">{last}</span> : null}
    </button>
  );
}

/* Conversation Item */

export interface ConversationItemProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  person: ChatPerson;
  /** Presence on the avatar. */
  status?: 'online' | 'away' | 'busy' | 'offline';
  /** Last message; own messages start with "You: ". */
  message: string;
  time: string;
  unread?: number;
  pinned?: boolean;
  muted?: boolean;
  selected?: boolean;
}

function ConversationItem({ person, status, message, time, unread = 0, pinned = false, muted = false, selected = false, className, ...props }: ConversationItemProps) {
  return (
    <button
      type="button"
      data-slot="conversation-item"
      data-state={selected ? 'selected' : 'default'}
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex w-[360px] max-w-full min-w-60 cursor-pointer items-center gap-3 rounded-md p-3 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        selected ? 'bg-accent' : 'bg-transparent hover:bg-[var(--table-row-hover)]',
        className,
      )}
      {...props}
    >
      <Avatar size="lg" name={person.name} initials={person.initials} src={person.src} type={person.src ? 'image' : 'initials'} status={status} aria-hidden="true" />
      <span className="flex min-w-[120px] flex-1 flex-col gap-0.5">
        <span className="flex w-full items-center gap-1.5">
          <span className="min-w-0 flex-1 truncate text-sm leading-5 font-medium text-foreground">{person.name}</span>
          {pinned ? <><Pin aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" /><span className="sr-only">, pinned</span></> : null}
          {muted ? <><BellOff aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" /><span className="sr-only">, muted</span></> : null}
          <span className={cn('max-w-24 shrink-0 truncate text-xs leading-4', selected ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>{time}</span>
        </span>
        <span className="flex w-full items-center gap-2">
          <span className={cn('min-w-0 flex-1 truncate text-sm leading-5', selected ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>{message}</span>
          {unread > 0 ? (muted ? <BadgeCount type="dot" label="Unread" /> : <BadgeCount count={unread} label={`${unread} unread`} />) : null}
        </span>
      </span>
    </button>
  );
}

export { ChatComposer, ChatMessage, ConversationItem, MentionChip, Reaction, ReactionBar, ThreadSummary, TypingIndicator, toggleReaction };
