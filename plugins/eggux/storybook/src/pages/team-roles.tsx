import * as React from 'react';
import { Trash2, UserPlus } from '@/components/icons';
import { Alert } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Avatar } from '@/components/ui/avatar';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonIcon } from '@/components/ui/button-icon';
import { Card } from '@/components/ui/card';
import { Dialog, DialogBody, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog-header';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableCellStack } from '@/components/ui/table-cells';
import { AppShell } from './app-parts';

export type Role = 'owner' | 'admin' | 'member' | 'viewer';
export type MemberStatus = 'active' | 'invited' | 'suspended';
interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
}

const roleLabel: Record<Role, string> = { owner: 'Owner', admin: 'Admin', member: 'Member', viewer: 'Viewer' };
const roleText: Record<Role, string> = {
  owner: 'Everything, including billing, the plan and deleting the workspace. There is one owner.',
  admin: 'Manage people, settings and integrations. Cannot change billing or delete the workspace.',
  member: 'Create and edit invoices, customers and reports.',
  viewer: 'Read only. Can view and download, cannot change anything.',
};
const assignable: Role[] = ['admin', 'member', 'viewer'];
const statusBadge: Record<MemberStatus, { label: string; variant: NonNullable<BadgeProps['variant']> }> = {
  active: { label: 'Active', variant: 'soft-success' },
  invited: { label: 'Invited', variant: 'soft-info' },
  suspended: { label: 'Suspended', variant: 'soft-neutral' },
};

const demoPeople: Member[] = [
  { id: 'm1', name: 'Daniel Pop', email: 'daniel@acme.com', role: 'owner', status: 'active' },
  { id: 'm2', name: 'Ana Popescu', email: 'ana.popescu@acme.com', role: 'admin', status: 'active' },
  { id: 'm3', name: 'Mihai Ionescu', email: 'mihai@acme.com', role: 'member', status: 'active' },
  { id: 'm4', name: 'Elena Dumitru', email: 'elena@acme.com', role: 'member', status: 'active' },
  { id: 'm5', name: 'Radu Stan', email: 'radu@acme.com', role: 'member', status: 'suspended' },
  { id: 'm6', name: 'Ioana Marin', email: 'ioana@acme.com', role: 'viewer', status: 'active' },
  { id: 'm7', name: 'Tudor Barbu', email: 'tudor@partner.example', role: 'viewer', status: 'invited' },
  { id: 'm8', name: 'Sofia Lazar', email: 'sofia@acme.com', role: 'admin', status: 'invited' },
];

const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const parseEmails = (text: string) => text.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);

export interface TeamRolesPageProps {
  /** Open the invite dialog first. */
  inviteOpen?: boolean;
  /** Open the invite dialog with a wrong address typed in. */
  inviteError?: boolean;
  /** Ask to remove this member first (id). */
  removeId?: string;
}

