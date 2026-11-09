import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { BackgroundJob } from './background-job';

const meta = {
  title: 'Components/Progress/Background Job',
  component: BackgroundJob,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A task that runs in the background (export, import, bulk send, report): name, progress with count and time left, Cancel; done offers the result (Download); failed says where it stopped and offers Retry. Stacked in a panel or a corner while people keep working; send a notification when it ends if they left the page. Figma: Progress page / Background Job. Guide: eggux build-ui/patterns/loading-states.md' } },
  },
  args: { title: 'Export invoices (CSV)', value: 50, status: '640 of 1,284 · about 1 min left', onCancel: fn(), onDownload: fn(), onRetry: fn() },
  render: args => <div className="w-[400px]"><BackgroundJob {...args} /></div>,
} satisfies Meta<typeof BackgroundJob>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma State=running: 400 × 82, 32 tile, progress 8, Cancel named after the job.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const job = canvas.getByRole('status');
    await expect(Math.round(box(job).height)).toBe(82);
    await expect(canvas.getByRole('progressbar', { name: 'Export invoices (CSV)' })).toHaveAttribute('aria-valuenow', '50');
    await expect(Math.round(box(canvasElement.querySelector('[aria-hidden="true"].size-8')!).width)).toBe(32);
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel Export invoices (CSV)' }));
    await expect(args.onCancel).toHaveBeenCalled();
  },
};

// Figma State=done and error: 68 high, Download and Retry, the error in destructive.
export const DoneAndError: Story = {
  render: args => (
    <div className="flex w-[400px] flex-col gap-3">
      <BackgroundJob {...args} state="done" status="1,284 invoices · 2.4 MB · Ready" />
      <BackgroundJob {...args} state="error" status="Stopped at 640 of 1,284. Connection lost." />
    </div>
  ),
  play: async ({ canvas, args }) => {
    const [done, error] = canvas.getAllByRole('status');
    await expect(Math.round(box(done!).height)).toBe(68);
    await expect(Math.round(box(error!).height)).toBe(68);
    await userEvent.click(canvas.getByRole('button', { name: 'Download' }));
    await expect(args.onDownload).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(args.onRetry).toHaveBeenCalled();
  },
};

// Stress: a long job name wraps at 276; the button keeps its size. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: { title: 'Export invoices, credit notes and payment receipts for all customers (CSV)' },
  render: args => <div className="w-[276px]"><BackgroundJob {...args} state="done" status="Ready" /></div>,
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: 'Download' });
    await expect(Math.round(box(btn).height)).toBe(32);
    await expect(box(canvas.getByRole('status')).height).toBeGreaterThan(68);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: DoneAndError.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: DoneAndError.render };
