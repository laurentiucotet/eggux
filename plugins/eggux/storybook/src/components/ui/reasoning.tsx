// EGG UI Reasoning. Figma: Reasoning (AI Chat / Reasoning / Component).
// State (running, collapsed, expanded), Label, Status and Details match the Figma properties.
// running: spinner + Status in a status region, nothing to open. collapsed / expanded: the Label
// row is a Collapsible trigger (radix-ui) and Details is a muted summary with a left rule.
import * as React from 'react';
import { Collapsible } from 'radix-ui';
import { ChevronDown, ChevronRight, LoaderCircle } from '@/components/icons';
import { cn } from '@/lib/utils';

export type ReasoningState = 'running' | 'collapsed' | 'expanded';

export interface ReasoningProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma State. collapsed and expanded set the initial open state; `open` controls it. */
  state?: ReasoningState;
  /** Figma Label: how long the model thought. */
  label?: string;
  /** Figma Status: shown while running. */
  status?: string;
  /** Figma Details: a summary that explains, never raw chain of thought. A ReactNode is allowed. */
  details?: React.ReactNode;
  /** Controlled open state of the details (done states only). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Reasoning({
  state = 'running',
  label = 'Thought for 12 s',
  status = 'Thinking…',
  details = 'The user wants the open invoices for Acme. Search invoices by customer and status, then sum the amounts and sort by due date.',
  open: openProp,
  onOpenChange,
  className,
  ...props
}: ReasoningProps) {
  const [inner, setInner] = React.useState(state === 'expanded');
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : inner;

  // A new State from the parent (Storybook controls, a finished stream) resets the open state.
  React.useEffect(() => {
    if (!controlled && state !== 'running') setInner(state === 'expanded');
  }, [state, controlled]);

  if (state === 'running') {
    return (
      <div data-slot="reasoning" data-state="running" className={cn('flex w-full flex-col items-start', className)} {...props}>
        {/* Announced once when it appears; the text does not change while the model thinks. */}
        <div role="status" className="flex min-w-0 max-w-60 items-center gap-1.5 text-sm font-medium leading-5 text-muted-foreground">
          <LoaderCircle className="size-4 shrink-0 motion-safe:animate-spin motion-reduce:animate-pulse" aria-hidden="true" />
          <span className="min-w-0 truncate">{status}</span>
        </div>
      </div>
    );
  }

  return (
    <Collapsible.Root
      data-slot="reasoning"
      data-state={open ? 'expanded' : 'collapsed'}
      open={open}
      onOpenChange={next => {
        if (!controlled) setInner(next);
        onOpenChange?.(next);
      }}
      className={cn('flex w-full flex-col items-start gap-2', className)}
      {...props}
    >
      <Collapsible.Trigger
        data-slot="reasoning-trigger"
        className="-mx-1 flex min-w-0 max-w-60 items-center gap-1.5 rounded-sm px-1 text-sm font-medium leading-5 text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className="min-w-0 truncate">{label}</span>
        {open ? <ChevronDown className="size-4 shrink-0" aria-hidden="true" /> : <ChevronRight className="size-4 shrink-0" aria-hidden="true" />}
      </Collapsible.Trigger>
      <Collapsible.Content data-slot="reasoning-details" className="w-full border-l-2 border-border pl-4 text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">
        {typeof details === 'string' ? <p>{details}</p> : details}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export { Reasoning };
