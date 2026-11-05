import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { TableToolbar } from './table-toolbar';
import { Button } from './button';

const onExport = fn();
const onClear = fn();

const Actions = () => (
  <>
    <Button variant="outline" size="sm" onClick={onExport}>Export</Button>
    <Button variant="outline" size="sm">Mark as paid</Button>
    <Button variant="destructive" size="sm">Delete</Button>
  </>
);

const meta = {
  title: 'Components/Table/Table Toolbar',
  component: TableToolbar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Bulk action bar shown above a table while rows are selected: "N selected" plus an Actions slot. The selection text fills (min 128, one line); the row wraps so in narrow tables the Actions drop under it. role="toolbar" with a label, the count is announced when it changes. Figma: Table page / Table Toolbar. Guides: eggux build-ui/components/table.md, patterns/bulk-actions.md' } },
  },
  args: { selection: '2 selected', children: <Actions /> },
  decorators: [Story => <div className="w-[720px] max-w-full"><Story /></div>],
} satisfies Meta<typeof TableToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 720 x 48, muted fill, 12 px side padding, 8 px gap, Buttons size sm (32).
export const Default: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('toolbar', { name: 'Bulk actions' });
    await expect(Math.round(box(bar).width)).toBe(720);
    await expect(Math.round(box(bar).height)).toBe(48);
    await expect(canvas.getByRole('status')).toHaveTextContent('2 selected');
    const probe = document.createElement('span');
    probe.className = 'bg-muted';
    document.body.append(probe);
    await expect(getComputedStyle(bar).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    probe.remove();
    const buttons = canvas.getAllByRole('button');
    await expect(buttons.map(b => Math.round(box(b).height))).toEqual([32, 32, 32]);
    // Gap between the actions is 8 px.
    await expect(Math.round(box(buttons[1]).left - box(buttons[0]).right)).toBe(8);
    await userEvent.click(canvas.getByRole('button', { name: 'Export' }));
    await expect(onExport).toHaveBeenCalled();
  },
};

// Keyboard: every action is reachable with Tab, in order.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Export' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Mark as paid' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Delete' })).toHaveFocus();
  },
};

export const WithClear: Story = {
  args: { onClear },
  play: async ({ canvas }) => {
    const clear = canvas.getByRole('button', { name: 'Clear selection' });
    await userEvent.click(clear);
    await expect(onClear).toHaveBeenCalled();
  },
};

// Slot: any Buttons; with none the bar shows only the count.
export const NoActions: Story = {
  args: { children: null, selection: '1 selected' },
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole('button')).toHaveLength(0);
    await expect(Math.round(box(canvas.getByRole('toolbar')).height)).toBe(36);
  },
};

// Stress: at 368 px the Actions drop under the selection text and the row wraps.
export const Narrow368: Story = { tags: ['!dev'],
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('toolbar');
    const text = canvas.getByRole('status');
    const actions = bar.querySelector('[data-slot="table-toolbar-actions"]') as HTMLElement;
    await expect(box(actions).top).toBeGreaterThanOrEqual(box(text).bottom - 1);
    await expect(Math.round(box(bar).width)).toBe(368);
    await expect(box(actions).right).toBeLessThanOrEqual(box(bar).right + 1);
  },
};

// Stress: a long selection text stays on one line with an ellipsis (min width 128).
export const LongSelection: Story = { tags: ['!dev'],
  args: { selection: '1,284 invoices selected across all pages of the current filter' },
  decorators: [Story => <div className="w-[560px]"><Story /></div>],
  play: async ({ canvas }) => {
    const text = canvas.getByRole('status');
    await expect(getComputedStyle(text).textOverflow).toBe('ellipsis');
    await expect(Math.round(box(text).height)).toBe(20);
    await expect(Math.round(box(text).width)).toBeGreaterThanOrEqual(128);
  },
};

// Theme copies run in npm test (axe contrast) and stay out of the sidebar.
export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporateLight: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
