import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ChartLegend, ChartLegendItem, LineChart, type ChartDatum } from './charts';
import { ComboChart, FunnelChart, Heatmap, ScatterChart, Treemap, WaterfallChart, squarify } from './charts-more';

const eur = (v: number) => `€${new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)}`;
const box = (el: Element) => el.getBoundingClientRect();

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
const heat = [
  [0, 4, 12, 16, 12, 12, 12, 12, 8, 4, 0, 0],
  [4, 8, 12, 16, 16, 12, 12, 16, 12, 4, 0, 0],
  [4, 8, 12, 16, 16, 12, 12, 16, 12, 4, 0, 0],
  [4, 8, 12, 16, 16, 12, 12, 16, 12, 4, 0, 0],
  [0, 4, 8, 12, 12, 8, 8, 12, 8, 0, 0, 0],
  [0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0],
  [0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0],
];

const revenue = [
  { label: 'Subscriptions', value: 883000 },
  { label: 'Services', value: 331000 },
  { label: 'Payments', value: 258000 },
  { label: 'Marketplace', value: 166000 },
  { label: 'Training', value: 110000 },
  { label: 'Support', value: 92000 },
];

const scatter = [
  { label: 'Paid by card', points: [[3.9, 26], [3.5, 27], [3.5, 25], [6.0, 31], [8.9, 44], [8.4, 46], [6.5, 35], [5.1, 35], [9.2, 42], [7.2, 33], [6.0, 31], [3.4, 24], [7.9, 47], [1.2, 27], [0.9, 18], [1.7, 15], [10, 40], [6.4, 29]].map(([x, y], i) => ({ x: x! * 1000, y: y!, label: `INV-${1040 + i}` })) },
  { label: 'Paid by transfer', points: [[4.7, 23], [1.5, 20], [8.9, 40], [8.9, 41], [7.5, 29], [0.2, 5], [0.9, 2], [6.3, 21], [7.6, 25], [7.0, 23], [8.9, 28], [3.9, 26], [1.3, 12], [0.1, 17], [6.5, 34], [0.3, 17]].map(([x, y], i) => ({ x: x! * 1000, y: y!, label: `INV-${2040 + i}` })) },
];

const meta = {
  title: 'Components/Chart/More Charts',
  component: Heatmap,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'More charts from the Chart page. Heatmap: intensity over two dimensions in 5 steps of chart/1 plus muted for zero. Treemap: parts of a whole, area = value, largest top-left. Funnel Chart: drop-off between ordered steps with the conversion from the previous one. Scatter Chart: two numbers per item, one or two series. Waterfall Chart: how a starting total becomes an ending total. Combo Chart: bars and a line on two axes. Line Chart also has step and stacked-area. Every chart has its numbers in text or a hidden table; plots with slots read their values with Left / Right. Figma: Chart page. Guide: eggux build-ui/components/charts.md' } },
  },
  args: { label: 'Invoices created by weekday and hour', rows: days, columns: hours, values: heat },
  render: args => <div className="w-[416px]"><Heatmap {...args} /></div>,
} satisfies Meta<typeof Heatmap>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma 416 × 268: 7 rows of 28 cells, 4 apart; legend Fewer → More; zero is muted.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: 'Invoices created by weekday and hour' });
    await expect(Math.round(box(fig).height)).toBe(268);
    const cells = canvasElement.querySelectorAll('[data-slot="heatmap-cell"]');
    await expect(cells).toHaveLength(84);
    await expect(Math.round(box(cells[0]!).height)).toBe(28);
    await expect(cells[0]).toHaveAttribute('data-step', '0');
    await expect(cells[3]).toHaveAttribute('data-step', '5');
    await expect(canvasElement.querySelectorAll('[data-slot="heatmap-step"]')).toHaveLength(6);
    await expect(within(fig).getByRole('table', { hidden: true })).toHaveTextContent('Sat0004');
    await userEvent.hover(cells[3]!);
    await expect(canvasElement.querySelector('[data-slot="chart-tooltip"]')).toHaveTextContent('Mon, 11');
  },
};

