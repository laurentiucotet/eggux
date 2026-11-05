// EGG UI AI Loading. Figma: AI Loading (AI Chat / AI Loading / Component).
// Placeholder while AI writes in place: status row (sparkles, what it does now, Stop), three
// shimmer lines at 100, 92 and 60% of the width, then step and time left. Region is aria-busy;
// the status is a polite live region updated per step; Escape stops. The shimmer pulses and stops
// with prefers-reduced-motion.
import * as React from 'react';
import { Sparkles } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface AiLoadingProps extends Omit<React.ComponentProps<'section'>, 'children'> {
  /** Figma Status: what it does now; replace it as steps change. */
  status?: React.ReactNode;
  /** Figma Progress: step and time left (only when known). */
  progress?: React.ReactNode;
  /** Figma Show progress. */
  showProgress?: boolean;
  /** Figma Show stop. */
  showStop?: boolean;
  /** Stop keeps what arrived; also called on Escape. */
  onStop?: () => void;
  /** Accessible name of the region. */
  label?: string;
}

const lineWidths = ['w-full', 'w-[92%]', 'w-[60%]'];

function AiLoading({
  status = 'Reading 12 invoices…',
  progress = 'Step 2 of 3 · about 10 seconds left',
  showProgress = true,
  showStop = true,
  onStop,
  label = 'AI is writing',
  className,
  onKeyDown,
  ...props
}: AiLoadingProps) {
  return (
    <section
      data-slot="ai-loading"
      aria-label={label}
      aria-busy="true"
      className={cn('flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground', className)}
      onKeyDown={e => {
        onKeyDown?.(e);
        if (e.key === 'Escape' && showStop && !e.defaultPrevented) onStop?.();
      }}
      {...props}
    >
      <div className="flex w-full min-w-0 items-center gap-2">
        <Sparkles aria-hidden="true" className="size-4 shrink-0" />
        <p role="status" data-slot="ai-loading-status" className="min-w-0 flex-1 truncate text-sm font-medium">{status}</p>
        {showStop ? (
          <Button variant="ghost" size="sm" onClick={onStop}>
            Stop
          </Button>
        ) : null}
      </div>
      <div data-slot="ai-loading-lines" aria-hidden="true" className="flex w-full flex-col gap-2">
        {lineWidths.map((w, i) => (
          <span
            key={w}
            className={cn('h-2.5 rounded-full bg-muted motion-safe:animate-pulse motion-reduce:animate-none', w)}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      {showProgress && progress ? <p data-slot="ai-loading-progress" className="truncate text-xs text-muted-foreground">{progress}</p> : null}
    </section>
  );
}

export { AiLoading };
