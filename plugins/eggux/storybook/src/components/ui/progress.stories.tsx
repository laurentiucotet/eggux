import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Progress } from './progress';

const meta = {
  title: 'Components/Card/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Progress bar for work with a known share. Size sm 4, default 8, lg 12; Tone default, success, warning, error (the text next to it says it too); Show label adds a label row above. Continuous only: segmented and indeterminate are not built. Built for Progress Card. Figma: Progress (Progress page). Guide: eggux build-ui/components/progress-and-slider.md' } },
  },
  args: { value: 50, 'aria-label': 'Uploading invoices.csv' },
  decorators: [Story => <div className="w-80 max-w-full"><Story /></div>],
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

export const Default: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Uploading invoices.csv' });
    await expect(bar).toHaveAttribute('aria-valuenow', '50');
    await expect(Math.round(box(bar).height)).toBe(8);
    const indicator = bar.querySelector('[data-slot="progress-indicator"]') as HTMLElement;
    await expect(Math.round(box(indicator).right - box(bar).left)).toBe(160);
    await expect(getComputedStyle(indicator).borderTopLeftRadius).not.toBe('0px');
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'default', 'lg'] as const).map(s => <Progress key={s} size={s} value={40} aria-label={`${s} bar`} />)}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(Math.round(box(canvas.getByRole('progressbar', { name: 'sm bar' })).height)).toBe(4);
    await expect(Math.round(box(canvas.getByRole('progressbar', { name: 'lg bar' })).height)).toBe(12);
  },
};

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['default', 'success', 'warning', 'error'] as const).map(t => <Progress key={t} tone={t} value={60} aria-label={`${t} tone`} />)}
    </div>
  ),
  play: async ({ canvas }) => {
    const probe = document.createElement('span');
    const bg = (cls: string) => { probe.className = cls; document.body.append(probe); const c = getComputedStyle(probe).backgroundColor; probe.remove(); return c; };
    const color = (name: string) => getComputedStyle(canvas.getByRole('progressbar', { name }).querySelector('[data-slot="progress-indicator"]')!).backgroundColor;
    await expect(color('default tone')).toBe(bg('bg-primary'));
    await expect(color('success tone')).toBe(bg('bg-success'));
    await expect(color('warning tone')).toBe(bg('bg-warning'));
    await expect(color('error tone')).toBe(bg('bg-destructive'));
  },
};

// Show label: the name comes from the label; the value text sits on the right.
export const WithLabel: Story = {
  args: { label: 'Uploading invoices.csv', value: 40, 'aria-label': undefined },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Uploading invoices.csv' });
    await expect(bar).toHaveAttribute('aria-valuenow', '40');
    await expect(canvas.getByText('40%')).toBeVisible();
  },
};

export const LongLabel: Story = { tags: ['!dev'],
  args: { label: 'Uploading quarterly-intercompany-reconciliation-final-v2-reviewed.csv', value: 70, valueText: '3 of 5', 'aria-label': undefined },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const label = canvas.getByText(/Uploading quarterly/);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await expect(canvas.getByText('3 of 5')).toBeVisible();
  },
};

export const TonesDark: Story = { ...Tones, tags: ['!dev'], globals: { theme: 'Dark' } };
export const TonesCorporate: Story = { ...Tones, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
