// EGG UI File Upload page: File Type Icon (1097:136062), File Dropzone (100:59), File Item
// (100:102), File Preview (274:954), Resource Item (381:4992), File Field (432:3921).
// File Type Icon: a 40 (sm 32) tile with the extension in the type's Badge category colors (pdf
// rose 8, document blue 1, sheet green 6, slides orange 2, image violet 7, video fuchsia 5, audio
// cyan 3, archive amber 4); code and generic on soft-neutral. Decorative next to the file name.
// File Dropzone: dashed input border, radius lg; default (24 padding, 40 icon on muted, title,
// hint, Browse files outline sm) or sm (one row, 12 padding, 32 icon). drag-over: ring border on
// muted, "Drop files to upload"; error: destructive border and message (role alert); disabled.
// The whole area opens the picker; Browse is the one focusable control. Checks type and size.
// File Item: one file. uploading: progress and cancel; done: size and remove; error: the reason
// in destructive, Retry and cancel. row (480, 40 icon or thumbnail) or tile (160, a 112 media
// with the action on its corner, Retry under the error). Names truncate in the middle.
// File Preview: toolbar (name and meta, zoom out / % / in, download, close), page thumbnails, the
// page on muted, "Page 1 of 3"; loading and unavailable states; Escape closes.
// Resource Item: a file people download: 40 icon tile, name, meta, actions, a divider.
// File Field: one file in a form: Choose file (secondary sm) inside a 36 field, the name or
// "No file chosen", remove; error border and message.
import * as React from 'react';
import { CircleAlert, Download, FileText, Minus, Plus, Trash2, Upload, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Progress } from './progress';
import { Spinner } from './spinner';

/* File Type Icon */

export type FileKind = 'pdf' | 'document' | 'sheet' | 'slides' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'generic';

const kindStyle: Record<FileKind, { cat: string | null; ext: string }> = {
  pdf: { cat: '8', ext: 'PDF' },
  document: { cat: '1', ext: 'DOC' },
  sheet: { cat: '6', ext: 'XLS' },
  slides: { cat: '2', ext: 'PPT' },
  image: { cat: '7', ext: 'JPG' },
  video: { cat: '5', ext: 'MP4' },
  audio: { cat: '3', ext: 'MP3' },
  archive: { cat: '4', ext: 'ZIP' },
  code: { cat: null, ext: '</>' },
  generic: { cat: null, ext: '' },
};

/** Picks a kind from a file name or MIME type. */
export function fileKindOf(name: string, mime = ''): FileKind {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf' || mime === 'application/pdf') return 'pdf';
  if (['doc', 'docx', 'odt', 'rtf', 'txt', 'md'].includes(ext)) return 'document';
  if (['xls', 'xlsx', 'csv', 'ods', 'numbers'].includes(ext)) return 'sheet';
  if (['ppt', 'pptx', 'key', 'odp'].includes(ext)) return 'slides';
  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic'].includes(ext)) return 'image';
  if (mime.startsWith('video/') || ['mp4', 'mov', 'webm', 'avi'].includes(ext)) return 'video';
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'ogg'].includes(ext)) return 'audio';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
  if (['js', 'ts', 'tsx', 'json', 'html', 'css', 'py', 'sql', 'xml', 'yml', 'yaml'].includes(ext)) return 'code';
  return 'generic';
}

export interface FileTypeIconProps extends React.ComponentProps<'span'> {
  kind: FileKind;
  size?: 'default' | 'sm';
  /** Another extension of the same kind: CSV, PNG. */
  label?: string;
}

function FileTypeIcon({ kind, size = 'default', label, className, ...props }: FileTypeIconProps) {
  const s = kindStyle[kind];
  return (
    <span
      aria-hidden="true"
      data-slot="file-type-icon"
      data-kind={kind}
      style={s.cat ? { background: `var(--badge-category-${s.cat}-bg)`, color: `var(--badge-category-${s.cat}-fg)` } : undefined}
      className={cn(
        'inline-flex shrink-0 items-center justify-center text-xs leading-4 font-medium',
        size === 'sm' ? 'size-8 rounded-sm [&_svg]:size-4' : 'size-10 rounded-md [&_svg]:size-5',
        !s.cat && 'bg-[var(--badge-soft-neutral-bg)] text-foreground',
        className,
      )}
      {...props}
    >
      {kind === 'generic' ? <FileText /> : (label ?? s.ext)}
    </span>
  );
}

