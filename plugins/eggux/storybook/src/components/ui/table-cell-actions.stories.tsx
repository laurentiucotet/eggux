import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { TableCellActions } from './table-cell-actions';
import { Download, Trash2 } from '@/components/icons';

const onEdit = fn();
const onDownload = fn();
const onDelete = fn();

const items = [
  { label: 'Download PDF', icon: <Download aria-hidden="true" />, onSelect: onDownload },
  { label: 'Send reminder', disabled: true },
  { label: 'Delete invoice', icon: <Trash2 aria-hidden="true" />, destructive: true, onSelect: onDelete },
];

const meta = {
  title: 'Components/Table/Table Cell Actions',
  component: TableCellActions,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Row actions in the last column, right-aligned: one frequent action as an icon button (Show edit) and the rest in a menu (ellipsis). Icon buttons are named by the row ("Edit INV-1024", "Actions for INV-1024"). Figma: Table page / Table Cell Actions. Guide: eggux build-ui/components/table.md' } },
  },
  args: { rowName: 'INV-1024', items, onEdit },
} satisfies Meta<typeof TableCellActions>;
export default meta;
type Story = StoryObj<typeof meta>;

const inCell = (width: number) => (Story: React.ComponentType) => (
  <table className={`border-collapse table-fixed text-sm text-foreground`} style={{ width }}>
    <tbody><tr><td className="p-0"><Story /></td></tr></tbody>
  </table>
);


const box = (el: Element) => el.getBoundingClientRect();

// Figma default: menu only, a 36 x 36 ghost icon button.
export const Default: Story = {
  decorators: [inCell(240)],
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Actions for INV-1024' });
    await expect(Math.round(box(trigger).width)).toBe(36);
    await expect(Math.round(box(trigger).height)).toBe(36);
    await expect(canvas.queryByRole('button', { name: /Edit/ })).toBeNull();
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu', { name: 'Actions for INV-1024' });
    await expect(menu).toBeVisible();
    await expect(screen.getAllByRole('menuitem').map(i => i.textContent)).toEqual(['Download PDF', 'Send reminder', 'Delete invoice']);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Download PDF' }));
    await expect(onDownload).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};

// Show edit: the frequent action next to the menu, 4 px apart, right-aligned in the cell.
export const WithEdit: Story = {
  decorators: [inCell(240)],
  args: { showEdit: true },
  play: async ({ canvas, canvasElement }) => {
    const edit = canvas.getByRole('button', { name: 'Edit INV-1024' });
    const menu = canvas.getByRole('button', { name: 'Actions for INV-1024' });
    await expect(Math.round(box(edit).width)).toBe(36);
    await expect(Math.round(box(menu).left - box(edit).right)).toBe(4);
    const cell = canvasElement.querySelector('td') as HTMLElement;
    await expect(Math.round(box(menu).right)).toBe(Math.round(box(cell).right));
    await userEvent.click(edit);
    await expect(onEdit).toHaveBeenCalled();
  },
};

// Only the edit button (Show menu off).
export const EditOnly: Story = {
  decorators: [inCell(240)],
  args: { showEdit: true, showMenu: false },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
    await expect(canvas.getByRole('button', { name: 'Edit INV-1024' })).toBeVisible();
  },
};

// Keyboard: Tab reaches the buttons; Enter and ArrowDown open the menu, arrows move, Escape closes
// and returns focus to the trigger.
export const Keyboard: Story = {
  decorators: [inCell(240)],
  args: { showEdit: true },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Edit INV-1024' })).toHaveFocus();
    await userEvent.tab();
    const trigger = canvas.getByRole('button', { name: 'Actions for INV-1024' });
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('menu');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Download PDF' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: 'Delete invoice' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('menu');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

// A disabled item is skipped and announced as disabled; a destructive item uses the destructive color.
export const MenuItems: Story = {
  decorators: [inCell(240)],
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for INV-1024' }));
    await screen.findByRole('menu');
    await expect(screen.getByRole('menuitem', { name: 'Send reminder' })).toHaveAttribute('aria-disabled', 'true');
    const probe = document.createElement('span');
    probe.className = 'text-destructive';
    document.body.append(probe);
    await expect(getComputedStyle(screen.getByRole('menuitem', { name: 'Delete invoice' })).color).toBe(getComputedStyle(probe).color);
    probe.remove();
    await userEvent.click(screen.getByRole('menuitem', { name: 'Delete invoice' }));
    await expect(onDelete).toHaveBeenCalled();
  },
};

// Two rows: each button is named by its own row.
export const NamedByRow: Story = {
  render: args => (
    <table className="w-[240px] border-collapse text-sm text-foreground">
      <tbody>
        {['INV-1024', 'INV-1025'].map(n => <tr key={n}><td className="p-0"><TableCellActions {...args} rowName={n} showEdit /></td></tr>)}
      </tbody>
    </table>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Edit INV-1024' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Actions for INV-1025' })).toBeVisible();
  },
};

// Theme copies run in npm test (axe contrast) and stay out of the sidebar.
export const WithEditDark: Story = { ...WithEdit, tags: ['!dev'], globals: { theme: 'Dark' } };
export const WithEditCorporateLight: Story = { ...WithEdit, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
