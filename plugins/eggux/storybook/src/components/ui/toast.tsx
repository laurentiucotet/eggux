// EGG UI Toast. Figma: Toast (Toast page, "Toast / Component"). Type (default, success, error,
// warning, info, loading) x Style (default, inverted), Title, Description (Show description),
// Action (Show action), Close (Show close), Avatar (Show avatar, Type=default only), Progress
// (Show progress, Size=sm). Built from Button (action, close), Progress and the icon set; the
// Avatar is a slot (no Avatar component in code yet).
// shadcn maps Toast to Sonner, which is not installed: this is the radix-ui Toast primitive plus a
// small store, so `toast()` works from anywhere and <Toaster /> renders the stack.
// Radix gives: live region (polite, assertive for errors), swipe and Escape to dismiss, timer
// paused on hover, focus and while the window is hidden, F8 to focus the viewport.
// The Figma property "Type" is `type`; Radix's own `type` is derived from it (error = assertive).
// The Figma "Style" prop is `toastStyle`, because `style` is the React inline-style prop.
import * as React from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';
import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Progress } from './progress';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastStyle = 'default' | 'inverted';

const icons = {
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
  loading: LoaderCircle,
} as const;

// Icon color per Type in Style=default. Style=inverted icons are monochrome (the root text color).
const iconColor: Record<Exclude<ToastType, 'default'>, string> = {
  success: 'text-success',
  error: 'text-destructive',
  warning: 'text-warning',
  info: 'text-info',
  loading: 'text-muted-foreground',
};

export interface ToastProps extends Omit<React.ComponentProps<typeof ToastPrimitive.Root>, 'type' | 'title' | 'content'> {
  /** Figma Type. Error toasts are announced assertively, the others politely. */
  type?: ToastType;
  /** Figma Style: default (popover surface, border) or inverted (dark in Light, light in Dark). One Style per product. */
  toastStyle?: ToastStyle;
  /** Figma Title: one line, past tense, names the object. */
  title: React.ReactNode;
  /** Figma Description (Show description). */
  description?: React.ReactNode;
  /** Figma Show action: one verb ("Undo", "View"). */
  action?: { label: string; onClick?: () => void; altText?: string };
  /** Figma Show close. On for toasts with an action, errors and long durations. */
  close?: boolean;
  /** Accessible name of the close button, translated by the app. */
  closeLabel?: string;
  /** Figma Show avatar (Type=default only): a person or app Avatar, 24 px. */
  avatar?: React.ReactNode;
  /** Figma Show progress: 0 to 100, a 4 px bar under the text (upload, or the time left to Undo). */
  progress?: number;
  /** Accessible name of the progress bar ("Upload progress"). */
  progressLabel?: string;
  /** Override the announcement: errors default to assertive, the rest to polite. */
  politeness?: 'polite' | 'assertive';
}

function Toast({
  type = 'default',
  toastStyle = 'default',
  title,
  description,
  action,
  close = false,
  closeLabel = 'Dismiss',
  avatar,
  progress,
  progressLabel = 'Progress',
  politeness,
  className,
  duration,
  ...props
}: ToastProps) {
  const inverted = toastStyle === 'inverted';
  const Icon = type === 'default' ? null : icons[type];
  const assertive = (politeness ?? (type === 'error' ? 'assertive' : 'polite')) === 'assertive';
  // Auto-dismiss: 5 s, 9 s with an action. A loading toast and a toast with a progress bar stay
  // until the work ends (the app updates or dismisses them).
  const autoDuration = duration ?? (type === 'loading' || progress !== undefined ? Infinity : action ? 9000 : 5000);
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-type={type}
      data-style={toastStyle}
      type={assertive ? 'foreground' : 'background'}
      duration={autoDuration}
      className={cn(
        'group pointer-events-auto relative flex w-full min-w-0 list-none items-center gap-3 rounded-md p-4 text-sm shadow-lg outline-none',
        'transition-transform duration-[var(--duration-fast)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=closed]:opacity-0',
        'focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        inverted ? 'bg-foreground text-background' : 'border border-border bg-popover text-popover-foreground',
        className,
      )}
      {...props}
    >
      {avatar && type === 'default' ? (
        <span data-slot="toast-avatar" className="flex size-6 shrink-0 items-center justify-center">{avatar}</span>
      ) : null}
      {Icon ? (
        <span data-slot="toast-icon" className={cn('flex size-4 shrink-0 items-center', !inverted && iconColor[type as Exclude<ToastType, 'default'>])}>
          <Icon aria-hidden="true" className={cn('size-4', type === 'loading' && 'animate-spin motion-reduce:animate-none')} />
        </span>
      ) : null}
      <div data-slot="toast-content" className="flex min-w-0 flex-1 flex-col gap-0.5">
        <ToastPrimitive.Title data-slot="toast-title" className="break-words font-medium">{title}</ToastPrimitive.Title>
        {description ? (
          <ToastPrimitive.Description
            data-slot="toast-description"
            className={cn('break-words', inverted ? 'opacity-80' : 'text-muted-foreground')}
          >
            {description}
          </ToastPrimitive.Description>
        ) : null}
        {progress !== undefined ? (
          <div data-slot="toast-progress" className="pt-2">
            <Progress size="sm" value={progress} aria-label={progressLabel} />
          </div>
        ) : null}
      </div>
      {action ? (
        <ToastPrimitive.Action asChild altText={action.altText ?? action.label}>
          <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={action.onClick}>
            {action.label}
          </Button>
        </ToastPrimitive.Action>
      ) : null}
      {close ? (
        <ToastPrimitive.Close asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={closeLabel}
            className={cn('size-6 shrink-0 rounded-sm! [&_svg:not([class*="size-"])]:size-4', inverted && 'text-background hover:bg-background/15 hover:text-background')}
          >
            <X aria-hidden="true" />
          </Button>
        </ToastPrimitive.Close>
      ) : null}
    </ToastPrimitive.Root>
  );
}

