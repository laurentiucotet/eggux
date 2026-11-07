import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { BarChart, BarChartHorizontal, ChartCard, ChartLegend, ChartLegendItem, ChartTooltip, ChartTooltipRow, DistributionBar, DonutChart, Gauge, LineChart, type ChartDatum, type ChartSeries } from './charts';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

const series: ChartSeries[] = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'costs', label: 'Costs' },
  { key: 'profit', label: 'Profit' },
];
const data: ChartDatum[] = [
  { label: 'Jan', values: { revenue: 32000, costs: 24000, profit: 8000 } },
  { label: 'Feb', values: { revenue: 41000, costs: 27000, profit: 14000 } },
  { label: 'Mar', values: { revenue: 48000, costs: 31000, profit: 17000 } },
  { label: 'Apr', values: { revenue: 44000, costs: 30000, profit: 14000 } },
  { label: 'May', values: { revenue: 53000, costs: 33000, profit: 20000 } },
  { label: 'Jun', values: { revenue: 58000, costs: 35000, profit: 23000 } },
];
const eur = (v: number) => `€${new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)}`;

const meta = {
  title: 'Components/Chart/Chart Card',
  component: ChartCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Charts drawn from data with the chart/1..8 colors. Bar Chart (single, grouped, stacked) and Line Chart (line, area) share axes with round ticks, a focusable plot (Left / Right read the values in a Chart Tooltip) and a hidden data table. Bar Chart Horizontal ranks categories; Donut Chart shows parts of a whole with values and shares; Distribution Bar is one 100% bar; Gauge shows one number against a target with the status in words. Chart Card frames a chart with title, period actions, legend and an insight, and has loading, empty and error states. Figma: Chart page. Guide: eggux build-ui/components/charts.md' } },
  },
  args: { title: 'Revenue vs costs' },
  render: () => (
    <div className="w-[640px]">
      <ChartCard
        title="Revenue vs costs"
        description="January - June 2026"
        actions={
          <ToggleGroup type="single" variant="outline" defaultValue="6m" aria-label="Period">
            <ToggleGroupItem value="7d" label="7 days" />
            <ToggleGroupItem value="30d" label="30 days" />
            <ToggleGroupItem value="6m" label="6 months" />
          </ToggleGroup>
        }
        legend={<ChartLegend>{series.map((s, i) => <ChartLegendItem key={s.key} series={i} label={s.label} />)}</ChartLegend>}
        insight={{ text: 'Profit up 21% vs last half-year' }}
        note="Costs grew slower than revenue every month since March."
      >
        <BarChart label="Revenue, costs and profit by month, January to June 2026" series={series} data={data} formatValue={eur} />
      </ChartCard>
    </div>
  ),
} satisfies Meta<typeof ChartCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: card 640 × 474, chart 240 (216 plot), 18 bars; arrows show the tooltip; data table for screen readers.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const card = canvas.getByRole('region', { name: 'Revenue vs costs' });
    await expect(Math.abs(Math.round(box(card).height) - 474)).toBeLessThanOrEqual(2);
    const chart = canvas.getByRole('figure', { name: /Revenue, costs and profit/ });
    await expect(Math.round(box(chart).height)).toBe(240);
    await expect(canvasElement.querySelectorAll('[data-slot="chart-bar"]')).toHaveLength(18);
    await expect(within(chart).getByRole('table', { hidden: true })).toHaveTextContent('Mar€48K€31K€17K');
    const plot = within(chart).getByRole('group');
    plot.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    const tip = canvasElement.querySelector('[data-slot="chart-tooltip"]')!;
    await expect(tip).toHaveTextContent('MarRevenue€48KCosts€31KProfit€17K');
    await expect(Math.round(box(tip).width)).toBe(176);
    await userEvent.keyboard('{Escape}');
    await expect(canvasElement.querySelector('[data-slot="chart-tooltip"]')).toBeNull();
  },
};

