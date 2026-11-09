// EGG UI Chip. Figma: Chip (Chip page, "Chip / Component"). State (default, hover, focus, selected,
// disabled) x Tone (default, soft-info, soft-success, soft-warning, soft-neutral, category-1..8) x
// Size (sm 24, default 32, lg 40); Label, Show leading icon (calendar, check when selected), Show
// avatar (exposed Avatar xs, sm on lg), Show count + Count value, Show remove. A pill for filters,
// multi-selection and tags. Selectable chips are toggle buttons (aria-pressed); inside a single
// select Chip Group they are radios. Remove is a separate button "Remove <label>" next to the
// chip's own button (never nested). The chip hugs its content up to 320 and the label truncates;
// avatar, icon, count and x never shrink. Hover, focus and selected follow the Figma states;
// selected stays on Tone=default.
import * as React from 'react';
import { Calendar, Check, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar, type AvatarProps } from './avatar';

export type ChipTone =
  | 'default' | 'soft-info' | 'soft-success' | 'soft-warning' | 'soft-neutral'
  | 'category-1' | 'category-2' | 'category-3' | 'category-4' | 'category-5' | 'category-6' | 'category-7' | 'category-8';
export type ChipSize = 'sm' | 'default' | 'lg';

// Fill, border and text per Tone (State=default). The soft and category borders are the fill
// token, like Figma; hover draws the border in the text color. Class names are written in full.
const toneClass: Record<ChipTone, string> = {
  default: 'border-input bg-background text-foreground',
  'soft-info': 'border-[var(--badge-soft-info-bg)] bg-[var(--badge-soft-info-bg)] text-[var(--badge-soft-info-fg)]',
  'soft-success': 'border-[var(--badge-soft-success-bg)] bg-[var(--badge-soft-success-bg)] text-[var(--badge-soft-success-fg)]',
  'soft-warning': 'border-[var(--badge-soft-warning-bg)] bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]',
  'soft-neutral': 'border-[var(--badge-soft-neutral-bg)] bg-[var(--badge-soft-neutral-bg)] text-[var(--badge-soft-neutral-fg)]',
  'category-1': 'border-[var(--badge-category-1-bg)] bg-[var(--badge-category-1-bg)] text-[var(--badge-category-1-fg)]',
  'category-2': 'border-[var(--badge-category-2-bg)] bg-[var(--badge-category-2-bg)] text-[var(--badge-category-2-fg)]',
  'category-3': 'border-[var(--badge-category-3-bg)] bg-[var(--badge-category-3-bg)] text-[var(--badge-category-3-fg)]',
  'category-4': 'border-[var(--badge-category-4-bg)] bg-[var(--badge-category-4-bg)] text-[var(--badge-category-4-fg)]',
  'category-5': 'border-[var(--badge-category-5-bg)] bg-[var(--badge-category-5-bg)] text-[var(--badge-category-5-fg)]',
  'category-6': 'border-[var(--badge-category-6-bg)] bg-[var(--badge-category-6-bg)] text-[var(--badge-category-6-fg)]',
  'category-7': 'border-[var(--badge-category-7-bg)] bg-[var(--badge-category-7-bg)] text-[var(--badge-category-7-fg)]',
  'category-8': 'border-[var(--badge-category-8-bg)] bg-[var(--badge-category-8-bg)] text-[var(--badge-category-8-fg)]',
};
const toneHover: Record<ChipTone, string> = {
  default: 'hover:bg-accent hover:text-accent-foreground',
  'soft-info': 'hover:border-current', 'soft-success': 'hover:border-current', 'soft-warning': 'hover:border-current', 'soft-neutral': 'hover:border-current',
  'category-1': 'hover:border-current', 'category-2': 'hover:border-current', 'category-3': 'hover:border-current', 'category-4': 'hover:border-current',
  'category-5': 'hover:border-current', 'category-6': 'hover:border-current', 'category-7': 'hover:border-current', 'category-8': 'hover:border-current',
};
const selectedClass = 'border-primary bg-primary text-primary-foreground';

// Figma: sm 24 (8 sides, 4 gap, ui/label-small, 14 icons), default 32 (12, 6, ui/label, 16), lg 40 (16, 8, ui/label, 16).
const sizeClass: Record<ChipSize, string> = {
  sm: "h-6 text-xs leading-4 [&_svg:not([class*='size-'])]:size-3.5",
  default: "h-8 text-sm leading-5 [&_svg:not([class*='size-'])]:size-4",
  lg: "h-10 text-sm leading-5 [&_svg:not([class*='size-'])]:size-4",
};
const mainClass: Record<ChipSize, string> = { sm: 'gap-1 px-2', default: 'gap-1.5 px-3', lg: 'gap-2 px-4' };
const removeClass: Record<ChipSize, string> = { sm: 'ml-1 mr-2', default: 'ml-1.5 mr-3', lg: 'ml-2 mr-4' };
// The avatar sits 2 (sm), 6 (default) or 8 (lg) px from the edge.
const avatarClass: Record<ChipSize, string> = { sm: '-ml-1.5', default: '-ml-1.5', lg: '-ml-2' };

