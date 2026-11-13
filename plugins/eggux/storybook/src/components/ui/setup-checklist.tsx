// EGG UI Setup Checklist. Code only (no Figma component yet); family Onboarding.
// A card with a progress bar and the steps of getting started. A step is done, current or locked:
// the first step that is not done is current, the ones after it are locked until it is done. Each step
// has a title, a hint and an action (current = primary, done = "Review" style outline, locked =
// disabled). The header says "2 of 5 done" and a button collapses the list to the header and the bar.
// A11y: the card is a region named by its title; the steps are an ordered list and the state is in text
// ("Done", "Current step", "Locked"), never only an icon or a colour; the collapse button has
// aria-expanded and aria-controls; the progress bar is a progressbar with the count as its text;
// locked actions are disabled, the reason is in the hint. Truncates nothing: long text wraps.
import * as React from 'react';
import { Check, ChevronDown, Lock } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card, CardContent, CardHeader } from './card';
import { Progress } from './progress';

export interface SetupChecklistStep {
  id: string;
  title: string;
  hint?: string;
  /** Label of the action button ("Connect bank", "Review"). */
  actionLabel: string;
  done?: boolean;
}

type StepState = 'done' | 'current' | 'locked';

export interface SetupChecklistProps extends Omit<React.ComponentProps<'section'>, 'title' | 'children'> {
  title?: string;
  description?: string;
  steps: SetupChecklistStep[];
  /** Called with the step id when its action is pressed. */
  onStepAction?: (id: string) => void;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  headingLevel?: 2 | 3 | 4;
}

function SetupChecklist({
  title = 'Set up your workspace',
  description = 'Finish these steps to start sending invoices.',
  steps,
  onStepAction,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  headingLevel = 3,
  className,
  ...props
}: SetupChecklistProps) {
  const [inner, setInner] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? inner;
  const baseId = React.useId();
  const listId = `${baseId}-steps`;
  const titleId = `${baseId}-title`;
  const doneCount = steps.filter(s => s.done).length;
  const total = steps.length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const allDone = total > 0 && doneCount === total;
  const currentIndex = steps.findIndex(s => !s.done);
  const stateOf = (i: number): StepState => (steps[i].done ? 'done' : i === currentIndex ? 'current' : 'locked');
  const Heading = `h${headingLevel}` as 'h3';
  const toggle = () => {
    const next = !collapsed;
    if (collapsedProp === undefined) setInner(next);
    onCollapsedChange?.(next);
  };
  return (
    <section
      data-slot="setup-checklist"
      data-collapsed={collapsed || undefined}
      aria-labelledby={titleId}
      className={cn('w-full min-w-0 max-w-[480px]', className)}
      {...props}
    >
      <Card size="sm">
        <CardHeader className="items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Heading id={titleId} className="min-w-0 text-base font-semibold leading-6 [overflow-wrap:anywhere]">{title}</Heading>
            {description ? <p className="text-sm leading-5 text-muted-foreground">{description}</p> : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-expanded={!collapsed}
            aria-controls={listId}
            aria-label={collapsed ? `Expand ${title}` : `Collapse ${title}`}
            onClick={toggle}
          >
            <ChevronDown aria-hidden="true" className={cn('transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', !collapsed && 'rotate-180')} />
          </Button>
        </CardHeader>
        <CardContent className="gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Progress
              value={percent}
              size="sm"
              tone={allDone ? 'success' : 'default'}
              aria-label="Setup progress"
              aria-valuetext={`${doneCount} of ${total} done`}
              className="min-w-0 flex-1"
            />
            <span data-slot="setup-checklist-count" className="shrink-0 text-sm font-medium leading-5 tabular-nums text-foreground">
              {allDone ? 'All done' : `${doneCount} of ${total} done`}
            </span>
          </div>
          <ol id={listId} hidden={collapsed} className="m-0 flex list-none flex-col gap-1 p-0">
            {steps.map((step, i) => {
              const state = stateOf(i);
              return (
                <li
                  key={step.id}
                  data-state={state}
                  aria-current={state === 'current' ? 'step' : undefined}
                  className={cn('flex min-w-0 flex-wrap items-start gap-3 rounded-lg px-2 py-2', state === 'current' && 'bg-card ring-1 ring-primary/40')}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs',
                      state === 'done' && 'border-success bg-success text-success-foreground',
                      state === 'current' && 'border-primary bg-background text-primary',
                      state === 'locked' && 'border-border bg-muted text-muted-foreground',
                    )}
                  >
                    {state === 'done' ? <Check className="size-3" /> : state === 'locked' ? <Lock className="size-3" /> : <span className="size-2 rounded-full bg-primary" />}
                  </span>
                  <div className="flex min-w-0 flex-[1_1_9rem] flex-col gap-0.5">
                    <span className={cn('min-w-0 [overflow-wrap:anywhere] text-sm font-medium leading-5', state === 'done' ? 'text-muted-foreground line-through' : 'text-foreground')}>
                      {step.title}
                      <span className="sr-only">{state === 'done' ? ', done' : state === 'current' ? ', current step' : ', locked'}</span>
                    </span>
                    {step.hint ? <span className="min-w-0 [overflow-wrap:anywhere] text-sm leading-5 text-muted-foreground">{step.hint}</span> : null}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={state === 'current' ? 'default' : 'outline'}
                    disabled={state === 'locked'}
                    onClick={() => onStepAction?.(step.id)}
                    className="max-w-full"
                  >
                    <span className="min-w-0 truncate">{step.actionLabel}</span>
                    <span className="sr-only"> for {step.title}</span>
                  </Button>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}

export { SetupChecklist };
