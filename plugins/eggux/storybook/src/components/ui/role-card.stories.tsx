import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { RoleCard, type RolePermissionSummary } from './role-card';

type Args = {
  name: string;
  description: string;
  members: number;
  summaryCount: number;
  system: boolean;
  width: number;
  showDescription: boolean;
};

const allSummary: RolePermissionSummary[] = [
  { area: 'Invoices', level: 'Manage' },
  { area: 'Customers', level: 'Edit' },
  { area: 'Reports', level: 'View' },
  { area: 'Billing', level: 'None' },
  { area: 'Team', level: 'View' },
  { area: 'Developers', level: 'None' },
];

const meta = {
  title: 'Components/Access/Role Card',
  parameters: {
    docs: {
      description: {
        component:
          'One role in a roles list: name, description, member count, a summary of what it can do and the actions Edit and Duplicate. A system role is defined by the product: it shows a lock and Edit is disabled with the reason written under the actions. The summary shows up to four areas, then "+N more". Code only (no Figma component yet).',
      },
    },
  },
  args: { name: 'Finance editor', description: 'Creates and sends invoices and can see every report, but cannot change billing.', members: 12, summaryCount: 4, system: false, width: 360, showDescription: true },
  argTypes: {
    name: { name: 'Name', control: 'text', description: 'The role name; truncates on one line.', table: { category: 'Role Card' } },
    members: { name: 'Members', control: { type: 'range', min: 0, max: 5000, step: 1 }, description: 'People who have the role.', table: { category: 'Role Card' } },
    system: { name: 'System role', control: 'boolean', description: 'Locked: Edit is disabled with a reason.', table: { category: 'Role Card' } },
    summaryCount: { name: 'Summary areas', control: { type: 'range', min: 0, max: 6, step: 1 }, description: 'How many areas the role covers; four show, the rest is "+N more".', table: { category: 'Role Card' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 480, step: 4 }, description: 'Card width in px.', table: { category: 'Role Card' } },
    showDescription: { name: 'Show description', control: 'boolean', description: 'The description under the name.', table: { category: 'Parts' } },
    description: { name: 'Description', control: 'text', description: 'Clamps to two lines.', table: { category: 'Parts' } },
  },
  render: ({ summaryCount, showDescription, description, width, ...args }) => (
    <div style={{ width }}>
      <RoleCard {...args} description={showDescription ? description : undefined} summary={allSummary.slice(0, summaryCount)} className="w-full" />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const onEdit = fn();
    const onDuplicate = fn();
    return (
      <div className="w-[360px]">
        <RoleCard name="Finance editor" description="Creates and sends invoices." members={12} summary={allSummary} onEdit={onEdit} onDuplicate={onDuplicate} className="w-full" />
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Finance editor' })).toBeVisible();
    await expect(canvas.getByText('12 members')).toBeVisible();
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength(5);
    await expect(items[4]).toHaveTextContent('+2 more');
    await expect(canvas.getByRole('list', { name: 'What Finance editor can do' })).toBeVisible();
    // Keyboard: Tab reaches Edit, then Duplicate.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Edit Finance editor' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Duplicate Finance editor' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
  },
};

/** A role the product defines: locked, Edit is off and says why. */
export const SystemRole: Story = {
  args: { name: 'Owner', description: 'Full control of the workspace. Every workspace has one.', members: 1, system: true, summaryCount: 6 },
};

export const SystemRoleCheck: Story = {
  ...SystemRole,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('System role')).toBeVisible();
    await expect(canvas.getByText('1 member')).toBeVisible();
    const edit = canvas.getByRole('button', { name: 'Edit Owner' });
    await expect(edit).toBeDisabled();
    await expect(edit).toHaveAccessibleDescription(/System roles cannot be edited/);
    await expect(canvas.getByRole('button', { name: 'Duplicate Owner' })).toBeEnabled();
  },
};

/** Several cards in a grid, as on a roles page. */
export const InAList: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <RoleCard name="Owner" description="Full control of the workspace." members={1} system summary={allSummary} className="w-full" />
      <RoleCard name="Finance editor" description="Creates and sends invoices." members={12} summary={allSummary.slice(0, 3)} className="w-full" />
      <RoleCard name="Support agent" description="Answers customers and sees their invoices." members={38} summary={allSummary.slice(1, 3)} className="w-full" />
      <RoleCard name="Auditor" description="Read-only access to everything." members={0} summary={[{ area: 'Everything', level: 'View' }]} className="w-full" />
    </div>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <RoleCard
      name="Regional accounts payable approver for the Acme Europe group"
      description="Approves every supplier invoice above the regional limit, releases payments and reviews the monthly accruals report for all Acme Europe entities before it goes to the group controller."
      members={12480}
      system
      maxSummary={3}
      summary={[{ area: 'Supplier invoices and purchase orders', level: 'Approve up to 50,000 EUR' }, ...allSummary]}
      className="w-full"
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('article');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    const h = canvas.getByRole('heading');
    await expect(h.scrollWidth).toBeGreaterThan(h.clientWidth);
    await expect(h.getBoundingClientRect().height).toBeLessThan(32);
    await expect(canvas.getByText('12,480 members')).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Duplicate/ })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const SystemRoleDark: Story = { ...SystemRoleCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
