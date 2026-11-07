// EGG UI Progress Type=segmented and Progress Segment. Figma: Progress (Progress page, Type=segmented)
// and Progress Segment (739:946). One segment per step for a count of steps (onboarding, setup
// checklists, a multi-step form on mobile): segments share the track 4 apart, 8 high, fully round;
// complete in the Tone color, upcoming in background/muted.
// A11y: role="progressbar" with min 0, max = steps, now = done and a value text "2 of 4 steps".
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ProgressTone } from './progress';

const toneClass: Record<ProgressTone, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
};

export interface ProgressSegmentProps extends React.ComponentProps<'span'> {
  state?: 'complete' | 'upcoming';
  tone?: ProgressTone;
}

function ProgressSegment({ state = 'complete', tone = 'default', className, ...props }: ProgressSegmentProps) {
  return (
    <span
      data-slot="progress-segment"
      data-state={state}
      aria-hidden="true"
      className={cn('h-full min-w-px flex-1 rounded-full', state === 'complete' ? toneClass[tone] : 'bg-muted', className)}
      {...props}
    />
  );
}

export interface ProgressSegmentedProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** How many steps in all. */
  steps: number;
  /** How many are done. */
  value: number;
  tone?: ProgressTone;
  /** Read by screen readers; default "2 of 4 steps". */
  valueText?: string;
}

function ProgressSegmented({ steps, value, tone = 'default', valueText, className, ...props }: ProgressSegmentedProps) {
  const done = Math.max(0, Math.min(steps, value));
  return (
    <div
      data-slot="progress-segmented"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={steps}
      aria-valuenow={done}
      aria-valuetext={valueText ?? `${done} of ${steps} steps`}
      className={cn('flex h-2 w-full min-w-0 gap-1', className)}
      {...props}
    >
      {Array.from({ length: steps }, (_, i) => (
        <ProgressSegment key={i} state={i < done ? 'complete' : 'upcoming'} tone={tone} />
      ))}
    </div>
  );
}

export { ProgressSegment, ProgressSegmented };
