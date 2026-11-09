// EGG UI Stepper and Step. Figma: Stepper page (Stepper 753:675, Step 88:67).
// Orientation (horizontal, vertical) x Style (default, dots); Step State (completed, current,
// upcoming, error). Default: a 32 indicator (check on primary, number in a 2 px primary ring,
// number on a bordered circle, x on destructive), title (ui/label) and description (ui/caption).
// Horizontal: steps 12 apart, a 1 px connector fills to the next step (primary after a completed
// one), the last step hugs. Vertical: a rail with the indicator and a connector down to the next
// step, text 6 / 24 padded (66 rows). Dots: 8 px dots 8 apart, the current one a 24 px pill
// (horizontal, no names: show "Step 2 of 4" and the title next to it); vertical keeps the names
// next to an 8 px dot on a thin rail (52 rows), the current dot a 2 px ring.
// A11y: an ordered list named "Progress"; the current step has aria-current="step"; the state is
// in text ("Completed", "Error"); dots are named "Step 2 of 4, current". Completed steps are
// buttons when onStepClick is set; upcoming steps are not.
import * as React from 'react';
import { Check, X } from '@/components/icons';
import { cn } from '@/lib/utils';

export type StepState = 'completed' | 'current' | 'upcoming' | 'error';
export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperVariant = 'default' | 'dots';

export interface StepData {
  id: string;
  title: string;
  description?: string;
  /** An invalid step that was left: shows error instead of completed. */
  error?: boolean;
}

const stateText: Record<StepState, string> = { completed: 'Completed', current: 'Current', upcoming: 'Not started', error: 'Error' };

function Indicator({ state, number }: { state: StepState; number: number }) {
  return (
    <span
      aria-hidden="true"
      data-slot="step-indicator"
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-sm leading-5 font-medium [&_svg]:size-4',
        state === 'completed' && 'bg-primary text-primary-foreground',
        state === 'current' && 'border-2 border-primary bg-background text-foreground',
        state === 'upcoming' && 'border border-border bg-background text-muted-foreground',
        state === 'error' && 'bg-destructive text-destructive-foreground',
      )}
    >
      {state === 'completed' ? <Check /> : state === 'error' ? <X /> : number}
    </span>
  );
}

function Dot({ state, horizontal }: { state: StepState; horizontal: boolean }) {
  return (
    <span
      aria-hidden="true"
      data-slot="step-dot"
      className={cn(
        'block h-2 shrink-0 rounded-full',
        horizontal && state === 'current' ? 'w-6 bg-primary' : 'w-2',
        state === 'completed' && 'bg-primary',
        state === 'current' && !horizontal && 'border-2 border-primary bg-background',
        state === 'upcoming' && 'bg-muted-foreground',
        state === 'error' && 'bg-destructive',
      )}
    />
  );
}

export interface StepProps extends Omit<React.ComponentProps<'li'>, 'title'> {
  title: string;
  description?: string;
  state?: StepState;
  number: number;
  total: number;
  orientation?: StepperOrientation;
  variant?: StepperVariant;
  /** Figma Show connector: off on the last step. */
  connector?: boolean;
  /** Completed (and error) steps become buttons that go back to the step. */
  onSelect?: () => void;
}

function Step({ title, description, state = 'upcoming', number, total, orientation = 'horizontal', variant = 'default', connector = true, onSelect, className, ...props }: StepProps) {
  const horizontal = orientation === 'horizontal';
  const current = state === 'current' ? 'step' : undefined;

  if (variant === 'dots' && horizontal) {
    return (
      <li data-slot="step" data-state={state} aria-current={current} className={cn('flex list-none', className)} {...props}>
        <Dot state={state} horizontal />
        <span className="sr-only">{`Step ${number} of ${total}, ${title}, ${stateText[state].toLowerCase()}`}</span>
      </li>
    );
  }

  const text = (
    <span className={cn('flex min-w-0 flex-col text-left', !horizontal && (variant === 'dots' ? 'pb-4' : 'pt-1.5 pb-6'), state === 'upcoming' && 'text-muted-foreground')}>
      <span className={cn('truncate text-sm leading-5 font-medium', state === 'error' ? 'text-destructive' : state !== 'upcoming' && 'text-foreground')}>{title}</span>
      {description ? <span className={cn('truncate text-xs leading-4', state !== 'upcoming' && 'text-muted-foreground')}>{description}</span> : null}
      <span className="sr-only">, {stateText[state]}</span>
    </span>
  );
  const marker = variant === 'dots' ? <Dot state={state} horizontal={false} /> : <Indicator state={state} number={number} />;
  const lineColor = state === 'completed' ? 'bg-primary' : 'bg-border';
  const clickable = onSelect && (state === 'completed' || state === 'error');
  const Body = clickable ? 'button' : 'span';
  const bodyProps = clickable ? { type: 'button' as const, onClick: onSelect } : {};

  if (horizontal) {
    return (
      <li data-slot="step" data-state={state} aria-current={current} className={cn('flex min-w-0 list-none items-center gap-3', connector ? 'flex-1' : 'shrink-0', className)} {...props}>
        <Body {...bodyProps} className={cn('flex min-w-0 items-center gap-3 rounded-md outline-none', clickable && 'cursor-pointer focus-visible:ring-[3px] focus-visible:ring-ring/50')}>
          {marker}
          {text}
        </Body>
        {connector ? <span aria-hidden="true" data-slot="step-connector" className={cn('h-px min-w-px flex-1', lineColor)} /> : null}
      </li>
    );
  }

  return (
    <li data-slot="step" data-state={state} aria-current={current} className={cn('flex w-full min-w-0 list-none items-stretch gap-3', className)} {...props}>
      <span className={cn('flex shrink-0 flex-col items-center gap-1 pb-1', variant === 'dots' && 'px-0.5 pt-1.5')}>
        {marker}
        {connector ? <span aria-hidden="true" data-slot="step-connector" className={cn('min-h-px w-px flex-1', lineColor)} /> : null}
      </span>
      <Body {...bodyProps} className={cn('flex min-w-0 flex-1 items-start rounded-md outline-none', clickable && 'cursor-pointer focus-visible:ring-[3px] focus-visible:ring-ring/50')}>
        {text}
      </Body>
    </li>
  );
}

export interface StepperProps extends Omit<React.ComponentProps<'ol'>, 'onSelect'> {
  steps: StepData[];
  /** Index of the current step. */
  current: number;
  orientation?: StepperOrientation;
  variant?: StepperVariant;
  onStepClick?: (index: number) => void;
}

function Stepper({ steps, current, orientation = 'horizontal', variant = 'default', onStepClick, className, 'aria-label': ariaLabel = 'Progress', ...props }: StepperProps) {
  const horizontal = orientation === 'horizontal';
  return (
    <ol
      data-slot="stepper"
      data-orientation={orientation}
      data-variant={variant}
      aria-label={ariaLabel}
      className={cn(
        'm-0 flex p-0',
        horizontal ? (variant === 'dots' ? 'w-fit items-center gap-2' : 'w-full items-center gap-3') : 'w-full flex-col',
        className,
      )}
      {...props}
    >
      {steps.map((s, i) => {
        const state: StepState = i === current ? 'current' : s.error ? 'error' : i < current ? 'completed' : 'upcoming';
        return (
          <Step
            key={s.id}
            title={s.title}
            description={s.description}
            state={state}
            number={i + 1}
            total={steps.length}
            orientation={orientation}
            variant={variant}
            connector={i < steps.length - 1}
            onSelect={onStepClick ? () => onStepClick(i) : undefined}
          />
        );
      })}
    </ol>
  );
}

export { Step, Stepper };
