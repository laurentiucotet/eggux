// EGG UI Tag. Figma: Tag (Select page, "Tag Input / Component"). State (default, disabled) x Tone
// (default, category-1..8) x Size (default 24, sm 20); Label, Show remove, Show avatar (exposed
// Avatar xs), Show leading icon + Leading icon (default hash, 12 px). A removable value inside Tag
// Input, People Picker and multi-select: secondary fill (or the badge category tokens), radius sm,
// ui/label-small, 8/4 px sides (sm 6/2), 4 gap; the label truncates at 192 (max-w-48). The x is a
// button "Remove <label>"; Backspace or Delete on it removes the tag as well. Disabled fades the tag
// and turns the x off. For filters outside a field use Chip; static labels nobody removes are Badge.
import * as React from 'react';
import { Hash, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar, type AvatarProps } from './avatar';

export type TagTone =
  | 'default' | 'category-1' | 'category-2' | 'category-3' | 'category-4'
  | 'category-5' | 'category-6' | 'category-7' | 'category-8';
export type TagSize = 'default' | 'sm';

// Fill and text per Tone. Class names are written in full so Tailwind can generate them.
const toneClass: Record<TagTone, string> = {
  default: 'bg-secondary text-secondary-foreground',
  'category-1': 'bg-[var(--badge-category-1-bg)] text-[var(--badge-category-1-fg)]',
  'category-2': 'bg-[var(--badge-category-2-bg)] text-[var(--badge-category-2-fg)]',
  'category-3': 'bg-[var(--badge-category-3-bg)] text-[var(--badge-category-3-fg)]',
  'category-4': 'bg-[var(--badge-category-4-bg)] text-[var(--badge-category-4-fg)]',
  'category-5': 'bg-[var(--badge-category-5-bg)] text-[var(--badge-category-5-fg)]',
  'category-6': 'bg-[var(--badge-category-6-bg)] text-[var(--badge-category-6-fg)]',
  'category-7': 'bg-[var(--badge-category-7-bg)] text-[var(--badge-category-7-fg)]',
  'category-8': 'bg-[var(--badge-category-8-bg)] text-[var(--badge-category-8-fg)]',
};
// Figma: default h 24, 8 left / 4 right; sm h 20, 6 / 2. Without the x both sides match the left.
const sizeClass: Record<TagSize, string> = { default: 'h-6 pl-2', sm: 'h-5 pl-1.5' };
const rightClass: Record<TagSize, { remove: string; none: string }> = {
  default: { remove: 'pr-1', none: 'pr-2' },
  sm: { remove: 'pr-0.5', none: 'pr-1.5' },
};
// The avatar sits 2 px from the left edge.
const avatarClass: Record<TagSize, string> = { default: '-ml-1.5', sm: '-ml-1' };

export interface TagProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** Figma Label. */
  label?: string;
  /** Figma Tone: default (secondary) or category-1..8 for labels with a fixed color. */
  tone?: TagTone;
  /** Figma Size: default (24) in fields, sm (20) in dense fields and table filters. */
  size?: TagSize;
  /** Figma State=disabled: every Tag of a disabled field. */
  disabled?: boolean;
  /** Figma Show remove. */
  showRemove?: boolean;
  onRemove?: () => void;
  /** Accessible name of the x. Default "Remove <label>". */
  removeLabel?: string;
  /** Figma Show avatar: the exposed Avatar (xs) for people. Avatar or icon, not both. */
  avatar?: Omit<AvatarProps, 'size'>;
  /** Figma Show leading icon. */
  showLeadingIcon?: boolean;
  /** Figma Leading icon swap (12 px). Default Hash. */
  icon?: React.ReactNode;
  /** Ref of the x button (Tag Input moves focus to it). */
  removeRef?: React.Ref<HTMLButtonElement>;
}

function Tag({
  label = 'Design',
  tone = 'default',
  size = 'default',
  disabled = false,
  showRemove = true,
  onRemove,
  removeLabel,
  avatar,
  showLeadingIcon = false,
  icon,
  removeRef,
  className,
  ...props
}: TagProps) {
  return (
    <span
      data-slot="tag"
      data-tone={tone}
      data-size={size}
      data-state={disabled ? 'disabled' : 'default'}
      aria-disabled={disabled || undefined}
      className={cn(
        'inline-flex max-w-48 min-w-0 shrink-0 items-center gap-1 rounded-sm text-xs leading-4 font-medium whitespace-nowrap',
        sizeClass[size],
        rightClass[size][showRemove ? 'remove' : 'none'],
        toneClass[tone],
        disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {avatar ? <Avatar {...avatar} size="xs" aria-hidden="true" className={cn('shrink-0', avatarClass[size], avatar.className)} /> : null}
      {showLeadingIcon && !avatar ? <span aria-hidden="true" className="inline-flex shrink-0 [&_svg]:size-3">{icon ?? <Hash />}</span> : null}
      <span data-slot="tag-label" title={label} className="min-w-0 truncate">{label}</span>
      {showRemove ? (
        <button
          ref={removeRef}
          type="button"
          data-slot="tag-remove"
          aria-label={removeLabel ?? `Remove ${label}`}
          disabled={disabled}
          onClick={onRemove}
          onKeyDown={e => {
            if (e.key === 'Backspace' || e.key === 'Delete') {
              e.preventDefault();
              onRemove?.();
            }
          }}
          className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:hover:bg-transparent"
        >
          <X aria-hidden="true" className="size-3" />
        </button>
      ) : null}
    </span>
  );
}

export { Tag };
