// EGG UI Webhook Row. Code only (no Figma component yet); family Developer.
// One webhook endpoint as a row: the URL in mono (cut on one line, full value in a title), a status
// Badge (Active, Failing, Disabled: a word with a dot, never color alone), the events it listens to
// as Badge List ("+N" opens the rest), the last delivery (HTTP code, time, ok or failed) and a Send
// test button. Send test runs `onTest`; when it returns a promise the button is busy until it
// settles, and a polite live region says "Test event sent" or "Test failed". Wraps at 276 px.
import * as React from 'react';
import { Send } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from './badge';
import { BadgeList } from './badge-list';
import { Button } from './button';

export type WebhookStatus = 'active' | 'failing' | 'disabled';

export interface WebhookDelivery {
  /** HTTP status code the endpoint answered with. */
  code: number;
  /** When, as people read it: "5 min ago". */
  at: string;
  ok: boolean;
}

const statusLabel: Record<WebhookStatus, string> = { active: 'Active', failing: 'Failing', disabled: 'Disabled' };
const statusVariant: Record<WebhookStatus, NonNullable<BadgeProps['variant']>> = { active: 'soft-success', failing: 'soft-destructive', disabled: 'soft-neutral' };

export interface WebhookRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  url: string;
  events: string[];
  status: WebhookStatus;
  /** The last delivery, or null when nothing was sent yet. */
  lastDelivery: WebhookDelivery | null;
  /** Called by Send test. A returned promise keeps the button busy; a rejection reads as failed. */
  onTest?: () => void | Promise<unknown>;
  /** How many events show before "+N". */
  maxEvents?: number;
}

function WebhookRow({ url, events, status, lastDelivery, onTest, maxEvents = 3, className, ...props }: WebhookRowProps) {
  const [testing, setTesting] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const mounted = React.useRef(true);
  React.useEffect(() => () => { mounted.current = false; }, []);

  const test = async () => {
    setTesting(true);
    setMessage('');
    try {
      await onTest?.();
      if (mounted.current) setMessage('Test event sent');
    } catch {
      if (mounted.current) setMessage('Test failed');
    } finally {
      if (mounted.current) setTesting(false);
    }
  };

  return (
    <div data-slot="webhook-row" data-status={status} className={cn('flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground', className)} {...props}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <code title={url} className="min-w-0 flex-1 basis-48 truncate font-mono text-sm leading-5 text-foreground">{url}</code>
        <Badge variant={statusVariant[status]} dot>{statusLabel[status]}</Badge>
      </div>
      <BadgeList items={events} max={maxEvents} label="Events" moreLabel="more events" />
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="m-0 min-w-0 text-sm leading-5 text-muted-foreground">
          {lastDelivery ? (
            <>
              Last delivery{' '}
              <span className={cn('font-mono font-medium', lastDelivery.ok ? 'text-foreground' : 'text-destructive')}>
                {lastDelivery.code}<span className="sr-only">{lastDelivery.ok ? ' (delivered)' : ' (failed)'}</span>
              </span>
              {' · '}
              {lastDelivery.at}
            </>
          ) : (
            'No deliveries yet'
          )}
        </p>
        <Button type="button" variant="outline" size="sm" loading={testing} disabled={status === 'disabled'} leadingIcon={<Send aria-hidden="true" />} onClick={test}>
          Send test<span className="sr-only"> event to {url}</span>
        </Button>
      </div>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </div>
  );
}

export { WebhookRow };
