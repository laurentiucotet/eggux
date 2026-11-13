// EGG UI blocks, BLOCKS / Enterprise page (179:1207), second half: Block / Roles & Permissions
// (183:1035), User Directory (851:6413), Org Chart (848:144225), Report (183:2107), Record Form
// (184:1861), Version History (848:144381). The first half and the shared EnterpriseBlock frame
// are in enterprise-blocks.tsx. Guides: eggux build-ui/patterns/permissions-and-access.md,
// enterprise-apps.md, reports.md, record-page.md, audit-log.md.
// Layout (1200 frame): 32 padding, 24 between parts. Roles: role list 300 + matrix (24 apart)
// with a Save Bar; Directory: Data Grid Toolbar, active filter chips, table with a Table Toolbar
// for the selection and Table Pagination; Org Chart: canvas (muted, 24 padding) with 220 nodes,
// 3 levels; Report: 4 Stat Cards (16 apart), Chart Card, breakdown table with a total row;
// Record Form: table of contents 200 + section cards (32 apart), Save Bar; Version History:
// versions card 400 + comparison (24 apart). Two columns from 1024 of container width.
import * as React from 'react';
import { CircleAlert, Download, Ellipsis, Eye, Minus, Plus, RefreshCw, ShieldCheck, User, Users, Clock } from '@/components/icons';
import { cn } from '@/lib/utils';
import { OrgChartNode, PermissionMatrix, type Permission, type PermissionRole } from './admin';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';
import { VersionItem } from './audit';
import { Badge } from './badge';
import { BarChart, ChartCard, ChartLegend, ChartLegendItem } from './charts';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Card, CardContent, CardHeader } from './card';
import { Chip } from './chip';
import { DiffLine, DiffViewer, type DiffType } from './code-block';
import { DataGridFiltersButton, DataGridToolbar } from './data-grid-toolbar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { EnterpriseBlock } from './enterprise-blocks';
import { Field } from './field';
import { Input } from './input';
import { ListItem } from './list';
import { Progress } from './progress';
import { SaveBar } from './save-bar';
import { SearchField } from './search-field';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { StatCard } from './stat-card';
import { StatusDot } from './status-dot';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableHeaderLabel, TableRow } from './table';
import { TableCellDate, TableCellText } from './table-cells';
import { TableCellUser } from './table-cells-rich';
import { TableCellSelect } from './table-cell-check';
import { TableCellStatus } from './table-cell-status';
import { TableOfContents } from './table-of-contents';
import { TablePagination } from './table-pagination';
import { TableToolbar } from './table-toolbar';
import { Textarea } from './textarea';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { Toolbar } from './toolbar';

type SectionProps = Omit<React.ComponentProps<'section'>, 'title' | 'children'>;
const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/* Roles & Permissions */

export interface RoleSummary extends PermissionRole { description: string; members: number; icon: React.ReactNode }

const roles: RoleSummary[] = [
  { id: 'owner', label: 'Owner', locked: true, description: 'Full access, including billing', members: 2, icon: <ShieldCheck aria-hidden="true" /> },
  { id: 'admin', label: 'Admin', description: 'People, settings and integrations', members: 3, icon: <ShieldCheck aria-hidden="true" /> },
  { id: 'manager', label: 'Manager', description: 'Approve and manage team work', members: 8, icon: <Users aria-hidden="true" /> },
  { id: 'member', label: 'Member', description: 'Create and edit their own work', members: 42, icon: <User aria-hidden="true" /> },
  { id: 'viewer', label: 'Viewer', description: 'Read only', members: 15, icon: <Eye aria-hidden="true" /> },
];
const permissionGroups: { title: string; permissions: Permission[] }[] = [
  { title: 'Invoices', permissions: [{ id: 'inv.view', title: 'View invoices' }, { id: 'inv.edit', title: 'Create and edit drafts' }, { id: 'inv.send', title: 'Send invoices' }, { id: 'inv.approve', title: 'Approve over €10,000' }, { id: 'inv.delete', title: 'Delete invoices' }] },
  { title: 'Customers', permissions: [{ id: 'cus.view', title: 'View customers' }, { id: 'cus.edit', title: 'Edit customers' }, { id: 'cus.export', title: 'Export customer data' }] },
  { title: 'Workspace', permissions: [{ id: 'ws.billing', title: 'Billing and plan' }, { id: 'ws.users', title: 'Users and roles' }, { id: 'ws.audit', title: 'Audit log' }, { id: 'ws.api', title: 'API keys' }] },
];
const savedGrants: Record<string, string[]> = {
  'inv.view': ['admin', 'manager', 'member', 'viewer'], 'inv.edit': ['admin', 'manager', 'member'], 'inv.send': ['admin', 'manager'], 'inv.approve': ['admin'], 'inv.delete': ['admin'],
  'cus.view': ['admin', 'manager', 'member', 'viewer'], 'cus.edit': ['admin', 'manager', 'member'], 'cus.export': ['admin', 'manager'],
  'ws.billing': [], 'ws.users': ['admin'], 'ws.audit': ['admin'], 'ws.api': ['admin'],
};
const draftGrants: Record<string, string[]> = { ...savedGrants, 'inv.approve': ['admin', 'manager'] };

const sameSet = (a: string[] = [], b: string[] = []) => a.length === b.length && a.every(x => b.includes(x));

export interface RolesPermissionsProps extends SectionProps {
  title?: string;
  description?: string;
  roles?: RoleSummary[];
  groups?: { title: string; permissions: Permission[] }[];
  /** What is saved. */
  saved?: Record<string, string[]>;
  /** What is on screen at first (unsaved changes show the Save Bar). */
  draft?: Record<string, string[]>;
  defaultRole?: string;
  onSave?: (grants: Record<string, string[]>) => void;
  onNewRole?: () => void;
}