// Bar types and line / area charts.
export const BarsAndLines: Story = {
  render: () => (
    <div className="grid w-[1160px] grid-cols-2 gap-10">
      <BarChart type="single" label="Revenue by month" series={series} data={data} formatValue={eur} />
      <BarChart type="stacked" label="Costs and profit by month" series={series.slice(1)} data={data} formatValue={eur} />
      <LineChart label="Revenue and costs trend" series={series.slice(0, 2)} data={data} formatValue={eur} />
      <LineChart type="area" label="Revenue trend" series={series} data={data} formatValue={eur} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [single, stacked, line, area] = canvasElement.querySelectorAll('[data-slot="chart"]');
    await expect(single!.querySelectorAll('[data-slot="chart-bar"]')).toHaveLength(6);
    await expect(stacked!.querySelectorAll('[data-slot="chart-bar"]')).toHaveLength(6);
    await expect(line!.querySelectorAll('[data-slot="chart-line"]')).toHaveLength(2);
    await expect(line!.querySelectorAll('[data-slot="chart-dot"]')).toHaveLength(2);
    await expect(area!.querySelector('polygon')).not.toBeNull();
    // Y ticks are round: 0 to 60K for a 58K max.
    await expect(canvas.getAllByText('€60K').length).toBeGreaterThan(0);
  },
};

// Horizontal ranking, donut, distribution bar, gauges and the tooltip on its own.
export const PartsAndProgress: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col gap-10">
      <BarChartHorizontal label="Top customers by revenue" formatValue={v => `€${v.toLocaleString('en')}`} data={[{ label: 'Northwind Traders', value: 24800 }, { label: 'Kestrel', value: 20150 }, { label: 'Fieldstone', value: 13900 }, { label: 'Halcyon', value: 10600 }, { label: 'Quintra', value: 7000 }, { label: 'Brightpath', value: 4150 }]} />
      <DonutChart label="Revenue by entity" total="€1.84M" totalLabel="Revenue" formatValue={eur} data={[{ label: 'Acme Inc. (US)', value: 812000 }, { label: 'Acme Europe', value: 537000 }, { label: 'Acme UK', value: 268000 }, { label: 'Other', value: 222000 }]} />
      <DistributionBar title="Invoices by status" total="1,284 total" data={[{ label: 'Paid', value: 62 }, { label: 'Pending', value: 21 }, { label: 'Overdue', value: 11 }, { label: 'Draft', value: 6 }]} />
      <div className="flex gap-6">
        <Gauge value={72} target={80} label="Q4 revenue vs target" min="€0" max="€2.5M" targetLabel="Target €2.0M of €2.5M" />
        <Gauge value={48} target={75} status="at-risk" label="Support SLA" />
      </div>
      <ChartTooltip title="March 2026">
        <ChartTooltipRow label="Revenue" value="48.2K" />
        <ChartTooltipRow series={1} label="Costs" value="31.0K" />
      </ChartTooltip>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="chart-row"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(16);
    await expect(Math.round(box(canvasElement.querySelector('[data-type="horizontal"]')!).height)).toBe(136);
    const donut = canvas.getByRole('figure', { name: 'Revenue by entity' });
    await expect(donut).toHaveTextContent('Acme Inc. (US)€812K44%');
    await expect(donut.querySelectorAll('[data-slot="chart-segment"]')).toHaveLength(4);
    const dist = canvas.getByRole('figure', { name: 'Invoices by status' });
    await expect(Math.round(box(dist).height)).toBe(72);
    await expect(dist).toHaveTextContent('Paid62%');
    await expect(canvas.getByRole('figure', { name: 'Q4 revenue vs target: 72%, On track' })).toBeInTheDocument();
    await expect(canvas.getByText('At risk')).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('[data-slot="gauge-target"]')).toHaveLength(2);
  },
};

// Chart Card states: loading, empty, error with Try again.
export const States: Story = {
  render: () => (
    <div className="flex w-[640px] flex-col gap-6">
      <ChartCard title="Loading" state="loading" />
      <ChartCard title="Empty" state="empty" />
      <ChartCard title="Error" state="error" onRetry={fn()} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Loading' })).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByText('No data for this period.')).toBeInTheDocument();
    await expect(canvas.getByRole('alert')).toHaveTextContent('The chart could not load.');
    await expect(canvas.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: PartsAndProgress.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: BarsAndLines.render };
export const CardDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
