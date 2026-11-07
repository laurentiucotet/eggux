// EGG UI List page: List Item (61:94), Sortable List Item (272:1237), Task Item (444:2820), Job
// Listing (449:3499), List Group Header (1097:114215).
// List Item: a row in a content list: Leading slot (32 avatar), title (ui/label) over description
// (body/small muted), both truncating, Trailing slot (Badge, chevron); 12 / 8 padding, 12 gap,
// radius md, 58 high. Hover muted, selected accent, disabled 50%, divider under every row but the
// last (muted text on the selected accent uses input-filled-muted-foreground for 4.5:1). With href (or onSelect) the whole row is one link (or button) through the title.
// Sortable List Item: drag handle, optional 48 image, label (1 line) and description (2 lines),
// Trailing slot; 8 padding, 12 gap; dragging lifts with border and shadow lg (pointer drag on the
// grip, or Space + arrows); drop-target shows a
// primary line. Keyboard: Space on the handle picks up, arrows move, Space drops, Escape cancels; a
// live region says the new position.
// Task Item: checkbox, title (body/small) over the due date (ui/caption; overdue in destructive),
// a 20 assignee avatar; done is struck through in muted. 8 padding, 12 gap, 54 high.
// Job Listing: title (h4, the row's link) with a New badge, team · type · mode, location and posted
// date with icons, salary and an outline Apply on the right; wraps under 480. 16 padding, border.
// List Group Header: label (ui/label-small, max 280) with an optional count and a link action;
// default (no fill, muted label) or muted (muted fill with top and bottom borders); sticky.
import * as React from 'react';
import { Clock, GripVertical, MapPin } from '@/components/icons';
import { usePointerReorder } from './use-pointer-reorder';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { BadgeCount } from './badge-count';
import { Button } from './button';
import { Checkbox } from './checkbox';

/* List Item */

export interface ListItemProps extends Omit<React.ComponentProps<'li'>, 'title' | 'onSelect'> {
  title: string;
  description?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  onSelect?: () => void;
  selected?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

function ListItem({ title, description, leading, trailing, href, onSelect, selected = false, disabled = false, divider = false, className, ...props }: ListItemProps) {
  const stretch = "outline-none after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50";
  const titleEl = href && !disabled ? (
    <a href={href} aria-current={selected ? 'true' : undefined} className={stretch}>{title}</a>
  ) : onSelect ? (
    <button type="button" disabled={disabled} aria-pressed={selected} onClick={onSelect} className={cn('cursor-pointer text-left', stretch)}>{title}</button>
  ) : title;
  return (
    <li
      data-slot="list-item"
      data-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        'relative flex min-w-0 list-none items-center gap-3 rounded-md px-3 py-2',
        (href || onSelect) && !disabled && 'hover:bg-muted',
        selected && 'bg-accent text-accent-foreground hover:bg-accent',
        disabled && 'opacity-50',
        divider && 'rounded-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border',
        className,
      )}
      {...props}
    >
      {leading ? <div className="flex shrink-0 items-center">{leading}</div> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm leading-5 whitespace-nowrap">
        <span title={title} className={cn('truncate font-medium', selected ? 'text-accent-foreground' : 'text-foreground')}>{titleEl}</span>
        {description ? <span title={description} className={cn('truncate', selected ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>{description}</span> : null}
      </div>
      {trailing ? <div className="relative flex shrink-0 items-center gap-2 text-muted-foreground [&_svg]:size-4">{trailing}</div> : null}
    </li>
  );
}

/* Sortable List */

export interface SortableItem { id: string; label: string; description?: string; leading?: React.ReactNode; trailing?: React.ReactNode }

export interface SortableListProps extends Omit<React.ComponentProps<'ul'>, 'onChange'> {
  items: SortableItem[];
  onReorder?: (items: SortableItem[]) => void;
  'aria-label': string;
}

function SortableList({ items: itemsProp, onReorder, className, ...props }: SortableListProps) {
  const [items, setItems] = React.useState(itemsProp);
  const [picked, setPicked] = React.useState<{ id: string; from: number } | null>(null);
  const [announce, setAnnounce] = React.useState('');
  const handles = React.useRef(new Map<string, HTMLButtonElement>());
  const focus = (id: string) => requestAnimationFrame(() => handles.current.get(id)?.focus());
  const commit = (next: SortableItem[]) => { setItems(next); onReorder?.(next); };
  const pointer = usePointerReorder({
    order: items.map(i => i.id),
    onReorder: (ids, movedId) => {
      const next = ids.map(id => items.find(i => i.id === id)!);
      const moved = next.find(i => i.id === movedId)!;
      commit(next);
      setAnnounce(`${moved.label} moved to position ${next.indexOf(moved) + 1} of ${next.length}.`);
    },
    disabled: Boolean(picked),
  });
  const onKey = (e: React.KeyboardEvent, item: SortableItem, index: number) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (picked) {
        setPicked(null);
        setAnnounce(`${item.label} dropped at position ${index + 1} of ${items.length}.`);
      } else {
        setPicked({ id: item.id, from: index });
        setAnnounce(`${item.label} picked up, position ${index + 1} of ${items.length}. Use the arrow keys to move, Space to drop.`);
      }
      return;
    }
    if (!picked || picked.id !== item.id) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      const next = items.filter(i => i.id !== item.id);
      next.splice(picked.from, 0, item);
      commit(next);
      setPicked(null);
      setAnnounce(`Move cancelled. ${item.label} is back at position ${picked.from + 1}.`);
      focus(item.id);
      return;
    }
    const delta = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
    if (!delta) return;
    e.preventDefault();
    const to = index + delta;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    next.splice(index, 1);
    next.splice(to, 0, item);
    commit(next);
    setAnnounce(`${item.label} moved to position ${to + 1} of ${items.length}.`);
    focus(item.id);
  };
  return (
    <>
      <ul ref={pointer.containerRef as React.Ref<HTMLUListElement>} data-slot="sortable-list" className={cn('m-0 flex list-none flex-col gap-1 p-0', className)} {...props}>
        {items.map((item, index) => (
          <SortableListItem
            key={item.id}
            label={item.label}
            description={item.description}
            leading={item.leading}
            trailing={item.trailing}
            data-reorder-id={item.id}
            dragging={picked?.id === item.id || pointer.dragId === item.id}
            dropTarget={pointer.overIndex === index && pointer.dragId !== null ? 'before' : pointer.overIndex === items.length && index === items.length - 1 && pointer.dragId !== null ? 'after' : false}
            gripProps={pointer.gripProps(item.id)}
            handleRef={el => { if (el) handles.current.set(item.id, el); else handles.current.delete(item.id); }}
            onHandleKeyDown={e => onKey(e, item, index)}
          />
        ))}
      </ul>
      <span role="status" aria-live="assertive" className="sr-only">{announce}</span>
    </>
  );
}

