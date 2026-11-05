// EGG UI Agent Plan and Plan Step. Figma: Agent Plan, Plan Step (AI Chat / Agent Plan / Component).
// A multi-step task the assistant runs: sparkles and title, status line (step N of M, time left),
// Stop, progress bar, Plan Steps in the Steps slot, footer with what needs approval.
// Plan Step Status: pending (outline circle, muted), running (spinner), done (check), error (alert
// and the Error text). Status is in the icon and in screen reader text, never color alone.
import * as React from 'react';
import { CircleAlert, CircleCheck, Info, LoaderCircle, Sparkles, Square } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type PlanStepStatus = 'pending' | 'running' | 'done' | 'error';

export interface PlanStepProps extends Omit<React.ComponentProps<'li'>, 'title'> {
  /** Figma Status. */
  status?: PlanStepStatus;
  /** What the step does, in the user's words. */
  title?: React.ReactNode;
  /** Figma Description: what the step found. Replaced by Error when Status=error. */
  description?: React.ReactNode;
  /** Figma Error: what failed and what happens next (Status=error). */
  error?: React.ReactNode;
  /** Figma Show description. */
  showDescription?: boolean;
  /** Figma Time. */
  time?: React.ReactNode;
  /** Figma Show time. */
  showTime?: boolean;
}

const statusText: Record<PlanStepStatus, string> = { pending: 'Pending', running: 'In progress', done: 'Done', error: 'Failed' };

function PlanStep({
  status = 'pending',
  title = 'Find overdue invoices in Q3',
  description = 'Found 24 invoices from 9 customers',
  error = 'The invoices service did not respond. Retrying in 10 s.',
  showDescription = true,
  time = '4 s',
  showTime = true,
  className,
  ...props
}: PlanStepProps) {
  const pending = status === 'pending';
  return (
    <li data-slot="plan-step" data-status={status} className={cn('flex w-full min-w-0 items-start gap-3', className)} {...props}>
      <span data-slot="plan-step-indicator" aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center">
        {/* Pending: an outline circle drawn in CSS (the Figma indicator is not an icon of the set). */}
        {status === 'pending' ? <span className="size-3.5 rounded-full border border-input" /> : null}
        {status === 'running' ? <LoaderCircle className="size-4 text-foreground motion-safe:animate-spin motion-reduce:animate-pulse" /> : null}
        {status === 'done' ? <CircleCheck className="size-4 text-success" /> : null}
        {status === 'error' ? <CircleAlert className="size-4 text-destructive" /> : null}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 [overflow-wrap:anywhere]">
        <p className={cn('text-sm', pending ? 'text-muted-foreground' : 'text-foreground')}>
          <span className="sr-only">{statusText[status]}: </span>
          {title}
        </p>
        {status === 'error' ? (
          showDescription ? <p data-slot="plan-step-error" className="text-xs text-destructive">{error}</p> : null
        ) : showDescription && description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {showTime && time ? <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">{time}</span> : null}
    </li>
  );
}

export interface AgentPlanProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Figma Title (wraps). */
  title?: React.ReactNode;
  /** Figma Status: step N of M and time left (1 line, ellipsis). Announced politely when it changes. */
  status?: React.ReactNode;
  /** Share of the work done, 0–100 (Figma Progress Value=50). */
  progress?: number;
  /** Figma Footer: what it will not do without approval. */
  footer?: React.ReactNode;
  /** Figma Show stop. */
  showStop?: boolean;
  /** Figma Show footer. */
  showFooter?: boolean;
  onStop?: () => void;
  /** Figma Steps slot: PlanStep items. */
  children?: React.ReactNode;
}

function AgentPlan({
  title = 'Preparing the Q3 overdue report',
  status = 'Step 3 of 5 · about 1 min left',
  progress = 50,
  footer = 'Runs in the background. Nothing is sent without your approval.',
  showStop = true,
  showFooter = true,
  onStop,
  className,
  children,
  ...props
}: AgentPlanProps) {
  const titleId = React.useId();
  const value = Math.min(100, Math.max(0, Math.round(progress)));
  return (
    <section
      data-slot="agent-plan"
      aria-labelledby={titleId}
      className={cn('flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex w-full min-w-0 items-center gap-2">
        <Sparkles aria-hidden="true" className="size-4 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 id={titleId} className="text-sm font-medium [overflow-wrap:anywhere]">{title}</h3>
          <p data-slot="agent-plan-status" aria-live="polite" className="truncate text-xs text-muted-foreground">{status}</p>
        </div>
        {showStop ? (
          <Button variant="outline" size="sm" leadingIcon={<Square aria-hidden="true" />} onClick={onStop}>
            Stop
          </Button>
        ) : null}
      </div>

      <div
        data-slot="agent-plan-progress"
        role="progressbar"
        aria-labelledby={titleId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full rounded-full bg-primary transition-[width] duration-[var(--duration-normal)] motion-reduce:transition-none" style={{ width: `${value}%` }} />
      </div>

      {children ? <ol data-slot="agent-plan-steps" className="flex w-full min-w-0 flex-col gap-3">{children}</ol> : null}

      {showFooter && footer ? (
        <div className="flex w-full items-center gap-1.5 text-xs text-muted-foreground">
          <Info aria-hidden="true" className="size-3.5 shrink-0" />
          <p className="min-w-0 flex-1">{footer}</p>
        </div>
      ) : null}
    </section>
  );
}

export { AgentPlan, PlanStep };
