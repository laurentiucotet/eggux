// EGG UI Background Job. Figma: Background Job (Progress page, "Background Job / Component",
// 443:5563). State (running, done, error). A task that runs in the background (export, import,
// bulk send, report) while people keep working. Card: border, radius md, 12 padding, 12 gap; a 32
// muted icon tile (download, circle-check in success, circle-alert in destructive); the name
// (ui/label) over a Progress (8) and the status ("640 of 1,284 · about 1 min left", ui/caption
// muted), 6 apart; on the right Cancel (Button Icon sm, running), Download (done) or Retry (error),
// both outline sm Buttons. Error text in destructive says where it stopped.
// A11y: a role="status" region so state changes are announced; Cancel is named after the job.
import * as React from 'react';
import { CircleAlert, CircleCheck, Download, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Progress } from './progress';

export type BackgroundJobState = 'running' | 'done' | 'error';

export interface BackgroundJobProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: string;
  state?: BackgroundJobState;
  /** Running: 0 to 100. */
  value?: number;
  /** Running: "640 of 1,284 · about 1 min left". Done: the result. Error: where it stopped. */
  status?: React.ReactNode;
  onCancel?: () => void;
  /** Done: Download. */
  onDownload?: () => void;
  /** Error: Retry. */
  onRetry?: () => void;
  labels?: Partial<{ cancel: string; download: string; retry: string }>;
}

const icons: Record<BackgroundJobState, React.ReactNode> = {
  running: <Download />,
  done: <CircleCheck className="text-success" />,
  error: <CircleAlert className="text-destructive" />,
};

function BackgroundJob({ title, state = 'running', value = 0, status, onCancel, onDownload, onRetry, labels, className, ...props }: BackgroundJobProps) {
  const L = { cancel: `Cancel ${title}`, download: 'Download', retry: 'Retry', ...labels };
  return (
    <div
      data-slot="background-job"
      data-state={state}
      role="status"
      className={cn('flex min-w-0 items-start gap-3 rounded-md border border-border bg-card p-3 text-card-foreground', className)}
      {...props}
    >
      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted [&_svg]:size-4">{icons[state]}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="m-0 text-sm leading-5 font-medium [overflow-wrap:anywhere]">{title}</p>
        {state === 'running' ? <Progress value={value} aria-label={title} /> : null}
        {status ? (
          <p className={cn('m-0 text-xs leading-4 [overflow-wrap:anywhere]', state === 'error' ? 'text-destructive' : 'text-muted-foreground')}>{status}</p>
        ) : null}
      </div>
      {state === 'running' && onCancel ? <ButtonIcon variant="ghost" size="sm" icon={<X />} label={L.cancel} onClick={onCancel} /> : null}
      {state === 'done' && onDownload ? <Button variant="outline" size="sm" onClick={onDownload}>{L.download}</Button> : null}
      {state === 'error' && onRetry ? <Button variant="outline" size="sm" onClick={onRetry}>{L.retry}</Button> : null}
    </div>
  );
}

export { BackgroundJob };
