// EGG UI rich table cell contents. Figma: Table page, "Table Cell / Component" section: Table Cell
// User (55:148), Table Cell Progress (245:2336), Table Cell File (417:4942), Table Cell Badges
// (417:4947), Table Cell Avatars (417:4986), Table Cell Media (1097:95514). Put them in a TableCell
// (table.tsx). Text stays on one line and truncates.
// User: 32 avatar, name (ui/label) over email (ui/caption muted), 12 gap.
// Progress: a 96 wide bar and the number as text (body/small muted), so the value reads without
// the bar, 12 gap. File: 16 type icon, the name truncating in the middle (full name in a title), the
// size (ui/caption muted), 8 gap. Badges: a Badge List (2-3 tags and +N). Avatars: an Avatar Group
// sm (3 and +N). Media: a 32 Thumbnail, title (ui/label) over one line of meta (ui/caption muted).
import * as React from 'react';
import { FileText } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { BadgeList, type BadgeListItem } from './badge-list';
import { Progress } from './progress';
import { Thumbnail } from './thumbnail';

export interface TableCellUserProps extends React.ComponentProps<'div'> {
  name: string;
  email?: string;
  initials?: string;
  src?: string;
}

function TableCellUser({ name, email, initials, src, className, ...props }: TableCellUserProps) {
  return (
    <div data-slot="table-cell-user" className={cn('flex min-w-0 items-center gap-3', className)} {...props}>
      <Avatar initials={initials} src={src} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
        <span title={name} className="truncate text-sm leading-5 font-medium text-foreground">{name}</span>
        {email ? <span title={email} className="truncate text-xs leading-4 text-muted-foreground">{email}</span> : null}
      </div>
    </div>
  );
}

export interface TableCellProgressProps extends React.ComponentProps<'div'> {
  /** 0 to 100, whole percents. */
  value: number;
  /** The bar's name: what is progressing ("Onboarding for Northwind"). */
  label: string;
  /** The number next to the bar; default "75%". */
  valueText?: string;
}

function TableCellProgress({ value, label, valueText, className, ...props }: TableCellProgressProps) {
  const v = Math.round(Math.max(0, Math.min(100, value)));
  return (
    <div data-slot="table-cell-progress" className={cn('flex min-w-0 items-center gap-3', className)} {...props}>
      <Progress value={v} aria-label={label} className="w-24 shrink-0" />
      <span className="shrink-0 text-sm leading-5 whitespace-nowrap text-muted-foreground tabular-nums">{valueText ?? `${v}%`}</span>
    </div>
  );
}

export interface TableCellFileProps extends React.ComponentProps<'div'> {
  name: string;
  size?: string;
  icon?: React.ReactNode;
}

/** Splits "contract-northwind-2026.pdf" so the end ("2026.pdf") stays visible when the name truncates. */
const splitName = (name: string) => {
  const keep = Math.min(10, Math.max(0, name.length - 4));
  return [name.slice(0, name.length - keep), name.slice(name.length - keep)] as const;
};

function TableCellFile({ name, size, icon, className, ...props }: TableCellFileProps) {
  const [start, end] = splitName(name);
  return (
    <div data-slot="table-cell-file" className={cn('flex min-w-0 items-center gap-2', className)} {...props}>
      <span aria-hidden="true" className="flex shrink-0 text-muted-foreground [&_svg]:size-4">{icon ?? <FileText />}</span>
      <span title={name} className="flex min-w-0 flex-1 text-sm leading-5 whitespace-nowrap text-foreground">
        <span className="min-w-0 truncate">{start}</span>
        <span className="shrink-0">{end}</span>
      </span>
      {size ? <span className="shrink-0 text-xs leading-4 whitespace-nowrap text-muted-foreground">{size}</span> : null}
    </div>
  );
}

export interface TableCellBadgesProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  items: (string | BadgeListItem)[];
  max?: number;
  label?: string;
}

function TableCellBadges({ items, max = 3, label = 'Tags', className, ...props }: TableCellBadgesProps) {
  return (
    <div data-slot="table-cell-badges" className={cn('flex min-w-0 items-center', className)} {...props}>
      <BadgeList items={items} max={max} label={label} className="[&>ul]:flex-nowrap [&>ul]:overflow-hidden" />
    </div>
  );
}

export interface TableCellAvatarsProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  people: { name: string; initials?: string; src?: string }[];
  max?: number;
}

function TableCellAvatars({ people, max = 3, className, ...props }: TableCellAvatarsProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div data-slot="table-cell-avatars" className={cn('flex min-w-0 items-center', className)} {...props}>
      <AvatarGroup size="sm" more={rest} moreLabel={`Show ${rest} more`} moreTooltip={people.slice(max).map(p => p.name).join(', ')}>
        {shown.map(p => <Avatar key={p.name} name={p.name} initials={p.initials} src={p.src} />)}
      </AvatarGroup>
    </div>
  );
}

export interface TableCellMediaProps extends React.ComponentProps<'div'> {
  title: string;
  meta?: string;
  src?: string;
  /** Fallback icon of the Thumbnail. */
  icon?: React.ReactNode;
}

function TableCellMedia({ title, meta, src, icon, className, ...props }: TableCellMediaProps) {
  return (
    <div data-slot="table-cell-media" className={cn('flex min-w-40 items-center gap-3', className)} {...props}>
      <Thumbnail size="sm" src={src} icon={icon} />
      <div className="flex min-w-24 flex-1 flex-col gap-0.5 whitespace-nowrap">
        <span title={title} className="truncate text-sm leading-5 font-medium text-foreground">{title}</span>
        {meta ? <span title={meta} className="truncate text-xs leading-4 text-muted-foreground">{meta}</span> : null}
      </div>
    </div>
  );
}

export { TableCellAvatars, TableCellBadges, TableCellFile, TableCellMedia, TableCellProgress, TableCellUser };
