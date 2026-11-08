import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ProgressSegmented } from './progress-segmented';

const meta = {
  title: 'Components/Progress/Progress Segment',
  component: ProgressSegmented,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Progress Type=segmented: one Progress Segment per step for a count of steps (onboarding, setup checklists, a multi-step form on mobile). Complete segments take the Tone color, upcoming ones background/muted; the text next to it says the count too. A share of work uses the continuous Progress. Figma: Progress page / Progress (Type=segmented), Progress Segment. Guide: eggux build-ui/components/progress-and-slider.md' } },
  },
  args: { steps: 4, value: 2, 'aria-label': 'Setup' },
  render: args => <div className="w-[320px]"><ProgressSegmented {...args} /></div>,
} satisfies Meta<typeof ProgressSegmented>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Value=50: 320 × 8, 4 segments 4 apart, 2 complete; progressbar "2 of 4 steps".
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Setup' });
    await expect(bar).toHaveAttribute('aria-valuetext', '2 of 4 steps');
    const segs = canvasElement.querySelectorAll('[data-slot="progress-segment"]');
    await expect(segs).toHaveLength(4);
    await expect(Math.round(box(segs[0]!).height)).toBe(8);
    await expect(Math.round(box(segs[1]!).left - box(segs[0]!).right)).toBe(4);
    await expect(segs[2]).toHaveAttribute('data-state', 'upcoming');
  },
};

// Tones: success when all done, warning, error.
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[320px] flex-col gap-4">
      <ProgressSegmented aria-label="Onboarding" steps={5} value={5} tone="success" />
      <ProgressSegmented aria-label="Quota" steps={5} value={4} tone="warning" />
      <ProgressSegmented aria-label="Import" steps={5} value={2} tone="error" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Onboarding' })).toHaveAttribute('aria-valuenow', '5');
  },
};

// Stress: 12 steps at 160 still fit; out-of-range values clamp. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex w-[160px] flex-col gap-4">
      <ProgressSegmented aria-label="Long" steps={12} value={7} />
      <ProgressSegmented aria-label="Over" steps={3} value={9} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const long = canvas.getByRole('progressbar', { name: 'Long' });
    await expect(Math.round(box(long).width)).toBe(160);
    await expect(canvas.getByRole('progressbar', { name: 'Over' })).toHaveAttribute('aria-valuenow', '3');
    await expect(canvasElement.querySelectorAll('[data-slot="progress-segment"]')).toHaveLength(15);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
