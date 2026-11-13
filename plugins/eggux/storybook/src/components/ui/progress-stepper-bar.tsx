// EGG UI Progress Stepper Bar. Code only (no Figma component yet); family Onboarding.
// A thin segmented bar for a multi-step flow (sign-up, checkout, setup): one 4 px segment per step,
// filled up to and including the current step, with "Step 2 of 5" and the step name above and an
// optional Back link on the left. Not for navigation between sections: the segments are not buttons.
// A11y: the bar is an ordered list named "Progress"; each segment has a hidden text ("Step 1: Account,
// done"), the current one has aria-current="step"; the step line is a polite status, so a screen reader
// hears the move; Back is a real button (or an <a> when backHref is given) with a visible label and
// the first step has no Back; the name truncates under 276 px, the count never does.
import * as React from 'react';
import { ArrowLeft } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ProgressStepperBarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The step names, in order. */
  steps: string[];
  /** The current step, 1-based. */
  current: number;
  /** Called by the Back button. The first step shows no Back. */
  onBack?: () => void;
  /** Turns Back into a link. */
  backHref?: string;
  backLabel?: string;
  /** Show the Back link when there is a step before this one. Default true. */
  showBack?: boolean;
  /** Show the step name next to the count. Default true. */
  showName?: boolean;
}

function ProgressStepperBar({ steps, current, onBack, backHref, backLabel = 'Back', showBack = true, showName = true, className, ...props }: ProgressStepperBarProps) {
  const total = steps.length;
  const at = Math.min(Math.max(current, 1), Math.max(total, 1));
  const name = steps[at - 1];
  const canBack = showBack && at > 1;
  return (
    <div data-slot="progress-stepper-bar" className={cn('flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      <div className="flex min-w-0 items-center gap-3">
        {canBack ? (
          backHref ? (
            <Button asChild variant="link" size="sm" className="shrink-0 gap-1">
              <a href={backHref}>
                <ArrowLeft aria-hidden="true" />
                {backLabel}
              </a>
            </Button>
          ) : (
            <Button type="button" variant="link" size="sm" className="shrink-0 gap-1" onClick={onBack}>
              <ArrowLeft aria-hidden="true" />
              {backLabel}
            </Button>
          )
        ) : null}
        <p role="status" aria-live="polite" className="flex min-w-0 flex-1 items-baseline gap-2 text-sm leading-5">
          <span className="shrink-0 font-medium text-foreground">Step {at} of {total}</span>
          {showName && name ? (
            <>
              <span aria-hidden="true" className="shrink-0 text-muted-foreground">·</span>
              <span className="min-w-0 truncate text-muted-foreground">{name}</span>
            </>
          ) : null}
        </p>
      </div>
      <ol aria-label="Progress" className="m-0 flex list-none gap-1 p-0">
        {steps.map((step, i) => {
          const n = i + 1;
          const state = n < at ? 'done' : n === at ? 'current' : 'upcoming';
          return (
            <li
              key={`${i}-${step}`}
              data-state={state}
              aria-current={state === 'current' ? 'step' : undefined}
              className={cn('h-1 min-w-0 flex-1 rounded-full transition-colors duration-[var(--duration-fast)] motion-reduce:transition-none', state === 'upcoming' ? 'bg-border' : 'bg-primary')}
            >
              <span className="sr-only">Step {n}: {step}, {state === 'upcoming' ? 'not started' : state}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export { ProgressStepperBar };
