import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { CreditCard } from '@/components/icons';
import { ApiKeyRow, IntegrationCard, OrgChartNode, PermissionMatrix, SessionRow, type PermissionRole } from './admin';

const meta = {
  title: 'Components/Admin/Admin Components',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Settings and admin parts. Integration Card: one app with its state (available with Connect, connected with a switch and last sync, error saying what failed). Permission Matrix (Figma Permission Row): roles as columns, permissions grouped by area, locked roles checked and disabled, the edited role highlighted, unsaved changes marked. API Key Row: masked key, scope, Copy and Rename / Roll / Revoke. Session Row: signed-in devices, this device first with Sign out disabled. Org Chart Node: person, selected person or open role. Figma: Admin page. Guide: eggux build-ui/patterns/settings-and-admin.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const desc = 'Collect card payments on invoices and reconcile them automatically.';
const onConnect = fn();
const onEnabled = fn();

// Figma: 320 wide; available 170, connected 186, error 186.
export const IntegrationCards: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      <IntegrationCard name="Payments" category="Finance" description={desc} icon={<CreditCard />} status="available" vendor="By Acme Pay" onConnect={onConnect} />
      <IntegrationCard name="Bank sync" category="Finance" description={desc} letter="B" status="connected" syncLabel="Synced 5 min ago" onEnabledChange={onEnabled} onSettings={fn()} showBadge />
      <IntegrationCard name="Payroll" category="HR" description={desc} letter="P" status="error" syncLabel="Sync failed: token expired" onSettings={fn()} />
    </div>
  ),
  play: async ({ canvas }) => {
    const [available, connected, error] = canvas.getAllByRole('article');
    await expect(Math.round(box(available!).width)).toBe(320);
    await expect(Math.round(box(available!).height)).toBe(170);
    await expect(Math.abs(Math.round(box(connected!).height) - 186)).toBeLessThanOrEqual(2);
    await userEvent.click(canvas.getByRole('button', { name: 'Connect Payments' }));
    await expect(onConnect).toHaveBeenCalled();
    const toggle = canvas.getByRole('switch', { name: 'Bank sync on' });
    await expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    await expect(onEnabled).toHaveBeenCalledWith(false);
    await expect(within(connected!).getByText('Connected')).toBeInTheDocument();
    await expect(error).toHaveTextContent('Sync failed: token expired');
    await expect(available).not.toHaveTextContent('Learn more');
    await expect(canvas.getByRole('button', { name: 'Payroll settings' })).toBeInTheDocument();
  },
};

const roles: PermissionRole[] = [{ id: 'owner', label: 'Owner', locked: true }, { id: 'admin', label: 'Admin' }, { id: 'manager', label: 'Manager' }];
const groups = [
  { title: 'Invoices', permissions: [
    { id: 'inv-create', title: 'Create invoices' },
    { id: 'inv-approve', title: 'Approve invoices', description: 'Mark invoices as approved for payment' },
    { id: 'inv-delete', title: 'Delete invoices' },
  ] },
  { title: 'Customers', permissions: [
    { id: 'cus-edit', title: 'Edit customers' },
    { id: 'cus-export', title: 'Export customer data', description: 'Download every customer as CSV' },
  ] },
];

function Matrix({ width = 720, extraRoles = false, selectAll = false, readOnly = false }: { width?: number; extraRoles?: boolean; selectAll?: boolean; readOnly?: boolean }) {
  const [value, setValue] = React.useState<Record<string, string[]>>({ 'inv-create': ['admin', 'manager'], 'inv-approve': ['admin', 'manager'], 'cus-edit': ['admin'] });
  const [changed, setChanged] = React.useState<string[]>([]);
  const r = extraRoles ? [...roles, { id: 'member', label: 'Member' }, { id: 'viewer', label: 'Viewer' }] : roles;
  return (
    <div style={{ width }}>
      <PermissionMatrix
        label="Permissions by role"
        roles={r}
        selectedRole="admin"
        selectAll={selectAll}
        readOnly={readOnly}
        groups={groups.map(g => ({ ...g, permissions: g.permissions.map(p => ({ ...p, changed: changed.includes(p.id) })) }))}
        value={value}
        onChange={(pid, rid, on) => {
          setValue(v => ({ ...v, [pid]: on ? [...(v[pid] ?? []), rid] : (v[pid] ?? []).filter(x => x !== rid) }));
          setChanged(c => (c.includes(pid) ? c : [...c, pid]));
        }}
      />
    </div>
  );
}