// Treemap 560 × 320: Subscriptions takes the left column, the rest fill to the right.
export const TreemapChart: Story = {
  render: () => <div className="w-[560px]"><Treemap label="Revenue by product" data={revenue} formatValue={eur} /></div>,
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: 'Revenue by product' });
    await expect(Math.round(box(fig).height)).toBe(320);
    const cells = canvasElement.querySelectorAll('[data-slot="treemap-cell"]');
    await expect(cells).toHaveLength(6);
    const first = box(cells[0]!);
    await expect(Math.round(first.height)).toBe(320);
    await expect(Math.abs(first.width - 268)).toBeLessThanOrEqual(3);
    await expect(cells[0]).toHaveTextContent('Subscriptions€883K · 48%');
    await expect(box(cells[1]!).left).toBeGreaterThan(first.right - 1);
  },
};

// Funnel 560 × 200: 4 stages, conversion from the previous step, overall line.
export const Funnel: Story = {
  render: () => (
    <div className="w-[560px]">
      <FunnelChart label="Invoice funnel" summary="65% of created invoices paid" stages={[{ label: 'Created', value: 1240 }, { label: 'Sent', value: 1180 }, { label: 'Viewed', value: 960 }, { label: 'Paid', value: 812 }]} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: 'Invoice funnel' });
    await expect(Math.round(box(fig).height)).toBe(200);
    const bars = canvasElement.querySelectorAll('[data-slot="chart-bar"]');
    await expect(Math.abs(box(bars[0]!).width - 300)).toBeLessThanOrEqual(2);
    await expect(within(fig).getAllByRole('listitem')[1]).toHaveTextContent('Sent1,18095% of the previous step');
    await expect(fig).toHaveTextContent('65% of created invoices paid');
  },
};

// Scatter 560 × 264: two series, ticks 0-60 and 0-10K, arrows read each point.
export const Scatter: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col gap-3">
      <ScatterChart label="Invoice amount vs days to pay" series={scatter} xTitle="X: invoice amount (EUR)" yTitle="Y: days to pay" formatX={eur} />
      <ChartLegend><ChartLegendItem series={0} label="Paid by card" /><ChartLegendItem series={1} label="Paid by transfer" /></ChartLegend>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: 'Invoice amount vs days to pay' });
    await expect(Math.round(box(fig).height)).toBe(264);
    await expect(canvasElement.querySelectorAll('[data-slot="chart-dot"]')).toHaveLength(34);
    await expect(fig).toHaveTextContent('60');
    await expect(fig).toHaveTextContent('€10K');
    within(fig).getByRole('group').focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvasElement.querySelector('[data-slot="chart-tooltip"]')).toHaveTextContent('INV-2053');
  },
};

const cash = [
  { label: 'Opening', value: 120000, total: true },
  { label: 'Collections', value: 86000 },
  { label: 'New sales', value: 42000 },
  { label: 'Payroll', value: -64000 },
  { label: 'Suppliers', value: -38000 },
  { label: 'Tax', value: -12000 },
  { label: 'Closing', value: 134000, total: true },
];

// Waterfall 640 × 284: ticks €75K apart, signed labels, connectors, legend.
export const Waterfall: Story = {
  render: () => <div className="w-[640px]"><WaterfallChart label="Cash, opening to closing, Q3" steps={cash} formatValue={eur} /></div>,
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: 'Cash, opening to closing, Q3' });
    await expect(Math.round(box(fig).height)).toBe(284);
    await expect(fig).toHaveTextContent('€300K');
    await expect(fig).toHaveTextContent('+€86K');
    await expect(fig).toHaveTextContent('−€64K');
    const bars = canvasElement.querySelectorAll('[data-slot="chart-bar"]');
    await expect(Math.round(box(bars[0]!).height)).toBe(80);
    await expect(bars[3]).toHaveAttribute('data-kind', 'decrease');
    await expect(canvasElement.querySelectorAll('[data-slot="waterfall-connector"]')).toHaveLength(6);
    await expect(within(fig).getByRole('table', { hidden: true })).toHaveTextContent('Payroll−€64K€184K');
  },
};

