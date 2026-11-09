import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { BoxPlot, BulletChart, DashboardWidget, RadarChart, RadialChart, boxStats, type BoxGroup } from './charts-extra';
import { ChartLegend, ChartLegendItem } from './charts';
import { DropdownMenuItem } from './dropdown-menu';
import { Sparkline } from './sparkline';

const k = (v: number) => `${Math.round(v)}k`;
const hours = (v: number) => (v === 0 ? '0' : `${v}h`);
const response: BoxGroup[] = [
  { label: 'Email', min: 2, q1: 5, median: 8, q3: 12, max: 18, outliers: [22] },
  { label: 'Chat', min: 0.5, q1: 1, median: 2, q3: 3, max: 5, outliers: [9] },
  { label: 'Phone', min: 0.5, q1: 1.5, median: 3, q3: 4, max: 7 },
  { label: 'Social', min: 1, q1: 3, median: 5, q3: 9, max: 14, outliers: [20] },
  { label: 'Forum', min: 3, q1: 6, median: 10, q3: 15, max: 21 },
];
const axes = ['Speed', 'Accuracy', 'Cost', 'Support', 'Security', 'Ease of use'];
const vendors = [
  { label: 'Ledgerly', values: [90, 70, 80, 50, 65, 85] },
  { label: 'Countwise', values: [60, 85, 45, 70, 90, 50] },
];

const meta = {
  title: 'Components/Chart/Bullet, Radar, Radial, Box Plot',
  component: BulletChart,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Bullet Chart: one measure against its target and bands (poor, fair, good) in one line; stack several with the same max. Radar Chart: 1-3 items across 5-8 qualities on one scale. Radial Chart: progress to a goal as one ring, or up to 3 concentric rings. Box Plot: spread per group (quartiles, median, whiskers to 1.5 × the box, outliers); `boxStats` builds a group from raw values. Dashboard Widget: a movable tile with drag handle, refresh, expand and menu. Figma: Chart page. Guide: eggux build-ui/components/charts.md' } },
  },
  args: { title: 'Revenue', unit: 'EUR, this quarter', value: 412, target: 480, ranges: [270, 450, 600], max: 765, formatValue: k },
  render: args => <div className="w-[640px]"><BulletChart {...args} /></div>,
} satisfies Meta<typeof BulletChart>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 640 × 38; bands 35%, 59%, 78%; value bar 8 high to 54%; target 20 high at 63%.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: 'Revenue' });
    await expect(Math.round(box(fig).height)).toBe(38);
    await expect(fig).toHaveTextContent('412k');
    await expect(fig).toHaveTextContent('target 480k');
    await expect(fig).toHaveTextContent('Fair');
    await expect(canvasElement.querySelectorAll('[data-slot="bullet-band"]')).toHaveLength(3);
    const track = box(canvasElement.querySelector('[data-slot="bullet-track"]')!);
    const bar = box(canvasElement.querySelector('[data-slot="bullet-value"]')!);
    await expect(Math.round(bar.height)).toBe(8);
    await expect(Math.abs(bar.width / track.width - 412 / 765)).toBeLessThan(0.01);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="bullet-target"]')!).height)).toBe(20);
  },
};

// Several bullets on one scale, for a KPI review.
export const BulletStack: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[640px] flex-col gap-4">
      <BulletChart title="Revenue" unit="EUR, this quarter" value={412} target={480} ranges={[270, 450, 600]} max={765} formatValue={k} />
      <BulletChart title="New customers" unit="this quarter" value={318} target={300} ranges={[150, 250, 400]} max={500} formatValue={v => String(v)} />
      <BulletChart title="Support SLA" unit="% answered in 4h" value={71} target={90} ranges={[70, 85, 100]} max={100} formatValue={v => `${v}%`} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('figure')).toHaveLength(3);
    await expect(canvas.getByRole('figure', { name: 'New customers' })).toHaveTextContent('Good');
    await expect(canvas.getByRole('figure', { name: 'Support SLA' })).toHaveTextContent('Fair');
  },
};

