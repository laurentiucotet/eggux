import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TableCellStatus } from './table-cell-status';

const meta = {
  title: 'Components/Table/Table Cell Status',
  component: TableCellStatus,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Status in a table cell: a Badge and an optional muted note. One status per row; the label names the state, color supports it. The note ends with an ellipsis so the cell fills its column. Figma: Table page / Table Cell Status. Guide: eggux build-ui/components/table.md' } },
  },
  args: { label: 'Overdue', note: '12 days' },
} satisfies Meta<typeof TableCellStatus>;
export default meta;
type Story = StoryObj<typeof meta>;

const inCell = (width: number) => (Story: React.ComponentType) => (
  <table className={`border-collapse table-fixed text-sm text-foreground`} style={{ width }}>
    <tbody><tr><td className="p-0"><Story /></td></tr></tbody>
  </table>
);


const box = (el: Element) => el.getBoundingClientRect();
const probeStyle = (cls: string) => {
  const probe = document.createElement('span');
  probe.className = cls;
  document.body.append(probe);
  const s = getComputedStyle(probe);
  const out = { bg: s.backgroundColor, color: s.color };
  probe.remove();
  return out;
};

// Figma default: Badge warning with dot "Overdue" plus the note "12 days", 133 x 20.
export const Default: Story = {
  decorators: [inCell(133)],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="table-cell-status"]') as HTMLElement;
    await expect(Math.round(box(root).width)).toBe(133);
    await expect(Math.round(box(root).height)).toBe(20);
    const badge = canvasElement.querySelector('[data-slot="badge"]') as HTMLElement;
    await expect(badge).toHaveTextContent('Overdue');
    await expect(canvas.getByText('12 days')).toBeVisible();
    const ref = probeStyle('bg-warning text-warning-foreground');
    await expect(getComputedStyle(badge).backgroundColor).toBe(ref.bg);
    await expect(getComputedStyle(badge).color).toBe(ref.color);
    // The status is text first: the label is readable text, not only a colored dot.
    await expect(badge.textContent).toBe('Overdue');
  },
};

const statuses = [
  { label: 'Paid', variant: 'success', note: 'Oct 3', cls: 'bg-success text-success-foreground' },
  { label: 'Overdue', variant: 'warning', note: '12 days', cls: 'bg-warning text-warning-foreground' },
  { label: 'Failed', variant: 'destructive', note: 'Card declined', cls: 'bg-destructive text-destructive-foreground' },
  { label: 'Draft', variant: 'soft-neutral', note: 'Not sent', cls: 'bg-[var(--badge-soft-neutral-bg)] text-[var(--badge-soft-neutral-fg)]' },
  { label: 'Sent', variant: 'soft-info', note: 'Today', cls: 'bg-[var(--badge-soft-info-bg)] text-[var(--badge-soft-info-fg)]' },
  { label: 'Paid', variant: 'soft-success', note: 'Oct 3', cls: 'bg-[var(--badge-soft-success-bg)] text-[var(--badge-soft-success-fg)]' },
  { label: 'Due soon', variant: 'soft-warning', note: '3 days', cls: 'bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]' },
  { label: 'Void', variant: 'soft-destructive', note: 'Cancelled', cls: 'bg-[var(--badge-soft-destructive-bg)] text-[var(--badge-soft-destructive-fg)]' },
] as const;

// One row per Badge variant: each Badge keeps its own fill and text color.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <table className="w-[200px] border-collapse text-sm text-foreground">
      <tbody>
        {statuses.map(s => (
          <tr key={s.variant}><td className="py-2"><TableCellStatus label={s.label} variant={s.variant} note={s.note} /></td></tr>
        ))}
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const badges = Array.from(canvasElement.querySelectorAll('[data-slot="badge"]')) as HTMLElement[];
    await expect(badges).toHaveLength(statuses.length);
    for (const [i, s] of statuses.entries()) {
      const ref = probeStyle(s.cls);
      await expect(getComputedStyle(badges[i]).backgroundColor).toBe(ref.bg);
      await expect(getComputedStyle(badges[i]).color).toBe(ref.color);
      await expect(Math.round(box(badges[i]).height)).toBe(20);
    }
  },
};

// Show note off: the Badge alone.
export const WithoutNote: Story = {
  decorators: [inCell(133)],
  args: { showNote: false },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByText('12 days')).toBeNull();
    await expect(canvasElement.querySelector('[data-slot="table-cell-status-note"]')).toBeNull();
    await expect(canvas.getByText('Overdue')).toBeVisible();
  },
};

// Stress: a long note ends with an ellipsis on one line and never pushes the cell wider.
export const LongNote: Story = { tags: ['!dev'],
  decorators: [inCell(133)],
  args: { note: 'Reminder sent twice, customer has not replied since October' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="table-cell-status"]') as HTMLElement;
    const note = canvasElement.querySelector('[data-slot="table-cell-status-note"]') as HTMLElement;
    await expect(Math.round(box(root).height)).toBe(20);
    await expect(note.scrollWidth).toBeGreaterThan(note.clientWidth);
    await expect(getComputedStyle(note).textOverflow).toBe('ellipsis');
    await expect(box(note).right).toBeLessThanOrEqual(box(root).right + 1);
  },
};

// Stress: in a 276 px column the cell shows the Badge and the whole note.
export const Column276: Story = { tags: ['!dev'],
  decorators: [inCell(276)],
  play: async ({ canvas, canvasElement }) => {
    const note = canvasElement.querySelector('[data-slot="table-cell-status-note"]') as HTMLElement;
    await expect(note.scrollWidth).toBeLessThanOrEqual(note.clientWidth);
    await expect(canvas.getByText('12 days')).toBeVisible();
  },
};

// Theme copies run in npm test (axe contrast) and stay out of the sidebar.
export const VariantsDark: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Dark' } };
export const VariantsCorporateLight: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
