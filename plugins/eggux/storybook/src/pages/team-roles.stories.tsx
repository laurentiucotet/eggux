import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { TeamRolesPage } from './team-roles';

const meta = {
  title: 'Pages/App/Team and Roles',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Team and roles: eight people in a table with a role Select, a status Badge and Remove; Invite people opens a Dialog with email addresses and a role; Remove asks first in an Alert Dialog; the four roles are explained under the table. The owner cannot be changed or removed.' } },
  },
  render: () => <TeamRolesPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The invite dialog, with an address that is not valid. */
export const InviteWithError: Story = { render: () => <TeamRolesPage inviteError /> };

/** Removing a member asks first. */
export const RemoveConfirm: Story = { render: () => <TeamRolesPage removeId="m3" /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(document.body);
    await expect(c.getByRole('heading', { level: 1, name: 'Team and roles' })).toBeVisible();
    await expect(c.getAllByRole('row')).toHaveLength(9);

    // Change a role.
    await userEvent.click(c.getByRole('combobox', { name: 'Role of Mihai Ionescu' }));
    await userEvent.click(await body.findByRole('option', { name: 'Viewer' }));
    await waitFor(() => expect(c.getByText('Mihai Ionescu is now Viewer.')).toBeVisible());

    // Invite: validation, then two people.
    await userEvent.click(c.getByRole('button', { name: 'Invite people' }));
    const dialog = await body.findByRole('dialog', { name: 'Invite people' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Send invitations' }));
    await expect(await within(dialog).findByText('Enter at least one email address.')).toBeVisible();
    await userEvent.type(within(dialog).getByLabelText(/^Email addresses/), 'nora@acme.com, bad-address');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Send invitations' }));
    await expect(await within(dialog).findByText(/“bad-address”/)).toBeVisible();
    await userEvent.clear(within(dialog).getByLabelText(/^Email addresses/));
    await userEvent.type(within(dialog).getByLabelText(/^Email addresses/), 'nora@acme.com, victor@acme.com');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Send invitations' }));
    await waitFor(() => expect(c.getByText('2 invitations sent as Member.')).toBeVisible());
    await waitFor(() => expect(c.getAllByRole('row')).toHaveLength(11));

    // Remove: ask first, cancel keeps, confirm removes.
    await userEvent.click(c.getByRole('button', { name: 'Remove Elena Dumitru' }));
    const ask = await body.findByRole('alertdialog', { name: 'Remove Elena Dumitru?' });
    await userEvent.click(within(ask).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(body.queryByRole('alertdialog')).toBeNull());
    await expect(c.getByText('elena@acme.com')).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Remove Elena Dumitru' }));
    await userEvent.click(within(await body.findByRole('alertdialog')).getByRole('button', { name: 'Remove member' }));
    await waitFor(() => expect(c.queryByText('elena@acme.com')).toBeNull());
    await expect(c.getByText('Elena Dumitru was removed from the team.')).toBeVisible();
    await expect(c.queryByRole('button', { name: 'Remove Daniel Pop' })).toBeNull();
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const InviteWithErrorDark: Story = { ...InviteWithError, tags: ['!dev'], globals: { theme: 'Dark' } };
export const RemoveConfirmBackOffice: Story = { ...RemoveConfirm, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const PhoneWidth: Story = {
  tags: ['!dev'],
  globals: { viewport: { value: 'base', isRotated: false } },
  play: async ({ canvasElement }) => {
    await expect((await within(canvasElement).findAllByRole('heading', { level: 1, name: 'Team and roles' })).length).toBeGreaterThan(0);
    await waitFor(() => expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth));
  },
};