// Figma: 360 × 320 drawing, 6 axes, 4 grid rings; arrows read one axis for every series.
export const Radar: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[360px]"><RadarChart label="Vendor scores" axes={axes} series={vendors} /></div>,
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: 'Vendor scores' });
    const plot = within(fig).getByRole('group');
    await expect(Math.round(box(plot).height)).toBe(320);
    await expect(canvasElement.querySelectorAll('[data-slot="radar-grid"]')).toHaveLength(4);
    await expect(canvasElement.querySelectorAll('[data-slot="radar-series"]')).toHaveLength(2);
    await expect(within(fig).getByRole('table', { hidden: true })).toHaveTextContent('Speed9060');
    plot.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvasElement.querySelector('[data-slot="chart-tooltip"]')).toHaveTextContent('SpeedLedgerly90Countwise60');
    await expect(canvasElement.querySelectorAll('[data-slot="chart-dot"]')).toHaveLength(2);
    await userEvent.keyboard('{ArrowLeft}{Escape}');
    await expect(canvasElement.querySelector('[data-slot="chart-tooltip"]')).toBeNull();
  },
};

// Figma: 200 × 200; single ring 72%, concentric 3 rings with a legend next to it.
export const Radial: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-10">
      <RadialChart label="Q4 revenue goal" rings={[{ label: 'Revenue', value: 72 }]} caption="of goal" />
      <div className="flex items-center gap-6">
        <RadialChart label="Goals this quarter" rings={[{ label: 'Revenue', value: 72 }, { label: 'New customers', value: 85 }, { label: 'Retention', value: 50 }]} caption="of goal" />
        <ChartLegend className="w-auto flex-col items-start">
          <ChartLegendItem series={0} label="Revenue" value="72%" />
          <ChartLegendItem series={1} label="New customers" value="85%" />
          <ChartLegendItem series={2} label="Retention" value="50%" />
        </ChartLegend>
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const single = canvas.getByRole('figure', { name: 'Q4 revenue goal' });
    await expect(Math.round(box(single).width)).toBe(200);
    await expect(Math.round(box(single).height)).toBe(200);
    await expect(single).toHaveTextContent('Revenue: 72% of goal');
    const multi = canvas.getByRole('figure', { name: 'Goals this quarter' });
    await expect(multi).toHaveAttribute('data-type', 'concentric');
    await expect(multi.querySelectorAll('[data-slot="radial-track"]')).toHaveLength(3);
    await expect(canvasElement.querySelectorAll('[data-slot="radial-value"]')).toHaveLength(4);
  },
};

// Figma: 560 wide, 216 plot, ticks 0-24h, outliers as open dots; arrows read one group.
export const BoxPlotChart: Story = {
  parameters: { controls: { disable: true } },
  name: 'Box Plot',
  render: () => <div className="w-[560px]"><BoxPlot label="First response time by channel" groups={response} ticks={[0, 6, 12, 18, 24]} formatValue={hours} /></div>,
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: 'First response time by channel' });
    await expect(Math.round(box(fig).height)).toBe(240);
    await expect(canvasElement.querySelectorAll('[data-slot="box"]')).toHaveLength(5);
    await expect(canvasElement.querySelectorAll('[data-slot="box-outlier"]')).toHaveLength(3);
    await expect(within(fig).getByRole('table', { hidden: true })).toHaveTextContent('Email2h5h8h12h18h22h');
    const plot = within(fig).getByRole('group');
    plot.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvasElement.querySelector('[data-slot="chart-tooltip"]')).toHaveTextContent('Median8h');
    await expect(canvasElement.querySelector('[data-slot="chart-tooltip"]')).toHaveTextContent('Outliers22h');
  },
};