// Figma: header 25, group 53, permission 55, 96 wide role columns; owner locked; Admin highlighted.
export const PermissionRows: Story = {
  name: 'Permission Matrix',
  render: () => <Matrix />,
  play: async ({ canvas, canvasElement }) => {
    const table = canvas.getByRole('table', { name: 'Permissions by role' });
    const rows = canvasElement.querySelectorAll('[data-slot="permission-row"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(25);
    await expect(Math.round(box(rows[1]!).height)).toBe(53);
    // With a description 55; a row without one is 37.
    await expect(Math.round(box(canvas.getByRole('rowheader', { name: /Approve invoices/ }).parentElement!).height)).toBe(55);
    await expect(Math.round(box(within(table).getByRole('columnheader', { name: 'Owner' })).width)).toBe(96);
    const owner = canvas.getByRole('checkbox', { name: 'Owner: Delete invoices' });
    await expect(owner).toBeChecked();
    await expect(owner).toBeDisabled();
    const manager = canvas.getByRole('checkbox', { name: 'Manager: Delete invoices' });
    await expect(manager).not.toBeChecked();
    await userEvent.click(manager);
    await expect(manager).toBeChecked();
    await expect(canvas.getByRole('rowheader', { name: /Delete invoices/ })).toHaveTextContent('Changed');
    await expect(canvas.getByRole('columnheader', { name: 'Customers' })).toBeInTheDocument();
  },
};

// Select all per column (mixed state), read-only cells, own scroll container at 276. Tests only.
export const PermissionMatrixModes: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-8">
      <Matrix selectAll />
      <Matrix readOnly width={720} />
      <Matrix selectAll width={276} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const [first, second, third] = canvasElement.querySelectorAll('[data-slot="permission-matrix"]');
    const selectAllAdmin = within(first as HTMLElement).getByRole('checkbox', { name: 'Select all Admin' });
    // Admin holds 2 of 5 permissions: mixed.
    await expect(selectAllAdmin).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(selectAllAdmin);
    await waitFor(() => expect(selectAllAdmin).toBeChecked());
    await userEvent.click(selectAllAdmin);
    await waitFor(() => expect(selectAllAdmin).not.toBeChecked());
    await expect(within(first as HTMLElement).getByRole('checkbox', { name: 'Select all Owner' })).toBeDisabled();
    // Read only: no checkboxes, words for the state.
    await expect(within(second as HTMLElement).queryAllByRole('checkbox')).toHaveLength(0);
    await expect(within(second as HTMLElement).getAllByText('Granted').length).toBeGreaterThan(0);
    await expect(within(second as HTMLElement).getAllByText('Not granted').length).toBeGreaterThan(0);
    // Narrow: the table scrolls inside a focusable region, the page does not.
    const scroller = (third as HTMLElement).parentElement!;
    await waitFor(() => expect(scroller).toHaveAttribute('tabindex', '0'));
    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    await expect(scroller.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(c.getAllByRole('region', { name: 'Permissions by role' })).toHaveLength(1);
  },
};

// Figma: 800 × 65; masked key, scope badge, Copy and the More menu.
export const ApiKeys: Story = {
  name: 'API Key Row',
  render: () => (
    <div className="w-[800px]">
      <ApiKeyRow name="Production server" scope="Read and write" meta="Created 12 Mar 2026 by Ana Popescu · Last used 2 hours ago" maskedKey="sk_live_••••••••4f2a" copyValue="key_01HV8M4F2A" onRename={fn()} onRoll={fn()} onRevoke={fn()} />
      <ApiKeyRow name="Reporting dashboard with a very long name that has to be cut" scope="Read only" meta="Created 2 Jan 2026 by Mihai Ionescu · Never used" maskedKey="sk_live_••••••••9c01" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="api-key-row"]')!;
    await expect(Math.abs(Math.round(box(row).height) - 65)).toBeLessThanOrEqual(2);
    await expect(row).toHaveTextContent('Key ending sk_live_••••••••4f2a');
    await expect(canvas.getByRole('button', { name: 'Copy Production server key ID' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'More actions for Production server' }));
    const menu = await within(document.body).findByRole('menu');
    await expect(within(menu).getAllByRole('menuitem').map(i => i.textContent)).toEqual(['Rename', 'Roll key', 'Revoke']);
    await userEvent.keyboard('{Escape}');
  },
};

