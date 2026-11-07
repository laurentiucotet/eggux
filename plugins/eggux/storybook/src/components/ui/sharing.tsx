// EGG UI Sharing page: Access Row (444:811), Invite Row (444:812), Share Link Row (444:861).
// Access Row: one person or group with access: a 32 avatar, name (ui/label) over email (ui/caption
// muted), both truncating (min 320), and the role: a 132 Select (editable, pending) or "Owner" as
// muted text. Pending: the invited address with an "Invited" secondary Badge and when it was sent.
// Owner first, then you, then A-Z; changes save at once with a toast (the app's job). 8 px rows.
// Invite Row: an input for emails (several pasted at once), a 120 role Select and Invite, 8 apart.
// Share Link Row: a 32 round icon (lock on muted for restricted, globe on success for anyone), the
// reach in plain words with a caption, and Copy link (outline sm, says "Copied" for 2 s).
// A11y: role Selects are named "Role for Maria Ilie"; the invite input is labelled; Copy link
// announces the copy in a live region.
import * as React from 'react';
import { Check, Globe, Link, Lock, Users } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';

export interface RoleOption { value: string; label: string }

const defaultRoles: RoleOption[] = [
  { value: 'view', label: 'Can view' },
  { value: 'comment', label: 'Can comment' },
  { value: 'edit', label: 'Can edit' },
];

export interface AccessRowProps extends Omit<React.ComponentProps<'li'>, 'onChange'> {
  name: string;
  /** Email, or for pending invites when it was sent ("Invited 2 days ago"). */
  detail?: string;
  initials?: string;
  avatar?: string;
  type?: 'editable' | 'owner' | 'pending';
  role?: string;
  roles?: RoleOption[];
  onRoleChange?: (role: string) => void;
}

function AccessRow({ name, detail, initials, avatar, type = 'editable', role = 'edit', roles = defaultRoles, onRoleChange, className, ...props }: AccessRowProps) {
  return (
    <li data-slot="access-row" data-type={type} className={cn('flex min-w-80 list-none items-center gap-3 py-2', className)} {...props}>
      <Avatar initials={initials} src={avatar} />
      <div className="flex min-w-32 flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-2">
          <span title={name} className="min-w-0 flex-1 truncate text-sm leading-5 font-medium text-foreground">{name}</span>
          {type === 'pending' ? <Badge variant="secondary">Invited</Badge> : null}
        </div>
        {detail ? <span title={detail} className="truncate text-xs leading-4 text-muted-foreground">{detail}</span> : null}
      </div>
      {type === 'owner' ? (
        <span className="shrink-0 text-sm leading-5 text-muted-foreground">Owner</span>
      ) : (
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger aria-label={`Role for ${name}`} className="w-[132px] shrink-0" />
          <SelectContent align="end">
            {roles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
    </li>
  );
}

export interface InviteRowProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  onInvite?: (emails: string[], role: string) => void;
  roles?: RoleOption[];
  defaultRole?: string;
  placeholder?: string;
  label?: string;
}

function InviteRow({ onInvite, roles = defaultRoles, defaultRole = 'view', placeholder = 'Add people or groups by email', label = 'People to invite', className, ...props }: InviteRowProps) {
  const [value, setValue] = React.useState('');
  const [role, setRole] = React.useState(defaultRole);
  const emails = value.split(/[\s,;]+/).map(e => e.trim()).filter(Boolean);
  return (
    <form
      data-slot="invite-row"
      className={cn('flex min-w-0 items-center gap-2', className)}
      onSubmit={e => {
        e.preventDefault();
        if (!emails.length) return;
        onInvite?.(emails, role);
        setValue('');
      }}
      {...props}
    >
      <input
        type="text"
        inputMode="email"
        autoComplete="off"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className="h-[var(--control-height)] min-w-0 flex-1 rounded-input border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger aria-label="Role for new people" className="w-[120px] shrink-0" />
        <SelectContent align="end">
          {roles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!emails.length}>Invite</Button>
    </form>
  );
}

export type ShareAccess = 'restricted' | 'workspace' | 'anyone';

const accessCopy: Record<ShareAccess, { title: string; caption: string; icon: React.ReactNode; tile: string }> = {
  restricted: { title: 'Only people with access', caption: 'Only people added above can open it', icon: <Lock />, tile: 'bg-muted text-foreground' },
  workspace: { title: 'Everyone in the workspace', caption: 'Anyone in Acme with the link can view', icon: <Users />, tile: 'bg-muted text-foreground' },
  anyone: { title: 'Anyone with the link', caption: 'Anyone on the internet with the link can view', icon: <Globe />, tile: 'bg-success text-success-foreground' },
};

export interface ShareLinkRowProps extends React.ComponentProps<'div'> {
  access?: ShareAccess;
  url: string;
  /** Replaces the reach text with a control (a ghost Select) when people can change it here. */
  accessControl?: React.ReactNode;
  onCopy?: () => void;
}

function ShareLinkRow({ access = 'restricted', url, accessControl, onCopy, className, ...props }: ShareLinkRowProps) {
  const c = accessCopy[access];
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <div data-slot="share-link-row" data-access={access} className={cn('flex min-w-0 items-center gap-3 py-2', className)} {...props}>
      <span aria-hidden="true" className={cn('flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-4', c.tile)}>{c.icon}</span>
      <div className="flex min-w-0 flex-1 flex-col">
        {accessControl ?? <span className="text-sm leading-5 font-medium text-foreground">{c.title}</span>}
        <span className="text-xs leading-4 text-muted-foreground">{c.caption}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          try { await navigator.clipboard?.writeText(url); } catch { /* the live region still confirms */ }
          setCopied(true);
          onCopy?.();
        }}
      >
        {copied ? <Check aria-hidden="true" /> : <Link aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy link'}
      </Button>
      <span role="status" className="sr-only">{copied ? 'Link copied' : ''}</span>
    </div>
  );
}

export { AccessRow, InviteRow, ShareLinkRow };
