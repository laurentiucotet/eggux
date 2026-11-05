import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Archive, Folder, Trash2 } from '@/components/icons';
import { BulkActionBar } from './bulk-action-bar';
import { Button } from './button';

const onClear = fn();
const onSelectAll = fn();

const Actions = () => (
  <>
    <Button variant="outline" size="sm" leadingIcon={<Folder />}>Move</Button>
    <Button variant="outline" size="sm" leadingIcon={<Archive />}>Archive</Button>
    <Button variant="outline" size="sm" leadingIcon={<Trash2 />}>Delete</Button>
  </>
);

const meta = {
  title: 'Components/Table/Bulk Action Bar',
  component: BulkActionBar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Floating bar while items are selected in a card grid, board, gallery or inbox: count (announced politely), optional "Select all 48" link, Separator, Actions slot (outline sm Buttons with icons, 3 at most) and Clear. role="toolbar" labelled "Bulk actions"; Escape or Clear empties the selection. Popover surface, radius lg, shadow lg. Tables use Table Toolbar instead. Figma: Table page / Bulk Action Bar. Guides: eggux build-ui/components/table.md, patterns/bulk-actions.md' } },
  },
  args: { selection: '3 selected', children: <Actions />, onClear, onSelectAll },
} satisfies Meta<typeof BulkActionBar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 467 x 50 (border 1 + padding 8 + 32 control), gap 12, left padding 16, right 8.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('toolbar', { name: 'Bulk actions' });
    await expect(Math.round(box(bar).height)).toBe(50);
    await expect(Math.round(box(bar).width)).toBeGreaterThan(420);
    await expect(Math.round(box(bar).width)).toBeLessThan(520);
    await expect(canvas.getByRole('status')).toHaveTextContent('3 selected');
    await expect(canvas.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    // Surface tokens.
    const probe = document.createElement('div');
    probe.className = 'bg-popover border-border border';
    canvasElement.appendChild(probe);
    await expect(getComputedStyle(bar).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    await expect(getComputedStyle(bar).borderTopColor).toBe(getComputedStyle(probe).borderTopColor);
    probe.remove();
    await expect(Math.round(box(canvas.getByRole('button', { name: 'Move' })).height)).toBe(32);
    const clear = canvas.getByRole('button', { name: 'Clear selection' });
    await expect(Math.round(box(clear).width)).toBe(32);
    const sep = canvasElement.querySelector('[data-slot="separator"]') as HTMLElement;
    await expect(Math.round(box(sep).height)).toBe(24);
    await expect(Math.round(box(sep).width)).toBe(1);
    await userEvent.click(clear);
    await expect(onClear).toHaveBeenCalled();
  },
};

// Show select all: the link sits after the count, before the Separator.
export const SelectAll: Story = {
  args: { showSelectAll: true },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('button', { name: 'Select all 48' });
    await userEvent.click(link);
    await expect(onSelectAll).toHaveBeenCalled();
    await expect(Math.round(box(link).height)).toBe(32);
    await expect(Math.round(box(canvas.getByRole('toolbar')).height)).toBe(50);
  },
};

export const NoClear: Story = {
  args: { showClear: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Clear selection' })).toBeNull();
  },
};

function Live() {
  const [n, setN] = React.useState(1);
  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="outline" size="sm" onClick={() => setN(c => c + 1)}>Select another</Button>
      {n > 0 && <BulkActionBar selection={`${n} selected`} onClear={() => setN(0)}><Actions /></BulkActionBar>}
    </div>
  );
}

// The count updates in the live region; Tab reaches every control; Escape clears.
export const Interactive: Story = {
  render: () => <Live />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('1 selected');
    await userEvent.click(canvas.getByRole('button', { name: 'Select another' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('2 selected');
    canvas.getByRole('button', { name: 'Select another' }).focus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Move' })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Clear selection' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('toolbar')).toBeNull();
  },
};

// Stress: phones (under 480) use icon buttons for the actions so the bar fits 368 px.
export const Narrow: Story = { tags: ['!dev'],
  args: {
    selection: '1,284 selected',
    children: (
      <>
        <Button variant="ghost" size="icon-sm" aria-label="Move" title="Move"><Folder aria-hidden="true" /></Button>
        <Button variant="ghost" size="icon-sm" aria-label="Archive" title="Archive"><Archive aria-hidden="true" /></Button>
        <Button variant="ghost" size="icon-sm" aria-label="Delete" title="Delete"><Trash2 aria-hidden="true" /></Button>
      </>
    ),
  },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('toolbar');
    await expect(Math.round(box(bar).width)).toBeLessThanOrEqual(368);
    await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth + 1);
    await expect(canvas.getByRole('status')).toHaveTextContent('1,284 selected');
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporateLight: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
