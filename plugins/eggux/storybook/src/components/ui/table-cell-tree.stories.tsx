import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { TableCellTree, type TableCellTreeExpander, type TableCellTreeLevel, type TableCellTreeProps } from './table-cell-tree';
import { FileText } from '@/components/icons';

const meta = {
  title: 'Components/Table/Table Cell Tree',
  component: TableCellTree,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'First-column content for tree rows: indent 24 per level (Level 0 to 3), an Expander (collapsed, expanded, none keeps the 20 px space), optional icon, one-line label with an ellipsis. Level 0 is medium weight. The row carries role="treegrid" semantics (aria-level, aria-expanded); ArrowRight / ArrowLeft on the expander expand and collapse. Figma: Table page / Table Cell Tree. Guide: eggux build-ui/components/table.md' } },
  },
  args: { label: 'Marketing', level: 0, expander: 'collapsed' },
} satisfies Meta<typeof TableCellTree>;
export default meta;
type Story = StoryObj<typeof meta>;

const inCell = (width: number) => (Story: React.ComponentType) => (
  <table className={`border-collapse table-fixed text-sm text-foreground`} style={{ width }}>
    <tbody><tr><td className="p-0"><Story /></td></tr></tbody>
  </table>
);


const box = (el: Element) => el.getBoundingClientRect();

// A cell that owns its expanded state, the way a row would.
function Stateful(props: TableCellTreeProps) {
  const [expanded, setExpanded] = React.useState(props.expander === 'expanded');
  return <TableCellTree {...props} expander={expanded ? 'expanded' : 'collapsed'} onExpandedChange={setExpanded} />;
}

// Figma Level=0, Expander=collapsed: 240 x 20, expander 20, gap 6, icon 16, medium label.
export const Default: Story = {
  decorators: [inCell(240)],
  render: args => <Stateful {...args} />,
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="table-cell-tree"]') as HTMLElement;
    await expect(Math.round(box(root).width)).toBe(240);
    await expect(Math.round(box(root).height)).toBe(20);
    const btn = canvas.getByRole('button', { name: 'Expand Marketing' });
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(Math.round(box(btn).width)).toBe(20);
    await expect(Math.round(box(btn).height)).toBe(20);
    const label = canvas.getByText('Marketing');
    await expect(getComputedStyle(label).fontWeight).toBe('500');
    await expect(Math.round(box(label).left - box(root).left)).toBe(20 + 6 + 16 + 6);
    await userEvent.click(btn);
    const open = canvas.getByRole('button', { name: 'Collapse Marketing' });
    await expect(open).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(open);
    await expect(canvas.getByRole('button', { name: 'Expand Marketing' })).toHaveAttribute('aria-expanded', 'false');
  },
};

const levels: TableCellTreeLevel[] = [0, 1, 2, 3];
const expanders: TableCellTreeExpander[] = ['collapsed', 'expanded', 'none'];

