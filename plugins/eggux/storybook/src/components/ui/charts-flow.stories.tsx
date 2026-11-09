import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ChartLegend, ChartLegendItem, LineChart, type ChartDatum } from './charts';
import { ChoroplethMap, SankeyChart, type ChoroplethRegion, type SankeyLink, type SankeyNode } from './charts-flow';

const meta = {
  title: 'Components/Chart/Flows and maps',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Sankey Chart: amounts flowing from sources to outcomes, band width = amount, every node labelled with its share; arrows read the bands. Choropleth Map: values by region as equal tiles shaded light to dark in chart/1 with a Low-High legend. Line Chart Show comparison: the previous period of series 1 as a dashed muted line. Figma: Chart page. Guide: eggux build-ui/components/charts.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const eur = (v: number) => `€${new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)}`;

const nodes: SankeyNode[] = [
  { id: 'card', label: 'Card', column: 0 },
  { id: 'bank', label: 'Bank transfer', column: 0 },
  { id: 'debit', label: 'Direct debit', column: 0 },
  { id: 'paid', label: 'Paid', column: 1 },
  { id: 'overdue', label: 'Overdue', column: 1, color: 'var(--destructive)' },
];
const links: SankeyLink[] = [
  { source: 'card', target: 'paid', value: 45000 },
  { source: 'card', target: 'overdue', value: 5000 },
  { source: 'bank', target: 'paid', value: 25000 },
  { source: 'bank', target: 'overdue', value: 10000 },
  { source: 'debit', target: 'paid', value: 15000 },
];

export const Sankey: Story = {
  render: () => <SankeyChart label="Invoices by payment method and outcome, Q3 2026" nodes={nodes} links={links} formatValue={eur} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const fig = c.getByRole('figure');
    await expect(box(fig).width).toBe(640);
    const plot = c.getByRole('group');
    await expect(box(plot).height).toBe(280);
    const n = canvasElement.querySelectorAll('[data-slot="sankey-node"]');
    await expect(Math.round(box(n[0]).height)).toBe(108);
    await expect(Math.round(box(n[3]).height)).toBe(184);
    await expect(canvasElement.querySelectorAll('[data-slot="sankey-band"]')).toHaveLength(5);
    await expect(c.getByText(/Paid\s+85%/)).toBeVisible();
    plot.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(c.getByText('Card to Paid: €45K, 45%')).toBeInTheDocument();
    await expect(c.getByRole('table')).toBeInTheDocument();
  },
};

const regions: ChoroplethRegion[] = [
  { id: 'nw', label: 'NW', name: 'North-West', value: 42, x: 0, y: 0 },
  { id: 'n', label: 'N', name: 'North', value: 64, x: 1, y: 0 },
  { id: 'ne', label: 'NE', name: 'North-East', value: 86, x: 2, y: 0 },
  { id: 'w', label: 'W', name: 'West', value: 28, x: 0.5, y: 1 },
  { id: 'c', label: 'C', name: 'Centre', value: 100, x: 1.5, y: 1 },
  { id: 'e', label: 'E', name: 'East', value: 60, x: 2.5, y: 1 },
  { id: 'fe', label: 'FE', name: 'Far East', value: 37, x: 3.5, y: 1 },
  { id: 'sw', label: 'SW', name: 'South-West', value: 51, x: 0, y: 2 },
  { id: 's', label: 'S', name: 'South', value: 73, x: 1, y: 2 },
  { id: 'se', label: 'SE', name: 'South-East', value: 33, x: 2, y: 2 },
  { id: 'fs', label: 'FS', name: 'Far South', value: 18, x: 1.5, y: 3 },
];

export const Choropleth: Story = {
  render: () => <ChoroplethMap label="Customers by region" regions={regions} formatValue={(v) => `${v} customers`} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const fig = c.getByRole('figure');
    await expect(box(fig).width).toBe(480);
    await expect(Math.round(box(fig).height)).toBe(328);
    const items = c.getAllByRole('listitem');
    await expect(items).toHaveLength(11);
    await expect(box(items[0]).width).toBe(88);
    await expect(box(items[0]).left - box(fig).left).toBeCloseTo(40, 0);
    await expect(c.getByText('Centre: 100 customers')).toBeInTheDocument();
    await userEvent.hover(items[4]);
    await expect(c.getByText('Centre', { selector: 'p' })).toBeVisible();
  },
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const now = [32, 41, 48, 44, 53, 58];
const before = [24, 30, 36, 33, 38, 43];
const data: ChartDatum[] = months.map((m, i) => ({ label: m, values: { revenue: now[i]! * 1000, previous: before[i]! * 1000 } }));

export const LineComparison: Story = {
  render: () => (
    <div className="flex w-140 flex-col gap-3">
      <ChartLegend>
        <ChartLegendItem label="Revenue" keyType="line" />
        <ChartLegendItem label="Previous period" keyType="dashed" color="var(--muted-foreground)" />
      </ChartLegend>
      <LineChart label="Revenue, January to June 2026, with the previous period" series={[{ key: 'revenue', label: 'Revenue' }]} comparison={{ key: 'previous', label: 'Previous period' }} data={data} formatValue={eur} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const line = canvasElement.querySelector('[data-slot="chart-comparison"]')!;
    await expect(line.getAttribute('stroke-dasharray')).toBe('4 4');
    await expect(canvasElement.querySelectorAll('[data-slot="chart-line"]')).toHaveLength(1);
    await expect(c.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Revenue', 'Previous period']);
    c.getAllByRole('group')[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(c.getByText(/Jan: Revenue €32K, Previous period €24K/)).toBeInTheDocument();
  },
};

export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-8">
      <SankeyChart className="w-[276px]" label="Narrow sankey" nodes={nodes} links={links} />
      <SankeyChart label="One flow" nodes={[{ id: 'a', label: 'Only source with a long name', column: 0 }, { id: 'b', label: 'Only outcome', column: 1 }]} links={[{ source: 'a', target: 'b', value: 1 }]} />
      <ChoroplethMap className="w-60" label="Narrow map" regions={regions} />
      <ChoroplethMap label="Equal values" regions={regions.map((r) => ({ ...r, value: 5 }))} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const figs = canvasElement.querySelectorAll('figure');
    await expect(box(figs[0]).width).toBe(276);
    const one = figs[1].querySelectorAll('[data-slot="sankey-node"]');
    await expect(Math.round(box(one[0]).height)).toBe(240);
    await expect(box(figs[2]).width).toBe(240);
  },
};

const All = () => (
  <div className="flex flex-col gap-8 bg-background p-6">
    <SankeyChart label="Invoices by payment method" nodes={nodes} links={links} />
    <ChoroplethMap label="Customers by region" regions={regions} />
    <div className="w-140">
      <LineChart label="Revenue with the previous period" series={[{ key: 'revenue', label: 'Revenue' }]} comparison={{ key: 'previous', label: 'Previous period' }} data={data} />
    </div>
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
