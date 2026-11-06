import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { SkeletonPreset } from './skeleton-preset';

const meta = {
  title: 'Components/Skeleton/Skeleton Preset',
  component: SkeletonPreset,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Ready-made loading placeholders in the shape of the content they stand for (list-row, card, table-row, stat, chart); each fills its column, repeat rows 3 to 5 times in one aria-busy region and show only after ~300 ms. Figma: Skeleton / Skeleton Preset. Guide: eggux build-ui/components/skeleton.md, patterns/loading-states.md' } },
  },
} satisfies Meta<typeof SkeletonPreset>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const presets = (root: HTMLElement) => Array.from(root.querySelectorAll('[data-slot="skeleton-preset"]')) as HTMLElement[];

export const Default: Story = {
  args: { type: 'list-row', label: 'Loading customers' },
  decorators: [Story => <div className="w-[360px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const status = canvas.getByRole('status', { name: 'Loading customers' });
    await expect(status).toHaveAttribute('aria-busy', 'true');
    // Figma: 360 × 64; circle 40, trailing value 48 × 16.
    await expect(size(status)).toEqual([360, 64]);
    const shapes = Array.from(canvasElement.querySelectorAll('[data-slot="skeleton"]'));
    await expect(shapes.every(s => s.getAttribute('aria-hidden') === 'true')).toBe(true);
    await expect(size(shapes[0])).toEqual([40, 40]);
    await expect(size(shapes[3])).toEqual([48, 16]);
    // Pulses, unless the viewer prefers reduced motion.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await expect(getComputedStyle(shapes[0]).animationName === 'none').toBe(reduce);
  },
};

// Figma Type at the component widths: list-row 360 × 64, card 320 × 298, table-row 720 × 57,
// stat 280 × 126, chart 480 × 288.
export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      <div className="w-[360px]"><SkeletonPreset type="list-row" /></div>
      <div className="w-[320px]"><SkeletonPreset type="card" /></div>
      <div className="w-[720px]"><SkeletonPreset type="table-row" /></div>
      <div className="w-[280px]"><SkeletonPreset type="stat" /></div>
      <div className="w-[480px]"><SkeletonPreset type="chart" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [row, card, tableRow, stat, chart] = presets(canvasElement);
    await expect(size(row)).toEqual([360, 64]);
    await expect(size(card)).toEqual([320, 298]);
    await expect(size(tableRow)).toEqual([720, 57]);
    await expect(size(stat)).toEqual([280, 126]);
    await expect(size(chart)).toEqual([480, 288]);
    // Decorative without a label.
    for (const p of [row, card, tableRow, stat, chart]) await expect(p).toHaveAttribute('aria-hidden', 'true');
    // Card: block 286 × 160 (320 - 1 px border and 16 padding each side). Chart: 10 bars, the tallest 144, in a 160 high area; 4 axis labels.
    await expect(size(card.querySelector('[data-shape="block"]')!)).toEqual([286, 160]);
    const bars = chart.querySelectorAll('[data-slot="skeleton-preset-bars"] > *');
    await expect(bars.length).toBe(10);
    await expect(Math.round(bars[5].getBoundingClientRect().height)).toBe(144);
    await expect(chart.querySelectorAll('[data-slot="skeleton-preset-axis"] > *').length).toBe(4);
    // Table row: name fills (720 - 32 padding - 5 gaps × 16 - 16 - 32 - 72 - 96 - 64 = 328).
    const name = tableRow.querySelectorAll('[data-slot="skeleton"]')[2];
    await expect(size(name)).toEqual([328, 16]);
  },
};

