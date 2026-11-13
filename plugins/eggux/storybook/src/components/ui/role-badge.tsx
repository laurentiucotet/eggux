// EGG UI Role Badge. Code only (no Figma component yet); family Access.
// A small label for the role someone has: Owner, Admin, Editor, Member, Viewer, Guest, or the name of
// a custom role. Built on Badge (soft tones). Each built-in role has its own tone AND an icon, so the
// role is never told by color alone; a custom role is neutral. `system` adds a lock for roles the
// product defines and nobody can edit. Size sm 16, default 20, lg 24 (Badge sizes). The label
// truncates past 256 px (Badge) and the badge never shrinks in a row.
// A11y: plain text in a span; the icon is decorative; the lock reads as "System role" after the name.
import * as React from 'react';
import { Eye, Lock, Pencil, ShieldCheck, User, UserCheck } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from './badge';

export type BuiltInRole = 'owner' | 'admin' | 'editor' | 'member' | 'viewer' | 'guest';

const builtIn: Record<BuiltInRole, { label: string; variant: NonNullable<BadgeProps['variant']>; icon: React.ReactNode }> = {
  owner: { label: 'Owner', variant: 'soft-info', icon: <ShieldCheck /> },
  admin: { label: 'Admin', variant: 'soft-destructive', icon: <UserCheck /> },
  editor: { label: 'Editor', variant: 'soft-success', icon: <Pencil /> },
  member: { label: 'Member', variant: 'soft-neutral', icon: <User /> },
  viewer: { label: 'Viewer', variant: 'soft-neutral', icon: <Eye /> },
  guest: { label: 'Guest', variant: 'soft-warning', icon: <User /> },
};

export interface RoleBadgeProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** A built-in role, or any other text for a custom role. */
  role: BuiltInRole | (string & {});
  /** Replaces the built-in label ("Billing admin"). */
  label?: string;
  /** A role the product defines and people cannot edit: adds a lock. */
  system?: boolean;
  size?: 'sm' | 'default' | 'lg';
  /** Hide the role icon. */
  showIcon?: boolean;
}

function RoleBadge({ role, label, system = false, size = 'default', showIcon = true, className, ...props }: RoleBadgeProps) {
  const preset = (builtIn as Record<string, (typeof builtIn)[BuiltInRole]>)[role];
  const text = label ?? preset?.label ?? role;
  return (
    <Badge
      data-slot="role-badge"
      data-role={role}
      data-system={system || undefined}
      variant={preset?.variant ?? 'soft-neutral'}
      size={size}
      className={cn('min-w-0 max-w-full', className)}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-1">
        {showIcon ? <span aria-hidden="true" className="flex shrink-0 [&_svg]:size-3">{preset?.icon ?? <User />}</span> : null}
        <span className="min-w-0 truncate">{text}</span>
        {system ? (
          <>
            <Lock aria-hidden="true" className="size-3 shrink-0" />
            <span className="sr-only">, system role</span>
          </>
        ) : null}
      </span>
    </Badge>
  );
}

export { RoleBadge };
