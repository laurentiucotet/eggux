// EGG UI more Card types, built on Card and the Card tokens (radius xl, border, card padding):
// not separate Figma components; they follow the Card page rules (one link per card, the title
// link stretched over it, other controls above it).
// - Profile Cover Card: a cover band (brand tint or an image), a 64 avatar over its edge, name,
//   role, up to three stats and two actions.
// - Task Card: a checkbox that completes the task (the title is its label), project badge, due
//   date (overdue in destructive with the word), subtask count, assignees.
// - Quick Action Card: an icon tile, title and one line; the whole card is one link with an arrow.
// - File Card: a preview (image or File Type Icon on muted), name, meta, owner and a menu.
// - Plan Card: the current plan with price and period, usage meters and Manage / Upgrade.
import * as React from 'react';
import { ArrowRight, Calendar, CircleCheck, Ellipsis } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Card } from './card';
import { Checkbox } from './checkbox';
import { FileTypeIcon, fileKindOf } from './file-upload';
import { Progress } from './progress';

const stretched = 'outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring';

/* Profile Cover Card */

export interface ProfileCoverCardProps extends Omit<React.ComponentProps<'div'>, 'role'> {
  name: string;
  role?: string;
  initials?: string;
  avatarSrc?: string;
  /** A cover picture; without it a brand tint. */
  cover?: string;
  href?: string;
  stats?: { label: string; value: string }[];
  actions?: React.ReactNode;
}

function ProfileCoverCard({ name, role, initials, avatarSrc, cover, href, stats, actions, className, ...props }: ProfileCoverCardProps) {
  return (
    <Card data-slot="profile-cover-card" className={cn('w-80 max-w-full gap-0 overflow-hidden py-0', className)} {...props}>
      <div aria-hidden="true" className="h-20 w-full bg-[var(--button-soft-bg)] bg-cover bg-center" style={cover ? { backgroundImage: `url("${cover}")` } : undefined} />
      <div className="flex flex-col gap-4 px-[var(--card-padding)] pb-[var(--card-padding)]">
        <div className="-mt-8 flex items-end justify-between gap-2">
          <Avatar size="2xl" initials={initials ?? name.split(' ').map((p) => p[0]).join('')} src={avatarSrc} className="rounded-full ring-4 ring-card" />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="m-0 truncate text-lg leading-7 font-semibold">{href ? <a href={href} className={stretched}>{name}</a> : name}</h3>
          {role ? <p className="m-0 truncate text-sm leading-5 text-muted-foreground">{role}</p> : null}
        </div>
        {stats?.length ? (
          <dl className="m-0 grid grid-cols-3 gap-2 rounded-lg bg-[var(--card-muted)] p-3">
            {stats.slice(0, 3).map((s) => (
              <div key={s.label} className="flex min-w-0 flex-col">
                <dd className="m-0 truncate text-base leading-6 font-semibold">{s.value}</dd>
                <dt className="order-first truncate text-xs leading-4 text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
        ) : null}
        {actions ? <div className="relative z-10 flex gap-2 [&>*]:flex-1">{actions}</div> : null}
      </div>
    </Card>
  );
}

/* Task Card */

export interface TaskCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: string;
  href?: string;
  done?: boolean;
  onDoneChange?: (done: boolean) => void;
  project?: string;
  /** Shown due date ("12 Nov"). */
  due?: string;
  overdue?: boolean;
  subtasks?: { done: number; total: number };
  /** Avatars of the assignees. */
  assignees?: React.ReactNode;
  priority?: 'low' | 'medium' | 'high';
}

const priorityBadge: Record<NonNullable<TaskCardProps['priority']>, 'soft-neutral' | 'soft-warning' | 'soft-destructive'> = { low: 'soft-neutral', medium: 'soft-warning', high: 'soft-destructive' };

function TaskCard({ title, href, done = false, onDoneChange, project, due, overdue, subtasks, assignees, priority, className, ...props }: TaskCardProps) {
  const id = React.useId();
  return (
    <Card data-slot="task-card" data-done={done || undefined} size="sm" className={cn('w-80 max-w-full gap-3 px-[var(--card-padding-sm)]', className)} {...props}>
      <div className="flex items-start gap-2">
        <Checkbox checked={done} onCheckedChange={(v) => onDoneChange?.(v === true)} aria-labelledby={`${id}-title`} className="relative z-10 mt-0.5" />
        <p id={`${id}-title`} className={cn('m-0 min-w-0 flex-1 text-sm leading-5 font-medium break-words', done && 'text-muted-foreground line-through')}>
          {href ? <a href={href} className={stretched}>{title}</a> : title}
        </p>
      </div>
      {(project || priority) ? (
        <div className="flex flex-wrap gap-1.5 pl-6">
          {project ? <Badge variant="category-1">{project}</Badge> : null}
          {priority ? <Badge variant={priorityBadge[priority]}>{priority[0]!.toUpperCase() + priority.slice(1)} priority</Badge> : null}
        </div>
      ) : null}
      <div className="flex items-center gap-3 pl-6 text-xs leading-4 text-muted-foreground">
        {due ? (
          <span className={cn('flex items-center gap-1', overdue && !done && 'font-medium text-destructive')}>
            <Calendar aria-hidden="true" className="size-3.5" />
            {overdue && !done ? `Overdue · ${due}` : `Due ${due}`}
          </span>
        ) : null}
        {subtasks ? (
          <span className="flex items-center gap-1">
            <CircleCheck aria-hidden="true" className="size-3.5" />
            {subtasks.done}/{subtasks.total}
            <span className="sr-only"> subtasks done</span>
          </span>
        ) : null}
        {assignees ? <span className="ml-auto flex">{assignees}</span> : null}
      </div>
    </Card>
  );
}

/* Quick Action Card */

export interface QuickActionCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
}

function QuickActionCard({ title, description, icon, href, className, ...props }: QuickActionCardProps) {
  return (
    <Card data-slot="quick-action-card" interactive size="sm" className={cn('group/qa w-full min-w-48 flex-row items-center gap-3 px-[var(--card-padding-sm)]', className)} {...props}>
      <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--button-soft-bg)] text-brand [&_svg]:size-5">{icon}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="m-0 truncate text-sm leading-5 font-medium">
          <a href={href} className={stretched}>{title}</a>
        </h3>
        {description ? <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{description}</p> : null}
      </div>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-fast)] group-hover/qa:translate-x-0.5 motion-reduce:transition-none" />
    </Card>
  );
}

