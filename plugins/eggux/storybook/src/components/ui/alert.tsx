// EGG UI Alert. Figma: Alert (Alert page, "Alert / Component"). Variant (default, destructive,
// success, warning, info) x Layout (inline, banner) x Style (default, soft, accent), Title,
// Description (Show description), Actions slot (Show actions), Dismiss (Show close). shadcn Alert
// plus the EGG changes from references/code-mapping.md. Built from Button (actions, dismiss).
// The prop for Figma "Style" is `alertStyle`, because `style` is the React inline-style prop.
import * as React from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';
export type AlertLayout = 'inline' | 'banner';
export type AlertStyle = 'default' | 'soft' | 'accent';

const icons = {
  default: Info,
  destructive: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
  info: Info,
} as const;

// Every class name is written in full so Tailwind can generate it.
// root = surface + text color (the dismiss button inherits it), title = title color,
// description = description color, bar = accent bar color (Style=accent).
const colors: Record<AlertStyle, Record<AlertVariant, { root: string; title: string; description: string; bar: string }>> = {
  default: {
    default: { root: 'border-border bg-card text-card-foreground', title: 'text-card-foreground', description: 'text-muted-foreground', bar: '' },
    destructive: { root: 'border-destructive bg-card text-destructive', title: 'text-destructive', description: 'text-destructive', bar: '' },
    success: { root: 'border-border bg-card text-success', title: 'text-success', description: 'text-muted-foreground', bar: '' },
    // Warning is the filled alert: amber fails contrast as text on white.
    warning: { root: 'border-0 bg-warning text-warning-foreground', title: 'text-warning-foreground', description: 'text-warning-foreground', bar: '' },
    info: { root: 'border-border bg-card text-info', title: 'text-info', description: 'text-muted-foreground', bar: '' },
  },
  soft: {
    default: { root: 'border-0 bg-[var(--badge-soft-neutral-bg)] text-[var(--badge-soft-neutral-fg)]', title: 'text-[var(--badge-soft-neutral-fg)]', description: 'text-foreground', bar: '' },
    destructive: { root: 'border-0 bg-[var(--badge-soft-destructive-bg)] text-[var(--badge-soft-destructive-fg)]', title: 'text-[var(--badge-soft-destructive-fg)]', description: 'text-foreground', bar: '' },
    success: { root: 'border-0 bg-[var(--badge-soft-success-bg)] text-[var(--badge-soft-success-fg)]', title: 'text-[var(--badge-soft-success-fg)]', description: 'text-foreground', bar: '' },
    warning: { root: 'border-0 bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]', title: 'text-[var(--badge-soft-warning-fg)]', description: 'text-foreground', bar: '' },
    info: { root: 'border-0 bg-[var(--badge-soft-info-bg)] text-[var(--badge-soft-info-fg)]', title: 'text-[var(--badge-soft-info-fg)]', description: 'text-foreground', bar: '' },
  },
  accent: {
    default: { root: 'border-border bg-card text-card-foreground', title: 'text-card-foreground', description: 'text-muted-foreground', bar: 'bg-muted-foreground' },
    destructive: { root: 'border-border bg-card text-destructive', title: 'text-destructive', description: 'text-muted-foreground', bar: 'bg-destructive' },
    success: { root: 'border-border bg-card text-success', title: 'text-success', description: 'text-muted-foreground', bar: 'bg-success' },
    // The amber bar is decorative; icon and title use the soft-warning text token (amber fails as text).
    warning: { root: 'border-border bg-card text-[var(--badge-soft-warning-fg)]', title: 'text-[var(--badge-soft-warning-fg)]', description: 'text-muted-foreground', bar: 'bg-warning' },
    info: { root: 'border-border bg-card text-info', title: 'text-info', description: 'text-muted-foreground', bar: 'bg-info' },
  },
};

export interface AlertProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Variant: the meaning. Always with an icon. */
  variant?: AlertVariant;
  /** Figma Style: default (bordered card), soft (tint fill), accent (4 px status bar). One Style per product. */
  alertStyle?: AlertStyle;
  /** Figma Layout: inline (card above the content it concerns) or banner (full width, top of a page or panel). */
  layout?: AlertLayout;
  /** Figma Title: the situation in a few words. */
  title: React.ReactNode;
  /** Figma Description (Show description): what to do about it. `children` works too. */
  description?: React.ReactNode;
  /** Figma Actions slot (Show actions): up to three small Buttons, the one that resolves the situation first. */
  actions?: React.ReactNode;
  /** Figma Show close: renders the Dismiss button; the parent removes the alert. */
  onDismiss?: () => void;
  /** Accessible name of the Dismiss button, translated by the app. */
  dismissLabel?: string;
}

function Alert({
  variant = 'default',
  alertStyle = 'default',
  layout = 'inline',
  title,
  description,
  actions,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  children,
  role,
  ...props
}: AlertProps) {
  const Icon = icons[variant];
  const c = colors[alertStyle][variant];
  const banner = layout === 'banner';
  const body = description ?? children;
  // Warning in Style=default is filled and has no border; the others have 1 px.
  const filled = alertStyle === 'default' && variant === 'warning';
  const bordered = !filled && alertStyle !== 'soft';
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      data-style={alertStyle}
      data-layout={layout}
      // Only a destructive alert interrupts; the others are polite status messages.
      role={role ?? (variant === 'destructive' ? 'alert' : 'status')}
      className={cn(
        'relative flex w-full min-w-0 items-start gap-3 py-3 text-sm',
        banner ? 'rounded-none px-6' : 'rounded-lg px-4',
        bordered && (banner ? 'border-b' : 'border'),
        c.root,
        alertStyle === 'accent' && 'overflow-clip',
        className,
      )}
      {...props}
    >
      <span data-slot="alert-icon" className="flex h-5 w-4 shrink-0 items-center">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div data-slot="alert-content" className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p data-slot="alert-title" className={cn('break-words font-medium', c.title)}>{title}</p>
        {body ? <div data-slot="alert-description" className={cn('break-words', c.description)}>{body}</div> : null}
        {actions ? (
          <div data-slot="alert-actions" className="flex flex-wrap items-center gap-2 pt-2 text-foreground">{actions}</div>
        ) : null}
      </div>
      {onDismiss ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="size-6 shrink-0 rounded-sm! [&_svg:not([class*='size-'])]:size-4"
        >
          <X aria-hidden="true" />
        </Button>
      ) : null}
      {alertStyle === 'accent' ? (
        <span
          aria-hidden="true"
          data-slot="alert-bar"
          className={cn('absolute left-0 top-0 w-1', banner ? '-bottom-px' : '-bottom-px -left-px -top-px', c.bar)}
        />
      ) : null}
    </div>
  );
}

export { Alert };
