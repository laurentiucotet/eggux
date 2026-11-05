// EGG UI Button Group and Button Group Item. Figma: Button Group, Button Group Item (Button page,
// "Button Group / Component"). Related actions of equal weight joined in one control (shadcn
// ButtonGroup): role="group" with a label, each item its own tab stop. Item: Position (first,
// middle, last; set by its place in the group, or by `position`), State (default, hover, focus,
// disabled), Label, Show label, Show icon, Icon. 36 high (density), 12 px sides, 8 px gap, 1 px
// input border (middle and last drop the left one), background fill, hover accent, at least 80
// wide, label on one line with truncation. Icon-only items (showLabel false) get the label as
// aria-label and a Tooltip with the same text.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export type ButtonGroupItemPosition = 'first' | 'middle' | 'last';

export interface ButtonGroupProps extends React.ComponentProps<'div'> {
  /** Accessible name of the group ("Invoice actions"). */
  'aria-label': string;
}

function ButtonGroup({ className, ...props }: ButtonGroupProps) {
  return <div role="group" data-slot="button-group" className={cn('inline-flex shrink-0 items-center', className)} {...props} />;
}

// Every class name in full so Tailwind can generate it.
const positionClass: Record<ButtonGroupItemPosition, string> = {
  first: 'rounded-l-button',
  middle: 'border-l-0',
  last: 'rounded-r-button border-l-0',
};
// Without `position`, the place in the group decides: first and last get the pill ends.
const autoPosition = 'not-first:border-l-0 first:rounded-l-button last:rounded-r-button';

export interface ButtonGroupItemProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  /** Figma Label. Also the aria-label and tooltip of icon-only items. */
  label: string;
  /** Figma Show label. Off makes an icon-only item (needs `icon`). Default true. */
  showLabel?: boolean;
  /** Figma Icon (Show icon): an icon from `@/components/icons`. */
  icon?: React.ReactNode;
  /** Figma Position. Leave it out inside a ButtonGroup: the item's place sets it. */
  position?: ButtonGroupItemPosition;
  /** Pressed look (accent fill) with aria-pressed, for a pair like Bold or a toggled view. */
  active?: boolean;
}

function ButtonGroupItem({ label, showLabel = true, icon, position, active, className, type = 'button', ...props }: ButtonGroupItemProps) {
  const item = (
    <button
      type={type}
      data-slot="button-group-item"
      data-position={position}
      aria-label={showLabel ? undefined : label}
      aria-pressed={active}
      className={cn(
        "relative inline-flex h-[var(--control-height)] max-w-40 min-w-20 shrink-0 items-center justify-center gap-2 border border-input bg-background px-3 text-sm font-medium leading-5 text-foreground outline-none transition-[color,background-color,box-shadow] duration-[var(--duration-fast)]",
        'hover:bg-accent hover:text-accent-foreground aria-pressed:bg-accent aria-pressed:text-accent-foreground',
        'focus-visible:z-10 focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] disabled:pointer-events-none disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        position ? positionClass[position] : autoPosition,
        className,
      )}
      {...props}
    >
      {icon}
      {showLabel ? <span className="min-w-0 truncate">{label}</span> : null}
    </button>
  );
  if (showLabel) return item;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{item}</TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { ButtonGroup, ButtonGroupItem };
