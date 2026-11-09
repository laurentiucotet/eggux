// EGG UI Popover Header. Figma: Popover Header (Popover page, "Popover Header / Component",
// symbol 1092:125910). Top of a Popover, like Dialog Header: Title (ui/label 14/20 medium,
// foreground/popover, 2 lines then ellipsis), optional Description (body/small, muted, 3 lines)
// 4 px under it, and a 20 px close X with a 16 px icon (Show close), 8 px from the text. It fills
// the popover width (min 160). Put it first in PopoverContent and point the content's
// aria-labelledby at the title id (`titleId`). The X closes the popover (Radix PopoverClose), so
// the header must render inside a Popover.
import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { PopoverClose } from './popover';

export interface PopoverHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Title: names the task or the content ("Filter by status"). */
  title: React.ReactNode;
  /** Id of the title, for aria-labelledby on PopoverContent. Generated when left out. */
  titleId?: string;
  /** Figma Description (Show description): one or two sentences, muted. */
  description?: React.ReactNode;
  /** Figma Show close: the 20 px X. Default true. */
  showClose?: boolean;
  /** Accessible name of the close X. */
  closeLabel?: string;
}

function PopoverHeader({ title, titleId, description, showClose = true, closeLabel = 'Close', className, ...props }: PopoverHeaderProps) {
  const fallbackId = React.useId();
  const id = titleId ?? `${fallbackId}-title`;
  return (
    <div data-slot="popover-header" className={cn('flex w-full min-w-40 items-start gap-2', className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-col gap-1 break-words">
        <h3 id={id} data-slot="popover-title" className="line-clamp-2 text-sm leading-5 font-medium text-popover-foreground">
          {title}
        </h3>
        {description != null ? (
          <p data-slot="popover-description" className="line-clamp-3 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {showClose ? (
        <PopoverClose
          data-slot="popover-header-close"
          aria-label={closeLabel}
          className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] [&_svg]:size-4"
        >
          <X aria-hidden="true" />
        </PopoverClose>
      ) : null}
    </div>
  );
}

export { PopoverHeader };
