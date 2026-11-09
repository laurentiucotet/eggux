// EGG UI Audit page: Change Item (180:588), Version Item (438:2096), Release Note Item (438:2159)
// and Release Note Line (550:81418).
// Change Item: one changed field: the field (120, ui/caption muted), the old value on muted, an
// arrow, the new value on accent (each max 240, truncating); wraps 4 / 12. "(empty)" for no old
// value, •••• for masked values. Screen readers hear "Due date: 7 Oct 2026 to 21 Oct 2026".
// Version Item: who (24 avatar), version (ui/label) with a Current badge, meta (ui/caption muted),
// the summary; 12 padding, radius md. Selected previews it on accent; Restore (outline sm) on past
// and selected versions, never on the current one. The version name is a button that selects it.
// Release Note Item: type Badge (New info, Improved secondary, Fixed success), version and date,
// the title (body/large), text (body/small muted), optional image, a Changes list of Release Note
// Lines and a "Read more" link; 24 padding top and bottom, a bottom border.
import * as React from 'react';
import { ArrowRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge, type BadgeProps } from './badge';
import { Button } from './button';

/* Change Item */

export interface ChangeItemProps extends React.ComponentProps<'div'> {
  field: string;
  from?: string | null;
  to?: string | null;
  /** Masks both values (••••): passwords, keys, account numbers. */
  sensitive?: boolean;
}

function ChangeItem({ field, from, to, sensitive = false, className, ...props }: ChangeItemProps) {
  const show = (v?: string | null) => (sensitive ? '••••' : v ? v : '(empty)');
  const oldText = show(from);
  const newText = show(to);
  return (
    <div data-slot="change-item" className={cn('flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1', className)} {...props}>
      <span className="w-[120px] shrink-0 truncate text-xs leading-4 text-muted-foreground">
        {field}<span className="sr-only">: {sensitive ? 'changed (hidden)' : `${oldText} to ${newText}`}</span>
      </span>
      <span aria-hidden="true" title={oldText} className="max-w-60 truncate rounded-sm bg-muted px-1.5 py-0.5 text-sm leading-5 text-foreground">{oldText}</span>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <span aria-hidden="true" title={newText} className="max-w-60 truncate rounded-sm bg-accent px-1.5 py-0.5 text-sm leading-5 text-accent-foreground">{newText}</span>
    </div>
  );
}

/* Version Item */

export interface VersionItemProps extends Omit<React.ComponentProps<'li'>, 'onSelect'> {
  version: string;
  meta: string;
  summary?: string;
  initials?: string;
  avatar?: string;
  current?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onRestore?: () => void;
}

function VersionItem({ version, meta, summary, initials, avatar, current = false, selected = false, onSelect, onRestore, className, ...props }: VersionItemProps) {
  return (
    <li
      data-slot="version-item"
      data-state={current ? 'current' : selected ? 'selected' : 'past'}
      className={cn(
        'relative flex w-full min-w-0 list-none items-start gap-3 rounded-md p-3 has-[button[data-slot=version-select]:focus-visible]:ring-[3px] has-[button[data-slot=version-select]:focus-visible]:ring-ring/50',
        selected ? 'bg-accent' : 'hover:bg-accent',
        className,
      )}
      {...props}
    >
      <Avatar size="sm" initials={initials} src={avatar} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            data-slot="version-select"
            aria-pressed={selected}
            onClick={onSelect}
            className="min-w-0 flex-1 truncate text-left text-sm leading-5 font-medium text-foreground outline-none after:absolute after:inset-0 after:content-['']"
          >
            {version}
          </button>
          {current ? <Badge variant="secondary" className="max-w-32">Current</Badge> : null}
        </div>
        {/* Muted on the accent fill is under 4.5:1: the filled-muted token when selected. */}
        <span className={cn('truncate text-xs leading-4', selected ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>{meta}</span>
        {summary ? <span className="line-clamp-2 text-sm leading-5 text-foreground">{summary}</span> : null}
      </div>
      {!current && onRestore ? (
        <Button variant="outline" size="sm" className="relative z-10 shrink-0" onClick={onRestore}>
          Restore<span className="sr-only"> {version}</span>
        </Button>
      ) : null}
    </li>
  );
}

/* Release notes */

export type ReleaseType = 'new' | 'improved' | 'fixed';
const typeBadge: Record<ReleaseType, { label: string; variant: NonNullable<BadgeProps['variant']> }> = {
  new: { label: 'New', variant: 'info' },
  improved: { label: 'Improved', variant: 'secondary' },
  fixed: { label: 'Fixed', variant: 'success' },
};

export interface ReleaseNoteLineProps extends React.ComponentProps<'li'> {
  type: ReleaseType;
}

function ReleaseNoteLine({ type, className, children, ...props }: ReleaseNoteLineProps) {
  const b = typeBadge[type];
  return (
    <li data-slot="release-note-line" className={cn('flex min-w-0 list-none items-start gap-3', className)} {...props}>
      <Badge variant={b.variant} className="mt-0.5 shrink-0">{b.label}</Badge>
      <span className="min-w-0 flex-1 text-sm leading-5 text-foreground">{children}</span>
    </li>
  );
}

export interface ReleaseNoteItemProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  type: ReleaseType;
  /** "v2.14 · 12 Oct 2026". */
  meta: string;
  title: string;
  text?: React.ReactNode;
  image?: React.ReactNode;
  /** Release Note Lines. */
  changes?: React.ReactNode;
  href?: string;
  headingLevel?: 2 | 3;
}

function ReleaseNoteItem({ type, meta, title, text, image, changes, href, headingLevel = 3, className, ...props }: ReleaseNoteItemProps) {
  const id = React.useId();
  const Heading = `h${headingLevel}` as 'h3';
  const b = typeBadge[type];
  return (
    <article data-slot="release-note-item" data-type={type} aria-labelledby={id} className={cn('flex w-full min-w-0 flex-col items-start gap-3 border-b border-border py-6', className)} {...props}>
      <div className="flex w-full min-w-0 items-center gap-2">
        <Badge variant={b.variant} className="shrink-0">{b.label}</Badge>
        <span className="min-w-0 flex-1 truncate text-xs leading-4 text-muted-foreground">{meta}</span>
      </div>
      <Heading id={id} className="m-0 text-lg leading-7 font-semibold text-foreground">{title}</Heading>
      {text ? <p className="m-0 text-sm leading-5 text-muted-foreground">{text}</p> : null}
      {image ? <div className="w-full overflow-hidden rounded-lg">{image}</div> : null}
      {changes ? <ul className="m-0 flex w-full flex-col gap-2 p-0">{changes}</ul> : null}
      {href ? (
        <Button asChild variant="link" size="sm" className="h-8">
          <a href={href}>Read more<span className="sr-only"> about {title}</span><ArrowRight aria-hidden="true" /></a>
        </Button>
      ) : null}
    </article>
  );
}

export { ChangeItem, ReleaseNoteItem, ReleaseNoteLine, VersionItem };
