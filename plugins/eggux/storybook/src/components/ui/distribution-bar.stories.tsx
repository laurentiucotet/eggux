import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DistributionBar, type DistributionSegment } from './distribution-bar';

type Args = { size: 'sm' | 'default' | 'lg'; parts: number; showLegend: boolean; showPercent: boolean; width: number };

const all: DistributionSegment[] = [
  { label: 'Starter', value: 1240 },
  { label: 'Team', value: 860 },
  { label: 'Business', value: 410 },
  { label: 'Enterprise', value: 190 },
  { label: 'Trial', value: 95 },
];

const meta = {
  title: 'Components/Data Display/Distribution Bar',
  parameters: {
    docs: {
      description: {
        component:
          'One stacked horizontal bar that splits a total into parts, with a legend that names every part, its value and its share. Parts use the chart colors with a 2 px gap; the numbers are always in text (legend, plus a visually hidden table), so color is never the only carrier. Code only (no Figma component yet).',
      },
    },
  },
  args: { size: 'default', parts: 4, showLegend: true, showPercent: true, width: 480 },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: 'Bar height: 8, 12 or 20 px.', table: { category: 'Bar' } },
    parts: { name: 'Parts', control: { type: 'range', min: 1, max: 5, step: 1 }, description: 'How many parts the total is split into.', table: { category: 'Bar' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 640, step: 4 }, description: 'Container width in px, to see the resize contract.', table: { category: 'Bar' } },
    showLegend: { name: 'Show legend', control: 'boolean', description: 'Names, values and shares under the bar.', table: { category: 'Parts' } },
    showPercent: { name: 'Show percent', control: 'boolean', description: 'The share after each value.', table: { category: 'Parts' } },
  },
  render: ({ size, parts, showLegend, showPercent, width }) => (
    <div style={{ width }} className="max-w-full">
      <DistributionBar label="Customers by plan" segments={all.slice(0, parts)} size={size} showLegend={showLegend} showPercent={showPercent} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A bar with money values and one part that is zero. */
export const Currency: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[480px] max-w-full">
      <DistributionBar
        label="Spend by category, EUR"
        formatValue={v => `EUR ${v.toLocaleString('en')}`}
        segments={[
          { label: 'Infrastructure', value: 12400 },
          { label: 'Support', value: 5200 },
          { label: 'Marketing', value: 3100 },
          { label: 'Training', value: 0 },
        ]}
      />
    </div>
  ),
};

/** Three heights side by side. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[480px] max-w-full flex-col gap-6">
      {(['sm', 'default', 'lg'] as const).map(s => (
        <DistributionBar key={s} label={`Customers by plan, ${s}`} size={s} segments={all.slice(0, 3)} showLegend={s === 'sm'} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heights = [...canvasElement.querySelectorAll('[data-slot="distribution-track"]')].map(t => Math.round(t.getBoundingClientRect().height));
    await expect(heights).toEqual([8, 12, 20]);
  },
};

/* Hidden checks */

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    const fig = canvas.getByRole('figure', { name: 'Customers by plan' });
    await expect(fig).toBeInTheDocument();
    // The table holds every part with value and share (total 2,700 over four parts).
    const row = canvas.getByRole('row', { name: /Starter/ });
    await expect(row).toHaveTextContent('1,240');
    await expect(row).toHaveTextContent('46%');
    await expect(canvas.getAllByRole('row')).toHaveLength(5);
    // Segment widths follow the values.
    const segs = [...canvasElement.querySelectorAll('[data-slot="distribution-segment"]')] as HTMLElement[];
    await expect(segs).toHaveLength(4);
    await expect(segs[0]!.getBoundingClientRect().width).toBeGreaterThan(segs[3]!.getBoundingClientRect().width);
    // The legend is visible text.
    await expect(canvasElement.querySelector('[data-slot="distribution-legend"]')).toHaveTextContent('Enterprise');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <DistributionBar
      label="Revenue by region"
      segments={[
        { label: 'Northern and Eastern Europe, including the Baltic states', value: 1200000 },
        { label: 'Asia', value: 3 },
        { label: 'Americas', value: 800000 },
        { label: 'Empty', value: 0 },
      ]}
    />
  ),
  play: async ({ canvasElement, canvas }) => {
    const fig = canvasElement.querySelector('figure')!;
    await expect(fig.scrollWidth).toBeLessThanOrEqual(fig.clientWidth + 1);
    // A tiny part still shows (min 4 px) and the long label is cut to one line.
    const segs = [...canvasElement.querySelectorAll('[data-slot="distribution-segment"]')] as HTMLElement[];
    await expect(segs).toHaveLength(3);
    await expect(segs[1]!.getBoundingClientRect().width).toBeGreaterThanOrEqual(4);
    await expect(canvas.getByRole('row', { name: /Empty/ })).toHaveTextContent('0%');
  },
};

export const NoLegendCheck: Story = {
  tags: ['!dev'],
  args: { showLegend: false },
  play: async ({ canvas }) => {
    // Without the legend the hidden table still carries the numbers.
    await expect(canvas.getByRole('table', { name: 'Customers by plan' })).toBeInTheDocument();
    await expect(canvas.queryByText('(46%)')).not.toBeInTheDocument();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
