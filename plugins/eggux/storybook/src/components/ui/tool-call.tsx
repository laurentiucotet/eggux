// EGG UI Tool Call. Figma: Tool Call (AI Chat / Tool Call / Component).
// Status (running, done, error, approval), Title, Description, Approval message and Error message
// match the Figma properties. done collapses: when children (the input and the result) are given,
// the header is a Collapsible trigger (radix-ui) with the chevron. Status badges are soft Badges.
import * as React from 'react';
import { Collapsible } from 'radix-ui';
import { ChevronDown, LoaderCircle, RefreshCw, Wrench } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';

export type ToolCallStatus = 'running' | 'done' | 'error' | 'approval';

export interface ToolCallProps extends React.ComponentProps<'div'> {
  /** Figma Status. */
  status?: ToolCallStatus;
  /** Figma Title: what runs. */
  title?: string;
  /** Figma Description: the input. */
  description?: string;
  /** Figma Approval message (Status=approval): what will happen, to whom. */
  approvalMessage?: React.ReactNode;
  /** Figma Error message (Status=error): what failed. */
  errorMessage?: React.ReactNode;
  onRetry?: () => void;
  onApprove?: () => void;
  onDeny?: () => void;
  /** Status=done: the input and the result, behind the chevron. */
  children?: React.ReactNode;
  /** Controlled open state of the done details. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const statusText: Record<ToolCallStatus, string> = { running: 'Running', done: 'Done', error: 'Failed', approval: 'Needs approval' };

function ToolCall({
  status = 'running',
  title = 'Search invoices',
  description = 'customer: Acme, status: open',
  approvalMessage = 'The assistant wants to send the reminder for INV-1024 to billing@acme.com. Review the draft before approving.',
  errorMessage = 'The invoices service did not respond in 30 s.',
  onRetry,
  onApprove,
  onDeny,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  ...props
}: ToolCallProps) {
  const collapsible = status === 'done' && children != null;

  const icon = <Wrench className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />;
  const text = (
    <span className="flex min-w-0 flex-1 flex-col text-left [overflow-wrap:anywhere]">
      <span data-slot="tool-call-title" className="text-sm font-medium leading-5 text-foreground">{title}</span>
      {description ? <span data-slot="tool-call-description" className="text-xs text-muted-foreground">{description}</span> : null}
    </span>
  );
  // Status in text (never color alone), announced politely when it changes.
  const badge = (
    <span data-slot="tool-call-status" aria-live="polite" className="flex shrink-0 items-center">
      {status === 'running' ? (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <LoaderCircle className="size-4 shrink-0 motion-safe:animate-spin motion-reduce:animate-pulse" aria-hidden="true" />
          {statusText.running}
        </span>
      ) : (
        <Badge shape="pill" variant={status === 'done' ? 'soft-success' : status === 'error' ? 'soft-destructive' : 'soft-warning'}>
          {statusText[status]}
        </Badge>
      )}
    </span>
  );

  const rootClass = cn(
    'flex w-full flex-col gap-3 rounded-lg border bg-background p-3 text-foreground',
    status === 'approval' ? 'border-input' : 'border-border',
    className,
  );

  if (collapsible) {
    return (
      <Collapsible.Root data-slot="tool-call" data-status={status} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} className={rootClass} {...props}>
        <Collapsible.Trigger className="group -m-1 flex w-[calc(100%+0.5rem)] items-center gap-2 rounded-md p-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          {icon}
          {text}
          {badge}
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-fast)] group-data-[state=open]:rotate-180" aria-hidden="true" />
        </Collapsible.Trigger>
        <Collapsible.Content data-slot="tool-call-details" className="text-sm leading-5 text-foreground [overflow-wrap:anywhere]">
          {children}
        </Collapsible.Content>
      </Collapsible.Root>
    );
  }

  return (
    <div data-slot="tool-call" data-status={status} className={rootClass} {...props}>
      <div className="flex w-full items-center gap-2">
        {icon}
        {text}
        {badge}
      </div>

      {status === 'error' ? (
        <>
          <p data-slot="tool-call-error" className="text-sm leading-5 text-destructive [overflow-wrap:anywhere]">{errorMessage}</p>
          <div className="flex items-start gap-2">
            <Button variant="outline" size="sm" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry}>Retry</Button>
          </div>
        </>
      ) : null}

      {status === 'approval' ? (
        <>
          <p data-slot="tool-call-approval" className="text-sm leading-5 text-foreground [overflow-wrap:anywhere]">{approvalMessage}</p>
          <div className="flex items-start gap-2">
            <Button variant="outline" size="sm" onClick={onDeny}>Deny</Button>
            <Button size="sm" onClick={onApprove}>Approve</Button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export { ToolCall };
