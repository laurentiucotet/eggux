// EGG UI Admin page: Integration Card (450:836), Permission Row (450:867, as a Permission Matrix
// table), API Key Row (450:868), Session Row (450:931), Org Chart Node (450:982).
// Integration Card: 320 wide card, 20 padding, radius lg; 40 logo tile (icon or letter), name
// ui/label and category caption; available = outline Connect (vendor line, optional Learn more),
// connected = Switch + Status Dot "Synced …" + ghost Settings (optional Connected badge), error =
// the same with an error Status Dot that says what failed.
// Permission Matrix: a table built like Table Cells: header row (25), group rows on
// table-row-expanded (53), permission rows (55) with name, optional description and "Changed"
// badge, one 96 wide checkbox cell per role (3 to 5); locked roles are disabled and checked; the
// role being edited is highlighted in every row.
// API Key Row (65): key tile, name with a scope badge, created / last used, masked key on muted,
// Copy and a More menu (Rename, Roll, Revoke). Session Row (63): device tile, browser and OS,
// "This device" badge on the current one (its Sign out is disabled), location · IP · last active.
// Org Chart Node: 220 card, avatar, name (2 lines), role and reports; selected = 2 px ring;
// vacant = dashed with a plus, "Open role" and role · hiring status.
import * as React from 'react';
import { Check, Ellipsis, KeyRound, Minus, Monitor, Plus, Settings, Smartphone, Users } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { CopyButton } from './copy-button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu';
import { StatusDot } from './status-dot';
import { Switch } from './switch';

/* Integration Card */

export type IntegrationStatus = 'available' | 'connected' | 'error';

export interface IntegrationCardProps extends Omit<React.ComponentProps<'article'>, 'children'> {
  name: string;
  category: string;
  /** One line on what the integration does for the user. */
  description: string;
  /** Logo icon from `@/components/icons`, or `letter` for a letter tile. */
  icon?: React.ReactNode;
  letter?: string;
  status: IntegrationStatus;
  /** available: "By Acme Pay". */
  vendor?: string;
  learnMoreHref?: string;
  onConnect?: () => void;
  /** connected / error: the switch. */
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  /** connected / error: "Synced 5 min ago", "Sync failed: token expired". */
  syncLabel?: string;
  onSettings?: () => void;
  /** connected: a Connected badge before the switch. */
  showBadge?: boolean;
}

function IntegrationCard({ name, category, description, icon, letter, status, vendor, learnMoreHref, onConnect, enabled = true, onEnabledChange, syncLabel, onSettings, showBadge = false, className, ...props }: IntegrationCardProps) {
  const id = React.useId();
  const installed = status !== 'available';
  return (
    <article data-slot="integration-card" data-status={status} aria-labelledby={id} className={cn('flex w-80 max-w-full flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground', className)} {...props}>
      <div className="flex w-full items-center gap-3">
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-sm leading-5 font-medium [&_svg]:size-5">
          {letter ?? icon}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
          <h3 id={id} className="m-0 truncate text-sm leading-5 font-medium">{name}</h3>
          <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{category}</p>
        </div>
        {installed ? (
          <>
            {showBadge && status === 'connected' ? <Badge variant="success" dot className="rounded-full">Connected</Badge> : null}
            <Switch aria-label={`${name} on`} checked={enabled} onCheckedChange={onEnabledChange} />
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={onConnect} aria-label={`Connect ${name}`}>Connect</Button>
        )}
      </div>
      <p className="m-0 line-clamp-2 text-sm leading-5 text-muted-foreground">{description}</p>
      <div className="flex w-full items-center gap-2">
        {installed ? (
          <>
            <StatusDot status={status === 'error' ? 'error' : 'success'} label={syncLabel ?? (status === 'error' ? 'Sync failed' : 'Connected')} className="min-w-0 flex-1" />
            {onSettings ? <Button variant="ghost" size="sm" leadingIcon={<Settings aria-hidden="true" />} onClick={onSettings} aria-label={`${name} settings`}>Settings</Button> : null}
          </>
        ) : (
          <>
            {vendor ? <p className="m-0 min-w-0 flex-1 text-xs leading-4 text-muted-foreground">{vendor}</p> : <span className="flex-1" />}
            {learnMoreHref ? <Button asChild variant="link" size="sm" className="h-8"><a href={learnMoreHref} aria-label={`Learn more about ${name}`}>Learn more</a></Button> : null}
          </>
        )}
      </div>
    </article>
  );
}

