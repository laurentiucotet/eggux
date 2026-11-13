// EGG UI Connection Status. Code only (no Figma component yet); Data Display family.
// Status (online, offline, reconnecting) x Variant (indicator, banner). Indicator = a small pill with
// an icon and a word, for a header or a footer. Banner = a full-width soft strip for the top of a page,
// with the detail and, when offline, a Retry button. The status is always icon + words, never color
// alone. The root is a persistent polite live region (role="status"), so a change from online to
// offline is announced without moving focus. Reconnecting spins only when motion is allowed.
import * as React from 'react';
import { CircleAlert, CircleCheck, LoaderCircle } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type ConnectionState = 'online' | 'offline' | 'reconnecting';
export type ConnectionVariant = 'indicator' | 'banner';

const states = {
  online: {
    title: 'Online',
    detail: 'All changes are saved.',
    icon: CircleCheck,
    soft: 'bg-[var(--badge-soft-success-bg)] text-[var(--badge-soft-success-fg)]',
    dot: 'bg-success',
  },
  offline: {
    title: 'Offline',
    detail: 'You are offline. Changes are kept on this device until the connection returns.',
    icon: CircleAlert,
    soft: 'bg-[var(--badge-soft-destructive-bg)] text-[var(--badge-soft-destructive-fg)]',
    dot: 'bg-destructive',
  },
  reconnecting: {
    title: 'Reconnecting',
    detail: 'Trying to reach Acme. Changes are kept on this device.',
    icon: LoaderCircle,
    soft: 'bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]',
    dot: 'bg-warning',
  },
} as const;

export interface ConnectionStatusProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  status?: ConnectionState;
  variant?: ConnectionVariant;
  /** Replaces the default word for the status (indicator) or the title (banner). */
  title?: string;
  /** Banner only: the sentence under the title. Defaults to a plain sentence per status. */
  detail?: string;
  /** Banner only: shows Retry when offline. */
  onRetry?: () => void;
  /** Banner only: Retry shows its busy state (the retry is running). */
  retrying?: boolean;
}

function ConnectionStatus({ status = 'online', variant = 'indicator', title, detail, onRetry, retrying = false, className, ...props }: ConnectionStatusProps) {
  const s = states[status];
  const Icon = s.icon;
  const word = title ?? s.title;
  const icon = <Icon aria-hidden="true" className={cn('size-4 shrink-0', status === 'reconnecting' && 'motion-safe:animate-spin')} />;
  if (variant === 'indicator') {
    return (
      <div
        data-slot="connection-status"
        data-status={status}
        data-variant="indicator"
        role="status"
        className={cn('inline-flex h-6 min-w-0 max-w-full items-center gap-1.5 rounded-full px-2.5 text-xs leading-4 font-medium', s.soft, className)}
        {...props}
      >
        {icon}
        <span className="min-w-0 truncate">{word}</span>
      </div>
    );
  }
  return (
    <div
      data-slot="connection-status"
      data-status={status}
      data-variant="banner"
      role="status"
      className={cn('flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 text-sm leading-5', s.soft, className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 basis-48 items-start gap-2">
        <span className="mt-0.5 flex">{icon}</span>
        <p className="m-0 min-w-0 flex-1">
          <span className="font-medium">{word}.</span> <span>{detail ?? s.detail}</span>
        </p>
      </div>
      {status === 'offline' && onRetry ? (
        <Button type="button" size="sm" variant="outline" loading={retrying} aria-busy={retrying || undefined} onClick={retrying ? undefined : onRetry} className="shrink-0 text-foreground">
          {retrying ? 'Retrying' : 'Retry'}
        </Button>
      ) : null}
    </div>
  );
}

export { ConnectionStatus };
