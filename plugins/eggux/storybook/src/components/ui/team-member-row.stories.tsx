import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { DropdownMenuItem, DropdownMenuSeparator } from './dropdown-menu';
import { TeamMemberRow, type TeamMemberLayout, type TeamMemberStatus } from './team-member-row';

type Args = {
  name: string;
  email: string;
  role: string;
  status: TeamMemberStatus;
  owner: boolean;
  showMenu: boolean;
  disabled: boolean;
  layout: TeamMemberLayout;
  width: number;
};

const menu = (
  <>
    <DropdownMenuItem>Resend invite</DropdownMenuItem>
    <DropdownMenuItem>Suspend</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Remove from team</DropdownMenuItem>
  </>
);

const meta = {
  title: 'Components/Access/Team Member Row',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One person on a team: avatar, name and email, a role select, a status badge (Active, Invited, Suspended) and an actions menu. The owner row is locked: the role is text with a lock and there is no menu. Wraps to two lines under 512 px of row width, down to 276 px. Layout "list" is a bordered row; "table" has fixed role and status columns for rows under column heads. Put rows in a list. Code only (no Figma component yet).',
      },
    },
  },
  args: { name: 'Ana Popescu', email: 'ana.popescu@acme.com', role: 'admin', status: 'active', owner: false, showMenu: true, disabled: false, layout: 'list', width: 640 },
  argTypes: {
    name: { name: 'Name', control: 'text', description: 'Truncates on one line.', table: { category: 'Team Member Row' } },
    email: { name: 'Email', control: 'text', description: 'Truncates on one line.', table: { category: 'Team Member Row' } },
    role: { name: 'Role', control: 'inline-radio', options: ['admin', 'member', 'viewer'], description: 'The chosen role.', table: { category: 'Team Member Row' } },
    status: { name: 'Status', control: 'inline-radio', options: ['active', 'invited', 'suspended'], description: 'Said in text on the badge.', table: { category: 'Team Member Row' } },
    owner: { name: 'Owner', control: 'boolean', description: 'Locked role, no menu.', table: { category: 'Team Member Row' } },
    layout: { name: 'Layout', control: 'inline-radio', options: ['list', 'table'], description: 'Bordered row, or columns for a table-like list.', table: { category: 'Team Member Row' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Disables the select and the menu.', table: { category: 'Team Member Row' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 800, step: 4 }, description: 'Row width in px.', table: { category: 'Team Member Row' } },
    showMenu: { name: 'Show menu', control: 'boolean', description: 'The actions menu.', table: { category: 'Parts' } },
  },
  render: ({ showMenu, width, role, ...args }) => (
    <ul className="m-0 list-none p-0" style={{ width }} aria-label="Team">
      <ControlledRow {...args} role={role} menu={showMenu ? menu : undefined} />
    </ul>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledRow({ role: roleProp, onRoleChange, ...props }: Omit<React.ComponentProps<typeof TeamMemberRow>, 'role'> & { role: string }) {
  const [role, setRole] = React.useState(roleProp);
  React.useEffect(() => setRole(roleProp), [roleProp]);
  return <TeamMemberRow {...props} role={role} onRoleChange={r => { setRole(r); onRoleChange?.(r); }} />;
}

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const onRoleChange = fn();
    return (
      <ul className="m-0 w-[640px] list-none p-0" aria-label="Team">
        <ControlledRow name="Ana Popescu" email="ana.popescu@acme.com" role="admin" onRoleChange={onRoleChange} menu={menu} />
      </ul>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Ana Popescu')).toBeVisible();
    await expect(canvas.getByText('Active')).toBeVisible();
    // Keyboard: Tab reaches the role select, then the menu.
    await userEvent.tab();
    const role = canvas.getByRole('combobox', { name: 'Role of Ana Popescu' });
    await expect(role).toHaveFocus();
    await expect(role).toHaveTextContent('Admin');
    await userEvent.click(role);
    const body = within(document.body);
    await userEvent.click(await body.findByRole('option', { name: /Viewer/ }));
    await waitFor(() => expect(role).toHaveTextContent('Viewer'));
    await userEvent.tab();
    const more = canvas.getByRole('button', { name: 'More actions for Ana Popescu' });
    await expect(more).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(await body.findByRole('menuitem', { name: 'Resend invite' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(more).toHaveFocus());
  },
};

/** The owner: role is text with a lock, no menu, and the reason is read aloud. */
export const OwnerRow: Story = {
  args: { name: 'Daniel Pop', email: 'daniel@acme.com', owner: true },
};

export const OwnerRowCheck: Story = {
  ...OwnerRow,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Owner')).toBeVisible();
    await expect(canvas.getByText(/cannot be changed/)).toHaveClass('sr-only');
    await expect(canvas.queryByRole('combobox')).toBeNull();
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

/** Rows under each other as a table: fixed role and status columns, all statuses, the owner first. */
export const AsTable: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[760px]">
      <div aria-hidden="true" className="flex gap-3 border-b border-border px-4 py-2 text-xs leading-4 font-medium text-muted-foreground">
        <span className="flex-1">Member</span><span className="w-40">Role</span><span className="w-24">Status</span><span className="w-8" />
      </div>
      <ul aria-label="Team" className="m-0 list-none p-0">
        <TeamMemberRow layout="table" name="Daniel Pop" email="daniel@acme.com" role="admin" owner />
        <ControlledRow layout="table" name="Ana Popescu" email="ana.popescu@acme.com" role="admin" menu={menu} />
        <ControlledRow layout="table" name="Mihai Ionescu" email="mihai@acme.com" role="member" status="invited" menu={menu} />
        <ControlledRow layout="table" name="Radu Stan" email="radu@acme.com" role="member" status="suspended" menu={menu} />
      </ul>
    </div>
  ),
};

/** Long name and email, narrow row, many words in the status. Tests only. */
export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <ul className="m-0 w-[276px] list-none p-0" aria-label="Narrow team">
        <ControlledRow name="Alexandra-Maria Constantinescu-Popovici" email="alexandra-maria.constantinescu-popovici@very-long-company-name.example" role="member" status="invited" menu={menu} />
      </ul>
      <ul className="m-0 w-[276px] list-none p-0" aria-label="Narrow owner">
        <TeamMemberRow name="Daniel Pop" email="daniel@acme.com" role="admin" owner />
      </ul>
      <ul className="m-0 w-[640px] list-none p-0" aria-label="Wide team">
        <ControlledRow name="Alexandra-Maria Constantinescu-Popovici" email="alexandra-maria.constantinescu-popovici@very-long-company-name.example" role="viewer" status="suspended" menu={menu} />
      </ul>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="team-member-row"]');
    const [narrow, owner, wide] = rows as unknown as HTMLElement[];
    await expect(narrow!.scrollWidth).toBeLessThanOrEqual(narrow!.clientWidth + 1);
    await expect(owner!.scrollWidth).toBeLessThanOrEqual(owner!.clientWidth + 1);
    const name = within(narrow!).getByTitle(/^Alexandra-Maria Constantinescu-Popovici$/);
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    // Narrow: role and menu sit under the person (two lines); wide: one line.
    const person = narrow!.querySelector('[title^="alexandra"]')!;
    const select = within(narrow!).getByRole('combobox');
    await expect(select.getBoundingClientRect().top).toBeGreaterThan(person.getBoundingClientRect().bottom - 1);
    const wideSelect = within(wide!).getByRole('combobox');
    await expect(wideSelect.getBoundingClientRect().top).toBeLessThan(wide!.getBoundingClientRect().bottom - 20);
    await expect(wide!.getBoundingClientRect().height).toBeLessThan(80);
    await expect(within(narrow!).getByText('Invited')).toBeVisible();
    await expect(within(wide!).getByText('Suspended')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