/* Helpers */

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Name truncated in the middle: the end (with the extension) always shows. */
function MiddleName({ name, className }: { name: string; className?: string }) {
  const tailLen = Math.min(10, Math.floor(name.length / 2));
  const head = name.slice(0, name.length - tailLen);
  const tail = name.slice(name.length - tailLen);
  return (
    <span title={name} className={cn('flex min-w-0', className)}>
      <span className="truncate">{head}</span>
      <span className="shrink-0 whitespace-pre">{tail}</span>
    </span>
  );
}

/* File Dropzone */

export interface FileDropzoneProps extends Omit<React.ComponentProps<'div'>, 'onDrop'> {
  size?: 'default' | 'sm';
  title?: string;
  /** Accepted types and size: "PDF, JPG or PNG · up to 10 MB each". */
  hint?: string;
  /** input accept, e.g. ".pdf,.jpg,.png" or "image/*". */
  accept?: string;
  multiple?: boolean;
  /** Bytes. */
  maxSize?: number;
  disabled?: boolean;
  /** An error from the app; rejected files set their own. */
  error?: string;
  onFiles?: (files: File[]) => void;
  /** Message for files that do not match accept or maxSize. */
  rejectMessage?: (file: File, reason: 'type' | 'size') => string;
}

function accepts(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(',').map(a => a.trim().toLowerCase()).some(a =>
    a.startsWith('.') ? file.name.toLowerCase().endsWith(a) : a.endsWith('/*') ? file.type.startsWith(a.slice(0, -1)) : file.type === a,
  );
}