/** Where toasts stack: bottom right, top center on mobile. Same position everywhere. */
function ToastViewport({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        'pointer-events-none fixed left-1/2 top-0 z-[100] m-0 flex w-96 max-w-full -translate-x-1/2 list-none flex-col gap-3 p-4 outline-none sm:bottom-0 sm:left-auto sm:right-0 sm:top-auto sm:translate-x-0 sm:flex-col-reverse',
        className,
      )}
      {...props}
    />
  );
}

/* ---------- store: toast() from anywhere, <Toaster /> renders the stack ---------- */

export interface ToastOptions extends Omit<ToastProps, 'title' | 'open' | 'onOpenChange' | 'defaultOpen' | 'type' | 'toastStyle'> {
  id?: string;
  description?: React.ReactNode;
}
type ToastItem = ToastOptions & { id: string; title: React.ReactNode; type: ToastType };

let items: ToastItem[] = [];
const listeners = new Set<() => void>();
let counter = 0;
const emit = () => listeners.forEach(l => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => items;

function create(type: ToastType, title: React.ReactNode, options: ToastOptions = {}): string {
  const id = options.id ?? `toast-${++counter}`;
  const item = { ...options, id, title, type };
  items = items.some(t => t.id === id) ? items.map(t => (t.id === id ? { ...t, ...item } : t)) : [...items, item];
  emit();
  return id;
}

/** `toast('Invoice INV-1048 created')`, `toast.success(...)`, `toast.error(...)`, `toast.loading(...)`. Returns the id. */
const toast = Object.assign((title: React.ReactNode, options?: ToastOptions) => create('default', title, options), {
  success: (title: React.ReactNode, options?: ToastOptions) => create('success', title, options),
  error: (title: React.ReactNode, options?: ToastOptions) => create('error', title, options),
  warning: (title: React.ReactNode, options?: ToastOptions) => create('warning', title, options),
  info: (title: React.ReactNode, options?: ToastOptions) => create('info', title, options),
  loading: (title: React.ReactNode, options?: ToastOptions) => create('loading', title, options),
  /** Change a toast in place: loading to success, or a new progress value. */
  update: (id: string, patch: Partial<ToastItem>) => {
    items = items.map(t => (t.id === id ? { ...t, ...patch } : t));
    emit();
  },
  /** Remove one toast, or all of them without an id. */
  dismiss: (id?: string) => {
    items = id ? items.filter(t => t.id !== id) : [];
    emit();
  },
});

function useToasts() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export interface ToasterProps {
  /** Figma Style, one per product. */
  toastStyle?: ToastStyle;
  /** Default time before auto-dismiss, ms. */
  duration?: number;
  /** Name of the notifications region, translated by the app. */
  label?: string;
  className?: string;
}

function Toaster({ toastStyle = 'default', duration, label = 'Notifications ({hotkey})', className }: ToasterProps) {
  const list = useToasts();
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {list.map(({ id, ...t }) => (
        <Toast key={id} toastStyle={toastStyle} duration={duration} {...t} defaultOpen onOpenChange={open => { if (!open) toast.dismiss(id); }} />
      ))}
      <ToastViewport label={label} className={className} />
    </ToastPrimitive.Provider>
  );
}

export { Toast, ToastViewport, Toaster, toast, useToasts };
export const ToastProvider = ToastPrimitive.Provider;