export interface SortableListItemProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  label: string;
  description?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  dragging?: boolean;
  /** Drop indicator line before or after the row. */
  dropTarget?: boolean | 'before' | 'after';
  /** Pointer handlers for the grip (usePointerReorder). */
  gripProps?: React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties };
  handleRef?: React.Ref<HTMLButtonElement>;
  onHandleKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
}

function SortableListItem({ label, description, leading, trailing, dragging = false, dropTarget = false, gripProps, handleRef, onHandleKeyDown, className, ...props }: SortableListItemProps) {
  return (
    <li data-slot="sortable-list-item" data-dragging={dragging || undefined} className={cn('relative flex min-w-0 list-none flex-col', className)} {...props}>
      {dropTarget ? <span aria-hidden="true" data-slot="drop-indicator" className={cn('absolute inset-x-0 h-0.5 rounded-full bg-primary', dropTarget === 'after' ? '-bottom-0.5' : '-top-0.5')} /> : null}
      <div className={cn('flex min-w-0 items-center gap-3 rounded-md p-2', dragging ? 'border border-border bg-card shadow-lg' : 'hover:bg-muted')}>
        <button
          ref={handleRef}
          type="button"
          aria-label={`Reorder ${label}`}
          aria-pressed={dragging}
          onKeyDown={onHandleKeyDown}
          {...(gripProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className="flex size-4 shrink-0 cursor-grab active:cursor-grabbing items-center justify-center rounded-sm text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4"
        >
          <GripVertical aria-hidden="true" />
        </button>
        {leading ? <div className="flex shrink-0">{leading}</div> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm leading-5">
          <span title={label} className="truncate font-medium text-foreground">{label}</span>
          {description ? <span className="line-clamp-2 text-muted-foreground">{description}</span> : null}
        </div>
        {trailing ? <div className="flex shrink-0 items-center gap-2">{trailing}</div> : null}
      </div>
    </li>
  );
}

/* Task Item */

export interface TaskItemProps extends Omit<React.ComponentProps<'li'>, 'title'> {
  title: string;
  /** "Due 14 Nov", or "Overdue · was due 10 Nov". */
  due?: string;
  done?: boolean;
  overdue?: boolean;
  onDoneChange?: (done: boolean) => void;
  assignee?: { name: string; initials?: string; src?: string };
  action?: React.ReactNode;
}

function TaskItem({ title, due, done = false, overdue = false, onDoneChange, assignee, action, className, ...props }: TaskItemProps) {
  const id = React.useId();
  return (
    <li data-slot="task-item" data-done={done || undefined} className={cn('flex min-w-0 list-none items-start gap-3 rounded-md p-2 hover:bg-muted', className)} {...props}>
      <Checkbox checked={done} onCheckedChange={v => onDoneChange?.(v === true)} aria-labelledby={`${id}-title`} aria-describedby={due ? `${id}-due` : undefined} className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span id={`${id}-title`} className={cn('text-sm leading-5 [overflow-wrap:anywhere]', done ? 'text-muted-foreground line-through' : 'text-foreground')}>{title}</span>
        {due ? <span id={`${id}-due`} className={cn('truncate text-xs leading-4', overdue && !done ? 'text-destructive' : 'text-muted-foreground')}>{due}</span> : null}
      </div>
      {action ? <div className="flex shrink-0">{action}</div> : null}
      {assignee ? <Avatar size="xs" initials={assignee.initials} src={assignee.src} name={assignee.name} /> : null}
    </li>
  );
}

/* Job Listing */

export interface JobListingProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  title: string;
  href: string;
  /** "Finance · Full-time · Hybrid". */
  meta?: string;
  location?: string;
  posted?: string;
  salary?: string;
  isNew?: boolean;
  applyHref?: string;
  headingLevel?: 2 | 3 | 4;
}

function JobListing({ title, href, meta, location, posted, salary, isNew = false, applyHref, headingLevel = 3, className, ...props }: JobListingProps) {
  const Heading = `h${headingLevel}` as 'h3';
  return (
    <article data-slot="job-listing" className={cn('relative flex w-full min-w-0 flex-wrap items-start gap-x-4 gap-y-3 border-b border-border p-4 hover:bg-muted/50 has-[a[data-slot=job-link]:focus-visible]:ring-[3px] has-[a[data-slot=job-link]:focus-visible]:ring-ring/50', className)} {...props}>
      <div className="flex min-w-60 flex-1 flex-col gap-2">
        <div className="flex w-full min-w-0 items-center gap-2">
          <Heading className="m-0 min-w-0 flex-1 truncate text-xl leading-7 font-semibold tracking-tight text-foreground">
            <a data-slot="job-link" href={href} className="outline-none after:absolute after:inset-0 after:content-['']">{title}</a>
          </Heading>
          {isNew ? <Badge variant="success">New</Badge> : null}
        </div>
        {meta ? <p className="m-0 truncate text-sm leading-5 text-muted-foreground">{meta}</p> : null}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs leading-4 text-muted-foreground [&_svg]:size-3.5 [&_svg]:shrink-0">
          {location ? <span className="flex max-w-[200px] items-center gap-1"><MapPin aria-hidden="true" /><span className="truncate">{location}</span></span> : null}
          {posted ? <span className="flex max-w-[200px] items-center gap-1"><Clock aria-hidden="true" /><span className="truncate">{posted}</span></span> : null}
        </div>
      </div>
      <div className="relative z-10 flex shrink-0 flex-col items-end gap-2">
        {salary ? <span className="max-w-56 truncate text-sm leading-5 font-medium text-foreground">{salary}</span> : null}
        <Button variant="outline" size="sm" asChild><a href={applyHref ?? `${href}#apply`} aria-label={`Apply for ${title}`}>Apply</a></Button>
      </div>
    </article>
  );
}

/* List Group Header */

export interface ListGroupHeaderProps extends React.ComponentProps<'div'> {
  label: string;
  variant?: 'default' | 'muted';
  count?: number;
  action?: React.ReactNode;
  /** The label's element; a heading level when the groups are sections. */
  as?: 'h2' | 'h3' | 'h4' | 'div';
  sticky?: boolean;
}

function ListGroupHeader({ label, variant = 'default', count, action, as: As = 'h3', sticky = false, className, ...props }: ListGroupHeaderProps) {
  return (
    <div
      data-slot="list-group-header"
      data-variant={variant}
      className={cn(
        'flex min-h-8 w-full min-w-0 items-center gap-2 px-3 py-1.5',
        variant === 'muted' && 'border-y border-border bg-muted',
        sticky && 'sticky top-0 z-10',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-[120px] flex-1 items-center gap-2">
        <As title={label} className={cn('m-0 max-w-[280px] truncate text-xs leading-4 font-medium', variant === 'muted' ? 'text-foreground' : 'text-muted-foreground')}>{label}</As>
        {count != null ? <BadgeCount variant="secondary" count={count} /> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
    </div>
  );
}

export { JobListing, ListGroupHeader, ListItem, SortableList, SortableListItem, TaskItem };