/** Role list on the left (300), permission matrix with the edited role highlighted, Save Bar while there are changes. */
function RolesPermissions({
  title = 'Roles and permissions',
  description = 'What each role can see and do. Owners always have every permission.',
  roles: roleList = roles,
  groups = permissionGroups,
  saved: savedProp = savedGrants,
  draft: draftProp = draftGrants,
  defaultRole = 'manager',
  onSave,
  onNewRole,
  ...props
}: RolesPermissionsProps) {
  const [saved, setSaved] = React.useState(savedProp);
  const [grants, setGrants] = React.useState(draftProp);
  const [role, setRole] = React.useState(defaultRole);
  const [state, setState] = React.useState<'default' | 'saved'>('default');
  const changed = Object.keys({ ...saved, ...grants }).filter(p => !sameSet(saved[p], grants[p]));
  const changedRoles = roleList.filter(r => changed.some(p => (saved[p] ?? []).includes(r.id) !== (grants[p] ?? []).includes(r.id)));
  const changes = changed.reduce((n, p) => n + roleList.filter(r => (saved[p] ?? []).includes(r.id) !== (grants[p] ?? []).includes(r.id)).length, 0);
  const shownGroups = groups.map(g => ({ ...g, permissions: g.permissions.map(p => ({ ...p, changed: changed.includes(p.id) })) }));
  const selected = roleList.find(r => r.id === role);

  return (
    <EnterpriseBlock
      title={title}
      description={description}
      actions={<Button variant="outline" leadingIcon={<Plus aria-hidden="true" />} onClick={onNewRole}>New role</Button>}
      {...props}
    >
      <div data-slot="roles-body" className="grid grid-cols-1 items-start gap-6 @4xl:grid-cols-[300px_minmax(0,1fr)]">
        <ul aria-label="Roles" className="m-0 flex flex-col gap-1 p-0">
          {roleList.map(r => (
            <ListItem
              key={r.id}
              data-role={r.id}
              title={r.label}
              description={r.description}
              leading={<span className="text-muted-foreground [&_svg]:size-4">{r.icon}</span>}
              trailing={<Badge variant="soft-neutral" aria-label={`${r.members} members`}>{r.members}</Badge>}
              selected={r.id === role}
              onSelect={() => setRole(r.id)}
            />
          ))}
        </ul>
        <div data-slot="roles-matrix" className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0 overflow-x-auto rounded-lg border border-border">
            <PermissionMatrix
              label={`Permissions by role, editing ${selected?.label ?? ''}`}
              roles={roleList}
              groups={shownGroups}
              value={grants}
              selectedRole={role}
              onChange={(p, r, on) => { setState('default'); setGrants(g => ({ ...g, [p]: on ? [...(g[p] ?? []).filter(x => x !== r), r] : (g[p] ?? []).filter(x => x !== r) })); }}
            />
          </div>
          {changes ? (
            <SaveBar
              message={`${plural(changes, 'change')} to ${changedRoles.map(r => r.label).join(' and ')}`}
              onSave={() => { setSaved(grants); setState('saved'); onSave?.(grants); }}
              onDiscard={() => setGrants(saved)}
            />
          ) : (
            <p role="status" className="m-0 text-sm leading-5 text-muted-foreground">{state === 'saved' ? 'Permissions saved. The change is in the audit log.' : 'All changes saved.'}</p>
          )}
        </div>
      </div>
    </EnterpriseBlock>
  );
}

/* User Directory */

export type UserStatus = 'Active' | 'Invited' | 'Suspended' | 'Deactivated';
export interface DirectoryUser {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  note?: string;
  signIn: 'Okta SSO' | 'Password';
  twoFactor: 'On' | 'Off' | 'Not set up' | 'Reset needed';
  lastActive?: { date: string; time: string; iso: string };
}

const directory: DirectoryUser[] = [
  { name: 'Sarah Lindqvist', email: 'sarah.lindqvist@acme.com', role: 'Owner', status: 'Active', signIn: 'Password', twoFactor: 'On', lastActive: { date: '26 Oct 2026', time: '09:12', iso: '2026-10-26' } },
  { name: 'Ana Popescu', email: 'ana.popescu@acme.com', role: 'Admin', status: 'Active', signIn: 'Okta SSO', twoFactor: 'On', lastActive: { date: '26 Oct 2026', time: '14:32', iso: '2026-10-26' } },
  { name: 'Mark Peters', email: 'mark.peters@acme.com', role: 'Billing admin', status: 'Active', signIn: 'Okta SSO', twoFactor: 'On', lastActive: { date: '25 Oct 2026', time: '17:05', iso: '2026-10-25' } },
  { name: 'Radu Georgescu', email: 'radu.georgescu@acme.com', role: 'Member', status: 'Active', signIn: 'Okta SSO', twoFactor: 'On', lastActive: { date: '26 Oct 2026', time: '11:48', iso: '2026-10-26' } },
  { name: 'Ioana Marin', email: 'ioana.marin@acme.com', role: 'Member', status: 'Invited', note: '2 days ago', signIn: 'Okta SSO', twoFactor: 'Not set up' },
  { name: 'Daniel Weber', email: 'daniel.weber@acme.com', role: 'Member', status: 'Active', signIn: 'Okta SSO', twoFactor: 'On', lastActive: { date: '24 Oct 2026', time: '16:20', iso: '2026-10-24' } },
  { name: 'Elena Varga', email: 'elena.varga@acme.com', role: 'Member', status: 'Suspended', note: 'Locked out', signIn: 'Okta SSO', twoFactor: 'Reset needed', lastActive: { date: '19 Oct 2026', time: '08:02', iso: '2026-10-19' } },
  { name: 'Tom Becker', email: 'tom.becker@northwind.io', role: 'Guest', status: 'Active', signIn: 'Password', twoFactor: 'Off', lastActive: { date: '22 Oct 2026', time: '10:15', iso: '2026-10-22' } },
  { name: 'Lena Fischer', email: 'lena.fischer@acme.com', role: 'Admin', status: 'Active', signIn: 'Okta SSO', twoFactor: 'On', lastActive: { date: '26 Oct 2026', time: '13:10', iso: '2026-10-26' } },
  { name: 'Andrei Ionescu', email: 'andrei.ionescu@acme.com', role: 'Member', status: 'Active', signIn: 'Okta SSO', twoFactor: 'On', lastActive: { date: '23 Oct 2026', time: '18:40', iso: '2026-10-23' } },
  { name: 'Clara Weber', email: 'clara.weber@acme.com', role: 'Admin', status: 'Active', signIn: 'Okta SSO', twoFactor: 'On', lastActive: { date: '20 Oct 2026', time: '18:20', iso: '2026-10-20' } },
  { name: 'Sofia Rossi', email: 'sofia.rossi@acme.com', role: 'Member', status: 'Deactivated', note: 'On 30 Sep', signIn: 'Okta SSO', twoFactor: 'Off', lastActive: { date: '30 Sep 2026', time: '18:40', iso: '2026-09-30' } },
];
const statusBadge = { Active: 'soft-success', Invited: 'soft-info', Suspended: 'soft-warning', Deactivated: 'soft-neutral' } as const;
const twoFactorDot = { On: 'success', Off: 'error', 'Not set up': 'neutral', 'Reset needed': 'warning' } as const;
const roleOptions = ['Admin', 'Billing admin', 'Manager', 'Member', 'Guest'];