function FileDropzone({
  size = 'default',
  title = 'Drag and drop files here',
  hint = 'PDF, JPG or PNG · up to 10 MB each',
  accept,
  multiple = true,
  maxSize,
  disabled = false,
  error: errorProp,
  onFiles,
  rejectMessage = (f, r) => (r === 'type' ? `${f.name} is not an accepted file type.` : `${f.name} is over the size limit.`),
  className,
  ...props
}: FileDropzoneProps) {
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [over, setOver] = React.useState(false);
  const [rejected, setRejected] = React.useState<string | null>(null);
  const error = errorProp ?? rejected;
  const take = (list: FileList | null) => {
    if (!list) return;
    const files = Array.from(list);
    const bad = files.map(f => (!accepts(f, accept) ? rejectMessage(f, 'type') : maxSize && f.size > maxSize ? rejectMessage(f, 'size') : null)).find(Boolean);
    setRejected(bad ?? null);
    const ok = files.filter(f => accepts(f, accept) && (!maxSize || f.size <= maxSize));
    if (ok.length) onFiles?.(multiple ? ok : ok.slice(0, 1));
  };
  const sm = size === 'sm';
  const state = disabled ? 'disabled' : over ? 'drag-over' : error ? 'error' : 'default';
  return (
    <div
      data-slot="file-dropzone"
      data-state={state}
      onClick={e => { if (!disabled && e.target === e.currentTarget) inputRef.current?.click(); }}
      onDragOver={e => { if (disabled) return; e.preventDefault(); setOver(true); }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false); }}
      onDrop={e => { if (disabled) return; e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
      className={cn(
        'relative flex w-full min-w-0 rounded-lg border border-dashed',
        sm ? 'items-center gap-3 p-3' : 'flex-col items-center gap-3 p-6 text-center',
        over ? 'border-ring bg-muted' : error ? 'border-destructive bg-background' : 'border-input bg-background',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={cn('pointer-events-none flex shrink-0 items-center justify-center rounded-full', sm ? 'size-8 [&_svg]:size-4' : 'size-10 [&_svg]:size-5', over ? 'bg-background' : 'bg-muted', error && !over && 'text-destructive', disabled && 'opacity-50')}>
        <Upload />
      </span>
      <div className={cn('pointer-events-none flex min-w-0 flex-col gap-1', sm ? 'flex-1' : 'w-full items-center')}>
        <p className={cn('m-0 w-full text-sm leading-5 font-medium', disabled ? 'text-muted-foreground' : 'text-foreground', sm && 'truncate')}>{over ? 'Drop files to upload' : title}</p>
        {error && !over ? (
          <p id={`${id}-hint`} role="alert" className={cn('m-0 w-full text-xs leading-4 text-destructive', sm && 'truncate')}>{error}</p>
        ) : (
          // Muted on the muted drag-over fill is under 4.5:1: foreground there (decision D-001).
          <p id={`${id}-hint`} className={cn('m-0 w-full text-xs leading-4', over ? 'text-foreground' : 'text-muted-foreground', sm && 'truncate')}>{hint}</p>
        )}
      </div>
      {!over ? (
        <Button variant="outline" size="sm" disabled={disabled} aria-describedby={`${id}-hint`} onClick={() => inputRef.current?.click()} className="shrink-0">
          Browse files
        </Button>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={e => { take(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}

/* File Item */

export type FileItemState = 'uploading' | 'done' | 'error';

export interface FileItemProps extends React.ComponentProps<'li'> {
  name: string;
  /** "2.4 MB". */
  size?: string;
  state?: FileItemState;
  /** 0-100 while uploading. */
  progress?: number;
  error?: string;
  layout?: 'row' | 'tile';
  /** A thumbnail (Type=image). */
  imageSrc?: string;
  /** Leading tile; defaults to a File Type Icon from the name. */
  icon?: React.ReactNode;
  onCancel?: () => void;
  onRemove?: () => void;
  onRetry?: () => void;
}

function FileItem({ name, size, state = 'done', progress = 0, error = 'Upload failed. Check the connection and try again.', layout = 'row', imageSrc, icon, onCancel, onRemove, onRetry, className, ...props }: FileItemProps) {
  const tile = layout === 'tile';
  const meta = state === 'uploading' ? `${size ? `${size} · ` : ''}${progress}%` : state === 'done' ? (tile ? `${size ?? ''} · Uploaded` : size) : null;
  const media = state === 'error' ? (
    <span className={cn('flex items-center justify-center rounded-md bg-muted text-destructive [&_svg]:size-5', tile ? 'h-28 w-full' : 'size-10 shrink-0')}><CircleAlert aria-hidden="true" /></span>
  ) : imageSrc ? (
    <img src={imageSrc} alt="" className={cn('rounded-md bg-muted object-cover', tile ? 'h-28 w-full' : 'size-10 shrink-0')} />
  ) : tile ? (
    <span className="flex h-28 w-full items-center justify-center rounded-md bg-muted [&_svg]:size-5"><FileText aria-hidden="true" /></span>
  ) : (
    icon ?? <FileTypeIcon kind={fileKindOf(name)} />
  );
  const action =
    state === 'done' ? (onRemove ? <ButtonIcon variant={tile ? 'outline' : 'ghost'} size={tile ? 'sm' : 'default'} icon={<Trash2 />} label={`Remove ${name}`} onClick={onRemove} /> : null)
    : onCancel ? <ButtonIcon variant={tile ? 'outline' : 'ghost'} size={tile ? 'sm' : 'default'} icon={<X />} label={state === 'uploading' ? `Cancel upload of ${name}` : `Remove ${name}`} onClick={onCancel} /> : null;
  const retry = state === 'error' && onRetry ? <Button variant="outline" size="sm" className="shrink-0 self-start" onClick={onRetry}>Retry<span className="sr-only"> {name}</span></Button> : null;
  return (
    <li
      data-slot="file-item"
      data-state={state}
      data-layout={layout}
      className={cn(
        'relative flex min-w-0 list-none rounded-md border bg-background',
        tile ? 'w-40 flex-col gap-2 p-2' : 'w-full items-center gap-3 p-3',
        state === 'error' ? 'border-destructive' : 'border-border',
        className,
      )}
      {...props}
    >
      {media}
      <div className={cn('flex min-w-0 flex-col gap-1', !tile && 'flex-1')}>
        <MiddleName name={name} className="text-sm leading-5 font-medium text-foreground" />
        {state === 'error' ? <p role="alert" className="m-0 text-xs leading-4 text-destructive">{error}</p> : <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{meta}</p>}
        {state === 'uploading' ? <Progress value={progress} aria-label={`Uploading ${name}`} /> : null}
        {tile ? retry : null}
      </div>
      {!tile ? retry : null}
      {action ? <div className={cn('shrink-0', tile && 'absolute top-[11px] right-[11px]')}>{action}</div> : null}
    </li>
  );
}

/* File Preview */

export interface PreviewPage { thumbnail?: React.ReactNode; content: React.ReactNode }

export interface FilePreviewProps extends React.ComponentProps<'section'> {
  fileName: string;
  meta?: string;
  state?: 'ready' | 'loading' | 'unavailable';
  pages?: PreviewPage[];
  page?: number;
  onPageChange?: (page: number) => void;
  onDownload?: () => void;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const zoomSteps = [50, 75, 100, 125, 150, 200];

function FilePreview({ fileName, meta, state = 'ready', pages = [], page: pageProp, onPageChange, onDownload, onClose, icon, className, ...props }: FilePreviewProps) {
  const id = React.useId();
  const [inner, setInner] = React.useState(0);
  const page = pageProp ?? inner;
  const go = (p: number) => { setInner(p); onPageChange?.(p); };
  const [zoom, setZoom] = React.useState(100);
  const zi = zoomSteps.indexOf(zoom);
  const ready = state === 'ready' && pages.length > 0;
  return (
    <section
      data-slot="file-preview"
      data-state={state}
      aria-labelledby={id}
      onKeyDown={e => { if (e.key === 'Escape' && onClose) { e.stopPropagation(); onClose(); } }}
      className={cn('flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span aria-hidden="true" className="flex shrink-0 [&_svg]:size-4">{icon ?? <FileText />}</span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 id={id} title={fileName} className="m-0 truncate text-sm leading-5 font-medium">{fileName}</h2>
          {meta ? <span className="truncate text-xs leading-4 text-muted-foreground">{meta}</span> : null}
        </div>
        {ready ? (
          <>
            <ButtonIcon variant="ghost" icon={<Minus />} label="Zoom out" disabled={zi <= 0} onClick={() => setZoom(zoomSteps[zi - 1]!)} />
            <span aria-live="polite" className="w-11 shrink-0 text-center text-sm leading-5 font-medium text-muted-foreground">{zoom}%</span>
            <ButtonIcon variant="ghost" icon={<Plus />} label="Zoom in" disabled={zi >= zoomSteps.length - 1} onClick={() => setZoom(zoomSteps[zi + 1]!)} />
          </>
        ) : null}
        {onDownload ? <ButtonIcon variant="ghost" icon={<Download />} label="Download" onClick={onDownload} /> : null}
        {onClose ? <ButtonIcon variant="ghost" icon={<X />} label="Close preview" onClick={onClose} /> : null}
      </div>
      <div className="flex h-[560px] min-h-0 bg-muted">
        {ready ? (
          <>
            <ol aria-label="Pages" className="m-0 flex h-full shrink-0 list-none flex-col gap-3 overflow-y-auto border-r border-border bg-card px-3 py-4">
              {pages.map((p, i) => (
                <li key={i} className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Page ${i + 1}`}
                    aria-current={i === page ? 'page' : undefined}
                    onClick={() => go(i)}
                    className={cn('h-24 w-[72px] overflow-hidden bg-background p-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', i === page ? 'border-2 border-ring' : 'border border-border')}
                  >
                    {p.thumbnail}
                  </button>
                  <span aria-hidden="true" className="text-xs leading-4 text-muted-foreground">{i + 1}</span>
                </li>
              ))}
            </ol>
            <div data-slot="file-preview-viewer" tabIndex={0} aria-label={`Page ${page + 1}`} className="flex min-w-0 flex-1 justify-center overflow-auto p-6 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50">
              <div style={{ zoom: zoom / 100 }} className="h-fit">{pages[page]?.content}</div>
            </div>
          </>
        ) : state === 'loading' ? (
          <div role="status" className="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-foreground">
            <Spinner aria-hidden="true" />
            Loading preview…
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="m-0 text-sm leading-5 font-medium text-foreground">No preview for this file type</p>
            {onDownload ? <Button variant="outline" size="sm" onClick={onDownload}><Download aria-hidden="true" />Download</Button> : null}
          </div>
        )}
      </div>
      <div className="px-4 py-2 text-xs leading-4 text-muted-foreground">{ready ? `Page ${page + 1} of ${pages.length}` : ' '}</div>
    </section>
  );
}

/* Resource Item */

export interface ResourceItemProps extends React.ComponentProps<'li'> {
  name: string;
  /** "XLSX · 2.4 MB · Updated 12 Oct 2026". */
  meta?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  divider?: boolean;
}

function ResourceItem({ name, meta, icon, actions, divider = true, className, ...props }: ResourceItemProps) {
  return (
    <li data-slot="resource-item" className={cn('flex w-full min-w-0 list-none items-center gap-3 py-3', divider && 'border-b border-border', className)} {...props}>
      <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted [&_svg]:size-5">{icon ?? <FileText />}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm leading-5 font-medium text-foreground">{name}</span>
        {meta ? <span className="text-xs leading-4 text-muted-foreground">{meta}</span> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
    </li>
  );
}

/* File Field */

export interface FileFieldProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  label: string;
  /** The chosen file; null when empty. */
  file?: { name: string; size?: string } | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

function FileField({ label, file = null, onChange, accept, hint, error, disabled = false, className, ...props }: FileFieldProps) {
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const described = error || hint ? `${id}-msg` : undefined;
  return (
    <div data-slot="file-field" data-state={error ? 'error' : file ? 'selected' : 'empty'} className={cn('flex w-full min-w-0 flex-col gap-1.5', className)} {...props}>
      <span id={`${id}-label`} className={cn('text-sm leading-5 font-medium', error ? 'text-destructive' : 'text-foreground')}>{label}</span>
      <div className={cn('flex h-[var(--control-height)] min-w-0 items-center gap-2 rounded-md border bg-background pr-3 pl-1 shadow-xs', error ? 'border-destructive' : 'border-input', disabled && 'opacity-50')}>
        <Button
          id={`${id}-btn`}
          variant="secondary"
          size="sm"
          disabled={disabled}
          aria-labelledby={`${id}-label ${id}-btn`}
          aria-describedby={[file ? `${id}-name` : `${id}-empty`, described].filter(Boolean).join(' ')}
          aria-invalid={error ? true : undefined}
          onClick={() => inputRef.current?.click()}
          className="shrink-0 shadow-none"
        >
          Choose file
        </Button>
        {file ? (
          <>
            <span id={`${id}-name`} title={file.name} className="min-w-0 flex-1 truncate text-sm leading-5 text-foreground">{file.name}{file.size ? ` · ${file.size}` : ''}</span>
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              disabled={disabled}
              onClick={() => onChange?.(null)}
              className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4"
            >
              <X aria-hidden="true" />
            </button>
          </>
        ) : (
          <span id={`${id}-empty`} className="min-w-0 flex-1 truncate text-sm leading-5 text-muted-foreground">No file chosen</span>
        )}
      </div>
      {error ? <p id={described} className="m-0 text-sm leading-5 text-destructive">{error}</p> : hint ? <p id={described} className="m-0 text-xs leading-4 text-muted-foreground">{hint}</p> : null}
      <input ref={inputRef} type="file" tabIndex={-1} aria-hidden="true" className="sr-only" accept={accept} disabled={disabled} onChange={e => { onChange?.(e.target.files?.[0] ?? null); e.target.value = ''; }} />
    </div>
  );
}

export { FileDropzone, FileField, FileItem, FilePreview, FileTypeIcon, ResourceItem };