/* File Card */

export interface FileCardProps extends React.ComponentProps<'div'> {
  name: string;
  meta?: string;
  href?: string;
  /** Image preview; otherwise the File Type Icon on muted. */
  preview?: string;
  owner?: { name: string; initials?: string };
  /** The More menu (a DropdownMenu with a ButtonIcon trigger); default a plain More button. */
  menu?: React.ReactNode;
}

function FileCard({ name, meta, href, preview, owner, menu, className, ...props }: FileCardProps) {
  return (
    <Card data-slot="file-card" size="sm" className={cn('w-60 max-w-full gap-0 overflow-hidden py-0', className)} {...props}>
      <div aria-hidden="true" className="flex aspect-[16/10] w-full items-center justify-center border-b border-border bg-muted bg-cover bg-center" style={preview ? { backgroundImage: `url("${preview}")` } : undefined}>
        {preview ? null : <FileTypeIcon kind={fileKindOf(name)} />}
      </div>
      <div className="flex items-start gap-2 p-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="m-0 truncate text-sm leading-5 font-medium" title={name}>{href ? <a href={href} className={stretched}>{name}</a> : name}</h3>
          <p className="m-0 flex min-w-0 items-center gap-1.5 text-xs leading-4 text-muted-foreground">
            {owner ? <Avatar size="xs" initials={owner.initials ?? owner.name.split(' ').map((p) => p[0]).join('')} name={owner.name} /> : null}
            <span className="truncate">{meta}</span>
          </p>
        </div>
        <span className="relative z-10 -mr-1">{menu ?? <ButtonIcon variant="ghost" size="xs" icon={<Ellipsis />} label={`More actions for ${name}`} />}</span>
      </div>
    </Card>
  );
}

/* Plan Card */

export interface PlanUsage {
  label: string;
  used: number;
  limit: number;
  /** Text for the value ("8 of 10"). */
  valueText?: string;
}

export interface PlanCardProps extends React.ComponentProps<'div'> {
  plan: string;
  price: string;
  period?: string;
  /** Renewal or trial line. */
  note?: string;
  usage?: PlanUsage[];
  onManage?: () => void;
  onUpgrade?: () => void;
}

function PlanCard({ plan, price, period = '/ month', note, usage, onManage, onUpgrade, className, ...props }: PlanCardProps) {
  return (
    <Card data-slot="plan-card" className={cn('w-90 max-w-full px-[var(--card-padding)]', className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="m-0 text-xs leading-4 font-medium text-muted-foreground">Current plan</p>
          <h3 className="m-0 truncate text-lg leading-7 font-semibold">{plan}</h3>
        </div>
        <p className="m-0 shrink-0 text-right">
          <span className="text-2xl leading-8 font-semibold tracking-[-0.4px]">{price}</span>
          <span className="text-sm leading-5 text-muted-foreground"> {period}</span>
        </p>
      </div>
      {note ? <p className="m-0 text-sm leading-5 text-muted-foreground">{note}</p> : null}
      {usage?.length ? (
        <div className="flex flex-col gap-3">
          {usage.map((u) => {
            const pct = Math.round((u.used / u.limit) * 100);
            return <Progress key={u.label} value={Math.min(100, pct)} label={u.label} valueText={u.valueText ?? `${u.used} of ${u.limit}`} tone={pct >= 90 ? 'warning' : 'default'} />;
          })}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onManage}>Manage plan</Button>
        {onUpgrade ? <Button size="sm" onClick={onUpgrade}>Upgrade</Button> : null}
      </div>
    </Card>
  );
}

export { FileCard, PlanCard, ProfileCoverCard, QuickActionCard, TaskCard };
