// EGG UI Draft Saved Indicator. Code only (no Figma component yet); family Wizard.
// One line that says what happens to a draft: "Saving...", "Saved at 14:32", "Could not save" with a
// Retry button, or nothing yet (idle). The time comes from `savedAt` (or `now` when it is not given), never
// from the clock, so tests and screenshots are stable; `timeZone` defaults to the viewer's own zone.
// A11y: the text sits in a polite live region (role="status") that stays in the page, so a change is
// read without moving focus; the error text is also in words ("Could not save"), the icon is decorative;
// Retry is a real button outside the live region. Wraps on narrow widths, never truncates the state.
import * as React from 'react';
import { CircleAlert, CircleCheck, LoaderCircle } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type DraftSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface DraftSavedIndicatorProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  status: DraftSaveStatus;
  /** When the draft was saved. Falls back to `now`. */
  savedAt?: Date | string | number;
  /** The current time, fixed by the caller (tests, screenshots). */
  now?: Date | string | number;
  /** IANA zone for the time ("UTC", "Europe/Bucharest"). Default: the viewer's zone. */
  timeZone?: string;
  onRetry?: () => void;
  /** Texts, translated by the app. */
  savingText?: string;
  errorText?: string;
  retryLabel?: string;
  idleText?: string;
}

function formatTime(value: Date | string | number, timeZone?: string) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(new Date(value));
}

function DraftSavedIndicator({
  status,
  savedAt,
  now,
  timeZone,
  onRetry,
  savingText = 'Saving...',
  errorText = 'Could not save',
  retryLabel = 'Retry',
  idleText = '',
  className,
  ...props
}: DraftSavedIndicatorProps) {
  const time = savedAt ?? now;
  const text =
    status === 'saving' ? savingText
    : status === 'error' ? errorText
    : status === 'saved' ? (time === undefined ? 'Saved' : `Saved at ${formatTime(time, timeZone)}`)
    : idleText;
  return (
    <div data-slot="draft-saved-indicator" data-status={status} className={cn('flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5', className)} {...props}>
      <p role="status" aria-live="polite" className={cn('m-0 flex min-w-0 items-center gap-1.5', status === 'error' ? 'text-destructive' : 'text-muted-foreground')}>
        {status === 'saving' ? <LoaderCircle aria-hidden="true" className="size-4 shrink-0 animate-spin motion-reduce:animate-none" /> : null}
        {status === 'saved' ? <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-success" /> : null}
        {status === 'error' ? <CircleAlert aria-hidden="true" className="size-4 shrink-0" /> : null}
        <span className="min-w-0 [overflow-wrap:anywhere]">{text}</span>
      </p>
      {status === 'error' && onRetry ? (
        <Button type="button" variant="link" size="sm" onClick={onRetry} className="h-auto">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { DraftSavedIndicator };
