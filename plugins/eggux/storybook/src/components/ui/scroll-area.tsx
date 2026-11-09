// EGG UI Scroll Area. Figma: Scroll Area (Scroll Area page, "Scroll Area / Component", 272:1320).
// Orientation (vertical, horizontal). shadcn ScrollArea on the radix-ui primitive: a region that
// scrolls inside the page with a thin styled scrollbar (10 px track, 6 px border-colored thumb, 2 px
// inset). Give it a fixed or max height; it clips on purpose. The page stays the main scroll; never
// nest two scroll areas in the same direction.
// A11y: keyboard scrolling keeps working; the viewport is focusable so a region without focusable
// content can still be scrolled by keyboard; pass aria-label to name a region that holds a section.
import * as React from 'react';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Name for the scrolling region. */
  'aria-label'?: string;
  /** Make the viewport a tab stop (on by default; turn off when the content has focusable items). */
  focusable?: boolean;
}

function ScrollArea({ orientation = 'vertical', focusable = true, className, children, 'aria-label': ariaLabel, ...props }: ScrollAreaProps) {
  return (
    // type="always": Figma shows the bar at rest, so people see that more content exists.
    <ScrollAreaPrimitive.Root data-slot="scroll-area" type="always" className={cn('relative overflow-hidden', className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        tabIndex={focusable ? 0 : undefined}
        role={ariaLabel ? 'region' : undefined}
        aria-label={ariaLabel}
        className="size-full rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' ? <ScrollBar orientation="vertical" /> : null}
      {orientation !== 'vertical' ? <ScrollBar orientation="horizontal" /> : null}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({ className, orientation = 'vertical', ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'group/bar flex touch-none p-0.5 select-none',
        orientation === 'vertical' ? 'h-full w-2.5' : 'h-2.5 flex-col',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb data-slot="scroll-area-thumb" className="relative flex-1 rounded-full bg-border group-hover/bar:bg-muted-foreground/40" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
