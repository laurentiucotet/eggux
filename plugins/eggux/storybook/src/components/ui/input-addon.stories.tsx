import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { AtSign } from '@/components/icons';
import { InputAddon } from './input-addon';

const meta = {
  title: 'Components/Input/Input Addon',
  component: InputAddon,
  parameters: {
    docs: { description: { component: 'Text or an icon attached to an Input Group: protocol, domain, unit, currency, @. Muted fill, divider toward the field; not editable and not part of the value. Use it through Input Group (`start="https://"`), or as a slot node when composing. Figma: Input page / Input Addon. Guide: eggux build-ui/components/input.md' } },
  },
  args: { children: 'https://', position: 'start' },
  // Standalone the addon fills its parent's height, like inside the 36 px group.
  decorators: [Story => <div className="flex h-[var(--control-height)] rounded-input border border-input overflow-hidden"><Story /></div>],
} satisfies Meta<typeof InputAddon>;
export default meta;
type Story = StoryObj<typeof meta>;

const px = (v: string) => Math.round(parseFloat(v));

// Figma Position=start: 36 high, 12 px sides, body/small, background/muted, 1 px divider on the right.
export const Default: Story = {
  play: async ({ canvas }) => {
    const addon = canvas.getByText('https://');
    const s = getComputedStyle(addon);
    await expect(Math.round(addon.getBoundingClientRect().height)).toBe(34);
    await expect([px(s.paddingLeft), px(s.paddingRight)]).toEqual([12, 12]);
    await expect([px(s.borderRightWidth), px(s.borderLeftWidth)]).toEqual([1, 0]);
    await expect(s.fontSize).toBe('14px');
    await expect(addon).toHaveAttribute('data-position', 'start');
  },
};

// Figma Position: start (divider right) and end (divider left); an icon works as the content too.
export const Positions: Story = {
  render: () => (
    <>
      <InputAddon position="start">https://</InputAddon>
      <InputAddon position="start"><AtSign aria-hidden="true" /><span className="sr-only">at</span></InputAddon>
      <span className="flex-1 px-3 text-sm leading-[34px]">acme</span>
      <InputAddon position="end">.com</InputAddon>
    </>
  ),
  play: async ({ canvasElement }) => {
    const [start, icon, end] = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-addon"]'));
    await expect(px(getComputedStyle(start).borderRightWidth)).toBe(1);
    await expect(px(getComputedStyle(end).borderLeftWidth)).toBe(1);
    await expect(px(getComputedStyle(end).borderRightWidth)).toBe(0);
    await expect(Math.round(icon.querySelector('svg')!.getBoundingClientRect().width)).toBe(16);
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
