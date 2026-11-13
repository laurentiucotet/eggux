// EGG UI Team Member Row. Code only (no Figma component yet); family Access.
// One person on a team: avatar, name and email, a role Select (Access Level Select), a status badge
// (Active, Invited, Suspended) and an actions menu (Dropdown Menu items passed as `menu`). The owner
// row is locked: the role is plain text with a lock, there is no menu, and the reason is read to
// screen readers. Layout "list" is a bordered row for a list of people; "table" is a borderless row
// with fixed role and status columns from 512 px of row width, for rows stacked under column heads.
// Under that width the row wraps: person on the first line, role, status and menu on the second,
// down to 276 px. The row is an <li>: put it in a <ul> (or role="list").
// A11y: the role select is named "Role of <name>", the menu button "More actions for <name>",
// the status is text (the dot is decoration), the locked role says why it cannot change.
import * as React from 'react';
import { Ellipsis, Lock } from '@/components/icons';
import { cn } from '@/lib/utils';
import { AccessLevelSelect, type AccessLevel } from './access-level-select';
import { Avatar } from './avatar';
import { Badge, type BadgeProps } from './badge';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';

export type TeamMemberStatus = 'active' | 'invited' | 'suspended';
export type TeamMemberLayout = 'list' | 'table';

const statusBadge: Record<TeamMemberStatus, { label: string; variant: NonNullable<BadgeProps['variant']> }> = {
  active: { label: 'Active', variant: 'soft-success' },
  invited: { label: 'Invited', variant: 'soft-info' },
  suspended: { label: 'Suspended', variant: 'soft-neutral' },
};

export const defaultTeamRoles: AccessLevel[] = [
  { value: 'admin', label: 'Admin', description: 'Manage people, settings and integrations' },
  { value: 'member', label: 'Member', description: 'Create and edit invoices, customers and reports' },
  { value: 'viewer', label: 'Viewer', description: 'Read only' },
];

export interface TeamMemberRowProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  name: string;
  email: string;
  /** Photo URL; initials show until it loads. */
  avatar?: string;
  initials?: string;
  /** The chosen role (a `value` of `roles`). */
  role: string;
  /** Roles in the select; defaults to Admin, Member, Viewer. */
  roles?: AccessLevel[];
  onRoleChange?: (role: string) => void;
  status?: TeamMemberStatus;
  /** The owner: role is text with a lock, no menu. */
  owner?: boolean;
  /** Text of the owner role. */
  ownerLabel?: string;
  /** Dropdown Menu items (Resend invite, Suspend, Remove). Leave out to hide the menu. */
  menu?: React.ReactNode;
  /** Disables the select and the menu (while saving). */
  disabled?: boolean;
  layout?: TeamMemberLayout;
}

const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');

function TeamMemberRow({
  name,
  email,
  avatar,
  initials,
  role,
  roles = defaultTeamRoles,
  onRoleChange,
  status = 'active',
  owner = false,
  ownerLabel = 'Owner',
  menu,
  disabled = false,
  layout = 'list',
  className,
  ...props
}: TeamMemberRowProps) {
  const s = statusBadge[status];
  return (
    <li
      data-slot="team-member-row"
      data-layout={layout}
      data-status={status}
      data-owner={owner || undefined}
      className={cn(
        '@container/member flex w-full min-w-0 list-none',
        layout === 'list' ? 'rounded-lg border border-border bg-card text-card-foreground' : 'border-b border-border',
        className,
      )}
      {...props}
    >
      <div className="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 @lg/member:flex-nowrap">
        <div className="flex min-w-40 flex-1 items-center gap-3">
          <Avatar initials={initials ?? initialsOf(name)} src={avatar} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span title={name} className="truncate text-sm leading-5 font-medium text-foreground">{name}</span>
            <span title={email} className="truncate text-xs leading-4 text-muted-foreground">{email}</span>
          </span>
        </div>
        <div className="flex min-w-0 basis-full flex-wrap items-center justify-between gap-x-3 gap-y-2 @lg/member:basis-auto @lg/member:flex-none @lg/member:flex-nowrap">
          <div className={cn('w-32 shrink-0', layout === 'table' && '@lg/member:w-40')}>
            {owner ? (
              <span data-slot="team-member-owner" className="flex items-center gap-1.5 text-sm leading-5 text-foreground">
                <Lock aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                <span>{ownerLabel}</span>
                <span className="sr-only">. The owner’s role cannot be changed.</span>
              </span>
            ) : (
              <AccessLevelSelect label={`Role of ${name}`} size="sm" levels={roles} value={role} onValueChange={onRoleChange} disabled={disabled} />
            )}
          </div>
          <div className={cn('flex shrink-0 items-center gap-1', layout === 'table' && '@lg/member:w-24')}>
            <Badge variant={s.variant} dot>{s.label}</Badge>
          </div>
          {menu && !owner ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" disabled={disabled} aria-label={`More actions for ${name}`}><Ellipsis aria-hidden="true" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
            </DropdownMenu>
          ) : owner ? <span aria-hidden="true" className="size-8 shrink-0" /> : null}
        </div>
      </div>
    </li>
  );
}

export { TeamMemberRow };
