// EGG UI Avatar Group. Figma: Avatar Group (Avatar page, "Avatar Group / Component"). Size (sm,
// default, lg), Avatars slot, Names (Show names), Label (Show label). Overlapping Avatars of one
// size with a 2 px background ring, "+N" for the rest as a focusable button with the full list in
// a Tooltip (shows on hover and keyboard focus). Names and Label stay on one line and truncate at
// 200 (sm) or 240 (default, lg), filling only the space left after the avatars.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarGroupContext } from './avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export type AvatarGroupSize = 'sm' | 'default' | 'lg';

// Figma: overlap 6 (sm) / 8, gap to the text 8 (sm) / 12, text max width 200 (sm) / 240.
const stack: Record<AvatarGroupSize, string> = { sm: '-space-x-1.5', default: '-space-x-2', lg: '-space-x-2' };
const gap: Record<AvatarGroupSize, string> = { sm: 'gap-2', default: 'gap-3', lg: 'gap-3' };
const namesText: Record<AvatarGroupSize, string> = {
  sm: 'max-w-[200px] text-xs leading-4 font-medium',
  default: 'max-w-60 text-sm leading-5 font-medium',
  lg: 'max-w-60 text-sm leading-5 font-medium',
};
const labelText: Record<AvatarGroupSize, string> = {
  sm: 'max-w-[200px] text-xs leading-4',
  default: 'max-w-60 text-sm leading-5',
  lg: 'max-w-60 text-sm leading-5',
};

export interface AvatarGroupProps extends React.ComponentProps<'div'> {
  /** Figma Size: every Avatar in the slot takes it. */
  size?: AvatarGroupSize;
  /** Figma Avatars slot: 3 to 5 Avatars (or buttons that hold one). */
  children?: React.ReactNode;
  /** The "+N" for the people not shown. 0 hides it. */
  more?: number;
  /** Accessible name of the +N button ("Show 3 more assignees"). */
  moreLabel?: string;
  /** Tooltip content of +N: the full list of names. */
  moreTooltip?: React.ReactNode;
  onMoreClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Figma Names (Show names): who they are, "Ana, Mihai and 3 others". */
  names?: React.ReactNode;
  /** Figma Label (Show label): what they are, "Maintained by 3 analysts". */
  label?: React.ReactNode;
}

function AvatarGroup({
  size = 'default',
  children,
  more = 0,
  moreLabel,
  moreTooltip,
  onMoreClick,
  names,
  label,
  className,
  ...props
}: AvatarGroupProps) {
  const ctx = React.useMemo(() => ({ size, ring: true }), [size]);
  const plus = more > 0 ? (
    <button
      type="button"
      data-slot="avatar-group-more"
      aria-label={moreLabel ?? `Show ${more} more`}
      onClick={onMoreClick}
      className="relative inline-flex shrink-0 rounded-full outline-none focus-visible:z-10 focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
    >
      <Avatar initials={`+${more}`} />
    </button>
  ) : null;

  return (
    <div role="group" data-slot="avatar-group" data-size={size} className={cn('inline-flex max-w-full min-w-0 items-center', gap[size], className)} {...props}>
      <AvatarGroupContext.Provider value={ctx}>
        <div data-slot="avatar-group-avatars" className={cn('flex shrink-0 items-center', stack[size])}>
          {children}
          {plus && moreTooltip ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>{plus}</TooltipTrigger>
                <TooltipContent>{moreTooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : plus}
        </div>
      </AvatarGroupContext.Provider>
      {names ? <span data-slot="avatar-group-names" className={cn('min-w-0 truncate text-foreground', namesText[size])}>{names}</span> : null}
      {label ? <span data-slot="avatar-group-label" className={cn('min-w-0 truncate text-muted-foreground', labelText[size])}>{label}</span> : null}
    </div>
  );
}

export { AvatarGroup };
