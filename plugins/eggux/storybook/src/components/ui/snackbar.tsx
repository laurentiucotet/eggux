// EGG UI Snackbar. Code only (no Figma component yet). Mobile page / Snackbar.
// Not a second toast: Toast already has an action, a close button, auto-dismiss, a polite live
// region, a timer that pauses on hover and focus, and Escape. Snackbar is the mobile variant of it:
// the same Toast part (inverted style, close on, an action when given), anchored to the bottom
// edge, full width with 16 px sides and the safe area below, up to 3 stacked, newest at the bottom.
// Controlled: the app keeps the list (`useSnackbarQueue()` is a small helper for it) and removes an
// item in `onDismiss`. Radix gives: polite announcement, pause while the pointer is over the stack
// or focus is inside it (so Undo never disappears under a finger or a focused button), Escape or
// the close button dismiss, F8 moves focus into the stack, swipe sideways to dismiss. Short
// message, one line, one action at most; never the only place for important information.
// Use `className` to lift the stack above a Bottom Nav (for example `bottom-20`).
import * as React from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { Toast, ToastProvider, type ToastProps } from './toast';

export interface SnackbarAction {
  /** One verb: "Undo", "View". */
  label: string;
  onClick?: () => void;
}

export interface SnackbarItem {
  id: string;
  message: React.ReactNode;
  action?: SnackbarAction;
  /** Milliseconds before it goes away. Default 6000. Infinity keeps it until dismissed. */
  duration?: number;
  /** Show the close button. Default true. */
  close?: boolean;
}

export interface SnackbarProps extends Omit<ToastProps, 'title' | 'description' | 'type' | 'toastStyle' | 'avatar' | 'progress' | 'action'> {
  /** The one-line message. */
  message: React.ReactNode;
  action?: SnackbarAction;
}

/** One snackbar: a Toast in the inverted style with the close button on. Render it inside a SnackbarProvider and a SnackbarViewport (or use SnackbarStack). */
function Snackbar({ message, action, close = true, duration = 6000, className, ...props }: SnackbarProps) {
  return (
    <Toast
      data-slot="snackbar"
      toastStyle="inverted"
      title={message}
      action={action}
      close={close}
      duration={duration}
      className={cn('motion-reduce:transition-none', className)}
      {...props}
    />
  );
}

function SnackbarViewport({ fixed = true, className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport> & { fixed?: boolean }) {
  return (
    <ToastPrimitive.Viewport
      data-slot="snackbar-viewport"
      className={cn(
        'pointer-events-none z-[100] m-0 flex w-full list-none flex-col gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] outline-none',
        fixed ? 'fixed inset-x-0 bottom-0' : 'relative',
        className,
      )}
      {...props}
    />
  );
}

export interface SnackbarStackProps {
  items: SnackbarItem[];
  /** Called when an item times out, is closed, swiped, escaped or its action runs. Remove it from the list. */
  onDismiss: (id: string) => void;
  /** How many show at once; older ones are dismissed. Default 3. */
  max?: number;
  /** Default time before auto-dismiss, ms. */
  duration?: number;
  /** Position: fixed to the bottom of the screen (default) or in the flow, for a framed preview. */
  fixed?: boolean;
  /** Name of the notifications region, translated by the app. */
  label?: string;
  /** Accessible name of the close buttons, translated by the app. */
  closeLabel?: string;
  className?: string;
}

function SnackbarStack({ items, onDismiss, max = 3, duration = 6000, fixed = true, label = 'Notifications ({hotkey})', closeLabel = 'Dismiss', className }: SnackbarStackProps) {
  const overflow = items.length > max ? items.slice(0, items.length - max) : [];
  const overflowKey = overflow.map(i => i.id).join('|');
  const dismissRef = React.useRef(onDismiss);
  dismissRef.current = onDismiss;
  // The newest `max` stay; older ones are dropped so the stack never grows past it.
  React.useEffect(() => {
    if (overflowKey) overflowKey.split('|').forEach(id => dismissRef.current(id));
  }, [overflowKey]);
  const shown = items.slice(-max);
  return (
    <ToastProvider swipeDirection="right">
      {shown.map(({ id, message, action, duration: own, close }) => (
        <Snackbar
          key={id}
          message={message}
          action={action}
          close={close}
          closeLabel={closeLabel}
          duration={own ?? duration}
          defaultOpen
          onOpenChange={open => {
            if (!open) onDismiss(id);
          }}
        />
      ))}
      <SnackbarViewport fixed={fixed} label={label} className={className} />
    </ToastProvider>
  );
}

/** A small list helper: `show()` adds an item and returns its id, `dismiss(id)` removes one. */
function useSnackbarQueue() {
  const [items, setItems] = React.useState<SnackbarItem[]>([]);
  const counter = React.useRef(0);
  const show = React.useCallback((item: Omit<SnackbarItem, 'id'> & { id?: string }) => {
    const id = item.id ?? `snackbar-${++counter.current}`;
    setItems(list => [...list.filter(i => i.id !== id), { ...item, id }]);
    return id;
  }, []);
  const dismiss = React.useCallback((id: string) => setItems(list => list.filter(i => i.id !== id)), []);
  return { items, show, dismiss };
}

export { Snackbar, SnackbarViewport, SnackbarStack, useSnackbarQueue };
export const SnackbarProvider = ToastProvider;
