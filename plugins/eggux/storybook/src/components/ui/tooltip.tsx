// EGG UI Tooltip. Figma: Tooltip (Tooltip page, "Tooltip / Component"). Side (top, bottom, left,
// right) x Variant (default, light), Label, Title (Show title), Shortcut (Show shortcut, a Kbd or
// KbdGroup). shadcn Tooltip on Radix: shows on hover and keyboard focus after a short delay,
// Escape hides it, wraps at 280. Info Tip (click, works on touch) lives in info-tip.tsx.
import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type TooltipVariant = 'default' | 'light';

function TooltipProvider({ delayDuration = 300, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />;
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export interface TooltipContentProps extends Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, 'title'> {
  /** Figma Variant: default (primary fill, the standard) or light (popover surface, border, shadow). One per product. */
  variant?: TooltipVariant;
  /** Figma Title (Show title): makes a rich tooltip. */
  title?: React.ReactNode;
  /** Figma Show shortcut: a Kbd or KbdGroup after the text. */
  shortcut?: React.ReactNode;
}

// Every class name is written in full so Tailwind can generate it.
const bubble: Record<TooltipVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  light: 'border border-border bg-popover text-popover-foreground shadow-md',
};
const arrow: Record<TooltipVariant, string> = {
  default: 'fill-primary',
  light: 'fill-popover stroke-border',
};

function TooltipContent({ variant = 'default', title, shortcut, side = 'top', sideOffset = 0, className, children, ...props }: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        data-variant={variant}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(
          'z-50 flex w-fit max-w-[calc(100vw-16px)] items-center gap-2 rounded-md px-3 py-1.5 text-xs leading-4',
          bubble[variant],
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 max-w-70 flex-col gap-0.5 break-words">
          {title ? <p data-slot="tooltip-title" className="text-sm font-medium leading-5">{title}</p> : null}
          <p data-slot="tooltip-label">{children}</p>
        </div>
        {shortcut ? <span data-slot="tooltip-shortcut" className="shrink-0">{shortcut}</span> : null}
        <TooltipPrimitive.Arrow width={10} height={5} className={arrow[variant]} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