export interface UserDirectoryProps extends SectionProps {
  title?: string;
  description?: string;
  users?: DirectoryUser[];
  /** Status filter at first: Status chip. */
  defaultStatus?: UserStatus[];
  /** Sign-in filter at first: Sign-in chip. */
  defaultSignIn?: DirectoryUser['signIn'][];
  defaultSelected?: string[];
  pageSize?: number;
  onInvite?: () => void;
  onExport?: (users: DirectoryUser[]) => void;
  onDeactivate?: (emails: string[]) => void;
}

/** People admin list: toolbar, active filter chips, bulk actions on the selection (change role, reset two-factor, deactivate). */
function UserDirectory({
  title = 'Users',
  description = '148 people in Acme GmbH. Everyone signs in with Okta SSO, except owners.',
  users: initial = directory,
  defaultStatus = ['Active', 'Invited', 'Suspended'],
  defaultSignIn = ['Okta SSO', 'Password'],
  defaultSelected = ['mark.peters@acme.com', 'radu.georgescu@acme.com', 'ioana.marin@acme.com'],
  pageSize: initialPageSize = 10,
  onInvite,
  onExport,
  onDeactivate,
  ...props
}: UserDirectoryProps) {
  const [users, setUsers] = React.useState(initial);
  const [query, setQuery] = React.useState('');
  const [statusF, setStatusF] = React.useState<UserStatus[]>(defaultStatus);
  const [signInF, setSignInF] = React.useState<DirectoryUser['signIn'][]>(defaultSignIn);
  const [selected, setSelected] = React.useState<string[]>(defaultSelected);
  const [sortDir, setSortDir] = React.useState<'ascending' | 'descending'>('ascending');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [announce, setAnnounce] = React.useState('');
  const q = query.trim().toLowerCase();
  const rows = users
    .filter(u => (!statusF.length || statusF.includes(u.status)) && (!signInF.length || signInF.includes(u.signIn)) && (!q || `${u.name} ${u.email}`.toLowerCase().includes(q)))
    .sort((a, b) => (sortDir === 'ascending' ? 1 : -1) * a.name.localeCompare(b.name));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const chosen = users.filter(u => selected.includes(u.email));
  const allOnPage = pageRows.length > 0 && pageRows.every(u => selected.includes(u.email));
  const someOnPage = pageRows.some(u => selected.includes(u.email));
  const filters = (statusF.length ? 1 : 0) + (signInF.length ? 1 : 0);
  const names = (list: string[]) => list.join(', ');
  const update = (patch: Partial<DirectoryUser>, msg: string) => {
    setUsers(us => us.map(u => (selected.includes(u.email) ? { ...u, ...patch } : u)));
    setAnnounce(msg);
  };

  return (
    <EnterpriseBlock
      heading="page"
      title={title}
      description={description}
      actions={(
        <>
          <Button variant="outline" leadingIcon={<Download aria-hidden="true" />} onClick={() => onExport?.(rows)}>Export</Button>
          <Button leadingIcon={<Plus aria-hidden="true" />} onClick={onInvite}>Invite users</Button>
        </>
      )}
      {...props}
    >
      <div className="min-w-0 overflow-x-auto">
        <DataGridToolbar
          aria-label="User list tools"
          start={(
            <>
              <SearchField placeholder="Search by name or email" value={query} onValueChange={v => { setQuery(v); setPage(1); }} showShortcut={false} debounce={0} className="w-60" />
              <DataGridFiltersButton count={filters} />
            </>
          )}
          end={<Button variant="outline" size="sm" leadingIcon={<Download aria-hidden="true" />} onClick={() => onExport?.(rows)}>Export view</Button>}
        />
      </div>
      {filters ? (
        <div data-slot="active-filters" role="group" aria-label="Active filters" className="flex flex-wrap items-center gap-2">
          {statusF.length ? <Chip label={`Status: ${names(statusF)}`} showRemove removeLabel="Remove Status filter" onRemove={() => { setStatusF([]); setPage(1); }} /> : null}
          {signInF.length ? <Chip label={`Sign-in: ${names(signInF)}`} showRemove removeLabel="Remove Sign-in filter" onRemove={() => { setSignInF([]); setPage(1); }} /> : null}
          <Button variant="link" size="sm" onClick={() => { setStatusF([]); setSignInF([]); setPage(1); }}>Clear filters</Button>
        </div>
      ) : null}
      <p aria-live="polite" className="sr-only">{announce || `${plural(rows.length, 'user')} shown`}</p>
      <div className="min-w-0 overflow-hidden rounded-lg border border-border">
        {selected.length ? (
          <TableToolbar selection={`${selected.length} selected`} onClear={() => setSelected([])}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Change role</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {roleOptions.map(r => <DropdownMenuItem key={r} onSelect={() => update({ role: r }, `${plural(selected.length, 'user')} changed to ${r}`)}>{r}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => update({ twoFactor: 'Reset needed' }, `Two-factor reset for ${plural(selected.length, 'user')}`)}>Reset two-factor</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Deactivate</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deactivate {plural(selected.length, 'user')}?</AlertDialogTitle>
                  <AlertDialogDescription>{chosen.map(u => u.name).join(', ')} lose access at once. Their work stays and you can reactivate them later.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={() => { onDeactivate?.(selected); update({ status: 'Deactivated', note: 'Just now' }, `${plural(selected.length, 'user')} deactivated`); setSelected([]); }}>Deactivate</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableToolbar>
        ) : null}
        <Table className="min-w-[1000px]">
          <caption className="sr-only">Users</caption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <TableCellSelect all name="users on this page" checked={allOnPage ? true : someOnPage ? 'indeterminate' : false} onCheckedChange={c => setSelected(s => (c === true ? [...new Set([...s, ...pageRows.map(u => u.email)])] : s.filter(e => !pageRows.some(u => u.email === e))))} />
              </TableHead>
              <TableHead className="w-[280px]" sort={sortDir}>
                <TableHeaderLabel label="User" sort={sortDir} onSortClick={() => setSortDir(d => (d === 'ascending' ? 'descending' : 'ascending'))} />
              </TableHead>
              <TableHead className="w-[130px]">Role</TableHead>
              <TableHead className="w-[230px]">Status</TableHead>
              <TableHead className="w-[120px]">Sign-in</TableHead>
              <TableHead className="w-[130px]">Two-factor</TableHead>
              <TableHead className="w-[140px]">Last active</TableHead>
              <TableHead className="w-14"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map(u => {
              const on = selected.includes(u.email);
              return (
                <TableRow key={u.email} data-user={u.email} selected={on}>
                  <TableCell><TableCellSelect name={u.name} checked={on} onCheckedChange={c => setSelected(s => (c === true ? [...s, u.email] : s.filter(e => e !== u.email)))} /></TableCell>
                  <TableCell><TableCellUser name={u.name} email={u.email} initials={initialsOf(u.name)} /></TableCell>
                  <TableCell><TableCellText>{u.role}</TableCellText></TableCell>
                  <TableCell><TableCellStatus label={u.status} variant={statusBadge[u.status]} dot note={u.note} showNote={Boolean(u.note)} /></TableCell>
                  <TableCell><Badge variant={u.signIn === 'Password' ? 'outline' : 'soft-neutral'}>{u.signIn}</Badge></TableCell>
                  <TableCell><StatusDot status={twoFactorDot[u.twoFactor]} label={u.twoFactor} /></TableCell>
                  <TableCell>{u.lastActive ? <TableCellDate date={u.lastActive.date} time={u.lastActive.time} dateTime={u.lastActive.iso} /> : <TableCellText textStyle="muted">Never signed in</TableCellText>}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`More actions for ${u.name}`}><Ellipsis aria-hidden="true" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Resend invite</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
            {!pageRows.length ? (
              <TableRow><TableCell colSpan={8} className="py-8 text-center text-sm leading-5 text-muted-foreground">No users match{q ? ` “${query}”` : ' these filters'}.</TableCell></TableRow>
            ) : null}
          </TableBody>
        </Table>
        <div className="min-w-0 overflow-x-auto border-t border-border px-3">
          <TablePagination page={page} pageSize={pageSize} total={rows.length} noun="users" onPageChange={setPage} onPageSizeChange={s => { setPageSize(s); setPage(1); }} pageSizes={[5, 10, 20]} />
        </div>
      </div>
    </EnterpriseBlock>
  );
}

/* Org Chart */

export interface OrgPerson { id: string; name?: string; role: string; vacancy?: string; reports?: OrgPerson[] }

const org: OrgPerson = {
  id: 'sarah', name: 'Sarah Lindqvist', role: 'Chief Executive Officer',
  reports: [
    { id: 'mark', name: 'Mark Peters', role: 'Chief Financial Officer', reports: [{ id: 'ioana', name: 'Ioana Marin', role: 'Controller' }, { id: 'lena', name: 'Lena Fischer', role: 'Accounts Payable Lead' }] },
    { id: 'ana', name: 'Ana Popescu', role: 'Chief Technology Officer', reports: [{ id: 'radu', name: 'Radu Georgescu', role: 'Engineering Manager', reports: [] }, { id: 'open-1', role: 'Head of Data', vacancy: 'Hiring' }] },
    { id: 'daniel', name: 'Daniel Weber', role: 'VP Sales', reports: [{ id: 'tom', name: 'Tom Becker', role: 'Account Executive' }, { id: 'elena', name: 'Elena Varga', role: 'Sales Operations' }, { id: 'open-2', role: 'Account Executive', vacancy: 'Interviewing' }] },
  ],
};
const directReports: Record<string, number> = { sarah: 3, mark: 6, ana: 2, daniel: 8, radu: 12, ioana: 2, lena: 3, tom: 0, elena: 1 };

export interface OrgChartProps extends SectionProps {
  title?: string;
  description?: string;
  root?: OrgPerson;
  /** The open branch on level 2: its reports show on level 3. */
  defaultSelected?: string;
  onOpenPerson?: (id: string) => void;
  onExport?: () => void;
  onAddPosition?: () => void;
}

/** Three levels of the organization; selecting a manager on level 2 opens their reports. Vacant roles stay in the tree. */
function OrgChart({
  title = 'Organization',
  description = 'Acme GmbH, 48 people in 6 teams. Select a person to open their profile.',
  root = org,
  defaultSelected = 'ana',
  onOpenPerson,
  onExport,
  onAddPosition,
  ...props
}: OrgChartProps) {
  const [selected, setSelected] = React.useState(defaultSelected);
  const [zoom, setZoom] = React.useState(100);
  const level2 = root.reports ?? [];
  const open = level2.find(p => p.id === selected);
  const vacancies = [...level2, ...(open?.reports ?? [])].filter(p => p.vacancy).length;
  const node = (p: OrgPerson) => (
    <OrgChartNode
      name={p.name}
      role={p.role}
      initials={p.name ? initialsOf(p.name) : undefined}
      reports={p.name && directReports[p.id] ? plural(directReports[p.id]!, 'direct report') : undefined}
      vacancy={p.vacancy ? { hiringStatus: p.vacancy } : undefined}
      selected={p.id === selected}
      onSelect={p.vacancy ? undefined : () => { setSelected(p.id); onOpenPerson?.(p.id); }}
    />
  );
  const branch = 'relative flex flex-col items-center pt-6 before:absolute before:top-0 before:left-1/2 before:h-6 before:w-px before:bg-border';
  return (
    <EnterpriseBlock
      heading="page"
      title={title}
      description={description}
      actions={(
        <>
          <Button variant="outline" leadingIcon={<Download aria-hidden="true" />} onClick={onExport}>Export</Button>
          <Button leadingIcon={<Plus aria-hidden="true" />} onClick={onAddPosition}>Add position</Button>
        </>
      )}
      {...props}
    >
      <div data-slot="org-canvas" className="flex min-w-0 flex-col gap-6 rounded-lg border border-border bg-muted p-4 @3xl:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p aria-live="polite" className="m-0 text-sm leading-5 text-foreground">3 levels shown, {plural(vacancies, 'open role')}. Select a manager to see their team.</p>
          <Toolbar aria-label="Zoom" toolbarStyle="floating">
            <ButtonIcon variant="ghost" size="sm" icon={<Minus />} label="Zoom out" disabled={zoom <= 50} onClick={() => setZoom(z => Math.max(50, z - 10))} />
            <output aria-label="Zoom level" className="w-12 text-center text-sm leading-5 tabular-nums">{zoom}%</output>
            <ButtonIcon variant="ghost" size="sm" icon={<Plus />} label="Zoom in" disabled={zoom >= 150} onClick={() => setZoom(z => Math.min(150, z + 10))} />
          </Toolbar>
        </div>
        <div className="min-w-0 overflow-auto">
          <ul aria-label="Organization chart" data-slot="org-tree" className="m-0 flex w-max min-w-full list-none justify-center p-0 py-4" style={{ zoom: zoom / 100 }}>
            <li className="flex flex-col items-center">
              {node(root)}
              {level2.length ? (
                <ul aria-label={`Reports to ${root.name}`} className="relative m-0 mt-6 flex list-none gap-6 p-0 before:absolute before:-top-6 before:left-1/2 before:h-6 before:w-px before:bg-border">
                  {level2.map((p, i) => (
                    <li key={p.id} className={cn(branch, 'border-t border-border', i === 0 && 'ml-[110px] pl-0 [&>[data-slot=org-chart-node]]:-ml-[110px]', i === level2.length - 1 && 'mr-[110px] [&>[data-slot=org-chart-node]]:-mr-[110px]')}>
                      {node(p)}
                      {p.id === selected && p.reports?.length ? (
                        <ul aria-label={`Reports to ${p.name}`} className="relative m-0 mt-6 flex list-none gap-4 p-0 before:absolute before:-top-6 before:left-1/2 before:h-6 before:w-px before:bg-border">
                          {p.reports.map(c => <li key={c.id} className={cn(branch, 'border-t border-border')}>{node(c)}</li>)}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          </ul>
        </div>
      </div>
    </EnterpriseBlock>
  );
}

/* Report */

export interface ReportPeriod {
  id: string;
  label: string;
  compareLabel: string;
  kpis: { label: string; value: string; change: string; trend: 'up' | 'down' | 'neutral'; trendText: string; footnote: string; good?: boolean }[];
  months: { label: string; revenue: number; costs: number; profit: number }[];
  rows: { entity: string; revenue: number; change: number; margin: number }[];
}

const q3: ReportPeriod = {
  id: 'q3', label: '1 Jul – 30 Sep 2026', compareLabel: 'Q2',
  kpis: [
    { label: 'Revenue', value: '€1.84M', change: '+12.5%', trend: 'up', trendText: 'Up 12.4% vs Q2', footnote: 'Q3 2026', good: true },
    { label: 'Gross margin', value: '62.1%', change: '+12.5%', trend: 'up', trendText: 'Up 1.8 points vs Q2', footnote: 'Q3 2026', good: true },
    { label: 'Overdue', value: '€96.4K', change: '−4.2%', trend: 'down', trendText: 'Down 8% vs Q2', footnote: 'Lower is better', good: true },
    { label: 'Days to collect', value: '38 days', change: '0%', trend: 'neutral', trendText: '3 days slower than Q2', footnote: 'Target: 35 days' },
  ],
  months: [
    { label: 'Jan', revenue: 32000, costs: 24000, profit: 8000 }, { label: 'Feb', revenue: 41000, costs: 27000, profit: 14000 },
    { label: 'Mar', revenue: 48000, costs: 31000, profit: 17000 }, { label: 'Apr', revenue: 44000, costs: 30000, profit: 14000 },
    { label: 'May', revenue: 53000, costs: 33000, profit: 20000 }, { label: 'Jun', revenue: 58000, costs: 35000, profit: 23000 },
  ],
  rows: [
    { entity: 'Acme Inc. (US)', revenue: 812400, change: 14.2, margin: 64.0 },
    { entity: 'Acme Europe GmbH', revenue: 536900, change: 9.8, margin: 61.5 },
    { entity: 'Acme UK Ltd', revenue: 268300, change: 11.1, margin: 60.2 },
    { entity: 'Acme Romania SRL', revenue: 147200, change: 18.6, margin: 58.9 },
    { entity: 'Acme APAC', revenue: 75200, change: -2.4, margin: 55.3 },
  ],
};
const q2: ReportPeriod = {
  id: 'q2', label: '1 Apr – 30 Jun 2026', compareLabel: 'Q1',
  kpis: [
    { label: 'Revenue', value: '€1.64M', change: '+6.1%', trend: 'up', trendText: 'Up 6.1% vs Q1', footnote: 'Q2 2026', good: true },
    { label: 'Gross margin', value: '60.3%', change: '+0.9%', trend: 'up', trendText: 'Up 0.5 points vs Q1', footnote: 'Q2 2026', good: true },
    { label: 'Overdue', value: '€104.8K', change: '+3.0%', trend: 'up', trendText: 'Up 3% vs Q1', footnote: 'Lower is better', good: false },
    { label: 'Days to collect', value: '35 days', change: '0%', trend: 'neutral', trendText: 'Same as Q1', footnote: 'Target: 35 days' },
  ],
  months: q3.months.map(m => ({ ...m, revenue: Math.round(m.revenue * 0.9), costs: Math.round(m.costs * 0.95), profit: Math.round(m.profit * 0.8) })),
  rows: [
    { entity: 'Acme Inc. (US)', revenue: 711300, change: 7.4, margin: 62.1 },
    { entity: 'Acme Europe GmbH', revenue: 489000, change: 4.2, margin: 60.0 },
    { entity: 'Acme UK Ltd', revenue: 241500, change: 5.5, margin: 58.8 },
    { entity: 'Acme Romania SRL', revenue: 124100, change: 12.0, margin: 57.0 },
    { entity: 'Acme APAC', revenue: 77100, change: 1.3, margin: 54.6 },
  ],
};

const eur = (n: number) => `€${n.toLocaleString('en')}`;
const pct = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(1)}%`;
const chartSeries = [{ key: 'revenue', label: 'Revenue' }, { key: 'costs', label: 'Costs' }, { key: 'profit', label: 'Profit' }];

export interface ReportProps extends SectionProps {
  title?: string;
  scope?: string;
  periods?: ReportPeriod[];
  defaultPeriod?: string;
  onExport?: (period: string) => void;
  onSchedule?: () => void;
  /** Click on a breakdown row: filter the list behind it. */
  onDrillDown?: (entity: string) => void;
}

/** A fixed question over a fixed period: KPIs with comparisons, the trend chart, the breakdown with share and totals. */
function Report({
  title = 'Revenue report',
  scope = 'All entities · EUR · updated 22 Oct 2026, 06:00',
  periods = [q3, q2],
  defaultPeriod = 'q3',
  onExport,
  onSchedule,
  onDrillDown,
  ...props
}: ReportProps) {
  const [periodId, setPeriodId] = React.useState(defaultPeriod);
  const [compare, setCompare] = React.useState('previous');
  const [range, setRange] = React.useState('6m');
  const p = periods.find(x => x.id === periodId) ?? periods[0]!;
  const total = p.rows.reduce((s, r) => s + r.revenue, 0);
  const totalChange = p.id === 'q3' ? 12.4 : 6.1;
  const totalMargin = p.rows.reduce((s, r) => s + r.margin * r.revenue, 0) / total;
  const months = range === '6m' ? p.months : p.months.slice(-1);
  return (
    <EnterpriseBlock
      title={title}
      description={scope}
      actions={(
        <div className="flex max-w-[calc(100cqw-4rem)] flex-wrap items-center gap-2">
          <Select value={periodId} onValueChange={setPeriodId}>
            <SelectTrigger aria-label="Period" className="w-auto" />
            <SelectContent>{periods.map(x => <SelectItem key={x.id} value={x.id}>{x.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={compare} onValueChange={setCompare}>
            <SelectTrigger aria-label="Compare with" className="w-auto" />
            <SelectContent><SelectItem value="previous">vs previous period</SelectItem><SelectItem value="target">vs target</SelectItem></SelectContent>
          </Select>
          <Button variant="ghost" leadingIcon={<Clock aria-hidden="true" />} onClick={onSchedule}>Schedule</Button>
          <Button leadingIcon={<Download aria-hidden="true" />} onClick={() => onExport?.(p.id)}>Export</Button>
        </div>
      )}
      {...props}
    >
      <ul aria-label="Key figures" data-slot="report-kpis" className="m-0 grid list-none grid-cols-1 items-start gap-4 p-0 @xl:grid-cols-2 @5xl:grid-cols-4">
        {p.kpis.map(k => (
          <li key={k.label} className="min-w-0">
            <StatCard
              label={k.label}
              value={k.value}
              trend={k.trend}
              changeLabel={k.change}
              changeVariant={k.trend === 'neutral' ? 'soft-neutral' : k.good ? 'soft-success' : 'soft-destructive'}
              trendText={k.trendText}
              footnote={k.footnote}
              showSparkline={k.trend !== 'neutral'}
            />
          </li>
        ))}
      </ul>
      <ChartCard
        title="Revenue, costs and profit by month"
        description={range === '6m' ? 'January – June 2026, all entities' : 'June 2026, all entities'}
        actions={(
          <ToggleGroup type="single" size="sm" variant="segmented" aria-label="Chart range" value={range} onValueChange={v => v && setRange(v)}>
            <ToggleGroupItem value="7d" label="7 days" />
            <ToggleGroupItem value="30d" label="30 days" />
            <ToggleGroupItem value="6m" label="6 months" />
          </ToggleGroup>
        )}
        legend={<ChartLegend aria-label="Series">{chartSeries.map((s, i) => <ChartLegendItem key={s.key} label={s.label} series={i} />)}</ChartLegend>}
        insight={{ text: 'Profit up 21% vs last half-year', trend: 'up' }}
        note="Costs grew slower than revenue every month since March."
      >
        {/* BarChart groups pad 8% each side, which overflows the plot below 2400 wide: 4% here (reported). */}
        <div className="min-w-0 [&_[data-slot=chart-plot]>div>div]:px-[4%]">
        <BarChart
          type="grouped"
          label="Revenue, costs and profit by month, January to June 2026"
          series={chartSeries}
          data={months.map(m => ({ label: m.label, values: { revenue: m.revenue, costs: m.costs, profit: m.profit } }))}
          formatValue={v => eur(v)}
        />
        </div>
      </ChartCard>
      <div className="min-w-0 overflow-hidden rounded-lg border border-border">
        <Table className="min-w-[720px]">
          <caption className="sr-only">Revenue by entity, {p.label}</caption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[344px]">Entity</TableHead>
              <TableHead className="w-[172px] text-right">Revenue</TableHead>
              <TableHead className="w-[172px] text-right">vs {p.compareLabel}</TableHead>
              <TableHead className="w-[275px]">Share</TableHead>
              <TableHead className="w-[172px] text-right">Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {p.rows.map(r => {
              const share = Math.round((r.revenue / total) * 100);
              return (
                <TableRow key={r.entity}>
                  <TableCell>
                    <Button variant="link" size="sm" className="h-auto p-0 text-foreground" onClick={() => onDrillDown?.(r.entity)}>{r.entity}</Button>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{eur(r.revenue)}</TableCell>
                  <TableCell className="text-right tabular-nums">{pct(r.change)}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Progress value={share} aria-label={`${r.entity} share of revenue`} className="w-24" />
                      <span className="text-xs leading-4 text-muted-foreground tabular-nums">{share}%</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{r.margin.toFixed(1)}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell type="footer" className="font-medium">Total</TableCell>
              <TableCell type="footer" className="text-right font-medium tabular-nums">{eur(total)}</TableCell>
              <TableCell type="footer" className="text-right font-medium tabular-nums">{pct(totalChange)}</TableCell>
              <TableCell type="footer" className="text-muted-foreground">100%</TableCell>
              <TableCell type="footer" className="text-right font-medium tabular-nums">{totalMargin.toFixed(1)}%</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </EnterpriseBlock>
  );
}

/* Record Form */

export interface CustomerRecord {
  company: string; legal: string; vat: string; industry: string; website: string; owner: string;
  email: string; terms: string; currency: string; po: string; address: string;
}
const savedCustomer: CustomerRecord = {
  company: 'Northwind Traders', legal: 'Northwind Traders SRL', vat: 'RO12345678', industry: 'wholesale', website: 'northwind.com', owner: 'ana',
  email: 'billing@northwind.com', terms: '45', currency: 'EUR', po: 'no', address: 'Strada Exemplu 12, Floor 3\n010101 Bucharest, Romania',
};
const draftCustomer: CustomerRecord = { ...savedCustomer, email: 'ap@northwind.com', terms: '30', po: 'yes' };
const recordFields: { key: keyof CustomerRecord; label: string; section: 'general' | 'billing' }[] = [
  { key: 'company', label: 'Company name', section: 'general' }, { key: 'legal', label: 'Legal name', section: 'general' }, { key: 'vat', label: 'VAT ID', section: 'general' },
  { key: 'industry', label: 'Industry', section: 'general' }, { key: 'website', label: 'Website', section: 'general' }, { key: 'owner', label: 'Account owner', section: 'general' },
  { key: 'email', label: 'Billing email', section: 'billing' }, { key: 'terms', label: 'Payment terms', section: 'billing' }, { key: 'currency', label: 'Currency', section: 'billing' },
  { key: 'po', label: 'Purchase order required', section: 'billing' }, { key: 'address', label: 'Billing address', section: 'billing' },
];
const sectionNames = { general: 'General', billing: 'Billing' };

export interface RecordFormProps extends SectionProps {
  title?: string;
  saved?: CustomerRecord;
  draft?: CustomerRecord;
  lastChanged?: string;
  onSave?: (record: CustomerRecord) => void;
  onArchive?: () => void;
}

function Choice({ label, value, onChange, options, hint, info }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][]; hint?: string; info?: string }) {
  return (
    <Field label={label} hint={hint} info={info ? { children: info } : undefined}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full" />
        <SelectContent>{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
      </Select>
    </Field>
  );
}

/** Editing a long record: section nav with scroll spy, one card per section, two-column fields, danger zone last, Save Bar while there are changes. */
function RecordForm({
  title = 'Edit customer · Northwind Traders',
  saved: savedProp = savedCustomer,
  draft: draftProp = draftCustomer,
  lastChanged = 'Last changed by Ana Popescu on 21 Oct 2026. Changes are logged.',
  onSave,
  onArchive,
  ...props
}: RecordFormProps) {
  const [saved, setSaved] = React.useState(savedProp);
  const [v, setV] = React.useState(draftProp);
  const [changedBy, setChangedBy] = React.useState(lastChanged);
  const [error, setError] = React.useState('');
  const [archived, setArchived] = React.useState(false);
  const id = React.useId().replace(/:/g, '');
  const dirty = recordFields.filter(f => v[f.key] !== saved[f.key]);
  const sections = [...new Set(dirty.map(f => sectionNames[f.section]))];
  const set = (k: keyof CustomerRecord) => (value: string) => { setV(x => ({ ...x, [k]: value })); if (k === 'email') setError(''); };
  const save = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) { setError('Enter an email like ap@northwind.com.'); return; }
    setSaved(v);
    setChangedBy('Last changed by you just now. Changes are logged.');
    onSave?.(v);
  };
  const two = 'grid grid-cols-1 gap-x-4 gap-y-4 @2xl:grid-cols-2';
  return (
    <EnterpriseBlock title={title} description={changedBy} {...props}>
      <div data-slot="record-body" className="grid grid-cols-1 items-start gap-8 @4xl:grid-cols-[200px_minmax(0,1fr)]">
        <TableOfContents
          className="hidden @4xl:flex @4xl:sticky @4xl:top-4"
          items={[{ id: `${id}-general`, label: 'General' }, { id: `${id}-billing`, label: 'Billing' }, { id: `${id}-danger`, label: 'Danger zone' }]}
        />
        <div data-slot="record-sections" className="flex min-w-0 flex-col gap-6">
          <Card aria-labelledby={`${id}-general`} role="group">
            <CardHeader title={<span id={`${id}-general`}>General</span>} description="Legal and public details" />
            <div className={cn(two, 'px-[var(--card-padding)]')}>
              <Field label="Company name"><Input value={v.company} onChange={e => set('company')(e.target.value)} /></Field>
              <Field label="Legal name"><Input value={v.legal} onChange={e => set('legal')(e.target.value)} /></Field>
              <Field label="VAT ID" hint="Validated with VIES on 20 Oct 2026" info={{ children: 'The VAT ID is checked against the EU VIES register when it changes.' }}><Input value={v.vat} onChange={e => set('vat')(e.target.value)} /></Field>
              <Choice label="Industry" value={v.industry} onChange={set('industry')} options={[['wholesale', 'Wholesale and distribution'], ['retail', 'Retail'], ['software', 'Software'], ['manufacturing', 'Manufacturing']]} />
              <Field label="Website" optional><Input value={v.website} onChange={e => set('website')(e.target.value)} /></Field>
              <Choice label="Account owner" value={v.owner} onChange={set('owner')} options={[['ana', 'Ana Popescu'], ['mihai', 'Mihai Ionescu'], ['elena', 'Elena Dumitru']]} />
            </div>
          </Card>
          <Card aria-labelledby={`${id}-billing`} role="group">
            <CardHeader title={<span id={`${id}-billing`}>Billing</span>} description="Where invoices go and when they are due" />
            <div className={cn(two, 'px-[var(--card-padding)]')}>
              <Field label="Billing email" hint={error ? undefined : 'Invoices and reminders go here'} error={error || undefined}><Input type="email" value={v.email} onChange={e => set('email')(e.target.value)} /></Field>
              <Choice label="Payment terms" value={v.terms} onChange={set('terms')} options={[['15', 'Net 15'], ['30', 'Net 30'], ['45', 'Net 45'], ['60', 'Net 60']]} />
              <Choice label="Currency" value={v.currency} onChange={set('currency')} options={[['EUR', 'EUR · Euro'], ['USD', 'USD · US dollar'], ['RON', 'RON · Romanian leu']]} />
              <Choice label="Purchase order required" value={v.po} onChange={set('po')} options={[['no', 'No'], ['yes', 'Yes, on every invoice']]} />
              <Field label="Billing address" className="@2xl:col-span-2"><Textarea rows={2} value={v.address} onChange={e => set('address')(e.target.value)} /></Field>
            </div>
          </Card>
          <Card aria-labelledby={`${id}-danger`} role="group">
            <CardHeader title={<span id={`${id}-danger`}>Danger zone</span>} />
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="m-0 text-sm leading-5 font-medium">Archive this customer</p>
                  <p className="m-0 text-sm leading-5 text-muted-foreground">Hides the customer from lists and stops reminders. Invoices stay in reports and the audit log.</p>
                </div>
                {archived ? <Badge variant="soft-neutral">Archived</Badge> : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive">Archive customer</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Archive {saved.company}?</AlertDialogTitle>
                        <AlertDialogDescription>Reminders stop and the customer leaves your lists. You can restore it from Archived customers.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => { setArchived(true); onArchive?.(); }}>Archive customer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
          {dirty.length ? (
            <SaveBar
              className="sticky bottom-4"
              state={error ? 'error' : 'default'}
              message={error ? <span className="inline-flex items-center gap-1"><CircleAlert aria-hidden="true" className="size-4" />Fix the billing email to save</span> : `${plural(dirty.length, 'unsaved change')} in ${sections.join(' and ')}`}
              onSave={save}
              onDiscard={() => { setV(saved); setError(''); }}
            />
          ) : null}
        </div>
      </div>
    </EnterpriseBlock>
  );
}

/* Version History */

export interface DocVersion { id: string; author: string; when: string; summary: string; lines: string[] }

const msaV8 = [
  '4.1 The Supplier invoices the Customer monthly in arrears.',
  '4.2 Payment is due within 45 days of the invoice date.',
  '4.3 All amounts are in EUR and exclude VAT.',
  '5. Term and termination',
  '5.1 This agreement starts on 1 November 2026 and runs for 12 months.',
];
const msaV10 = [...msaV8.slice(0, 4), '5.1 This agreement starts on 1 November 2026 and runs for 24 months.', '5.2 Either party may end it with 60 days notice.'];
const msaV11 = [...msaV10.slice(0, 3), '4.4 Late payments carry interest of 5% per year.', ...msaV10.slice(3)];
const msaV12 = [
  msaV11[0]!, '4.2 Payment is due within 30 days of the invoice date.', msaV11[2]!,
  '4.4 Late payments carry interest of 8% above the base rate.', '4.5 The Customer raises disputed amounts within 10 days.', ...msaV11.slice(4),
];
const versions: DocVersion[] = [
  { id: 'v12', author: 'Ana Popescu', when: 'today at 14:32', summary: 'Payment in 30 days, new interest and dispute terms', lines: msaV12 },
  { id: 'v11', author: 'Mark Peters', when: '24 Oct 2026 at 09:15', summary: 'Added late payment interest', lines: msaV11 },
  { id: 'v10', author: 'Radu Georgescu', when: '20 Oct 2026 at 16:40', summary: 'Termination notice changed to 60 days', lines: msaV10 },
  { id: 'v9', author: 'Ana Popescu', when: '14 Oct 2026 at 11:05', summary: 'Added data processing annex', lines: msaV8 },
  { id: 'v8', author: 'Ana Popescu', when: 'imported from Word, 2 Oct 2026', summary: 'First version', lines: msaV8 },
  { id: 'v7', author: 'Mark Peters', when: '28 Sep 2026 at 10:02', summary: 'Draft for legal review', lines: msaV8.slice(0, 3) },
];

/** Line diff (longest common subsequence) of an older version against the current one. */
function diff(from: string[], to: string[]): { type: DiffType; text: string; line: number }[] {
  const m = from.length, n = to.length;
  const L: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) L[i]![j] = from[i] === to[j] ? L[i + 1]![j + 1]! + 1 : Math.max(L[i + 1]![j]!, L[i]![j + 1]!);
  const out: { type: DiffType; text: string; line: number }[] = [];
  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && from[i] === to[j]) { out.push({ type: 'context', text: to[j]!, line: j + 12 }); i++; j++; }
    else if (i < m && (j >= n || L[i + 1]![j]! >= L[i]![j + 1]!)) { out.push({ type: 'removed', text: from[i]!, line: j + 12 }); i++; }
    else { out.push({ type: 'added', text: to[j]!, line: j + 12 }); j++; }
  }
  return out;
}

export interface VersionHistoryProps extends SectionProps {
  title?: string;
  description?: string;
  file?: string;
  versions?: DocVersion[];
  defaultSelected?: string;
  /** Versions before "Show all". */
  visible?: number;
  onRestore?: (id: string) => void;
  onDownload?: (id: string) => void;
}

/** Version Items newest first (current marked) and the Diff Viewer of the selected version against the current one; Restore makes a new version. */
function VersionHistory({
  title = 'Version history',
  description = 'Master services agreement between Acme GmbH and Northwind Ltd.',
  file = 'Master services agreement.docx',
  versions: initial = versions,
  defaultSelected = 'v11',
  visible = 5,
  onRestore,
  onDownload,
  ...props
}: VersionHistoryProps) {
  const [list, setList] = React.useState(initial);
  const [selectedId, setSelectedId] = React.useState(defaultSelected);
  const [all, setAll] = React.useState(false);
  const [announce, setAnnounce] = React.useState('');
  const current = list[0]!;
  const selected = list.find(x => x.id === selectedId) ?? current;
  const isCurrent = selected.id === current.id;
  const lines = isCurrent ? [] : diff(selected.lines, current.lines);
  const added = lines.filter(l => l.type === 'added').length;
  const removed = lines.filter(l => l.type === 'removed').length;
  const shown = all ? list : list.slice(0, visible);
  const restore = (id: string) => {
    const src = list.find(x => x.id === id);
    if (!src) return;
    const next: DocVersion = { id: `v${Number(current.id.slice(1)) + 1}`, author: 'You', when: 'just now', summary: `Restored from ${src.id}`, lines: src.lines };
    setList([next, ...list]);
    setSelectedId(next.id);
    setAnnounce(`${src.id} restored as ${next.id}, now the current version.`);
    onRestore?.(id);
  };
  return (
    <EnterpriseBlock
      heading="page"
      title={title}
      description={`${description} ${list.length} versions, newest first.`}
      actions={(
        <>
          <Button variant="outline" leadingIcon={<Download aria-hidden="true" />} onClick={() => onDownload?.(selected.id)}>Download</Button>
          <Button leadingIcon={<RefreshCw aria-hidden="true" />} disabled={isCurrent} onClick={() => restore(selected.id)}>Restore {selected.id}</Button>
        </>
      )}
      {...props}
    >
      <div data-slot="version-body" className="grid grid-cols-1 items-start gap-6 @4xl:grid-cols-[400px_minmax(0,1fr)]">
        <div data-slot="versions-card" className="flex min-w-0 flex-col rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border p-4">
            <h3 className="m-0 min-w-0 flex-1 text-sm leading-5 font-medium">Versions</h3>
            <Badge variant="soft-neutral" aria-label={`${list.length} versions`}>{list.length}</Badge>
          </div>
          <ul aria-label="Versions, newest first" className="m-0 flex flex-col p-0">
            {shown.map(x => (
              <VersionItem
                key={x.id}
                version={x.id}
                meta={`${x.author}, ${x.when}`}
                summary={x.summary}
                initials={initialsOf(x.author === 'You' ? 'Elena Dumitru' : x.author)}
                current={x.id === current.id}
                selected={x.id === selectedId && x.id !== current.id}
                onSelect={() => setSelectedId(x.id)}
                onRestore={() => restore(x.id)}
              />
            ))}
          </ul>
          {list.length > visible ? (
            <div className="p-2">
              <Button variant="ghost" size="sm" aria-expanded={all} onClick={() => setAll(a => !a)}>{all ? 'Show fewer versions' : `Show all ${list.length} versions`}</Button>
            </div>
          ) : null}
        </div>
        <div data-slot="version-compare" className="flex min-w-0 flex-col gap-4">
          <p className="m-0 flex flex-wrap items-center gap-2 text-sm leading-5">
            <span>Comparing</span>
            <Badge variant="outline">{selected.id}, {selected.when.replace(/ at .*/, '')}</Badge>
            <span>with</span>
            <Badge variant="soft-info">{current.id}, current</Badge>
          </p>
          <p aria-live="polite" className="sr-only">{announce}</p>
          {isCurrent ? (
            <p className="m-0 rounded-lg border border-border p-4 text-sm leading-5 text-muted-foreground">This is the current version. Select an older version to see what changed.</p>
          ) : (
            <DiffViewer file={file} added={added} removed={removed}>
              {lines.map((l, i) => <DiffLine key={i} type={l.type} line={l.line}>{l.text}</DiffLine>)}
            </DiffViewer>
          )}
        </div>
      </div>
    </EnterpriseBlock>
  );
}

export { OrgChart, RecordForm, Report, RolesPermissions, UserDirectory, VersionHistory };
