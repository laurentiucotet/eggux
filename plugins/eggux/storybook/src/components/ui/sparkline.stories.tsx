import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Sparkline } from './sparkline';

const meta = {
  title: 'Components/Card/Sparkline',
  component: Sparkline,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Trend without axes, 12 points, 120 x 32 (48 high in the horizontal Stat Card). Decorative: the delta text next to it carries the meaning. Built for Stat Card. Figma: Sparkline (used on the Card page). Guide: eggux build-ui/components/card.md' } },
  },
} satisfies Meta<typeof Sparkline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg') as SVGElement;
    await expect(Math.round(svg.getBoundingClientRect().width)).toBe(120);
    await expect(Math.round(svg.getBoundingClientRect().height)).toBe(32);
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg.querySelector('polyline')!.getAttribute('points')!.split(' ')).toHaveLength(12);
  },
};

export const Trends: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-6">
      {(['up', 'down', 'neutral'] as const).map(t => <Sparkline key={t} trend={t} />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('svg')).toHaveLength(3);
  },
};

export const Tall: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Sparkline className="h-12" />,
  play: async ({ canvasElement }) => {
    await expect(Math.round(canvasElement.querySelector('svg')!.getBoundingClientRect().height)).toBe(48);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
