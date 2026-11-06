// EGG UI Dialog Footer. Figma: Dialog Footer (Dialog page, "Dialog / Component"). shadcn
// DialogFooter with the Figma Actions slot: buttons right aligned, 8 px apart, Cancel (outline)
// left of the one primary action. A left-side item (a checkbox, a link) goes first and takes the
// free space (give it `mr-auto`). When the row is too narrow the buttons wrap, still right aligned.
// Used by Dialog and Alert Dialog and meant for Sheet and Drawer too.
import * as React from 'react';
import { cn } from '@/lib/utils';

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex w-full min-w-0 shrink-0 flex-wrap items-center justify-end gap-2', className)}
      {...props}
    />
  );
}

export { DialogFooter };
