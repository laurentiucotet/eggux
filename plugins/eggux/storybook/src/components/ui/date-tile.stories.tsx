import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DateTile } from './date-tile';

const meta = {
  title: 'Components/Card/Date Tile',
  component: DateTile,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'The date of an event as a tile: month over day. Size default 56 x 66, sm 44 x 58. A <time> that reads as a full date; month and day are aria-hidden. Past events keep the same tile. Part of Event Card. Figma: Card page / Date Tile. Guide: eggux build-ui/components/card.md' } },
  },
  args: { month: 'NOV', day: '12', dateTime: '2026-11-12', label: '12 November 2026' },
} satisfies Meta<typeof DateTile>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector('time') as HTMLElement;
    await expect(Math.round(box(tile).width)).toBe(56);
    await expect(Math.round(box(tile).height)).toBe(66);
    await expect(tile).toHaveAttribute('datetime', '2026-11-12');
    await expect(tile).toHaveTextContent('12 November 2026');
    await expect(getComputedStyle(tile).borderTopLeftRadius).toBe(getComputedStyle(Object.assign(document.body.appendChild(document.createElement('i')), { className: 'rounded-lg' })).borderTopLeftRadius);
  },
};

export const Small: Story = {
  args: { size: 'sm' },
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector('time') as HTMLElement;
    await expect(Math.round(box(tile).width)).toBe(44);
    await expect(Math.round(box(tile).height)).toBe(58);
  },
};

export const ReadsAsFullDate: Story = {
  play: async ({ canvasElement }) => {
    const visible = [...canvasElement.querySelectorAll('time [aria-hidden="true"]')].map(e => e.textContent);
    await expect(visible).toEqual(['NOV', '12']);
    await expect(canvasElement.querySelector('.sr-only')).toHaveTextContent('12 November 2026');
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, play: ReadsAsFullDate.play, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
