// EGG UI Step Navigation. Code only (no Figma component yet); family Wizard.
// A vertical list of the steps of a flow. Each step is done, current, upcoming or error. Done steps can be
// clickable (clickableDone) so people go back to fix an answer; current, upcoming and error steps are text.
// A11y: a nav named "Steps" with an ordered list; the state is in words under every title ("Done",
// "Current step", "Upcoming", "Needs attention"), never only an icon or a colour; the current step has
// aria-current="step"; clickable steps are real buttons with a visible focus ring. Long titles wrap.
import * as React from 'react';
import { Check, CircleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';

export type StepNavigationState = 'done' | 'current' | 'upcoming' | 'error';

export interface StepNavigationStep {
  id: string;
  title: string;
  /** One short line under the title ("2 minutes"). */
  description?: string;
  state: StepNavigationState;
}

export interface StepNavigationProps extends Omit<React.ComponentProps<'nav'>, 'children' | 'onSelect'> {
  steps: StepNavigationStep[];
  /** Makes the done steps (and steps with an error) buttons that call onStepSelect. */
  clickableDone?: boolean;
  onStepSelect?: (id: string) => void;
  /** Words for the states, translated by the app. */
  stateLabels?: Record<StepNavigationState, string>;
}

const defaultLabels: Record<StepNavigationState, string> = {
  done: 'Done',
  current: 'Current step',
  upcoming: 'Upcoming',
  error: 'Needs attention',
};

function StepNavigation({
  steps,
  clickableDone = false,
  onStepSelect,
  stateLabels = defaultLabels,
  className,
  'aria-label': ariaLabel = 'Steps',
  ...props
}: StepNavigationProps) {
  return (
    <nav data-slot="step-navigation" aria-label={ariaLabel} className={cn('w-full min-w-0', className)} {...props}>
      <ol className="m-0 flex list-none flex-col p-0">
        {steps.map((step, i) => {
          const interactive = clickableDone && (step.state === 'done' || step.state === 'error');
          const last = i === steps.length - 1;
          const body = (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums',
                  step.state === 'done' && 'border-success bg-success text-success-foreground',
                  step.state === 'current' && 'border-primary bg-primary text-primary-foreground',
                  step.state === 'upcoming' && 'border-border bg-background text-foreground',
                  step.state === 'error' && 'border-destructive bg-background text-destructive',
                )}
              >
                {step.state === 'done' ? <Check className="size-3.5" /> : step.state === 'error' ? <CircleAlert className="size-3.5" /> : i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col text-left">
                <span className={cn('min-w-0 [overflow-wrap:anywhere] text-sm font-medium leading-5', step.state === 'upcoming' ? 'text-muted-foreground' : 'text-foreground')}>
                  {step.title}
                </span>
                {step.description ? <span className="min-w-0 [overflow-wrap:anywhere] text-xs leading-4 text-muted-foreground">{step.description}</span> : null}
                <span
                  data-slot="step-navigation-state"
                  className={cn('text-xs leading-4', step.state === 'error' ? 'text-destructive' : 'text-muted-foreground', step.state === 'current' && 'font-medium text-foreground')}
                >
                  {stateLabels[step.state]}
                </span>
              </span>
            </>
          );
          return (
            <li
              key={step.id}
              data-state={step.state}
              aria-current={step.state === 'current' ? 'step' : undefined}
              className="relative flex min-w-0 flex-col"
            >
              {interactive ? (
                <button
                  type="button"
                  onClick={() => onStepSelect?.(step.id)}
                  className="flex min-w-0 cursor-pointer items-start gap-3 rounded-md px-2 py-2 outline-none transition-colors duration-[var(--duration-fast)] hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                >
                  {body}
                </button>
              ) : (
                <div className="flex min-w-0 items-start gap-3 px-2 py-2">{body}</div>
              )}
              {last ? null : <span aria-hidden="true" className={cn('absolute left-[19px] top-[2.375rem] -bottom-1 w-px', step.state === 'done' ? 'bg-success' : 'bg-border')} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { StepNavigation };
