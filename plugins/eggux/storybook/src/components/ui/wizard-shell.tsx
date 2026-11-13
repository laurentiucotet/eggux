// EGG UI Wizard Shell. Code only (no Figma component yet); family Wizard.
// The frame of a multi-step flow: a header with the flow title and a Close button, a step navigation (Step
// Navigation), the content of the current step (passed in), and a footer with Back, Save draft and
// Next (Finish on the last step). Next is disabled until the step is valid (`valid`), with the reason
// written next to it. The step content, its fields and its validation belong to the app.
// A11y: a region named by the title; on a step change focus moves to the step heading (an h3 with
// tabindex -1), and a polite status says "Step 2 of 4: Company details"; the footer buttons are real
// buttons with a visible focus ring; the disabled Next is described by the hint. Back at the first step is
// disabled. The layout is container based: the navigation sits above the content below 40rem and beside
// it above. Long titles wrap, nothing overflows at 276 px.
import * as React from 'react';
import { ArrowLeft, ArrowRight, Check, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { StepNavigation, type StepNavigationStep } from './step-navigation';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
}

export interface WizardShellProps extends Omit<React.ComponentProps<'section'>, 'title' | 'children'> {
  title: string;
  steps: WizardStep[];
  /** Index of the current step, from 0. Controlled; leave out to let the shell keep it. */
  step?: number;
  defaultStep?: number;
  onStepChange?: (index: number) => void;
  /** Ids of steps with an error (shown in the navigation). */
  errorStepIds?: string[];
  /** The current step passes its checks: Next is enabled. */
  valid?: boolean;
  /** Why Next is disabled, shown next to it. */
  invalidHint?: string;
  /** Next was pressed on a valid step (before the step changes). */
  onNext?: (index: number) => void;
  onBack?: (index: number) => void;
  onFinish?: () => void;
  onClose?: () => void;
  /** Shows the Save draft button and calls this. */
  onSaveDraft?: () => void;
  /** A slot after Save draft, usually a Draft Saved Indicator. */
  draftStatus?: React.ReactNode;
  closeLabel?: string;
  /** The step content. */
  children: React.ReactNode;
}

function WizardShell({
  title,
  steps,
  step: stepProp,
  defaultStep = 0,
  onStepChange,
  errorStepIds = [],
  valid = true,
  invalidHint = 'Complete the required fields to continue.',
  onNext,
  onBack,
  onFinish,
  onClose,
  onSaveDraft,
  draftStatus,
  closeLabel = 'Close',
  className,
  children,
  ...props
}: WizardShellProps) {
  const [inner, setInner] = React.useState(defaultStep);
  const index = Math.min(Math.max(stepProp ?? inner, 0), steps.length - 1);
  const current = steps[index];
  const last = index === steps.length - 1;
  const baseId = React.useId();
  const titleId = `${baseId}-title`;
  const hintId = `${baseId}-hint`;
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const previous = React.useRef(index);
  const [announcement, setAnnouncement] = React.useState('');

  const go = (next: number) => {
    if (next < 0 || next > steps.length - 1) return;
    if (stepProp === undefined) setInner(next);
    onStepChange?.(next);
  };

  React.useEffect(() => {
    if (previous.current === index) return;
    previous.current = index;
    headingRef.current?.focus();
    setAnnouncement(`Step ${index + 1} of ${steps.length}: ${steps[index].title}`);
  }, [index, steps]);

  const navSteps: StepNavigationStep[] = steps.map((s, i) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    state: i === index ? 'current' : errorStepIds.includes(s.id) ? 'error' : i < index ? 'done' : 'upcoming',
  }));

  const next = () => {
    if (!valid) return;
    onNext?.(index);
    if (last) onFinish?.();
    else go(index + 1);
  };
  const back = () => {
    onBack?.(index);
    go(index - 1);
  };

  return (
    <section
      data-slot="wizard-shell"
      aria-labelledby={titleId}
      className={cn('@container flex w-full min-w-0 max-w-[880px] flex-col rounded-lg border bg-card text-card-foreground', className)}
      {...props}
    >
      <header className="flex min-w-0 items-center justify-between gap-3 border-b px-4 py-3">
        <h2 id={titleId} className="m-0 min-w-0 text-lg font-semibold leading-7 [overflow-wrap:anywhere]">{title}</h2>
        {onClose ? (
          <Button type="button" variant="ghost" size="icon-sm" aria-label={closeLabel} onClick={onClose} className="shrink-0">
            <X aria-hidden="true" />
          </Button>
        ) : null}
      </header>
      <div className="flex min-w-0 flex-col gap-4 p-4 @min-[40rem]:flex-row @min-[40rem]:gap-6">
        <div className="min-w-0 @min-[40rem]:w-56 @min-[40rem]:shrink-0">
          <StepNavigation steps={navSteps} clickableDone onStepSelect={id => go(steps.findIndex(s => s.id === id))} aria-label={`${title} steps`} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="m-0 text-xs leading-4 text-muted-foreground">{`Step ${index + 1} of ${steps.length}`}</p>
            <h3 ref={headingRef} tabIndex={-1} data-slot="wizard-shell-heading" className="m-0 min-w-0 text-base font-semibold leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring [overflow-wrap:anywhere]">
              {current.title}
            </h3>
          </div>
          <div data-slot="wizard-shell-content" className="min-w-0">{children}</div>
        </div>
      </div>
      <footer className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          <Button type="button" variant="outline" disabled={index === 0} onClick={back}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
          {onSaveDraft ? <Button type="button" variant="ghost" onClick={onSaveDraft}>Save draft</Button> : null}
          {draftStatus}
        </div>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-2">
          {valid ? null : <p id={hintId} className="m-0 min-w-0 text-sm leading-5 text-muted-foreground">{invalidHint}</p>}
          <Button type="button" disabled={!valid} aria-describedby={valid ? undefined : hintId} onClick={next}>
            {last ? 'Finish' : 'Next'}
            {last ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          </Button>
        </div>
      </footer>
      <p role="status" aria-live="polite" className="sr-only">{announcement}</p>
    </section>
  );
}

export { WizardShell };
