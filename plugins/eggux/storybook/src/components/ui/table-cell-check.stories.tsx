import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { TableCellCheck, TableCellSelect } from './table-cell-check';

const meta = {
  title: 'Components/Table/Table Cell Check',
  component: TableCellCheck,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Plan comparison value in a table cell: included (check), excluded (dash) or a text value such as "Unlimited", with an optional muted note ("per seat"). Excluded shows a dash, never a blank cell; screen readers get "Included" or "Not included", not the icon. TableCellSelect is the row-select and select-all checkbox (built from Checkbox) with a name; the header is indeterminate when some rows are selected. Figma: Table page / Table Cell Check. Guide: eggux build-ui/components/table.md' } },
  },
  args: { value: 'included' },
} satisfies Meta<typeof TableCellCheck>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

const inCell = (width: number) => (Story: React.ComponentType) => (
  <table className="table-fixed border-collapse text-sm text-foreground" style={{ width }}>
    <tbody><tr><td className="p-0"><Story /></td></tr></tbody>
  </table>
);

// Figma Value=included: 16 x 20, icon 16, name "Included" for screen readers.
export const Default: Story = {
  decorators: [inCell(160)],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="table-cell-check"]') as HTMLElement;
    await expect(Math.round(box(root).height)).toBe(20);
    const icon = canvasElement.querySelector('[data-slot="table-cell-check-icon"]') as HTMLElement;
    await expect(Math.round(box(icon).width)).toBe(16);
    await expect(Math.round(box(icon).height)).toBe(16);
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByText('Included')).toBeInTheDocument();
  },
};

const plans = ['Starter', 'Team', 'Business'];
// The 3 Figma variants and the note, in a feature matrix.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <table className="w-[480px] border-collapse text-sm text-foreground">
      <thead>
        <tr><th scope="col" className="p-2 text-left font-medium">Feature</th>{plans.map(p => <th key={p} scope="col" className="p-2 text-left font-medium">{p}</th>)}</tr>
      </thead>
      <tbody>
        <tr><th scope="row" className="p-2 text-left font-normal">Invoices</th><td className="p-2"><TableCellCheck value="included" /></td><td className="p-2"><TableCellCheck value="included" /></td><td className="p-2"><TableCellCheck value="included" /></td></tr>
        <tr><th scope="row" className="p-2 text-left font-normal">Audit log</th><td className="p-2"><TableCellCheck value="excluded" /></td><td className="p-2"><TableCellCheck value="excluded" /></td><td className="p-2"><TableCellCheck value="included" /></td></tr>
        <tr><th scope="row" className="p-2 text-left font-normal">Storage</th><td className="p-2"><TableCellCheck value="text" text="10 GB" /></td><td className="p-2"><TableCellCheck value="text" text="100 GB" showNote note="per seat" /></td><td className="p-2"><TableCellCheck value="text" text="Unlimited" /></td></tr>
      </tbody>
    </table>
  ),
  play: async ({ canvasElement, canvas }) => {
    const cells = Array.from(canvasElement.querySelectorAll('[data-slot="table-cell-check"]')) as HTMLElement[];
    await expect(cells).toHaveLength(9);
    for (const c of cells) await expect(Math.round(box(c).height)).toBe(20);
    await expect(canvas.getAllByText('Included')).toHaveLength(4);
    await expect(canvas.getAllByText('Not included')).toHaveLength(2);
    // Colors: check is foreground, dash and note are muted.
    const color = (cls: string) => {
      const p = document.createElement('span');
      p.className = cls;
      canvasElement.appendChild(p);
      const c = getComputedStyle(p).color;
      p.remove();
      return c;
    };
    const icons = Array.from(canvasElement.querySelectorAll('[data-slot="table-cell-check-icon"]')) as HTMLElement[];
    await expect(getComputedStyle(icons[0]).color).toBe(color('text-foreground'));
    await expect(getComputedStyle(icons[3]).color).toBe(color('text-muted-foreground'));
    const note = canvasElement.querySelector('[data-slot="table-cell-check-note"]') as HTMLElement;
    await expect(getComputedStyle(note).color).toBe(color('text-muted-foreground'));
    const value = note.previousElementSibling as HTMLElement;
    await expect(getComputedStyle(value).color).toBe(color('text-foreground'));
    await expect(Math.round(box(note).left - box(value).right)).toBe(8);
  },
};

const invoices = ['INV-1024', 'INV-1025', 'INV-1026'];
function Selectable() {
  const [sel, setSel] = React.useState<string[]>([]);
  const all = sel.length === invoices.length;
  return (
    <table className="w-[320px] border-collapse text-sm text-foreground">
      <thead>
        <tr>
          <th scope="col" className="w-10 p-2"><TableCellSelect all name="invoices" checked={all ? true : sel.length ? 'indeterminate' : false} onCheckedChange={v => setSel(v === true ? invoices : [])} /></th>
          <th scope="col" className="p-2 text-left font-medium">Invoice</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map(id => (
          <tr key={id}>
            <td className="p-2"><TableCellSelect name={id} checked={sel.includes(id)} onCheckedChange={v => setSel(s => (v === true ? [...s, id] : s.filter(x => x !== id)))} /></td>
            <th scope="row" className="p-2 text-left font-normal">{id}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Row select and select-all: named checkboxes, header indeterminate when some rows are selected.
export const Select: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Selectable />,
  play: async ({ canvas }) => {
    const header = canvas.getByRole('checkbox', { name: 'Select all invoices' });
    await expect(header).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select INV-1024' }));
    await expect(header).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(header);
    await expect(canvas.getByRole('checkbox', { name: 'Select INV-1026' })).toBeChecked();
    await expect(header).toBeChecked();
    // Keyboard: Space toggles the focused row.
    const row = canvas.getByRole('checkbox', { name: 'Select INV-1025' });
    row.focus();
    await userEvent.keyboard(' ');
    await expect(row).not.toBeChecked();
    await expect(header).toHaveAttribute('aria-checked', 'mixed');
  },
};

// Stress: a long note ends with an ellipsis (max 96) in a 276 px column.
export const LongContent: Story = { tags: ['!dev'],
  args: { value: 'text', text: 'Unlimited', showNote: true, note: 'per seat per month billed annually' },
  decorators: [inCell(276)],
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="table-cell-check"]') as HTMLElement;
    const note = canvasElement.querySelector('[data-slot="table-cell-check-note"]') as HTMLElement;
    await expect(Math.round(box(root).height)).toBe(20);
    await expect(Math.round(box(note).width)).toBeLessThanOrEqual(96);
    await expect(note.scrollWidth).toBeGreaterThan(note.clientWidth);
    await expect(getComputedStyle(note).textOverflow).toBe('ellipsis');
  },
};

export const VariantsDark: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Dark' } };
export const VariantsCorporateLight: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