// Figma: 480 × 161 with a Sparkline; refresh, expand and More menu; footer with the last update.
export const Widget: Story = {
  parameters: { controls: { disable: true } },
  name: 'Dashboard Widget',
  render: () => (
    <div className="w-[480px]">
      <DashboardWidget
        title="Invoices paid"
        period="Last 30 days"
        updated="Updated 5 min ago"
        onRefresh={fn()}
        onExpand={fn()}
        menu={<><DropdownMenuItem>Edit widget</DropdownMenuItem><DropdownMenuItem variant="destructive">Remove from dashboard</DropdownMenuItem></>}
      >
        <Sparkline className="w-full" />
      </DashboardWidget>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const widget = canvas.getByRole('region', { name: 'Invoices paid' });
    await expect(Math.abs(Math.round(box(widget).height) - 161)).toBeLessThanOrEqual(2);
    await expect(canvasElement.querySelector('[data-slot="widget-handle"]')).not.toBeNull();
    await expect(canvas.getByRole('button', { name: 'Refresh Invoices paid' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Expand Invoices paid' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'More actions for Invoices paid' }));
    const menu = await within(document.body).findByRole('menu');
    await expect(menu).toHaveTextContent('Remove from dashboard');
    await userEvent.keyboard('{Escape}');
  },
};

// View mode (no handle), refreshing, no footer; a Bullet Chart as content.
export const WidgetStates: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="grid w-[980px] grid-cols-2 gap-4">
      <DashboardWidget title="Revenue vs plan" editing={false} onRefresh={fn()} refreshing>
        <BulletChart title="Revenue" value={412} target={480} ranges={[270, 450, 600]} max={765} formatValue={k} />
      </DashboardWidget>
      <DashboardWidget title="A very long widget title that has to be cut so the buttons keep their place" period="Last 12 months, all entities and currencies" onExpand={fn()}>
        <p className="m-0 text-sm">Content</p>
      </DashboardWidget>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-slot="widget-handle"]')).toHaveLength(1);
    await expect(canvas.getByRole('button', { name: 'Refreshing' })).toHaveAttribute('aria-busy', 'true');
    const expand = canvas.getByRole('button', { name: /^Expand A very long/ });
    await expect(box(expand).right).toBeLessThanOrEqual(box(canvas.getByRole('region', { name: /A very long/ })).right);
  },
};

// boxStats: quartiles, 1.5 × box whiskers, outliers; empty and flat data; radial 0 and 100.
export const EdgeCases: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex w-[560px] flex-col gap-8">
      <BoxPlot label="From raw values" groups={[boxStats('A', [1, 2, 3, 4, 5, 6, 7, 8, 9, 40]), boxStats('Flat', [5, 5, 5, 5])]} />
      <div className="flex gap-4">
        <RadialChart label="Empty" rings={[{ label: 'Done', value: 0 }]} />
        <RadialChart label="Full" rings={[{ label: 'Done', value: 100 }]} caption="done" />
      </div>
      <BulletChart title="Over the scale" value={900} target={480} ranges={[270, 450, 600]} max={765} formatValue={k} />
      <div className="w-[288px]"><RadarChart label="Narrow radar" axes={axes.slice(0, 5)} series={[{ label: 'Plan', values: [0, 100, 50, 120, -5] }]} /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    const raw = boxStats('A', [1, 2, 3, 4, 5, 6, 7, 8, 9, 40]);
    await expect(raw.outliers).toEqual([40]);
    await expect(raw.max).toBe(9);
    await expect(raw.median).toBe(5.5);
    await expect(canvas.getByRole('figure', { name: 'Empty' }).querySelectorAll('[data-slot="radial-value"]')).toHaveLength(0);
    await expect(canvas.getByRole('figure', { name: 'Over the scale' })).toHaveTextContent('Good');
    const narrow = canvas.getByRole('figure', { name: 'Narrow radar' });
    await expect(box(narrow).width).toBeLessThanOrEqual(288);
  },
};

const All = () => (
  <div className="flex w-[640px] flex-col gap-8">
    <BulletChart title="Revenue" unit="EUR, this quarter" value={412} target={480} ranges={[270, 450, 600]} max={765} formatValue={k} />
    <RadarChart label="Vendor scores" axes={axes} series={vendors} />
    <div className="flex gap-6">
      <RadialChart label="Q4 revenue goal" rings={[{ label: 'Revenue', value: 72 }]} caption="of goal" />
      <RadialChart label="Goals" rings={[{ label: 'Revenue', value: 72 }, { label: 'New customers', value: 85 }, { label: 'Retention', value: 50 }]} caption="of goal" />
    </div>
    <BoxPlot label="First response time by channel" groups={response} ticks={[0, 6, 12, 18, 24]} formatValue={hours} />
    <DashboardWidget title="Invoices paid" period="Last 30 days" updated="Updated 5 min ago" onRefresh={() => {}} onExpand={() => {}}>
      <Sparkline className="w-full" />
    </DashboardWidget>
  </div>
);
export const ChartsDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const ChartsCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
