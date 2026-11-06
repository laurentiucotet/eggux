// EGG UI Mention Menu. Figma: Mention Menu (Popover page, "Mention Menu / Component", symbol
// 1097:106481). The suggestion list that opens while typing @ in a comment, chat, editor or
// prompt: 280 wide, popover surface (border, radius md, shadow md), 4 px padding, 2 px gap; an
// optional group Header (Show header: ui/caption muted, 8 px sides, 6 / 4 px top / bottom) over
// the Items slot of Mention Options, people first, then files and records; 6 to 8 items, the first
// highlighted. No match: one muted line ("No people match") in a status region, or close the menu.
// The editor keeps focus: give it aria-controls={menu id} and aria-activedescendant={highlighted
// option id}; Up / Down move, Enter or Tab picks, Esc closes and keeps the typed text. The pick
// becomes a Mention Chip in the text. `findMentionQuery` reads the @query before the caret.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MentionMenuProps extends React.ComponentProps<'div'> {
  /** Figma Header (Show header): the group name ("People"). Names the listbox. */
  header?: React.ReactNode;
  /** Accessible name when there is no header. */
  label?: string;
  /** Id of the listbox, for aria-controls on the editor. */
  listId?: string;
  /** Shown instead of the items when there are none. */
  emptyMessage?: React.ReactNode;
}

/** Figma Items slot: Mention Options (or MentionMenuGroups for People and Files). */
function MentionMenu({ header, label, listId, emptyMessage = 'No people match', className, children, ...props }: MentionMenuProps) {
  const baseId = React.useId();
  const headerId = `${baseId}-header`;
  const id = listId ?? `${baseId}-list`;
  const empty = React.Children.toArray(children).length === 0;
  return (
    <div
      data-slot="mention-menu"
      className={cn('flex w-[280px] max-w-[calc(100vw-16px)] flex-col rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md', className)}
      {...props}
    >
      {header != null ? (
        <div id={headerId} data-slot="mention-menu-header" className="truncate px-2 pt-1.5 pb-1 text-xs leading-4 text-muted-foreground">
          {header}
        </div>
      ) : null}
      <div
        role="listbox"
        id={id}
        aria-labelledby={header != null ? headerId : undefined}
        aria-label={header != null ? undefined : label}
        className={cn('flex flex-col', header != null && 'mt-0.5', empty && 'hidden')}
      >
        {children}
      </div>
      <div role="status" data-slot="mention-menu-empty">
        {empty ? <p className="mt-0.5 px-2 py-1.5 text-sm leading-5 text-muted-foreground">{emptyMessage}</p> : null}
      </div>
    </div>
  );
}

/** A second group in the same menu ("Files"), with its own Header. */
function MentionMenuGroup({ header, className, children, ...props }: Omit<React.ComponentProps<'div'>, 'title'> & { header: React.ReactNode }) {
  const headerId = `${React.useId()}-header`;
  return (
    <div role="group" aria-labelledby={headerId} className={cn('flex flex-col', className)} {...props}>
      <div id={headerId} className="truncate px-2 pt-1.5 pb-1 text-xs leading-4 text-muted-foreground">{header}</div>
      {children}
    </div>
  );
}

/**
 * The mention being typed before the caret: "@an" → { query: 'an', start: index of @ }.
 * Null when the caret is not right after an @word (the @ must start the text or follow a space).
 */
function findMentionQuery(text: string, caret: number): { query: string; start: number } | null {
  const before = text.slice(0, caret);
  const found = /(^|\s)@([\p{L}\p{N}._-]*)$/u.exec(before);
  if (!found) return null;
  return { query: found[2], start: caret - found[2].length - 1 };
}

export { MentionMenu, MentionMenuGroup, findMentionQuery };
