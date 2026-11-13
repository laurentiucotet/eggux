import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { TeamRolesPage } from './team-roles';

const meta = {
  title: 'Pages/App/Team and Roles (list)',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Team and roles with a Team Member Row per person instead of the table: role select, status badge and an actions menu on each row; the owner row is locked. Wraps down to phone width.' } },
  },
  render: () => <TeamRolesPage peopleLayout="list" />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/* Hidden checks */

export const ListCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(document.body);
    await expect(c.getAllByRole('listitem').length).toBeGreaterThanOrEqual(8);
    await expect(c.queryByRole('button', { name: 'More actions for Daniel Pop' })).toBeNull();
    await userEvent.click(c.getByRole('combobox', { name: 'Role of Mihai Ionescu' }));
    await userEvent.click(await body.findByRole('option', { name: /Viewer/ }));
    await waitFor(() => expect(c.getByText('Mihai Ionescu is now Viewer.')).toBeVisible());
    await userEvent.click(c.getByRole('button', { name: 'More actions for Elena Dumitru' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Remove from team' }));
    const ask = await body.findByRole('alertdialog', { name: 'Remove Elena Dumitru?' });
    await userEvent.click(within(ask).getByRole('button', { name: 'Remove member' }));
    await waitFor(() => expect(c.queryByText('elena@acme.com')).toBeNull());
  },
};

export const ListDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ListCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
