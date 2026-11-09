import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Sparkles } from '@/components/icons';
import { IconTile } from './icon-tile';

const meta = {
  title: 'Components/Card/Icon Tile',
  component: IconTile,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A rounded square holding one icon. Style neutral, brand, gradient, outline; Size sm 32, default 40, lg 48. Decorative (aria-hidden); one Style per grid. Built for Stat Card and Callout Card. Figma: Icon Tile (used on the Card page). Guide: eggux build-ui/components/card.md' } },
  },
  args: { icon: <Sparkles /> },
} satisfies Meta<typeof IconTile>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: Element) => Math.round(el.getBoundingClientRect().width);

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector('[data-slot="icon-tile"]') as HTMLElement;
    await expect(size(tile)).toBe(40);
    await expect(size(tile.querySelector('svg')!)).toBe(20);
    await expect(tile).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Styles: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-4">
      {(['neutral', 'brand', 'gradient', 'outline'] as const).map(s => <IconTile key={s} tileStyle={s} icon={<Sparkles />} data-testid={s} />)}
    </div>
  ),
  play: async ({ canvas }) => {
    const probe = document.createElement('span');
    probe.className = 'bg-muted';
    document.body.append(probe);
    await expect(getComputedStyle(canvas.getByTestId('neutral')).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    probe.className = 'bg-[var(--icon-tile-brand-bg)]';
    await expect(getComputedStyle(canvas.getByTestId('brand')).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    probe.remove();
    await expect(getComputedStyle(canvas.getByTestId('outline')).borderTopWidth).toBe('1px');
    await expect(getComputedStyle(canvas.getByTestId('gradient')).backgroundImage).toContain('gradient');
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4">
      {(['sm', 'default', 'lg'] as const).map(s => <IconTile key={s} size={s} icon={<Sparkles />} data-testid={s} />)}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(size(canvas.getByTestId('sm'))).toBe(32);
    await expect(size(canvas.getByTestId('lg'))).toBe(48);
    await expect(size(canvas.getByTestId('lg').querySelector('svg')!)).toBe(24);
  },
};

export const StylesDark: Story = { ...Styles, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StylesCorporate: Story = { ...Styles, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
