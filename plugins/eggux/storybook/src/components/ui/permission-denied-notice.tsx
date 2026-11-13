// EGG UI Permission Denied Notice. Code only (no Figma component yet); family Access.
// An inline notice where someone cannot do something because of their access: a lock, the title
// "You need Editor access", a line that names who to ask (the owner, with their Avatar) and a
// Request access button. After the request the button gives way to "Request sent to Maria Ilie" with
// a check, announced in a live region; while it is being sent the button is busy. Inline, not a
// page: it sits in the place of the thing that is blocked (a panel, a form, a tab) and fills its
// parent up to 480 px; text wraps, the owner name truncates, the button goes under the text at 276.
// State is `idle` | `sending` | `sent`, controlled with `status` or on its own (a click sets `sent`
// after `onRequest`). Without an owner it says "Ask an owner of this space".
// A11y: a region named by its title (`<section aria-labelledby>`); the sent line and the busy state are
// in a polite live region; the button keeps its label while busy and aria-busy.
import * as React from 'react';
import { Check, Lock, Send } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Button } from './button';

export type RequestStatus = 'idle' | 'sending' | 'sent';

export interface PermissionDeniedNoticeProps extends Omit<React.ComponentProps<'section'>, 'children' | 'title'> {
  /** The level that is missing ("Editor"). */
  requiredLevel?: string;
  /** What is blocked, as a phrase that starts a sentence ("Editing this plan"). */
  action?: string;
  owner?: { name: string; initials?: string };
  status?: RequestStatus;
  onRequest?: () => void;
  /** Heading level of the title. Default h3. */
  titleAs?: 'h2' | 'h3' | 'h4';
}

function PermissionDeniedNotice({
  requiredLevel = 'Editor',
  action,
  owner,
  status: statusProp,
  onRequest,
  titleAs: Title = 'h3',
  className,
  ...props
}: PermissionDeniedNoticeProps) {
  const [inner, setInner] = React.useState<RequestStatus>('idle');
  const status = statusProp ?? inner;
  const titleId = React.useId();
  const who = owner?.name ?? 'an owner of this space';
  return (
    <section
      data-slot="permission-denied-notice"
      data-status={status}
      aria-labelledby={titleId}
      className={cn('flex min-w-0 max-w-120 flex-wrap items-start gap-x-3 gap-y-3 rounded-lg border border-border bg-muted/50 p-4', className)}
      {...props}
    >
      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-4">
        <Lock />
      </span>
      <div className="flex min-w-40 flex-1 flex-col gap-1">
        <Title id={titleId} className="text-sm leading-5 font-semibold text-foreground">You need {requiredLevel} access</Title>
        <p className="text-sm leading-5 text-muted-foreground">
          {action ? `${action.charAt(0).toUpperCase()}${action.slice(1)} needs ${requiredLevel} access. ` : ''}
          {owner ? 'The owner can give it to you.' : 'Ask an owner to give it to you.'}
        </p>
        {owner ? (
          <p className="flex min-w-0 items-center gap-2 pt-1 text-sm leading-5 text-foreground">
            <Avatar size="xs" initials={owner.initials ?? owner.name.slice(0, 2).toUpperCase()} aria-hidden="true" className="shrink-0" />
            <span title={owner.name} className="min-w-0 truncate font-medium">{owner.name}</span>
            <span className="shrink-0 text-muted-foreground">Owner</span>
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center">
        {status === 'sent' ? (
          <span data-slot="request-sent" className="flex h-8 items-center gap-1.5 text-sm leading-5 font-medium text-[var(--badge-soft-success-fg)]">
            <Check aria-hidden="true" className="size-4 shrink-0" />
            Request sent
          </span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            loading={status === 'sending'}
            leadingIcon={<Send aria-hidden="true" />}
            onClick={() => {
              onRequest?.();
              if (statusProp === undefined) setInner('sent');
            }}
          >
            Request access
          </Button>
        )}
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {status === 'sent' ? `Request sent to ${who}` : status === 'sending' ? 'Sending request' : ''}
      </span>
    </section>
  );
}

export { PermissionDeniedNotice };
