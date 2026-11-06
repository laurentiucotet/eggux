// EGG UI Popover Footer. Figma: Popover Footer (Popover page, "Popover Footer / Component",
// symbol 1092:125917). Bottom of a Popover, like Dialog Footer: an optional Start slot on the left
// (Show start: a ghost sm "Reset" or "Clear"), a spacer, then the Actions slot on the right
// (Cancel outline sm, Apply default sm), 8 px apart, centered vertically. It fills the popover
// width, min 240 (Reset, Cancel and Apply side by side). Only for popovers whose choices apply on
// a button press; one primary action, on the right. Reading order: Start, then Actions.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PopoverFooterProps extends React.ComponentProps<'div'> {
  /** Figma Start slot (Show start): usually a ghost sm Button "Reset". */
  start?: React.ReactNode;
}

/** Figma Actions slot: the children, right aligned (Cancel then the one primary action). */
function PopoverFooter({ start, className, children, ...props }: PopoverFooterProps) {
  return (
    <div data-slot="popover-footer" className={cn('flex w-full min-w-60 items-center gap-2', className)} {...props}>
      {start != null ? (
        <div data-slot="popover-footer-start" className="flex shrink-0 items-center gap-2">
          {start}
        </div>
      ) : null}
      <div aria-hidden="true" className="min-w-0 flex-1" />
      <div data-slot="popover-footer-actions" className="flex shrink-0 items-center gap-2">
        {children}
      </div>
    </div>
  );
}

export { PopoverFooter };