/** Set by Chip Group: selection type, the selected values and the chips' Size. */
export interface ChipGroupContextValue {
  type: 'single' | 'multiple' | 'none';
  value: string[];
  toggle: (value: string) => void;
  size?: ChipSize;
}
const ChipGroupContext = React.createContext<ChipGroupContextValue | null>(null);

export interface ChipProps extends Omit<React.ComponentProps<'button'>, 'value' | 'children'> {
  /** Figma Label: one or two words in sentence case. */
  label?: string;
  /** Figma Tone. Soft and category tones are tags; selection stays on Tone=default. */
  tone?: ChipTone;
  /** Figma Size. Inside a Chip Group the group's Size wins. */
  size?: ChipSize;
  /** Figma State=selected (controlled): makes the chip a toggle button with aria-pressed. */
  selected?: boolean;
  /** Uncontrolled selected state. */
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Value inside a Chip Group. */
  value?: string;
  /** Figma Show leading icon; the icon becomes a check when selected. */
  showLeadingIcon?: boolean;
  /** Figma leading icon swap. Default Calendar. */
  icon?: React.ReactNode;
  /** Figma Show avatar: the exposed Avatar (people filters). Size follows the chip. */
  avatar?: Omit<AvatarProps, 'size'>;
  /** Figma Show count + Count value: a number after the label. */
  count?: number | string;
  /** Read after the count: "Open, 12 results". */
  countLabel?: string;
  /** Figma Show remove: the x button. */
  showRemove?: boolean;
  onRemove?: () => void;
  /** Accessible name of the x. Default "Remove <label>". */
  removeLabel?: string;
}

function Chip({
  label = 'This week',
  tone = 'default',
  size: sizeProp,
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  value,
  showLeadingIcon = false,
  icon,
  avatar,
  count,
  countLabel = 'results',
  showRemove = false,
  onRemove,
  removeLabel,
  disabled = false,
  className,
  onClick,
  ...props
}: ChipProps) {
  const group = React.useContext(ChipGroupContext);
  const size: ChipSize = group?.size ?? sizeProp ?? 'default';
  const [inner, setInner] = React.useState(defaultSelected ?? false);
  const inGroup = !!group && group.type !== 'none' && value !== undefined;
  const selectable = inGroup || selectedProp !== undefined || defaultSelected !== undefined || !!onSelectedChange;
  const selected = inGroup ? group!.value.includes(value!) : (selectedProp ?? inner);
  const interactive = selectable || !!onClick;
  const isSelected = selectable && selected && tone === 'default';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (inGroup) group!.toggle(value!);
    else if (selectable) {
      if (selectedProp === undefined) setInner(!selected);
      onSelectedChange?.(!selected);
    }
  };

  const content = (
    <>
      {avatar ? <Avatar {...avatar} size={size === 'lg' ? 'sm' : 'xs'} aria-hidden="true" className={cn('shrink-0', avatarClass[size], avatar.className)} /> : null}
      {showLeadingIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">{isSelected ? <Check /> : (icon ?? <Calendar />)}</span>
      ) : null}
      <span data-slot="chip-label" className="min-w-0 truncate">{label}{count !== undefined ? <span className="sr-only">,</span> : null}</span>
      {count !== undefined ? (
        <span data-slot="chip-count" className="shrink-0 tabular-nums">
          {count}<span className="sr-only"> {countLabel}</span>
        </span>
      ) : null}
    </>
  );

  const main = cn('inline-flex h-full min-w-0 items-center rounded-full outline-none', mainClass[size], showRemove && 'pr-0');
  const role = inGroup && group!.type === 'single' ? 'radio' : undefined;

  return (
    <span
      data-slot="chip"
      data-tone={tone}
      data-size={size}
      data-state={isSelected ? 'selected' : 'default'}
      data-disabled={disabled || undefined}
      className={cn(
        'inline-flex max-w-80 min-w-0 items-center rounded-full border font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow] duration-[var(--duration-fast)]',
        'has-[[data-slot=chip-button]:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        sizeClass[size],
        isSelected ? selectedClass : toneClass[tone],
        interactive && !disabled && !isSelected && toneHover[tone],
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {interactive ? (
        <button
          type="button"
          data-slot="chip-button"
          data-value={value}
          role={role}
          aria-checked={role ? selected : undefined}
          aria-pressed={selectable && !role ? selected : undefined}
          disabled={disabled}
          onClick={handleClick}
          className={cn(main, 'cursor-pointer disabled:cursor-default')}
          {...props}
        >
          {content}
        </button>
      ) : (
        <span data-slot="chip-content" className={main}>{content}</span>
      )}
      {showRemove ? (
        <button
          type="button"
          data-slot="chip-remove"
          aria-label={removeLabel ?? `Remove ${label}`}
          disabled={disabled}
          onClick={onRemove}
          className={cn(
            'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring',
            removeClass[size],
          )}
        >
          <X aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}

export { Chip, ChipGroupContext };
