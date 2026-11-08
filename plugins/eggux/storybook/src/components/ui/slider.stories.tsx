import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Slider } from './slider';

const meta = {
  title: 'Components/Slider/Slider',
  component: Slider,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Pick a value (single) or a range on a scale where the exact number matters less: price range filters, distance, radius, volume. Always show the value and unit next to the label; Show value adds a bubble over each thumb, Show marks adds min, mid and max labels. Step matches the data; range thumbs cannot cross; pair with an Input when exact values matter. Figma: Slider page / Slider. Guide: eggux build-ui/components/progress-and-slider.md' } },
  },
  args: { defaultValue: [50], thumbLabels: ['Volume'] },
  render: args => <div className="w-[320px]"><Slider {...args} /></div>,
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Type=single, Value=50: 320 × 16, 6 px track, 16 thumb in the middle; arrows step, Page Up jumps 10.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const thumb = canvas.getByRole('slider', { name: 'Volume' });
    await expect(thumb).toHaveAttribute('aria-valuenow', '50');
    const root = canvasElement.querySelector('[data-slot="slider"]')!;
    await expect(Math.round(box(root).height)).toBe(16);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="slider-track"]')!).height)).toBe(6);
    await expect(Math.round(box(thumb).width)).toBe(16);
    await expect(Math.round(box(thumb).left + 8)).toBe(Math.round(box(root).left + 160));
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '51');
    await userEvent.keyboard('{PageUp}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '61');
  },
};

// Price range with value bubbles and marks; thumbs named, value text with the unit.
export const PriceRange: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [v, setV] = React.useState([150, 450]);
    return (
      <div className="flex w-[320px] flex-col gap-2 pt-10">
        <div className="flex justify-between text-sm">
          <span id="price-label" className="font-medium">Price</span>
          <span className="text-muted-foreground">€{v[0]} – €{v[1]}</span>
        </div>
        <Slider value={v} onValueChange={setV} min={0} max={600} step={5} minStepsBetweenThumbs={1} thumbLabels={['Minimum price', 'Maximum price']} formatValue={n => `€${n}`} showValue marks={['€0', '€300', '€600']} />
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const minThumb = canvas.getByRole('slider', { name: 'Minimum price' });
    await expect(minThumb).toHaveAttribute('aria-valuetext', '€150');
    const bubble = canvasElement.querySelector('[data-slot="slider-value"]')!;
    await expect(Math.abs(box(minThumb).top - box(bubble).bottom - 4)).toBeLessThanOrEqual(1);
    const marks = canvasElement.querySelector('[data-slot="slider-marks"]')!;
    await expect(Math.round(box(marks).top - box(canvasElement.querySelector('[data-slot="slider"]')!).bottom)).toBe(8);
    minThumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByText('€155 – €450')).toBeInTheDocument();
  },
};

// Figma State=disabled: 50% and not focusable by drag.
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('slider', { name: 'Volume' })).toHaveAttribute('data-disabled');
  },
};

// Stress: long mark labels anchored to the ends at 276; values clamp at the ends. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="w-[276px] py-10">
      <Slider defaultValue={[100]} thumbLabels={['Budget']} formatValue={n => `€${n},000`} showValue marks={['€1,234,567', '€1,234,567', '€1,234,567']} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('slider', { name: 'Budget' })).toHaveAttribute('aria-valuenow', '100');
    const marks = canvasElement.querySelector('[data-slot="slider-marks"]')!;
    const [first, , last] = marks.querySelectorAll('span');
    await expect(Math.round(box(first!).left)).toBe(Math.round(box(marks).left));
    await expect(Math.round(box(last!).right)).toBe(Math.round(box(marks).right));
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: PriceRange.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: PriceRange.render };
