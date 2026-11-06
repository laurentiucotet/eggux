// EGG UI Dialog. Figma: Dialog (Dialog page, "Dialog / Component"). shadcn Dialog on Radix with
// the Figma native slots Header (Dialog Header), Content (DialogBody) and Footer (Dialog Footer),
// a Scrim Tone=dialog behind it, 24 px padding, 16 px between the slots, radius lg, border,
// shadow lg. Size: sm 384, default 512, lg 672, xl 896 (Tailwind max-w-sm / lg / 2xl / 4xl, the
// Figma layout/container/* widths), always 16 px from the viewport edges; fullscreen fills the
// viewport with 16 px padding and no radius, border or shadow (Figma 390 x 844, mobile).
// Long content scrolls inside DialogBody; header and footer stay fixed.
// Behavior: focus moves to the first field of the body on open (else the first focusable
// element), stays inside while open, Escape and a click on the scrim close it, focus returns to
// the trigger. The title is the accessible name (aria-labelledby), the description the
// accessible description (aria-describedby).
import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { scrimVariants } from './scrim';
import { DialogDescription, DialogHeader, DialogHeaderIcon, DialogTitle } from './dialog-header';
import { DialogFooter } from './dialog-footer';

const TABBABLE =
  'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/** First keyboard-reachable element inside `root`, skipping hidden ones. */
function firstTabbable(root: Element | null | undefined): HTMLElement | null {
  if (!root) return null;
  for (const el of Array.from(root.querySelectorAll<HTMLElement>(TABBABLE))) {
    if (el.closest('[inert], [hidden]')) continue;
    if (el.getClientRects().length === 0) continue;
    return el;
  }
  return null;
}

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/** Figma Scrim Tone=dialog over the whole viewport. */
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(scrimVariants({ tone: 'dialog', position: 'fixed' }), className)}
      {...props}
    />
  );
}

const dialogContentVariants = cva(
  'fixed z-50 flex flex-col gap-4 bg-background text-foreground outline-none',
  {
    variants: {
      size: {
        sm: 'top-1/2 left-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg',
        default: 'top-1/2 left-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg',
        lg: 'top-1/2 left-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg',
        xl: 'top-1/2 left-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg',
        fullscreen: 'inset-0 h-dvh w-full rounded-none border-0 p-4 shadow-none',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export type DialogSize = NonNullable<VariantProps<typeof dialogContentVariants>['size']>;

export interface DialogContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {}

function DialogContent({ className, size = 'default', children, onOpenAutoFocus, ref, ...props }: DialogContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement);
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-size={size}
        className={cn(dialogContentVariants({ size }), className)}
        onOpenAutoFocus={event => {
          onOpenAutoFocus?.(event);
          if (event.defaultPrevented) return;
          // Figma: "Focus moves to the first field on open", not to the close X of the header.
          const field = firstTabbable(contentRef.current?.querySelector('[data-slot="dialog-body"]'));
          if (field) {
            event.preventDefault();
            field.focus({ preventScroll: true });
          }
        }}
        {...props}
        ref={contentRef}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * Figma Content slot. Fills the space between header and footer and scrolls when the content is
 * longer than the dialog; a scrolling body becomes focusable so keyboard users can scroll it.
 */
function DialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setScrollable(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      data-slot="dialog-body"
      data-scrollable={scrollable || undefined}
      tabIndex={scrollable ? 0 : undefined}
      // The 4 px inset keeps the focus rings of fields at the edges inside the scroll box.
      className={cn(
        '-m-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-1 text-sm text-foreground outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]',
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogBody,
  DialogHeader,
  DialogHeaderIcon,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  dialogContentVariants,
};
