// EGG UI Service Area Notice. Code only (no Figma component yet). A banner that tells whether an
// address is inside, near or outside the delivery area, with a Change address action. Inside: a
// green check ("We deliver to this address"); near: a warning (an edge zone with a fee or a longer
// wait); outside: a red alert (what can still be done: pick up in store). Status is never colour
// alone: each state has its own icon and heading. The notice is a polite status (it follows the
// address the shopper just typed); the address is shown in full so the message is checkable.
// Extra actions (Switch to pickup) go in `actions`.
import * as React from 'react';
import { CircleAlert, CircleCheck, MapPin, TriangleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type ServiceAreaStatus = 'inside' | 'near' | 'outside';

export interface ServiceAreaNoticeProps extends Omit<React.ComponentProps<'div'>, 'children' | 'title'> {
  status: ServiceAreaStatus;
  /** The address that was checked. */
  address: string;
  /** Replaces the default heading of the state. */
  title?: string;
  /** What follows: "Delivery in 30 to 45 minutes", "A 3.00 EUR edge zone fee applies". */
  description?: React.ReactNode;
  /** Runs from the Change address button. Leave out to hide it. */
  onChangeAddress?: () => void;
  changeLabel?: string;
  /** More actions after Change address (Switch to pickup). */
  actions?: React.ReactNode;
}

const headings: Record<ServiceAreaStatus, string> = {
  inside: 'We deliver to this address',
  near: 'This address is at the edge of our delivery area',
  outside: 'We do not deliver to this address yet',
};
const iconWrap: Record<ServiceAreaStatus, string> = {
  inside: 'bg-[var(--badge-soft-success-bg)] text-[var(--badge-soft-success-fg)]',
  near: 'bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]',
  outside: 'bg-[var(--badge-soft-destructive-bg)] text-[var(--badge-soft-destructive-fg)]',
};
const border: Record<ServiceAreaStatus, string> = {
  inside: 'border-[var(--badge-soft-success-fg)]/40',
  near: 'border-[var(--badge-soft-warning-fg)]/40',
  outside: 'border-[var(--badge-soft-destructive-fg)]/40',
};

function ServiceAreaNotice({ status, address, title, description, onChangeAddress, changeLabel = 'Change address', actions, className, ...props }: ServiceAreaNoticeProps) {
  const Icon = status === 'inside' ? CircleCheck : status === 'near' ? TriangleAlert : CircleAlert;
  return (
    <div
      data-slot="service-area-notice"
      data-status={status}
      role="status"
      className={cn('flex w-full min-w-0 flex-wrap items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground', border[status], className)}
      {...props}
    >
      <span aria-hidden="true" className={cn('flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-4', iconWrap[status])}>
        <Icon />
      </span>
      <div className="flex min-w-0 flex-1 basis-48 flex-col gap-1">
        <p className="m-0 text-sm leading-5 font-semibold">{title ?? headings[status]}</p>
        <p className="m-0 flex min-w-0 items-start gap-1.5 text-sm leading-5 text-muted-foreground">
          <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span className="min-w-0 break-words">{address}</span>
        </p>
        {description ? <p className="m-0 text-sm leading-5 text-foreground">{description}</p> : null}
      </div>
      {onChangeAddress || actions ? (
        <div className="flex max-w-full min-w-0 flex-wrap gap-2">
          {onChangeAddress ? (
            <Button type="button" variant="outline" size="sm" onClick={onChangeAddress}>
              {changeLabel}
            </Button>
          ) : null}
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export { ServiceAreaNotice };