/* Permission Matrix (Permission Row) */

export interface PermissionRole { id: string; label: string; /** Owner: every box checked and disabled. */ locked?: boolean }
export interface Permission { id: string; title: string; description?: string; /** Unsaved change. */ changed?: boolean }
export interface PermissionMatrixProps extends Omit<React.ComponentProps<'table'>, 'onChange'> {
  /** Table caption (screen readers): "Permissions by role". */
  label: string;
  /** 3 to 5 roles. */
  roles: PermissionRole[];
  groups: { title: string; permissions: Permission[] }[];
  /** permission id → role ids that have it. */
  value: Record<string, string[]>;
  onChange?: (permissionId: string, roleId: string, granted: boolean) => void;
  /** The role being edited: its column is highlighted. */
  selectedRole?: string;
  /** A select-all checkbox in each column header (mixed when some are granted). Off by default. */
  selectAll?: boolean;
  /** Called by a column's select-all; without it, onChange runs for every permission. */
  onSelectAll?: (roleId: string, granted: boolean) => void;
  /** Cells show a check or a dash with text instead of checkboxes; no select-all. */
  readOnly?: boolean;
  /** Class of the scroll container around the table. */
  containerClassName?: string;
}

const roleCell = 'w-24 border-b border-border px-2 text-center align-middle';

