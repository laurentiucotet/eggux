// EGG UI AI Review Bar. Figma: AI Review Bar (AI Chat / AI Review Bar / Component).
// Count and Show bulk actions match the Figma properties. Floating toolbar to review AI edits one
// by one: position, previous and next, Reject and Accept, Reject all and Accept all. Wraps below
// about 700 px: the count fills the space left (min 128) and truncates to one line.
import * as React from 'react';
import { Check, ChevronDown, ChevronUp, Sparkles, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface AiReviewBarProps extends React.ComponentProps<'div'> {
  /** Figma Count: the position ("3 of 7 suggestions"), announced politely as it changes. */
  count?: string;
  /** Figma Show bulk actions: Reject all and Accept all. */
  showBulkActions?: boolean;
  /** Disable previous / next at the ends. */
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
}

function AiReviewBar({
  count = '3 of 7 suggestions',
  showBulkActions = true,
  hasPrevious = true,
  hasNext = true,
  onPrevious,
  onNext,
  onAccept,
  onReject,
  onAcceptAll,
  onRejectAll,
  className,
  onKeyDown,
  ...props
}: AiReviewBarProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  // WAI-ARIA toolbar: one Tab stop, arrows move between the buttons (roving tabindex).
  const items = () => Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
  const active = React.useRef<HTMLButtonElement | null>(null);
  const setActive = (target: HTMLButtonElement) => {
    active.current = target;
    items().forEach(b => (b.tabIndex = b === target ? 0 : -1));
  };
  // After every render (buttons can be disabled or hidden) keep exactly one Tab stop.
  React.useEffect(() => {
    const all = items();
    const current = active.current && all.includes(active.current) ? active.current : all[0];
    if (current) setActive(current);
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const all = items();
    const index = all.indexOf(document.activeElement as HTMLButtonElement);
    let next: HTMLButtonElement | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = all[(index + 1) % all.length];
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = all[(index - 1 + all.length) % all.length];
    else if (event.key === 'Home') next = all[0];
    else if (event.key === 'End') next = all[all.length - 1];
    else if (event.key === 'Backspace') {
      // Shortcut: Backspace rejects the current suggestion.
      event.preventDefault();
      onReject?.();
      return;
    }
    if (next) {
      event.preventDefault();
      setActive(next);
      next.focus();
    }
  };

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-label="Review suggestions"
      data-slot="ai-review-bar"
      onKeyDown={handleKeyDown}
      onFocus={e => {
        if (e.target instanceof HTMLButtonElement) setActive(e.target);
      }}
      className={cn('flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-lg', className)}
      {...props}
    >
      <Sparkles className="size-4 shrink-0" aria-hidden="true" />
      <p data-slot="ai-review-bar-count" aria-live="polite" aria-atomic="true" className="min-w-32 flex-1 truncate text-sm font-medium">
        {count}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Previous suggestion" title="Previous suggestion" disabled={!hasPrevious} onClick={onPrevious}>
          <ChevronUp aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Next suggestion" title="Next suggestion" disabled={!hasNext} onClick={onNext}>
          <ChevronDown aria-hidden="true" />
        </Button>
      </div>
      <div aria-hidden="true" className="h-5 w-px shrink-0 bg-border" />
      <Button variant="ghost" size="sm" leadingIcon={<X aria-hidden="true" />} title="Reject (Backspace)" aria-keyshortcuts="Backspace" onClick={onReject}>
        Reject
      </Button>
      <Button variant="secondary" size="sm" leadingIcon={<Check aria-hidden="true" />} title="Accept (Enter)" onClick={onAccept}>
        Accept
      </Button>
      {showBulkActions ? (
        <>
          <div aria-hidden="true" className="h-5 w-px shrink-0 bg-border" />
          <Button variant="ghost" size="sm" onClick={onRejectAll}>Reject all</Button>
          <Button variant="default" size="sm" onClick={onAcceptAll}>Accept all</Button>
        </>
      ) : null}
    </div>
  );
}

export { AiReviewBar };
