import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Skeleton } from './skeleton';

const meta = {
  title: 'Components/Skeleton/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Placeholder shapes (text, circle, block) that mirror the real layout while content loads; show only after ~300 ms, the region carries aria-busy, shapes are hidden from screen readers and stop pulsing with reduced motion. Figma: Skeleton / Skeleton. Guide: eggux build-ui/components/skeleton.md, patterns/loading-states.md' } },
  },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};

/** Pulses, unless the viewer prefers reduced motion. */
async function expectMotion(el: Element) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const name = getComputedStyle(el).animationName;
  if (reduce) await expect(name).toBe('none');
  else await expect(name).not.toBe('none');
}

export const Default: Story = {
  args: { shape: 'text' },
  play: async ({ canvasElement }) => {
    const shape = canvasElement.querySelector('[data-slot="skeleton"]') as HTMLElement;
    // Hidden from screen readers; Figma default 240 × 16.
    await expect(shape).toHaveAttribute('aria-hidden', 'true');
    await expect(size(shape)).toEqual([240, 16]);
    await expectMotion(shape);
  },
};

// Figma Shape: text 240 × 16 (radius md), circle 40 (radius full), block 320 × 120 (radius xl).
export const Shapes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-start gap-8">
      <Skeleton shape="text" />
      <Skeleton shape="circle" />
      <Skeleton shape="block" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [text, circle, block] = Array.from(canvasElement.querySelectorAll('[data-slot="skeleton"]'));
    await expect(size(text)).toEqual([240, 16]);
    await expect(size(circle)).toEqual([40, 40]);
    await expect(size(block)).toEqual([320, 120]);
    await expect(getComputedStyle(text).borderTopLeftRadius).toBe('8px');
    await expect(parseFloat(getComputedStyle(circle).borderTopLeftRadius)).toBeGreaterThanOrEqual(20);
    await expect(getComputedStyle(block).borderTopLeftRadius).toBe('12px');
  },
};

// Figma "Example / list row loading": shapes resized to the real row, in an aria-busy region.
export const ListRowLoading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div role="region" aria-label="Customers" aria-busy="true" className="flex w-[328px] items-center gap-4 p-4">
      <span className="sr-only">Loading…</span>
      <Skeleton shape="circle" className="shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="w-full" />
        <Skeleton className="w-40" />
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole('region', { name: 'Customers' });
    await expect(region).toHaveAttribute('aria-busy', 'true');
    await expect(size(region)).toEqual([328, 72]);
    const [, line1, line2] = Array.from(canvasElement.querySelectorAll('[data-slot="skeleton"]'));
    await expect(size(line1)).toEqual([240, 16]);
    await expect(size(line2)).toEqual([160, 16]);
    // Keyboard: nothing in a skeleton takes focus.
    await userEvent.tab();
    await expect(region.contains(document.activeElement)).toBe(false);
  },
};

// Stress test: narrow (50%) text, shapes in a column narrower than their default width.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex items-start gap-8">
      <Skeleton className="w-30" data-testid="narrow" />
      <div className="w-[100px]" data-testid="column">
        <Skeleton />
        <Skeleton shape="block" className="mt-2" />
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(size(canvas.getByTestId('narrow'))).toEqual([120, 16]);
    // A shape never overflows its column (max-w-full).
    const column = canvas.getByTestId('column');
    await expect(column.scrollWidth).toBeLessThanOrEqual(column.clientWidth);
    const shapes = column.querySelectorAll('[data-slot="skeleton"]');
    for (const s of Array.from(shapes)) await expect(Math.round(s.getBoundingClientRect().width)).toBe(100);
    await expect(canvasElement.querySelectorAll('[data-slot="skeleton"]').length).toBe(3);
  },
};

// Theme copies check the sizes only: Corporate Light has its own radius scale.
const themed: Story = {
  render: Shapes.render,
  play: async ({ canvasElement }) => {
    const [text, circle, block] = Array.from(canvasElement.querySelectorAll('[data-slot="skeleton"]'));
    await expect(size(text)).toEqual([240, 16]);
    await expect(size(circle)).toEqual([40, 40]);
    await expect(size(block)).toEqual([320, 120]);
  },
};
export const ShapesDark: Story = { ...themed, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ShapesCorporate: Story = { ...themed, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
