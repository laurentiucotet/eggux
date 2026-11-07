import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ProgressRing } from './progress-ring';

const meta = {
  title: 'Components/Progress/Progress Ring',
  component: ProgressRing,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Circular progress for compact places: uploads in a list, profile or setup completion, a quota in a card. sm (32) has no label, so put the number next to it; default (48) and lg (80) show the percent inside. Known progress only; unknown duration uses Spinner. Figma: Progress page / Progress Ring. Guide: eggux build-ui/components/progress-and-slider.md' } },
  },
  args: { value: 50, 'aria-label': 'Profile completion' },
} satisfies Meta<typeof ProgressRing>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Size=default, Value=50: 48, ring 4.8 thick, "50%" inside, progressbar with value 50.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const ring = canvas.getByRole('progressbar', { name: 'Profile completion' });
    await expect(ring).toHaveAttribute('aria-valuenow', '50');
    await expect(Math.round(box(ring).width)).toBe(48);
    await expect(canvasElement.querySelector('circle')).toHaveAttribute('stroke-width', '4.8');
    await expect(ring).toHaveTextContent('50%');
  },
};

// Sizes: sm 32 without label (number next to it), default 48, lg 80 with the h4 label; 0 and 100.
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <ProgressRing size="sm" value={25} aria-labelledby="sm-label" />
        <span id="sm-label" className="text-sm">Upload 25%</span>
      </div>
      <ProgressRing value={0} aria-label="Not started" />
      <ProgressRing value={75} aria-label="Setup" />
      <ProgressRing size="lg" value={100} aria-label="Storage used" />
    </div>
  ),
  play: async ({ canvas }) => {
    const sm = canvas.getByRole('progressbar', { name: 'Upload 25%' });
    await expect(Math.round(box(sm).width)).toBe(32);
    await expect(sm).toHaveTextContent('');
    const lg = canvas.getByRole('progressbar', { name: 'Storage used' });
    await expect(Math.round(box(lg).width)).toBe(80);
    await expect(Math.round(box(lg.querySelector('span')!).height)).toBe(28);
    await expect(canvas.getByRole('progressbar', { name: 'Not started' }).querySelector('[data-slot="progress-ring-indicator"]')).toBeNull();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: Sizes.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Sizes.render };
