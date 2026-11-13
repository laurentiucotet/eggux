import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { ImageCompare } from './image-compare';
import type { ImageRatio } from './image-placeholder';

type Args = { position: number; ratio: ImageRatio; showLabels: boolean; width: number };

const meta = {
  title: 'Components/Media/Image Compare',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Before and after in one frame with a divider. Drag anywhere on the frame; the keyboard path is a native range input (arrows 1 %, Page Up and Down 10 %, Home and End to the ends) whose value text says how much of each side shows. Both sides are slots, so any image fits. Code only (no Figma component yet).',
      },
    },
  },
  args: { position: 50, ratio: '16:9', showLabels: true, width: 520 },
  argTypes: {
    position: { name: 'Position', control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Where the divider starts, in percent from the left.', table: { category: 'Compare' } },
    ratio: { name: 'Ratio', control: 'select', options: ['16:9', '4:3', '1:1', '3:2', '21:9'], description: 'Shape of the frame.', table: { category: 'Compare' } },
    showLabels: { name: 'Show labels', control: 'boolean', description: 'The Before and After badges in the corners.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 720, step: 4 }, description: 'Width of the column in px.', table: { category: 'Compare' } },
  },
  render: ({ position, width, ...rest }) => (
    <div style={{ width }} className="max-w-full">
      <ImageCompare key={position} label="Kitchen before and after" defaultPosition={position} {...rest} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const onPositionChange = fn();

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[520px] max-w-full">
      <ImageCompare label="Kitchen before and after" onPositionChange={onPositionChange} />
    </div>
  ),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider', { name: 'Kitchen before and after' });
    await expect(slider).toHaveValue('50');
    await expect(slider).toHaveAttribute('aria-valuetext', '50% Before, 50% After');
    slider.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(slider).toHaveValue('52'));
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(slider).toHaveValue('0'));
    await expect(slider).toHaveAttribute('aria-valuetext', '0% Before, 100% After');
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(slider).toHaveValue('100'));
    await userEvent.keyboard('{PageDown}');
    await waitFor(() => expect(slider).toHaveValue('90'));
    await expect(onPositionChange).toHaveBeenCalledWith(90);
    const before = slider.parentElement!.querySelector<HTMLElement>('[data-slot="image-compare-before"]')!;
    await expect(before.style.clipPath).toContain('10%');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ImageCompare label="A pair with long side names" beforeLabel="Before the renovation of the kitchen" afterLabel="After the renovation of the kitchen" ratio="1:1" />
  ),
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider');
    const frame = slider.parentElement!;
    await expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth + 1);
    await expect(frame.getBoundingClientRect().width).toBeLessThanOrEqual(276);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