// The 12 Figma variants: Level 0 to 3 x Expander. Indent is 24 per level; labels line up with or
// without an expander.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <table className="w-[816px] border-collapse text-sm text-foreground">
      <tbody>
        {levels.map(l => (
          <tr key={l}>
            {expanders.map(e => <td key={e} className="w-[240px] p-0 pr-6"><TableCellTree label={`L${l} ${e}`} level={l} expander={e} /></td>)}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const cells = Array.from(canvasElement.querySelectorAll('[data-slot="table-cell-tree"]')) as HTMLElement[];
    await expect(cells).toHaveLength(12);
    for (const [i, cell] of cells.entries()) {
      const level = Math.floor(i / 3);
      const td = cell.parentElement as HTMLElement;
      const first = cell.firstElementChild as HTMLElement;
      // Indentation per level, measured from the cell edge to the expander slot.
      await expect(Math.round(box(first).left - box(td).left)).toBe(level * 24);
      await expect(Math.round(box(first).width)).toBe(20);
      await expect(Math.round(box(cell).height)).toBe(20);
      const label = cell.querySelector('[data-slot="table-cell-tree-label"]') as HTMLElement;
      await expect(Math.round(box(label).left - box(td).left)).toBe(level * 24 + 20 + 6 + 16 + 6);
      await expect(getComputedStyle(label).fontWeight).toBe(level === 0 ? '500' : '400');
    }
    // Leaf rows (none) have no button; the others do, with a state.
    await expect(canvasElement.querySelectorAll('button[aria-expanded="true"]')).toHaveLength(4);
    await expect(canvasElement.querySelectorAll('button[aria-expanded="false"]')).toHaveLength(4);
  },
};

// A small tree in a treegrid: click and keyboard expand and collapse, rows carry aria-level and aria-expanded.
const data = [
  { id: 'mkt', label: 'Marketing', level: 0 as TableCellTreeLevel, children: ['ads', 'events'] },
  { id: 'ads', label: 'Advertising', level: 1 as TableCellTreeLevel, children: ['search'] },
  { id: 'search', label: 'Search campaigns', level: 2 as TableCellTreeLevel, children: [] },
  { id: 'events', label: 'Events', level: 1 as TableCellTreeLevel, children: [] },
];
function Tree() {
  const [open, setOpen] = React.useState<Record<string, boolean>>({});
  const rows: typeof data = [];
  const walk = (id: string) => {
    const n = data.find(d => d.id === id)!;
    rows.push(n);
    if (open[id]) n.children.forEach(walk);
  };
  walk('mkt');
  return (
    <table role="treegrid" aria-label="Budget" className="w-[320px] table-fixed border-collapse text-sm text-foreground">
      <tbody>
        {rows.map(n => (
          <tr key={n.id} aria-level={n.level + 1} aria-expanded={n.children.length ? !!open[n.id] : undefined} className="h-9 border-b border-border">
            <td className="p-0">
              <TableCellTree
                label={n.label}
                level={n.level}
                expander={n.children.length ? (open[n.id] ? 'expanded' : 'collapsed') : 'none'}
                icon={n.children.length ? undefined : <FileText />}
                onExpandedChange={v => setOpen(o => ({ ...o, [n.id]: v }))}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Tree />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('row')).toHaveLength(1);
    // Click expands.
    await userEvent.click(canvas.getByRole('button', { name: 'Expand Marketing' }));
    await expect(canvas.getAllByRole('row')).toHaveLength(3);
    await expect(canvas.getAllByRole('row')[0]).toHaveAttribute('aria-expanded', 'true');
    // Keyboard: focus the expander, ArrowRight expands, ArrowLeft collapses, Enter toggles.
    const ads = canvas.getByRole('button', { name: 'Expand Advertising' });
    ads.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getAllByRole('row')).toHaveLength(4);
    const labels = canvas.getAllByRole('row').map(r => r.querySelector('[data-slot="table-cell-tree"]') as HTMLElement);
    // Level 2 is indented 48 px further than level 0 and 24 px further than level 1.
    const lefts = labels.map(l => Math.round(box(l.firstElementChild as Element).left));
    await expect(lefts[1] - lefts[0]).toBe(24);
    await expect(lefts[2] - lefts[0]).toBe(48);
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getAllByRole('row')).toHaveLength(3);
    await expect(canvas.getByRole('button', { name: 'Expand Advertising' })).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getAllByRole('row')).toHaveLength(4);
    await userEvent.keyboard(' ');
    await expect(canvas.getAllByRole('row')).toHaveLength(3);
  },
};

// Show icon off, and a swapped icon.
export const Icons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <table className="w-[240px] border-collapse text-sm text-foreground">
      <tbody>
        <tr><td className="p-0"><TableCellTree label="No icon" level={1} expander="none" showIcon={false} /></td></tr>
        <tr><td className="p-0"><TableCellTree label="Invoice terms" level={1} expander="none" icon={<FileText />} /></td></tr>
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const cells = Array.from(canvasElement.querySelectorAll('[data-slot="table-cell-tree"]'));
    await expect(cells[0].querySelectorAll('svg')).toHaveLength(0);
    await expect(cells[1].querySelectorAll('svg')).toHaveLength(1);
  },
};

// Stress: long label ends with an ellipsis on one line; Level 3 in a 276 px column keeps min 192.
export const LongLabel: Story = { tags: ['!dev'],
  args: { label: 'Regional marketing programs and sponsored community events in the northern territories', level: 3, expander: 'collapsed' },
  decorators: [inCell(276)],
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="table-cell-tree"]') as HTMLElement;
    const label = canvasElement.querySelector('[data-slot="table-cell-tree-label"]') as HTMLElement;
    await expect(Math.round(box(root).height)).toBe(20);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
    await expect(Math.round(box(root).width)).toBe(276);
    await expect(Math.round(box(label).width)).toBeGreaterThanOrEqual(48);
  },
};

// Theme copies run in npm test (axe contrast) and stay out of the sidebar.
export const VariantsDark: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Dark' } };
export const VariantsCorporateLight: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
