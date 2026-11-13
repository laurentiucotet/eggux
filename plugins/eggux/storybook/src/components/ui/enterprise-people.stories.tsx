import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { OrgChart as OrgChartBlock, RolesPermissions as RolesPermissionsBlock, UserDirectory as UserDirectoryBlock } from './enterprise-blocks-more';
import { AtWidths, appBlock, box, frames, multi, padding1440, twoColumns } from './enterprise-checks';

const meta = {
  title: 'Blocks/Enterprise/People',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Enterprise people blocks, inside an app page (Back office look): Roles & Permissions (role list 300, permission matrix with the edited role highlighted, Owner locked, Save Bar while there are changes), User Directory (search, active filter chips, selection with Change role, Reset two-factor and Deactivate, pagination), Org Chart (3 levels, vacant roles stay in the tree, select a manager to see their team). Each block is a region named by its h2. Figma: BLOCKS / Enterprise. Guides: eggux build-ui/patterns/permissions-and-access.md, enterprise-apps.md' } },
  },
} satisfies Meta;
export default meta;

const text = (name: string, description: string) => ({ name, description, control: 'text' as const, table: { category: 'Content' } });

/* Visible stories: one per block, no play function. */

type RolesArgs = { title: string; description: string };
export const RolesPermissions: StoryObj<RolesArgs> = {
  name: 'Roles & Permissions',
  args: { title: 'Roles and permissions', description: 'What each role can see and do. Owners always have every permission.' },
  argTypes: { title: text('Title', 'Block title.'), description: text('Description', 'What roles control.') },
  render: a => <RolesPermissionsBlock title={a.title} description={a.description} />,
};

type DirectoryArgs = { title: string; description: string; pageSize: number };
export const UserDirectory: StoryObj<DirectoryArgs> = {
  args: { title: 'Users', description: '148 people in Acme GmbH. Everyone signs in with Okta SSO, except owners.', pageSize: 10 },
  argTypes: {
    title: text('Title', 'Block title.'),
    description: text('Description', 'Who is listed and how they sign in.'),
    pageSize: { name: 'Rows per page', description: 'Rows on one page.', control: 'inline-radio', options: [5, 10, 20], table: { category: 'Content' } },
  },
  render: a => <UserDirectoryBlock key={a.pageSize} title={a.title} description={a.description} pageSize={a.pageSize} />,
};

type OrgArgs = { title: string; description: string };
export const OrgChart: StoryObj<OrgArgs> = {
  args: { title: 'Organization', description: 'Acme GmbH, 48 people in 6 teams. Select a person to open their profile.' },
  argTypes: { title: text('Title', 'Block title.'), description: text('Description', 'Scope of the chart.') },
  render: a => <OrgChartBlock title={a.title} description={a.description} />,
};

/* Hidden checks: each block at 1440, 768 and 390, and its interactions with the keyboard. */

const onSave = fn();
export const RolesPermissionsCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><RolesPermissionsBlock onSave={onSave} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    await twoColumns(canvasElement, 'roles-body', { first: 300, gap: 24 });
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    // Manager is edited: its button is pressed and one unsaved change shows.
    await expect(c.getByRole('button', { name: 'Manager' })).toHaveAttribute('aria-pressed', 'true');
    await expect(c.getByText('1 change to Manager')).toBeInTheDocument();
    await expect(c.getByText('Changed')).toBeInTheDocument();
    // Owner is locked: checked and disabled.
    const owner = c.getByRole('checkbox', { name: 'Owner: Billing and plan' });
    await expect(owner).toBeDisabled();
    await expect(owner).toHaveAttribute('aria-checked', 'true');
    // Keyboard: edit Member, grant Send invoices with Space.
    c.getByRole('button', { name: 'Member' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('button', { name: 'Member' })).toHaveAttribute('aria-pressed', 'true'));
    const send = c.getByRole('checkbox', { name: 'Member: Send invoices' });
    send.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(send).toHaveAttribute('aria-checked', 'true'));
    await expect(c.getByText('2 changes to Manager and Member')).toBeInTheDocument();
    // Undo it, then save the rest.
    await userEvent.keyboard(' ');
    await waitFor(() => expect(c.getByText('1 change to Manager')).toBeInTheDocument());
    c.getByRole('button', { name: 'Save changes' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ 'inv.approve': ['admin', 'manager'] }));
    await waitFor(() => expect(c.getByRole('status')).toHaveTextContent('Permissions saved'));
  },
};

