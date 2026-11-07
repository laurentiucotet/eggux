import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Folder } from '@/components/icons';
import { Tree, type TreeNode } from './tree';

const files: TreeNode[] = [
  { id: 'design', label: 'Design', icon: <Folder />, count: 8, children: [
    { id: 'brand', label: 'Brand', icon: <Folder />, children: [
      { id: 'logo', label: 'Logo.fig' },
      { id: 'colors', label: 'Colors.fig' },
    ] },
    { id: 'ui', label: 'UI kit.fig' },
  ] },
  { id: 'docs', label: 'Docs', icon: <Folder />, children: [{ id: 'brief', label: 'Q4 brief.md' }] },
  { id: 'readme', label: 'README.md' },
];

const perms: TreeNode[] = [
  { id: 'billing', label: 'Billing', children: [
    { id: 'inv-view', label: 'View invoices' },
    { id: 'inv-edit', label: 'Edit invoices' },
    { id: 'refunds', label: 'Issue refunds' },
  ] },
  { id: 'team', label: 'Team', children: [{ id: 'invite', label: 'Invite members' }, { id: 'roles', label: 'Change roles' }] },
];

const meta = {
  title: 'Components/Tree/Tree Item',
  component: Tree,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Rows of a hierarchy: folders, nested navigation, permissions with checkboxes. Chevron expands, the label selects; Level 0-3 indents 16 px per level. With checkboxes a parent is checked when all its children are, mixed when some are. Up / Down move, Right expands, Left collapses, Space checks. Flat lists use List Item; deeper than 4 levels use drill-down pages. Figma: Tree page / Tree Item. Guide: eggux build-ui/components/list-and-tree.md' } },
  },
  args: { nodes: files, 'aria-label': 'Files', defaultExpanded: ['design'], defaultSelected: 'ui', onSelect: fn() },
  render: args => <div className="w-64"><Tree {...args} /></div>,
} satisfies Meta<typeof Tree>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 256 × 32 rows, 16 per level, selected on accent; keyboard expands, moves and selects.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const tree = canvas.getByRole('tree', { name: 'Files' });
    const design = within(tree).getByRole('treeitem', { name: /^Design/ });
    await expect(design).toHaveAttribute('aria-expanded', 'true');
    const rows = canvasElement.querySelectorAll('[data-slot="tree-row"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(32);
    await expect(getComputedStyle(rows[1]!).paddingLeft).toBe('24px');
    const ui = within(tree).getByRole('treeitem', { name: 'UI kit.fig' });
    await expect(ui).toHaveAttribute('aria-selected', 'true');
    await expect(ui).toHaveAttribute('tabindex', '0');
    ui.focus();
    await userEvent.keyboard('{ArrowUp}');
    const brand = within(tree).getByRole('treeitem', { name: 'Brand' });
    await expect(brand).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(brand).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(args.onSelect).toHaveBeenCalledWith('logo');
    await userEvent.keyboard('{ArrowLeft}');
    await expect(brand).toHaveFocus();
    await expect(within(design).getByText('8')).toBeInTheDocument();
  },
};

// Permissions with checkboxes: a parent is mixed when some leaves are on, checked when all are.
export const Checkboxes: Story = {
  args: { nodes: perms, 'aria-label': 'Permissions', checkable: true, showIcons: false, defaultExpanded: ['billing'], defaultChecked: ['inv-view'], defaultSelected: null },
  play: async ({ canvas }) => {
    const billing = canvas.getByRole('treeitem', { name: /^Billing/ });
    await expect(billing).toHaveAttribute('aria-checked', 'mixed');
    billing.focus();
    await userEvent.keyboard(' ');
    await expect(billing).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('treeitem', { name: 'Issue refunds' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard(' ');
    await expect(billing).toHaveAttribute('aria-checked', 'false');
  },
};

// Stress: a long label truncates at 128 wide; level 3 still fits. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: { nodes: [{ id: 'a', label: 'Design with a much longer label than planned', count: 120, children: [{ id: 'b', label: 'Level 1', children: [{ id: 'c', label: 'Level 2', children: [{ id: 'd', label: 'Level 3 file' }] }] }] }], defaultExpanded: ['a', 'b', 'c'] },
  render: args => <div className="w-32"><Tree {...args} /></div>,
  play: async ({ canvas, canvasElement }) => {
    const label = canvas.getByTitle(/much longer label/);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await expect(canvas.getByText('99+')).toBeInTheDocument();
    const rows = canvasElement.querySelectorAll<HTMLElement>('[data-slot="tree-row"]');
    await expect(getComputedStyle(rows[3]!).paddingLeft).toBe('56px');
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