/** Team and roles: the people table with role selects and status, invite dialog, remove confirmation, roles explained. */
export function TeamRolesPage({ inviteOpen = false, inviteError = false, removeId }: TeamRolesPageProps) {
  const [people, setPeople] = React.useState<Member[]>(demoPeople);
  const [inviting, setInviting] = React.useState(inviteOpen || inviteError);
  const [emails, setEmails] = React.useState(inviteError ? 'ana@acme' : '');
  const [inviteRole, setInviteRole] = React.useState<Role>('member');
  const [inviteMsg, setInviteMsg] = React.useState<string | undefined>(inviteError ? 'Check “ana@acme”: it is not a valid email address.' : undefined);
  const [removing, setRemoving] = React.useState<Member | null>(removeId ? (demoPeople.find(p => p.id === removeId) ?? null) : null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const closeInvite = (open: boolean) => {
    setInviting(open);
    if (!open) {
      setEmails('');
      setInviteMsg(undefined);
    }
  };
  const sendInvites = (e: React.FormEvent) => {
    e.preventDefault();
    const list = parseEmails(emails);
    if (list.length === 0) {
      setInviteMsg('Enter at least one email address.');
      return;
    }
    const bad = list.find(a => !emailOk(a));
    if (bad) {
      setInviteMsg(`Check “${bad}”: it is not a valid email address.`);
      return;
    }
    const fresh = list.filter(a => !people.some(p => p.email.toLowerCase() === a.toLowerCase()));
    setPeople(p => [
      ...p,
      ...fresh.map((a, i) => ({
        id: `n${p.length + i}`,
        name: a.split('@')[0]!.replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email: a,
        role: inviteRole,
        status: 'invited' as const,
      })),
    ]);
    setNotice(
      fresh.length === 0
        ? 'Everyone you entered is already on the team.'
        : `${fresh.length} ${fresh.length === 1 ? 'invitation' : 'invitations'} sent as ${roleLabel[inviteRole]}.`,
    );
    closeInvite(false);
  };

  const changeRole = (m: Member, role: Role) => {
    setPeople(p => p.map(x => (x.id === m.id ? { ...x, role } : x)));
    setNotice(`${m.name} is now ${roleLabel[role]}.`);
  };
  const confirmRemove = () => {
    if (!removing) return;
    setPeople(p => p.filter(x => x.id !== removing.id));
    setNotice(`${removing.name} was removed from the team.`);
    setRemoving(null);
  };

  return (
    <AppShell active="settings" title="Team and roles" trail={[{ label: 'Settings', href: '#settings' }]}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <PageHeader
          title="Team and roles"
          description={`${people.length} people have access to Acme Inc. Roles decide what each of them can change.`}
          actions={<Button leadingIcon={<UserPlus />} onClick={() => setInviting(true)}>Invite people</Button>}
        />
        {notice ? <Alert variant="success" title={notice} onDismiss={() => setNotice(null)} /> : null}

        <section aria-labelledby="people-title" className="flex flex-col gap-3">
          <h2 id="people-title" className="m-0 text-xl leading-7 font-semibold">People</h2>
          <Card className="overflow-hidden p-0">
            <Table aria-labelledby="people-title">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-56">Member</TableHead>
                  <TableHead className="min-w-40">Role</TableHead>
                  <TableHead className="min-w-28">Status</TableHead>
                  <TableHead className="w-16"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {people.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar initials={initialsOf(m.name)} />
                        <TableCellStack title={m.name} description={m.email} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {m.role === 'owner' ? (
                        <span className="text-sm leading-5 text-foreground">{roleLabel.owner}</span>
                      ) : (
                        <Select size="sm" value={m.role} onValueChange={v => changeRole(m, v as Role)}>
                          <SelectTrigger aria-label={`Role of ${m.name}`} className="w-32" />
                          <SelectContent>
                            {assignable.map(r => <SelectItem key={r} value={r}>{roleLabel[r]}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell><Badge variant={statusBadge[m.status].variant} dot>{statusBadge[m.status].label}</Badge></TableCell>
                    <TableCell>
                      {m.role === 'owner' ? null : (
                        <ButtonIcon variant="ghost" icon={<Trash2 />} label={`Remove ${m.name}`} onClick={() => setRemoving(m)} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        <section aria-labelledby="roles-title" className="flex flex-col gap-3">
          <h2 id="roles-title" className="m-0 text-xl leading-7 font-semibold">What each role can do</h2>
          <dl className="m-0 grid gap-4 sm:grid-cols-2">
            {(Object.keys(roleLabel) as Role[]).map(r => (
              <Card key={r} className="gap-1 p-4">
                <dt className="text-base leading-6 font-semibold">{roleLabel[r]}</dt>
                <dd className="m-0 text-sm leading-5 text-muted-foreground">{roleText[r]}</dd>
              </Card>
            ))}
          </dl>
        </section>
      </div>

      <Dialog open={inviting} onOpenChange={closeInvite}>
        <DialogContent size="default">
          <DialogHeader title="Invite people" description="They get an email with a link to join. You can change the role later." />
          <form noValidate onSubmit={sendInvites} className="flex min-h-0 flex-1 flex-col gap-4" aria-label="Invite people">
            <DialogBody>
              <Field label="Email addresses" hint="Separate several addresses with a comma." error={inviteMsg} required>
                <Input type="text" inputMode="email" autoComplete="off" placeholder="name@company.com, name2@company.com" value={emails} onChange={e => { setEmails(e.target.value); setInviteMsg(undefined); }} />
              </Field>
              <Field label="Role">
                <Select value={inviteRole} onValueChange={v => setInviteRole(v as Role)}>
                  <SelectTrigger />
                  <SelectContent>
                    {assignable.map(r => <SelectItem key={r} value={r} description={roleText[r]}>{roleLabel[r]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => closeInvite(false)}>Cancel</Button>
              <Button type="submit">Send invitations</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={removing !== null} onOpenChange={o => { if (!o) setRemoving(null); }}>
        <AlertDialogContent type="destructive">
          <AlertDialogHeader
            title={`Remove ${removing?.name ?? 'this member'}?`}
            description={`${removing?.name ?? 'They'} loses access to Acme Inc. right away. Their work stays. You can invite them again later.`}
          />
          <AlertDialogFooter>
            <AlertDialogCancel />
            <AlertDialogAction onClick={confirmRemove}>Remove member</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
