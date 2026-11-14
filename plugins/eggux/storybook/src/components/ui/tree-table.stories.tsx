import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { TreeTable, type TreeTableColumn, type TreeTableRowData } from './tree-table';

type Args = { startWith: 'All open' | 'Top level only' | 'All closed'; showControls: boolean; indent: number; width: number };

const columns: TreeTableColumn[] = [
  { id: 'name', header: 'Work item', width: '50%' },
  { id: 'owner', header: 'Owner', width: '25%' },
  { id: 'budget', header: 'Budget (EUR)', align: 'right', width: '25%' },
];

const rows: TreeTableRowData[] = [
  {
    id: 'site',
    cells: { name: 'Website relaunch', owner: 'Ana Popescu', budget: '120,000' },
    children: [
      {
        id: 'research',
        cells: { name: 'Research', owner: 'Ion Marin', budget: '20,000' },
        children: [
          { id: 'interviews', cells: { name: 'Customer interviews', owner: 'Ion Marin', budget: '8,000' } },
          { id: 'survey', cells: { name: 'Survey', owner: 'Maria Ionescu', budget: '12,000' } },
        ],
      },
      { id: 'design', cells: { name: 'Design', owner: 'Dan Vasile', budget: '40,000' } },
      { id: 'build', cells: { name: 'Build', owner: 'Sara Neagu', budget: '60,000' } },
    ],
  },
  {
    id: 'brand',
    cells: { name: 'Brand refresh', owner: 'Maria Ionescu', budget: '45,000' },
    children: [{ id: 'logo', cells: { name: 'Logo', owner: 'Dan Vasile', budget: '15,000' } }],
  },
  { id: 'audit', cells: { name: 'Annual audit', owner: 'Radu Barbu', budget: '9,500' } },
];

const starts: Record<Args['startWith'], string[] | 'all'> = { 'All open': 'all', 'Top level only': [], 'All closed': [] };

const meta = {
  title: 'Components/Data Structures/Tree Table',
  parameters: {
    docs: {
      description: {
        component:
          'A table whose first column is a tree: indent by level, a chevron on rows with children, Expand all and Collapse all above. ARIA treegrid at row level: Up, Down, Left, Right, Home, End and Enter. Scrolls sideways inside its own region. Code only (no Figma component yet).',
      },
    },
  },
  args: { startWith: 'All open', showControls: true, indent: 20, width: 640 },
  argTypes: {
    startWith: { name: 'Start with', control: 'inline-radio', options: ['All open', 'Top level only', 'All closed'], description: 'Which rows start expanded.', table: { category: 'Table' } },
    showControls: { name: 'Show expand controls', control: 'boolean', description: 'The Expand all and Collapse all buttons.', table: { category: 'Table' } },
    indent: { name: 'Indent per level', control: { type: 'range', min: 8, max: 40, step: 2 }, description: 'Pixels of indent for each level.', table: { category: 'Table' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 900, step: 4 }, description: 'Container width in px.', table: { category: 'Table' } },
  },
  render: ({ startWith, showControls, indent, width }) => (
    <div style={{ width }} className="max-w-full">
      <TreeTable key={startWith} columns={columns} rows={rows} label="Project budget" defaultExpanded={starts[startWith]} showControls={showControls} indent={indent} onRowSelect={fn()} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Closed: a long ledger reads as a short list of groups. */
export const Collapsed: Story = { args: { startWith: 'All closed' }, parameters: { controls: { disable: true } } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [picked, setPicked] = React.useState('none');
    return (
      <>
        <TreeTable columns={columns} rows={rows} label="Project budget" onRowSelect={r => setPicked(r.id)} />
        <p data-testid="picked">{picked}</p>
      </>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('treegrid', { name: 'Project budget' })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('9 of 9 rows shown');
    await expect(canvas.getByRole('region', { name: /Project budget\. Scroll sideways/ })).toHaveAttribute('tabindex', '0');
    const survey = canvas.getByRole('row', { name: /Survey/ });
    await expect(survey).toHaveAttribute('aria-level', '3');
    await expect(survey).not.toHaveAttribute('aria-expanded');
    await expect(canvas.getByRole('row', { name: /Website relaunch/ })).toHaveAttribute('aria-expanded', 'true');
    // The indent grows with the level.
    const pad = (id: string) => parseFloat(canvasElement.querySelector<HTMLElement>(`[data-row="${id}"] td div`)!.style.paddingInlineStart || '0');
    await expect(pad('site')).toBe(0);
    await expect(pad('research')).toBe(20);
    await expect(pad('survey')).toBe(40);
    // Keyboard.
    await userEvent.tab(); // the scroll region
    await userEvent.tab(); // the first row (after the two buttons, which come first in order)
    const rowsEls = canvasElement.querySelectorAll<HTMLElement>('[data-row]');
    rowsEls[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    const research = canvas.getByRole('row', { name: /Research/ });
    await waitFor(() => expect(research).toHaveFocus());
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(research).toHaveAttribute('aria-expanded', 'false'));
    await expect(canvas.queryByRole('row', { name: /Customer interviews/ })).toBeNull();
    await expect(canvas.getByRole('status')).toHaveTextContent('7 of 9 rows shown');
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(research).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowRight}');
    const interviews = await canvas.findByRole('row', { name: /Customer interviews/ });
    await waitFor(() => expect(interviews).toHaveFocus());
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(research).toHaveFocus());
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByRole('row', { name: /Annual audit/ })).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(canvas.getByRole('row', { name: /Website relaunch/ })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('row', { name: /Website relaunch/ })).toHaveAttribute('aria-expanded', 'false'));
    await expect(canvas.getByTestId('picked')).toHaveTextContent('site');
    await expect(canvas.getByRole('status')).toHaveTextContent('4 of 9 rows shown');
    // Buttons.
    await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('9 of 9 rows shown'));
    await expect(canvas.getByRole('button', { name: 'Expand all' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse all' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('3 of 9 rows shown'));
  },
};

export const ChevronCheck: Story = {
  tags: ['!dev'],
  render: () => <TreeTable columns={columns} rows={rows} label="Project budget" defaultExpanded={[]} />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('row')).toHaveLength(4); // header + 3 groups
    const brand = canvas.getByRole('row', { name: /Brand refresh/ });
    await userEvent.click(brand.querySelector('[data-slot="tree-table-chevron"]')!);
    await waitFor(() => expect(brand).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('row', { name: /Logo/ })).toHaveAttribute('aria-level', '2');
    await expect(canvasElement.querySelectorAll('tr[tabindex="0"]')).toHaveLength(1);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <TreeTable
      columns={columns}
      label="Long names"
      rows={[
        {
          id: 'a',
          cells: { name: 'Consolidated group financial statements for all subsidiaries', owner: 'Alexandra Constantinescu-Popescu', budget: '1,250,000,000' },
          children: [{ id: 'b', cells: { name: 'Intercompany eliminations and adjustments', owner: 'Ion', budget: '5' } }],
        },
      ]}
    />
  ),
  play: async ({ canvasElement, canvas }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="tree-table"]')!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    // The table keeps a minimum width and scrolls inside its own region.
    const region = canvas.getByRole('region', { name: /Long names/ });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