// Combo 640 × 264: bars on 0-800, line on 0-100%, end value labelled.
export const Combo: Story = {
  render: () => (
    <div className="w-[640px]">
      <ComboChart
        label="Invoices sent and paid on time, January to June"
        barLabel="Invoices sent"
        lineLabel="Paid on time"
        data={[{ label: 'Jan', bar: 420, line: 72 }, { label: 'Feb', bar: 465, line: 75 }, { label: 'Mar', bar: 510, line: 78 }, { label: 'Apr', bar: 480, line: 76 }, { label: 'May', bar: 540, line: 81 }, { label: 'Jun', bar: 590, line: 84 }]}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: /Invoices sent and paid on time/ });
    await expect(Math.round(box(fig).height)).toBe(264);
    await expect(fig).toHaveTextContent('800');
    await expect(fig).toHaveTextContent('100%');
    const bars = canvasElement.querySelectorAll('[data-slot="chart-bar"]');
    await expect(Math.round(box(bars[0]!).height)).toBe(105);
    await expect(canvas.getByText('Paid on time (right axis)')).toBeInTheDocument();
    within(fig).getByRole('group').focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvasElement.querySelector('[data-slot="chart-tooltip"]')).toHaveTextContent('JunInvoices sent590Paid on time84%');
  },
};

const months: ChartDatum[] = [
  { label: 'Jan', values: { a: 14000, b: 10000 } },
  { label: 'Feb', values: { a: 16000, b: 12000 } },
  { label: 'Mar', values: { a: 18000, b: 13000 } },
  { label: 'Apr', values: { a: 17000, b: 14000 } },
  { label: 'May', values: { a: 20000, b: 15000 } },
  { label: 'Jun', values: { a: 22000, b: 17000 } },
];

// Line Chart step and stacked-area.
export const LineStepAndStacked: Story = {
  render: () => (
    <div className="grid w-[1160px] grid-cols-2 gap-10">
      <LineChart type="stacked-area" label="New and returning revenue" series={[{ key: 'a', label: 'New' }, { key: 'b', label: 'Returning' }]} data={months} formatValue={eur} />
      <LineChart type="step" label="Seat price" series={[{ key: 'a', label: 'Price' }]} data={months} formatValue={eur} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [stacked, step] = canvasElement.querySelectorAll('[data-slot="chart"]');
    await expect(stacked!.querySelectorAll('[data-slot="chart-area"]')).toHaveLength(2);
    // Stacked: the top tick covers the sum (39K), so 0-40K.
    await expect(within(stacked as HTMLElement).getAllByText('€40K').length).toBe(1);
    const pts = step!.querySelector('polyline')!.getAttribute('points')!.split(' ');
    await expect(pts).toHaveLength(11);
    await expect(canvas.getByRole('figure', { name: 'Seat price' })).toBeInTheDocument();
  },
};

// Edge: squarify keeps every area proportional and inside the box. Tests only.
export const TreemapLayout: Story = {
  tags: ['!dev'],
  render: () => <div className="w-[300px]"><Treemap label="One part" data={[{ label: 'Only', value: 5 }]} height={160} /></div>,
  play: async ({ canvasElement }) => {
    const rects = squarify([50, 25, 12, 8, 5], 1.75);
    const area = rects.reduce((a, r) => a + r.w * r.h, 0);
    await expect(Math.abs(area - 1.75)).toBeLessThan(0.001);
    for (const r of rects) await expect(r.x + r.w).toBeLessThanOrEqual(1.7501);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="treemap-cell"]')!).width)).toBe(300);
  },
};

// Edge: empty heatmap and a one-stage funnel. Tests only.
export const EmptyAndMinimal: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex w-[480px] flex-col gap-6">
      <Heatmap label="No activity" rows={['Mon']} columns={['8', '9']} values={[[0, 0]]} />
      <FunnelChart label="One stage" stages={[{ label: 'A very long stage name that wraps to two lines and then truncates', value: 0 }]} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cells = canvasElement.querySelectorAll('[data-slot="heatmap-cell"]');
    await expect(cells[0]).toHaveAttribute('data-step', '0');
    await expect(canvasElement).toHaveTextContent('0% overall');
  },
};

export const ChartsDark: Story = {
  tags: ['!dev'],
  globals: { theme: 'Dark' },
  render: () => (
    <div className="flex w-[640px] flex-col gap-10">
      <Treemap label="Revenue by product" data={revenue} formatValue={eur} />
      {Waterfall.render!({} as never, {} as never)}
      {meta.render(meta.args)}
    </div>
  ),
};
export const ChartsCorporate: Story = {
  tags: ['!dev'],
  globals: { theme: 'Corporate Light' },
  render: () => (
    <div className="flex w-[640px] flex-col gap-10">
      <Treemap label="Revenue by product" data={revenue} formatValue={eur} />
      {Combo.render!({} as never, {} as never)}
      {Funnel.render!({} as never, {} as never)}
    </div>
  ),
};
