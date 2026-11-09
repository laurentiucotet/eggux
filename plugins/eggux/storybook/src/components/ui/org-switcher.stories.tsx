import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { OrgSwitcher, type Organization } from './org-switcher';
import { Sidebar, SidebarWorkspace } from './sidebar';

const orgs: Organization[] = [
  { id: 'acme', name: 'Acme Inc.', role: 'Owner', plan: 'Enterprise' },
  { id: 'acme-eu', name: 'Acme Europe GmbH', role: 'Admin', plan: 'Business', initials: 'AE' },
  { id: 'nw', name: 'Northwind Traders', role: 'Member', plan: 'Business' },
];
const many: Organization[] = [
  ...orgs,
  { id: 'contoso', name: 'Contoso Retail', role: 'Member', plan: 'Starter' },
  { id: 'fabrikam', name: 'Fabrikam', role: 'Admin', plan: 'Business' },
  { id: 'tailspin', name: 'Tailspin Toys', role: 'Member', plan: 'Starter' },
];

const meta = {
  title: 'Components/Sidebar/Org Switcher',
  component: OrgSwitcher,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Switch between organizations, tenants or workspaces from the Sidebar Workspace: the current one with a check, role and plan; a search from 6; Create and Manage at the bottom. Arrows move, Enter switches, Escape closes and returns focus. Switching reloads the data and keeps the same kind of page; no toast. Only for people in several organizations. Figma: Sidebar page / Org Switcher. Guide: eggux build-ui/components/sidebar.md' } },
  },
  args: { organizations: orgs, value: 'acme', onSwitch: fn(), onCreate: fn(), onManage: fn(), children: <SidebarWorkspace title="Acme Inc." description="Pro plan" /> },
  render: args => (
    <div className="h-[420px]">
      <Sidebar header={<OrgSwitcher {...args} />} className="h-auto" />
    </div>
  ),
} satisfies Meta<typeof OrgSwitcher>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma default: 288 wide, current org checked, 3 rows, Create and Manage; arrows and Enter switch.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: /Acme Inc\./ });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Organizations' });
    await expect(Math.round(box(dialog).width)).toBe(288);
    const list = within(dialog).getByRole('listbox', { name: 'Organizations' });
    await waitFor(() => expect(list).toHaveFocus());
    const current = within(list).getByRole('option', { name: /Acme Inc\./ });
    await expect(current).toHaveAttribute('aria-selected', 'true');
    await expect(current).toHaveTextContent('Owner · Enterprise');
    await expect(within(dialog).queryByRole('combobox')).toBeNull();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(args.onSwitch).toHaveBeenCalledWith('nw');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Organizations' })).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// The actions are the last options: arrows reach Create and Manage.
export const Actions: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Acme Inc\./ }));
    const dialog = await screen.findByRole('dialog', { name: 'Organizations' });
    await userEvent.click(within(dialog).getByRole('option', { name: 'Manage organizations' }));
    await expect(args.onManage).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: /Acme Inc\./ }));
    await screen.findByRole('dialog', { name: 'Organizations' });
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
    await expect(args.onCreate).toHaveBeenCalled();
  },
};

// More than 5 organizations: the search filters, an empty result says so; Escape closes.
export const WithSearch: Story = {
  args: { organizations: many },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /Acme Inc\./ });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Organizations' });
    const search = within(dialog).getByRole('combobox', { name: 'Find organization' });
    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.type(search, 'toys');
    await expect(within(dialog).getAllByRole('option', { name: /Tailspin|Contoso|Acme|Northwind|Fabrikam/ })).toHaveLength(1);
    await userEvent.clear(search);
    await userEvent.type(search, 'zzz');
    await expect(within(dialog).getByText('No organization matches “zzz”')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

// Stress: at the 192 minimum long names, roles and actions truncate on one line. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: {
    organizations: [
      { id: 'long', name: 'Acme International Holdings Group of Companies', role: 'Billing administrator', plan: 'Enterprise plus annual' },
      ...orgs,
    ],
    value: 'long',
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Acme Inc\./ }));
    const dialog = await screen.findByRole('dialog', { name: 'Organizations' });
    (dialog as HTMLElement).style.width = '192px';
    const row = within(dialog).getByRole('option', { name: /Acme International/ });
    const name = row.querySelector<HTMLElement>('.font-medium')!;
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    await expect(Math.round(box(name).height)).toBe(20);
    await userEvent.keyboard('{Escape}');
  },
};

export const DefaultDark: Story = {
  tags: ['!dev'],
  globals: { theme: 'Dark' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Acme Inc\./ }));
    await screen.findByRole('dialog', { name: 'Organizations' });
    await userEvent.keyboard('{ArrowDown}');
  },
};
export const DefaultCorporate: Story = {
  tags: ['!dev'],
  globals: { theme: 'Corporate Light' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Acme Inc\./ }));
    await screen.findByRole('dialog', { name: 'Organizations' });
    await userEvent.keyboard('{ArrowDown}');
  },
};