function PermissionMatrix({ label, roles, groups, value, onChange, selectedRole, selectAll = false, onSelectAll, readOnly = false, containerClassName, className, ...props }: PermissionMatrixProps) {
  const sel = (r: PermissionRole) => (r.id === selectedRole ? 'bg-accent' : undefined);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [wide, setWide] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setWide(el.scrollWidth > el.clientWidth + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, []);
  const all = groups.flatMap(g => g.permissions);
  const grantedIn = (r: PermissionRole, pid: string) => r.locked || (value[pid] ?? []).includes(r.id);
  const setColumn = (r: PermissionRole, granted: boolean) => {
    if (onSelectAll) onSelectAll(r.id, granted);
    else all.forEach(p => { if (grantedIn(r, p.id) !== granted) onChange?.(p.id, r.id, granted); });
  };
  return (
    <div
      ref={scrollRef}
      data-slot="permission-matrix-scroll"
      {...(wide ? { tabIndex: 0, role: 'region', 'aria-label': label } : {})}
      className={cn('w-full overflow-x-auto rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', containerClassName)}
    >
    <table data-slot="permission-matrix" data-readonly={readOnly || undefined} className={cn('w-full min-w-[448px] border-collapse text-sm leading-5', className)} {...props}>
      <caption className="sr-only">{label}</caption>
      <thead>
        <tr data-slot="permission-row" data-type="header">
          <th scope="col" className="border-b border-border px-2 py-0.5 text-left font-medium">Permission</th>
          {roles.map(r => {
            const count = all.filter(p => grantedIn(r, p.id)).length;
            const state: boolean | 'indeterminate' = count === 0 ? false : count === all.length ? true : 'indeterminate';
            return (
              <th key={r.id} scope="col" className={cn(roleCell, 'py-0.5 font-medium', sel(r))}>
                {selectAll && !readOnly ? (
                  <span className="flex items-center justify-center gap-2">
                    <Checkbox
                      aria-label={`Select all ${r.label}`}
                      checked={state}
                      disabled={r.locked}
                      onCheckedChange={c => setColumn(r, c === true)}
                    />
                    <span className="min-w-0 truncate">{r.label}</span>
                  </span>
                ) : r.label}
              </th>
            );
          })}
        </tr>
      </thead>
      {groups.map(g => (
        <tbody key={g.title}>
          <tr data-slot="permission-row" data-type="group">
            <th scope="colgroup" colSpan={roles.length + 1} className="border-b border-border bg-[var(--table-row-expanded)] p-4 text-left font-medium">{g.title}</th>
          </tr>
          {g.permissions.map(p => (
            <tr key={p.id} data-slot="permission-row" data-type="permission">
              <th scope="row" className="min-w-40 border-b border-border px-2 py-[var(--cell-padding-y)] text-left font-normal">
                <span className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate">{p.title}</span>
                  {p.changed ? <Badge variant="outline">Changed</Badge> : null}
                </span>
                {p.description ? <span className="mt-0.5 block truncate text-xs leading-4 text-muted-foreground">{p.description}</span> : null}
              </th>
              {roles.map(r => {
                const granted = grantedIn(r, p.id);
                return (
                  <td key={r.id} className={cn(roleCell, 'py-[var(--cell-padding-y)]', sel(r))}>
                    {readOnly ? (
                      <span data-granted={granted} className={cn('mx-auto flex items-center justify-center gap-1 text-xs leading-4', granted ? 'text-foreground' : 'text-muted-foreground')}>
                        {granted ? <Check aria-hidden="true" className="size-4 shrink-0" /> : <Minus aria-hidden="true" className="size-4 shrink-0" />}
                        <span className="sr-only">{granted ? 'Granted' : 'Not granted'}</span>
                      </span>
                    ) : (
                      <Checkbox
                        aria-label={`${r.label}: ${p.title}`}
                        checked={granted}
                        disabled={r.locked}
                        onCheckedChange={c => onChange?.(p.id, r.id, c === true)}
                        className="mx-auto"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      ))}
    </table>
    </div>
  );
}

/* API Key Row */

export interface ApiKeyRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  name: string;
  /** Scope badge: "Read and write", "Read only". */
  scope?: string;
  /** "Created 12 Mar 2026 by Ana Popescu · Last used 2 hours ago". */
  meta: string;
  /** Masked key: the last 4 characters only. */
  maskedKey: string;
  /** What Copy puts on the clipboard (the key id); leave out to hide Copy. */
  copyValue?: string;
  onRename?: () => void;
  onRoll?: () => void;
  /** Confirm first and name the key. */
  onRevoke?: () => void;
}

function ApiKeyRow({ name, scope, meta, maskedKey, copyValue, onRename, onRoll, onRevoke, className, ...props }: ApiKeyRowProps) {
  const hasMenu = onRename || onRoll || onRevoke;
  return (
    <div data-slot="api-key-row" className={cn('flex w-full flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3', className)} {...props}>
      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background [&_svg]:size-4"><KeyRound /></span>
      <div className="flex min-w-40 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <p className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-medium">{name}</p>
          {scope ? <Badge variant="outline" className="max-w-40">{scope}</Badge> : null}
        </div>
        <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{meta}</p>
      </div>
      <code data-slot="api-key" className="max-w-48 shrink-0 truncate rounded-md bg-muted px-2 py-1 font-sans text-xs leading-4 text-foreground"><span className="sr-only">Key ending </span>{maskedKey}</code>
      {copyValue ? <CopyButton value={copyValue} size="sm" label={`Copy ${name} key ID`} /> : null}
      {hasMenu ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${name}`}><Ellipsis aria-hidden="true" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onRename ? <DropdownMenuItem onSelect={onRename}>Rename</DropdownMenuItem> : null}
            {onRoll ? <DropdownMenuItem onSelect={onRoll}>Roll key</DropdownMenuItem> : null}
            {onRevoke ? <><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" onSelect={onRevoke}>Revoke</DropdownMenuItem></> : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

/* Session Row */

export interface SessionRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** "Chrome on macOS". */
  name: string;
  /** "Bucharest, Romania · 86.120.x.x · Active now". */
  meta: string;
  device?: 'desktop' | 'mobile';
  /** This device: badge, Sign out disabled; list it first. */
  current?: boolean;
  onSignOut?: () => void;
}

function SessionRow({ name, meta, device = 'desktop', current = false, onSignOut, className, ...props }: SessionRowProps) {
  return (
    <div data-slot="session-row" data-current={current || undefined} className={cn('flex w-full flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3', className)} {...props}>
      <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background [&_svg]:size-[18px]">{device === 'mobile' ? <Smartphone /> : <Monitor />}</span>
      <div className="flex min-w-40 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <p className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-medium">{name}</p>
          {current ? <Badge variant="success">This device</Badge> : null}
        </div>
        <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{meta}</p>
      </div>
      <Button variant="outline" size="sm" disabled={current} onClick={onSignOut} aria-label={current ? 'Sign out (this device)' : `Sign out of ${name}`}>Sign out</Button>
    </div>
  );
}

/* Org Chart Node */

export interface OrgChartNodeProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onSelect'> {
  /** Person; leave out with `vacancy` for an open role. */
  name?: string;
  role: string;
  /** "6 reports". */
  reports?: string;
  avatarSrc?: string;
  initials?: string;
  selected?: boolean;
  /** Open role: title ("Open role") and hiring status ("Hiring", "Interviewing"). */
  vacancy?: { title?: string; hiringStatus: string };
  /** Makes the node a button (opens the person). */
  onSelect?: () => void;
}

function OrgChartNode({ name, role, reports, avatarSrc, initials, selected = false, vacancy, onSelect, className, ...props }: OrgChartNodeProps) {
  const vacant = Boolean(vacancy);
  const title = vacant ? (vacancy!.title ?? 'Open role') : name;
  const body = (
    <>
      {vacant ? (
        <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-4"><Plus /></span>
      ) : (
        <Avatar size="lg" name={name} initials={initials} src={avatarSrc} type={avatarSrc ? 'image' : 'initials'} aria-hidden="true" />
      )}
      <span className="line-clamp-2 w-full text-sm leading-5 font-medium text-card-foreground">{title}</span>
      {vacant ? (
        <span className="flex w-full max-w-32 items-center justify-center gap-1 text-xs leading-4 text-muted-foreground">
          <span className="min-w-0 truncate">{role}</span><span aria-hidden="true">·</span><span className="min-w-0 truncate">{vacancy!.hiringStatus}</span>
        </span>
      ) : (
        <>
          <span className="w-full truncate text-xs leading-4 text-muted-foreground">{role}</span>
          {reports ? <span className="flex max-w-32 items-center gap-1 text-xs leading-4 text-muted-foreground"><Users aria-hidden="true" className="size-3 shrink-0" /><span className="truncate">{reports}</span></span> : null}
        </>
      )}
    </>
  );
  const box = cn(
    'flex w-[220px] min-w-40 flex-col items-center gap-2 rounded-xl bg-card p-4 text-center',
    vacant ? 'border border-dashed border-border' : selected ? 'border-2 border-ring' : 'border border-border',
  );
  return (
    <div data-slot="org-chart-node" data-state={vacant ? 'vacant' : selected ? 'selected' : 'default'} className={cn('flex', className)} {...props}>
      {onSelect ? (
        <button type="button" aria-pressed={selected} onClick={onSelect} className={cn(box, 'cursor-pointer outline-none hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50')}>{body}</button>
      ) : (
        <div className={box}>{body}</div>
      )}
    </div>
  );
}

export { ApiKeyRow, IntegrationCard, OrgChartNode, PermissionMatrix, SessionRow };
