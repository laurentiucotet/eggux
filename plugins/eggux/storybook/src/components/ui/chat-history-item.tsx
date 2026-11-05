// EGG UI Chat History Item. Figma: Chat History Item (AI Chat / Chat History Item / Component).
// State (default, hover, active), Title, Time, Pinned and Show time match the Figma properties.
// The row is a link (aria-current="page" when active); the options menu (rename, pin, share,
// delete) is a Radix DropdownMenu on a Button Icon that shows on hover, keyboard focus and active.
import * as React from 'react';
import { DropdownMenu } from 'radix-ui';
import { Ellipsis, Pencil, Pin, Share2, Trash2 } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type ChatHistoryItemState = 'default' | 'hover' | 'active';

export interface ChatHistoryItemProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Title: from the first request, one line. */
  title?: string;
  /** Figma Time: relative ("2 h ago"). */
  time?: string;
  /** Figma Show time. */
  showTime?: boolean;
  /** Figma Pinned: pin icon after the text. */
  pinned?: boolean;
  /** Figma State. active marks the open conversation (aria-current="page"); hover forces the hover look. */
  state?: ChatHistoryItemState;
  /** Link to the conversation. */
  href?: string;
  /** Link click (client-side routing). */
  onOpen?: React.MouseEventHandler<HTMLAnchorElement>;
  onRename?: () => void;
  /** Called with the new pinned value. */
  onPinnedChange?: (pinned: boolean) => void;
  onShare?: () => void;
  /** Delete; the list offers Undo. */
  onDelete?: () => void;
}

const menuItem =
  'flex h-8 cursor-default items-center gap-2 rounded-sm px-2 text-sm outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0';

function ChatHistoryItem({
  title = 'Overdue invoices for Northwind',
  time = '2 h ago',
  showTime = true,
  pinned = false,
  state = 'default',
  href = "#",
  onOpen,
  onRename,
  onPinnedChange,
  onShare,
  onDelete,
  className,
  ...props
}: ChatHistoryItemProps) {
  const active = state === 'active';
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div
      data-slot="chat-history-item"
      data-state={state}
      className={cn(
        'group/history relative flex w-full min-w-32 items-center gap-2 rounded-md py-1.5 pl-2 pr-2 text-foreground transition-colors duration-[var(--duration-fast)]',
        // Hover, keyboard focus, open menu and active make room for the 36 px menu button (8 + 36 + 8).
        'hover:bg-accent hover:pr-13 focus-within:bg-accent focus-within:pr-13 has-[[data-state=open]]:bg-accent has-[[data-state=open]]:pr-13 [@media(hover:none)]:pr-13',
        state === 'hover' && 'bg-accent pr-13',
        active && 'bg-[var(--sidebar-accent)] pr-13 text-[var(--sidebar-accent-foreground)] hover:bg-[var(--sidebar-accent)] focus-within:bg-[var(--sidebar-accent)]',
        className,
      )}
      {...props}
    >
      {/* The link covers the whole row (after:inset-0); the menu button sits above it. */}
      <a
        href={href}
        onClick={onOpen}
        aria-current={active ? 'page' : undefined}
        title={title}
        className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-md outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:ring-2 focus-visible:after:ring-ring"
      >
        <span className="truncate text-sm">{title}</span>
        {/* On the accent fills muted-foreground is under 4.5:1; the filled-muted token keeps the contrast. */}
        {showTime ? <span className="truncate text-xs text-muted-foreground group-hover/history:text-[var(--input-filled-muted-foreground)] group-focus-within/history:text-[var(--input-filled-muted-foreground)] group-data-[state=active]/history:text-[var(--input-filled-muted-foreground)] group-data-[state=hover]/history:text-[var(--input-filled-muted-foreground)]">{time}</span> : null}
        {pinned ? <span className="sr-only">, pinned</span> : null}
      </a>
      {pinned ? <Pin className="size-3.5 shrink-0 text-[var(--input-filled-muted-foreground)]" aria-hidden="true" /> : null}

      <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="ghost"
            size={showTime ? 'icon' : 'icon-sm'}
            aria-label={`Options for ${title}`}
            title={`Options for ${title}`}
            className={cn(
              'absolute top-1/2 right-2 z-10 -translate-y-1/2 text-[var(--input-filled-muted-foreground)]',
              // Hidden until hover or keyboard focus; always shown on the active row, when open and on touch.
              'opacity-0 group-hover/history:opacity-100 group-focus-within/history:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 [@media(hover:none)]:opacity-100',
              (active || state === 'hover') && 'opacity-100',
            )}
          >
            <Ellipsis aria-hidden="true" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            collisionPadding={8}
            className="z-50 min-w-40 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
          >
            <DropdownMenu.Item className={menuItem} onSelect={onRename}>
              <Pencil aria-hidden="true" />
              Rename
            </DropdownMenu.Item>
            <DropdownMenu.Item className={menuItem} onSelect={() => onPinnedChange?.(!pinned)}>
              <Pin aria-hidden="true" />
              {pinned ? 'Unpin' : 'Pin'}
            </DropdownMenu.Item>
            <DropdownMenu.Item className={menuItem} onSelect={onShare}>
              <Share2 aria-hidden="true" />
              Share
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-border" />
            <DropdownMenu.Item className={cn(menuItem, 'text-destructive data-[highlighted]:bg-accent data-[highlighted]:text-destructive')} onSelect={onDelete}>
              <Trash2 aria-hidden="true" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

export { ChatHistoryItem };
