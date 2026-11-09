// EGG UI Drawer. Figma: Drawer (Drawer page, "Drawer / Component"), Show handle, slots Header,
// Content, Footer. The bottom sheet for mobile: filters, sort, quick actions, a short form or a
// confirmation. shadcn uses vaul for it; vaul is not in this library, so this is Radix Dialog
// fixed to the bottom edge: full width, radius xl on top, border on top, shadow lg, 16 px sides
// and top, 24 px bottom plus the safe area, 16 px gap, a 96 × 8 handle, full-width stacked footer
// buttons 8 apart, primary first. Max 80 % of the screen height; the body scrolls past that.
// Outside tap, Escape and Cancel close it, focus moves to the first field (or the title) and
// returns to the trigger. Not included: drag down to close (the handle is visual only).
// The overlay and header are drawn here; they can switch to the shared Scrim and Dialog Header
// (Show close off) once those are in code.
import * as React from 'react';
import { Dialog as DrawerPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

const FOCUSABLE =
  'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

function Drawer(props: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger(props: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerClose(props: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerPortal(props: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

// Figma dialog/overlay. TODO Scrim: switch to the shared Scrim when it is in code.
function DrawerOverlay({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn('fixed inset-0 z-50 bg-[var(--dialog-overlay)]', className)}
      {...props}
    />
  );
}

export interface DrawerContentProps extends React.ComponentProps<typeof DrawerPrimitive.Content> {
  /** Figma "Show handle": the 96 × 8 bar on top. Default true. Visual only: drag to close is not built. */
  showHandle?: boolean;
}

function DrawerContent({ showHandle = true, className, children, onOpenAutoFocus, ...props }: DrawerContentProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const handleOpenAutoFocus = (event: Event) => {
    onOpenAutoFocus?.(event);
    if (event.defaultPrevented) return;
    const root = ref.current;
    if (!root) return;
    const target =
      root.querySelector<HTMLElement>(`[data-slot="drawer-body"] :is(${FOCUSABLE})`) ??
      root.querySelector<HTMLElement>('[data-slot="drawer-title"]');
    if (target) {
      event.preventDefault();
      target.focus();
    }
  };
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        data-slot="drawer-content"
        onOpenAutoFocus={handleOpenAutoFocus}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[80dvh] flex-col items-center gap-4 rounded-t-xl border-t bg-background px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-foreground shadow-lg outline-none',
          className,
        )}
        {...props}
      >
        {showHandle ? <div data-slot="drawer-handle" aria-hidden="true" className="h-2 w-24 shrink-0 rounded-full bg-muted" /> : null}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

// Figma Dialog Header with Show close off. TODO Dialog Header: switch to the shared component.
function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="drawer-header" className={cn('flex w-full min-w-0 shrink-0 flex-col gap-2', className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      tabIndex={-1}
      className={cn('text-lg leading-7 font-semibold break-words text-foreground outline-none', className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-sm leading-5 break-words text-muted-foreground', className)}
      {...props}
    />
  );
}

/** Figma Content slot: short content; scrolls when the drawer reaches its max height. */
function DrawerBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-body"
      className={cn('-m-1 flex min-h-0 w-[calc(100%+0.5rem)] flex-col gap-4 overflow-y-auto p-1', className)}
      {...props}
    />
  );
}

/** Figma Footer slot: full-width buttons stacked 8 apart, primary first. */
function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('flex w-full shrink-0 flex-col gap-2 [&>*]:w-full', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
};
