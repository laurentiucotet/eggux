import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { AiLoading } from './ai-loading';

const meta = {
  title: 'AI Chat/AI Loading',
  component: AiLoading,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Placeholder while AI writes in place: what it does now, shimmer lines in the shape of the result, step and time left, Stop. Status updates per step in a polite live region; under 1 second show nothing. Figma: AI Chat / AI Loading. Guide: eggux build-ui/patterns/ai-chat.md, loading-states.md' } },
  },
  args: { onStop: fn() },
  decorators: [Story => <div className="w-[560px] max-w-full"><Story /></div>],
} satisfies Meta<typeof AiLoading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const region = canvas.getByRole('region', { name: 'AI is writing' });
    await expect(region).toHaveAttribute('aria-busy', 'true');
    // Figma: 560 × 152.
    await expect(Math.round(region.getBoundingClientRect().height)).toBe(152);
    await expect(canvas.getByRole('status')).toHaveTextContent('Reading 12 invoices…');
    // Lines at 100, 92 and 60% of the content width, 10 px high.
    const lines = Array.from(canvasElement.querySelectorAll('[data-slot="ai-loading-lines"] > span')) as HTMLElement[];
    const full = lines[0].getBoundingClientRect().width;
    await expect(Math.round(lines[0].getBoundingClientRect().height)).toBe(10);
    await expect(Math.round((lines[1].getBoundingClientRect().width / full) * 100)).toBe(92);
    await expect(Math.round((lines[2].getBoundingClientRect().width / full) * 100)).toBe(60);
    await userEvent.click(canvas.getByRole('button', { name: 'Stop' }));
    await expect(args.onStop).toHaveBeenCalledTimes(1);
  },
};

// Show progress off and Show stop off.
export const Minimal: Story = {
  args: { showProgress: false, showStop: false, status: 'Summarizing the invoice…' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-slot="ai-loading-progress"]')).toBeNull();
  },
};

// Keyboard: Tab reaches Stop; Escape stops from inside the region.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Stop' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onStop).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Enter}');
    await expect(args.onStop).toHaveBeenCalledTimes(2);
  },
};

// Stress test: 240 px minimum width; status and progress stay on one line with ellipsis.
export const NarrowLongText: Story = { tags: ['!dev'],
  args: {
    status: 'Reading 1,204 invoices from Acme Industrial Supplies GmbH and its EU subsidiaries…',
    progress: 'Step 2 of 3 · about 4 minutes left · waiting for the payments service',
  },
  decorators: [Story => <div className="w-[240px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth);
    const status = canvas.getByRole('status');
    await expect(Math.round(status.getBoundingClientRect().height)).toBe(20);
    await expect(status.scrollWidth).toBeGreaterThan(status.clientWidth);
    const progress = canvasElement.querySelector('[data-slot="ai-loading-progress"]') as HTMLElement;
    await expect(Math.round(progress.getBoundingClientRect().height)).toBe(16);
    await expect(Math.round(canvas.getByRole('button', { name: 'Stop' }).getBoundingClientRect().height)).toBe(32);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
