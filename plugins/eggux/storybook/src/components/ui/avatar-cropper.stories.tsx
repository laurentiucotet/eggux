import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { AvatarCropper } from './avatar-cropper';

type Args = { zoom: number; applyLabel: string; width: number };

const meta = {
  title: 'Components/Media/Avatar Cropper',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Choose which part of a picture becomes the round avatar: a circular crop window, a Zoom slider and the buttons Reset and Apply. Drag the picture, or focus the stage and use the arrow keys (2 %, Shift 10 %) and + and - to zoom. The picture never leaves the window. Apply returns { zoom, x, y }. Code only (no Figma component yet).',
      },
    },
  },
  args: { zoom: 1.5, applyLabel: 'Apply', width: 320 },
  argTypes: {
    zoom: { name: 'Start zoom', control: { type: 'range', min: 1, max: 3, step: 0.1 }, description: 'Zoom when the cropper opens (1 = 100 %).', table: { category: 'Cropper' } },
    applyLabel: { name: 'Apply label', control: 'text', description: 'Text of the main button.', table: { category: 'Cropper' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 480, step: 4 }, description: 'Width of the column in px.', table: { category: 'Cropper' } },
  },
  render: ({ zoom, applyLabel, width }) => (
    <div style={{ width }} className="max-w-full">
      <AvatarCropper key={zoom} defaultCrop={{ zoom }} applyLabel={applyLabel} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const onApply = fn();
const onCropChange = fn();

const stageOf = (canvas: { getByRole: (r: string, o: { name: string }) => HTMLElement }) => canvas.getByRole('group', { name: 'Crop your avatar' });

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[320px] max-w-full">
      <AvatarCropper onApply={onApply} onCropChange={onCropChange} />
    </div>
  ),
  play: async ({ canvas }) => {
    const stage = stageOf(canvas);
    await expect(stage).toHaveAttribute('data-zoom', '1.00');
    // At 100 % the picture is only a little larger than the window, so it moves just a bit.
    stage.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(Number(stage.dataset.x)).toBeGreaterThan(0));
    // Zoom with + and with the slider.
    await userEvent.keyboard('++');
    await waitFor(() => expect(stage).toHaveAttribute('data-zoom', '1.20'));
    const zoom = canvas.getByRole('slider', { name: 'Zoom' });
    zoom.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(zoom).toHaveAttribute('aria-valuetext', '125%'));
    // With room to move, Shift + arrow moves 10 %.
    stage.focus();
    await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}');
    await waitFor(() => expect(Number(stage.dataset.y)).toBeGreaterThan(0));
    // The picture can never leave the window: x and y stay within (zoom - 0.8) / 2.
    for (let i = 0; i < 20; i++) await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(Number(stage.dataset.x)).toBeCloseTo(-(1.25 - 0.8) / 2, 2));
    // Apply returns the numbers.
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ zoom: 1.25 }));
    // Reset goes back to 100 % centered.
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await waitFor(() => expect(stage).toHaveAttribute('data-zoom', '1.00'));
    await expect(stage).toHaveAttribute('data-x', '0.000');
    await expect(stage).toHaveAttribute('data-y', '0.000');
  },
};

export const DragCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[320px] max-w-full">
      <AvatarCropper defaultCrop={{ zoom: 2 }} />
    </div>
  ),
  play: async ({ canvas }) => {
    const stage = stageOf(canvas);
    const box = stage.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: stage, coords: { clientX: cx, clientY: cy } },
      { target: stage, coords: { clientX: cx + box.width * 0.1, clientY: cy + box.width * 0.05 } },
      { keys: '[/MouseLeft]', target: stage, coords: { clientX: cx + box.width * 0.1, clientY: cy + box.width * 0.05 } },
    ]);
    await waitFor(() => expect(Number(stage.dataset.x)).toBeCloseTo(0.1, 2));
    await expect(Number(stage.dataset.y)).toBeCloseTo(0.05, 2);
    // A big drag stops at the limit (2 / 2 - 0.4 = 0.6).
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: stage, coords: { clientX: cx, clientY: cy } },
      { target: stage, coords: { clientX: cx + box.width * 3, clientY: cy } },
      { keys: '[/MouseLeft]', target: stage, coords: { clientX: cx + box.width * 3, clientY: cy } },
    ]);
    await waitFor(() => expect(Number(stage.dataset.x)).toBeCloseTo(0.6, 2));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <AvatarCropper label="Crop your avatar" applyLabel="Apply and continue to the next step" />,
  play: async ({ canvas }) => {
    const stage = stageOf(canvas);
    const root = stage.parentElement!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    await expect(stage.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(canvas.getByRole('button', { name: 'Reset' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
