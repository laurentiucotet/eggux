import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { AspectRatio, type AspectRatioFit, type AspectRatioValue } from './aspect-ratio';

type Args = { ratio: AspectRatioValue; fit: AspectRatioFit; rounded: boolean; width: number };

// A 3:2 picture with a frame and a circle, so cropping and letterboxing are easy to see.
const picture =
  'data:image/svg+xml,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'><rect width='300' height='200' fill='lightgray'/><circle cx='150' cy='100' r='70' fill='gray'/><rect x='4' y='4' width='292' height='192' fill='none' stroke='dimgray' stroke-width='8'/></svg>",
  );

const ratios: AspectRatioValue[] = ['1:1', '4:3', '16:9', '21:9'];
const ratioNumber: Record<AspectRatioValue, number> = { '1:1': 1, '4:3': 4 / 3, '16:9': 16 / 9, '21:9': 21 / 9 };

const meta = {
  title: 'Components/Layout/Aspect Ratio',
  parameters: {
    docs: {
      description: {
        component:
          'A wrapper that keeps media at 1:1, 4:3, 16:9 or 21:9 at any width, so the page does not jump while an image loads. fit cover fills the box and crops; contain shows everything with space around. Works on img, video, picture, canvas and svg children. Code only (no Figma component yet); the Card media slot uses 16:9 the same way.',
      },
    },
  },
  args: { ratio: '16:9', fit: 'cover', rounded: true, width: 360 },
  argTypes: {
    ratio: { name: 'Ratio', control: 'inline-radio', options: ratios, description: 'Width to height.', table: { category: 'Box' } },
    fit: { name: 'Fit', control: 'inline-radio', options: ['cover', 'contain'], description: 'Fill and crop, or show all.', table: { category: 'Box' } },
    rounded: { name: 'Rounded', control: 'boolean', description: 'Rounded corners that clip the media.', table: { category: 'Box' } },
    width: { name: 'Width', control: { type: 'range', min: 200, max: 640, step: 8 }, description: 'Width of the parent in px; the height follows.', table: { category: 'Box' } },
  },
  render: ({ ratio, fit, rounded, width }) => (
    <div style={{ width }} className="max-w-full">
      <AspectRatio ratio={ratio} fit={fit} rounded={rounded}>
        <img src={picture} alt="Warehouse floor plan, light grey with a round marker" />
      </AspectRatio>
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const img = canvas.getByRole('img');
    const box = img.parentElement!;
    const r = box.getBoundingClientRect();
    await expect(Math.abs(r.width / r.height - 16 / 9)).toBeLessThan(0.02);
    await expect(r.width).toBe(360);
    await expect(getComputedStyle(img).objectFit).toBe('cover');
    await expect(img.getBoundingClientRect().width).toBeCloseTo(r.width, 0);
    await expect(img.getBoundingClientRect().height).toBeCloseTo(r.height, 0);
    await expect(box).toHaveAttribute('data-ratio', '16:9');
  },
};

/** All four ratios at one width. */
export const Ratios: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="grid w-[560px] max-w-full grid-cols-2 gap-4"><Story /></div>],
  render: () => (
    <>
      {ratios.map(r => (
        <figure key={r} className="m-0 flex min-w-0 flex-col gap-1">
          <AspectRatio ratio={r}>
            <img src={picture} alt={`Floor plan at ${r}`} />
          </AspectRatio>
          <figcaption className="text-xs text-muted-foreground">{r}</figcaption>
        </figure>
      ))}
    </>
  ),
};

/** Cover crops to fill; contain shows the whole picture. */
export const Fits: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="grid w-[560px] max-w-full grid-cols-2 gap-4"><Story /></div>],
  render: () => (
    <>
      {(['cover', 'contain'] as const).map(f => (
        <figure key={f} className="m-0 flex min-w-0 flex-col gap-1">
          <AspectRatio ratio="1:1" fit={f}>
            <img src={picture} alt={`Floor plan, fit ${f}`} />
          </AspectRatio>
          <figcaption className="text-xs text-muted-foreground">{f}</figcaption>
        </figure>
      ))}
    </>
  ),
};

/* Hidden checks */

export const RatiosCheck: Story = {
  ...Ratios,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    for (const r of ratios) {
      const box = canvas.getByRole('img', { name: `Floor plan at ${r}` }).parentElement!;
      const rect = box.getBoundingClientRect();
      await expect(Math.abs(rect.width / rect.height - ratioNumber[r])).toBeLessThan(0.02);
    }
  },
};

export const FitsCheck: Story = {
  ...Fits,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const contain = canvas.getByRole('img', { name: 'Floor plan, fit contain' });
    await expect(getComputedStyle(contain).objectFit).toBe('contain');
    await expect(getComputedStyle(canvas.getByRole('img', { name: 'Floor plan, fit cover' })).objectFit).toBe('cover');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  args: { ratio: '21:9', width: 640 },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const box = canvas.getByRole('img').parentElement!;
    // A 640 px wish in a 276 px column: shrinks, keeps the ratio.
    await expect(box.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    const r = box.getBoundingClientRect();
    await expect(Math.abs(r.width / r.height - 21 / 9)).toBeLessThan(0.05);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