const onDeactivate = fn();
export const UserDirectoryCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><UserDirectoryBlock onDeactivate={onDeactivate} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    const rows = () => wide.querySelectorAll('tbody tr[data-user]');
    await expect(rows()).toHaveLength(10);
    await expect(c.getByRole('toolbar', { name: 'Bulk actions' })).toHaveTextContent('3 selected');
    await expect(c.getByText('Showing 1-10 of 11 users')).toBeInTheDocument();
    // Keyboard: change the role of the 3 selected people.
    c.getByRole('button', { name: 'Change role' }).focus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(within(menu).getAllByRole('menuitem')[0]).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await waitFor(() => expect(wide.querySelector('tr[data-user="ioana.marin@acme.com"]')).toHaveTextContent('Manager'));
    await expect(wide.querySelector('tr[data-user="mark.peters@acme.com"]')).toHaveTextContent('Manager');
    await expect(wide.querySelector('tr[data-user="daniel.weber@acme.com"]')).not.toHaveTextContent('Manager');
    // Select a row with Space.
    const daniel = c.getByRole('checkbox', { name: 'Select Daniel Weber' });
    daniel.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(c.getByRole('toolbar', { name: 'Bulk actions' })).toHaveTextContent('4 selected'));
    // Filter: search, then remove the Status chip to show deactivated people too.
    c.getByRole('searchbox', { name: 'Search by name or email' }).focus();
    await userEvent.keyboard('sofia');
    await waitFor(() => expect(c.getByText('No users match “sofia”.')).toBeInTheDocument());
    c.getByRole('button', { name: 'Remove Status filter' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(rows()).toHaveLength(1));
    await expect(rows()[0]).toHaveTextContent('Deactivated');
    // Deactivate asks first.
    c.getByRole('button', { name: 'Deactivate' }).focus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('alertdialog');
    await expect(dialog).toHaveTextContent('Deactivate 4 users?');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Deactivate' }));
    await expect(onDeactivate).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(c.queryByRole('toolbar', { name: 'Bulk actions' })).toBeNull());
  },
};

const onOpen = fn();
export const OrgChartCheck: StoryObj = {
  tags: ['!dev'],
  parameters: multi,
  render: () => <AtWidths><OrgChartBlock onOpenPerson={onOpen} /></AtWidths>,
  play: async ({ canvasElement }) => {
    await appBlock(canvasElement);
    await padding1440(canvasElement);
    const wide = frames(canvasElement)[0]!;
    const c = within(wide);
    // Nodes 220 wide; three levels with the open role kept in the tree.
    const nodes = wide.querySelectorAll('[data-slot="org-chart-node"] > *');
    await expect(Math.round(box(nodes[0]!).width)).toBe(220);
    await expect(c.getByRole('list', { name: 'Reports to Sarah Lindqvist' }).children).toHaveLength(3);
    await expect(c.getByRole('list', { name: 'Reports to Ana Popescu' })).toHaveTextContent('Open role');
    await expect(c.getByRole('button', { name: /Ana Popescu/ })).toHaveAttribute('aria-pressed', 'true');
    // Level 2 sits under the root, in one row.
    const l2 = Array.from(c.getByRole('list', { name: 'Reports to Sarah Lindqvist' }).children).map(box);
    await expect(new Set(l2.map(b => Math.round(b.top))).size).toBe(1);
    // Keyboard: open Mark Peters' team.
    c.getByRole('button', { name: /Mark Peters/ }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('list', { name: 'Reports to Mark Peters' })).toHaveTextContent('Ioana Marin'));
    await expect(c.queryByRole('list', { name: 'Reports to Ana Popescu' })).toBeNull();
    await expect(onOpen).toHaveBeenCalledWith('mark');
    await expect(c.getByText(/3 levels shown, 0 open roles/)).toBeInTheDocument();
    c.getByRole('button', { name: 'Zoom out' }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(c.getByRole('status', { name: 'Zoom level' })).toHaveTextContent('90%'));
  },
};

/* Theme copies (axe contrast): Dark and Back office. */
const Gallery = () => (
  <div className="w-[1440px]">
    <RolesPermissionsBlock />
    <UserDirectoryBlock />
    <OrgChartBlock />
  </div>
);
export const GalleryDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, parameters: { controls: { disable: true } }, render: () => <Gallery /> };
export const GalleryBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, parameters: { controls: { disable: true } }, render: () => <Gallery /> };