// Figma: 720 × 63; this device first with Sign out disabled; mobile device icon.
export const Sessions: Story = {
  name: 'Session Row',
  render: () => (
    <div className="w-[720px]">
      <SessionRow current name="Chrome on macOS" meta="Bucharest, Romania · 86.120.x.x · Active now" />
      <SessionRow device="mobile" name="Safari on iPhone" meta="Cluj-Napoca, Romania · 79.112.x.x · 3 hours ago" onSignOut={fn()} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="session-row"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(63);
    await expect(rows[0]).toHaveTextContent('This device');
    await expect(canvas.getByRole('button', { name: 'Sign out (this device)' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Sign out of Safari on iPhone' })).toBeEnabled();
  },
};

// Figma: 220 wide; default 150, selected 152 (2 px ring), vacant 126 dashed.
export const OrgChart: Story = {
  name: 'Org Chart Node',
  render: () => (
    <div className="flex items-start gap-8">
      <OrgChartNode name="Mihai Ionescu" role="Finance Manager" reports="4 reports" onSelect={fn()} />
      <OrgChartNode name="Ana Popescu" role="Head of Finance" reports="6 reports" selected onSelect={fn()} />
      <OrgChartNode role="Head of Finance" vacancy={{ hiringStatus: 'Hiring' }} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const nodes = [...canvasElement.querySelectorAll('[data-slot="org-chart-node"]')];
    await expect(Math.round(box(nodes[0]!).width)).toBe(220);
    await expect(Math.round(box(nodes[0]!).height)).toBe(150);
    await expect(Math.round(box(nodes[1]!).height)).toBe(152);
    await expect(Math.round(box(nodes[2]!).height)).toBe(126);
    await expect(canvas.getByRole('button', { name: /Ana Popescu/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(nodes[2]).toHaveTextContent('Open roleHead of Finance·Hiring');
  },
};

// Stress: 5 roles at 448, long names, narrow cards. Tests only.
export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-8">
      <Matrix width={448} />
      <Matrix width={720} extraRoles />
      <div className="flex gap-4">
        <IntegrationCard className="w-60" name="A connector with a very long product name" category="Accounting and bookkeeping" description={`${desc} ${desc}`} letter="X" status="available" vendor="By Acme" learnMoreHref="#learn" />
        <OrgChartNode className="w-40" name="Alexandra-Maria Constantinescu-Popovici" role="Senior Vice President of Global Financial Operations" reports="128 reports" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const [narrow] = canvas.getAllByRole('table');
    await expect(box(narrow!).width).toBeGreaterThanOrEqual(448);
    await expect(canvas.getAllByRole('columnheader', { name: 'Viewer' })).toHaveLength(1);
    await expect(canvas.getByRole('link', { name: /Learn more about/ })).toBeInTheDocument();
  },
};

const All = () => (
  <div className="flex flex-col gap-8">
    <div className="flex gap-6">
      <IntegrationCard name="Payments" category="Finance" description={desc} icon={<CreditCard />} status="available" vendor="By Acme Pay" />
      <IntegrationCard name="Bank sync" category="Finance" description={desc} letter="B" status="connected" syncLabel="Synced 5 min ago" showBadge onSettings={() => {}} />
      <IntegrationCard name="Payroll" category="HR" description={desc} letter="P" status="error" syncLabel="Sync failed" onSettings={() => {}} />
    </div>
    <Matrix />
    <div className="w-[800px]"><ApiKeyRow name="Production server" scope="Read and write" meta="Created 12 Mar 2026" maskedKey="sk_live_••••4f2a" copyValue="key_1" onRevoke={() => {}} /></div>
    <div className="w-[720px]"><SessionRow current name="Chrome on macOS" meta="Bucharest · Active now" /></div>
    <div className="flex gap-6">
      <OrgChartNode name="Ana Popescu" role="Head of Finance" reports="6 reports" selected />
      <OrgChartNode role="Controller" vacancy={{ hiringStatus: 'Interviewing' }} />
    </div>
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
