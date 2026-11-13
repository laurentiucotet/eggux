// EGG UI Upload Queue Item. Code only (no Figma component yet); family Data Transfer.
// One file in an upload queue: a file icon, the name (truncates), size and state text, a progress
// bar while it uploads, and the actions that fit the state. queued: Cancel. uploading: Cancel.
// done: Remove. failed: the reason, Retry and Remove. No file is read or sent here: the parent runs
// the upload and passes state and progress; the component calls onCancel, onRetry, onRemove.
// A11y: a group named after the file; icon buttons carry the file name in their label; the state
// words ("Uploaded", "Failed") are a polite live region, the changing percent is not (the progress
// bar already has the value). Keyboard: Tab reaches the actions; with focus inside the row Escape
// cancels a queued or running upload and Delete removes a finished or failed one. The parent moves
// focus when the row goes away.
import * as React from 'react';
import { CircleAlert, CircleCheck, FileText, RefreshCw, Trash2, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Progress } from './progress';

export type UploadQueueState = 'queued' | 'uploading' | 'done' | 'failed';

export interface UploadQueueItemProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** File name with its extension. */
  name: string;
  /** Size in bytes. */
  size: number;
  state?: UploadQueueState;
  /** 0 to 100, used while uploading. */
  progress?: number;
  /** Why it failed ("The file is larger than 25 MB."). */
  error?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  onRemove?: () => void;
}

export function formatBytes(bytes: number) {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(bytes < 10_000 ? 1 : 0)} KB`;
  return `${(bytes / 1_000_000).toFixed(bytes < 10_000_000 ? 1 : 0)} MB`;
}

function UploadQueueItem({ name, size, state = 'queued', progress = 0, error, onCancel, onRetry, onRemove, className, onKeyDown, ...props }: UploadQueueItemProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  const stateText = {
    queued: 'Waiting to upload',
    uploading: 'Uploading',
    done: 'Uploaded',
    failed: error ? `Failed. ${error}` : 'Failed',
  }[state];

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Escape' && (state === 'queued' || state === 'uploading')) {
      e.preventDefault();
      onCancel?.();
    }
    if (e.key === 'Delete' && (state === 'done' || state === 'failed')) {
      e.preventDefault();
      onRemove?.();
    }
  };

  const iconClass = 'size-4 shrink-0';
  return (
    <div
      data-slot="upload-queue-item"
      data-state={state}
      role="group"
      aria-label={name}
      onKeyDown={handleKey}
      className={cn('flex w-full min-w-0 flex-col gap-2 rounded-lg border bg-card p-3 text-card-foreground', state === 'failed' ? 'border-destructive' : 'border-border', className)}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <FileText className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="min-w-0 truncate text-sm leading-5 font-medium" title={name}>{name}</span>
          <span className="flex min-w-0 items-center gap-1.5 text-xs leading-4 text-muted-foreground">
            <span className="shrink-0">{formatBytes(size)}</span>
            <span aria-hidden="true">·</span>
            <span
              aria-live="polite"
              className={cn('flex min-w-0 items-center gap-1', state === 'failed' && 'text-destructive', state === 'done' && 'text-success')}
            >
              {state === 'done' ? <CircleCheck aria-hidden="true" className={iconClass} /> : null}
              {state === 'failed' ? <CircleAlert aria-hidden="true" className={iconClass} /> : null}
              <span className="min-w-0 truncate" title={stateText}>{stateText}</span>
            </span>
            {state === 'uploading' ? <span aria-hidden="true" className="shrink-0 tabular-nums">{pct}%</span> : null}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {state === 'failed' ? (
            <Button type="button" variant="ghost" size="icon-sm" aria-label={`Retry upload of ${name}`} onClick={onRetry}>
              <RefreshCw aria-hidden="true" />
            </Button>
          ) : null}
          {state === 'queued' || state === 'uploading' ? (
            <Button type="button" variant="ghost" size="icon-sm" aria-label={`Cancel upload of ${name}`} onClick={onCancel}>
              <X aria-hidden="true" />
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ${name} from the list`} onClick={onRemove}>
              <Trash2 aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
      {state === 'uploading' ? <Progress size="sm" value={pct} aria-label={`Uploading ${name}`} /> : null}
    </div>
  );
}

export { UploadQueueItem };
