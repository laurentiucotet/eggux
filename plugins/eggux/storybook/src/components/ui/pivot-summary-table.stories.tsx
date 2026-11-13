import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { PivotSummaryTable, type PivotRecord } from './pivot-summary-table';

type Args = { rowCount: number; columnCount: number; currency: 'None' | 'EUR'; showTotals: boolean; heat: boolean; width: number };

const regions = ['North', 'South', 'East', 'West'];
const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];
// East has no sales in Q3 (no record at all).
const values: Record<string, Array<number | undefined>> = {
  North: [12000, 15000, 18000, 21000],
  South: [9000, 8000, 11000, 14000],
  East: [5000, 7000, undefined, 9000],
  West: [16000, 14000, 20000, 25000],
};
const data: PivotRecord[] = regions.flatMap(row => quarters.flatMap((column, i) => (values[row][i] === undefined ? [] : [{ row, column, value: values[row][i] as number }])));

const meta = {
  title: 'Components/Data Structures/Pivot Summary Table',
  parameters: {
    docs: {
      description: {
        component:
          'Records cross-tabulated into rows by columns with a Total row and Total column. A heat tint behind each cell shows its size against the largest cell; the number is always printed. The first column stays put while the table scrolls sideways. Code only (no Figma component yet).',
      },
    },
  },
  args: { rowCount: 4, columnCount: 4, currency: 'EUR', showTotals: true, heat: true, width: 640 },
  argTypes: {
    rowCount: { name: 'Rows', control: { type: 'range', min: 1, max: 4, step: 1 }, description: 'How many regions are shown.', table: { category: 'Data' } },
    columnCount: { name: 'Columns', control: { type: 'range', min: 1, max: 4, step: 1 }, description: 'How many quarters are shown.', table: { category: 'Data' } },
    currency: { name: 'Values as', control: 'inline-radio', options: ['None', 'EUR'], description: 'Plain numbers or euros.', table: { category: 'Data' } },
    showTotals: { name: 'Show totals', control: 'boolean', description: 'The Total row and column.', table: { category: 'Table' } },
    heat: { name: 'Show heat tint', control: 'boolean', description: 'The tint behind each value and its legend.', table: { category: 'Table' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 900, step: 4 }, description: 'Container width in px.', table: { category: 'Table' } },
  },
  render: ({ rowCount, columnCount, currency, showTotals, heat, width }) => (
    <div style={{ width }} className="max-w-full">
      <PivotSummaryTable
        title="Sales by region and quarter"
        rowLabel="Region"
        data={data.filter(d => regions.slice(0, rowCount).includes(d.row) && quarters.slice(0, columnCount).includes(d.column))}
        rowOrder={regions.slice(0, rowCount)}
        columnOrder={quarters.slice(0, columnCount)}
        currency={currency === 'EUR' ? 'EUR' : undefined}
        showTotals={showTotals}
        heat={heat}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    const table = canvas.getByRole('table', { name: 'Sales by region and quarter' });
    await expect(canvas.getByRole('region', { name: /Sales by region and quarter\. Scroll sideways/ })).toHaveAttribute('tabindex', '0');
    await expect(canvas.getByRole('columnheader', { name: 'Q3 2026' })).toBeVisible();
    const row = (name: string) => within(canvas.getByRole('row', { name: new RegExp(`^${name}`) }));
    // Sums by row and by column, and the grand total.
    await expect(row('North').getByText('€66,000')).toBeVisible();
    await expect(row('West').getByText('€75,000')).toBeVisible();
    await expect(row('East').getByText('€21,000')).toBeVisible();
    await expect(row('Total').getByText('€42,000')).toBeVisible();
    await expect(row('Total').getByText('€69,000')).toBeVisible();
    await expect(row('Total').getByText('€204,000')).toBeVisible();
    // The number is always shown, tint or not: every body cell has its text.
    const body = Array.from(table.querySelectorAll('tbody td[data-level]'));
    await expect(body).toHaveLength(16);
    for (const td of body) await expect(td.textContent?.trim()).not.toBe('');
    // The tint follows the value: largest cell darkest, 5,000 lightest, a missing cell none.
    await expect(row('West').getByText('€25,000')).toHaveAttribute('data-level', '4');
    await expect(row('East').getByText('€5,000')).toHaveAttribute('data-level', '1');
    await expect(row('East').getByText('No data').closest('td')).toHaveAttribute('data-level', '0');
    await expect(canvas.getByText('Darker cells have higher values.')).toBeVisible();
    // The first column is sticky.
    await expect(getComputedStyle(canvas.getByRole('rowheader', { name: 'North' })).position).toBe('sticky');
    await expect(canvasElement.querySelectorAll('tfoot tr')).toHaveLength(1);
  },
};

export const OptionsCheck: Story = {
  tags: ['!dev'],
  args: { showTotals: false, heat: false, currency: 'None', rowCount: 2, columnCount: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('columnheader', { name: 'Total' })).toBeNull();
    await expect(canvas.queryByText('Darker cells have higher values.')).toBeNull();
    await expect(canvas.getByRole('cell', { name: '12,000' })).toHaveAttribute('data-level', '0');
    await expect(canvas.queryByRole('rowheader', { name: 'Total' })).toBeNull();
  },
};

export const ScrollRegionCheck: Story = {
  tags: ['!dev'],
  args: { width: 276 },
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: /Sales by region/ });
    await userEvent.tab();
    await expect(region).toHaveFocus();
    // The region scrolls (the keys scroll it in a real browser) and is the first tab stop.
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  args: { width: 276 },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <PivotSummaryTable
      title="Revenue by customer segment and billing period for the whole group"
      rowLabel="Customer segment"
      currency="EUR"
      data={[
        { row: 'Enterprise accounts with multi-year contracts', column: 'First half of 2026', value: 1250000 },
        { row: 'Enterprise accounts with multi-year contracts', column: 'Second half of 2026', value: 1480000 },
        { row: 'Small teams', column: 'First half of 2026', value: 12000 },
        { row: 'Small teams', column: 'Second half of 2026', value: 15000 },
      ]}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="pivot-summary-table"]')!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const region = canvas.getByRole('region', { name: /Scroll sideways/ });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    // The row header stays at the left edge after scrolling.
    region.scrollLeft = 120;
    await waitFor(() => expect(region.scrollLeft).toBeGreaterThan(0));
    const head = canvas.getByRole('rowheader', { name: /Small teams/ });
    await expect(Math.abs(head.getBoundingClientRect().left - region.getBoundingClientRect().left)).toBeLessThanOrEqual(2);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