// Figma "Example / Skeleton presets": a dashboard while it loads. One aria-busy region, one
// "Loading…" announcement, rows repeated 3 to 4 times.
export const DashboardLoading: Story = {
  render: () => (
    <section aria-label="Dashboard" aria-busy="true" className="flex w-[896px] max-w-full flex-col gap-6">
      <p role="status" className="sr-only">Loading…</p>
      <div className="grid grid-cols-3 gap-4">
        <SkeletonPreset type="stat" />
        <SkeletonPreset type="stat" />
        <SkeletonPreset type="stat" />
      </div>
      <div className="flex items-start gap-4">
        <SkeletonPreset type="chart" className="min-w-0 flex-1" />
        <div className="w-[320px] shrink-0 overflow-hidden rounded-xl border border-border">
          {[0, 1, 2, 3].map(i => <SkeletonPreset key={i} type="list-row" className="min-w-0" />)}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        {[0, 1, 2].map(i => <SkeletonPreset key={i} type="table-row" />)}
      </div>
    </section>
  ),
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole('region', { name: 'Dashboard' });
    await expect(region).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getAllByRole('status')).toHaveLength(1);
    await expect(presets(canvasElement)).toHaveLength(11);
    await expect(size(presets(canvasElement)[0])).toEqual([288, 126]);
    // Keyboard: nothing in a loading region takes focus.
    await userEvent.tab();
    await expect(region.contains(document.activeElement)).toBe(false);
  },
};

// Stress test: list-row at a 1/4 column (276) and at its 240 minimum; every type at its minimum
// width. Nothing overflows: the footnote line shrinks to its column instead of running under
// the trailing value.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <div className="w-[276px]" data-testid="col-276"><SkeletonPreset /></div>
      <div className="w-[240px]" data-testid="col-240"><SkeletonPreset /></div>
      <div className="w-[220px]" data-testid="card-min"><SkeletonPreset type="card" /></div>
      <div className="w-[480px]" data-testid="table-min"><SkeletonPreset type="table-row" /></div>
      <div className="w-[160px]" data-testid="stat-min"><SkeletonPreset type="stat" /></div>
      <div className="w-[320px]" data-testid="chart-min"><SkeletonPreset type="chart" /></div>
      <div className="w-[120px]" data-testid="too-narrow"><SkeletonPreset type="stat" /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const id of ['col-276', 'col-240', 'card-min', 'table-min', 'stat-min', 'chart-min']) {
      const col = canvas.getByTestId(id);
      const preset = col.firstElementChild as HTMLElement;
      await expect(Math.round(preset.getBoundingClientRect().width)).toBe(Math.round(col.getBoundingClientRect().width));
      // No shape sticks out of its preset.
      const box = preset.getBoundingClientRect();
      for (const s of Array.from(preset.querySelectorAll('[data-slot="skeleton"]'))) {
        await expect(Math.round(s.getBoundingClientRect().right)).toBeLessThanOrEqual(Math.round(box.right));
      }
    }
    // list-row at 240: lines column 88 wide, footnote line clamps to it and ends before the value.
    const row = canvas.getByTestId('col-240').firstElementChild as HTMLElement;
    const lines = row.querySelector('[data-slot="skeleton-preset-lines"]') as HTMLElement;
    await expect(Math.round(lines.getBoundingClientRect().width)).toBe(88);
    const [, , footnote, value] = Array.from(row.querySelectorAll('[data-slot="skeleton"]'));
    await expect(footnote.getBoundingClientRect().right).toBeLessThanOrEqual(value.getBoundingClientRect().left);
    // Below the minimum width the preset keeps its 160 minimum.
    const narrow = canvas.getByTestId('too-narrow').firstElementChild as HTMLElement;
    await expect(Math.round(narrow.getBoundingClientRect().width)).toBe(160);
    // Heights hold at every width, so nothing moves when content arrives.
    await expect(Math.round(row.getBoundingClientRect().height)).toBe(64);
    await expect(Math.round((canvas.getByTestId('chart-min').firstElementChild as HTMLElement).getBoundingClientRect().height)).toBe(288);
  },
};

export const TypesDark: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Dark' } };
export const TypesCorporate: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
