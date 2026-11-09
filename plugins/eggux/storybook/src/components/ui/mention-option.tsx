// EGG UI Mention Option. Figma: Mention Option (Popover page, "Mention Menu / Component", set
// 1097:106478), Type person | item x State default | highlighted. One suggestion in a Mention
// Menu: an Avatar (default size, 32) for people or a 32 px icon tile (muted, radius md, 16 px icon,
// Icon swap, default file-text) for files and records, 8 px from the text; the name with the typed
// part highlighted (Match in foreground/brand, then Name, ui/label, 1 line) over a muted
// Description (ui/caption, 1 line; Show description). 8 / 6 px padding, radius sm; highlighted =
// background/accent; there the description takes accent-foreground, because muted on accent is
// 4.35:1 in Light (below AA), as in Menu Item. role="option": the editor keeps focus and points
// aria-activedescendant at the highlighted option (aria-selected). The match is not color alone:
// the name reads in full.
import * as React from 'react';
import { FileText } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { IconTile } from './icon-tile';

export type MentionOptionType = 'person' | 'item';

export interface MentionOptionProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  /** Figma Type: person (Avatar) or item (icon tile: files, records, channels). */
  type?: MentionOptionType;
  /** Figma Match: the typed part, in foreground/brand ("An"). */
  match?: string;
  /** Figma Name: the rest of the name after the match ("na Berg"). */
  name: string;
  /** Figma Description (Show description): handle and team, or type and place. */
  description?: React.ReactNode;
  /** Figma State=highlighted: keyboard highlight (aria-selected). */
  highlighted?: boolean;
  /** Figma Avatar (Type=person). Default: initials of the full name. */
  avatar?: React.ReactNode;
  /** Figma Icon swap (Type=item). Default file-text. */
  icon?: React.ReactNode;
  onSelect?: () => void;
}

function initialsOf(text: string) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]!.toUpperCase())
    .join('');
}

function MentionOption({
  type = 'person',
  match = '',
  name,
  description,
  highlighted = false,
  avatar,
  icon,
  onSelect,
  className,
  onClick,
  onMouseDown,
  ...props
}: MentionOptionProps) {
  const full = `${match}${name}`;
  return (
    <div
      role="option"
      data-slot="mention-option"
      data-type={type}
      data-highlighted={highlighted ? '' : undefined}
      aria-selected={highlighted}
      tabIndex={-1}
      onMouseDown={event => {
        onMouseDown?.(event);
        // Keep focus in the editor.
        event.preventDefault();
      }}
      onClick={event => {
        onClick?.(event);
        onSelect?.();
      }}
      className={cn(
        'flex w-full min-w-0 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left outline-none data-[highlighted]:bg-accent',
        className,
      )}
      {...props}
    >
      {type === 'person'
        ? (avatar ?? <Avatar size="default" initials={initialsOf(full)} />)
        : <IconTile size="sm" icon={icon ?? <FileText />} />}
      <span className="flex min-w-0 flex-1 flex-col">
        <span data-slot="mention-option-name" className="truncate text-sm leading-5 font-medium text-popover-foreground">
          {match ? <mark className="bg-transparent text-brand">{match}</mark> : null}
          {name}
        </span>
        {description != null ? (
          <span data-slot="mention-option-description" className="truncate text-xs leading-4 text-muted-foreground [[data-highlighted]_&]:text-accent-foreground">{description}</span>
        ) : null}
      </span>
    </div>
  );
}

/** Splits a full name into Figma Match and Name for the typed query (case and accent insensitive). */
function splitMatch(full: string, query: string): { match: string; name: string } {
  const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (query && plain(full).startsWith(plain(query))) return { match: full.slice(0, query.length), name: full.slice(query.length) };
  return { match: '', name: full };
}

export { MentionOption, splitMatch };
