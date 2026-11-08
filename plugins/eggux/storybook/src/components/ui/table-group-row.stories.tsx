import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { TableGroupRow, type TableGroupRowProps } from './table-group-row';

const meta = {
  title: 'Components/Table/Table Group Row',
  component: TableGroupRow,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Content of a group header row: put it in a cell that spans all columns. State=expanded (chevron down) or collapsed (chevron right). The chevron is a button with aria-expanded and a name ("Collapse Overdue"); the label fills (one line, ellipsis), the count (Badge Count) and the subtotal hug. Figma: Table page / Table Group Row. Guide: eggux build-ui/components/table.md' } },
  },
  args: { state: 'expanded', label: 'Overdue', count: 3, countLabel: '3 invoices', subtotal: 'Subtotal €5,620.00' },
} satisfies Meta<typeof TableGroupRow>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

const inRow = (width: number) => (Story: React.ComponentType) => (
  <table className="table-fixed border-collapse text-sm text-foreground" style={{ width }}>
    <tbody><tr><td className="p-0"><Story /></td></tr></tbody>
  </table>
);

function Stateful(props: TableGroupRowProps) {
  const [open, setOpen] = React.useState(props.state !== 'collapsed');
  return <TableGroupRow {...props} state={open ? 'expanded' : 'collapsed'} onExpandedChange={setOpen} />;
}

// Figma State=expanded: 1200 x 20, chevron 16, gap 8, medium label.
export const Default: Story = {
  decorators: [inRow(1200)],
  render: args => <Stateful {...args} />,
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="table-group-row"]') as HTMLElement;
    await expect(Math.round(box(root).width)).toBe(1200);
    await expect(Math.round(box(root).height)).toBe(20);
    const btn = canvas.getByRole('button', { name: 'Collapse Overdue' });
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(Math.round(box(btn.querySelector('svg')!).width)).toBe(16);
    const label = canvas.getByText('Overdue');
    await expect(getComputedStyle(label).fontWeight).toBe('500');
    await expect(Math.round(box(label).left - box(root).left)).toBe(16 + 8);
    await expect(canvas.getByText('3 invoices')).toBeInTheDocument();
    await expect(canvas.getByText('Subtotal €5,620.00')).toBeInTheDocument();
    await userEvent.click(btn);
    await expect(canvas.getByRole('button', { name: 'Expand Overdue' })).toHaveAttribute('aria-expanded', 'false');
    canvas.getByRole('button', { name: 'Expand Overdue' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: 'Collapse Overdue' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('button', { name: 'Expand Overdue' })).toBeInTheDocument();
  },
};

// The 2 Figma variants. The chevron follows State and is never swapped by hand.
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <table className="w-[640px] table-fixed border-collapse text-sm text-foreground">
      <tbody>
        <tr><td className="p-0"><TableGroupRow state="expanded" label="Overdue" count={3} countLabel="3 invoices" /></td></tr>
        <tr><td className="p-0"><TableGroupRow state="collapsed" label="Paid" count={12} countLabel="12 invoices" subtotal="Subtotal €18,240.00" /></td></tr>
      </tbody>
    </table>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('button', { name: 'Collapse Overdue' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('button', { name: 'Expand Paid' })).toHaveAttribute('aria-expanded', 'false');
    const rows = Array.from(canvasElement.querySelectorAll('[data-slot="table-group-row"]')) as HTMLElement[];
    for (const r of rows) await expect(Math.round(box(r).height)).toBe(20);
    // Badge Count is secondary: probe against the token classes.
    const probe = document.createElement('span');
    probe.className = 'bg-secondary text-secondary-foreground';
    canvasElement.appendChild(probe);
    const badge = canvasElement.querySelector('[data-slot="badge-count"]') as HTMLElement;
    await expect(getComputedStyle(badge).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    probe.remove();
    await expect(Math.round(box(badge).height)).toBe(20);
  },
};

export const NoSubtotal: Story = {
  args: { showSubtotal: false },
  decorators: [inRow(640)],
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/Subtotal/)).toBeNull();
  },
};

// Stress: long label and long subtotal in 276 and 368 px columns: one line, ellipsis, subtotal max 160.
export const LongText: Story = { tags: ['!dev'],
  args: { label: 'Overdue invoices from regional customers awaiting second reminder', subtotal: 'Subtotal €1,234,567,890.00 EUR (all regions)' },
  render: args => (
    <div className="flex flex-col gap-4">
      {[276, 368].map(w => (
        <table key={w} className="table-fixed border-collapse text-sm text-foreground" style={{ width: w }}>
          <tbody><tr><td className="p-0"><TableGroupRow {...args} /></td></tr></tbody>
        </table>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = Array.from(canvasElement.querySelectorAll('[data-slot="table-group-row"]')) as HTMLElement[];
    for (const [i, r] of rows.entries()) {
      await expect(Math.round(box(r).width)).toBe(i === 0 ? 276 : 368);
      await expect(Math.round(box(r).height)).toBe(20);
      const label = r.querySelector('[data-slot="table-group-row-label"]') as HTMLElement;
      const sub = r.querySelector('[data-slot="table-group-row-subtotal"]') as HTMLElement;
      await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
      await expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
      await expect(Math.round(box(label).width)).toBeGreaterThanOrEqual(48);
      await expect(Math.round(box(sub).width)).toBeLessThanOrEqual(160);
    }
  },
};

export const StatesDark: Story = { ...States, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StatesCorporateLight: Story = { ...States, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
