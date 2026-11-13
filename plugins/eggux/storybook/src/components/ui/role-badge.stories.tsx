import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { RoleBadge } from './role-badge';

type Args = { role: string; label: string; system: boolean; size: 'sm' | 'default' | 'lg'; showIcon: boolean };

const meta = {
  title: 'Components/Access/Role Badge',
  parameters: {
    docs: {
      description: {
        component:
          'A small label for the role someone has: Owner, Admin, Editor, Member, Viewer, Guest or a custom role. Built on Badge. Every built-in role has its own tone and its own icon, so the role never relies on color alone; a custom role is neutral. System adds a lock for roles nobody can edit. Code only (no Figma component yet).',
      },
    },
  },
  args: { role: 'editor', label: '', system: false, size: 'default', showIcon: true },
  argTypes: {
    role: { name: 'Role', control: 'select', options: ['owner', 'admin', 'editor', 'member', 'viewer', 'guest', 'Billing contact'], description: 'A built-in role, or any text for a custom role.', table: { category: 'Role Badge' } },
    label: { name: 'Label', control: 'text', description: 'Replaces the built-in label.', table: { category: 'Role Badge' } },
    system: { name: 'System role', control: 'boolean', description: 'Adds a lock for roles the product defines.', table: { category: 'Role Badge' } },
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: 'sm 16, default 20, lg 24 high.', table: { category: 'Role Badge' } },
    showIcon: { name: 'Show icon', control: 'boolean', description: 'The role icon before the label.', table: { category: 'Parts' } },
  },
  render: ({ label, ...args }) => <RoleBadge {...args} label={label || undefined} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <RoleBadge role="admin" system />,
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Admin').closest('[data-slot="role-badge"]') as HTMLElement;
    await expect(badge).toHaveTextContent('Admin, system role');
    await expect(Math.round(badge.getBoundingClientRect().height)).toBe(20);
    await expect(badge.querySelectorAll('svg')).toHaveLength(2);
  },
};

/** Every built-in role and a custom one, each with its icon. */
export const Roles: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {(['owner', 'admin', 'editor', 'member', 'viewer', 'guest', 'Billing contact'] as const).map(r => <RoleBadge key={r} role={r} />)}
      <RoleBadge role="editor" label="Editor" system />
    </div>
  ),
};

export const RolesCheck: Story = {
  ...Roles,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    for (const name of ['Owner', 'Admin', 'Editor', 'Member', 'Viewer', 'Guest', 'Billing contact']) {
      const badge = canvas.getAllByText(name)[0].closest('[data-slot="role-badge"]') as HTMLElement;
      // Never color alone: each has an icon.
      await expect(badge.querySelector('svg')).not.toBeNull();
    }
  },
};

/** The three sizes. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-2">
      <RoleBadge role="editor" size="sm" />
      <RoleBadge role="editor" />
      <RoleBadge role="editor" size="lg" />
    </div>
  ),
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const heights = canvas.getAllByText('Editor').map(el => Math.round((el.closest('[data-slot="role-badge"]') as HTMLElement).getBoundingClientRect().height));
    await expect(heights).toEqual([16, 20, 24]);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-2">
      <RoleBadge role="custom" label="Regional accounts payable approver for the Acme Europe group" system size="lg" />
      <div className="flex w-32"><RoleBadge role="custom" label="Regional accounts payable approver" /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const el of canvas.getAllByText(/Regional accounts/)) {
      const badge = el.closest('[data-slot="role-badge"]') as HTMLElement;
      await expect(badge.getBoundingClientRect().width).toBeLessThanOrEqual(276);
      await expect(el.scrollWidth).toBeGreaterThan(0);
    }
    const narrow = canvas.getAllByText(/Regional accounts/)[1].closest('[data-slot="role-badge"]') as HTMLElement;
    await expect(narrow.getBoundingClientRect().width).toBeLessThanOrEqual(128);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const RolesDark: Story = { ...RolesCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const RolesCorporate: Story = { ...RolesCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
