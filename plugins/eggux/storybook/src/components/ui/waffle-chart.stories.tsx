import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { WaffleChart, waffleCells, type WaffleSegment } from './waffle-chart';

type Args = { parts: number; showLegend: boolean; partial: boolean };

const all: WaffleSegment[] = [
  { label: 'Active', value: 540 },
  { label: 'Paused', value: 180 },
  { label: 'Cancelled', value: 95 },
  { label: 'Trial', value: 60 },
];

const meta = {
  title: 'Components/Data Display/Waffle Chart',
  parameters: {
    docs: {
      description: {
        component:
          'A 10 x 10 grid where each square is one percent of the whole. Cells fill from the bottom left, one part after another, and always add up to 100. A legend gives each part its value and share, and a visually hidden table repeats the numbers, so color is never the only carrier. Code only (no Figma component yet).',
      },
    },
  },
  args: { parts: 3, showLegend: true, partial: false },
  argTypes: {
    parts: { name: 'Parts', control: { type: 'range', min: 1, max: 4, step: 1 }, description: 'How many parts.', table: { category: 'Chart' } },
    partial: { name: 'Partial total', control: 'boolean', description: 'The whole is larger than the parts, so some cells stay empty.', table: { category: 'Chart' } },
    showLegend: { name: 'Show legend', control: 'boolean', description: 'Names, values and shares under the grid.', table: { category: 'Parts' } },
  },
  render: ({ parts, showLegend, partial }) => (
    <div className="w-60 max-w-full">
      <WaffleChart label="Subscriptions by status" segments={all.slice(0, parts)} total={partial ? 1200 : undefined} showLegend={showLegend} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/* Hidden checks */

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('figure', { name: 'Subscriptions by status' })).toBeInTheDocument();
    // Total 815: 540 = 66%, 180 = 22%, 95 = 12%. Cells add up to 100.
    const count = (i: number) => canvasElement.querySelectorAll(`[data-segment="${i}"]`).length;
    await expect([count(0), count(1), count(2)]).toEqual([66, 22, 12]);
    await expect(canvasElement.querySelectorAll('[data-slot="waffle-cell"]')).toHaveLength(100);
    await expect(canvas.getByRole('row', { name: /Paused/ })).toHaveTextContent('22%');
    // Square grid.
    const grid = canvasElement.querySelector('[data-slot="waffle-grid"]')!.getBoundingClientRect();
    await expect(Math.abs(grid.width - grid.height)).toBeLessThanOrEqual(1);
  },
};

export const PartialCheck: Story = {
  tags: ['!dev'],
  args: { partial: true },
  play: async ({ canvasElement }) => {
    // 815 of 1200 = 68 cells filled, 32 empty.
    await expect(canvasElement.querySelectorAll('[data-segment="empty"]')).toHaveLength(32);
  },
};

export const RoundingCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <WaffleChart label="Thirds" segments={[{ label: 'One', value: 1 }, { label: 'Two', value: 1 }, { label: 'Three', value: 1 }]} />,
  play: async ({ canvasElement }) => {
    await expect(waffleCells([1, 1, 1], 3).reduce((a, b) => a + b, 0)).toBe(100);
    await expect(canvasElement.querySelectorAll('[data-segment="empty"]')).toHaveLength(0);
    await expect(waffleCells([0, 0], 0)).toEqual([0, 0]);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <WaffleChart
      label="Orders by channel"
      formatValue={v => `EUR ${v.toLocaleString('en')}`}
      segments={[
        { label: 'Direct sales through the partner reseller network', value: 1284300 },
        { label: 'Web', value: 3 },
        { label: 'Empty', value: 0 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const fig = canvasElement.querySelector('figure')!;
    await expect(fig.scrollWidth).toBeLessThanOrEqual(fig.clientWidth + 1);
    // 3 of 1,284,303 rounds to zero cells: the part exists in the table but has no cell.
    await expect(canvasElement.querySelectorAll('[data-segment="1"]')).toHaveLength(0);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
