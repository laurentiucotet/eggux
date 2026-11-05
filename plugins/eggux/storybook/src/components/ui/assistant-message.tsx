// EGG UI Assistant Message. Figma: Assistant Message (AI Chat / Assistant Message / Component).
// State (default, streaming, error, stopped), Show actions, Show branch and Branch match the
// Figma properties; the Content slot is children. No bubble: avatar with sparkles, then the answer.
import * as React from 'react';
import { ChevronLeft, ChevronRight, CircleAlert, Copy, RefreshCw, Sparkles, Square, ThumbsDown, ThumbsUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type AssistantMessageState = 'default' | 'streaming' | 'error' | 'stopped';

export interface AssistantMessageProps extends React.ComponentProps<'div'> {
  /** Figma State. streaming: caret, no actions. error: partial answer, alert and Retry. stopped: muted line, copy and regenerate. */
  state?: AssistantMessageState;
  /** Figma Show actions: copy, regenerate, good, bad under a finished answer. */
  showActions?: boolean;
  /** Figma Show branch with the Branch text ("2 of 3"). */
  branch?: { current: number; total: number; onPrevious?: () => void; onNext?: () => void };
  /** Which feedback button is pressed. */
  feedback?: 'good' | 'bad';
  onCopy?: () => void;
  onRegenerate?: () => void;
  onFeedback?: (value: 'good' | 'bad') => void;
  onRetry?: () => void;
  /** State=error: what happened and that the message is kept. */
  errorTitle?: string;
  errorDescription?: string;
}

function AssistantMessage({
  state = 'default',
  showActions = true,
  branch,
  feedback,
  onCopy,
  onRegenerate,
  onFeedback,
  onRetry,
  errorTitle = 'The response stopped',
  errorDescription = 'The connection was lost. Your message is saved.',
  className,
  children,
  ...props
}: AssistantMessageProps) {
  const streaming = state === 'streaming';
  const finished = state === 'default' || state === 'stopped';

  return (
    <div data-slot="assistant-message" data-state={state} className={cn('flex w-full items-start gap-4', className)} {...props}>
      <div aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground">
        <Sparkles />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
        <span className="sr-only">Assistant:</span>
        {/* Screen readers hear the answer once it settles, not every token. */}
        <div
          data-slot="assistant-message-content"
          aria-live="polite"
          aria-busy={streaming || undefined}
          className={cn(
            'flex w-full flex-col gap-4 text-base leading-7 text-foreground [overflow-wrap:anywhere]',
            // Streaming caret at the end of the last paragraph; still (no blink) with reduced motion.
            streaming && "[&>:last-child]:after:ml-0.5 [&>:last-child]:after:inline-block [&>:last-child]:after:h-5 [&>:last-child]:after:w-0.5 [&>:last-child]:after:animate-pulse [&>:last-child]:after:bg-foreground [&>:last-child]:after:align-[-3px] [&>:last-child]:after:content-[''] motion-reduce:[&>:last-child]:after:animate-none",
          )}
        >
          {typeof children === 'string' ? <p>{children}</p> : children}
        </div>

        {state === 'error' ? (
          <div className="flex w-full flex-col items-start gap-2">
            <div role="alert" className="flex w-full items-start gap-3 rounded-lg border border-destructive bg-card px-4 py-3 text-sm leading-5 text-destructive">
              <span className="flex h-5 shrink-0 items-center"><CircleAlert className="size-4" aria-hidden="true" /></span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="font-medium">{errorTitle}</p>
                <p>{errorDescription}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry}>Retry</Button>
          </div>
        ) : null}

        {state === 'stopped' ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Square className="size-3.5" aria-hidden="true" />
            You stopped this answer
          </p>
        ) : null}

        {showActions && finished ? (
          <div data-slot="assistant-message-actions" className="flex items-center gap-0.5">
            {branch ? (
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon-sm" aria-label="Previous answer" title="Previous answer" disabled={branch.current <= 1} onClick={branch.onPrevious}>
                  <ChevronLeft aria-hidden="true" />
                </Button>
                <span className="text-xs text-muted-foreground" aria-label={`Answer ${branch.current} of ${branch.total}`}>
                  {branch.current} of {branch.total}
                </span>
                <Button variant="ghost" size="icon-sm" aria-label="Next answer" title="Next answer" disabled={branch.current >= branch.total} onClick={branch.onNext}>
                  <ChevronRight aria-hidden="true" />
                </Button>
              </div>
            ) : null}
            <Button variant="ghost" size="icon" aria-label="Copy" title="Copy" onClick={onCopy}>
              <Copy aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Regenerate" title="Regenerate" onClick={onRegenerate}>
              <RefreshCw aria-hidden="true" />
            </Button>
            {state === 'default' ? (
              <>
                <Button variant="ghost" size="icon" aria-label="Good response" title="Good response" aria-pressed={feedback === 'good'} onClick={() => onFeedback?.('good')}>
                  <ThumbsUp aria-hidden="true" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Bad response" title="Bad response" aria-pressed={feedback === 'bad'} onClick={() => onFeedback?.('bad')}>
                  <ThumbsDown aria-hidden="true" />
                </Button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { AssistantMessage };
