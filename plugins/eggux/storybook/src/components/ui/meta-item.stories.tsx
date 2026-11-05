import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Clock, Globe } from '@/components/icons';
import { MetaItem } from './meta-item';

const meta = {
  title: 'Components/Card/Meta Item',
  component: MetaItem,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One fact with an icon: 16 px icon, body/small muted text, 6 gap; the text truncates past 280 px; the icon is decorative. Lines up in a column (gap 8). Built for Event Card and Location Card. Figma: Meta Item (used on the Card page). Guide: eggux build-ui/components/card.md' } },
  },
  args: { icon: <Clock />, children: '15:00-16:00 CET' },
} satisfies Meta<typeof MetaItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const row = canvas.getByText('15:00-16:00 CET').closest('[data-slot="meta-item"]') as HTMLElement;
    await expect(Math.round(row.getBoundingClientRect().height)).toBe(20);
    const svg = canvasElement.querySelector('svg') as SVGElement;
    await expect(Math.round(svg.getBoundingClientRect().width)).toBe(16);
    await expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
    await expect(getComputedStyle(row).fontSize).toBe('14px');
  },
};

export const Stack: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <MetaItem icon={<Clock />}>15:00-16:00 CET</MetaItem>
      <MetaItem icon={<Globe />}>Online</MetaItem>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Online')).toBeVisible();
  },
};

export const LongText: Story = { tags: ['!dev'],
  render: () => (
    <div className="w-[276px]">
      <MetaItem icon={<Globe />}>Friedrichstraße 68, 10117 Berlin, Germany, third floor, Acme Training Room</MetaItem>
    </div>
  ),
  play: async ({ canvas }) => {
    const text = canvas.getByText(/Friedrichstraße/);
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
    await expect(Math.round(text.getBoundingClientRect().height)).toBe(20);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
