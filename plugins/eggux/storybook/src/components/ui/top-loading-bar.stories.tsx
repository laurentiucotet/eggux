import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TopLoadingBar } from './top-loading-bar';

const meta = {
  title: 'Components/Progress/Top Loading Bar',
  component: TopLoadingBar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A thin 2 px bar along the top edge of the page or a region while a route, page change or in-place AI generation loads. Indeterminate by default (a 40% segment slides across); a value for uploads or reading progress, with the track for reading progress. Put it at the very top and remove it when the load ends; never for loads under about 300 ms. Figma: Progress page / Top Loading Bar. Guide: eggux build-ui/components/progress-and-slider.md' } },
  },
  args: { label: 'Loading invoices' },
  render: args => (
    <div className="w-[720px] overflow-hidden rounded-lg border border-border bg-background">
      <TopLoadingBar {...args} />
      <p className="m-0 p-6 text-sm">Invoices</p>
    </div>
  ),
} satisfies Meta<typeof TopLoadingBar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Value=indeterminate: 2 high, no track, a 40% segment, no aria-valuenow.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Loading invoices' });
    await expect(Math.round(box(bar).height)).toBe(2);
    await expect(bar).not.toHaveAttribute('aria-valuenow');
    const ind = canvasElement.querySelector('[data-slot="top-loading-bar-indicator"]')!;
    await expect(Math.round(box(ind).width)).toBe(Math.round(box(bar).width * 0.4));
  },
};

// Figma Value=30 / 60 / 90 with Show track (reading progress).
export const Determinate: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[720px] flex-col gap-6">
      <TopLoadingBar value={30} label="Uploading" />
      <TopLoadingBar value={60} track label="Reading progress" />
      <TopLoadingBar value={90} label="Almost done" />
    </div>
  ),
  play: async ({ canvas }) => {
    const reading = canvas.getByRole('progressbar', { name: 'Reading progress' });
    await expect(reading).toHaveAttribute('aria-valuenow', '60');
    await expect(getComputedStyle(reading).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    const ind = reading.querySelector('[data-slot="top-loading-bar-indicator"]')!;
    await expect(Math.round(box(ind).width)).toBe(432);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Determinate.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Determinate.render };
