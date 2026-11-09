// EGG UI Attachment (AI Chat). A file or image attached to a prompt (Prompt Input Attachments
// slot) or sent with a message (User Message, above the bubble). Figma names it in the AI Chat docs
// but has no component any more; this one follows the File Item of the File Upload page.
// - Type file: 224 wide, radius lg, border, 8 padding: File Type Icon sm (32), name (truncates in
//   the middle, the extension stays), meta ("PDF · 240 KB"), remove. Type image: a 64 thumbnail
//   with the remove button on its corner.
// - State uploading: a progress bar (role progressbar named after the file) and the percent in the
//   meta; error: destructive border, the reason, Retry and remove; ready: size and type.
// - Without onRemove the attachment is read-only (in a sent message); with href the name opens it.
import * as React from 'react';
import { CircleAlert, RefreshCw, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { FileTypeIcon, fileKindOf, formatBytes, type FileKind } from './file-upload';
import { Spinner } from './spinner';

export type AttachmentState = 'ready' | 'uploading' | 'error';

export interface AttachmentProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  name: string;
  /** Bytes, or a ready-made meta text ("12 pages"). */
  size?: number | string;
  /** File kind; default from the name. */
  kind?: FileKind;
  /** image: a 64 thumbnail (needs `src`); file: the 224 row. Default image when `src` is set. */
  type?: 'file' | 'image';
  src?: string;
  state?: AttachmentState;
  /** uploading: 0 to 100. */
  progress?: number;
  /** error: what went wrong. */
  error?: string;
  /** Opens the file (sent messages). */
  href?: string;
  onRemove?: () => void;
  onRetry?: () => void;
}

function NameText({ name, href }: { name: string; href?: string }) {
  const tailLen = Math.min(8, Math.floor(name.length / 2));
  const content = (
    <>
      <span className="truncate">{name.slice(0, name.length - tailLen)}</span>
      <span className="shrink-0 whitespace-pre">{name.slice(name.length - tailLen)}</span>
    </>
  );
  return href ? (
    <a href={href} title={name} aria-label={name} className="flex min-w-0 rounded-sm text-sm leading-5 font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
      {content}
    </a>
  ) : (
    <span title={name} className="flex min-w-0 text-sm leading-5 font-medium text-foreground">
      {content}
    </span>
  );
}

function Attachment({ name, size, kind, type, src, state = 'ready', progress = 0, error = 'Upload failed', href, onRemove, onRetry, className, ...props }: AttachmentProps) {
  const k = kind ?? fileKindOf(name);
  const asImage = (type ?? (src ? 'image' : 'file')) === 'image';
  const pct = Math.round(Math.max(0, Math.min(100, progress)));
  const ext = name.includes('.') ? name.split('.').pop()!.toUpperCase() : '';
  const meta = state === 'uploading' ? `Uploading… ${pct}%` : state === 'error' ? error : [ext, typeof size === 'number' ? formatBytes(size) : size].filter(Boolean).join(' · ');
  const bar =
    state === 'uploading' ? (
      <span role="progressbar" aria-label={`Uploading ${name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="absolute inset-x-0 bottom-0 h-0.5 bg-muted">
        <span className="block h-full bg-primary transition-[width] duration-[var(--duration-fast)]" style={{ width: `${pct}%` }} />
      </span>
    ) : null;
  const remove = onRemove ? <ButtonIcon variant="ghost" size="xs" icon={<X />} label={state === 'uploading' ? `Cancel upload of ${name}` : `Remove ${name}`} onClick={onRemove} /> : null;

  if (asImage) {
    return (
      <div data-slot="attachment" data-type="image" data-state={state} className={cn('group/attachment relative size-16 shrink-0', className)} {...props}>
        <div className={cn('relative size-full overflow-hidden rounded-lg border bg-muted', state === 'error' ? 'border-destructive' : 'border-border')}>
          {src ? <img src={src} alt={name} className="size-full object-cover" /> : <FileTypeIcon kind={k} className="size-full rounded-none" />}
          {state === 'uploading' ? (
            <span className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Spinner size="sm" />
            </span>
          ) : null}
          {state === 'error' ? (
            <span className="absolute inset-0 flex items-center justify-center bg-background/80 text-destructive">
              <CircleAlert aria-hidden="true" className="size-5" />
            </span>
          ) : null}
          {bar}
        </div>
        <span className="sr-only">
          {href ? null : name}
          {state !== 'ready' ? `, ${meta}` : ''}
        </span>
        {href ? (
          <a href={href} className="absolute inset-0 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <span className="sr-only">Open {name}</span>
          </a>
        ) : null}
        {onRemove || (state === 'error' && onRetry) ? (
          <span className="absolute -top-2 -right-2 flex gap-0.5 [&_button]:rounded-full [&_button]:bg-background [&_button]:shadow-sm">
            {state === 'error' && onRetry ? <ButtonIcon variant="outline" size="xs" icon={<RefreshCw />} label={`Retry upload of ${name}`} onClick={onRetry} /> : null}
            {onRemove ? <ButtonIcon variant="outline" size="xs" icon={<X />} label={state === 'uploading' ? `Cancel upload of ${name}` : `Remove ${name}`} onClick={onRemove} /> : null}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      data-slot="attachment"
      data-type="file"
      data-state={state}
      className={cn('relative flex w-56 max-w-full min-w-0 items-center gap-2 overflow-hidden rounded-lg border bg-background p-2', state === 'error' ? 'border-destructive' : 'border-border', className)}
      {...props}
    >
      <FileTypeIcon kind={k} size="sm" />
      <span className="flex min-w-0 flex-1 flex-col">
        <NameText name={name} href={href} />
        <span className={cn('truncate text-xs leading-4', state === 'error' ? 'text-destructive' : 'text-muted-foreground')} aria-live={state === 'ready' ? undefined : 'polite'}>
          {meta}
        </span>
      </span>
      {state === 'error' && onRetry ? <ButtonIcon variant="ghost" size="xs" icon={<RefreshCw />} label={`Retry upload of ${name}`} onClick={onRetry} /> : null}
      {remove}
      {bar}
    </div>
  );
}

/** A wrapping row of Attachments (the Prompt Input and User Message slots already wrap). */
function AttachmentList({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="attachment-list" className={cn('flex min-w-0 flex-wrap items-start gap-2', className)} {...props} />;
}

export { Attachment, AttachmentList };
