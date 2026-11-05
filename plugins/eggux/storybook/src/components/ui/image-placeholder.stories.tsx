import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ImagePlaceholder, type ImageRatio } from './image-placeholder';

const meta = {
  title: 'Components/Card/Image Placeholder',
  component: ImagePlaceholder,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Image area with a fixed Ratio; height follows width. Without a photo: muted dot pattern and a centered image icon. Images cover and crop, never stretch. Built for Card (Media=top), Option Card, Post Card and Event Card. Figma: Image Placeholder (used on the Card page). Guide: eggux build-ui/components/card.md' } },
  },
  decorators: [Story => <div className="w-80 max-w-full"><Story /></div>],
} satisfies Meta<typeof ImagePlaceholder>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="image-placeholder"]') as HTMLElement;
    await expect(Math.round(box(el).width)).toBe(320);
    await expect(Math.round(box(el).height)).toBe(180);
    await expect(el.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};

const ratios: [ImageRatio, number][] = [['16:9', 16 / 9], ['4:3', 4 / 3], ['1:1', 1], ['3:4', 3 / 4], ['21:9', 21 / 9], ['3:2', 3 / 2], ['2:3', 2 / 3], ['9:16', 9 / 16]];
export const Ratios: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {ratios.map(([r]) => <ImagePlaceholder key={r} ratio={r} aria-label={r} role="img" />)}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const [r, n] of ratios) {
      const b = box(canvas.getByRole('img', { name: r }));
      await expect(Math.abs(b.width / b.height - n)).toBeLessThan(0.02);
    }
  },
};

// A real photo covers and crops: the image fills the box.
const photo = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#888"/></svg>');
export const WithImage: Story = {
  args: { src: photo, alt: 'Acme office' },
  play: async ({ canvas }) => {
    const img = canvas.getByRole('img', { name: 'Acme office' });
    await expect(getComputedStyle(img).objectFit).toBe('cover');
    await expect(Math.round(box(img).height)).toBe(180);
  },
};

export const Loading: Story = {
  args: { state: 'loading' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('svg')).toBeNull();
  },
};

export const ErrorState: Story = {
  name: 'Error',
  args: { state: 'error' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Image unavailable')).toBeVisible();
  },
};

export const NoCaption: Story = {
  args: { showCaption: false },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('svg')).toBeNull();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
