import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TransferList, type TransferListItem } from './transfer-list';

const permissions: TransferListItem[] = [
  { value: 'invoices.view', label: 'View invoices' },
  { value: 'invoices.edit', label: 'Edit invoices' },
  { value: 'invoices.approve', label: 'Approve invoices', keywords: ['sign off'] },
  { value: 'customers.view', label: 'View customers' },
  { value: 'customers.export', label: 'Export customers' },
  { value: 'reports.view', label: 'View reports' },
  { value: 'billing.manage', label: 'Manage billing', disabled: true },
];

const meta = {
  title: 'Components/Select/Transfer List',
  component: TransferList,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Move items between two lists: permissions to a role, columns to a view, members to a group. Each side has a title, a count, a search and checkbox rows; the two buttons move the checked items and are disabled while none is checked. Moves are announced. Min 512 wide; for under ~10 items use a list of checkboxes. Figma: Select page / Transfer List. Guide: eggux build-ui/components/select.md' } },
  },
  args: { items: permissions },
  decorators: [Story => <div className="w-[628px]"><Story /></div>],
} satisfies Meta<typeof TransferList>;
export default meta;
type Story = StoryObj<typeof meta>;

const side = (canvas: HTMLElement, name: string) => within(canvas).getByRole('region', { name });

// Figma default: Available and Selected lists side by side; check, move, counts update.
export const Default: Story = {
  args: { defaultValue: ['invoices.view'], onValueChange: fn() },
  play: async ({ canvas, canvasElement, args }) => {
    const available = side(canvasElement, 'Available');
    const selected = side(canvasElement, 'Selected');
    const right = canvas.getByRole('button', { name: 'Move to Selected' });
    const left = canvas.getByRole('button', { name: 'Move to Available' });
    await expect(within(available).getByText('6 items')).toBeInTheDocument();
    await expect(within(selected).getByText('1 item')).toBeInTheDocument();
    await expect(right).toBeDisabled();
    await expect(left).toBeDisabled();
    await userEvent.click(within(available).getByRole('checkbox', { name: 'Edit invoices' }));
    await userEvent.click(within(available).getByRole('checkbox', { name: 'View reports' }));
    await expect(right).toBeEnabled();
    await userEvent.click(right);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['invoices.view', 'invoices.edit', 'reports.view']);
    await expect(within(selected).getByText('3 items')).toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveTextContent('2 moved to Selected');
    await expect(right).toBeDisabled();
    await userEvent.click(within(selected).getByRole('checkbox', { name: 'View invoices' }));
    await userEvent.click(left);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['invoices.edit', 'reports.view']);
    await expect(within(available).getByRole('checkbox', { name: 'View invoices' })).not.toBeChecked();
  },
};

// Search filters one side by label and keywords; an empty result says so.
export const Search: Story = {
  play: async ({ canvasElement }) => {
    const available = side(canvasElement, 'Available');
    const search = within(available).getByRole('searchbox', { name: 'Search Available' });
    await userEvent.type(search, 'sign off');
    await expect(within(available).getAllByRole('checkbox')).toHaveLength(1);
    await expect(within(available).getByRole('checkbox', { name: 'Approve invoices' })).toBeInTheDocument();
    await userEvent.clear(search);
    await userEvent.type(search, 'payroll');
    await expect(within(available).getByText('No matches for “payroll”')).toBeInTheDocument();
  },
};

// Keyboard: Tab reaches the search and the rows, Space checks, the move button acts.
export const Keyboard: Story = {
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    const available = side(canvasElement, 'Available');
    await userEvent.tab();
    await expect(within(available).getByRole('searchbox')).toHaveFocus();
    await userEvent.tab();
    await expect(within(available).getByRole('checkbox', { name: 'View invoices' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(within(available).getByRole('checkbox', { name: 'View invoices' })).toBeChecked();
    canvas.getByRole('button', { name: 'Move to Selected' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(within(side(canvasElement, 'Selected')).getByRole('checkbox', { name: 'View invoices' })).toBeInTheDocument();
  },
};

// States: a disabled item cannot be checked; the whole list disabled.
export const Disabled: Story = {
  args: { defaultValue: ['invoices.view'], disabled: true },
  play: async ({ canvas, canvasElement }) => {
    await expect(within(side(canvasElement, 'Available')).getByRole('checkbox', { name: 'Edit invoices' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Move to Selected' })).toBeDisabled();
  },
};

// Stress: min width 512, a long title and long labels truncate, 60 items scroll. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div className="w-[512px]"><Story /></div>],
  args: {
    leftTitle: 'Permissions available for the finance team in every region',
    items: Array.from({ length: 60 }, (_, i) => ({ value: `p${i}`, label: i === 0 ? 'Approve invoices above the regional limit for every subsidiary' : `Permission ${i + 1}` })),
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="transfer-list"]')!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(512);
    const title = canvasElement.querySelector<HTMLElement>('[data-side="available"] h3')!;
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    const list = canvasElement.querySelector<HTMLElement>('[data-side="available"] [data-slot="transfer-list-items"]')!;
    await expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    const label = list.querySelector<HTMLElement>('label')!;
    await expect(Math.round(label.getBoundingClientRect().height)).toBe(20);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, args: { defaultValue: ['invoices.view'] } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, args: { defaultValue: ['invoices.view'] } };
