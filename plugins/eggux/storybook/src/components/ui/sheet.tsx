// EGG UI Sheet. Figma: Sheet (Drawer page, "Sheet / Component"), Side (right, left), slots Header,
// Content, Footer. shadcn Sheet on Radix Dialog: a full-height side drawer over an overlay, 384 wide
// (spacing/96), 24 px padding, 16 px gap, border on the inner edge, shadow lg, min width 320; 480
// for forms and 640 for a record, a table or a preview (`size`); full width on phones (under 640).
// Content (SheetBody) scrolls, the footer stays at the bottom. Focus moves to the first field in
// the body (or to the title), stays inside while open, Escape and an outside click close it, and
// focus returns to the trigger.
// The overlay, header and footer are drawn here; they can switch to the shared Scrim, Dialog
// Header and Dialog Footer once those are in code (the Figma Sheet is built from Dialog Header
// and Dialog Footer).
import * as React from 'react';
import { Dialog as SheetPrimitive } from 'radix-ui';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';

const FOCUSABLE =
  'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal(props: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

// Figma dialog/overlay. TODO Scrim: switch to the shared Scrim when it is in code.
function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn('fixed inset-0 z-50 bg-[var(--dialog-overlay)]', className)}
      {...props}
    />
  );
}

export type SheetSide = 'right' | 'left';
export type SheetSize = 'default' | 'md' | 'lg';

const sideClasses: Record<SheetSide, string> = {
  right: 'inset-y-0 right-0 border-l',
  left: 'inset-y-0 left-0 border-r',
};

// Figma: 384 details and filters (spacing/96), 480 forms, 640 a record, a table or a preview.
const sizeClasses: Record<SheetSize, string> = {
  default: 'sm:w-96',
  md: 'sm:w-[480px]',
  lg: 'sm:w-[640px]',
};

export interface SheetContentProps extends React.ComponentProps<typeof SheetPrimitive.Content> {
  /** Figma Side. right: edit or inspect one object, filters. left: navigation on mobile. Default right. */
  side?: SheetSide;
  /** Width: default 384 (details, filters), md 480 (forms), lg 640 (a record, a table, a preview). */
  size?: SheetSize;
}

function SheetContent({ side = 'right', size = 'default', className, children, onOpenAutoFocus, ...props }: SheetContentProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  // Focus the first field of the body, else the title (reference: "Focus moves to the first field
  // (or the title) on open"); Radix alone would focus the header's close X first.
  const handleOpenAutoFocus = (event: Event) => {
    onOpenAutoFocus?.(event);
    if (event.defaultPrevented) return;
    const root = ref.current;
    if (!root) return;
    const target =
      root.querySelector<HTMLElement>(`[data-slot="sheet-body"] :is(${FOCUSABLE})`) ??
      root.querySelector<HTMLElement>('[data-slot="sheet-title"]');
    if (target) {
      event.preventDefault();
      target.focus();
    }
  };
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        data-slot="sheet-content"
        data-side={side}
        data-size={size}
        onOpenAutoFocus={handleOpenAutoFocus}
        className={cn(
          'fixed z-50 flex h-full w-full min-w-[320px] flex-col gap-4 bg-background p-6 text-foreground shadow-lg outline-none',
          sideClasses[side],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

export interface SheetHeaderProps extends React.ComponentProps<'div'> {
  /** Figma Dialog Header "Show close": the X button that closes the sheet. Default true. */
  showClose?: boolean;
  /** Accessible name of the close X. Default "Close". */
  closeLabel?: string;
}

// Figma Dialog Header (title body/large, description body/small muted, close 24 with Icon/x).
// TODO Dialog Header: switch to the shared component when it is in code.
function SheetHeader({ showClose = true, closeLabel = 'Close', className, children, ...props }: SheetHeaderProps) {
  return (
    <div data-slot="sheet-header" className={cn('flex min-w-0 shrink-0 items-start gap-4', className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
      {showClose ? (
        <SheetPrimitive.Close
          data-slot="sheet-header-close"
          aria-label={closeLabel}
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
        >
          <X aria-hidden="true" className="size-4" />
        </SheetPrimitive.Close>
      ) : null}
    </div>
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      tabIndex={-1}
      className={cn('text-lg leading-7 font-semibold break-words text-foreground outline-none', className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm leading-5 break-words text-muted-foreground', className)}
      {...props}
    />
  );
}

/** Figma Content slot: fills the height and scrolls; header and footer stay put. */
function SheetBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-body"
      className={cn('-m-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-1', className)}
      {...props}
    />
  );
}

// Figma Dialog Footer: buttons right-aligned, 8 apart, primary right, Cancel outline to its left.
// TODO Dialog Footer: switch to the shared component when it is in code.
function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex shrink-0 flex-wrap items-center justify-end gap-2', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
};
