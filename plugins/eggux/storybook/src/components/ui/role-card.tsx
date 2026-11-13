// EGG UI Role Card. Code only (no Figma component yet); family Access.
// One role in a roles list: its name (a heading, level set by `titleAs`), a Role Badge for the kind,
// a short description, how many people have it, a summary of what it can do (up to `maxSummary`
// areas with their level, then "+3 more") and the actions Edit and Duplicate. A System role is
// defined by the product: it shows the lock, Edit is disabled with the reason in text under the
// actions, Duplicate stays (a copy can be edited). The card is an article, 280 to 480 wide; the name
// and description truncate or clamp, the summary wraps, the actions wrap under 276.
// A11y: article named by its heading; actions are named with the role ("Edit Billing admin");
// member count is plain text ("12 members"); a disabled Edit keeps its reason in aria-describedby.
import * as React from 'react';
import { Copy, Lock, Pencil, Users } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';

export interface RolePermissionSummary {
  /** The area ("Billing"). */
  area: string;
  /** What the role can do there ("Manage", "View", "None"). */
  level: string;
}

export interface RoleCardProps extends Omit<React.ComponentProps<'article'>, 'children' | 'title'> {
  name: string;
  description?: string;
  /** People who have the role. */
  members: number;
  summary?: RolePermissionSummary[];
  /** How many areas show before "+N more". Default 4. */
  maxSummary?: number;
  /** A role the product defines: locked, cannot be edited. */
  system?: boolean;
  /** Heading level of the name. Default h3. */
  titleAs?: 'h2' | 'h3' | 'h4';
  onEdit?: () => void;
  onDuplicate?: () => void;
}

function RoleCard({
  name,
  description,
  members,
  summary = [],
  maxSummary = 4,
  system = false,
  titleAs: Title = 'h3',
  onEdit,
  onDuplicate,
  className,
  ...props
}: RoleCardProps) {
  const reasonId = React.useId();
  const shown = summary.slice(0, maxSummary);
  const more = summary.length - shown.length;
  return (
    <article
      data-slot="role-card"
      data-system={system || undefined}
      className={cn('flex min-w-0 max-w-120 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <header className="flex min-w-0 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <Title title={name} className="min-w-0 flex-1 truncate text-base leading-6 font-semibold">{name}</Title>
          {system ? <Badge variant="soft-neutral" className="shrink-0"><Lock aria-hidden="true" className="size-3" />System role</Badge> : null}
        </div>
        {description ? <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">{description}</p> : null}
      </header>

      <p data-slot="role-members" className="flex items-center gap-1.5 text-sm leading-5 text-muted-foreground">
        <Users aria-hidden="true" className="size-4 shrink-0" />
        <span>{members === 1 ? '1 member' : `${members.toLocaleString('en')} members`}</span>
      </p>

      {summary.length ? (
        <ul data-slot="role-summary" aria-label={`What ${name} can do`} className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {shown.map(s => (
            <li key={s.area} className="min-w-0 max-w-full">
              <Badge variant="outline" className="max-w-full">
                <span className="truncate">{s.area}: {s.level}</span>
              </Badge>
            </li>
          ))}
          {more > 0 ? (
            <li>
              <Badge variant="secondary">+{more} more</Badge>
            </li>
          ) : null}
        </ul>
      ) : null}

      <div data-slot="role-actions" className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          leadingIcon={system ? <Lock aria-hidden="true" /> : <Pencil aria-hidden="true" />}
          disabled={system}
          aria-describedby={system ? reasonId : undefined}
          aria-label={`Edit ${name}`}
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button variant="ghost" size="sm" leadingIcon={<Copy aria-hidden="true" />} aria-label={`Duplicate ${name}`} onClick={onDuplicate}>
          Duplicate
        </Button>
      </div>
      {system ? (
        <p id={reasonId} className="text-xs leading-4 text-muted-foreground">System roles cannot be edited. Duplicate it to make your own version.</p>
      ) : null}
    </article>
  );
}

export { RoleCard };
