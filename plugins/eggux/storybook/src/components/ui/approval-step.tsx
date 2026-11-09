// EGG UI Approval Step. Figma: Approval Step (Approvals page, "Approval Step / Component", 180:409).
// Status (approved, current, rejected, upcoming), Show comment, Show connector. One approver in an
// approval chain, on the Timeline layout: a 24 marker (approved: success fill + check; current:
// warning ring + clock; rejected: destructive fill + x; upcoming: border ring) and a 2 px connector
// (min 16); the body (20 px bottom) holds the name (ui/label) with a pill status Badge (Approved,
// Waiting for you, Rejected, Not started), the role and rule (ui/caption muted, 2 lines), the time
// (ui/caption muted, 1 line) and the comment on background/muted (radius md, 12 / 8 padding).
// Rejected always has a reason; current shows the due date. Last step: connector off.
// A11y: ApprovalChain is an ordered list; the status is in the Badge text, the marker is decorative.
import * as React from 'react';
import { Check, Clock, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export type ApprovalStatus = 'approved' | 'current' | 'rejected' | 'upcoming';

const statusText: Record<ApprovalStatus, string> = { approved: 'Approved', current: 'Waiting for you', rejected: 'Rejected', upcoming: 'Not started' };
const badgeVariant = { approved: 'success', current: 'warning', rejected: 'destructive', upcoming: 'outline' } as const;
const markerClass: Record<ApprovalStatus, string> = {
  approved: 'bg-success text-success-foreground',
  current: 'border-2 border-warning text-foreground',
  rejected: 'bg-destructive text-destructive-foreground',
  upcoming: 'border-2 border-border',
};

function ApprovalChain({ className, ...props }: React.ComponentProps<'ol'>) {
  return <ol data-slot="approval-chain" className={cn('m-0 flex min-w-0 list-none flex-col p-0 [&>li:last-child_[data-slot=approval-connector]]:hidden', className)} {...props} />;
}

export interface ApprovalStepProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  name: string;
  /** "Finance manager · approves over €10,000". */
  role?: string;
  status?: ApprovalStatus;
  /** "22 Oct 2026, 10:30", "Assigned 2 h ago · due tomorrow", "After Finance". */
  time?: string;
  comment?: React.ReactNode;
  /** Status text override ("Waiting for Elena" when someone else looks at it). */
  statusLabel?: string;
  connector?: boolean;
}

function ApprovalStep({ name, role, status = 'upcoming', time, comment, statusLabel, connector = true, className, ...props }: ApprovalStepProps) {
  const icon = status === 'approved' ? <Check /> : status === 'current' ? <Clock /> : status === 'rejected' ? <X /> : null;
  return (
    <li data-slot="approval-step" data-status={status} className={cn('flex min-w-0 items-start gap-3', className)} {...props}>
      <div className="flex shrink-0 flex-col items-center gap-1 self-stretch">
        <span aria-hidden="true" className={cn('flex size-6 shrink-0 items-center justify-center rounded-full [&_svg]:size-3.5', markerClass[status])}>{icon}</span>
        {connector ? <span data-slot="approval-connector" aria-hidden="true" className="min-h-4 w-0.5 flex-1 bg-border" /> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 pb-5">
        <div className="flex min-w-0 items-center gap-2">
          <p className="m-0 min-w-0 flex-1 text-sm leading-5 font-medium text-foreground [overflow-wrap:anywhere]">{name}</p>
          <Badge variant={badgeVariant[status]} shape="pill">{statusLabel ?? statusText[status]}</Badge>
        </div>
        {role ? <p title={role} className="m-0 line-clamp-2 text-xs leading-4 text-muted-foreground">{role}</p> : null}
        {time ? <p title={time} className="m-0 truncate text-xs leading-4 text-muted-foreground">{time}</p> : null}
        {comment && status !== 'upcoming' ? <div className="w-full rounded-md bg-muted px-3 py-2 text-sm leading-5 text-foreground [overflow-wrap:anywhere]">{comment}</div> : null}
      </div>
    </li>
  );
}

export { ApprovalChain, ApprovalStep };
